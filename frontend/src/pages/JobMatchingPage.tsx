// ============================================
// SKILLSYNC AI — JOB MATCHING PAGE
// ============================================
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Target, CheckCircle, XCircle, AlertCircle, Sparkles,
  ArrowRight, Shield, BookOpen, Layers, Info, Check, HelpCircle
} from 'lucide-react';
import {
  PageHeader, DemoBanner, ScoreRing, Badge, ProgressBar, AppFooter
} from '@/components/common/UI';
import { jobApi } from '@/services/api';
import { appState } from '@/services/appState';
import type { MatchResult } from '@/types';

const SAMPLE_JOBS = [
  {
    title: 'Senior Full-Stack Engineer',
    description: `We are seeking an experienced Full-Stack Engineer to lead the architecture of our cloud-native web platform.
Required Qualifications:
- 4+ years of professional experience with React, TypeScript, and modern state management.
- Strong backend experience with Node.js, Python (FastAPI/Django), or Go.
- Production experience with PostgreSQL, schema design, and query optimization.
- Hands-on expertise with Docker, containerization, and CI/CD pipelines.
- Bachelor's degree in Computer Science, Software Engineering, or equivalent practical experience.

Preferred Qualifications:
- Cloud infrastructure experience on AWS or GCP.
- Familiarity with Kubernetes, Redis caching, and microservices architecture.
- Experience with AI API integrations and vector databases.`
  },
  {
    title: 'Python Backend & AI Engineer',
    description: `Join our team to build high-performance data processing pipelines and LLM services.
Required Qualifications:
- Proficiency in Python, FastAPI, and asynchronous programming.
- Experience with PostgreSQL, SQLAlchemy, and Redis caching.
- Deep understanding of RESTful API design, microservices, and system design.
- Hands-on experience with Docker and Git version control.

Preferred Qualifications:
- Experience with PyTorch, LangChain, or LLM prompt engineering.
- Understanding of AWS Lambda, ECS, and Terraform.`
  }
];

export default function JobMatchingPage() {
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MatchResult | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'matched' | 'partial' | 'missing'>('all');

  useEffect(() => {
    // Check if there is already a recent match
    const latest = appState.getLatestMatch();
    if (latest) {
      setResult(latest);
    }
  }, []);

  const handleMatch = async () => {
    if (!jobDescription.trim()) return;
    setLoading(true);
    try {
      const job = await jobApi.create({ title: jobTitle || 'Target Role', description: jobDescription });
      const match = await jobApi.match('current', job.id);
      setResult(match);
      appState.syncDashboard();
      setIsDemo(false);
    } catch {
      // Execute transparent client-side matching algorithm
      const match = appState.matchJobDescription(jobTitle || 'Target Role', jobDescription);
      setResult(match);
      setIsDemo(true);
    } finally {
      setLoading(false);
    }
  };

  const loadSample = (sample: typeof SAMPLE_JOBS[0]) => {
    setJobTitle(sample.title);
    setJobDescription(sample.description);
  };

  const importanceBadge = (importance: string) => {
    if (importance === 'required') return <Badge variant="rose" size="sm">Required</Badge>;
    if (importance === 'preferred') return <Badge variant="amber" size="sm">Preferred</Badge>;
    return <Badge variant="cyan" size="sm">Nice to have</Badge>;
  };

  return (
    <div style={{ padding: 'var(--space-6)', maxWidth: 1200 }}>
      {isDemo && <DemoBanner />}

      <PageHeader
        title="Semantic Job Matching"
        description="Paste any job posting or requirements to analyze skill compatibility, experience alignment, and missing competencies."
      />

      {/* Input Form */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-static"
        style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}
      >
        <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-3)' }}>
          <label className="label" style={{ margin: 0 }}>Target Role & Job Specification</label>
          <div className="flex gap-2">
            <span style={{ fontSize: '0.75rem', color: 'var(--fg-tertiary)', alignSelf: 'center' }}>Templates:</span>
            {SAMPLE_JOBS.map((job, idx) => (
              <button
                key={idx}
                type="button"
                className="btn btn-ghost btn-sm"
                style={{ fontSize: '0.75rem', padding: '2px 8px' }}
                onClick={() => loadSample(job)}
              >
                {job.title.split(' ')[0]} {job.title.split(' ')[1]}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-2" style={{ gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
          <div>
            <label className="label" htmlFor="job-title-input">Job Title</label>
            <input
              id="job-title-input"
              className="input"
              placeholder="e.g. Senior Full-Stack Developer"
              value={jobTitle}
              onChange={e => setJobTitle(e.target.value)}
            />
          </div>
          <div className="flex items-end">
            <div style={{
              fontSize: '0.8125rem', color: 'var(--fg-secondary)', padding: 'var(--space-2) var(--space-3)',
              background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', width: '100%',
            }}>
              <Info size={14} style={{ display: 'inline', marginRight: 6, color: 'var(--accent-primary)' }} />
              Scoring Model: <strong>50%</strong> Skill Coverage + <strong>30%</strong> Experience + <strong>20%</strong> Education
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 'var(--space-4)' }}>
          <label className="label" htmlFor="job-desc-input">Job Description & Qualifications</label>
          <textarea
            id="job-desc-input"
            className="input"
            placeholder="Paste job description, requirements, or qualifications here..."
            value={jobDescription}
            onChange={e => setJobDescription(e.target.value)}
            style={{ minHeight: 180, resize: 'vertical', fontSize: '0.875rem' }}
          />
        </div>

        <div className="flex gap-3">
          <button
            className="btn btn-primary"
            onClick={handleMatch}
            disabled={!jobDescription.trim() || loading}
          >
            {loading ? <><div className="spin" /> Analyzing Requirements...</> : <><Target size={16} /> Analyze Job Match</>}
          </button>
          {result && (
            <Link to="/app/roadmap" className="btn btn-secondary">
              View Custom Roadmap <ArrowRight size={14} />
            </Link>
          )}
        </div>
      </motion.div>

      {/* Match Results */}
      {result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          {/* Score Overview Cards */}
          <div className="grid" style={{
            gridTemplateColumns: '260px 1fr', gap: 'var(--space-6)',
            marginBottom: 'var(--space-6)',
          }} id="match-score-grid">
            {/* Left Radial Score */}
            <div className="card-static text-center" style={{ padding: 'var(--space-6)' }}>
              <ScoreRing score={result.overall_score} size={130} strokeWidth={9} label="Match Score" />
              <p style={{ fontSize: '0.8125rem', color: 'var(--fg-secondary)', marginTop: 'var(--space-3)', fontWeight: 600 }}>
                {result.overall_score >= 80 ? 'Highly Competitive Candidate' :
                 result.overall_score >= 60 ? 'Strong Candidate with Bridgeable Gaps' :
                 'Targeted Upskilling Recommended'}
              </p>
              <div style={{ fontSize: '0.6875rem', color: 'var(--fg-tertiary)', marginTop: 4, lineHeight: 1.5 }}>
                Score is calculated deterministically from documented skill and qualification alignment.
              </div>
            </div>

            {/* Right Weight Breakdown */}
            <div className="card-static" style={{ padding: 'var(--space-6)' }}>
              <h4 style={{ fontWeight: 700, marginBottom: 'var(--space-4)' }}>Scoring Factors & Alignment</h4>
              <div className="flex flex-col gap-4">
                <div>
                  <div className="flex justify-between" style={{ marginBottom: 4 }}>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 500 }}>
                      Skill Coverage (50% weight) — {result.matching_skills.length} matched, {result.partial_skills.length} partial
                    </span>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 700 }}>{Math.round(result.skill_coverage * 100)}%</span>
                  </div>
                  <ProgressBar value={Math.round(result.skill_coverage * 100)} color="var(--accent-primary)" />
                </div>

                <div>
                  <div className="flex justify-between" style={{ marginBottom: 4 }}>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 500 }}>
                      Experience Alignment (30% weight) — Relevant industry roles & projects
                    </span>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 700 }}>{Math.round(result.experience_alignment * 100)}%</span>
                  </div>
                  <ProgressBar value={Math.round(result.experience_alignment * 100)} color="var(--accent-cyan)" />
                </div>

                <div>
                  <div className="flex justify-between" style={{ marginBottom: 4 }}>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 500 }}>
                      Education & Degree Alignment (20% weight) — Program of study & coursework
                    </span>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 700 }}>{Math.round(result.education_alignment * 100)}%</span>
                  </div>
                  <ProgressBar value={Math.round(result.education_alignment * 100)} color="var(--accent-emerald)" />
                </div>
              </div>
            </div>
          </div>

          {/* Skill Breakdown Lists */}
          <div className="card-static" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
            <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 8 }}>
              <h4 style={{ fontWeight: 700, margin: 0 }}>Detailed Skill Audit</h4>
              <div className="flex gap-2">
                <button
                  className={`btn btn-sm ${activeFilter === 'all' ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setActiveFilter('all')}
                >
                  All ({result.matching_skills.length + result.partial_skills.length + result.missing_skills.length})
                </button>
                <button
                  className={`btn btn-sm ${activeFilter === 'matched' ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setActiveFilter('matched')}
                >
                  Matched ({result.matching_skills.length})
                </button>
                <button
                  className={`btn btn-sm ${activeFilter === 'partial' ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setActiveFilter('partial')}
                >
                  Partial ({result.partial_skills.length})
                </button>
                <button
                  className={`btn btn-sm ${activeFilter === 'missing' ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setActiveFilter('missing')}
                >
                  Missing ({result.missing_skills.length})
                </button>
              </div>
            </div>

            <div className="grid grid-2" style={{ gap: 'var(--space-3)' }}>
              {/* Matched Skills */}
              {(activeFilter === 'all' || activeFilter === 'matched') &&
                result.matching_skills.map(s => (
                  <div key={s.skill} className="flex items-start gap-3" style={{
                    padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-tertiary)', border: '1px solid var(--accent-emerald)',
                  }}>
                    <CheckCircle size={16} style={{ color: 'var(--accent-emerald)', marginTop: 2, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="flex items-center gap-2" style={{ marginBottom: 2 }}>
                        <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{s.skill}</span>
                        {importanceBadge(s.importance)}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--fg-tertiary)' }}>
                        {s.resume_evidence}
                      </div>
                    </div>
                  </div>
                ))
              }

              {/* Partial Skills */}
              {(activeFilter === 'all' || activeFilter === 'partial') &&
                result.partial_skills.map(s => (
                  <div key={s.skill} className="flex items-start gap-3" style={{
                    padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-tertiary)', border: '1px solid var(--accent-amber)',
                  }}>
                    <AlertCircle size={16} style={{ color: 'var(--accent-amber)', marginTop: 2, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="flex items-center gap-2" style={{ marginBottom: 2 }}>
                        <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{s.skill}</span>
                        <Badge variant="amber" size="sm">Partial Match</Badge>
                        {importanceBadge(s.importance)}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--fg-tertiary)' }}>
                        {s.resume_evidence}
                      </div>
                    </div>
                  </div>
                ))
              }

              {/* Missing Skills */}
              {(activeFilter === 'all' || activeFilter === 'missing') &&
                result.missing_skills.map(s => (
                  <div key={s.skill} className="flex items-start gap-3" style={{
                    padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-tertiary)', border: '1px solid var(--accent-rose)',
                  }}>
                    <XCircle size={16} style={{ color: 'var(--accent-rose)', marginTop: 2, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="flex items-center gap-2" style={{ marginBottom: 2 }}>
                        <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{s.skill}</span>
                        <Badge variant="rose" size="sm">Missing</Badge>
                        {importanceBadge(s.importance)}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--fg-tertiary)' }}>
                        Required by job posting — not substantiated in uploaded credentials
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>

          {/* Actionable Next Steps */}
          <div className="card-static" style={{ padding: 'var(--space-6)' }}>
            <h4 style={{ fontWeight: 700, marginBottom: 'var(--space-3)' }}>Recommended Next Steps</h4>
            <div className="flex flex-col gap-2" style={{ marginBottom: 'var(--space-4)' }}>
              {result.recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-2" style={{ fontSize: '0.875rem', color: 'var(--fg-secondary)' }}>
                  <ArrowRight size={14} style={{ color: 'var(--accent-primary)', marginTop: 4, flexShrink: 0 }} />
                  <span>{rec}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <Link to="/app/roadmap" className="btn btn-primary">
                <BookOpen size={15} /> Build Custom Roadmap
              </Link>
              <Link to="/app/challenges" className="btn btn-secondary">
                <Shield size={15} /> Validate via Coding Challenge
              </Link>
            </div>
          </div>
        </motion.div>
      )}

      <AppFooter />

      <style>{`
        @media (max-width: 768px) {
          #match-score-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
