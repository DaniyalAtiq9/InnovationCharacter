from fastapi import APIRouter, Depends, HTTPException, Query, Body
from typing import List, Optional
from ..database import get_db
from ..models import Challenge, Article, UserResponse, GoalResponse
from ..auth import get_current_user
from datetime import datetime, timezone, timedelta
import pymongo
from bson import ObjectId

router = APIRouter(
    tags=["external"]
)

# --- Challenges Logic ---

VIRTUE_NAMES = {
    "courage": "Courage",
    "empathy": "Empathy",
    "humility": "Humility",
    "resilience": "Resilience",
    "integrity": "Integrity",
    "growth_mindset": "Growth Mindset",
    "teamwork": "Teamwork",
    "wisdom": "Wisdom",
    "curiosity": "Curiosity",
    "adaptability": "Adaptability"
}

def generate_challenges_for_virtues(virtue_ids: List[str], user_id: str, week_start: datetime) -> List[dict]:
    challenges = []
    for virtue_id in virtue_ids:
        virtue_name = VIRTUE_NAMES.get(virtue_id, virtue_id.capitalize())
        
        if virtue_id == "courage":
            challenges.append({
                "user_id": user_id,
                "title": f"Speak Up with {virtue_name}",
                "description": "In your next team meeting, identify one point where you can respectfully challenge an idea or offer a new perspective, even if it feels uncomfortable.",
                "virtueId": virtue_id,
                "status": "pending",
                "week_start": week_start
            })
            challenges.append({
                "user_id": user_id,
                "title": "Embrace a New Task",
                "description": "Volunteer for a task or project that is outside your comfort zone and requires you to learn something new.",
                "virtueId": virtue_id,
                "status": "pending",
                "week_start": week_start
            })
        elif virtue_id == "empathy":
            challenges.append({
                "user_id": user_id,
                "title": "Active Listening Exercise",
                "description": "In your next one-on-one conversation, practice active listening by focusing entirely on the other person without interrupting or formulating your response. Summarize their points back to them.",
                "virtueId": virtue_id,
                "status": "pending",
                "week_start": week_start
            })
            challenges.append({
                "user_id": user_id,
                "title": "Understand a Different Perspective",
                "description": "Seek out a colleague with a different viewpoint on a current project and ask open-ended questions to truly understand their rationale.",
                "virtueId": virtue_id,
                "status": "pending",
                "week_start": week_start
            })
        elif virtue_id == "humility":
            challenges.append({
                "user_id": user_id,
                "title": "Ask for Feedback",
                "description": "Proactively ask a peer or manager for constructive feedback on a recent piece of your work, and listen openly to their suggestions.",
                "virtueId": virtue_id,
                "status": "pending",
                "week_start": week_start
            })
            challenges.append({
                "user_id": user_id,
                "title": "Acknowledge Others' Contributions",
                "description": "Publicly acknowledge a colleague's contribution or idea that helped improve your work or a team project.",
                "virtueId": virtue_id,
                "status": "pending",
                "week_start": week_start
            })
        else:
             challenges.append({
                "user_id": user_id,
                "title": f"Apply {virtue_name} in a Daily Task",
                "description": f"Identify one routine task today and consciously think about how you can apply {virtue_name} while performing it.",
                "virtueId": virtue_id,
                "status": "pending",
                "week_start": week_start
            })
            
    return challenges

@router.get("/challenges", response_model=List[Challenge])
async def get_challenges(
    current_user: UserResponse = Depends(get_current_user),
    db = Depends(get_db)
):
    # 1. Determine current week start (Monday)
    now = datetime.now(timezone.utc)
    start_of_week = now - timedelta(days=now.weekday())
    start_of_week = start_of_week.replace(hour=0, minute=0, second=0, microsecond=0)
    
    # 2. Check for existing challenges for this week
    cursor = db.challenges.find({
        "user_id": str(current_user.id),
        "week_start": start_of_week
    })
    existing_challenges = await cursor.to_list(length=100)
    
    if existing_challenges:
        return [Challenge(**c) for c in existing_challenges]
    
    # 3. If none, get user's priority virtues
    goal = await db.goals.find_one(
        {"user_id": str(current_user.id)},
        sort=[("_id", pymongo.DESCENDING)]
    )
    
    priority_virtues = []
    if goal:
        priority_virtues = goal.get("priority_virtues", [])
    
    # 4. Generate new challenges
    new_challenge_docs = generate_challenges_for_virtues(priority_virtues, str(current_user.id), start_of_week)
    
    if not new_challenge_docs:
        return []

    await db.challenges.insert_many(new_challenge_docs)
    
    # 5. Return newly created challenges
    # Re-fetch to get IDs
    cursor = db.challenges.find({
        "user_id": str(current_user.id),
        "week_start": start_of_week
    })
    created_challenges = await cursor.to_list(length=100)
    return [Challenge(**c) for c in created_challenges]


@router.patch("/challenges/{challenge_id}", response_model=Challenge)
async def update_challenge_status(
    challenge_id: str,
    status_update: dict = Body(...), # Expecting {"status": "completed" | "pending"}
    current_user: UserResponse = Depends(get_current_user),
    db = Depends(get_db)
):
    new_status = status_update.get("status")
    if new_status not in ["pending", "completed"]:
        raise HTTPException(status_code=400, detail="Invalid status")
        
    try:
        obj_id = ObjectId(challenge_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid challenge ID")

    result = await db.challenges.find_one_and_update(
        {"_id": obj_id, "user_id": str(current_user.id)},
        {"$set": {"status": new_status}},
        return_document=pymongo.ReturnDocument.AFTER
    )
    
    if not result:
        raise HTTPException(status_code=404, detail="Challenge not found")
        
    return Challenge(**result)


# --- News Logic ---

MOCK_NEWS_ARTICLES = [
  {
    "id": "n1",
    "title": "Local Hero Shows Resilience in Community Rebuilding Effort",
    "description": "After a devastating storm, Sarah led her community in a remarkable rebuilding effort, demonstrating incredible resilience and teamwork.",
    "url": "https://example.com/news/resilience-hero",
    "virtues": ["resilience", "teamwork"],
    "imageUrl": "https://via.placeholder.com/150/FF5733/FFFFFF?text=Resilience",
  },
  {
    "id": "n2",
    "title": "CEO's Humility Leads to Breakthrough Innovation",
    "description": "John, the CEO of a tech startup, openly admitted a product failure and pivoted the company, showcasing profound humility and a growth mindset.",
    "url": "https://example.com/news/humility-ceo",
    "virtues": ["humility", "growth_mindset"],
    "imageUrl": "https://via.placeholder.com/150/33FF57/FFFFFF?text=Humility",
  },
  {
    "id": "n3",
    "title": "Scientist's Curiosity Unlocks New Medical Discovery",
    "description": "Dr. Anya Sharma's relentless curiosity and wisdom in research led to a groundbreaking discovery in disease treatment.",
    "url": "https://example.com/news/curiosity-discovery",
    "virtues": ["curiosity", "wisdom"],
    "imageUrl": "https://via.placeholder.com/150/3357FF/FFFFFF?text=Curiosity",
  },
  {
    "id": "n4",
    "title": "Activist's Courage Sparks Social Change",
    "description": "Maria stood up against injustice, demonstrating immense courage and integrity in her fight for social equality.",
    "url": "https://example.com/news/courage-activist",
    "virtues": ["courage", "integrity"],
    "imageUrl": "https://via.placeholder.com/150/FF33F0/FFFFFF?text=Courage",
  },
  {
    "id": "n5",
    "title": "Team's Empathy Transforms Customer Experience",
    "description": "A customer service team, driven by empathy, redesigned their support process, leading to unprecedented customer satisfaction.",
    "url": "https://example.com/news/empathy-team",
    "virtues": ["empathy", "teamwork"],
    "imageUrl": "https://via.placeholder.com/150/F0FF33/FFFFFF?text=Empathy",
  },
  {
    "id": "n6",
    "title": "Startup Founder's Adaptability Navigates Market Volatility",
    "description": "Facing unexpected market shifts, entrepreneur David quickly adapted his business model, showcasing remarkable adaptability and resilience.",
    "url": "https://example.com/news/adaptability-founder",
    "virtues": ["adaptability", "resilience"],
    "imageUrl": "https://via.placeholder.com/150/33FFF0/FFFFFF?text=Adaptability",
  },
]

@router.get("/news", response_model=List[Article])
async def get_news(
    q: Optional[str] = None,
    current_user: UserResponse = Depends(get_current_user)
):
    if not q:
        return [Article(**a) for a in MOCK_NEWS_ARTICLES]
    
    query = q.lower()
    filtered = [
        a for a in MOCK_NEWS_ARTICLES 
        if query in a["title"].lower() or query in a["description"].lower()
    ]
    return [Article(**a) for a in filtered]