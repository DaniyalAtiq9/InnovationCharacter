from pydantic_settings import BaseSettings
from pathlib import Path

class Settings(BaseSettings):
    MONGODB_URI: str
    JWT_SECRET: str
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:5137"

    class Config:
        # Check for .env in backend folder first, then parent directory
        # Pydantic-settings will use the first file that exists
        backend_env = str(Path(__file__).parent / ".env")
        parent_env = str(Path(__file__).parent.parent / ".env")
        env_file = [backend_env, parent_env, ".env"]
        env_file_encoding = "utf-8"

settings = Settings()