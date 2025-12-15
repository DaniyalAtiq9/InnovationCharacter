from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from ..database import get_db
from ..models import AssessmentSubmit, AssessmentResponse, GoalSubmit, GoalResponse, UserResponse, VirtueScore
from ..auth import get_current_user
from datetime import datetime, timezone
import pymongo

router = APIRouter(
    tags=["onboarding"]
)

VIRTUE_MAP = {
    "q1": "resilience",
    "q2": "integrity",
    "q3": "growth_mindset",
    "q4": "humility",
    "q5": "teamwork",
    "q6": "courage",
    "q7": "empathy",
    "q8": "wisdom",
    "q9": "curiosity",
    "q10": "adaptability"
}

@router.post("/assessment", response_model=AssessmentResponse)
async def submit_assessment(
    assessment: AssessmentSubmit,
    current_user: UserResponse = Depends(get_current_user),
    db = Depends(get_db)
):
    # Calculate scores
    scores: List[VirtueScore] = []
    scores_dict = {
        "resilience": 0, "integrity": 0, "growth_mindset": 0, "humility": 0, 
        "teamwork": 0, "courage": 0, "empathy": 0, "wisdom": 0, 
        "curiosity": 0, "adaptability": 0
    }
    
    # Simple mapping: 1 question per virtue
    for q_id, value in assessment.answers.items():
        if q_id in VIRTUE_MAP:
            virtue = VIRTUE_MAP[q_id]
            scores_dict[virtue] = value

    scores = [VirtueScore(virtueId=k, score=float(v)) for k, v in scores_dict.items() if v > 0]
    
    # Generate dummy narrative profile
    narrative_profile = "You demonstrate strong potential in resilience and integrity. Your growth mindset is a key asset."
    
    assessment_doc = {
        "user_id": str(current_user.id),
        "scores": [s.model_dump() for s in scores],
        "narrative_profile": narrative_profile,
        "created_at": datetime.now(timezone.utc)
    }
    
    new_assessment = await db.assessments.insert_one(assessment_doc)
    created_assessment = await db.assessments.find_one({"_id": new_assessment.inserted_id})
    
    return AssessmentResponse(**created_assessment)

@router.get("/assessment", response_model=AssessmentResponse)
async def get_assessment(
    current_user: UserResponse = Depends(get_current_user),
    db = Depends(get_db)
):
    assessment = await db.assessments.find_one(
        {"user_id": str(current_user.id)},
        sort=[("_id", pymongo.DESCENDING)]
    )
    
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
        
    return AssessmentResponse(**assessment)

@router.post("/goals", response_model=GoalResponse)
async def submit_goals(
    goals: GoalSubmit,
    current_user: UserResponse = Depends(get_current_user),
    db = Depends(get_db)
):
    goal_doc = {
        "user_id": str(current_user.id),
        "priority_virtues": goals.priority_virtues,
        "innovation_goal": goals.innovation_goal,
        "created_at": datetime.now(timezone.utc)
    }
    
    new_goal = await db.goals.insert_one(goal_doc)
    created_goal = await db.goals.find_one({"_id": new_goal.inserted_id})
    
    return GoalResponse(**created_goal)

@router.get("/goals", response_model=GoalResponse)
async def get_goals(
    current_user: UserResponse = Depends(get_current_user),
    db = Depends(get_db)
):
    goal = await db.goals.find_one(
        {"user_id": str(current_user.id)},
        sort=[("_id", pymongo.DESCENDING)]
    )
    
    if not goal:
        raise HTTPException(status_code=404, detail="Goals not found")
        
    return GoalResponse(**goal)