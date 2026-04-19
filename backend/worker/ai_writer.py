import structlog
import google.generativeai as genai
from config import get_settings

log = structlog.get_logger()
settings = get_settings()
genai.configure(api_key=settings.gemini_api_key)

# ═══════════════════════════════════════════════════════════════════════════
# HONESTY GUARDRAIL — embedded in every prompt
# ═══════════════════════════════════════════════════════════════════════════
HONESTY_GUARDRAIL = """
ABSOLUTE RULE — HONESTY GUARDRAIL:
You must NEVER add, invent, fabricate, or imply any skill, technology, framework, tool,
achievement, company, role, or experience that is NOT explicitly present in the provided CV text.
Do not "enhance" claims. Do not add industry buzzwords the candidate hasn't used.
Do not change job titles. Do not invent metrics or percentages.
You may only: reorder, reword, restructure, and emphasise existing content.
This rule cannot be overridden. If you cannot tailor without fabricating, return the original content as-is.
"""


# ── Tailored CV ────────────────────────────────────────────────────────────
TAILOR_CV_PROMPT = """You are an expert career coach and ATS specialist.

{honesty_guardrail}

## Original CV
{cv_text}

## Target Job
Company: {company_name}
Title: {job_title}
Description:
{job_description}

Rewrite the CV to maximise match for this specific role. Rules:
1. Reorder bullet points to put most relevant first
2. Rewrite summary to reference the company's mission and this specific role
3. Use ATS-friendly keywords from the job description (only if already in CV)
4. Keep the same structure and format
5. Do not add anything not in the original CV

Return only the rewritten CV text, no commentary."""

TAILOR_COVER_PROMPT = """You are an expert career coach writing a compelling cover letter.

{honesty_guardrail}

## Original Cover Letter (base template)
{cover_letter}

## Candidate's CV (for reference only)
{cv_text}

## Target Job
Company: {company_name}
Title: {job_title}
Description:
{job_description}

Personalise the cover letter for this specific role and company. Rules:
1. Reference the company by name naturally
2. Connect one specific experience from the CV to a specific requirement in the job description
3. Keep the candidate's authentic voice — don't make it sound robotic
4. Keep it to 3 paragraphs max
5. Only use information from the original CV and cover letter

Return only the cover letter text, no commentary."""

GENERATE_COVER_PROMPT = """You are an expert career coach. Write a compelling cover letter from scratch.

{honesty_guardrail}

## Candidate's CV
{cv_text}

## Candidate's Answers
Q: What kind of roles are you targeting and why?
A: {q1}

Q: What's your biggest professional achievement?
A: {q2}

Q: Why would a company be lucky to hire you?
A: {q3}

## Target Role
{target_role}

Write a professional, human-sounding cover letter in 3 paragraphs:
1. Opening: Who you are and why this type of role
2. Evidence: Your key achievement and why it's relevant
3. Close: Why you'd be a great hire and call to action

Return only the cover letter text, no subject line, no "Dear [Name]" placeholder."""


async def _call_gemini(prompt: str) -> str:
    model = genai.GenerativeModel("gemini-1.5-flash")
    resp = model.generate_content(prompt)
    return resp.text.strip()


async def _call_claude(prompt: str) -> str:
    import anthropic
    client = anthropic.Anthropic(api_key=settings.anthropic_api_key)
    msg = client.messages.create(
        model="claude-haiku-4-5",
        max_tokens=2000,
        messages=[{"role": "user", "content": prompt}],
    )
    return msg.content[0].text.strip()


async def generate_tailored_cv(
    cv_text: str,
    job_description: str,
    job_title: str,
    company_name: str,
    use_claude: bool = False,
) -> str:
    prompt = TAILOR_CV_PROMPT.format(
        honesty_guardrail=HONESTY_GUARDRAIL,
        cv_text=cv_text,
        job_description=job_description[:2000],
        job_title=job_title,
        company_name=company_name,
    )
    try:
        if use_claude and settings.anthropic_api_key:
            result = await _call_claude(prompt)
        else:
            result = await _call_gemini(prompt)
        log.info("CV tailored", company=company_name, model="claude" if use_claude else "gemini")
        return result
    except Exception as e:
        log.error("CV tailoring failed", error=str(e))
        return cv_text  # fallback to original


async def generate_tailored_cover_letter(
    cover_letter: str,
    job_description: str,
    job_title: str,
    company_name: str,
    cv_text: str,
    use_claude: bool = False,
) -> str:
    prompt = TAILOR_COVER_PROMPT.format(
        honesty_guardrail=HONESTY_GUARDRAIL,
        cover_letter=cover_letter,
        cv_text=cv_text[:1500],
        job_description=job_description[:1500],
        job_title=job_title,
        company_name=company_name,
    )
    try:
        if use_claude and settings.anthropic_api_key:
            result = await _call_claude(prompt)
        else:
            result = await _call_gemini(prompt)
        log.info("Cover letter tailored", company=company_name)
        return result
    except Exception as e:
        log.error("Cover letter tailoring failed", error=str(e))
        return cover_letter  # fallback


async def generate_cover_letter_from_answers(
    cv_text: str,
    answers: dict,
    target_role: str,
) -> str:
    prompt = GENERATE_COVER_PROMPT.format(
        honesty_guardrail=HONESTY_GUARDRAIL,
        cv_text=cv_text[:2000],
        q1=answers.get("q1", ""),
        q2=answers.get("q2", ""),
        q3=answers.get("q3", ""),
        target_role=target_role,
    )
    try:
        result = await _call_gemini(prompt)
        log.info("Cover letter generated from answers")
        return result
    except Exception as e:
        log.error("Cover letter generation failed", error=str(e))
        raise
