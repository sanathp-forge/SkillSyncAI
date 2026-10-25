// ============================================
// SKILLSYNC AI — OBSIDIAN CONSTELLATION DASHBOARD
// Black × RGB Yellow Glassmorphic Career Intelligence Command Center
// ============================================
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Target, Shield, GitBranch, ArrowRight, Sparkles,
  TrendingUp, Code, MessageSquare, Clock, CheckCircle2,
  AlertTriangle, Compass, Layers, Zap, ExternalLink,
  ChevronRight, RefreshCw, FileText
} from 'lucide-react';
import {
  ScoreRing, DemoBanner, ProgressBar, Badge, CardSkeleton,
  AnimatedNumber, AppFooter
} from '@/components/common/UI';
import SkillConstellation from '@/components/common/SkillConstellation';
import { useAuth } from '@/hooks/useAuth';
import { dashboardApi } from '@/services/api';
import { appState } from '@/services/appState';
import { demoDashboard } from '@/services/demoData';
import type { DashboardData } from '@/types';

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const d = await dashboardApi.getData();
      setData(d);
    } catch {
      const synced = appState.syncDashboard();
      setData(synced);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 'var(--space-6)', maxWidth: 1440, margin: '0 auto' }}>
        <div style={{ height: 120, marginBottom: 'var(--space-6)' }}>
          <CardSkeleton />
        </div>
        <div className="grid" style={{ gridTemplateColumns: '7fr 5fr', gap: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  const d = data || demoDashboard;
  const matchScore = d.match_score || 78;
  const targetRole = d.target_role || 'Senior Full-Stack Engineer';

  return (
    <div style={{ padding: 'var(--space-6)', maxWidth: 1440, margin: '0 auto', position: 'relative' }}>
      {d.is_demo_data && <DemoBanner />}

      {/* ============================================
          1. EDITORIAL INTRODUCTION (SECTION 5.A)
          ============================================ */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          marginBottom: 'var(--space-8)',
          position: 'relative',
        }}
      >
        <div className="flex items-center justify-between flex-wrap gap-4" style={{ marginBottom: 'var(--space-3)' }}>
          <div className="flex items-center gap-2">
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 12px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(223, 255, 0, 0.08)',
              border: '1px solid rgba(223, 255, 0, 0.28)',
              fontSize: '0.6875rem',
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--accent-primary)',
            }}>
              <span style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: 'var(--accent-primary)',
                boxShadow: '0 0 10px var(--accent-primary)',
              }} />
              SKILLSYNC INTELLIGENCE ENGINE
            </span>

            <span style={{
              fontSize: '0.75rem',
              color: 'var(--fg-tertiary)',
              paddingLeft: 8,
              borderLeft: '1px solid var(--border-primary)',
            }}>
              Target: <strong style={{ color: 'var(--fg-primary)' }}>{targetRole}</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/app/matching"
              className="btn btn-secondary btn-sm flex items-center gap-1.5"
              style={{ fontSize: '0.8125rem' }}
            >
              <Target size={14} /> Compare Against Job
            </Link>
            <Link
              to="/app/roadmap"
              className="btn btn-primary btn-sm flex items-center gap-1.5"
              style={{
                fontSize: '0.8125rem',
                boxShadow: '0 0 20px rgba(223, 255, 0, 0.35)',
              }}
            >
              <Zap size={14} /> Close Next Gap
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <h1 style={{
              fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
              fontWeight: 850,
              letterSpacing: '-0.035em',
              lineHeight: 1.15,
              margin: '0 0 var(--space-2) 0',
              background: 'linear-gradient(135deg, #F7F7F5 30%, #F4FF5E 75%, #DFFF00 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Your next level starts here.
            </h1>
            <p style={{
              fontSize: '1.0625rem',
              color: 'var(--fg-secondary)',
              maxWidth: 680,
              lineHeight: 1.5,
              margin: 0,
            }}>
              Understand your strengths, prove your skills with verifiable repository evidence, and systematically close the gap to your target role.
            </p>
          </div>

          {/* Secondary Context Strip */}
          <div className="flex items-center gap-4" style={{
            padding: 'var(--space-2) var(--space-4)',
            background: 'rgba(255, 255, 255, 0.035)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-primary)',
            backdropFilter: 'blur(16px)',
          }}>
            <div className="flex items-center gap-2">
              <span style={{ fontSize: '0.75rem', color: 'var(--fg-tertiary)' }}>Profile:</span>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--fg-primary)' }}>
                {user?.full_name || 'Candidate Profile'}
              </span>
            </div>
            <div style={{ width: 1, height: 14, background: 'var(--border-primary)' }} />
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={13} style={{ color: 'var(--accent-secondary)' }} />
              <span style={{ fontSize: '0.75rem', color: 'var(--fg-secondary)' }}>Evidence Synced</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ============================================
          2. CENTRAL SPLIT: CAREER READINESS & NEXT-BEST-ACTION (SECTION 5.B & 5.C)
          ============================================ */}
      <div
        className="grid"
        style={{
          gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
          gap: 'var(--space-6)',
          marginBottom: 'var(--space-6)',
        }}
        id="dashboard-command-center"
      >
        {/* CAREER READINESS VISUALIZATION (SECTION 5.B) */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="spotlight-card"
          style={{
            padding: 'var(--space-6)',
            background: 'rgba(9, 10, 10, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(20px)',
            position: 'relative',
          }}
        >
          {/* Subtle Ambient Yellow Glow */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: '20%',
            width: 240,
            height: 120,
            background: 'radial-gradient(circle, rgba(223, 255, 0, 0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-5)' }}>
            <div>
              <div className="flex items-center gap-2" style={{ marginBottom: 4 }}>
                <Compass size={16} style={{ color: 'var(--accent-primary)' }} />
                <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, margin: 0, letterSpacing: '-0.01em' }}>
                  Career Readiness Command
                </h3>
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--fg-tertiary)', margin: 0 }}>
                Synthesized readiness vector across validated skills, code proof, and gap progression.
              </p>
            </div>

            <span style={{
              fontSize: '0.6875rem',
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              background: matchScore >= 75 ? 'rgba(223, 255, 0, 0.08)' : 'rgba(255, 191, 71, 0.08)',
              color: matchScore >= 75 ? 'var(--accent-primary)' : 'var(--accent-amber)',
              border: `1px solid ${matchScore >= 75 ? 'rgba(223, 255, 0, 0.28)' : 'rgba(255, 191, 71, 0.28)'}`,
            }}>
              {matchScore >= 80 ? '✦ Senior Interview Ready' : matchScore >= 70 ? '✦ Strong Candidate Match' : '✦ Developing Baseline'}
            </span>
          </div>

          {/* Orbital Readiness Composition */}
          <div className="grid" style={{ gridTemplateColumns: 'auto 1fr', gap: 'var(--space-6)', alignItems: 'center' }}>
            {/* Orbital Indicator with Electric Yellow Ring */}
            <div className="orbital-ring-container" style={{ width: 140, height: 140 }}>
              <div style={{
                position: 'absolute',
                width: 136,
                height: 136,
                borderRadius: '50%',
                border: '1px dashed rgba(223, 255, 0, 0.25)',
              }} />
              <div className="orbital-pulse-dot" style={{
                width: 8,
                height: 8,
                background: '#DFFF00',
                boxShadow: '0 0 12px #DFFF00',
              }} />

              {/* Inner score ring */}
              <ScoreRing
                score={matchScore}
                size={116}
                strokeWidth={8}
                label="Readiness"
              />
            </div>

            {/* 4 Multi-Factor Readiness Breakdown */}
            <div className="flex flex-col gap-3">
              <div>
                <div className="flex items-center justify-between" style={{ fontSize: '0.75rem', marginBottom: 4 }}>
                  <span style={{ color: 'var(--fg-secondary)', fontWeight: 500 }}>Technical Skill Match</span>
                  <span style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>{d.skill_coverage || 82}%</span>
                </div>
                <ProgressBar value={d.skill_coverage || 82} color="var(--accent-primary)" height={6} />
              </div>

              <div>
                <div className="flex items-center justify-between" style={{ fontSize: '0.75rem', marginBottom: 4 }}>
                  <span style={{ color: 'var(--fg-secondary)', fontWeight: 500 }}>Repository Evidence Proof</span>
                  <span style={{ fontWeight: 700, color: 'var(--accent-secondary)' }}>{d.evidence_coverage || 64}%</span>
                </div>
                <ProgressBar value={d.evidence_coverage || 64} color="var(--accent-secondary)" height={6} />
              </div>

              <div>
                <div className="flex items-center justify-between" style={{ fontSize: '0.75rem', marginBottom: 4 }}>
                  <span style={{ color: 'var(--fg-secondary)', fontWeight: 500 }}>Roadmap Milestones</span>
                  <span style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>
                    {d.completed_milestones || 3}/{d.total_milestones || 6} ({Math.round(((d.completed_milestones || 3) / (d.total_milestones || 6)) * 100)}%)
                  </span>
                </div>
                <ProgressBar
                  value={d.completed_milestones || 3}
                  max={d.total_milestones || 6}
                  color="var(--accent-cyan)"
                  height={6}
                />
              </div>

              <div>
                <div className="flex items-center justify-between" style={{ fontSize: '0.75rem', marginBottom: 4 }}>
                  <span style={{ color: 'var(--fg-secondary)', fontWeight: 500 }}>Practical Evaluation & Assessment</span>
                  <span style={{ fontWeight: 700, color: 'var(--accent-amber)' }}>
                    {d.challenges_completed || 4} Solved • {d.interview_avg_score || 88}% Avg
                  </span>
                </div>
                <ProgressBar
                  value={d.interview_avg_score || 88}
                  color="var(--accent-amber)"
                  height={6}
                />
              </div>
            </div>
          </div>

          {/* Micro Trend Narrative Bar */}
          <div style={{
            marginTop: 'var(--space-5)',
            padding: 'var(--space-3) var(--space-4)',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 8,
          }}>
            <div className="flex items-center gap-2">
              <TrendingUp size={14} style={{ color: 'var(--accent-secondary)' }} />
              <span style={{ fontSize: '0.75rem', color: 'var(--fg-secondary)' }}>
                Trajectory: <strong style={{ color: 'var(--fg-primary)' }}>+8% match velocity</strong> over the last 14 days from 2 repository verifications
              </span>
            </div>
            <Link to="/app/reports" style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--accent-primary)',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}>
              View Full Report <ChevronRight size={13} />
            </Link>
          </div>
        </motion.div>

        {/* NEXT-BEST-ACTION SIGNATURE PANEL (SECTION 5.C) */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="spotlight-card flex flex-col justify-between"
          style={{
            padding: 'var(--space-6)',
            background: 'rgba(9, 10, 10, 0.82)',
            border: '1px solid rgba(223, 255, 0, 0.32)',
            boxShadow: '0 8px 32px -8px rgba(223, 255, 0, 0.16)',
            position: 'relative',
          }}
        >
          {/* Top Header */}
          <div>
            <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-3)' }}>
              <span className="badge-shine" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                background: 'linear-gradient(135deg, #DFFF00, #B8FF57)',
                color: '#050505',
                fontSize: '0.6875rem',
                fontWeight: 800,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}>
                <Zap size={12} color="#050505" /> Next Best Action
              </span>

              <span style={{
                fontSize: '0.6875rem',
                color: 'var(--accent-primary)',
                fontWeight: 600,
              }}>
                +7% Projected Match Increase
              </span>
            </div>

            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              lineHeight: 1.25,
              margin: '0 0 var(--space-2) 0',
              color: 'var(--fg-primary)',
            }}>
              Master Docker Containerization & Microservice Deployment
            </h3>

            {/* Why It Matters Callout */}
            <div style={{
              padding: 'var(--space-3) var(--space-4)',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(223, 255, 0, 0.05)',
              borderLeft: '3px solid var(--accent-primary)',
              marginBottom: 'var(--space-4)',
            }}>
              <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', marginBottom: 2 }}>
                Why This Matters
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--fg-secondary)', margin: 0, lineHeight: 1.4 }}>
                Required in <strong>85%</strong> of Senior Full-Stack job postings. You currently have no repository-backed Dockerfile or CI/CD workflow verified.
              </p>
            </div>

            {/* Gap & Effort Metadata */}
            <div className="grid grid-2" style={{ gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
              <div style={{
                padding: 'var(--space-2) var(--space-3)',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(255, 255, 255, 0.035)',
                border: '1px solid var(--border-secondary)',
              }}>
                <div style={{ fontSize: '0.6875rem', color: 'var(--fg-tertiary)' }}>Target Competency</div>
                <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--fg-primary)' }}>
                  Docker & CI/CD Pipeline
                </div>
              </div>

              <div style={{
                padding: 'var(--space-2) var(--space-3)',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(255, 255, 255, 0.035)',
                border: '1px solid var(--border-secondary)',
              }}>
                <div style={{ fontSize: '0.6875rem', color: 'var(--fg-tertiary)' }}>Estimated Effort</div>
                <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--accent-primary)' }}>
                  ~2.5 Hours + 1 Repo Commit
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div>
            <div className="flex items-center gap-3" style={{ marginBottom: 'var(--space-3)' }}>
              <Link
                to="/app/roadmap"
                className="btn btn-primary flex-1 flex items-center justify-center gap-2"
                style={{
                  padding: 'var(--space-3)',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                }}
              >
                Launch Roadmap Milestone
                <ArrowRight size={15} />
              </Link>
              <Link
                to="/app/evidence"
                className="btn btn-secondary flex items-center justify-center"
                style={{ padding: 'var(--space-3)', fontSize: '0.8125rem' }}
                title="Verify existing repository"
              >
                <GitBranch size={15} />
              </Link>
            </div>

            {/* Rapid Secondary Action Links */}
            <div className="flex items-center justify-between" style={{ fontSize: '0.75rem', color: 'var(--fg-tertiary)' }}>
              <span>Alternative actions:</span>
              <div className="flex items-center gap-2">
                <Link to="/app/challenges" style={{ color: 'var(--fg-secondary)', textDecoration: 'none' }} className="hover:text-primary">
                  Solve SQL Challenge
                </Link>
                <span>•</span>
                <Link to="/app/interviews" style={{ color: 'var(--fg-secondary)', textDecoration: 'none' }} className="hover:text-primary">
                  System Design Mock
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ============================================
          3. SIGNATURE FEATURE: SKILL CONSTELLATION (SECTION 5.D)
          ============================================ */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.25 }}
        style={{ marginBottom: 'var(--space-8)' }}
      >
        <div className="flex items-center justify-between flex-wrap gap-4" style={{ marginBottom: 'var(--space-4)' }}>
          <div>
            <div className="flex items-center gap-2" style={{ marginBottom: 4 }}>
              <Sparkles size={18} style={{ color: 'var(--accent-primary)' }} />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
                Skill Constellation
              </h2>
              <span style={{
                fontSize: '0.6875rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(223, 255, 0, 0.08)',
                color: 'var(--accent-primary)',
                border: '1px solid rgba(223, 255, 0, 0.28)',
              }}>
                Obsidian Network
              </span>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--fg-tertiary)', margin: 0, maxWidth: 760 }}>
              Topological competency map connecting verified mastery, repository artifacts, and prerequisite dependencies. Click or hover any node to inspect evidence or bridge critical gaps.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/app/skill-gap"
              className="btn btn-secondary btn-sm flex items-center gap-1.5"
              style={{ fontSize: '0.75rem' }}
            >
              <GitBranch size={13} /> Dependency Pathways
            </Link>
            <Link
              to="/app/evidence"
              className="btn btn-secondary btn-sm flex items-center gap-1.5"
              style={{ fontSize: '0.75rem' }}
            >
              <Shield size={13} /> Evidence Vault
            </Link>
          </div>
        </div>

        {/* Embedded Interactive Skill Constellation Canvas */}
        <SkillConstellation />
      </motion.div>

      {/* ============================================
          4. BOTTOM GRID: PROGRESS NARRATIVE & SUPPORTING METRICS (SECTION 5.E & 5.F)
          ============================================ */}
      <div
        className="grid"
        style={{
          gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
          gap: 'var(--space-6)',
        }}
        id="dashboard-bottom-grid"
      >
        {/* PROGRESS NARRATIVE & ACTIVITY TRAIL (SECTION 5.E) */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="card-static"
          style={{ padding: 'var(--space-6)' }}
        >
          <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-5)' }}>
            <div className="flex items-center gap-2">
              <Clock size={16} style={{ color: 'var(--accent-primary)' }} />
              <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, margin: 0 }}>
                Progress Narrative & Development Trail
              </h3>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--fg-tertiary)' }}>
              Continuous Evidence History
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {d.recent_activity.map((activity, i) => {
              const icons: Record<string, React.ElementType> = {
                resume_upload: FileText,
                job_match: Target,
                evidence_found: Shield,
                challenge_completed: Code,
                interview_completed: MessageSquare,
                roadmap_updated: Compass,
              };
              const Icon = icons[activity.type] || Clock;
              const elapsed = Date.now() - new Date(activity.timestamp).getTime();
              const timeAgo = elapsed < 3600000 ? `${Math.floor(elapsed / 60000)}m ago` :
                elapsed < 86400000 ? `${Math.floor(elapsed / 3600000)}h ago` :
                `${Math.floor(elapsed / 86400000)}d ago`;

              return (
                <div
                  key={activity.id}
                  className="flex items-start gap-3"
                  style={{
                    padding: 'var(--space-3)',
                    borderRadius: 'var(--radius-md)',
                    background: i === 0 ? 'rgba(223, 255, 0, 0.04)' : 'rgba(255, 255, 255, 0.02)',
                    border: i === 0 ? '1px solid rgba(223, 255, 0, 0.25)' : '1px solid var(--border-secondary)',
                  }}
                >
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: 'var(--radius-md)',
                    background: i === 0 ? 'rgba(223, 255, 0, 0.12)' : 'rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Icon size={15} style={{ color: i === 0 ? 'var(--accent-primary)' : 'var(--fg-secondary)' }} />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="flex items-center justify-between">
                      <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--fg-primary)' }}>
                        {activity.title}
                      </span>
                      <span style={{ fontSize: '0.6875rem', color: 'var(--fg-tertiary)' }}>
                        {timeAgo}
                      </span>
                    </div>
                    <p style={{
                      fontSize: '0.75rem',
                      color: 'var(--fg-secondary)',
                      margin: '2px 0 0 0',
                      lineHeight: 1.4,
                    }}>
                      {activity.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 'var(--space-5)', textAlign: 'center' }}>
            <Link
              to="/app/roadmap"
              className="flex items-center justify-center gap-1.5"
              style={{
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: 'var(--accent-primary)',
                textDecoration: 'none',
              }}
            >
              Explore Complete Roadmap Milestones <ChevronRight size={14} />
            </Link>
          </div>
        </motion.div>

        {/* SUPPORTING CONTEXT METRICS (SECTION 5.F) */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="flex flex-col gap-4"
        >
          {/* Practice studio summary card */}
          <div className="card-static" style={{ padding: 'var(--space-5)' }}>
            <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-3)' }}>
              <div className="flex items-center gap-2">
                <Code size={16} style={{ color: 'var(--accent-primary)' }} />
                <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, margin: 0 }}>
                  Practice Studio Status
                </h4>
              </div>
              <Link to="/app/challenges" style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 600 }}>
                Solve Next <ArrowRight size={12} style={{ display: 'inline' }} />
              </Link>
            </div>

            <div className="grid grid-2" style={{ gap: 'var(--space-3)' }}>
              <div style={{
                padding: 'var(--space-3)',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255, 255, 255, 0.035)',
                border: '1px solid var(--border-secondary)',
              }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                  <AnimatedNumber value={d.challenges_completed || 4} />
                  <span style={{ fontSize: '0.875rem', color: 'var(--fg-tertiary)' }}>/{d.challenges_total || 12}</span>
                </div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--fg-secondary)', marginTop: 2 }}>
                  Challenges Passed
                </div>
              </div>

              <div style={{
                padding: 'var(--space-3)',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255, 255, 255, 0.035)',
                border: '1px solid var(--border-secondary)',
              }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-secondary)' }}>
                  100%
                </div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--fg-secondary)', marginTop: 2 }}>
                  Test Pass Rate
                </div>
              </div>
            </div>
          </div>

          {/* AI Mock Interview readiness card */}
          <div className="card-static" style={{ padding: 'var(--space-5)' }}>
            <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-3)' }}>
              <div className="flex items-center gap-2">
                <MessageSquare size={16} style={{ color: 'var(--accent-cyan)' }} />
                <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, margin: 0 }}>
                  Interview Performance
                </h4>
              </div>
              <Link to="/app/interviews" style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', textDecoration: 'none', fontWeight: 600 }}>
                Start Session <ArrowRight size={12} style={{ display: 'inline' }} />
              </Link>
            </div>

            <div className="flex items-center justify-between" style={{
              padding: 'var(--space-3)',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 255, 255, 0.035)',
              border: '1px solid var(--border-secondary)',
            }}>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                  {d.interview_avg_score ? <><AnimatedNumber value={d.interview_avg_score} /><span style={{ fontSize: '0.875rem' }}>/100</span></> : '88/100'}
                </div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--fg-secondary)', marginTop: 2 }}>
                  Technical Depth & Clarity Score
                </div>
              </div>
              <Badge variant="cyan" size="sm">
                System Design Evaluated
              </Badge>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="card-static" style={{ padding: 'var(--space-4)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--fg-tertiary)', textTransform: 'uppercase', marginBottom: 'var(--space-3)' }}>
              Intelligence Shortcuts
            </div>
            <div className="grid grid-2" style={{ gap: 'var(--space-2)' }}>
              <Link
                to="/app/resume"
                className="flex items-center gap-2"
                style={{
                  padding: 'var(--space-2) var(--space-3)',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(255, 255, 255, 0.035)',
                  border: '1px solid var(--border-secondary)',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  color: 'var(--fg-primary)',
                  textDecoration: 'none',
                }}
              >
                <FileText size={13} style={{ color: 'var(--accent-primary)' }} />
                Resume Analyzer
              </Link>
              <Link
                to="/app/matching"
                className="flex items-center gap-2"
                style={{
                  padding: 'var(--space-2) var(--space-3)',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(255, 255, 255, 0.035)',
                  border: '1px solid var(--border-secondary)',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  color: 'var(--fg-primary)',
                  textDecoration: 'none',
                }}
              >
                <Target size={13} style={{ color: 'var(--accent-secondary)' }} />
                Job Matching
              </Link>
              <Link
                to="/app/skill-gap"
                className="flex items-center gap-2"
                style={{
                  padding: 'var(--space-2) var(--space-3)',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(255, 255, 255, 0.035)',
                  border: '1px solid var(--border-secondary)',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  color: 'var(--fg-primary)',
                  textDecoration: 'none',
                }}
              >
                <GitBranch size={13} style={{ color: 'var(--accent-amber)' }} />
                Skill Gap Analysis
              </Link>
              <Link
                to="/app/market"
                className="flex items-center gap-2"
                style={{
                  padding: 'var(--space-2) var(--space-3)',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(255, 255, 255, 0.035)',
                  border: '1px solid var(--border-secondary)',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  color: 'var(--fg-primary)',
                  textDecoration: 'none',
                }}
              >
                <Layers size={13} style={{ color: 'var(--accent-cyan)' }} />
                Market Intelligence
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ============================================
          5. PERSONAL CREDIT FOOTER (SECTION 9)
          ============================================ */}
      <AppFooter />

      <style>{`
        @media (max-width: 1024px) {
          #dashboard-command-center { grid-template-columns: 1fr !important; }
          #dashboard-bottom-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
