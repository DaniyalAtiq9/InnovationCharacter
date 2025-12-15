from fastapi import APIRouter, Depends, HTTPException, status
from datetime import datetime, timezone
from typing import List
from ..database import get_db
from ..models import MomentSubmit, MomentResponse, UserResponse
from ..auth import get_current_user

router = APIRouter(
    tags=["moments"]
)

VIRTUE_FEEDBACK = {
    "wisdom": "Reflecting on your experiences is the key to wisdom. Well done!",
    "courage": "It takes strength to face challenges. You showed great courage!",
    "justice": "Acting with fairness creates a better world. Great job!",
    "humanity": "Kindness and love are powerful. You made a difference!",
    "temperance": "Self-control is a true strength. Keep it up!",
    "transcendence": "Seeing the bigger picture brings meaning. Wonderful!",
    "curiosity": "Asking questions leads to new discoveries. Keep exploring!",
    "judgment": "Thinking things through is important. Good critical thinking!",
    "honesty": "Truthfulness builds trust. Thank you for being honest.",
    "kindness": "A small act of kindness goes a long way. Beautiful!",
    "leadership": "Guiding others is a noble responsibility. well led!",
    "forgiveness": "Letting go brings peace. You showed great grace.",
    "humility": "Knowing yourself is the start of growth. Stay grounded!",
    "gratitude": "Being thankful changes your perspective. Keep appreciating!",
    "hope": "Optimism lights the path forward. Keep believing!",
    "humor": "Laughter lightens the load. Thanks for the smile!",
    "spirituality": "Connecting to something greater brings peace. Deep work!"
}

@router.post("/moments", response_model=MomentResponse)
async def create_moment(
    moment: MomentSubmit,
    current_user: UserResponse = Depends(get_current_user),
    db = Depends(get_db)
):
    feedback = VIRTUE_FEEDBACK.get(
        moment.virtue_id.lower(), 
        f"Great job practicing {moment.virtue_id}!"
    )
    
    new_moment = {
        "user_id": str(current_user.id),
        "content": moment.content,
        "virtue_id": moment.virtue_id,
        "feedback": feedback,
        "timestamp": datetime.now(timezone.utc)
    }
    
    result = await db.moments.insert_one(new_moment)
    created_moment = await db.moments.find_one({"_id": result.inserted_id})
    
    return MomentResponse(**created_moment)

@router.get("/moments", response_model=List[MomentResponse])
async def get_moments(
    current_user: UserResponse = Depends(get_current_user),
    db = Depends(get_db)
):
    moments_cursor = db.moments.find({"user_id": str(current_user.id)}).sort("timestamp", -1)
    moments = await moments_cursor.to_list(length=None)
    
    return [MomentResponse(**moment) for moment in moments]