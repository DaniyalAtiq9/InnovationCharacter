from fastapi import APIRouter, Depends, HTTPException
from typing import List, Dict, Any
from datetime import datetime, timedelta, timezone
import random
from ..database import get_db
from ..models import (
    DashboardStats, WeeklyReflection, UserResponse, 
    VirtueScore, CalendarInsight, AssessmentResponse,
    GoalResponse
)
from ..auth import get_current_user

router = APIRouter(
    tags=["dashboard"]
)

@router.get("/dashboard/stats", response_model=DashboardStats)
async def get_dashboard_stats(
    current_user: UserResponse = Depends(get_current_user),
    db = Depends(get_db)
):
    # Get current scores from latest assessment
    assessment = await db.assessments.find_one(
        {"user_id": str(current_user.id)},
        sort=[("_id", -1)]
    )
    
    current_scores = []
    if assessment and "scores" in assessment:
        # Ensure we have a list of objects that match VirtueScore
        raw_scores = assessment["scores"]
        # If it's already a list of dicts with 'virtueId' and 'score', it's good.
        current_scores = raw_scores
    else:
        # Default scores if no assessment
        virtues = ["Wisdom", "Courage", "Justice", "Humanity", "Temperance", "Transcendence"]
        current_scores = [
            {"virtueId": v.lower(), "score": 5.0} for v in virtues
        ]

    # Generate Mock History
    # We want a few data points representing previous weeks
    history = []
    dates = []
    now = datetime.now(timezone.utc)
    for i in range(4, -1, -1): # 5 weeks including current
        dates.append(now - timedelta(weeks=i))
    
    # Base scores on current scores to make it look realistic but varying
    # Helper to get score value regardless of whether it's a dict or object
    def get_score_val(s):
        if isinstance(s, dict):
            return s.get("score", 5.0)
        return s.score

    def get_virtue_id(s):
        if isinstance(s, dict):
            return s.get("virtueId", "unknown")
        return s.virtueId

    base_scores_map = {get_virtue_id(s): get_score_val(s) for s in current_scores}
    
    for date in dates:
        entry = {"date": date.strftime("%Y-%m-%d")}
        for virtue_id, score in base_scores_map.items():
            # Add some random variation
            variation = random.uniform(-1.0, 1.0)
            hist_score = max(0, min(10, score + variation))
            entry[virtue_id] = round(hist_score, 1)
        history.append(entry)

    return DashboardStats(
        currentScores=current_scores,
        history=history
    )

@router.get("/reflection/weekly", response_model=WeeklyReflection)
async def get_weekly_reflection(
    current_user: UserResponse = Depends(get_current_user),
    db = Depends(get_db)
):
    # 1. Get User's Goals (Focus)
    goal = await db.goals.find_one(
        {"user_id": str(current_user.id)},
        sort=[("_id", -1)]
    )
    
    focus_areas = []
    if goal:
        focus_areas = goal.get("priority_virtues", [])
    
    # 2. Get Recent Moments
    # Last 7 days
    seven_days_ago = datetime.now(timezone.utc) - timedelta(days=7)
    moments_cursor = db.moments.find({
        "user_id": str(current_user.id),
        "timestamp": {"$gte": seven_days_ago}
    })
    moments = await moments_cursor.to_list(length=None)
    
    moment_count = len(moments)
    
    # 3. Generate Summary
    if moment_count == 0:
        summary = "You haven't logged any moments this week. Start reflecting to see insights here!"
    else:
        # Simple summary logic
        virtues_logged = [m["virtue_id"] for m in moments]
        if virtues_logged:
            most_frequent = max(set(virtues_logged), key=virtues_logged.count)
            summary = f"You've been active this week, logging {moment_count} moments. Your focus has been on {most_frequent}."
        else:
            summary = f"You've logged {moment_count} moments this week. Keep up the good work!"
        
    # 4. Generate Mock Insights
    insights = []
    
    if moment_count > 0:
         insights.append(CalendarInsight(
            id="1",
            type="pattern",
            message="You tend to log more moments when you are focused.",
            virtueId=None
        ))
    else:
        insights.append(CalendarInsight(
            id="1",
            type="suggestion",
            message="Try logging one moment today to start your streak.",
            virtueId=None
        ))

    if focus_areas:
         insights.append(CalendarInsight(
            id="2",
            type="achievement",
            message=f"Remember your goal to practice {focus_areas[0]}.",
            virtueId=focus_areas[0]
        ))
    
    return WeeklyReflection(
        summary=summary,
        insights=insights,
        focus=focus_areas
    )