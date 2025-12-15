from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    MONGODB_URI: str
    JWT_SECRET: str
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:5137"

    class Config:
        env_file = ".env"

settings = Settings()