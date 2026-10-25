# ============================================
# SKILLSYNC AI — FASTAPI MAIN APPLICATION
# ============================================
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging

from app.core.config import settings
from app.api.v1 import (
    auth, resumes, jobs, skills, github, roadmap, challenges,
    interviews, market, dashboard
)

# Configure logging
logging.basicConfig(level=settings.LOG_LEVEL)
logger = logging.getLogger("skillsync")

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc",
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if settings.DEMO_MODE else settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled server error on {request.url.path}: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred. Please verify backend logs."}
    )

# Root Health Checks
@app.get("/health")
@app.get(f"{settings.API_V1_STR}/health")
async def health_check():
    return {
        "status": "healthy",
        "app": settings.PROJECT_NAME,
        "demo_mode": settings.DEMO_MODE,
        "ai_configured": bool(settings.OPENAI_API_KEY),
    }

# Include API v1 Routers
api_v1 = FastAPI()
api_v1.include_router(auth.router)
api_v1.include_router(resumes.router)
api_v1.include_router(jobs.router)
api_v1.include_router(skills.router)
api_v1.include_router(github.router)
api_v1.include_router(roadmap.router)
api_v1.include_router(challenges.router)
api_v1.include_router(interviews.router)
api_v1.include_router(market.router)
api_v1.include_router(dashboard.router)

app.mount(settings.API_V1_STR, api_v1)
