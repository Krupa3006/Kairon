import asyncio
import random
from datetime import datetime, timedelta
from typing import List
import structlog
from jobspy import scrape_jobs
import pandas as pd

from config import get_settings
from worker.supabase_client import get_client
from worker.job_scorer import score_job
from worker.ai_writer import generate_tailored_cv, generate_tailored_cover_letter
from worker.notifier import send_telegram_alert

log = structlog.get_logger()
settings = get_settings()


async def run_job_search_for_user(user_id: str) -> dict:
    """Main agent loop for one user. Called by scheduler every hour."""
    db = get_client()

    # Load user profile
    user_res = db.table("users").select("*").eq("id", user_id).single().execute()
    user = user_res.data
    if not user or not user.get("agent_active"):
        return {"skipped": True, "reason": "Agent not active"}

    if not user.get("cv_text"):
        return {"skipped": True, "reason": "No CV uploaded"}

    # Check daily limit
    today = datetime.utcnow().date().isoformat()
    applied_today_res = (
        db.table("job_queue")
        .select("id", count="exact")
        .eq("user_id", user_id)
        .eq("status", "submitted")
        .gte("applied_at", f"{today}T00:00:00")
        .execute()
    )
    applied_today = applied_today_res.count or 0
    daily_limit = user.get("daily_app_limit", settings.max_apps_per_user_day)

    if applied_today >= daily_limit:
        log.info("Daily limit reached", user_id=user_id, applied=applied_today)
        return {"skipped": True, "reason": "Daily limit reached"}

    remaining = daily_limit - applied_today

    # Scrape jobs
    jobs_df = await scrape_fresh_jobs(
        job_title=user.get("job_title", "Software Engineer"),
        location=user.get("location", "Remote"),
        remote=user.get("remote_preference") in ("remote", "any"),
    )

    if jobs_df.empty:
        log.info("No fresh jobs found", user_id=user_id)
        return {"found": 0, "applied": 0}

    applied = 0
    for _, row in jobs_df.head(remaining * 3).iterrows():
        if applied >= remaining:
            break

        job_url = str(row.get("job_url", ""))
        company = str(row.get("company", "Unknown"))
        title = str(row.get("title", ""))
        description = str(row.get("description", ""))

        # Skip companies on avoid list
        avoid = user.get("avoid_companies") or []
        if any(c.lower() in company.lower() for c in avoid):
            continue

        # Check duplicate
        exists = (
            db.table("job_queue")
            .select("id")
            .eq("user_id", user_id)
            .eq("job_url", job_url)
            .execute()
        )
        if exists.data:
            continue

        # Score the job
        score_result = await score_job(
            cv_text=user["cv_text"],
            job_description=description,
            job_title=title,
            location=str(row.get("location", "")),
            salary_range=str(row.get("salary_source", "")),
            user_preferences={
                "target_title": user.get("job_title"),
                "location": user.get("location"),
                "salary_min": user.get("salary_min"),
                "visa_required": user.get("visa_required"),
            },
        )

        score = score_result.get("score", 0)
        if score < settings.min_match_score:
            log.info("Job below threshold", score=score, company=company, title=title)
            continue

        # Tailor documents
        use_claude = user.get("plan") == "premium" and bool(settings.anthropic_api_key)
        tailored_cv = await generate_tailored_cv(
            cv_text=user["cv_text"],
            job_description=description,
            job_title=title,
            company_name=company,
            use_claude=use_claude,
        )
        tailored_cl = await generate_tailored_cover_letter(
            cover_letter=user.get("cover_letter", ""),
            job_description=description,
            job_title=title,
            company_name=company,
            cv_text=user["cv_text"],
            use_claude=use_claude,
        ) if user.get("cover_letter") else ""

        # Insert to queue
        follow_up_due = (datetime.utcnow() + timedelta(days=7)).isoformat()
        db.table("job_queue").insert({
            "user_id": user_id,
            "title": title,
            "company": company,
            "job_url": job_url,
            "description": description[:5000],
            "location": str(row.get("location", "")),
            "salary_range": str(row.get("salary_source", "")),
            "source": str(row.get("site", "unknown")).capitalize(),
            "match_score": score,
            "match_reason": score_result.get("reason", ""),
            "tailored_cv": tailored_cv,
            "tailored_cover_letter": tailored_cl,
            "status": "submitted",
            "applied_at": datetime.utcnow().isoformat(),
            "follow_up_due": follow_up_due,
            "posted_at": str(row.get("date_posted", "")),
        }).execute()

        applied += 1
        log.info("Job queued", company=company, title=title, score=score)

        # Telegram notification
        await send_telegram_alert(
            user_id,
            f"✅ Applied to *{title}* at *{company}* (score: {score}/10)\n"
            f"📍 {row.get('location', 'Remote')} · {row.get('site', '').capitalize()}"
        )

        # Human-like delay
        delay = random.randint(
            settings.apply_delay_min_seconds,
            settings.apply_delay_max_seconds,
        )
        await asyncio.sleep(delay)

    log.info("User cycle complete", user_id=user_id, applied=applied)
    return {"found": len(jobs_df), "applied": applied}


async def scrape_fresh_jobs(job_title: str, location: str, remote: bool) -> pd.DataFrame:
    """Scrape jobs from multiple boards. Returns DataFrame."""
    try:
        jobs = scrape_jobs(
            site_name=["linkedin", "indeed", "glassdoor", "zip_recruiter"],
            search_term=job_title,
            location=location,
            results_wanted=40,
            hours_old=settings.job_freshness_hours,
            country_indeed="UK",
            linkedin_fetch_description=True,
            is_remote=remote,
        )
        log.info("Jobs scraped", count=len(jobs), title=job_title, location=location)
        return jobs
    except Exception as e:
        log.error("Job scraping failed", error=str(e))
        return pd.DataFrame()
