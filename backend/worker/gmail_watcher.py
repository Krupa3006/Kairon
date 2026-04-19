"""
Gmail inbox scanner.
Reads the user's inbox, classifies replies to applications,
and triggers the appropriate follow-up action.
"""
import json
import base64
from datetime import datetime, timedelta
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
import google.generativeai as genai
import structlog

from config import get_settings
from worker.supabase_client import get_client
from worker.notifier import send_telegram_alert

log = structlog.get_logger()
settings = get_settings()
genai.configure(api_key=settings.gemini_api_key)

CLASSIFY_PROMPT = """Classify this email as one of: interview_invite | rejection | silence | other.

Subject: {subject}
Body (first 500 chars):
{body}

Respond ONLY with valid JSON:
{{"type": "rejection", "confidence": 0.95, "recruiter_name": "Sarah", "company": "Acme Corp"}}"""


async def scan_inbox(user_id: str) -> dict:
    db = get_client()

    # Load Gmail tokens
    token_res = db.table("gmail_tokens").select("*").eq("user_id", user_id).single().execute()
    if not token_res.data:
        return {"error": "No Gmail token for user"}

    token_data = token_res.data.get("token_data", {})
    creds = Credentials(
        token=token_data.get("token"),
        refresh_token=token_data.get("refresh_token"),
        token_uri="https://oauth2.googleapis.com/token",
        client_id=token_data.get("client_id"),
        client_secret=token_data.get("client_secret"),
        scopes=token_data.get("scopes"),
    )

    service = build("gmail", "v1", credentials=creds)

    # Get unread messages from last 24h
    after = int((datetime.utcnow() - timedelta(hours=24)).timestamp())
    results = service.users().messages().list(
        userId="me",
        q=f"is:unread after:{after}",
        maxResults=50,
    ).execute()

    messages = results.get("messages", [])
    classified = []

    # Load all submitted applications for this user
    apps_res = (
        db.table("job_queue")
        .select("id, company, title, recruiter_email")
        .eq("user_id", user_id)
        .eq("status", "submitted")
        .execute()
    )
    apps = {a["company"].lower(): a for a in (apps_res.data or [])}

    for msg_meta in messages:
        msg = service.users().messages().get(
            userId="me", id=msg_meta["id"], format="full"
        ).execute()

        headers = {h["name"]: h["value"] for h in msg["payload"]["headers"]}
        subject = headers.get("Subject", "")
        sender = headers.get("From", "")

        # Extract body
        body = _extract_body(msg["payload"])

        # Classify with Gemini
        classification = await _classify_email(subject, body[:500])
        email_type = classification.get("type", "other")
        company = classification.get("company", "")

        if email_type in ("interview_invite", "rejection"):
            # Find matching application
            app = apps.get(company.lower())
            if app:
                await _handle_classified_email(
                    db=db,
                    service=service,
                    user_id=user_id,
                    app=app,
                    email_type=email_type,
                    msg_id=msg_meta["id"],
                    subject=subject,
                    body=body,
                    classification=classification,
                )
                classified.append({"type": email_type, "company": company})

        # Mark as read
        service.users().messages().modify(
            userId="me", id=msg_meta["id"],
            body={"removeLabelIds": ["UNREAD"]},
        ).execute()

    log.info("Inbox scan complete", user_id=user_id, classified=len(classified))
    return {"scanned": len(messages), "classified": classified}


async def _handle_classified_email(
    db, service, user_id, app, email_type, msg_id, subject, body, classification
):
    now = datetime.utcnow().isoformat()

    if email_type == "interview_invite":
        # Update application status
        db.table("job_queue").update({"status": "interview"}).eq("id", app["id"]).execute()

        # Send Telegram alert
        await send_telegram_alert(
            user_id,
            f"🎉 *Interview invite!* {app['company']} · {app['title']}\n"
            f"Check your email and prepare your answers!"
        )

        # Log follow-up
        db.table("followups").insert({
            "user_id": user_id,
            "application_id": app["id"],
            "type": "interview_alert",
            "sent_at": now,
        }).execute()

    elif email_type == "rejection":
        # Update status
        db.table("job_queue").update({"status": "rejected"}).eq("id", app["id"]).execute()

        # Send feedback request email
        await _send_feedback_request(service, app, classification)

        # Log
        db.table("followups").insert({
            "user_id": user_id,
            "application_id": app["id"],
            "type": "rejection_feedback",
            "sent_at": now,
        }).execute()

        await send_telegram_alert(
            user_id,
            f"📭 Rejection from {app['company']}. Feedback request sent automatically."
        )


async def _send_feedback_request(service, app, classification):
    """Send a gracious feedback request reply."""
    recruiter_name = classification.get("recruiter_name", "Hiring Team")
    model = genai.GenerativeModel("gemini-1.5-flash")
    prompt = f"""Write a short, gracious email reply to a rejection from {app['company']} for the role {app['title']}.
The email should:
1. Thank them sincerely
2. Ask ONE specific feedback question: "Is there one skill or experience area I could focus on to be stronger for future roles?"
3. Express genuine interest in the company for future roles
4. Be no more than 4 sentences total
5. Start with "Hi {recruiter_name},"
Return only the email body, no subject line."""

    response = model.generate_content(prompt)
    email_body = response.text.strip()

    # Send via Gmail API
    message = _create_email(
        to=app.get("recruiter_email", ""),
        subject=f"Re: Your application to {app['company']}",
        body=email_body,
    )
    if app.get("recruiter_email"):
        service.users().messages().send(userId="me", body=message).execute()
        log.info("Feedback request sent", company=app["company"])


async def _classify_email(subject: str, body: str) -> dict:
    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        prompt = CLASSIFY_PROMPT.format(subject=subject, body=body)
        resp = model.generate_content(prompt)
        text = resp.text.strip()
        if text.startswith("```"):
            text = text.split("```")[1]
            if text.startswith("json"):
                text = text[4:]
        return json.loads(text)
    except Exception as e:
        log.error("Email classification failed", error=str(e))
        return {"type": "other", "confidence": 0}


def _extract_body(payload: dict) -> str:
    """Recursively extract email body from Gmail payload."""
    if payload.get("body", {}).get("data"):
        return base64.urlsafe_b64decode(payload["body"]["data"]).decode("utf-8", errors="ignore")
    for part in payload.get("parts", []):
        result = _extract_body(part)
        if result:
            return result
    return ""


def _create_email(to: str, subject: str, body: str) -> dict:
    from email.mime.text import MIMEText
    msg = MIMEText(body)
    msg["to"] = to
    msg["subject"] = subject
    raw = base64.urlsafe_b64encode(msg.as_bytes()).decode()
    return {"raw": raw}
