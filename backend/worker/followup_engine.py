"""
Follow-up engine.
Scans for applications with no reply after 7 days and sends personalised follow-ups.
"""
from datetime import datetime
import base64
import structlog
import google.generativeai as genai
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials

from config import get_settings
from worker.supabase_client import get_client
from worker.notifier import send_telegram_alert

log = structlog.get_logger()
settings = get_settings()
genai.configure(api_key=settings.gemini_api_key)

FOLLOWUP_PROMPT = """Write a short, professional follow-up email for a job application.

Candidate: {name}
Role: {title}
Company: {company}
One key value point from their CV: {value_point}

Rules:
- Max 3 sentences
- Express continued strong interest
- Add the value point naturally
- End with a soft CTA (happy to share more, available for a call)
- Do NOT be pushy or mention how many days have passed
- Start with "Hi [Hiring Team],"

Return only the email body."""


async def run_followups_for_user(user_id: str) -> dict:
    db = get_client()
    now = datetime.utcnow()

    # Load user
    user_res = db.table("users").select("*").eq("id", user_id).single().execute()
    user = user_res.data
    if not user:
        return {"error": "User not found"}

    # Find applications where follow_up_due <= now and still submitted (no reply)
    due_res = (
        db.table("job_queue")
        .select("*")
        .eq("user_id", user_id)
        .eq("status", "submitted")
        .lte("follow_up_due", now.isoformat())
        .execute()
    )
    due_apps = due_res.data or []

    if not due_apps:
        return {"followups_sent": 0}

    # Get Gmail service
    token_res = db.table("gmail_tokens").select("*").eq("user_id", user_id).single().execute()
    if not token_res.data:
        return {"error": "No Gmail token"}

    token_data = token_res.data["token_data"]
    creds = Credentials(
        token=token_data.get("token"),
        refresh_token=token_data.get("refresh_token"),
        token_uri="https://oauth2.googleapis.com/token",
        client_id=token_data.get("client_id"),
        client_secret=token_data.get("client_secret"),
    )
    service = build("gmail", "v1", credentials=creds)

    sent = 0
    for app in due_apps:
        # Generate follow-up
        value_point = _extract_value_point(user.get("cv_text", ""))
        email_body = await _generate_followup(
            name=user.get("full_name", "Candidate"),
            title=app["title"],
            company=app["company"],
            value_point=value_point,
        )

        # Send if recruiter email known, otherwise skip
        if app.get("recruiter_email"):
            msg = _build_email(
                to=app["recruiter_email"],
                subject=f"Following up — {app['title']} application",
                body=email_body,
            )
            service.users().messages().send(userId="me", body=msg).execute()

        # Update DB: mark followed up
        db.table("job_queue").update({"status": "followed_up"}).eq("id", app["id"]).execute()
        db.table("followups").insert({
            "user_id": user_id,
            "application_id": app["id"],
            "type": "7day_followup",
            "sent_at": now.isoformat(),
        }).execute()

        sent += 1
        log.info("Follow-up sent", company=app["company"], title=app["title"])

        await send_telegram_alert(
            user_id,
            f"📬 7-day follow-up sent to *{app['company']}* for {app['title']}"
        )

    return {"followups_sent": sent}


async def _generate_followup(name: str, title: str, company: str, value_point: str) -> str:
    model = genai.GenerativeModel("gemini-1.5-flash")
    prompt = FOLLOWUP_PROMPT.format(
        name=name, title=title, company=company, value_point=value_point
    )
    resp = model.generate_content(prompt)
    return resp.text.strip()


def _extract_value_point(cv_text: str) -> str:
    """Pull a single strong sentence from the CV as a value point."""
    lines = [l.strip() for l in cv_text.split("\n") if "•" in l or "-" in l]
    for line in lines:
        if any(kw in line.lower() for kw in ["led", "built", "increased", "reduced", "launched", "managed"]):
            return line.lstrip("•- ").strip()
    return "my experience delivering high-quality work in fast-paced environments"


def _build_email(to: str, subject: str, body: str) -> dict:
    from email.mime.text import MIMEText
    msg = MIMEText(body)
    msg["to"] = to
    msg["subject"] = subject
    raw = base64.urlsafe_b64encode(msg.as_bytes()).decode()
    return {"raw": raw}
