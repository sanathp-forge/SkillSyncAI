# ============================================
# SKILLSYNC AI — RESUMES API ROUTES
# ============================================
from fastapi import APIRouter, UploadFile, File, HTTPException
import uuid
from datetime import datetime
from typing import List
from app.schemas.all_schemas import ResumeResponse, ResumeAnalysisResponse
from app.services.resume_service import resume_service

router = APIRouter(prefix="/resumes", tags=["resumes"])

RESUMES_STORE = {}
ANALYSIS_STORE = {}


@router.post("/upload", response_model=ResumeResponse)
async def upload_resume(file: UploadFile = File(...)):
    # Validate file format and size
    if not (file.filename.endswith(".pdf") or file.filename.endswith(".docx") or file.filename.endswith(".txt")):
        raise HTTPException(status_code=400, detail="Supported file formats: PDF, DOCX, TXT")

    contents = await file.read()
    if len(contents) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File size exceeds 10MB limit")

    resume_id = f"res-{uuid.uuid4().hex[:8]}"

    # Extract text
    if file.filename.endswith(".pdf"):
        text = resume_service.extract_text_from_pdf(contents)
    else:
        text = contents.decode("utf-8", errors="ignore")

    analysis = resume_service.analyze_resume(text, resume_id)
    ANALYSIS_STORE[resume_id] = analysis

    res_obj = ResumeResponse(
        id=resume_id,
        user_id="demo-user-1",
        filename=file.filename,
        uploaded_at=datetime.utcnow().isoformat(),
        status="analyzed",
        analysis=analysis,
    )
    RESUMES_STORE[resume_id] = res_obj
    return res_obj


from pydantic import BaseModel
from typing import Optional

class AnalyzeTextRequest(BaseModel):
    text: str
    filename: Optional[str] = "Pasted Resume Text"

@router.post("/analyze-text", response_model=ResumeAnalysisResponse)
async def analyze_text_endpoint(payload: AnalyzeTextRequest):
    resume_id = f"res-{uuid.uuid4().hex[:8]}"
    analysis = resume_service.analyze_resume(payload.text, resume_id)
    ANALYSIS_STORE[resume_id] = analysis
    ANALYSIS_STORE["latest"] = analysis
    return analysis


@router.get("/analysis/latest", response_model=ResumeAnalysisResponse)
async def get_latest_analysis():
    if "latest" in ANALYSIS_STORE:
        return ANALYSIS_STORE["latest"]
    if ANALYSIS_STORE:
        return list(ANALYSIS_STORE.values())[-1]
    # Return initialized baseline
    default_text = "Senior Software Engineer proficient in React, TypeScript, Python, FastAPI, Docker, PostgreSQL, AWS, Git and System Design."
    default_analysis = resume_service.analyze_resume(default_text, "res-latest")
    ANALYSIS_STORE["latest"] = default_analysis
    return default_analysis



@router.get("", response_model=List[ResumeResponse])
async def list_resumes():
    return list(RESUMES_STORE.values())


@router.get("/{id}", response_model=ResumeResponse)
async def get_resume(id: str):
    res = RESUMES_STORE.get(id)
    if not res:
        raise HTTPException(status_code=404, detail="Resume not found")
    return res


@router.get("/{id}/analysis", response_model=ResumeAnalysisResponse)
async def get_analysis(id: str):
    analysis = ANALYSIS_STORE.get(id)
    if not analysis:
        # Return fallback demo analysis
        return resume_service.analyze_resume("Python React TypeScript PostgreSQL Docker", id)
    return analysis


@router.delete("/{id}", status_code=204)
async def delete_resume(id: str):
    RESUMES_STORE.pop(id, None)
    ANALYSIS_STORE.pop(id, None)
    return None
