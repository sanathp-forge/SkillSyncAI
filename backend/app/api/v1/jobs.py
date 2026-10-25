# ============================================
# SKILLSYNC AI — JOBS & MATCHING API ROUTES
# ============================================
from fastapi import APIRouter, HTTPException
import uuid
from datetime import datetime
from typing import List
from app.schemas.all_schemas import (
    JobCreate, JobResponse, MatchRequest, MatchResultResponse
)
from app.services.job_service import job_service

router = APIRouter(prefix="/jobs", tags=["jobs"])

JOBS_STORE = {}
MATCHES_STORE = {}


@router.post("", response_model=JobResponse)
async def create_job(job_in: JobCreate):
    job_id = f"job-{uuid.uuid4().hex[:8]}"
    job_obj = JobResponse(
        id=job_id,
        title=job_in.title,
        description=job_in.description,
        company=job_in.company or "Company",
        created_at=datetime.utcnow().isoformat(),
    )
    JOBS_STORE[job_id] = job_obj
    return job_obj


@router.get("", response_model=List[JobResponse])
async def list_jobs():
    return list(JOBS_STORE.values())


@router.get("/{id}", response_model=JobResponse)
async def get_job(id: str):
    job = JOBS_STORE.get(id)
    if not job:
        raise HTTPException(status_code=404, detail="Job description not found")
    return job


@router.post("/match", response_model=MatchResultResponse)
async def match_job(match_req: MatchRequest):
    job = JOBS_STORE.get(match_req.job_id)
    desc = job.description if job else "React TypeScript Node.js PostgreSQL Docker"

    # Default candidate skills for matching
    skills = ["React", "TypeScript", "Python", "PostgreSQL", "Git"]
    result = job_service.match_resume_to_job(match_req.resume_id, match_req.job_id, desc, skills)
    MATCHES_STORE[result.id] = result
    return result


@router.get("/matches", response_model=List[MatchResultResponse])
async def get_matches():
    return list(MATCHES_STORE.values())
