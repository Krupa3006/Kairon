from fastapi import APIRouter, HTTPException, UploadFile, File, Depends
from pydantic import BaseModel
from typing import Optional
import structlog

from config import get_settings
from worker.cv_parser import parse_cv
from worker.job_scorer import score_job
from worker.ai_writer import generate_tailored_cv, generate_tailored_cover_letter, generate_cover_letter_from_answers
from worker.gmail_watcher import scan_inbox
from worker.notifier import send_telegram_alert

log = structlog.get_logger()
router = APIRouter()
settings = get_settings()


# ── CV Parser ──────────────────────────────────────────────────────────────
@router.post("/cv/parse")
async def parse_cv_endpoint(file: UploadFile = File(...)):
    content = await file.read()
    filename = file.filename or ""
    try:
        text = await parse_cv(content, filename)
        return {"cv_text": text, "char_count": len(text)}
    except Exception as e:
        log.error("CV parse failed", error=str(e))
        raise HTTPException(500, f"CV parsing failed: {e}")


# ── Job scoring ────────────────────────────────────────────────────────────
class ScoreRequest(BaseModel):
    cv_text: str
    job_description: str
    job_title: str
    location: str
    salary_range: Optional[str] = None
    user_preferences: dict = {}


@router.post("/jobs/score")
async def score_job_endpoint(req: ScoreRequest):
    result = await score_job(
        cv_text=req.cv_text,
        job_description=req.job_description,
        job_title=req.job_title,
        location=req.location,
        salary_range=req.salary_range,
        user_preferences=req.user_preferences,
    )
    return result


# ── AI Writer ──────────────────────────────────────────────────────────────
class TailorRequest(BaseModel):
    cv_text: str
    job_description: str
    job_title: str
    company_name: str
    use_claude: bool = False


@router.post("/ai/tailor-cv")
async def tailor_cv(req: TailorRequest):
    tailored = await generate_tailored_cv(
        cv_text=req.cv_text,
        job_description=req.job_description,
        job_title=req.job_title,
        company_name=req.company_name,
        use_claude=req.use_claude,
    )
    return {"tailored_cv": tailored}


class CoverLetterRequest(BaseModel):
    cover_letter: str
    job_description: str
    job_title: str
    company_name: str
    cv_text: str
    use_claude: bool = False


@router.post("/ai/tailor-cover-letter")
async def tailor_cover_letter(req: CoverLetterRequest):
    tailored = await generate_tailored_cover_letter(
        cover_letter=req.cover_letter,
        job_description=req.job_description,
        job_title=req.job_title,
        company_name=req.company_name,
        cv_text=req.cv_text,
        use_claude=req.use_claude,
    )
    return {"tailored_cover_letter": tailored}


class GenerateCoverLetterRequest(BaseModel):
    cv_text: str
    answers: dict  # q1, q2, q3
    target_role: str


@router.post("/ai/generate-cover-letter")
async def generate_cover_letter(req: GenerateCoverLetterRequest):
    letter = await generate_cover_letter_from_answers(
        cv_text=req.cv_text,
        answers=req.answers,
        target_role=req.target_role,
    )
    return {"cover_letter": letter}


# ── Agent control ──────────────────────────────────────────────────────────
class AgentControlRequest(BaseModel):
    user_id: str
    action: str  # "start" | "pause" | "stop"


@router.post("/agent/control")
async def agent_control(req: AgentControlRequest):
    from worker.supabase_client import get_client
    db = get_client()
    active = req.action == "start"
    db.table("users").update({"agent_active": active}).eq("id", req.user_id).execute()
    return {"status": "ok", "agent_active": active}


# ── Gmail scan (manual trigger) ────────────────────────────────────────────
@router.post("/gmail/scan/{user_id}")
async def trigger_gmail_scan(user_id: str):
    result = await scan_inbox(user_id)
    return result


# ── Telegram test ──────────────────────────────────────────────────────────
@router.post("/notify/test")
async def test_notification(user_id: str, message: str):
    await send_telegram_alert(user_id, message)
    return {"sent": True}
