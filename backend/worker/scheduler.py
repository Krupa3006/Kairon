"""
Scheduler setup.
Runs the agent tasks on a time-based schedule.
"""
import asyncio
import structlog
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from apscheduler.triggers.interval import IntervalTrigger

from worker.supabase_client import get_client
from worker.job_scraper import run_job_search_for_user
from worker.followup_engine import run_followups_for_user
from worker.gmail_watcher import scan_inbox
from worker.notifier import send_daily_digest

log = structlog.get_logger()


def setup_scheduler() -> AsyncIOScheduler:
    scheduler = AsyncIOScheduler(timezone="UTC")

    # Hourly: run job search for all active users
    scheduler.add_job(
        hourly_job_search,
        trigger=IntervalTrigger(hours=1),
        id="hourly_job_search",
        replace_existing=True,
        max_instances=1,
    )

    # Every 6 hours: scan Gmail inboxes
    scheduler.add_job(
        gmail_scan_all_users,
        trigger=IntervalTrigger(hours=6),
        id="gmail_scan",
        replace_existing=True,
        max_instances=1,
    )

    # Daily at 8am UTC: send digest emails
    scheduler.add_job(
        daily_digest_all_users,
        trigger=CronTrigger(hour=8, minute=0),
        id="daily_digest",
        replace_existing=True,
    )

    # Every 2 hours: check for due follow-ups
    scheduler.add_job(
        check_followups_all_users,
        trigger=IntervalTrigger(hours=2),
        id="check_followups",
        replace_existing=True,
        max_instances=1,
    )

    log.info("Scheduler configured", jobs=4)
    return scheduler


async def _get_active_user_ids() -> list[str]:
    db = get_client()
    res = db.table("users").select("id").eq("agent_active", True).execute()
    return [r["id"] for r in (res.data or [])]


async def hourly_job_search():
    log.info("Running hourly job search")
    user_ids = await _get_active_user_ids()
    for uid in user_ids:
        try:
            result = await run_job_search_for_user(uid)
            log.info("Job search done", user_id=uid, **result)
        except Exception as e:
            log.error("Job search failed", user_id=uid, error=str(e))


async def gmail_scan_all_users():
    log.info("Running Gmail scan")
    user_ids = await _get_active_user_ids()
    for uid in user_ids:
        try:
            await scan_inbox(uid)
        except Exception as e:
            log.error("Gmail scan failed", user_id=uid, error=str(e))


async def check_followups_all_users():
    log.info("Checking follow-ups")
    user_ids = await _get_active_user_ids()
    for uid in user_ids:
        try:
            result = await run_followups_for_user(uid)
            if result.get("followups_sent", 0) > 0:
                log.info("Follow-ups sent", user_id=uid, **result)
        except Exception as e:
            log.error("Follow-up check failed", user_id=uid, error=str(e))


async def daily_digest_all_users():
    log.info("Sending daily digests")
    db = get_client()
    from datetime import datetime
    today = datetime.utcnow().date().isoformat()

    user_ids = await _get_active_user_ids()
    for uid in user_ids:
        try:
            # Gather today's stats
            applied_res = (
                db.table("job_queue")
                .select("id", count="exact")
                .eq("user_id", uid)
                .eq("status", "submitted")
                .gte("applied_at", f"{today}T00:00:00")
                .execute()
            )
            total_res = (
                db.table("job_queue")
                .select("id", count="exact")
                .eq("user_id", uid)
                .execute()
            )
            interviews_res = (
                db.table("job_queue")
                .select("id", count="exact")
                .eq("user_id", uid)
                .eq("status", "interview")
                .gte("applied_at", f"{today}T00:00:00")
                .execute()
            )
            followups_res = (
                db.table("followups")
                .select("id", count="exact")
                .eq("user_id", uid)
                .gte("sent_at", f"{today}T00:00:00")
                .execute()
            )

            stats = {
                "applied_today": applied_res.count or 0,
                "total_applied": total_res.count or 0,
                "new_interviews": interviews_res.count or 0,
                "followups_sent": followups_res.count or 0,
            }
            await send_daily_digest(uid, stats)
        except Exception as e:
            log.error("Digest failed", user_id=uid, error=str(e))
