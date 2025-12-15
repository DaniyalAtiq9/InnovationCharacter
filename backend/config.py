from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    MONGODB_URI: str = "mongodb+srv://daniyalatiq_db_user:Pakistan92@cluster0.dwn0kwv.mongodb.net/crimson_gecko_bounce?retryWrites=true&w=majority"
    JWT_SECRET: str = "supersecretkey"

    class Config:
        env_file = ".env"

settings = Settings()