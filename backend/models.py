from pydantic import BaseModel, EmailStr, Field, BeforeValidator
from typing import Optional, List, Dict, Any
from datetime import datetime
from typing_extensions import Annotated

# Represents an ObjectId field in the database.
# It will be represented as a `str` on the model so that it can be serialized to JSON.
PyObjectId = Annotated[str, BeforeValidator(str)]

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str

class UserResponse(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    email: EmailStr
    name: str

    class Config:
        populate_by_name = True
        from_attributes = True

class AssessmentSubmit(BaseModel):
    answers: Dict[str, int]

class VirtueScore(BaseModel):
    virtueId: str
    score: float

class AssessmentResponse(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    user_id: Optional[str] = None
    scores: List[VirtueScore]
    narrative_profile: str
    
    class Config:
        populate_by_name = True
        from_attributes = True

class MomentSubmit(BaseModel):
    content: str
    virtue_id: str

class MomentResponse(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    user_id: Optional[str] = None
    content: str
    virtue_id: str
    feedback: str
    timestamp: datetime

    class Config:
        populate_by_name = True
        from_attributes = True

class GoalSubmit(BaseModel):
    priority_virtues: List[str]
    innovation_goal: str

class GoalResponse(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    user_id: Optional[str] = None
    priority_virtues: List[str]
    innovation_goal: str

    class Config:
        populate_by_name = True
        from_attributes = True

class UserInDB(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    email: EmailStr
    hashed_password: str
    name: str

    class Config:
        populate_by_name = True
        from_attributes = True

class CalendarInsight(BaseModel):
    id: str
    type: str
    message: str
    virtueId: Optional[str] = None

class DashboardStats(BaseModel):
    currentScores: List[VirtueScore]
    history: List[Dict[str, Any]]

class WeeklyReflection(BaseModel):
    summary: str
    insights: List[CalendarInsight]
    focus: List[str]
class Challenge(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    user_id: str
    title: str
    description: str
    virtueId: str
    status: str  # "pending", "completed"
    week_start: datetime

    class Config:
        populate_by_name = True
        from_attributes = True

class Article(BaseModel):
    id: str
    title: str
    description: str
    url: str
    virtues: List[str]
    imageUrl: Optional[str] = None