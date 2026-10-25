// ============================================
// SKILLSYNC AI — DEMO DATA
// Clearly labelled sample data for development
// and when the backend is not available
// ============================================
import type {
  DashboardData, ResumeAnalysis, MatchResult, SkillGap,
  Roadmap, CodingChallenge, Interview, MarketOverview, SkillEvidence, Repository
} from '@/types';

export const DEMO_LABEL = '⚠️ Demo Data — Connect backend for real results';

export const demoDashboard: DashboardData = {
  resume_status: 'analyzed',
  target_role: 'Full-Stack Developer',
  match_score: 72,
  skill_coverage: 68,
  evidence_coverage: 45,
  missing_skills_count: 7,
  roadmap_progress: 35,
  completed_milestones: 4,
  total_milestones: 12,
  challenges_completed: 3,
  challenges_total: 8,
  interview_avg_score: 74,
  interviews_completed: 2,
  recent_activity: [
    { id: '1', type: 'resume_upload', title: 'Resume Analyzed', description: 'Your resume scored 78/100 for Full-Stack Developer roles', timestamp: new Date(Date.now() - 3600000).toISOString() },
    { id: '2', type: 'job_match', title: 'Job Matched', description: 'Senior React Developer at TechCorp — 72% match', timestamp: new Date(Date.now() - 7200000).toISOString() },
    { id: '3', type: 'evidence_found', title: 'Skill Evidence Found', description: 'React evidence verified from 3 GitHub repositories', timestamp: new Date(Date.now() - 86400000).toISOString() },
    { id: '4', type: 'challenge_completed', title: 'Challenge Completed', description: 'Passed "REST API Design" coding challenge', timestamp: new Date(Date.now() - 172800000).toISOString() },
    { id: '5', type: 'interview_completed', title: 'Mock Interview Done', description: 'Technical interview scored 78/100', timestamp: new Date(Date.now() - 259200000).toISOString() },
  ],
  recommendations: [
    { id: '1', type: 'skill_gap', title: 'Learn Docker & Containerization', description: 'Docker is required in 85% of full-stack developer job postings', action_label: 'View Roadmap', action_link: '/app/roadmap', priority: 'high' },
    { id: '2', type: 'challenge', title: 'Try SQL Join Challenge', description: 'Strengthen your database skills with practical exercises', action_label: 'Start Challenge', action_link: '/app/challenges', priority: 'medium' },
    { id: '3', type: 'interview', title: 'Practice System Design', description: 'System design is a common interview topic for mid-level roles', action_label: 'Start Interview', action_link: '/app/interviews', priority: 'medium' },
  ],
  is_demo_data: true,
};

export const demoResumeAnalysis: ResumeAnalysis = {
  id: 'demo-analysis-1',
  resume_id: 'demo-resume-1',
  overall_score: 78,
  sections: [
    { name: 'Contact Information', score: 95, feedback: 'Complete contact information with email, phone, and LinkedIn.', present: true },
    { name: 'Professional Summary', score: 70, feedback: 'Summary could be more targeted to specific roles. Consider mentioning key technologies.', present: true },
    { name: 'Work Experience', score: 82, feedback: 'Good use of action verbs. Consider adding metrics and quantifiable achievements.', present: true },
    { name: 'Education', score: 90, feedback: 'Education section is well-structured.', present: true },
    { name: 'Skills', score: 75, feedback: 'Consider categorizing skills by proficiency level. Add more cloud and DevOps skills.', present: true },
    { name: 'Projects', score: 65, feedback: 'Projects section could be expanded with more technical details and outcomes.', present: true },
    { name: 'Certifications', score: 0, feedback: 'No certifications listed. Consider adding relevant certifications.', present: false },
  ],
  skills: [
    { name: 'Python', category: 'programming_language', confidence: 0.92, evidence_source: 'resume', evidence_snippet: '3 years of Python development' },
    { name: 'React', category: 'framework', confidence: 0.88, evidence_source: 'resume', evidence_snippet: 'Built responsive UIs with React and TypeScript' },
    { name: 'TypeScript', category: 'programming_language', confidence: 0.85, evidence_source: 'resume', evidence_snippet: 'TypeScript for frontend and backend projects' },
    { name: 'Node.js', category: 'framework', confidence: 0.80, evidence_source: 'resume', evidence_snippet: 'REST APIs with Node.js and Express' },
    { name: 'PostgreSQL', category: 'database', confidence: 0.78, evidence_source: 'resume', evidence_snippet: 'Database design and optimization' },
    { name: 'Git', category: 'tool', confidence: 0.90, evidence_source: 'resume', evidence_snippet: 'Version control with Git' },
    { name: 'AWS', category: 'cloud', confidence: 0.55, evidence_source: 'resume', evidence_snippet: 'Basic AWS services' },
    { name: 'Docker', category: 'devops', confidence: 0.45, evidence_source: 'resume', evidence_snippet: 'Docker containerization' },
  ],
  education: [
    { institution: 'State University', degree: 'Bachelor of Science', field: 'Computer Science', year: '2023', gpa: '3.6' },
  ],
  experience: [
    { company: 'TechStartup Inc', title: 'Junior Full-Stack Developer', duration: '2023 - Present', description: 'Building web applications with React and Python', technologies: ['React', 'Python', 'PostgreSQL', 'AWS'] },
    { company: 'University Lab', title: 'Research Assistant', duration: '2022 - 2023', description: 'ML research and data analysis', technologies: ['Python', 'TensorFlow', 'Pandas'] },
  ],
  certifications: [],
  projects: [
    { name: 'E-commerce Platform', description: 'Full-stack e-commerce with React, Node.js, and Stripe', technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'] },
    { name: 'ML Image Classifier', description: 'Image classification model with 95% accuracy', technologies: ['Python', 'TensorFlow', 'OpenCV'] },
  ],
  suggestions: [
    { section: 'Skills', type: 'improvement', message: 'Add proficiency levels (beginner/intermediate/advanced) to your skills section', priority: 'medium' },
    { section: 'Certifications', type: 'missing', message: 'Consider adding AWS Cloud Practitioner or Docker certification', priority: 'high' },
    { section: 'Experience', type: 'improvement', message: 'Quantify your achievements with metrics (e.g., "reduced load time by 40%")', priority: 'high' },
    { section: 'Projects', type: 'improvement', message: 'Add links to live demos or GitHub repositories', priority: 'medium' },
    { section: 'Summary', type: 'improvement', message: 'Tailor your summary to your target role with specific technologies', priority: 'low' },
  ],
  summary: 'Resume demonstrates solid foundational skills in full-stack development with React and Python. Strong academic background with relevant projects. Areas for improvement include cloud/DevOps skills, quantifiable achievements, and professional certifications.',
  analyzed_at: new Date().toISOString(),
};

export const demoMatchResult: MatchResult = {
  id: 'demo-match-1',
  resume_id: 'demo-resume-1',
  job_id: 'demo-job-1',
  overall_score: 72,
  skill_coverage: 0.68,
  experience_alignment: 0.75,
  education_alignment: 0.85,
  matching_skills: [
    { skill: 'React', status: 'matched', importance: 'required', resume_evidence: 'Built responsive UIs with React', similarity_score: 0.95 },
    { skill: 'TypeScript', status: 'matched', importance: 'required', resume_evidence: 'TypeScript for frontend and backend', similarity_score: 0.92 },
    { skill: 'Python', status: 'matched', importance: 'preferred', resume_evidence: '3 years Python development', similarity_score: 0.90 },
    { skill: 'PostgreSQL', status: 'matched', importance: 'required', resume_evidence: 'Database design and optimization', similarity_score: 0.88 },
    { skill: 'Git', status: 'matched', importance: 'required', resume_evidence: 'Version control with Git', similarity_score: 0.95 },
  ],
  partial_skills: [
    { skill: 'AWS', status: 'partial', importance: 'required', resume_evidence: 'Basic AWS services', similarity_score: 0.55 },
    { skill: 'Docker', status: 'partial', importance: 'preferred', resume_evidence: 'Docker containerization', similarity_score: 0.45 },
  ],
  missing_skills: [
    { skill: 'Kubernetes', status: 'missing', importance: 'preferred', similarity_score: 0 },
    { skill: 'CI/CD', status: 'missing', importance: 'required', similarity_score: 0 },
    { skill: 'GraphQL', status: 'missing', importance: 'nice_to_have', similarity_score: 0 },
    { skill: 'Redis', status: 'missing', importance: 'preferred', similarity_score: 0 },
    { skill: 'Terraform', status: 'missing', importance: 'nice_to_have', similarity_score: 0 },
  ],
  recommendations: [
    'Focus on CI/CD — this is a required skill that\'s currently missing from your profile',
    'Deepen your AWS knowledge — move from basic to intermediate level',
    'Learn Docker Compose and container orchestration to complement your Docker skills',
    'Consider adding Kubernetes to your skill set for container orchestration',
  ],
  created_at: new Date().toISOString(),
};

export const demoSkillGaps: SkillGap[] = [
  { skill: 'CI/CD', category: 'devops', importance: 'critical', current_level: 0, required_level: 7, gap_score: 7, prerequisites: ['Git', 'Docker'], reason: 'Required in 92% of full-stack developer positions' },
  { skill: 'Docker', category: 'devops', importance: 'critical', current_level: 3, required_level: 7, gap_score: 4, prerequisites: ['Linux Basics'], reason: 'Container skills essential for modern deployment' },
  { skill: 'AWS', category: 'cloud', importance: 'important', current_level: 3, required_level: 7, gap_score: 4, prerequisites: ['Networking Basics', 'Docker'], reason: 'Most requested cloud platform' },
  { skill: 'Kubernetes', category: 'devops', importance: 'important', current_level: 0, required_level: 5, gap_score: 5, prerequisites: ['Docker', 'Networking'], reason: 'Growing demand for orchestration skills' },
  { skill: 'GraphQL', category: 'framework', importance: 'recommended', current_level: 0, required_level: 5, gap_score: 5, prerequisites: ['REST APIs', 'Node.js'], reason: 'Increasingly preferred over REST for complex APIs' },
  { skill: 'Redis', category: 'database', importance: 'recommended', current_level: 0, required_level: 5, gap_score: 5, prerequisites: ['Database Fundamentals'], reason: 'Common caching and session management solution' },
  { skill: 'System Design', category: 'other', importance: 'important', current_level: 2, required_level: 7, gap_score: 5, prerequisites: ['Databases', 'APIs', 'Cloud'], reason: 'Key interview topic for mid to senior roles' },
];

export const demoRoadmap: Roadmap = {
  id: 'demo-roadmap-1',
  user_id: 'demo-user',
  target_role: 'Full-Stack Developer',
  created_at: new Date(Date.now() - 604800000).toISOString(),
  updated_at: new Date().toISOString(),
  overall_progress: 35,
  version: 1,
  phases: [
    {
      id: 'p1', name: 'Foundation', description: 'Core infrastructure and DevOps basics', order: 1, status: 'active', progress: 75,
      steps: [
        {
          id: 's1', skill: 'Linux Fundamentals', reason: 'Foundation for Docker and cloud services', prerequisites: [],
          resources: [
            { title: 'Linux Command Line Basics', url: 'https://linuxcommand.org/', type: 'tutorial', free: true },
            { title: 'The Linux Command Line (book)', url: 'https://linuxcommand.org/tlcl.php', type: 'book', free: true },
          ],
          exercise: 'Set up a Linux VM and configure a web server from scratch',
          completion_criteria: 'Navigate filesystem, manage processes, and configure services',
          estimated_hours: 15, status: 'completed', completed_at: new Date(Date.now() - 432000000).toISOString(),
        },
        {
          id: 's2', skill: 'Docker', reason: 'Container skills required for deployment', prerequisites: ['Linux Fundamentals'],
          resources: [
            { title: 'Docker Official Getting Started', url: 'https://docs.docker.com/get-started/', type: 'documentation', free: true },
            { title: 'Docker Mastery', url: 'https://www.udemy.com/course/docker-mastery/', type: 'course', provider: 'Udemy', free: false },
          ],
          exercise: 'Containerize a full-stack application with multi-stage builds',
          completion_criteria: 'Build custom images, write docker-compose files, optimize for production',
          estimated_hours: 20, status: 'in_progress',
        },
        {
          id: 's3', skill: 'CI/CD Pipelines', reason: 'Required skill — automate build and deployment', prerequisites: ['Git', 'Docker'],
          resources: [
            { title: 'GitHub Actions Documentation', url: 'https://docs.github.com/en/actions', type: 'documentation', free: true },
          ],
          exercise: 'Set up a GitHub Actions pipeline for a full-stack project',
          completion_criteria: 'Automated testing, building, and deployment on push',
          estimated_hours: 12, status: 'not_started',
        },
      ],
    },
    {
      id: 'p2', name: 'Cloud & Infrastructure', description: 'AWS services and cloud architecture', order: 2, status: 'upcoming', progress: 0,
      steps: [
        {
          id: 's4', skill: 'AWS Core Services', reason: 'Most in-demand cloud platform', prerequisites: ['Docker', 'Networking'],
          resources: [
            { title: 'AWS Free Tier Getting Started', url: 'https://aws.amazon.com/free/', type: 'documentation', free: true },
          ],
          exercise: 'Deploy an application using EC2, RDS, and S3',
          completion_criteria: 'Understand and use EC2, S3, RDS, IAM, and VPC',
          estimated_hours: 30, status: 'not_started',
        },
        {
          id: 's5', skill: 'Kubernetes Basics', reason: 'Growing demand for orchestration', prerequisites: ['Docker', 'AWS'],
          resources: [
            { title: 'Kubernetes Documentation', url: 'https://kubernetes.io/docs/home/', type: 'documentation', free: true },
          ],
          exercise: 'Deploy a multi-service application on a local Kubernetes cluster',
          completion_criteria: 'Create deployments, services, and ingress resources',
          estimated_hours: 25, status: 'not_started',
        },
      ],
    },
    {
      id: 'p3', name: 'Advanced Skills', description: 'System design and advanced patterns', order: 3, status: 'upcoming', progress: 0,
      steps: [
        {
          id: 's6', skill: 'System Design', reason: 'Key interview topic', prerequisites: ['Databases', 'APIs', 'Cloud'],
          resources: [
            { title: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer', type: 'tutorial', free: true },
          ],
          exercise: 'Design a scalable URL shortener and a real-time chat system',
          completion_criteria: 'Design systems handling scalability, availability, and consistency trade-offs',
          estimated_hours: 30, status: 'not_started',
        },
        {
          id: 's7', skill: 'GraphQL', reason: 'Modern API paradigm', prerequisites: ['REST APIs', 'Node.js'],
          resources: [
            { title: 'GraphQL Official Learn', url: 'https://graphql.org/learn/', type: 'documentation', free: true },
          ],
          exercise: 'Build a GraphQL API with Apollo Server',
          completion_criteria: 'Create schemas, resolvers, and handle queries and mutations',
          estimated_hours: 15, status: 'not_started',
        },
      ],
    },
  ],
};

export const demoChallenges: CodingChallenge[] = [
  {
    id: 'demo-ch-1',
    title: 'Two Sum',
    description: 'Given an array of integers and a target value, return the indices of two numbers that add up to the target.',
    difficulty: 'easy',
    language: 'python',
    skill: 'Python',
    instructions: 'Write a function `two_sum(nums, target)` that returns a list of two indices.\n\nExample:\n- Input: nums = [2, 7, 11, 15], target = 9\n- Output: [0, 1] (because nums[0] + nums[1] = 2 + 7 = 9)',
    sample_input: 'nums = [2, 7, 11, 15], target = 9',
    sample_output: '[0, 1]',
    starter_code: 'def two_sum(nums: list[int], target: int) -> list[int]:\n    # Your solution here\n    pass\n',
    test_cases: [
      { id: 't1', input: '[2, 7, 11, 15], 9', expected_output: '[0, 1]', is_hidden: false, description: 'Basic case' },
      { id: 't2', input: '[3, 2, 4], 6', expected_output: '[1, 2]', is_hidden: false, description: 'Adjacent numbers' },
      { id: 't3', input: '[3, 3], 6', expected_output: '[0, 1]', is_hidden: true, description: 'Duplicate values' },
    ],
    time_limit_minutes: 15,
  },
  {
    id: 'demo-ch-2',
    title: 'SQL Employee Department Query',
    description: 'Write a SQL query to find all employees with their department names.',
    difficulty: 'easy',
    language: 'sql',
    skill: 'SQL',
    instructions: 'Given tables `employees` (id, name, department_id, salary) and `departments` (id, name), write a query to return employee name, department name, and salary for all employees, ordered by salary descending.',
    sample_input: 'employees: [(1, "Alice", 1, 90000), (2, "Bob", 2, 85000)]\ndepartments: [(1, "Engineering"), (2, "Marketing")]',
    sample_output: 'Alice | Engineering | 90000\nBob | Marketing | 85000',
    starter_code: '-- Write your SQL query here\nSELECT \n\nFROM employees\n',
    test_cases: [
      { id: 't1', input: 'standard_dataset', expected_output: 'correct_join_results', is_hidden: false, description: 'Basic JOIN' },
    ],
    time_limit_minutes: 10,
  },
  {
    id: 'demo-ch-3',
    title: 'REST API Rate Limiter',
    description: 'Implement a sliding window rate limiter class.',
    difficulty: 'medium',
    language: 'python',
    skill: 'System Design',
    instructions: 'Create a `RateLimiter` class with:\n- `__init__(self, max_requests: int, window_seconds: int)` — initialize with limit and window\n- `allow_request(self, timestamp: float) -> bool` — return True if request is allowed\n\nUse a sliding window approach.',
    starter_code: 'class RateLimiter:\n    def __init__(self, max_requests: int, window_seconds: int):\n        # Your code here\n        pass\n    \n    def allow_request(self, timestamp: float) -> bool:\n        # Your code here\n        pass\n',
    test_cases: [
      { id: 't1', input: 'max=2, window=60, timestamps=[0, 30, 59, 60]', expected_output: '[True, True, False, True]', is_hidden: false, description: 'Basic rate limiting' },
    ],
    time_limit_minutes: 20,
  },
];

export const demoRepositories: Repository[] = [
  { id: 'r1', name: 'react-dashboard', full_name: 'user/react-dashboard', description: 'Admin dashboard built with React and TypeScript', language: 'TypeScript', languages: { TypeScript: 15000, CSS: 3000, HTML: 500 }, stars: 12, forks: 3, updated_at: new Date(Date.now() - 172800000).toISOString(), topics: ['react', 'typescript', 'dashboard'], has_tests: true, analysis_status: 'complete' },
  { id: 'r2', name: 'python-ml-pipeline', full_name: 'user/python-ml-pipeline', description: 'Machine learning pipeline with scikit-learn', language: 'Python', languages: { Python: 20000, 'Jupyter Notebook': 5000 }, stars: 8, forks: 2, updated_at: new Date(Date.now() - 604800000).toISOString(), topics: ['python', 'machine-learning', 'scikit-learn'], has_tests: true, analysis_status: 'complete' },
  { id: 'r3', name: 'express-api', full_name: 'user/express-api', description: 'REST API with Express.js and PostgreSQL', language: 'JavaScript', languages: { JavaScript: 12000, SQL: 2000 }, stars: 5, forks: 1, updated_at: new Date(Date.now() - 1209600000).toISOString(), topics: ['nodejs', 'express', 'postgresql', 'rest-api'], has_tests: false, analysis_status: 'complete' },
];

export const demoEvidence: SkillEvidence[] = [
  { id: 'e1', skill: 'React', source: 'github', repository: 'user/react-dashboard', file_path: 'src/components/Dashboard.tsx', evidence_type: 'code_usage', confidence: 0.9, description: 'Extensive React component development with hooks and context API', verified: true, created_at: new Date().toISOString() },
  { id: 'e2', skill: 'TypeScript', source: 'github', repository: 'user/react-dashboard', file_path: 'tsconfig.json', evidence_type: 'project_structure', confidence: 0.85, description: 'TypeScript configured with strict mode across the project', verified: true, created_at: new Date().toISOString() },
  { id: 'e3', skill: 'Python', source: 'github', repository: 'user/python-ml-pipeline', file_path: 'src/pipeline.py', evidence_type: 'code_usage', confidence: 0.92, description: 'Python used for data processing and ML pipeline implementation', verified: true, created_at: new Date().toISOString() },
  { id: 'e4', skill: 'scikit-learn', source: 'github', repository: 'user/python-ml-pipeline', file_path: 'requirements.txt', evidence_type: 'dependency', confidence: 0.88, description: 'scikit-learn listed as a project dependency with active usage', verified: true, created_at: new Date().toISOString() },
  { id: 'e5', skill: 'Testing', source: 'github', repository: 'user/react-dashboard', file_path: 'src/__tests__/', evidence_type: 'test_coverage', confidence: 0.75, description: 'Jest test files found with component and integration tests', verified: false, created_at: new Date().toISOString() },
  { id: 'e6', skill: 'PostgreSQL', source: 'github', repository: 'user/express-api', file_path: 'src/db/schema.sql', evidence_type: 'code_usage', confidence: 0.82, description: 'SQL schema and queries for PostgreSQL database', verified: true, created_at: new Date().toISOString() },
];

export const demoMarket: MarketOverview = {
  total_jobs_analyzed: 1250,
  top_skills: [
    { skill: 'JavaScript', demand_count: 890, trend: 'stable', category: 'programming_language', data_source: 'Demo Dataset', last_updated: new Date().toISOString() },
    { skill: 'Python', demand_count: 820, trend: 'rising', category: 'programming_language', data_source: 'Demo Dataset', last_updated: new Date().toISOString() },
    { skill: 'React', demand_count: 680, trend: 'stable', category: 'framework', data_source: 'Demo Dataset', last_updated: new Date().toISOString() },
    { skill: 'AWS', demand_count: 620, trend: 'rising', category: 'cloud', data_source: 'Demo Dataset', last_updated: new Date().toISOString() },
    { skill: 'Docker', demand_count: 580, trend: 'rising', category: 'devops', data_source: 'Demo Dataset', last_updated: new Date().toISOString() },
    { skill: 'TypeScript', demand_count: 560, trend: 'rising', category: 'programming_language', data_source: 'Demo Dataset', last_updated: new Date().toISOString() },
    { skill: 'SQL', demand_count: 520, trend: 'stable', category: 'database', data_source: 'Demo Dataset', last_updated: new Date().toISOString() },
    { skill: 'Node.js', demand_count: 480, trend: 'stable', category: 'framework', data_source: 'Demo Dataset', last_updated: new Date().toISOString() },
    { skill: 'Kubernetes', demand_count: 380, trend: 'rising', category: 'devops', data_source: 'Demo Dataset', last_updated: new Date().toISOString() },
    { skill: 'CI/CD', demand_count: 350, trend: 'rising', category: 'devops', data_source: 'Demo Dataset', last_updated: new Date().toISOString() },
  ],
  trending_skills: [
    { skill: 'Rust', demand_count: 180, trend: 'rising', category: 'programming_language', data_source: 'Demo Dataset', last_updated: new Date().toISOString() },
    { skill: 'LLM/AI APIs', demand_count: 290, trend: 'rising', category: 'ai_ml', data_source: 'Demo Dataset', last_updated: new Date().toISOString() },
    { skill: 'Terraform', demand_count: 310, trend: 'rising', category: 'devops', data_source: 'Demo Dataset', last_updated: new Date().toISOString() },
  ],
  data_freshness: 'Demo data — not from live sources',
  sources: ['Sample Dataset (Demo)'],
  is_demo_data: true,
};
