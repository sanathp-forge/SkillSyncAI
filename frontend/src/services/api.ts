// ============================================
// SKILLSYNC AI — API SERVICE
// ============================================
import type {
  User, LoginRequest, RegisterRequest, Resume, ResumeAnalysis,
  JobDescription, MatchResult, GitHubConnection, Repository, SkillEvidence,
  SkillGap, Roadmap, CodingChallenge, CodingSubmission, Interview,
  InterviewQuestion, MarketOverview, DashboardData
} from '@/types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api/v1';
const IS_DEMO = import.meta.env.VITE_DEMO_MODE === 'true';

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('skillsync_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string> || {}),
  };

  // Remove Content-Type for FormData
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  try {
    const response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let detail = 'An error occurred';
      try {
        const errorJson = await response.json();
        detail = errorJson.detail || errorJson.message || detail;
      } catch {
        const text = await response.text().catch(() => '');
        if (response.status === 500 || response.status === 502 || response.status === 504 || text.includes('proxy error') || text.includes('ECONNREFUSED')) {
          detail = 'Backend service is currently offline or unreachable';
        } else if (text) {
          detail = text.slice(0, 100);
        } else {
          detail = `Request failed (${response.status})`;
        }
      }
      throw new ApiError(detail, response.status);
    }

    if (response.status === 204) return undefined as T;
    return response.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (IS_DEMO) {
      console.warn(`[Demo Mode] API call to ${path} failed, using demo data`);
      throw new ApiError('Backend not available — running in demo mode', 503);
    }
    throw new ApiError('Network error — please check your connection', 0);
  }
}

async function uploadFile<T>(path: string, file: File, fieldName = 'file'): Promise<T> {
  const formData = new FormData();
  formData.append(fieldName, file);
  return request<T>(path, { method: 'POST', body: formData });
}

// ---- Auth API ----
export const authApi = {
  login: (data: LoginRequest) => request<{ access_token: string; user: User }>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  register: (data: RegisterRequest) => request<{ access_token: string; user: User }>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  me: () => request<User>('/auth/me'),
  updateProfile: (data: Partial<User>) => request<User>('/auth/profile', { method: 'PATCH', body: JSON.stringify(data) }),
  logout: () => { localStorage.removeItem('skillsync_token'); },
};

// ---- Resume API ----
export const resumeApi = {
  upload: (file: File) => uploadFile<Resume>('/resumes/upload', file),
  analyzeText: (text: string, filename?: string) => request<ResumeAnalysis>('/resumes/analyze-text', { method: 'POST', body: JSON.stringify({ text, filename }) }),
  getLatest: () => request<ResumeAnalysis>('/resumes/analysis/latest'),
  list: () => request<Resume[]>('/resumes'),
  get: (id: string) => request<Resume>(`/resumes/${id}`),
  getAnalysis: (id: string) => request<ResumeAnalysis>(`/resumes/${id}/analysis`),
  delete: (id: string) => request<void>(`/resumes/${id}`, { method: 'DELETE' }),
};

// ---- System / Health API ----
export const systemApi = {
  checkHealth: () => request<{ status: string; app: string; demo_mode: boolean; ai_configured: boolean }>('/health'),
};


// ---- Job API ----
export const jobApi = {
  create: (data: Partial<JobDescription>) => request<JobDescription>('/jobs', { method: 'POST', body: JSON.stringify(data) }),
  list: () => request<JobDescription[]>('/jobs'),
  get: (id: string) => request<JobDescription>(`/jobs/${id}`),
  match: (resumeId: string, jobId: string) => request<MatchResult>('/jobs/match', { method: 'POST', body: JSON.stringify({ resume_id: resumeId, job_id: jobId }) }),
  getMatches: () => request<MatchResult[]>('/jobs/matches'),
};

// ---- GitHub API ----
export const githubApi = {
  getConnection: () => request<GitHubConnection>('/github/status'),
  getAuthUrl: () => request<{ url: string }>('/github/auth-url'),
  callback: (code: string) => request<GitHubConnection>('/github/callback', { method: 'POST', body: JSON.stringify({ code }) }),
  disconnect: () => request<void>('/github/disconnect', { method: 'POST' }),
  getRepositories: () => request<Repository[]>('/github/repositories'),
  analyzeRepo: (repoName: string) => request<SkillEvidence[]>('/github/analyze', { method: 'POST', body: JSON.stringify({ repository: repoName }) }),
  getEvidence: () => request<SkillEvidence[]>('/github/evidence'),
};

// ---- Skill Gap API ----
export const skillGapApi = {
  analyze: (targetRole: string) => request<SkillGap[]>('/skills/gaps', { method: 'POST', body: JSON.stringify({ target_role: targetRole }) }),
  getDependencyGraph: (targetRole: string) => request<{ nodes: any[]; edges: any[] }>(`/skills/graph?role=${encodeURIComponent(targetRole)}`),
};

// ---- Roadmap API ----
export const roadmapApi = {
  generate: (targetRole: string) => request<Roadmap>('/roadmap/generate', { method: 'POST', body: JSON.stringify({ target_role: targetRole }) }),
  getCurrent: () => request<Roadmap>('/roadmap/current'),
  updateStep: (roadmapId: string, stepId: string, status: string) => request<Roadmap>(`/roadmap/${roadmapId}/steps/${stepId}`, { method: 'PATCH', body: JSON.stringify({ status }) }),
};

// ---- Challenge API ----
export const challengeApi = {
  list: (skill?: string, difficulty?: string) => request<CodingChallenge[]>(`/challenges?${new URLSearchParams({ ...(skill ? { skill } : {}), ...(difficulty ? { difficulty } : {}) })}`),
  get: (id: string) => request<CodingChallenge>(`/challenges/${id}`),
  submit: (challengeId: string, code: string, language: string) => request<CodingSubmission>(`/challenges/${challengeId}/submit`, { method: 'POST', body: JSON.stringify({ code, language }) }),
  getSubmissions: (challengeId: string) => request<CodingSubmission[]>(`/challenges/${challengeId}/submissions`),
};

// ---- Interview API ----
export const interviewApi = {
  create: (role: string, type: 'technical' | 'behavioral', level: string) => request<Interview>('/interviews', { method: 'POST', body: JSON.stringify({ role, type, experience_level: level }) }),
  list: () => request<Interview[]>('/interviews'),
  get: (id: string) => request<Interview>(`/interviews/${id}`),
  submitAnswer: (interviewId: string, questionId: string, answer: string) => request<InterviewQuestion>(`/interviews/${interviewId}/questions/${questionId}/answer`, { method: 'POST', body: JSON.stringify({ answer }) }),
  complete: (id: string) => request<Interview>(`/interviews/${id}/complete`, { method: 'POST' }),
};

// ---- Market API ----
export const marketApi = {
  getOverview: () => request<MarketOverview>('/market/overview'),
  importCsv: (file: File) => uploadFile<{ imported: number }>('/market/import', file),
};

// ---- Dashboard API ----
export const dashboardApi = {
  getData: () => request<DashboardData>('/dashboard'),
};

export { ApiError as ApiServiceError };
