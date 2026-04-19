import json
import structlog
import google.generativeai as genai
from config import get_settings

log = structlog.get_logger()
settings = get_settings()
genai.configure(api_key=settings.gemini_api_key)

SCORE_PROMPT = """You are a job matching expert. Score how well this candidate's CV matches the job posting.

## Candidate CV
{cv_text}

## Job Posting
Title: {job_title}
Location: {location}
Salary: {salary_range}
Description:
{job_description}

## User Preferences
{user_preferences}

Score the match from 1-10 where:
- 9-10: Near perfect match — candidate is ideal
- 7-8: Strong match — candidate is well qualified
- 6: Acceptable match — apply, minor gaps exist
- Below 6: Poor match — do NOT apply

Consider:
1. Skills overlap (most important)
2. Experience level match
3. Location and remote preference
4. Salary range alignment
5. Visa requirements if applicable

IMPORTANT: Only evaluate based on what is IN the CV. Do not assume skills.

Respond ONLY with valid JSON, no markdown:
{{"score": 8, "reason": "Strong match: React + TypeScript expertise. 5+ years matches. Remote role suits preference. Salary in range.", "should_apply": true}}"""


async def score_job(
    cv_text: str,
    job_description: str,
    job_title: str,
    location: str,
    salary_range: str | None = None,
    user_preferences: dict | None = None,
) -> dict:
    prompt = SCORE_PROMPT.format(
        cv_text=cv_text[:3000],  # truncate for token efficiency
        job_title=job_title,
        location=location,
        salary_range=salary_range or "Not specified",
        job_description=job_description[:2000],
        user_preferences=json.dumps(user_preferences or {}, indent=2),
    )
    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)
        text = response.text.strip()
        # Strip markdown fences if present
        if text.startswith("```"):
            text = text.split("```")[1]
            if text.startswith("json"):
                text = text[4:]
        result = json.loads(text)
        log.info("Job scored", score=result.get("score"), title=job_title)
        return result
    except Exception as e:
        log.error("Scoring failed", error=str(e))
        return {"score": 0, "reason": f"Scoring error: {e}", "should_apply": False}
