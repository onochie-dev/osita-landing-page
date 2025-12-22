"""
Osita Configuration Module
Handles all environment variables and application settings.
"""
from pydantic_settings import BaseSettings
from pydantic import Field
from functools import lru_cache
from pathlib import Path


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # API Keys
    openai_api_key: str = Field(default="", description="OpenAI API Key for structured extraction")
    openai_finetuned_model: str = Field(default="", description="Fine-tuned model ID (optional)")
    mistral_api_key: str = Field(default="", description="Mistral AI API Key for OCR processing")
    
    # Application Settings
    secret_key: str = Field(default="dev-secret-key-change-in-production", description="Secret key for security")
    database_url: str = Field(default="sqlite:///./osita.db", description="Database connection URL")
    upload_dir: str = Field(default="./uploads", description="Directory for uploaded files")
    max_upload_size_mb: int = Field(default=50, description="Maximum upload size in MB")
    
    # Debug
    debug: bool = Field(default=False, description="Enable debug mode")
    
    # Processing Settings
    ocr_timeout_seconds: int = Field(default=120, description="Timeout for OCR processing")
    extraction_timeout_seconds: int = Field(default=60, description="Timeout for extraction")
    
    # Validation Settings
    totals_tolerance_percent: float = Field(default=1.0, description="Tolerance for totals reconciliation (%)")
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False

    @property
    def upload_path(self) -> Path:
        """Get the upload directory as a Path object."""
        path = Path(self.upload_dir)
        path.mkdir(parents=True, exist_ok=True)
        return path


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()

