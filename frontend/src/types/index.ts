// ============================================
// SKILLSYNC AI — TYPE DEFINITIONS
// ============================================

// ---- User & Auth ----
export interface User {
  id: string;
  email: string;
  full_name: string;
  target_role?: string;
  experience_level?: 'student' | 'fresh_graduate' | 'junior' | 'mid' | 'senior';
  avatar_url?: string;
  created_at: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
}

// ---- Resume ----
export interface Resume {
  id: string;
  user_id: string;
  filename: string;
  uploaded_at: string;
  status: 'uploaded' | 'processing' | 'analyzed' | 'error';
  analysis?: ResumeAnalysis;
}

export interface ResumeAnalysis {
  id: string;
  resume_id: string;
  overall_score: number;
  sections: ResumeSection[];
  skills: ExtractedSkill[];
  education: Education[];
  experience: Experience[];
  certifications: string[];
  projects: Project[];
  suggestions: Suggestion[];
  summary: string;
  analyzed_at: string;
}

export interface ResumeSection {
  name: string;
  score: number;
  feedback: string;
  present: boolean;
}

export interface ExtractedSkill {
  name: string;
  category: SkillCategory;
  confidence: number;
  evidence_source: 'resume' | 'github' | 'assessment';
  evidence_snippet?: string;
}

export type SkillCategory =
  | 'programming_language'
  | 'framework'
  | 'database'
  | 'cloud'
  | 'devops'
  | 'ai_ml'
  | 'soft_skill'
  | 'tool'
  | 'other';

export interface Education {
  institution: string;
  degree: string;
  field: string;
  year?: string;
  gpa?: string;
}

export interface Experience {
  company: string;
  title: string;
  duration: string;
  description: string;
  technologies: string[];
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  url?: string;
}

export interface Suggestion {
  section: string;
  type: 'missing' | 'improvement' | 'warning';
  message: string;
  priority: 'high' | 'medium' | 'low';
}

// ---- Job Matching ----
export interface JobDescription {
  id: string;
  title: string;
  company?: string;
  description: string;
  requirements: JobRequirement[];
  created_at: string;
}

export interface JobRequirement {
  skill: string;
  category: SkillCategory;
  importance: 'required' | 'preferred' | 'nice_to_have';
  experience_years?: number;
}

export interface MatchResult {
  id: string;
  resume_id: string;
  job_id: string;
  overall_score: number;
  skill_coverage: number;
  experience_alignment: number;
  education_alignment: number;
  matching_skills: SkillMatch[];
  missing_skills: SkillMatch[];
  partial_skills: SkillMatch[];
  recommendations: string[];
  created_at: string;
}

export interface SkillMatch {
  skill: string;
  status: 'matched' | 'partial' | 'missing';
  importance: 'required' | 'preferred' | 'nice_to_have';
  resume_evidence?: string;
  similarity_score?: number;
}

// ---- GitHub Evidence ----
export interface GitHubConnection {
  connected: boolean;
  username?: string;
  avatar_url?: string;
  connected_at?: string;
}

export interface Repository {
  id: string;
  name: string;
  full_name: string;
  description?: string;
  language?: string;
  languages: Record<string, number>;
  stars: number;
  forks: number;
  updated_at: string;
  topics: string[];
  has_tests: boolean;
  analysis_status?: 'pending' | 'analyzing' | 'complete' | 'error';
}

export interface SkillEvidence {
  id: string;
  skill: string;
  source: 'github' | 'assessment' | 'manual';
  repository?: string;
  file_path?: string;
  evidence_type: 'code_usage' | 'dependency' | 'test_coverage' | 'documentation' | 'project_structure';
  confidence: number;
  description: string;
  verified: boolean;
  created_at: string;
}

// ---- Skill Gap ----
export interface SkillGap {
  skill: string;
  category: SkillCategory;
  importance: 'critical' | 'important' | 'recommended';
  current_level: number;
  required_level: number;
  gap_score: number;
  prerequisites: string[];
  reason: string;
}

export interface SkillNode {
  id: string;
  skill: string;
  category: SkillCategory;
  status: 'mastered' | 'in_progress' | 'not_started' | 'prerequisite_needed';
  level: number;
  dependencies: string[];
}

export interface SkillEdge {
  source: string;
  target: string;
  type: 'prerequisite' | 'related' | 'recommended';
}

// ---- Roadmap ----
export interface Roadmap {
  id: string;
  user_id: string;
  target_role: string;
  created_at: string;
  updated_at: string;
  phases: RoadmapPhase[];
  overall_progress: number;
  version: number;
}

export interface RoadmapPhase {
  id: string;
  name: string;
  description: string;
  order: number;
  status: 'completed' | 'active' | 'upcoming';
  progress: number;
  steps: RoadmapStep[];
}

export interface RoadmapStep {
  id: string;
  skill: string;
  reason: string;
  prerequisites: string[];
  resources: LearningResource[];
  exercise: string;
  completion_criteria: string;
  estimated_hours: number;
  status: 'completed' | 'in_progress' | 'not_started';
  completed_at?: string;
}

export interface LearningResource {
  title: string;
  url: string;
  type: 'documentation' | 'tutorial' | 'course' | 'video' | 'book' | 'practice';
  provider?: string;
  free: boolean;
}

// ---- Coding Challenges ----
export interface CodingChallenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  language: 'python' | 'sql' | 'javascript';
  skill: string;
  instructions: string;
  sample_input?: string;
  sample_output?: string;
  starter_code: string;
  test_cases: TestCase[];
  time_limit_minutes: number;
}

export interface TestCase {
  id: string;
  input: string;
  expected_output: string;
  is_hidden: boolean;
  description?: string;
}

export interface CodingSubmission {
  id: string;
  challenge_id: string;
  code: string;
  language: string;
  status: 'pending' | 'running' | 'passed' | 'failed' | 'error' | 'timeout';
  results: TestResult[];
  submitted_at: string;
  execution_time_ms?: number;
  is_demo_evaluation: boolean;
}

export interface TestResult {
  test_case_id: string;
  passed: boolean;
  actual_output?: string;
  error?: string;
  execution_time_ms?: number;
}

// ---- Mock Interview ----
export interface Interview {
  id: string;
  role: string;
  type: 'technical' | 'behavioral';
  experience_level: string;
  questions: InterviewQuestion[];
  status: 'in_progress' | 'completed';
  overall_score?: number;
  created_at: string;
  completed_at?: string;
}

export interface InterviewQuestion {
  id: string;
  question: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  answer?: string;
  evaluation?: InterviewEvaluation;
}

export interface InterviewEvaluation {
  technical_correctness: number;
  relevance: number;
  completeness: number;
  clarity: number;
  overall_score: number;
  feedback: string;
  improvements: string[];
}

// ---- Job Market ----
export interface MarketInsight {
  skill: string;
  demand_count: number;
  trend: 'rising' | 'stable' | 'declining';
  avg_salary_range?: string;
  category: SkillCategory;
  data_source: string;
  last_updated: string;
}

export interface MarketOverview {
  total_jobs_analyzed: number;
  top_skills: MarketInsight[];
  trending_skills: MarketInsight[];
  data_freshness: string;
  sources: string[];
  is_demo_data: boolean;
}

// ---- Dashboard ----
export interface DashboardData {
  resume_status: 'not_uploaded' | 'processing' | 'analyzed';
  target_role?: string;
  match_score?: number;
  skill_coverage?: number;
  evidence_coverage?: number;
  missing_skills_count: number;
  roadmap_progress?: number;
  completed_milestones: number;
  total_milestones: number;
  challenges_completed: number;
  challenges_total: number;
  interview_avg_score?: number;
  interviews_completed: number;
  recent_activity: ActivityItem[];
  recommendations: Recommendation[];
  is_demo_data: boolean;
}

export interface ActivityItem {
  id: string;
  type: 'resume_upload' | 'job_match' | 'evidence_found' | 'challenge_completed' | 'interview_completed' | 'roadmap_updated';
  title: string;
  description: string;
  timestamp: string;
}

export interface Recommendation {
  id: string;
  type: 'skill_gap' | 'challenge' | 'interview' | 'resource';
  title: string;
  description: string;
  action_label: string;
  action_link: string;
  priority: 'high' | 'medium' | 'low';
}

// ---- API ----
export interface ApiError {
  detail: string;
  status_code: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}
