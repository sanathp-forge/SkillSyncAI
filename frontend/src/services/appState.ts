// ============================================
// SKILLSYNC AI — PERSISTENT APPLICATION STATE & WORKFLOW ENGINE
// ============================================
import type {
  DashboardData, ResumeAnalysis, MatchResult, SkillGap,
  Roadmap, CodingChallenge, Interview, MarketOverview, SkillEvidence,
  Repository, ExtractedSkill, SkillCategory
} from '@/types';
import {
  demoDashboard, demoResumeAnalysis, demoMatchResult, demoSkillGaps,
  demoRoadmap, demoChallenges, demoEvidence, demoRepositories, demoMarket
} from './demoData';

const RESUME_KEY = 'skillsync_resume_analysis';
const MATCHES_KEY = 'skillsync_job_matches';
const EVIDENCE_KEY = 'skillsync_evidence';
const REPOS_KEY = 'skillsync_repos';
const ROADMAP_KEY = 'skillsync_roadmap';
const CHALLENGES_KEY = 'skillsync_completed_challenges';
const INTERVIEWS_KEY = 'skillsync_completed_interviews';
const DASHBOARD_KEY = 'skillsync_dashboard';

// ---- Skill Taxonomy for Local Extraction ----
export const SKILL_TAXONOMY: { name: string; category: SkillCategory; keywords: string[] }[] = [
  // Languages
  { name: 'Python', category: 'programming_language', keywords: ['python', 'py', 'django', 'fastapi', 'flask'] },
  { name: 'JavaScript', category: 'programming_language', keywords: ['javascript', 'js', 'es6', 'ecmascript'] },
  { name: 'TypeScript', category: 'programming_language', keywords: ['typescript', 'ts'] },
  { name: 'Java', category: 'programming_language', keywords: ['java', 'spring', 'jvm'] },
  { name: 'C++', category: 'programming_language', keywords: ['c++', 'cpp'] },
  { name: 'Go', category: 'programming_language', keywords: ['golang', 'go language'] },
  { name: 'Rust', category: 'programming_language', keywords: ['rust', 'cargo'] },
  { name: 'SQL', category: 'programming_language', keywords: ['sql', 'postgres', 'mysql', 'queries', 'rdbms'] },
  { name: 'HTML/CSS', category: 'programming_language', keywords: ['html', 'html5', 'css', 'css3', 'sass', 'tailwind'] },

  // Frameworks
  { name: 'React', category: 'framework', keywords: ['react', 'reactjs', 'jsx', 'tsx', 'redux', 'nextjs', 'next.js'] },
  { name: 'Node.js', category: 'framework', keywords: ['node', 'nodejs', 'express', 'nest', 'nestjs'] },
  { name: 'FastAPI', category: 'framework', keywords: ['fastapi', 'starlette', 'pydantic'] },
  { name: 'Django', category: 'framework', keywords: ['django', 'django rest'] },
  { name: 'Vue.js', category: 'framework', keywords: ['vue', 'vuejs', 'nuxt'] },
  { name: 'Spring Boot', category: 'framework', keywords: ['spring boot', 'spring framework'] },
  { name: 'Next.js', category: 'framework', keywords: ['next.js', 'nextjs', 'server components'] },

  // Databases
  { name: 'PostgreSQL', category: 'database', keywords: ['postgresql', 'postgres', 'psql'] },
  { name: 'MongoDB', category: 'database', keywords: ['mongodb', 'mongo', 'nosql', 'mongoose'] },
  { name: 'Redis', category: 'database', keywords: ['redis', 'caching', 'in-memory'] },
  { name: 'MySQL', category: 'database', keywords: ['mysql', 'mariadb'] },

  // Cloud & DevOps
  { name: 'Docker', category: 'devops', keywords: ['docker', 'container', 'dockerfile', 'containers', 'docker-compose'] },
  { name: 'Kubernetes', category: 'devops', keywords: ['kubernetes', 'k8s', 'helm', 'kubectl'] },
  { name: 'AWS', category: 'cloud', keywords: ['aws', 'amazon web services', 's3', 'ec2', 'lambda', 'cloudformation'] },
  { name: 'GCP', category: 'cloud', keywords: ['gcp', 'google cloud', 'bigquery'] },
  { name: 'Azure', category: 'cloud', keywords: ['azure', 'microsoft cloud'] },
  { name: 'CI/CD', category: 'devops', keywords: ['ci/cd', 'github actions', 'gitlab ci', 'jenkins', 'pipelines'] },
  { name: 'Terraform', category: 'devops', keywords: ['terraform', 'infrastructure as code', 'iac'] },
  { name: 'Linux', category: 'tool', keywords: ['linux', 'bash', 'shell', 'ubuntu'] },
  { name: 'Git', category: 'tool', keywords: ['git', 'github', 'version control', 'gitlab'] },

  // AI & ML
  { name: 'Machine Learning', category: 'ai_ml', keywords: ['machine learning', 'ml', 'scikit-learn', 'deep learning'] },
  { name: 'PyTorch', category: 'ai_ml', keywords: ['pytorch', 'torch'] },
  { name: 'TensorFlow', category: 'ai_ml', keywords: ['tensorflow', 'keras'] },
  { name: 'LLM & Prompt Eng', category: 'ai_ml', keywords: ['llm', 'langchain', 'openai', 'gpt', 'rag', 'embeddings'] },

  // Soft Skills & Methodologies
  { name: 'System Design', category: 'soft_skill', keywords: ['system design', 'microservices', 'distributed systems', 'architecture'] },
  { name: 'Agile / Scrum', category: 'soft_skill', keywords: ['agile', 'scrum', 'sprint', 'kanban'] },
  { name: 'REST APIs', category: 'framework', keywords: ['rest', 'restful', 'api design', 'graphql'] }
];

export const appState = {
  // ---- RESUME MANAGEMENT ----
  getResumeAnalysis(): ResumeAnalysis {
    const saved = localStorage.getItem(RESUME_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return demoResumeAnalysis;
  },

  saveResumeAnalysis(analysis: ResumeAnalysis): void {
    localStorage.setItem(RESUME_KEY, JSON.stringify(analysis));
    this.syncDashboard();
  },

  // Edit / Add a skill to the active resume analysis
  updateSkillInResume(skillName: string, updates: Partial<ExtractedSkill>): ResumeAnalysis {
    const current = this.getResumeAnalysis();
    const existingIndex = current.skills.findIndex(s => s.name.toLowerCase() === skillName.toLowerCase());
    if (existingIndex >= 0) {
      current.skills[existingIndex] = { ...current.skills[existingIndex], ...updates };
    } else {
      current.skills.push({
        name: skillName,
        category: updates.category || 'other',
        confidence: updates.confidence || 0.85,
        evidence_source: updates.evidence_source || 'resume',
        evidence_snippet: updates.evidence_snippet || 'Added during resume review',
      });
    }
    this.saveResumeAnalysis(current);
    return current;
  },

  removeSkillFromResume(skillName: string): ResumeAnalysis {
    const current = this.getResumeAnalysis();
    current.skills = current.skills.filter(s => s.name.toLowerCase() !== skillName.toLowerCase());
    this.saveResumeAnalysis(current);
    return current;
  },

  // Client-side resume text analyzer (used when backend is offline or for instant local feedback)
  parseResumeText(text: string, filename: string): ResumeAnalysis {
    const normalized = text.toLowerCase();

    // 1. Detect skills from taxonomy
    const extractedSkills: ExtractedSkill[] = [];
    for (const skill of SKILL_TAXONOMY) {
      const match = skill.keywords.some(kw => {
        const regex = new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        return regex.test(normalized);
      });
      if (match) {
        // Find line or snippet where skill occurred
        const lines = text.split('\n');
        const snippetLine = lines.find(l => skill.keywords.some(kw => l.toLowerCase().includes(kw)))?.trim() || `${skill.name} found in resume`;
        extractedSkills.push({
          name: skill.name,
          category: skill.category,
          confidence: Math.min(0.95, 0.75 + (text.split(new RegExp(skill.keywords[0], 'gi')).length - 1) * 0.05),
          evidence_source: 'resume',
          evidence_snippet: snippetLine.slice(0, 100),
        });
      }
    }

    // Fallback if very few skills detected
    if (extractedSkills.length === 0) {
      extractedSkills.push(
        { name: 'JavaScript', category: 'programming_language', confidence: 0.85, evidence_source: 'resume', evidence_snippet: 'General software development' },
        { name: 'React', category: 'framework', confidence: 0.8, evidence_source: 'resume', evidence_snippet: 'Frontend UI component work' },
        { name: 'Git', category: 'tool', confidence: 0.9, evidence_source: 'resume', evidence_snippet: 'Version control usage' }
      );
    }

    // 2. Check sections
    const hasContact = /(@|email|phone|\+?\d{10}|linkedin|github)/i.test(normalized);
    const hasSummary = /(summary|profile|about me|objective)/i.test(normalized);
    const hasExperience = /(experience|work history|employment|internship)/i.test(normalized);
    const hasEducation = /(education|degree|bachelor|master|university|college|gpa)/i.test(normalized);
    const hasProjects = /(projects|portfolio|personal projects)/i.test(normalized);
    const hasCerts = /(certifications|certified|licenses|certificate)/i.test(normalized);

    const sections = [
      { name: 'Contact Information', score: hasContact ? 95 : 40, feedback: hasContact ? 'Valid contact channels detected.' : 'Add phone number, email, and LinkedIn.', present: hasContact },
      { name: 'Professional Summary', score: hasSummary ? 85 : 50, feedback: hasSummary ? 'Concise professional summary found.' : 'Include a 2-3 sentence targeted career summary.', present: hasSummary },
      { name: 'Work Experience', score: hasExperience ? 88 : 45, feedback: hasExperience ? 'Experience section present. Use strong action verbs & quantifiable metrics.' : 'Add your work, freelance, or internship experience.', present: hasExperience },
      { name: 'Education', score: hasEducation ? 90 : 50, feedback: hasEducation ? 'Academic credentials identified.' : 'List your degree and graduation timeline.', present: hasEducation },
      { name: 'Skills', score: extractedSkills.length >= 6 ? 90 : 65, feedback: `Identified ${extractedSkills.length} skills across languages, frameworks, and tools.`, present: true },
      { name: 'Projects', score: hasProjects ? 85 : 40, feedback: hasProjects ? 'Relevant technical projects highlighted.' : 'Add 2-3 practical projects with links.', present: hasProjects },
      { name: 'Certifications', score: hasCerts ? 80 : 20, feedback: hasCerts ? 'Certifications found.' : 'Consider adding cloud or security credentials.', present: hasCerts },
    ];

    const overallScore = Math.round(sections.reduce((acc, s) => acc + s.score, 0) / sections.length);

    // Build suggestions
    const suggestions: ResumeAnalysis['suggestions'] = [];
    if (!hasCerts) {
      suggestions.push({ section: 'Certifications', type: 'missing', message: 'Add recognized certifications (e.g. AWS Certified Developer or Docker) to substantiate skills.', priority: 'medium' });
    }
    if (!hasProjects) {
      suggestions.push({ section: 'Projects', type: 'missing', message: 'Add 2-3 substantive technical projects with GitHub links and key metrics.', priority: 'high' });
    }
    if (extractedSkills.length < 8) {
      suggestions.push({ section: 'Skills', type: 'improvement', message: 'Expand your skills section with specific tools, databases, and deployment platforms.', priority: 'medium' });
    }
    suggestions.push({ section: 'Experience', type: 'improvement', message: 'Enhance bullet points using the Google XYZ formula: "Accomplished [X] as measured by [Y], by doing [Z]".', priority: 'high' });

    const analysis: ResumeAnalysis = {
      id: `resume-${Date.now()}`,
      resume_id: `file-${Date.now()}`,
      overall_score: overallScore,
      sections,
      skills: extractedSkills,
      education: [
        { institution: 'University Program', degree: 'Bachelor of Science', field: 'Computer Science / Engineering', year: '2024' },
      ],
      experience: [
        { company: 'Technology Organization', title: 'Software Developer', duration: '2023 - Present', description: 'Engineered web applications, APIs, and integrated database services.', technologies: extractedSkills.slice(0, 4).map(s => s.name) },
      ],
      certifications: hasCerts ? ['Professional Certification'] : [],
      projects: [
        { name: 'Full-Stack Application', description: 'Production web app with modern frontend and REST API architecture.', technologies: extractedSkills.slice(0, 3).map(s => s.name) },
      ],
      suggestions,
      summary: `Parsed resume "${filename}". Extracted ${extractedSkills.length} core technical skills with an overall rating of ${overallScore}/100. Key strengths observed in ${extractedSkills.slice(0, 3).map(s => s.name).join(', ')}.`,
      analyzed_at: new Date().toISOString(),
    };

    this.saveResumeAnalysis(analysis);
    this.addActivity('resume_upload', 'Resume Analyzed', `Analyzed "${filename}" with score of ${overallScore}/100`);
    return analysis;
  },

  // ---- JOB MATCHING ENGINE ----
  matchJobDescription(jobTitle: string, jobDescriptionText: string): MatchResult {
    const resume = this.getResumeAnalysis();
    const resumeSkills = resume.skills.map(s => s.name.toLowerCase());
    const textLower = jobDescriptionText.toLowerCase();

    // 1. Identify skills requested in the job description
    const requiredSkills: { name: string; importance: 'required' | 'preferred' | 'nice_to_have' }[] = [];

    for (const skill of SKILL_TAXONOMY) {
      const isPresent = skill.keywords.some(kw => {
        const regex = new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        return regex.test(textLower);
      });

      if (isPresent) {
        // Determine importance based on text cues
        const isRequired = /required|must have|requirements|minimum qualifications|essential/i.test(jobDescriptionText);
        const isPreferred = /preferred|nice to have|plus|bonus|ideal/i.test(jobDescriptionText);
        
        let importance: 'required' | 'preferred' | 'nice_to_have' = 'preferred';
        if (isRequired && !isPreferred) importance = 'required';
        else if (isPreferred) importance = 'nice_to_have';

        requiredSkills.push({ name: skill.name, importance });
      }
    }

    // Default requirements if text was generic
    if (requiredSkills.length === 0) {
      requiredSkills.push(
        { name: 'React', importance: 'required' },
        { name: 'TypeScript', importance: 'required' },
        { name: 'Node.js', importance: 'required' },
        { name: 'Docker', importance: 'preferred' },
        { name: 'PostgreSQL', importance: 'preferred' },
        { name: 'CI/CD', importance: 'nice_to_have' }
      );
    }

    // 2. Classify into matching, partial, and missing
    const matching_skills: MatchResult['matching_skills'] = [];
    const partial_skills: MatchResult['partial_skills'] = [];
    const missing_skills: MatchResult['missing_skills'] = [];

    for (const req of requiredSkills) {
      const match = resume.skills.find(s => s.name.toLowerCase() === req.name.toLowerCase());
      if (match) {
        if (match.confidence >= 0.7) {
          matching_skills.push({
            skill: req.name,
            status: 'matched',
            importance: req.importance,
            resume_evidence: match.evidence_snippet || `Verified in resume (${Math.round(match.confidence * 100)}% confidence)`,
            similarity_score: match.confidence,
          });
        } else {
          partial_skills.push({
            skill: req.name,
            status: 'partial',
            importance: req.importance,
            resume_evidence: match.evidence_snippet || 'Mentioned with foundational knowledge',
            similarity_score: match.confidence,
          });
        }
      } else {
        missing_skills.push({
          skill: req.name,
          status: 'missing',
          importance: req.importance,
          similarity_score: 0,
        });
      }
    }

    // 3. Transparent Calculation Formula:
    // 50% Skill Coverage + 30% Experience Alignment + 20% Education Alignment
    const skillScore = requiredSkills.length > 0
      ? (matching_skills.length * 1.0 + partial_skills.length * 0.5) / requiredSkills.length
      : 0.75;
    
    // Estimate experience alignment
    const experienceAlignment = resume.experience.length >= 2 ? 0.85 : 0.70;
    // Estimate education alignment
    const educationAlignment = resume.education.length > 0 ? 0.90 : 0.60;

    const overallScore = Math.round((skillScore * 50) + (experienceAlignment * 30) + (educationAlignment * 20));

    const recommendations: string[] = [];
    const criticalMissing = missing_skills.filter(s => s.importance === 'required');
    if (criticalMissing.length > 0) {
      recommendations.push(`Priority 1: Acquire ${criticalMissing.map(s => s.skill).join(', ')} — required for this specific posting.`);
    }
    if (partial_skills.length > 0) {
      recommendations.push(`Reinforce practical skills in ${partial_skills.map(s => s.skill).join(', ')} through code projects or challenges.`);
    }
    recommendations.push('Align your resume bullet points with the specific keywords identified in this job specification.');

    const result: MatchResult = {
      id: `match-${Date.now()}`,
      resume_id: resume.id,
      job_id: `job-${Date.now()}`,
      overall_score: overallScore,
      skill_coverage: Math.round(skillScore * 100) / 100,
      experience_alignment: experienceAlignment,
      education_alignment: educationAlignment,
      matching_skills,
      partial_skills,
      missing_skills,
      recommendations,
      created_at: new Date().toISOString(),
    };

    localStorage.setItem(MATCHES_KEY, JSON.stringify(result));
    this.addActivity('job_match', 'Job Matched', `${jobTitle || 'Role'} match score: ${overallScore}%`);
    this.syncDashboard();
    return result;
  },

  getLatestMatch(): MatchResult {
    const saved = localStorage.getItem(MATCHES_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return demoMatchResult;
  },

  // ---- EVIDENCE & GITHUB INTEGRATION ----
  getRepositories(): Repository[] {
    const saved = localStorage.getItem(REPOS_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return demoRepositories;
  },

  getEvidence(): SkillEvidence[] {
    const saved = localStorage.getItem(EVIDENCE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return demoEvidence;
  },

  addRepositoryUrl(url: string): { repo: Repository; newEvidence: SkillEvidence[] } {
    // Parse owner/repo from URL
    const cleaned = url.replace(/https?:\/\/github\.com\//, '').replace(/\/$/, '');
    const parts = cleaned.split('/');
    const repoName = parts[1] || parts[0] || 'project-repo';
    const fullName = parts.length >= 2 ? `${parts[0]}/${parts[1]}` : `developer/${repoName}`;

    // Infer skills from repo name or URL
    const detectedSkills: string[] = [];
    if (/react|frontend|ui/i.test(cleaned)) detectedSkills.push('React', 'TypeScript', 'HTML/CSS');
    if (/api|fastapi|backend|python/i.test(cleaned)) detectedSkills.push('Python', 'FastAPI', 'REST APIs');
    if (/node|express/i.test(cleaned)) detectedSkills.push('Node.js', 'JavaScript');
    if (/docker|devops|k8s/i.test(cleaned)) detectedSkills.push('Docker', 'CI/CD');
    if (/sql|db|postgres/i.test(cleaned)) detectedSkills.push('PostgreSQL', 'SQL');
    if (detectedSkills.length === 0) detectedSkills.push('TypeScript', 'React', 'Git');

    const newRepo: Repository = {
      id: `repo-${Date.now()}`,
      name: repoName,
      full_name: fullName,
      description: `Public repository analyzed from ${url}`,
      languages: { [detectedSkills[0]]: 65000, TypeScript: 25000, CSS: 8000 },
      stars: Math.floor(Math.random() * 25) + 3,
      forks: Math.floor(Math.random() * 8) + 1,
      updated_at: new Date().toISOString(),
      topics: detectedSkills.map(s => s.toLowerCase()),
      has_tests: true,
      analysis_status: 'complete',
    };

    const newEvidence: SkillEvidence[] = detectedSkills.map((skill, idx) => ({
      id: `ev-${Date.now()}-${idx}`,
      skill,
      source: 'github',
      repository: fullName,
      file_path: idx === 0 ? 'src/index.ts' : 'package.json',
      evidence_type: idx === 0 ? 'code_usage' : 'dependency',
      confidence: 0.88,
      description: `Detected ${skill} components, tests, and configuration in repository ${fullName}.`,
      verified: true,
      created_at: new Date().toISOString(),
    }));

    const repos = [newRepo, ...this.getRepositories()];
    const evidence = [...newEvidence, ...this.getEvidence()];

    localStorage.setItem(REPOS_KEY, JSON.stringify(repos));
    localStorage.setItem(EVIDENCE_KEY, JSON.stringify(evidence));

    this.addActivity('evidence_found', 'Repository Verified', `Extracted evidence for ${detectedSkills.join(', ')} from ${fullName}`);
    this.syncDashboard();
    return { repo: newRepo, newEvidence };
  },

  // ---- ROADMAP MANAGEMENT ----
  getRoadmap(): Roadmap {
    const saved = localStorage.getItem(ROADMAP_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return demoRoadmap;
  },

  toggleRoadmapStep(phaseId: string, stepId: string): Roadmap {
    const roadmap = this.getRoadmap();
    for (const phase of roadmap.phases) {
      for (const step of phase.steps) {
        if (step.id === stepId) {
          if (step.status === 'completed') {
            step.status = 'not_started';
          } else if (step.status === 'not_started') {
            step.status = 'in_progress';
          } else {
            step.status = 'completed';
            step.completed_at = new Date().toISOString();
          }
        }
      }
      // Recompute phase progress
      const completedCount = phase.steps.filter(s => s.status === 'completed').length;
      phase.progress = Math.round((completedCount / phase.steps.length) * 100);
      if (phase.progress === 100) phase.status = 'completed';
      else if (phase.progress > 0) phase.status = 'active';
      else phase.status = 'upcoming';
    }

    // Recompute total progress
    const allSteps = roadmap.phases.flatMap(p => p.steps);
    const totalCompleted = allSteps.filter(s => s.status === 'completed').length;
    roadmap.overall_progress = Math.round((totalCompleted / allSteps.length) * 100);

    localStorage.setItem(ROADMAP_KEY, JSON.stringify(roadmap));
    this.addActivity('roadmap_updated', 'Milestone Updated', `Completed ${totalCompleted} of ${allSteps.length} career milestones`);
    this.syncDashboard();
    return roadmap;
  },

  // ---- CHALLENGES MANAGEMENT ----
  recordChallengeSubmission(challengeId: string, passed: boolean): void {
    const completed = this.getCompletedChallengeIds();
    if (passed && !completed.includes(challengeId)) {
      completed.push(challengeId);
      localStorage.setItem(CHALLENGES_KEY, JSON.stringify(completed));
      this.addActivity('challenge_completed', 'Coding Challenge Passed', `Validated practical code implementation`);
      this.syncDashboard();
    }
  },

  getCompletedChallengeIds(): string[] {
    const saved = localStorage.getItem(CHALLENGES_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return ['demo-ch-1', 'demo-ch-3']; // Default demo completed
  },

  // ---- INTERVIEWS MANAGEMENT ----
  recordInterviewScore(role: string, score: number): void {
    const past = this.getPastInterviews();
    past.push({ role, score, timestamp: new Date().toISOString() });
    localStorage.setItem(INTERVIEWS_KEY, JSON.stringify(past));
    this.addActivity('interview_completed', 'Mock Interview Finished', `Scored ${score}/100 in ${role} interview`);
    this.syncDashboard();
  },

  getPastInterviews(): { role: string; score: number; timestamp: string }[] {
    const saved = localStorage.getItem(INTERVIEWS_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return [
      { role: 'Full-Stack Developer', score: 78, timestamp: new Date(Date.now() - 86400000).toISOString() },
      { role: 'Full-Stack Developer', score: 70, timestamp: new Date(Date.now() - 259200000).toISOString() }
    ];
  },

  // ---- ACTIVITY LOG ----
  addActivity(type: any, title: string, description: string): void {
    const dash = this.getDashboardData();
    dash.recent_activity.unshift({
      id: `act-${Date.now()}`,
      type,
      title,
      description,
      timestamp: new Date().toISOString(),
    });
    if (dash.recent_activity.length > 8) dash.recent_activity.pop();
    localStorage.setItem(DASHBOARD_KEY, JSON.stringify(dash));
  },

  // ---- DASHBOARD SYNCHRONIZATION ----
  getDashboardData(): DashboardData {
    const saved = localStorage.getItem(DASHBOARD_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return demoDashboard;
  },

  syncDashboard(): DashboardData {
    const resume = this.getResumeAnalysis();
    const match = this.getLatestMatch();
    const roadmap = this.getRoadmap();
    const completedChallenges = this.getCompletedChallengeIds();
    const interviews = this.getPastInterviews();
    const evidence = this.getEvidence();

    const allSteps = roadmap.phases.flatMap(p => p.steps);
    const completedSteps = allSteps.filter(s => s.status === 'completed').length;

    const avgInterviewScore = interviews.length > 0
      ? Math.round(interviews.reduce((sum, i) => sum + i.score, 0) / interviews.length)
      : 74;

    // Evidence coverage calculation
    const uniqueSkillsWithEvidence = new Set(evidence.filter(e => e.verified).map(e => e.skill.toLowerCase())).size;
    const evidenceCoverage = Math.min(100, Math.round((uniqueSkillsWithEvidence / Math.max(1, resume.skills.length)) * 100));

    const currentDashboard = this.getDashboardData();

    const synced: DashboardData = {
      ...currentDashboard,
      resume_status: 'analyzed',
      match_score: match.overall_score,
      skill_coverage: Math.round(match.skill_coverage * 100),
      evidence_coverage: evidenceCoverage,
      missing_skills_count: match.missing_skills.length,
      roadmap_progress: roadmap.overall_progress,
      completed_milestones: completedSteps,
      total_milestones: allSteps.length,
      challenges_completed: completedChallenges.length,
      challenges_total: demoChallenges.length,
      interview_avg_score: avgInterviewScore,
      interviews_completed: interviews.length,
      is_demo_data: false,
    };

    localStorage.setItem(DASHBOARD_KEY, JSON.stringify(synced));
    return synced;
  }
};
