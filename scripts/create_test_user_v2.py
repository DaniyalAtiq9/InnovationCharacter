import asyncio
from backend.database import get_db
from backend.models import UserCreate
from backend.auth import get_password_hash
from datetime import datetime, timezone

async def create_user():
    db = await get_db()
    
    user_data = {
        "email": "test@example.com",
        "hashed_password": get_password_hash("password123"),
        "name": "Test User",
        "created_at": datetime.now(timezone.utc)
    }
    
    # Check if user exists
    existing_user = await db.users.find_one({"email": user_data["email"]})
    if existing_user:
        print("User already exists")
        return

    result = await db.users.insert_one(user_data)
    print(f"User created with ID: {result.inserted_id}")

if __name__ == "__main__":
    asyncio.run(create_user())