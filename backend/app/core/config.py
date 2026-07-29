import os
from pydantic_settings import BaseSettings

from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "CivicEye AI Public Complaint Management API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # JWT Auth
    SECRET_KEY: str = os.getenv("SECRET_KEY", "civiceye_super_secret_jwt_key_2026_antigravity_production_grade")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Database Settings (Defaults to SQLite for instant local dev, easily overridden by env var for PostgreSQL)
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./civiceye.db")
    
    # AI Engine Settings
    DUPLICATE_RADIUS_METERS: float = 30.0
    MIN_CONFIDENCE_THRESHOLD: float = 0.60
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = ["*"]

    class Config:
        case_sensitive = True

settings = Settings()
