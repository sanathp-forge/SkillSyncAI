// ============================================
// SKILLSYNC AI — CAREER ROADMAP PAGE
// ============================================
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Map, CheckCircle, Circle, Clock, ExternalLink, ChevronDown,
  ChevronUp, Sparkles, Play, BookOpen, Video, Globe, Code, Check, Shield
} from 'lucide-react';
import {
  PageHeader, DemoBanner, ProgressBar, Badge, LoadingSpinner, EmptyState, AppFooter
} from '@/components/common/UI';
import { roadmapApi } from '@/services/api';
import { appState } from '@/services/appState';
import type { Roadmap, RoadmapStep, LearningResource } from '@/types';

const resourceIcons: Record<string, React.ElementType> = {
  documentation: BookOpen,
  tutorial: Globe,
  course: Video,
  video: Video,
  book: BookOpen,
  practice: Code,
};

function ResourceLink({ resource }: { resource: LearningResource }) {
  const Icon = resourceIcons[resource.type] || Globe;
  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2"
      style={{
        padding: 'var(--space-2) var(--space-3)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-primary)',
        background: 'var(--bg-secondary)',
        textDecoration: 'none',
        fontSize: '0.8125rem',
        color: 'var(--fg-secondary)',
        transition: 'all var(--duration-fast) ease',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-primary)'; e.currentTarget.style.color = 'var(--accent-primary)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-primary)'; e.currentTarget.style.color = 'var(--fg-secondary)'; }}
    >
      <Icon size={13} />
      <span style={{ flex: 1 }}>{resource.title}</span>
      <span style={{
        fontSize: '0.625rem', padding: '1px 6px', borderRadius: 'var(--radius-full)',
        background: resource.free ? 'var(--accent-emerald-light)' : 'var(--bg-tertiary)',
        color: resource.free ? 'var(--accent-emerald)' : 'var(--fg-tertiary)',
        fontWeight: 600,
      }}>
        {resource.free ? 'Free' : 'Paid'}
      </span>
      <ExternalLink size={11} style={{ opacity: 0.5 }} />
    </a>
  );
}

function StepCard({ step, onToggle }: { step: RoadmapStep; onToggle: () => void }) {
  const [expanded, setExpanded] = useState(step.status === 'in_progress');

  const statusStyles = {
    completed: { icon: CheckCircle, color: '#B8FF57', bg: 'rgba(184, 255, 87, 0.12)', label: 'Completed' },
    in_progress: { icon: Play, color: '#DFFF00', bg: 'rgba(223, 255, 0, 0.15)', label: 'In Progress' },
    not_started: { icon: Circle, color: 'var(--fg-tertiary)', bg: 'rgba(255, 255, 255, 0.04)', label: 'Not Started' },
  };
  const s = statusStyles[step.status];

  return (
    <div style={{
      borderRadius: 'var(--radius-lg)',
      border: `1px solid ${step.status === 'in_progress' ? 'var(--accent-cyan)' : step.status === 'completed' ? 'var(--accent-emerald)' : 'var(--border-primary)'}`,
      background: 'var(--bg-elevated)',
      overflow: 'hidden',
      transition: 'all var(--duration-normal) ease',
    }}>
      <div style={{
        width: '100%', padding: 'var(--space-4) var(--space-5)',
        display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
      }}>
        {/* Toggle Status Button */}
        <button
          onClick={e => { e.stopPropagation(); onToggle(); }}
          title={`Status: ${s.label}. Click to cycle status.`}
          style={{
            width: 36, height: 36, borderRadius: 'var(--radius-md)',
            background: s.bg, display: 'flex', alignItems: 'center',
            justifyContent: 'center', flexShrink: 0, border: 'none', cursor: 'pointer',
            transition: 'transform 0.15s ease',
          }}
          onMouseDown={e => e.currentTarget.style.transform = 'scale(0.92)'}
          onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <s.icon size={18} style={{ color: s.color }} />
        </button>

        <div style={{ flex: 1, minWidth: 0, cursor: 'pointer' }} onClick={() => setExpanded(!expanded)}>
          <div className="flex items-center gap-2">
            <span style={{
              fontWeight: 700, fontSize: '0.9375rem',
              textDecoration: step.status === 'completed' ? 'line-through' : 'none',
              color: step.status === 'completed' ? 'var(--fg-tertiary)' : 'var(--fg-primary)',
            }}>
              {step.skill}
            </span>
            {step.status === 'in_progress' && (
              <Badge variant="primary" size="sm">In Progress</Badge>
            )}
            {step.status === 'completed' && (
              <Badge variant="lime" size="sm">Completed</Badge>
            )}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--fg-tertiary)' }}>
            ~{step.estimated_hours}h estimated
            {step.prerequisites.length > 0 && ` • Requires: ${step.prerequisites.join(', ')}`}
          </div>
        </div>

        {/* Action button & expand */}
        <div className="flex items-center gap-2">
          <button
            className={`btn btn-sm ${step.status === 'completed' ? 'btn-ghost' : step.status === 'in_progress' ? 'btn-secondary' : 'btn-primary'}`}
            style={{ fontSize: '0.75rem', padding: '3px 10px' }}
            onClick={onToggle}
          >
            {step.status === 'completed' ? 'Reset' : step.status === 'in_progress' ? 'Mark Done' : 'Start'}
          </button>
          <button
            className="btn btn-icon btn-ghost"
            onClick={() => setExpanded(!expanded)}
            aria-label="Expand step details"
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              padding: 'var(--space-4) var(--space-5) var(--space-5)',
              borderTop: '1px solid var(--border-secondary)',
            }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--fg-secondary)', marginBottom: 'var(--space-3)' }}>
                {step.reason}
              </p>

              <div style={{ marginBottom: 'var(--space-3)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--fg-tertiary)', marginBottom: 'var(--space-2)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Curated Learning Resources
                </div>
                <div className="flex flex-col gap-2">
                  {step.resources.map((res, i) => (
                    <ResourceLink key={i} resource={res} />
                  ))}
                </div>
              </div>

              <div style={{
                padding: 'var(--space-3)', background: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-3)',
              }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--fg-tertiary)', marginBottom: 4 }}>
                  Practical Exercise
                </div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--fg-secondary)', margin: 0 }}>{step.exercise}</p>
              </div>

              <div className="flex items-center justify-between" style={{
                padding: 'var(--space-3)', background: 'var(--accent-primary-light)',
                borderRadius: 'var(--radius-md)', flexWrap: 'wrap', gap: 8,
              }}>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-primary)', marginBottom: 2 }}>
                    Demonstration Criteria
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--fg-secondary)', margin: 0 }}>{step.completion_criteria}</p>
                </div>
                <Link to="/app/challenges" className="btn btn-secondary btn-sm" style={{ alignSelf: 'center' }}>
                  <Shield size={13} /> Validate Skill
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function RoadmapPage() {
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDemo, setIsDemo] = useState(false);
  const [targetRole, setTargetRole] = useState('Full-Stack Developer');
  const [activePhase, setActivePhase] = useState<string | null>(null);

  useEffect(() => {
    loadCurrentRoadmap();
  }, []);

  const loadCurrentRoadmap = async () => {
    setLoading(true);
    try {
      const data = await roadmapApi.getCurrent();
      setRoadmap(data);
      setIsDemo(false);
      setActivePhase(data.phases.find(p => p.status === 'active')?.id || data.phases[0]?.id || null);
    } catch {
      const saved = appState.getRoadmap();
      setRoadmap(saved);
      setIsDemo(true);
      setActivePhase(saved.phases.find(p => p.status === 'active')?.id || saved.phases[0]?.id || null);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStep = (phaseId: string, stepId: string) => {
    const updated = appState.toggleRoadmapStep(phaseId, stepId);
    setRoadmap({ ...updated });
  };

  const generateRoadmap = async () => {
    setLoading(true);
    try {
      const data = await roadmapApi.generate(targetRole);
      setRoadmap(data);
      setIsDemo(false);
    } catch {
      const saved = appState.getRoadmap();
      setRoadmap({ ...saved, target_role: targetRole });
      setIsDemo(true);
    } finally {
      setLoading(false);
    }
  };

  const phaseStatusConfig = {
    completed: { color: 'var(--accent-emerald)', label: 'Completed' },
    active: { color: 'var(--accent-cyan)', label: 'In Progress' },
    upcoming: { color: 'var(--fg-tertiary)', label: 'Upcoming' },
  };

  return (
    <div style={{ padding: 'var(--space-6)', maxWidth: 1000 }}>
      {isDemo && <DemoBanner />}

      <PageHeader
        title="Personalized Career Roadmap"
        description="Structured progression with practical projects, verified study resources, and milestone completion tracking."
        action={
          <div className="flex gap-2">
            <input
              className="input" value={targetRole}
              onChange={e => setTargetRole(e.target.value)}
              placeholder="Target role" style={{ width: 220 }}
            />
            <button className="btn btn-primary" onClick={generateRoadmap} disabled={loading}>
              {loading ? <LoadingSpinner size={14} /> : <Sparkles size={15} />}
              {loading ? 'Regenerating...' : 'Regenerate'}
            </button>
          </div>
        }
      />

      {loading && <div className="text-center" style={{ padding: 'var(--space-16)' }}><LoadingSpinner /></div>}

      {!loading && roadmap && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          {/* Overall Progress Banner */}
          <div className="card-static" style={{ padding: 'var(--space-5)', marginBottom: 'var(--space-6)' }}>
            <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-3)' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.0625rem' }}>Roadmap Mastery Progress</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--fg-tertiary)' }}>
                  {roadmap.target_role} • v{roadmap.version}
                </div>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                {roadmap.overall_progress}%
              </div>
            </div>
            <ProgressBar value={roadmap.overall_progress} color="var(--accent-primary)" />
          </div>

          {/* Phase Navigation Tabs */}
          <div className="flex gap-2" style={{ marginBottom: 'var(--space-5)', overflowX: 'auto', paddingBottom: 4 }}>
            {roadmap.phases.map(phase => {
              const psc = phaseStatusConfig[phase.status];
              return (
                <button
                  key={phase.id}
                  onClick={() => setActivePhase(phase.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: 'var(--space-2) var(--space-4)',
                    borderRadius: 'var(--radius-full)',
                    border: `2px solid ${activePhase === phase.id ? psc.color : 'var(--border-primary)'}`,
                    background: activePhase === phase.id
                      ? `color-mix(in srgb, ${psc.color} 10%, transparent)`
                      : 'transparent',
                    cursor: 'pointer', whiteSpace: 'nowrap',
                    transition: 'all var(--duration-fast) ease',
                  }}
                >
                  <span style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: psc.color, flexShrink: 0,
                  }} />
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--fg-primary)' }}>
                    {phase.name}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--fg-tertiary)' }}>
                    {phase.progress}%
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Phase Steps */}
          {roadmap.phases
            .filter(p => p.id === activePhase)
            .map(phase => (
              <div key={phase.id}>
                <div style={{ marginBottom: 'var(--space-4)' }}>
                  <h3 style={{ fontWeight: 700, marginBottom: 4 }}>{phase.name}</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--fg-tertiary)', margin: 0 }}>{phase.description}</p>
                  <div style={{ marginTop: 'var(--space-3)' }}>
                    <ProgressBar value={phase.progress} label={`Phase Progress: ${phase.progress}%`} />
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  {phase.steps.map(step => (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <StepCard
                        step={step}
                        onToggle={() => handleToggleStep(phase.id, step.id)}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
        </motion.div>
      )}

      {!loading && !roadmap && (
        <EmptyState
          icon={Map}
          title="No roadmap yet"
          description="Enter your target role and click Generate to create your personalized learning roadmap."
        />
      )}

      <AppFooter />
    </div>
  );
}
