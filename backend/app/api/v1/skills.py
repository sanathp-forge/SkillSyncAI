# ============================================
# SKILLSYNC AI — SKILL GAPS API ROUTES
# ============================================
from fastapi import APIRouter
from typing import List, Dict, Any
from app.schemas.all_schemas import SkillGapResponse

router = APIRouter(prefix="/skills", tags=["skills"])


@router.post("/gaps", response_model=List[SkillGapResponse])
async def analyze_skill_gaps(payload: Dict[str, str]):
    role = payload.get("target_role", "Full-Stack Developer")
    return [
        SkillGapResponse(
            skill="Docker",
            category="devops",
            importance="critical",
            current_level=3,
            required_level=8,
            gap_score=5,
            prerequisites=["Linux", "Git"],
            reason="Required in 85% of full-stack postings for reliable deployments.",
        ),
        SkillGapResponse(
            skill="Kubernetes",
            category="devops",
            importance="important",
            current_level=2,
            required_level=7,
            gap_score=5,
            prerequisites=["Docker"],
            reason="Standard container orchestration platform for cloud infrastructure.",
        ),
        SkillGapResponse(
            skill="CI/CD",
            category="devops",
            importance="critical",
            current_level=4,
            required_level=8,
            gap_score=4,
            prerequisites=["Git"],
            reason="Essential for automated testing and production release pipelines.",
        ),
        SkillGapResponse(
            skill="AWS",
            category="cloud",
            importance="important",
            current_level=4,
            required_level=7,
            gap_score=3,
            prerequisites=["Docker"],
            reason="Leading cloud provider for hosting APIs and microservices.",
        ),
        SkillGapResponse(
            skill="Redis",
            category="database",
            importance="recommended",
            current_level=3,
            required_level=6,
            gap_score=3,
            prerequisites=["PostgreSQL"],
            reason="In-memory cache for reducing database latency.",
        ),
    ]


@router.get("/graph")
async def get_skill_graph(role: str = "Full-Stack Developer"):
    return {
        "nodes": [
            {"id": "git", "label": "Git", "status": "mastered"},
            {"id": "ts", "label": "TypeScript", "status": "mastered"},
            {"id": "react", "label": "React", "status": "mastered"},
            {"id": "api", "label": "REST APIs", "status": "mastered"},
            {"id": "db", "label": "PostgreSQL", "status": "mastered"},
            {"id": "docker", "label": "Docker", "status": "in_progress"},
            {"id": "cloud", "label": "AWS", "status": "not_started"},
            {"id": "k8s", "label": "Kubernetes", "status": "not_started"},
        ],
        "edges": [
            {"source": "git", "target": "ts"},
            {"source": "ts", "target": "react"},
            {"source": "ts", "target": "api"},
            {"source": "api", "target": "db"},
            {"source": "api", "target": "docker"},
            {"source": "docker", "target": "cloud"},
            {"source": "docker", "target": "k8s"},
        ]
    }
