# ============================================
# SKILLSYNC AI — PYDANTIC SCHEMAS
# ============================================
from typing import List, Optional, Dict, Any, Literal
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field


# ---- Auth & User ----
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    target_role: Optional[str] = None
    experience_level: Optional[str] = "junior"


class UserCreate(UserBase):
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(UserBase):
    id: str
    created_at: str

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# ---- Resume ----
class SkillExtraction(BaseModel):
    name: str
    category: str
    confidence: float
    evidence_source: str = "resume"
    evidence_snippet: Optional[str] = None


class ResumeSection(BaseModel):
    name: str
    score: int
    feedback: str
    present: bool


class Education(BaseModel):
    institution: str
    degree: str
    field: str
    year: Optional[str] = None
    gpa: Optional[str] = None


class Experience(BaseModel):
    company: str
    title: str
    duration: str
    description: str
    technologies: List[str] = []


class Project(BaseModel):
    name: str
    description: str
    technologies: List[str] = []
    url: Optional[str] = None


class Suggestion(BaseModel):
    section: str
    type: Literal["missing", "improvement", "warning"]
    message: str
    priority: Literal["high", "medium", "low"]


class ResumeAnalysisResponse(BaseModel):
    id: str
    resume_id: str
    overall_score: int
    sections: List[ResumeSection]
    skills: List[SkillExtraction]
    education: List[Education]
    experience: List[Experience]
    certifications: List[str] = []
    projects: List[Project] = []
    suggestions: List[Suggestion] = []
    summary: str
    analyzed_at: str


class ResumeResponse(BaseModel):
    id: str
    user_id: str
    filename: str
    uploaded_at: str
    status: str
    analysis: Optional[ResumeAnalysisResponse] = None


# ---- Job Matching ----
class JobCreate(BaseModel):
    title: str
    description: str
    company: Optional[str] = None


class JobResponse(BaseModel):
    id: str
    title: str
    description: str
    company: Optional[str] = None
    created_at: str


class SkillMatch(BaseModel):
    skill: str
    status: Literal["matched", "partial", "missing"]
    importance: Literal["required", "preferred", "nice_to_have"]
    resume_evidence: Optional[str] = None
    similarity_score: Optional[float] = None


class MatchRequest(BaseModel):
    resume_id: str
    job_id: str


class MatchResultResponse(BaseModel):
    id: str
    resume_id: str
    job_id: str
    overall_score: int
    skill_coverage: float
    experience_alignment: float
    education_alignment: float
    matching_skills: List[SkillMatch]
    partial_skills: List[SkillMatch]
    missing_skills: List[SkillMatch]
    recommendations: List[str]
    created_at: str


# ---- Skill Gaps & Dependencies ----
class SkillGapResponse(BaseModel):
    skill: str
    category: str
    importance: Literal["critical", "important", "recommended"]
    current_level: int
    required_level: int
    gap_score: int
    prerequisites: List[str] = []
    reason: str


# ---- GitHub & Evidence ----
class RepositoryResponse(BaseModel):
    id: str
    name: str
    full_name: str
    description: Optional[str] = None
    languages: Dict[str, int] = {}
    stars: int = 0
    forks: int = 0
    updated_at: str
    topics: List[str] = []
    has_tests: bool = False
    analysis_status: Optional[str] = "complete"


class SkillEvidenceResponse(BaseModel):
    id: str
    skill: str
    source: Literal["github", "assessment", "manual"]
    repository: Optional[str] = None
    file_path: Optional[str] = None
    evidence_type: str
    confidence: float
    description: str
    verified: bool
    created_at: str


# ---- Roadmap ----
class LearningResource(BaseModel):
    title: str
    url: str
    type: str
    provider: Optional[str] = None
    free: bool = True


class RoadmapStep(BaseModel):
    id: str
    skill: str
    reason: str
    prerequisites: List[str] = []
    resources: List[LearningResource] = []
    exercise: str
    completion_criteria: str
    estimated_hours: int
    status: Literal["completed", "in_progress", "not_started"]
    completed_at: Optional[str] = None


class RoadmapPhase(BaseModel):
    id: str
    name: str
    description: str
    order: int
    status: Literal["completed", "active", "upcoming"]
    progress: int
    steps: List[RoadmapStep]


class RoadmapResponse(BaseModel):
    id: str
    user_id: str
    target_role: str
    created_at: str
    updated_at: str
    phases: List[RoadmapPhase]
    overall_progress: int
    version: int


# ---- Coding Challenges ----
class TestCase(BaseModel):
    id: str
    input: str
    expected_output: str
    is_hidden: bool = False
    description: Optional[str] = None


class CodingChallengeResponse(BaseModel):
    id: str
    title: str
    description: str
    difficulty: Literal["easy", "medium", "hard"]
    language: Literal["python", "sql", "javascript"]
    skill: str
    instructions: str
    sample_input: Optional[str] = None
    sample_output: Optional[str] = None
    starter_code: str
    test_cases: List[TestCase]
    time_limit_minutes: int


class SubmissionRequest(BaseModel):
    code: str
    language: str


class TestResult(BaseModel):
    test_case_id: str
    passed: bool
    actual_output: Optional[str] = None


class CodingSubmissionResponse(BaseModel):
    id: str
    challenge_id: str
    code: str
    language: str
    status: Literal["pending", "running", "passed", "failed", "error"]
    results: List[TestResult]
    submitted_at: str
    is_demo_evaluation: bool = True


# ---- Interview ----
class InterviewEvaluation(BaseModel):
    technical_correctness: int
    relevance: int
    completeness: int
    clarity: int
    overall_score: int
    feedback: str
    improvements: List[str]


class InterviewQuestionResponse(BaseModel):
    id: str
    question: str
    category: str
    difficulty: str
    answer: Optional[str] = None
    evaluation: Optional[InterviewEvaluation] = None


class InterviewCreateRequest(BaseModel):
    role: str
    type: Literal["technical", "behavioral", "system_design"] = "technical"
    experience_level: str = "junior"


class InterviewResponse(BaseModel):
    id: str
    role: str
    type: str
    experience_level: str
    questions: List[InterviewQuestionResponse]
    status: str
    overall_score: Optional[int] = None
    created_at: str
    completed_at: Optional[str] = None


# ---- Market & Dashboard ----
class MarketInsight(BaseModel):
    skill: str
    demand_count: int
    trend: str
    avg_salary_range: Optional[str] = None
    category: str
    data_source: str
    last_updated: str


class MarketOverviewResponse(BaseModel):
    total_jobs_analyzed: int
    top_skills: List[MarketInsight]
    trending_skills: List[MarketInsight]
    data_freshness: str
    sources: List[str]
    is_demo_data: bool


class DashboardDataResponse(BaseModel):
    resume_status: str
    target_role: Optional[str] = None
    match_score: Optional[int] = None
    skill_coverage: Optional[int] = None
    evidence_coverage: Optional[int] = None
    missing_skills_count: int
    roadmap_progress: Optional[int] = None
    completed_milestones: int
    total_milestones: int
    challenges_completed: int
    challenges_total: int
    interview_avg_score: Optional[int] = None
    interviews_completed: int
    recent_activity: List[Dict[str, Any]]
    recommendations: List[Dict[str, Any]]
    is_demo_data: bool
