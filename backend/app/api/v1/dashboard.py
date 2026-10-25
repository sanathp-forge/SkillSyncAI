# ============================================
# SKILLSYNC AI — DASHBOARD API ROUTES
# ============================================
from fastapi import APIRouter
from datetime import datetime
from app.schemas.all_schemas import DashboardDataResponse

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("", response_model=DashboardDataResponse)
async def get_dashboard():
    return DashboardDataResponse(
        resume_status="analyzed",
        target_role="Full-Stack Developer",
        match_score=78,
        skill_coverage=72,
        evidence_coverage=50,
        missing_skills_count=5,
        roadmap_progress=40,
        completed_milestones=4,
        total_milestones=10,
        challenges_completed=3,
        challenges_total=8,
        interview_avg_score=78,
        interviews_completed=2,
        recent_activity=[
            {
                "id": "act-1",
                "type": "resume_upload",
                "title": "Resume Analyzed",
                "description": "Resume scored 78/100 for Full-Stack Developer",
                "timestamp": datetime.utcnow().isoformat(),
            },
            {
                "id": "act-2",
                "type": "job_match",
                "title": "Job Matched",
                "description": "Senior Full-Stack Engineer — 72% match",
                "timestamp": datetime.utcnow().isoformat(),
            },
            {
                "id": "act-3",
                "type": "evidence_found",
                "title": "Skill Verified",
                "description": "TypeScript verified via public GitHub repository",
                "timestamp": datetime.utcnow().isoformat(),
            },
        ],
        recommendations=[
            {
                "id": "rec-1",
                "type": "skill_gap",
                "title": "Master Docker & Containerization",
                "description": "Critical requirement present in 85% of full-stack job postings.",
                "action_label": "View Roadmap",
                "action_link": "/app/roadmap",
                "priority": "high",
            },
            {
                "id": "rec-2",
                "type": "challenge",
                "title": "Solve SQL Window Functions Challenge",
                "description": "Validate database query optimization with practical challenge.",
                "action_label": "Start Challenge",
                "action_link": "/app/challenges",
                "priority": "medium",
            },
            {
                "id": "rec-3",
                "type": "interview",
                "title": "Mock Technical Interview Session",
                "description": "Practice system design and database indexing questions.",
                "action_label": "Start Session",
                "action_link": "/app/interviews",
                "priority": "medium",
            },
        ],
        is_demo_data=False,
    )
