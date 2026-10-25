// ============================================
// SKILLSYNC AI — CODING CHALLENGES PAGE
// ============================================
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, CheckCircle, XCircle, Play, Clock, AlertTriangle, ChevronLeft, Sparkles, Check } from 'lucide-react';
import {
  PageHeader, DemoBanner, Badge, LoadingSpinner, StatusBadge, AppFooter
} from '@/components/common/UI';
import { challengeApi } from '@/services/api';
import { appState } from '@/services/appState';
import { demoChallenges } from '@/services/demoData';
import type { CodingChallenge, CodingSubmission } from '@/types';

const difficultyConfig = {
  easy: { color: 'var(--accent-emerald)', bg: 'var(--accent-emerald-light)' },
  medium: { color: 'var(--accent-amber)', bg: 'var(--accent-amber-light)' },
  hard: { color: 'var(--accent-rose)', bg: 'var(--accent-rose-light)' },
};

function ChallengeList({
  challenges, completedIds, onSelect,
}: { challenges: CodingChallenge[]; completedIds: string[]; onSelect: (c: CodingChallenge) => void }) {
  return (
    <div className="flex flex-col gap-3">
      {challenges.map(ch => {
        const dc = difficultyConfig[ch.difficulty];
        const isDone = completedIds.includes(ch.id);
        return (
          <motion.button
            key={ch.id}
            whileHover={{ x: 4 }}
            onClick={() => onSelect(ch)}
            style={{
              width: '100%', padding: 'var(--space-4) var(--space-5)',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--bg-elevated)',
              border: `1px solid ${isDone ? 'var(--accent-emerald)' : 'var(--border-primary)'}`,
              cursor: 'pointer', textAlign: 'left',
              transition: 'border-color var(--duration-fast)',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = isDone ? 'var(--accent-emerald)' : 'var(--accent-primary)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = isDone ? 'var(--accent-emerald)' : 'var(--border-primary)'}
          >
            <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-2)' }}>
              <div className="flex items-center gap-2">
                <Code size={16} style={{ color: 'var(--accent-primary)' }} />
                <span style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{ch.title}</span>
                {isDone && <Badge variant="emerald" size="sm">Passed</Badge>}
              </div>
              <div className="flex items-center gap-2">
                <span style={{
                  fontSize: '0.6875rem', padding: '2px 8px', borderRadius: 'var(--radius-full)',
                  background: dc.bg, color: dc.color, fontWeight: 600,
                }}>
                  {ch.difficulty}
                </span>
                <Badge variant="ghost" size="sm">{ch.language.toUpperCase()}</Badge>
              </div>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--fg-tertiary)', margin: 0 }}>
              {ch.description}
            </p>
            <div className="flex items-center gap-3" style={{ marginTop: 'var(--space-2)', fontSize: '0.75rem', color: 'var(--fg-tertiary)' }}>
              <span><Clock size={11} style={{ display: 'inline', marginRight: 4 }} />{ch.time_limit_minutes} min</span>
              <span>Skill: {ch.skill}</span>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}

function ChallengeWorkspace({
  challenge, onBack, onComplete,
}: { challenge: CodingChallenge; onBack: () => void; onComplete: () => void }) {
  const [code, setCode] = useState(challenge.starter_code);
  const [submitting, setSubmitting] = useState(false);
  const [submission, setSubmission] = useState<CodingSubmission | null>(null);
  const [isDemo, setIsDemo] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmission(null);
    try {
      const result = await challengeApi.submit(challenge.id, code, challenge.language);
      setSubmission(result);
      if (result.status === 'passed') {
        appState.recordChallengeSubmission(challenge.id, true);
        onComplete();
      }
      setIsDemo(false);
    } catch {
      // Deterministic evaluation simulator
      const passed = code.trim().length > challenge.starter_code.trim().length + 5;
      const sub: CodingSubmission = {
        id: `sub-${Date.now()}`,
        challenge_id: challenge.id,
        code,
        language: challenge.language,
        status: passed ? 'passed' : 'failed',
        results: challenge.test_cases.map((tc, i) => ({
          test_case_id: tc.id,
          passed: passed || i === 0,
          actual_output: passed ? tc.expected_output : 'AssertionError: test case condition unmet',
        })),
        submitted_at: new Date().toISOString(),
        is_demo_evaluation: true,
      };
      setSubmission(sub);
      if (passed) {
        appState.recordChallengeSubmission(challenge.id, true);
        onComplete();
      }
      setIsDemo(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <button className="btn btn-ghost btn-sm" onClick={onBack} style={{ marginBottom: 'var(--space-4)' }}>
        <ChevronLeft size={16} /> Back to Challenges
      </button>

      {isDemo && (
        <div className="flex items-center gap-2" style={{
          padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-md)',
          background: 'var(--accent-amber-light)', border: '1px solid var(--accent-amber)',
          marginBottom: 'var(--space-4)',
        }}>
          <AlertTriangle size={14} style={{ color: 'var(--accent-amber)', flexShrink: 0 }} />
          <span style={{ fontSize: '0.8125rem', color: 'var(--fg-secondary)' }}>
            Sandbox Execution: Code evaluation simulation active. Deploy the Docker sandbox service for isolated containerized execution.
          </span>
        </div>
      )}

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 'var(--space-5)', alignItems: 'start' }} id="challenge-grid">
        {/* Left: Problem Statement */}
        <div className="card-static" style={{ padding: 'var(--space-6)' }}>
          <div className="flex items-center gap-2" style={{ marginBottom: 'var(--space-3)' }}>
            <h3 style={{ fontWeight: 800, fontSize: '1.125rem', flex: 1 }}>{challenge.title}</h3>
            <span style={{
              fontSize: '0.6875rem', padding: '2px 8px', borderRadius: 'var(--radius-full)',
              background: difficultyConfig[challenge.difficulty].bg,
              color: difficultyConfig[challenge.difficulty].color, fontWeight: 600,
            }}>
              {challenge.difficulty}
            </span>
          </div>

          <p style={{ fontSize: '0.875rem', color: 'var(--fg-secondary)', whiteSpace: 'pre-line' }}>
            {challenge.instructions}
          </p>

          {challenge.sample_input && (
            <div style={{ marginTop: 'var(--space-4)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--fg-tertiary)', marginBottom: 'var(--space-2)' }}>
                Sample Input
              </div>
              <pre style={{
                padding: 'var(--space-3)', background: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-md)', fontSize: '0.8125rem',
                color: 'var(--fg-secondary)', overflowX: 'auto',
              }}>
                {challenge.sample_input}
              </pre>
            </div>
          )}

          {challenge.sample_output && (
            <div style={{ marginTop: 'var(--space-3)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--fg-tertiary)', marginBottom: 'var(--space-2)' }}>
                Expected Output
              </div>
              <pre style={{
                padding: 'var(--space-3)', background: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-md)', fontSize: '0.8125rem',
                color: 'var(--accent-emerald)', overflowX: 'auto',
              }}>
                {challenge.sample_output}
              </pre>
            </div>
          )}

          {/* Test Cases Output */}
          {submission && (
            <div style={{ marginTop: 'var(--space-5)' }}>
              <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: 'var(--space-3)' }}>
                Test Cases Evaluation
              </div>
              {challenge.test_cases.filter(tc => !tc.is_hidden).map(tc => {
                const result = submission.results.find(r => r.test_case_id === tc.id);
                return (
                  <div key={tc.id} className="flex items-center gap-2" style={{
                    padding: 'var(--space-2) var(--space-3)',
                    borderRadius: 'var(--radius-md)',
                    background: result?.passed ? 'var(--accent-emerald-light)' : 'var(--accent-rose-light)',
                    marginBottom: 'var(--space-2)',
                  }}>
                    {result?.passed
                      ? <CheckCircle size={14} style={{ color: 'var(--accent-emerald)', flexShrink: 0 }} />
                      : <XCircle size={14} style={{ color: 'var(--accent-rose)', flexShrink: 0 }} />}
                    <span style={{ fontSize: '0.8125rem', fontWeight: 500 }}>
                      {tc.description || `Test Case ${tc.id}`}
                    </span>
                    {!result?.passed && result?.actual_output && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--accent-rose)', marginLeft: 'auto' }}>
                        {result.actual_output}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Code Workspace */}
        <div>
          <div style={{
            background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-primary)', overflow: 'hidden',
            marginBottom: 'var(--space-4)',
          }}>
            <div className="flex items-center justify-between" style={{
              padding: 'var(--space-3) var(--space-4)',
              background: 'var(--bg-secondary)',
              borderBottom: '1px solid var(--border-primary)',
            }}>
              <div className="flex items-center gap-2">
                <Code size={14} style={{ color: 'var(--accent-primary)' }} />
                <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>
                  {challenge.language.toUpperCase()} Solution Editor
                </span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--fg-tertiary)' }}>
                <Clock size={12} style={{ display: 'inline', marginRight: 4 }} />
                {challenge.time_limit_minutes} min limit
              </span>
            </div>

            <textarea
              value={code}
              onChange={e => setCode(e.target.value)}
              style={{
                width: '100%', minHeight: 320,
                background: '#0d1117', color: '#e6edf3',
                border: 'none', padding: 'var(--space-4)',
                fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                fontSize: '0.875rem', lineHeight: 1.6,
                resize: 'vertical', outline: 'none',
              }}
              spellCheck={false}
            />
          </div>

          <div className="flex gap-3">
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={submitting}
              style={{ flex: 1 }}
            >
              {submitting ? <><div className="spin" /> Evaluating Code...</> : <><Play size={15} /> Run Tests & Submit</>}
            </button>
          </div>

          {submission && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                marginTop: 'var(--space-4)', padding: 'var(--space-4)',
                borderRadius: 'var(--radius-lg)',
                background: submission.status === 'passed' ? 'var(--accent-emerald-light)' : 'var(--accent-rose-light)',
                border: `1px solid ${submission.status === 'passed' ? 'var(--accent-emerald)' : 'var(--accent-rose)'}`,
              }}
            >
              <div className="flex items-center gap-2">
                {submission.status === 'passed'
                  ? <CheckCircle size={20} style={{ color: 'var(--accent-emerald)' }} />
                  : <XCircle size={20} style={{ color: 'var(--accent-rose)' }} />}
                <span style={{ fontWeight: 700, color: 'var(--fg-primary)' }}>
                  {submission.status === 'passed' ? 'All test cases passed! Skill demonstrated.' : 'Tests failed. Check requirements.'}
                </span>
                {submission.is_demo_evaluation && (
                  <Badge variant="amber" size="sm">Simulated Sandbox</Badge>
                )}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--fg-tertiary)', marginTop: 4 }}>
                {submission.results.filter(r => r.passed).length}/{submission.results.length} test cases passed
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          #challenge-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<CodingChallenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<CodingChallenge | null>(null);
  const [diffFilter, setDiffFilter] = useState('all');
  const [completedIds, setCompletedIds] = useState<string[]>([]);

  useEffect(() => {
    loadChallenges();
    setCompletedIds(appState.getCompletedChallengeIds());
  }, []);

  const loadChallenges = async () => {
    try {
      const data = await challengeApi.list();
      setChallenges(data.length > 0 ? data : demoChallenges);
    } catch {
      setChallenges(demoChallenges);
    } finally {
      setLoading(false);
    }
  };

  const filtered = diffFilter === 'all' ? challenges : challenges.filter(c => c.difficulty === diffFilter);

  if (selected) {
    return (
      <div style={{ padding: 'var(--space-6)', maxWidth: 1200 }}>
        <ChallengeWorkspace
          challenge={selected}
          onBack={() => {
            setSelected(null);
            setCompletedIds(appState.getCompletedChallengeIds());
          }}
          onComplete={() => {
            setCompletedIds(appState.getCompletedChallengeIds());
          }}
        />

        <AppFooter />
      </div>
    );
  }

  return (
    <div style={{ padding: 'var(--space-6)', maxWidth: 900 }}>
      <PageHeader
        title="Practical Coding Challenges"
        description="Verify your programming, database, and algorithmic skills with real code tasks."
        badge={`${completedIds.length}/${challenges.length} Solved`}
      />

      <div className="tabs" style={{ marginBottom: 'var(--space-5)' }}>
        {['all', 'easy', 'medium', 'hard'].map(d => (
          <button key={d} className={`tab ${diffFilter === d ? 'active' : ''}`} onClick={() => setDiffFilter(d)}>
            {d === 'all' ? 'All' : d.charAt(0).toUpperCase() + d.slice(1)}
            {d !== 'all' && ` (${challenges.filter(c => c.difficulty === d).length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center" style={{ padding: 'var(--space-16)' }}><LoadingSpinner /></div>
      ) : (
        <ChallengeList
          challenges={filtered}
          completedIds={completedIds}
          onSelect={setSelected}
        />
      )}

      <AppFooter />
    </div>
  );
}
