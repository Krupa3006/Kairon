import httpx
import structlog
from config import get_settings
from worker.supabase_client import get_client

log = structlog.get_logger()
settings = get_settings()


async def send_telegram_alert(user_id: str, message: str) -> bool:
    """Send a Telegram message to the user's linked Telegram account."""
    if not settings.telegram_bot_token:
        log.warning("Telegram not configured")
        return False

    db = get_client()
    user_res = db.table("users").select("telegram_id").eq("id", user_id).single().execute()
    if not user_res.data or not user_res.data.get("telegram_id"):
        log.warning("No telegram_id for user", user_id=user_id)
        return False

    chat_id = user_res.data["telegram_id"]
    url = f"https://api.telegram.org/bot{settings.telegram_bot_token}/sendMessage"

    try:
        async with httpx.AsyncClient() as client:
            resp = await client.post(url, json={
                "chat_id": chat_id,
                "text": message,
                "parse_mode": "Markdown",
            })
            resp.raise_for_status()
            log.info("Telegram sent", user_id=user_id)
            return True
    except Exception as e:
        log.error("Telegram failed", error=str(e))
        return False


async def send_daily_digest(user_id: str, stats: dict) -> bool:
    """Send daily email digest using Resend."""
    if not settings.resend_api_key:
        return False

    db = get_client()
    user_res = db.table("users").select("email, full_name").eq("id", user_id).single().execute()
    if not user_res.data:
        return False

    user = user_res.data
    html = _build_digest_html(user["full_name"], stats)

    try:
        import resend
        resend.api_key = settings.resend_api_key
        resend.Emails.send({
            "from": settings.email_from,
            "to": user["email"],
            "subject": f"JobFlow Daily Digest — {stats.get('applied_today', 0)} applications sent today",
            "html": html,
        })
        log.info("Daily digest sent", user_id=user_id)
        return True
    except Exception as e:
        log.error("Email digest failed", error=str(e))
        return False


def _build_digest_html(name: str, stats: dict) -> str:
    applied = stats.get("applied_today", 0)
    interviews = stats.get("new_interviews", 0)
    followups = stats.get("followups_sent", 0)
    rejections = stats.get("rejections", 0)
    total = stats.get("total_applied", 0)

    return f"""
<!DOCTYPE html>
<html>
<head>
  <style>
    body {{ font-family: Inter, system-ui, sans-serif; background: #F0F1F8; margin: 0; padding: 20px; }}
    .container {{ max-width: 520px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; }}
    .header {{ background: #0B1139; padding: 28px 32px; }}
    .header h1 {{ color: white; font-size: 20px; margin: 0; }}
    .header p {{ color: rgba(255,255,255,0.5); font-size: 13px; margin: 4px 0 0; }}
    .body {{ padding: 28px 32px; }}
    .stats {{ display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px; }}
    .stat {{ background: #F0F1F8; border-radius: 10px; padding: 16px; text-align: center; }}
    .stat-value {{ font-size: 28px; font-weight: 800; color: #0B1139; }}
    .stat-label {{ font-size: 11px; color: #6B7280; margin-top: 2px; }}
    .footer {{ padding: 16px 32px; border-top: 1px solid #E2E4F0; text-align: center; }}
    .footer a {{ font-size: 12px; color: #2563EB; text-decoration: none; }}
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Good morning, {name} 👋</h1>
      <p>Here's what your agent did while you slept</p>
    </div>
    <div class="body">
      <div class="stats">
        <div class="stat">
          <div class="stat-value">{applied}</div>
          <div class="stat-label">Applied today</div>
        </div>
        <div class="stat">
          <div class="stat-value" style="color:#10B981">{interviews}</div>
          <div class="stat-label">Interview invites</div>
        </div>
        <div class="stat">
          <div class="stat-value" style="color:#F97316">{followups}</div>
          <div class="stat-label">Follow-ups sent</div>
        </div>
        <div class="stat">
          <div class="stat-value" style="color:#6B7280">{total}</div>
          <div class="stat-label">Total applied</div>
        </div>
      </div>
      <p style="font-size:13px;color:#374151;">
        Your agent is running 24/7. Every application is tailored to the role and company.
        No skills are fabricated — every interview you get, you can win.
      </p>
    </div>
    <div class="footer">
      <a href="https://jobflowai.com/dashboard">View full dashboard →</a>
    </div>
  </div>
</body>
</html>"""
