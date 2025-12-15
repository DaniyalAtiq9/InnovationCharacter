from motor.motor_asyncio import AsyncIOMotorClient
from .config import settings
import certifi
import ssl

# Create SSL context using certifi
ca = certifi.where()

client = AsyncIOMotorClient(settings.MONGODB_URI, tlsCAFile=ca)
db = client.get_default_database()

async def get_db():
    return db