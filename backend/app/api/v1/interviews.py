# ============================================
# SKILLSYNC AI — AI MOCK INTERVIEW API ROUTES
# ============================================
from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from datetime import datetime
import uuid
from app.schemas.all_schemas import (
    InterviewCreateRequest, InterviewResponse, InterviewQuestionResponse,
    InterviewEvaluation
)

router = APIRouter(prefix="/interviews", tags=["interviews"])

INTERVIEWS_STORE = {}


@router.post("", response_model=InterviewResponse)
async def create_interview(req: InterviewCreateRequest):
    iv_id = f"iv-{uuid.uuid4().hex[:8]}"
    questions = [
        InterviewQuestionResponse(
            id="q-1",
            question=f"Describe your strategy for building and deploying a scalable backend service in {req.role}.",
            category="System Architecture",
            difficulty="medium",
        ),
        InterviewQuestionResponse(
            id="q-2",
            question="How do you handle database migration, connection pooling, and latency spikes in production?",
            category="Databases & Resilience",
            difficulty="hard",
        ),
    ]

    iv = InterviewResponse(
        id=iv_id,
        role=req.role,
        type=req.type,
        experience_level=req.experience_level,
        questions=questions,
        status="in_progress",
        created_at=datetime.utcnow().isoformat(),
    )
    INTERVIEWS_STORE[iv_id] = iv
    return iv


@router.get("", response_model=List[InterviewResponse])
async def list_interviews():
    return list(INTERVIEWS_STORE.values())


@router.get("/{id}", response_model=InterviewResponse)
async def get_interview(id: str):
    iv = INTERVIEWS_STORE.get(id)
    if not iv:
        raise HTTPException(status_code=404, detail="Interview session not found")
    return iv


@router.post("/{id}/questions/{qid}/answer", response_model=InterviewQuestionResponse)
async def answer_question(id: str, qid: str, payload: Dict[str, str]):
    answer = payload.get("answer", "")
    words = len(answer.split())

    eval_obj = InterviewEvaluation(
        technical_correctness=min(95, max(60, 65 + words // 3)),
        relevance=min(95, max(65, 70 + words // 4)),
        completeness=min(90, max(55, 60 + words // 3)),
        clarity=85,
        overall_score=min(95, max(60, 70 + words // 4)),
        feedback="Answer provides a solid framework. Emphasize trade-offs and edge case handling for maximum evaluation score.",
        improvements=[
          "Provide concrete metrics or benchmarks",
          "Explain error recovery strategies",
          "Use STAR method for behavioral framing"
        ]
    )

    return InterviewQuestionResponse(
        id=qid,
        question="Interview question",
        category="Technical",
        difficulty="medium",
        answer=answer,
        evaluation=eval_obj,
    )


@router.post("/{id}/complete", response_model=InterviewResponse)
async def complete_interview(id: str):
    iv = INTERVIEWS_STORE.get(id)
    if not iv:
        raise HTTPException(status_code=404, detail="Interview not found")
    iv.status = "completed"
    iv.overall_score = 80
    iv.completed_at = datetime.utcnow().isoformat()
    return iv
