# ============================================
# SKILLSYNC AI — BACKEND CONFIGURATION
# ============================================
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field


class Settings(BaseSettings):
    # App
    PROJECT_NAME: str = "SkillSync AI"
    API_V1_STR: str = "/api/v1"
    DEMO_MODE: bool = True
    LOG_LEVEL: str = "INFO"

    # Security
    SECRET_KEY: str = "change-this-to-a-random-secret-key-in-production-skillsync-ai"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1 day

    # Database
    DATABASE_URL: str = "postgresql+asyncpg://skillsync:skillsync_dev@localhost:5432/skillsync_db"

    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
    ]

    # AI / LLM
    OPENAI_API_KEY: str = ""
    LLM_MODEL: str = "gpt-4o-mini"
    LLM_PROVIDER: str = "openai"

    # GitHub OAuth
    GITHUB_CLIENT_ID: str = ""
    GITHUB_CLIENT_SECRET: str = ""
    GITHUB_CALLBACK_URL: str = "http://localhost:5173/auth/github/callback"

    # Sandbox
    SANDBOX_ENABLED: bool = False
    SANDBOX_URL: str = "http://localhost:8001"
    SANDBOX_TIMEOUT: int = 10

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )


settings = Settings()
