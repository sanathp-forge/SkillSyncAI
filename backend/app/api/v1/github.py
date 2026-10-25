# ============================================
# SKILLSYNC AI — GITHUB & EVIDENCE API ROUTES
# ============================================
from fastapi import APIRouter
from typing import List, Dict, Any
from datetime import datetime
from app.schemas.all_schemas import RepositoryResponse, SkillEvidenceResponse

router = APIRouter(prefix="/github", tags=["github"])


@router.get("/status")
async def get_github_status():
    return {
        "connected": True,
        "username": "developer-demo",
        "avatar_url": "https://avatars.githubusercontent.com/u/9919?v=4",
        "connected_at": datetime.utcnow().isoformat(),
    }


@router.get("/auth-url")
async def get_auth_url():
    return {"url": "https://github.com/login/oauth/authorize?client_id=demo&scope=read:user,repo"}


@router.post("/callback")
async def github_callback(payload: Dict[str, str]):
    return {
        "connected": True,
        "username": "developer-demo",
        "avatar_url": "https://avatars.githubusercontent.com/u/9919?v=4",
        "connected_at": datetime.utcnow().isoformat(),
    }


@router.post("/disconnect")
async def disconnect_github():
    return {"status": "disconnected"}


@router.get("/repositories", response_model=List[RepositoryResponse])
async def list_repositories():
    return [
        RepositoryResponse(
            id="repo-1",
            name="fullstack-commerce",
            full_name="developer/fullstack-commerce",
            description="Production e-commerce application with React, Node.js, and PostgreSQL.",
            languages={"TypeScript": 45000, "JavaScript": 12000, "CSS": 6000},
            stars=14,
            forks=3,
            updated_at=datetime.utcnow().isoformat(),
            topics=["react", "typescript", "postgres"],
            has_tests=True,
            analysis_status="complete",
        ),
        RepositoryResponse(
            id="repo-2",
            name="fastapi-task-service",
            full_name="developer/fastapi-task-service",
            description="Async RESTful task processing microservice built with FastAPI and Redis.",
            languages={"Python": 38000, "Dockerfile": 2000},
            stars=22,
            forks=5,
            updated_at=datetime.utcnow().isoformat(),
            topics=["python", "fastapi", "docker", "redis"],
            has_tests=True,
            analysis_status="complete",
        ),
    ]


@router.post("/analyze", response_model=List[SkillEvidenceResponse])
async def analyze_repository(payload: Dict[str, str]):
    repo = payload.get("repository", "fullstack-commerce")
    return [
        SkillEvidenceResponse(
            id="ev-new-1",
            skill="React",
            source="github",
            repository=repo,
            file_path="src/App.tsx",
            evidence_type="code_usage",
            confidence=0.92,
            description=f"Extracted component hierarchy in {repo}",
            verified=True,
            created_at=datetime.utcnow().isoformat(),
        ),
        SkillEvidenceResponse(
            id="ev-new-2",
            skill="TypeScript",
            source="github",
            repository=repo,
            file_path="tsconfig.json",
            evidence_type="dependency",
            confidence=0.95,
            description=f"Configured compiler options and strict typing in {repo}",
            verified=True,
            created_at=datetime.utcnow().isoformat(),
        ),
    ]


@router.get("/evidence", response_model=List[SkillEvidenceResponse])
async def get_evidence():
    return [
        SkillEvidenceResponse(
            id="ev-1",
            skill="React",
            source="github",
            repository="developer/fullstack-commerce",
            file_path="src/components/ProductList.tsx",
            evidence_type="code_usage",
            confidence=0.92,
            description="Built custom React hooks and component composition.",
            verified=True,
            created_at=datetime.utcnow().isoformat(),
        ),
        SkillEvidenceResponse(
            id="ev-2",
            skill="TypeScript",
            source="github",
            repository="developer/fullstack-commerce",
            file_path="tsconfig.json",
            evidence_type="dependency",
            confidence=0.95,
            description="Configured strict TypeScript types throughout application.",
            verified=True,
            created_at=datetime.utcnow().isoformat(),
        ),
        SkillEvidenceResponse(
            id="ev-3",
            skill="Python",
            source="github",
            repository="developer/fastapi-task-service",
            file_path="app/main.py",
            evidence_type="code_usage",
            confidence=0.90,
            description="Engineered asynchronous endpoints with Pydantic validation.",
            verified=True,
            created_at=datetime.utcnow().isoformat(),
        ),
        SkillEvidenceResponse(
            id="ev-4",
            skill="REST APIs",
            source="assessment",
            evidence_type="test_coverage",
            confidence=0.88,
            description="Completed practical REST API Design coding challenge with 100% test pass rate.",
            verified=True,
            created_at=datetime.utcnow().isoformat(),
        ),
    ]
