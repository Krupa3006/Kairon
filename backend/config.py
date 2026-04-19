from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # Supabase
    supabase_url: str
    supabase_anon_key: str
    supabase_service_role_key: str

    # AI
    gemini_api_key: str
    anthropic_api_key: str = ""

    # Telegram
    telegram_bot_token: str = ""

    # Email
    resend_api_key: str = ""
    email_from: str = "noreply@jobflowai.com"

    # Internal
    api_secret_key: str = "dev-secret"
    environment: str = "development"

    # Agent settings
    apply_delay_min_seconds: int = 120   # 2 min min between apps
    apply_delay_max_seconds: int = 480   # 8 min max
    min_match_score: int = 6
    top_match_score: int = 8
    max_apps_per_user_day: int = 25
    job_freshness_hours: int = 6

    class Config:
        env_file = ".env"


@lru_cache
def get_settings() -> Settings:
    return Settings()
