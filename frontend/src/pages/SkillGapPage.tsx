// ============================================
// SKILLSYNC AI — SKILL GAP ANALYSIS PAGE
// ============================================
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  GitBranch, AlertTriangle, Sparkles, Target, ArrowRight,
  CheckCircle2, Clock, Layers, BookOpen, Shield, ChevronRight
} from 'lucide-react';
import {
  PageHeader, DemoBanner, Badge, ProgressBar, LoadingSpinner, AppFooter
} from '@/components/common/UI';
import { skillGapApi } from '@/services/api';
import { appState } from '@/services/appState';
import type { SkillGap } from '@/types';

// Predefined structured skill dependency tracks
const DEPENDENCY_TRACKS = [
  {
    name: 'Full-Stack & Cloud Pathway',
    nodes: [
      { id: 'git', label: 'Git & Version Control', prereq: [], level: 'Foundational' },
      { id: 'ts', label: 'TypeScript / Modern JS', prereq: ['git'], level: 'Foundational' },
      { id: 'react', label: 'React & Component Architecture', prereq: ['ts'], level: 'Intermediate' },
      { id: 'api', label: 'REST APIs & Node/FastAPI', prereq: ['ts'], level: 'Intermediate' },
      { id: 'db', label: 'PostgreSQL & Data Modeling', prereq: ['api'], level: 'Intermediate' },
      { id: 'docker', label: 'Docker & Containerization', prereq: ['api'], level: 'Advanced' },
      { id: 'cloud', label: 'AWS / Cloud Deployment', prereq: ['docker'], level: 'Advanced' },
      { id: 'k8s', label: 'Kubernetes Orchestration', prereq: ['docker', 'cloud'], level: 'Expert' },
    ]
  },
  {
    name: 'AI & Data Engineering Pathway',
    nodes: [
      { id: 'py', label: 'Python Fundamentals', prereq: [], level: 'Foundational' },
      { id: 'sql', label: 'SQL & Database Queries', prereq: ['py'], level: 'Foundational' },
      { id: 'fastapi', label: 'FastAPI Microservices', prereq: ['py'], level: 'Intermediate' },
      { id: 'ml', label: 'Scikit-learn / ML Modeling', prereq: ['py'], level: 'Intermediate' },
      { id: 'llm', label: 'LLM & LangChain Orchestration', prereq: ['fastapi', 'ml'], level: 'Advanced' },
      { id: 'vector', label: 'Vector DBs (pgvector/Pinecone)', prereq: ['llm', 'sql'], level: 'Advanced' },
    ]
  }
];

export default function SkillGapPage() {
  const [gaps, setGaps] = useState<SkillGap[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDemo, setIsDemo] = useState(false);
  const [targetRole, setTargetRole] = useState('Full-Stack Developer');
  const [filter, setFilter] = useState<'all' | 'critical' | 'important' | 'recommended'>('all');
  const [selectedTrack, setSelectedTrack] = useState(0);

  useEffect(() => {
    loadGaps(targetRole);
  }, []);

  const loadGaps = async (role: string) => {
    setLoading(true);
    try {
      const data = await skillGapApi.analyze(role);
      setGaps(data);
      setIsDemo(false);
    } catch {
      // Calculate dynamic gaps against the user's active resume skills
      const resume = appState.getResumeAnalysis();
      const userSkills = new Set(resume.skills.map(s => s.name.toLowerCase()));

      const targetRoleSkills = [
        { skill: 'Docker', category: 'devops' as const, importance: 'critical' as const, req: 8, prereqs: ['Linux', 'Git'], reason: 'Required in 85% of full-stack developer postings for reliable containerized deployments.' },
        { skill: 'Kubernetes', category: 'devops' as const, importance: 'important' as const, req: 7, prereqs: ['Docker'], reason: 'Industry standard for modern container orchestration and scaling.' },
        { skill: 'CI/CD Pipelines', category: 'devops' as const, importance: 'critical' as const, req: 8, prereqs: ['Git', 'Docker'], reason: 'Essential for automated test execution and production releases.' },
        { skill: 'AWS Cloud Services', category: 'cloud' as const, importance: 'important' as const, req: 7, prereqs: ['Docker'], reason: 'Major cloud provider for hosting production microservices and databases.' },
        { skill: 'Redis Caching', category: 'database' as const, importance: 'recommended' as const, req: 6, prereqs: ['PostgreSQL'], reason: 'In-memory data store for accelerating query response latency.' },
        { skill: 'System Design', category: 'soft_skill' as const, importance: 'important' as const, req: 8, prereqs: ['REST APIs', 'PostgreSQL'], reason: 'Evaluated heavily in technical interviews for scalable architecture design.' },
        { skill: 'TypeScript', category: 'programming_language' as const, importance: 'critical' as const, req: 8, prereqs: ['JavaScript'], reason: 'Type safety and enterprise codebase maintainability.' },
        { skill: 'GraphQL', category: 'framework' as const, importance: 'recommended' as const, req: 6, prereqs: ['REST APIs'], reason: 'Alternative API query paradigm for flexible client-driven data fetching.' }
      ];

      const computedGaps: SkillGap[] = targetRoleSkills.map(item => {
        const hasSkill = userSkills.has(item.skill.toLowerCase());
        const currentLevel = hasSkill ? 7 : 2;
        const gapScore = Math.max(0, item.req - currentLevel);

        return {
          skill: item.skill,
          category: item.category,
          importance: item.importance,
          current_level: currentLevel,
          required_level: item.req,
          gap_score: gapScore,
          prerequisites: item.prereqs,
          reason: item.reason,
        };
      });

      setGaps(computedGaps);
      setIsDemo(true);
    } finally {
      setLoading(false);
    }
  };

  const resumeSkills = new Set(appState.getResumeAnalysis().skills.map(s => s.name.toLowerCase()));
  const filteredGaps = filter === 'all' ? gaps : gaps.filter(g => g.importance === filter);

  const criticalCount = gaps.filter(g => g.importance === 'critical').length;
  const importantCount = gaps.filter(g => g.importance === 'important').length;
  const recommendedCount = gaps.filter(g => g.importance === 'recommended').length;

  const readinessScore = Math.round(
    100 - (criticalCount * 12 + importantCount * 7 + recommendedCount * 3)
  );

  return (
    <div style={{ padding: 'var(--space-6)', maxWidth: 1200 }}>
      {isDemo && <DemoBanner />}

      <PageHeader
        title="Adaptive Skill Gap Engine"
        description="Analyze skill deficiencies against your target role, explore structured prerequisites, and prioritize learning sequence."
      />

      {/* Target Role Selector */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-static"
        style={{ padding: 'var(--space-5)', marginBottom: 'var(--space-6)' }}
      >
        <div className="flex gap-3" style={{ flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            <label className="label" htmlFor="gap-role-input">Target Role for Gap Analysis</label>
            <input
              id="gap-role-input"
              className="input"
              value={targetRole}
              onChange={e => setTargetRole(e.target.value)}
              placeholder="e.g. Senior Full-Stack Developer, DevOps Engineer"
            />
          </div>
          <div className="flex items-end gap-2">
            <button
              className="btn btn-primary"
              onClick={() => loadGaps(targetRole)}
              disabled={loading || !targetRole.trim()}
            >
              {loading ? <><div className="spin" /> Computing Gaps...</> : <><GitBranch size={15} /> Recalculate Gaps</>}
            </button>
            <Link to="/app/roadmap" className="btn btn-secondary">
              <BookOpen size={14} /> Open Career Roadmap
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Metric Cards */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
        <div className="card-static text-center" style={{ padding: 'var(--space-5)' }}>
          <div style={{
            fontSize: '2rem', fontWeight: 800,
            color: readinessScore >= 75 ? 'var(--accent-emerald)' : readinessScore >= 55 ? 'var(--accent-amber)' : 'var(--accent-rose)'
          }}>
            {Math.max(20, readinessScore)}%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--fg-tertiary)', fontWeight: 600 }}>Role Alignment</div>
        </div>

        <div className="card-static text-center" style={{ padding: 'var(--space-5)' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-rose)' }}>{criticalCount}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--fg-tertiary)', fontWeight: 600 }}>Critical Gaps</div>
        </div>

        <div className="card-static text-center" style={{ padding: 'var(--space-5)' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-amber)' }}>{importantCount}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--fg-tertiary)', fontWeight: 600 }}>High Priority</div>
        </div>

        <div className="card-static text-center" style={{ padding: 'var(--space-5)' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>{recommendedCount}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--fg-tertiary)', fontWeight: 600 }}>Recommended</div>
        </div>
      </div>

      {/* Interactive Skill Dependency Graph / Pathway */}
      <div className="card-static" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
        <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 8 }}>
          <div>
            <h3 style={{ fontWeight: 700, fontSize: '1.125rem', margin: 0 }}>
              Skill Dependency Pathways
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--fg-tertiary)', margin: '4px 0 0' }}>
              Skills build upon prior foundations. Color shows your current verified mastery.
            </p>
          </div>

          <div className="flex gap-2">
            {DEPENDENCY_TRACKS.map((track, i) => (
              <button
                key={i}
                className={`btn btn-sm ${selectedTrack === i ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setSelectedTrack(i)}
              >
                {track.name.split(' ')[0]} Pathway
              </button>
            ))}
          </div>
        </div>

        {/* Pathway Nodes */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 'var(--space-3)', padding: 'var(--space-2) 0',
        }}>
          {DEPENDENCY_TRACKS[selectedTrack].nodes.map((node, idx) => {
            const hasMastered = resumeSkills.has(node.label.toLowerCase().split(' ')[0]) ||
                                resumeSkills.has(node.id);
            return (
              <div
                key={node.id}
                style={{
                  padding: 'var(--space-4)',
                  borderRadius: 'var(--radius-lg)',
                  background: hasMastered ? 'rgba(223, 255, 0, 0.06)' : 'rgba(255, 255, 255, 0.02)',
                  border: `1px solid ${hasMastered ? 'rgba(223, 255, 0, 0.4)' : 'rgba(255, 255, 255, 0.08)'}`,
                  boxShadow: hasMastered ? '0 0 16px rgba(223, 255, 0, 0.12)' : 'none',
                  position: 'relative',
                  transition: 'all 0.2s ease',
                }}
              >
                <div className="flex items-center justify-between" style={{ marginBottom: 4 }}>
                  <span style={{ fontSize: '0.6875rem', color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {node.level}
                  </span>
                  {hasMastered ? (
                    <Badge variant="primary" size="sm">Mastered</Badge>
                  ) : (
                    <Badge variant="amber" size="sm">Gap</Badge>
                  )}
                </div>

                <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--fg-primary)', marginBottom: 'var(--space-2)' }}>
                  {node.label}
                </div>

                {node.prereq.length > 0 && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--fg-tertiary)' }}>
                    Requires: <strong>{node.prereq.join(', ').toUpperCase()}</strong>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Categorized Gaps List */}
      <div className="card-static" style={{ padding: 'var(--space-6)' }}>
        <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 8 }}>
          <h3 style={{ fontWeight: 700, fontSize: '1.125rem', margin: 0 }}>
            Identified Competency Gaps ({filteredGaps.length})
          </h3>

          <div className="flex gap-2">
            <button
              className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setFilter('all')}
            >
              All Gaps
            </button>
            <button
              className={`btn btn-sm ${filter === 'critical' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setFilter('critical')}
            >
              Critical ({criticalCount})
            </button>
            <button
              className={`btn btn-sm ${filter === 'important' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setFilter('important')}
            >
              Important ({importantCount})
            </button>
            <button
              className={`btn btn-sm ${filter === 'recommended' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setFilter('recommended')}
            >
              Recommended ({recommendedCount})
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {filteredGaps.map(gap => (
            <div
              key={gap.skill}
              style={{
                padding: 'var(--space-4)',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-tertiary)',
                borderLeft: `4px solid ${gap.importance === 'critical' ? 'var(--accent-rose)' : gap.importance === 'important' ? 'var(--accent-amber)' : 'var(--accent-cyan)'}`,
                borderTop: '1px solid var(--border-secondary)',
                borderRight: '1px solid var(--border-secondary)',
                borderBottom: '1px solid var(--border-secondary)',
              }}
            >
              <div className="flex items-start justify-between" style={{ marginBottom: 4 }}>
                <div className="flex items-center gap-2">
                  <span style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{gap.skill}</span>
                  <Badge variant={gap.importance === 'critical' ? 'rose' : gap.importance === 'important' ? 'amber' : 'cyan'} size="sm">
                    {gap.importance}
                  </Badge>
                  <Badge variant="ghost" size="sm">{gap.category.replace(/_/g, ' ')}</Badge>
                </div>
                <Link to="/app/roadmap" className="btn btn-ghost btn-sm" style={{ padding: '2px 8px', fontSize: '0.75rem' }}>
                  Learn in Roadmap <ChevronRight size={13} />
                </Link>
              </div>

              <p style={{ fontSize: '0.8125rem', color: 'var(--fg-secondary)', margin: '4px 0 var(--space-2)' }}>
                {gap.reason}
              </p>

              <div className="flex items-center gap-4" style={{ fontSize: '0.75rem', color: 'var(--fg-tertiary)' }}>
                {gap.prerequisites.length > 0 && (
                  <span>Prerequisites: <strong>{gap.prerequisites.join(', ')}</strong></span>
                )}
                <span>Current Level: {gap.current_level}/10 → Target: {gap.required_level}/10</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AppFooter />
    </div>
  );
}
