from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from ..database import get_db
from ..models import UserCreate, UserResponse, UserInDB
from ..auth import get_password_hash, verify_password, create_access_token
from pymongo.collection import Collection

router = APIRouter(
    tags=["auth"]
)

@router.post("/signup", response_model=dict)
async def signup(user: UserCreate, db = Depends(get_db)):
    # Check if user already exists
    if await db.users.find_one({"email": user.email}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(user.password)
    user_in_db = UserInDB(
        email=user.email,
        hashed_password=hashed_password,
        name=user.name
    )
    
    # Exclude id/None from insertion
    user_dict = user_in_db.model_dump(by_alias=True, exclude=["id"])
    
    new_user = await db.users.insert_one(user_dict)
    created_user = await db.users.find_one({"_id": new_user.inserted_id})
    
    user_response = UserResponse(**created_user)
    
    # Create token
    access_token = create_access_token(data={"sub": user.email})
    
    return {
        "token": access_token,
        "user": user_response
    }

@router.post("/login", response_model=dict)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db = Depends(get_db)):
    # OAuth2PasswordRequestForm expects "username" and "password"
    # We treat "username" as "email"
    user = await db.users.find_one({"email": form_data.username})
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": user["email"]})
    user_response = UserResponse(**user)
    
    return {
        "token": access_token,
        "user": user_response
    }