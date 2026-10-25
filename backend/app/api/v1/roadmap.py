# ============================================
# SKILLSYNC AI — ROADMAP API ROUTES
# ============================================
from fastapi import APIRouter
from typing import Dict, Any
from datetime import datetime
from app.schemas.all_schemas import (
    RoadmapResponse, RoadmapPhase, RoadmapStep, LearningResource
)

router = APIRouter(prefix="/roadmap", tags=["roadmap"])


def get_default_roadmap(role: str = "Full-Stack Developer") -> RoadmapResponse:
    phase1 = RoadmapPhase(
        id="phase-1",
        name="Phase 1: Critical DevOps & Containerization",
        description="Master containerization and modern deployment workflows required by production software teams.",
        order=1,
        status="active",
        progress=50,
        steps=[
            RoadmapStep(
                id="step-1",
                skill="Docker Fundamentals",
                reason="Docker containerization is required by 85% of target role job postings.",
                prerequisites=["Linux Basics", "Git"],
                resources=[
                    LearningResource(title="Official Docker Documentation & Get Started Guide", url="https://docs.docker.com/get-started/", type="documentation", free=True),
                    LearningResource(title="freeCodeCamp Docker Container Tutorial", url="https://www.freecodecamp.org/news/tag/docker/", type="tutorial", free=True)
                ],
                exercise="Containerize a multi-service web application with Docker and docker-compose.",
                completion_criteria="Build a working multi-stage Dockerfile with image size under 150MB.",
                estimated_hours=12,
                status="completed",
                completed_at=datetime.utcnow().isoformat(),
            ),
            RoadmapStep(
                id="step-2",
                skill="CI/CD Pipeline Automation",
                reason="Automated continuous integration and deployment prevents regression and expedites release velocity.",
                prerequisites=["Git", "Docker"],
                resources=[
                    LearningResource(title="GitHub Actions Documentation", url="https://docs.github.com/en/actions", type="documentation", free=True)
                ],
                exercise="Write a GitHub Actions workflow that runs test suites and publishes a Docker image.",
                completion_criteria="Green workflow run with test coverage reporting and image push on main branch.",
                estimated_hours=8,
                status="in_progress",
            )
        ]
    )

    phase2 = RoadmapPhase(
        id="phase-2",
        name="Phase 2: Cloud Infrastructure & Resilience",
        description="Deploy scalable services on managed cloud infrastructure with reliable persistence.",
        order=2,
        status="upcoming",
        progress=0,
        steps=[
            RoadmapStep(
                id="step-3",
                skill="AWS Cloud Fundamentals",
                reason="Cloud architecture knowledge is expected for senior and mid-level full-stack positions.",
                prerequisites=["Docker"],
                resources=[
                    LearningResource(title="AWS Developer Documentation", url="https://aws.amazon.com/developer/", type="documentation", free=True)
                ],
                exercise="Deploy an ECS task or App Runner container connected to RDS PostgreSQL.",
                completion_criteria="Live publicly accessible service with automated HTTPS termination.",
                estimated_hours=16,
                status="not_started",
            )
        ]
    )

    return RoadmapResponse(
        id="roadmap-1",
        user_id="demo-user-1",
        target_role=role,
        created_at=datetime.utcnow().isoformat(),
        updated_at=datetime.utcnow().isoformat(),
        phases=[phase1, phase2],
        overall_progress=35,
        version=1,
    )


ROADMAP_STATE = get_default_roadmap()


@router.get("/current", response_model=RoadmapResponse)
async def get_current_roadmap():
    return ROADMAP_STATE


@router.post("/generate", response_model=RoadmapResponse)
async def generate_roadmap(payload: Dict[str, str]):
    role = payload.get("target_role", "Full-Stack Developer")
    global ROADMAP_STATE
    ROADMAP_STATE = get_default_roadmap(role)
    return ROADMAP_STATE


@router.patch("/{roadmap_id}/steps/{step_id}", response_model=RoadmapResponse)
async def update_step(roadmap_id: str, step_id: str, payload: Dict[str, str]):
    new_status = payload.get("status", "completed")
    for phase in ROADMAP_STATE.phases:
        for step in phase.steps:
            if step.id == step_id:
                step.status = new_status
                if new_status == "completed":
                    step.completed_at = datetime.utcnow().isoformat()
    return ROADMAP_STATE
