// ============================================
// SKILLSYNC AI — AI MOCK INTERVIEWS PAGE
// ============================================
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare, ChevronRight, Send, CheckCircle, AlertCircle,
  BarChart3, ChevronLeft, Sparkles, Clock, History, Award
} from 'lucide-react';
import {
  PageHeader, DemoBanner, Badge, ProgressBar, LoadingSpinner, ScoreRing, AppFooter
} from '@/components/common/UI';
import { interviewApi } from '@/services/api';
import { appState } from '@/services/appState';
import type { Interview, InterviewQuestion } from '@/types';

const TECHNICAL_QUESTIONS: InterviewQuestion[] = [
  {
    id: 'q1',
    question: 'Explain how indexing works in relational databases like PostgreSQL. When would an index degrade performance instead of improving it?',
    category: 'Databases & Performance',
    difficulty: 'medium',
  },
  {
    id: 'q2',
    question: 'What is the JavaScript event loop? Describe the difference between microtasks (Promises, process.nextTick) and macrotasks (setTimeout, setImmediate).',
    category: 'JavaScript & Node.js',
    difficulty: 'medium',
  },
  {
    id: 'q3',
    question: 'How do you design a robust rate-limiting mechanism for a public RESTful API? Discuss Redis token bucket vs sliding window counter.',
    category: 'System Design & APIs',
    difficulty: 'hard',
  }
];

const BEHAVIORAL_QUESTIONS: InterviewQuestion[] = [
  {
    id: 'bq1',
    question: 'Describe a situation where you had a disagreement with a team member or technical lead over an architectural choice. How did you resolve it?',
    category: 'Teamwork & Conflict Resolution',
    difficulty: 'medium',
  },
  {
    id: 'bq2',
    question: 'Tell me about a high-severity production issue or outage you caused or helped debug. What was your triage process and post-mortem takeaway?',
    category: 'Incident Response & Ownership',
    difficulty: 'hard',
  }
];

export default function InterviewsPage() {
  const [view, setView] = useState<'setup' | 'active' | 'results'>('setup');
  const [role, setRole] = useState('Full-Stack Developer');
  const [type, setType] = useState<'technical' | 'behavioral' | 'system_design'>('technical');
  const [level, setLevel] = useState('junior');
  const [interview, setInterview] = useState<Interview | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDemo, setIsDemo] = useState(false);
  const [history, setHistory] = useState<{ role: string; score: number; timestamp: string }[]>([]);

  useEffect(() => {
    setHistory(appState.getPastInterviews());
  }, []);

  const startInterview = async () => {
    setLoading(true);
    const questionsToUse = type === 'behavioral' ? BEHAVIORAL_QUESTIONS : TECHNICAL_QUESTIONS;

    try {
      const iv = await interviewApi.create(role, type as any, level);
      setInterview(iv);
      setIsDemo(false);
    } catch {
      setInterview({
        id: `iv-${Date.now()}`,
        role,
        type: type as any,
        experience_level: level,
        status: 'in_progress',
        questions: questionsToUse.map(q => ({ ...q })),
        created_at: new Date().toISOString(),
      });
      setIsDemo(true);
    } finally {
      setLoading(false);
      setView('active');
      setCurrentQ(0);
      setAnswer('');
    }
  };

  const submitAnswer = async () => {
    if (!interview || !answer.trim()) return;
    const q = interview.questions[currentQ];
    setSubmitting(true);

    try {
      const updatedQ = await interviewApi.submitAnswer(interview.id, q.id, answer);
      const updated = {
        ...interview,
        questions: interview.questions.map((iq, i) => i === currentQ ? updatedQ : iq),
      };
      setInterview(updated);
    } catch {
      // Deterministic evaluation rubric
      const wordCount = answer.trim().split(/\s+/).length;
      const techScore = Math.min(95, Math.max(50, 60 + Math.min(30, Math.floor(wordCount * 0.4))));
      const relevanceScore = Math.min(95, Math.max(55, 65 + Math.min(25, Math.floor(wordCount * 0.3))));
      const completenessScore = wordCount > 50 ? 85 : wordCount > 25 ? 70 : 55;
      const clarityScore = answer.includes('.') ? 85 : 65;
      const overall = Math.round((techScore + relevanceScore + completenessScore + clarityScore) / 4);

      const evalFeedback = {
        technical_correctness: techScore,
        relevance: relevanceScore,
        completeness: completenessScore,
        clarity: clarityScore,
        overall_score: overall,
        feedback: wordCount > 40
          ? 'Strong technical foundation. You explained key concepts clearly and demonstrated sound contextual reasoning.'
          : 'Answer provides a high-level summary but would benefit from greater technical specificity, concrete examples, or edge case considerations.',
        improvements: [
          'Support core statements with concrete syntax or architecture examples',
          type === 'behavioral' ? 'Structure responses using the STAR method (Situation, Task, Action, Result)' : 'Mention trade-offs and performance implications',
          'Highlight error handling and production considerations'
        ],
      };

      const updated = {
        ...interview,
        questions: interview.questions.map((iq, i) =>
          i === currentQ ? { ...iq, answer, evaluation: evalFeedback } : iq
        ),
      };
      setInterview(updated);
    } finally {
      setSubmitting(false);

      if (currentQ < interview.questions.length - 1) {
        setCurrentQ(currentQ + 1);
        setAnswer('');
      } else {
        // Complete interview and record score
        const questionsWithEval = interview.questions;
        const totalScore = questionsWithEval.reduce((sum, item) => sum + (item.evaluation?.overall_score || 75), 0);
        const finalScore = Math.round(totalScore / Math.max(1, questionsWithEval.length));

        setInterview(prev => prev ? { ...prev, overall_score: finalScore, status: 'completed' } : null);
        appState.recordInterviewScore(interview.role, finalScore);
        setHistory(appState.getPastInterviews());
        setView('results');
      }
    }
  };

  return (
    <div style={{ padding: 'var(--space-6)', maxWidth: 1000 }}>
      {isDemo && <DemoBanner />}

      <PageHeader
        title="AI Mock Interviews"
        description="Practice role-tailored technical, behavioral, and system design questions with multi-factor scoring."
      />

      {/* Setup View */}
      {view === 'setup' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="card-static" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
            <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-5)' }}>Configure Interview Workspace</h3>

            <div className="flex flex-col gap-4">
              <div>
                <label className="label" htmlFor="iv-role-select">Target Role</label>
                <input id="iv-role-select" className="input" value={role} onChange={e => setRole(e.target.value)} />
              </div>

              <div>
                <label className="label">Interview Track</label>
                <div className="flex gap-3" style={{ flexWrap: 'wrap' }}>
                  {(['technical', 'behavioral', 'system_design'] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => setType(t)}
                      style={{
                        flex: 1, minWidth: 140, padding: 'var(--space-3)',
                        borderRadius: 'var(--radius-md)', cursor: 'pointer',
                        border: `2px solid ${type === t ? 'var(--accent-primary)' : 'var(--border-primary)'}`,
                        background: type === t ? 'var(--accent-primary-light)' : 'transparent',
                        color: type === t ? 'var(--accent-primary)' : 'var(--fg-secondary)',
                        fontWeight: type === t ? 700 : 500, fontSize: '0.875rem',
                        transition: 'all var(--duration-fast)',
                      }}
                    >
                      {t.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="label" htmlFor="iv-level-select">Experience Level</label>
                <select
                  id="iv-level-select"
                  className="input"
                  value={level}
                  onChange={e => setLevel(e.target.value)}
                >
                  <option value="student">Student / Early Career</option>
                  <option value="junior">Junior (0-2 years)</option>
                  <option value="mid">Mid-Level (2-5 years)</option>
                  <option value="senior">Senior (5+ years)</option>
                </select>
              </div>
            </div>

            <div style={{ marginTop: 'var(--space-5)', padding: 'var(--space-3)', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
              <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--fg-tertiary)' }}>
                <AlertCircle size={13} style={{ display: 'inline', marginRight: 6, color: 'var(--accent-primary)' }} />
                Scored across 4 pillars: Technical Depth, Relevance, Completeness, and Clarity. Transparent heuristic evaluation active in local demo mode.
              </p>
            </div>
          </div>

          <div className="flex gap-3" style={{ marginBottom: 'var(--space-8)' }}>
            <button className="btn btn-primary btn-lg" onClick={startInterview} disabled={loading || !role.trim()}>
              {loading ? <LoadingSpinner size={16} /> : <MessageSquare size={16} />}
              {loading ? 'Preparing Session...' : 'Start Interview Session'}
            </button>
          </div>

          {/* Past Interview History */}
          {history.length > 0 && (
            <div className="card-static" style={{ padding: 'var(--space-5)' }}>
              <div className="flex items-center gap-2" style={{ marginBottom: 'var(--space-3)' }}>
                <History size={16} style={{ color: 'var(--accent-primary)' }} />
                <h4 style={{ fontWeight: 700, margin: 0, fontSize: '0.9375rem' }}>Previous Session History</h4>
              </div>
              <div className="flex flex-col gap-2">
                {history.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between" style={{
                    padding: 'var(--space-2) var(--space-3)', borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-tertiary)', fontSize: '0.8125rem',
                  }}>
                    <span>{item.role}</span>
                    <div className="flex items-center gap-3">
                      <span style={{ fontWeight: 700, color: item.score >= 75 ? 'var(--accent-emerald)' : 'var(--accent-amber)' }}>
                        {item.score}/100
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--fg-tertiary)' }}>
                        {new Date(item.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Active Interview Workspace */}
      {view === 'active' && interview && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="card-static" style={{ padding: 'var(--space-4)', marginBottom: 'var(--space-5)' }}>
            <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-2)' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                Question {currentQ + 1} of {interview.questions.length}
              </span>
              <button className="btn btn-ghost btn-sm" onClick={() => setView('setup')}>
                <ChevronLeft size={14} /> Exit Session
              </button>
            </div>
            <ProgressBar value={currentQ + 1} max={interview.questions.length} />
          </div>

          {interview.questions[currentQ] && (
            <div>
              <div className="card-static" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-4)' }}>
                <div className="flex items-center gap-2" style={{ marginBottom: 'var(--space-3)' }}>
                  <Badge variant="primary" size="sm">{interview.questions[currentQ].category}</Badge>
                  <Badge
                    variant={interview.questions[currentQ].difficulty === 'easy' ? 'emerald' : interview.questions[currentQ].difficulty === 'medium' ? 'amber' : 'rose'}
                    size="sm"
                  >
                    {interview.questions[currentQ].difficulty}
                  </Badge>
                </div>
                <h3 style={{ fontWeight: 700, fontSize: '1.125rem', lineHeight: 1.5 }}>
                  {interview.questions[currentQ].question}
                </h3>
              </div>

              <div style={{ marginBottom: 'var(--space-4)' }}>
                <label className="label" htmlFor="interview-answer-box">Your Response</label>
                <textarea
                  id="interview-answer-box"
                  className="input"
                  value={answer}
                  onChange={e => setAnswer(e.target.value)}
                  placeholder="Formulate your response thoroughly. Include practical examples, architecture context, or STAR structure..."
                  style={{ minHeight: 200, resize: 'vertical', fontSize: '0.875rem' }}
                />
              </div>

              <div className="flex gap-3">
                <button
                  className="btn btn-primary"
                  onClick={submitAnswer}
                  disabled={!answer.trim() || submitting}
                >
                  {submitting ? <LoadingSpinner size={14} /> : <Send size={15} />}
                  {submitting ? 'Evaluating Response...' : currentQ < interview.questions.length - 1 ? 'Submit & Next Question' : 'Submit & Complete'}
                </button>
                <button className="btn btn-secondary" onClick={() => {
                  if (currentQ < interview.questions.length - 1) {
                    setCurrentQ(currentQ + 1); setAnswer('');
                  } else setView('results');
                }}>
                  Skip Question
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Results View */}
      {view === 'results' && interview && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="card-static flex items-center gap-6" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
            <ScoreRing score={interview.overall_score || 75} size={110} strokeWidth={8} label="Average" />
            <div>
              <h3 style={{ fontWeight: 800, fontSize: '1.25rem', marginBottom: 4 }}>Interview Complete</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--fg-tertiary)', margin: 0 }}>
                {interview.role} • {interview.type} • {interview.experience_level}
              </p>
              <button className="btn btn-ghost btn-sm" onClick={() => setView('setup')} style={{ marginTop: 'var(--space-3)', padding: 0, color: 'var(--accent-primary)' }}>
                Start Another Session →
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {interview.questions.map((q, i) => (
              <div key={q.id} className="card-static" style={{ padding: 'var(--space-5)' }}>
                <div style={{ fontWeight: 700, marginBottom: 'var(--space-2)', fontSize: '0.9375rem' }}>
                  Q{i + 1}: {q.question}
                </div>

                {q.answer && (
                  <div style={{
                    padding: 'var(--space-3)', background: 'var(--bg-tertiary)',
                    borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-3)',
                    fontSize: '0.875rem', color: 'var(--fg-secondary)', fontStyle: 'italic',
                  }}>
                    "{q.answer}"
                  </div>
                )}

                {q.evaluation && (
                  <div>
                    <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
                      {[
                        { label: 'Technical', value: q.evaluation.technical_correctness },
                        { label: 'Relevance', value: q.evaluation.relevance },
                        { label: 'Completeness', value: q.evaluation.completeness },
                        { label: 'Clarity', value: q.evaluation.clarity },
                      ].map(m => (
                        <div key={m.label} style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: m.value >= 80 ? 'var(--accent-emerald)' : m.value >= 60 ? 'var(--accent-cyan)' : 'var(--accent-amber)' }}>
                            {m.value}
                          </div>
                          <div style={{ fontSize: '0.6875rem', color: 'var(--fg-tertiary)' }}>{m.label}</div>
                        </div>
                      ))}
                    </div>

                    <div style={{ fontSize: '0.8125rem', color: 'var(--fg-secondary)', marginBottom: 'var(--space-3)', lineHeight: 1.6 }}>
                      {q.evaluation.feedback}
                    </div>

                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-amber)', marginBottom: 'var(--space-2)' }}>
                        Actionable Critique:
                      </div>
                      {q.evaluation.improvements.map((imp, j) => (
                        <div key={j} className="flex items-center gap-2" style={{
                          fontSize: '0.8125rem', color: 'var(--fg-tertiary)', padding: '2px 0',
                        }}>
                          <ChevronRight size={12} style={{ color: 'var(--accent-amber)', flexShrink: 0 }} />
                          {imp}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <AppFooter />
    </div>
  );
}
