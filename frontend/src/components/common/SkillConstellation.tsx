// ============================================
// SKILLSYNC AI — SKILL CONSTELLATION SIGNATURE FEATURE
// Interactive Celestial Skill & Evidence Network
// ============================================
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Sparkles, Shield, GitBranch, ArrowRight, CheckCircle2,
  AlertTriangle, XCircle, Info, ExternalLink, RefreshCw, Zap
} from 'lucide-react';
import { Badge } from './UI';

export interface ConstellationNode {
  id: string;
  name: string;
  category: 'frontend' | 'backend' | 'data' | 'devops' | 'ai_arch';
  status: 'verified' | 'evidence_found' | 'awaiting_assessment' | 'missing_critical' | 'missing_recommended';
  x: number; // percentage coordinates 0 - 100
  y: number;
  connections: string[]; // target node IDs
  level?: string;
  evidenceSource?: string;
  evidenceSnippet?: string;
  prerequisites?: string[];
  actionLink?: string;
  actionText?: string;
}

const DEFAULT_CONSTELLATION_NODES: ConstellationNode[] = [
  // Core Foundational
  {
    id: 'git',
    name: 'Git & Version Control',
    category: 'devops',
    status: 'verified',
    x: 18,
    y: 72,
    connections: ['ts', 'docker', 'ci_cd'],
    level: 'Advanced',
    evidenceSource: 'developer/fullstack-commerce',
    evidenceSnippet: '120+ commits, semantic releases, and branch protection',
    actionLink: '/app/evidence',
    actionText: 'View Repository Proof',
  },
  {
    id: 'ts',
    name: 'TypeScript',
    category: 'frontend',
    status: 'verified',
    x: 32,
    y: 45,
    connections: ['react', 'node'],
    level: 'Advanced',
    evidenceSource: 'developer/fullstack-commerce (tsconfig.json)',
    evidenceSnippet: 'Strict typing across 45 files and custom utility types',
    actionLink: '/app/evidence',
    actionText: 'Inspect Type Proof',
  },
  {
    id: 'react',
    name: 'React Architecture',
    category: 'frontend',
    status: 'verified',
    x: 48,
    y: 28,
    connections: ['nextjs', 'system_design'],
    level: 'Advanced',
    evidenceSource: 'Assessment Passed (95% score)',
    evidenceSnippet: 'Custom hooks, state management, and component composition verified',
    actionLink: '/app/challenges',
    actionText: 'Review Test Run',
  },
  {
    id: 'nextjs',
    name: 'Next.js & SSR',
    category: 'frontend',
    status: 'evidence_found',
    x: 64,
    y: 18,
    connections: ['system_design'],
    level: 'Intermediate',
    evidenceSource: 'developer/fullstack-commerce (app directory)',
    evidenceSnippet: 'App router layout and server actions detected in repository',
    actionLink: '/app/evidence',
    actionText: 'View Evidence',
  },
  // Backend & APIs
  {
    id: 'py',
    name: 'Python',
    category: 'backend',
    status: 'verified',
    x: 25,
    y: 86,
    connections: ['fastapi', 'ml'],
    level: 'Advanced',
    evidenceSource: 'developer/fastapi-task-service (app/main.py)',
    evidenceSnippet: 'Asynchronous event loops and type-hinted service layers',
    actionLink: '/app/evidence',
    actionText: 'View Code Evidence',
  },
  {
    id: 'fastapi',
    name: 'FastAPI Microservices',
    category: 'backend',
    status: 'evidence_found',
    x: 42,
    y: 75,
    connections: ['docker', 'postgres'],
    level: 'Intermediate',
    evidenceSource: 'developer/fastapi-task-service',
    evidenceSnippet: 'Dependency injection, Pydantic validation, and OpenAPI specs',
    actionLink: '/app/evidence',
    actionText: 'View Repository',
  },
  {
    id: 'node',
    name: 'Node.js & Express',
    category: 'backend',
    status: 'awaiting_assessment',
    x: 42,
    y: 52,
    connections: ['postgres', 'fastapi'],
    level: 'Intermediate',
    evidenceSource: 'Resume Mention',
    evidenceSnippet: 'Mentioned in resume experience. Complete practical challenge to verify.',
    actionLink: '/app/challenges',
    actionText: 'Take Practice Assessment',
  },
  // Data Tier
  {
    id: 'postgres',
    name: 'PostgreSQL & Schema Design',
    category: 'data',
    status: 'verified',
    x: 58,
    y: 62,
    connections: ['redis', 'docker'],
    level: 'Intermediate',
    evidenceSource: 'SQL Challenge Passed (100%)',
    evidenceSnippet: 'Window functions, DENSE_RANK partition queries validated under test conditions',
    actionLink: '/app/challenges',
    actionText: 'View Challenge Result',
  },
  {
    id: 'redis',
    name: 'Redis In-Memory Caching',
    category: 'data',
    status: 'missing_recommended',
    x: 74,
    y: 72,
    connections: ['system_design'],
    level: 'Foundational Needed',
    evidenceSource: 'Target Role Requirement',
    evidenceSnippet: 'Identified in 60% of postings for distributed cache invalidation',
    actionLink: '/app/roadmap',
    actionText: 'Add to Roadmap',
  },
  // DevOps & Cloud
  {
    id: 'docker',
    name: 'Docker Containerization',
    category: 'devops',
    status: 'missing_critical',
    x: 55,
    y: 88,
    connections: ['k8s', 'cloud', 'ci_cd'],
    level: 'High Priority Gap',
    evidenceSource: 'Job Posting Requirement',
    evidenceSnippet: 'Required in 85% of full-stack job specifications for containerized deployment',
    actionLink: '/app/roadmap',
    actionText: 'Start Docker Roadmap Phase',
  },
  {
    id: 'ci_cd',
    name: 'CI/CD Pipelines',
    category: 'devops',
    status: 'missing_critical',
    x: 70,
    y: 88,
    connections: ['cloud'],
    level: 'High Priority Gap',
    evidenceSource: 'Automated Gap Engine',
    evidenceSnippet: 'Missing GitHub Actions automated test & deploy pipeline',
    actionLink: '/app/roadmap',
    actionText: 'Learn CI/CD Automation',
  },
  {
    id: 'cloud',
    name: 'AWS Cloud Services',
    category: 'devops',
    status: 'missing_critical',
    x: 85,
    y: 68,
    connections: ['k8s'],
    level: 'Strategic Goal',
    evidenceSource: 'Target Role Requirement',
    evidenceSnippet: 'AWS ECS, S3, RDS cloud architecture requested for role readiness',
    actionLink: '/app/roadmap',
    actionText: 'Explore Cloud Milestone',
  },
  {
    id: 'k8s',
    name: 'Kubernetes Orchestration',
    category: 'devops',
    status: 'missing_recommended',
    x: 90,
    y: 85,
    connections: [],
    level: 'Advanced Goal',
    evidenceSource: 'Emerging Requirement',
    evidenceSnippet: 'Container cluster management and deployment scaling',
    actionLink: '/app/roadmap',
    actionText: 'Review Prerequisites',
  },
  // AI & Architecture
  {
    id: 'system_design',
    name: 'System Design & Scalability',
    category: 'ai_arch',
    status: 'awaiting_assessment',
    x: 82,
    y: 36,
    connections: ['cloud'],
    level: 'Interview Evaluated',
    evidenceSource: 'Mock Interview Practice',
    evidenceSnippet: 'Practice system design questions to substantiate high-load architecture capability',
    actionLink: '/app/interviews',
    actionText: 'Launch Mock Interview',
  },
  {
    id: 'ml',
    name: 'LLM & AI Integration',
    category: 'ai_arch',
    status: 'evidence_found',
    x: 35,
    y: 95,
    connections: ['fastapi'],
    level: 'Emerging',
    evidenceSource: 'Repository Analysis',
    evidenceSnippet: 'LangChain & OpenAI API integration discovered in repository commits',
    actionLink: '/app/evidence',
    actionText: 'View AI Proof',
  },
];

const STATUS_CONFIG = {
  verified: {
    label: 'Assessment Verified',
    nodeColor: '#DFFF00',
    glowColor: 'rgba(223, 255, 0, 0.45)',
    badgeVariant: 'primary' as const,
    icon: CheckCircle2,
  },
  evidence_found: {
    label: 'Repository Evidence',
    nodeColor: '#B8FF57',
    glowColor: 'rgba(184, 255, 87, 0.4)',
    badgeVariant: 'emerald' as const,
    icon: GitBranch,
  },
  awaiting_assessment: {
    label: 'Awaiting Assessment',
    nodeColor: '#42E8E0',
    glowColor: 'rgba(66, 232, 224, 0.35)',
    badgeVariant: 'cyan' as const,
    icon: Sparkles,
  },
  missing_critical: {
    label: 'Critical Gap',
    nodeColor: '#FF5C5C',
    glowColor: 'rgba(255, 92, 92, 0.4)',
    badgeVariant: 'rose' as const,
    icon: XCircle,
  },
  missing_recommended: {
    label: 'Recommended Priority',
    nodeColor: '#FFBF47',
    glowColor: 'rgba(255, 191, 71, 0.4)',
    badgeVariant: 'amber' as const,
    icon: AlertTriangle,
  },
};

export default function SkillConstellation() {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('docker');
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const nodes = useMemo(() => {
    return DEFAULT_CONSTELLATION_NODES;
  }, []);

  const activeNode = useMemo(() => {
    return nodes.find(n => n.id === selectedNodeId) || nodes[0];
  }, [nodes, selectedNodeId]);

  const activeStatus = STATUS_CONFIG[activeNode.status];

  // Helper to map node ID to coordinate
  const nodeMap = useMemo(() => {
    const map = new Map<string, ConstellationNode>();
    nodes.forEach(n => map.set(n.id, n));
    return map;
  }, [nodes]);

  // Generate connection line data
  const connections = useMemo(() => {
    const lines: { x1: number; y1: number; x2: number; y2: number; fromId: string; toId: string; active: boolean }[] = [];
    nodes.forEach(fromNode => {
      fromNode.connections.forEach(toId => {
        const toNode = nodeMap.get(toId);
        if (toNode) {
          const isHighlighted =
            hoveredNodeId === fromNode.id ||
            hoveredNodeId === toId ||
            selectedNodeId === fromNode.id ||
            selectedNodeId === toId;
          lines.push({
            x1: fromNode.x,
            y1: fromNode.y,
            x2: toNode.x,
            y2: toNode.y,
            fromId: fromNode.id,
            toId: toId,
            active: isHighlighted,
          });
        }
      });
    });
    return lines;
  }, [nodes, nodeMap, hoveredNodeId, selectedNodeId]);

  const verifiedCount = nodes.filter(n => n.status === 'verified').length;
  const evidenceCount = nodes.filter(n => n.status === 'evidence_found').length;
  const missingCount = nodes.filter(n => n.status === 'missing_critical' || n.status === 'missing_recommended').length;

  return (
    <div className="shine-border" style={{ padding: 'var(--space-6)', position: 'relative', overflow: 'hidden' }}>
      {/* Background Star Ambient Glow */}
      <div style={{
        position: 'absolute', top: '-20%', right: '-10%', width: 400, height: 400,
        background: 'radial-gradient(circle, rgba(223,255,0,0.06) 0%, transparent 70%)',
        borderRadius: '50%', filter: 'blur(50px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-20%', left: '10%', width: 350, height: 350,
        background: 'radial-gradient(circle, rgba(66,232,224,0.05) 0%, transparent 70%)',
        borderRadius: '50%', filter: 'blur(50px)', pointerEvents: 'none',
      }} />

      {/* Header with Title and Legend Filter */}
      <div className="flex items-start justify-between" style={{ marginBottom: 'var(--space-5)', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
        <div>
          <div className="flex items-center gap-2" style={{ marginBottom: 4 }}>
            <div style={{
              width: 24, height: 24, borderRadius: 'var(--radius-sm)',
              background: 'linear-gradient(135deg, #DFFF00, #B8FF57)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Sparkles size={14} color="#050505" />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
              Skill Constellation
            </h3>
            <span style={{
              fontSize: '0.6875rem', fontWeight: 700, padding: '2px 8px', borderRadius: 'var(--radius-full)',
              background: 'rgba(223,255,0,0.08)', color: 'var(--accent-primary)',
              border: '1px solid rgba(223,255,0,0.25)',
            }}>
              Obsidian Topography
            </span>
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--fg-tertiary)', margin: 0, maxWidth: 620 }}>
            Interactive knowledge graph connecting verified competencies, repository evidence, and missing target requirements.
          </p>
        </div>

        {/* Status Indicators Pill Counter */}
        <div className="flex items-center gap-2" style={{ flexWrap: 'wrap' }}>
          <span style={{
            fontSize: '0.75rem', padding: '3px 10px', borderRadius: 'var(--radius-full)',
            background: 'var(--accent-emerald-light)', color: 'var(--accent-emerald)', fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: 4,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-emerald)' }} />
            {verifiedCount} Verified
          </span>
          <span style={{
            fontSize: '0.75rem', padding: '3px 10px', borderRadius: 'var(--radius-full)',
            background: 'var(--accent-cyan-light)', color: 'var(--accent-cyan)', fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: 4,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-cyan)' }} />
            {evidenceCount} Evidence
          </span>
          <span style={{
            fontSize: '0.75rem', padding: '3px 10px', borderRadius: 'var(--radius-full)',
            background: 'var(--accent-rose-light)', color: 'var(--accent-rose)', fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: 4,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-rose)' }} />
            {missingCount} Gaps
          </span>
        </div>
      </div>

      {/* Main Graph Grid with Contextual Inspector Drawer */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 340px', gap: 'var(--space-5)',
        alignItems: 'stretch',
      }} id="constellation-grid">
        {/* Interactive SVG Network Canvas */}
        <div className="constellation-container" style={{ minHeight: 440, height: '100%', position: 'relative' }}>
          {/* Subtle cosmic grid background */}
          <div className="bg-grid-radial" style={{
            position: 'absolute', inset: 0, opacity: 0.18, pointerEvents: 'none',
          }} />

          <svg
            style={{ width: '100%', height: '100%', minHeight: 440, overflow: 'visible' }}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#DFFF00" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#B8FF57" stopOpacity="0.3" />
              </linearGradient>
              <linearGradient id="lineGradActive" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#DFFF00" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#F4FF5E" stopOpacity="0.9" />
              </linearGradient>
            </defs>

            {/* Connecting Dependency Edges */}
            {connections.map((c, i) => (
              <line
                key={`line-${i}`}
                x1={`${c.x1}%`}
                y1={`${c.y1}%`}
                x2={`${c.x2}%`}
                y2={`${c.y2}%`}
                stroke={c.active ? 'url(#lineGradActive)' : 'rgba(255, 255, 255, 0.12)'}
                strokeWidth={c.active ? '0.8' : '0.4'}
                className={c.active ? 'constellation-line' : ''}
              />
            ))}

            {/* Constellation Nodes */}
            {nodes.map(node => {
              const cfg = STATUS_CONFIG[node.status];
              const isSelected = selectedNodeId === node.id;
              const isHovered = hoveredNodeId === node.id;
              const isFocused = isSelected || isHovered;

              return (
                <g
                  key={node.id}
                  style={{ cursor: 'pointer', transition: 'transform 0.2s ease' }}
                  onClick={() => setSelectedNodeId(node.id)}
                  onMouseEnter={() => setHoveredNodeId(node.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                >
                  {/* Aura Glow when selected or hovered */}
                  {isFocused && (
                    <circle
                      cx={`${node.x}%`}
                      cy={`${node.y}%`}
                      r="4.5"
                      fill={cfg.glowColor}
                      className="orbital-glow"
                    />
                  )}

                  {/* Outer Orbit Ring */}
                  <circle
                    cx={`${node.x}%`}
                    cy={`${node.y}%`}
                    r={isFocused ? '2.8' : '2'}
                    fill="var(--bg-secondary)"
                    stroke={cfg.nodeColor}
                    strokeWidth={isFocused ? '0.7' : '0.4'}
                  />

                  {/* Core Star Node */}
                  <circle
                    cx={`${node.x}%`}
                    cy={`${node.y}%`}
                    r={isFocused ? '1.5' : '1.1'}
                    fill={cfg.nodeColor}
                  />

                  {/* Text Label */}
                  <text
                    x={`${node.x}%`}
                    y={`${node.y + (node.y > 80 ? -4 : 4.5)}%`}
                    textAnchor="middle"
                    fill={isFocused ? 'white' : 'var(--fg-secondary)'}
                    fontSize="2.4"
                    fontFamily="var(--font-sans)"
                    fontWeight={isFocused ? '700' : '500'}
                    letterSpacing="0.02em"
                    style={{ pointerEvents: 'none', userSelect: 'none' }}
                  >
                    {node.name.split(' ')[0]}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Canvas Interactive Overlay Prompt */}
          <div style={{
            position: 'absolute', bottom: 12, left: 16,
            fontSize: '0.6875rem', color: 'var(--fg-tertiary)',
            display: 'flex', alignItems: 'center', gap: 6, pointerEvents: 'none',
          }}>
            <Sparkles size={11} style={{ color: 'var(--accent-primary)' }} />
            Click any skill node to inspect proof, prerequisites, and learning actions
          </div>
        </div>

        {/* Selected Node Inspector Drawer */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeNode.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            style={{
              padding: 'var(--space-5)',
              borderRadius: 'var(--radius-xl)',
              background: 'rgba(9, 10, 10, 0.88)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: `1px solid ${activeStatus.nodeColor}`,
              boxShadow: `0 8px 32px -8px ${activeStatus.glowColor}`,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              {/* Header Status & Icon */}
              <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-3)' }}>
                <span style={{
                  fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.05em',
                  fontWeight: 700, color: 'var(--fg-tertiary)',
                }}>
                  {activeNode.category.toUpperCase().replace(/_/g, ' ')}
                </span>
                <Badge variant={activeStatus.badgeVariant} size="sm">
                  {activeStatus.label}
                </Badge>
              </div>

              {/* Node Title */}
              <h4 style={{
                fontSize: '1.25rem', fontWeight: 800, color: 'var(--fg-primary)',
                marginBottom: 'var(--space-1)', letterSpacing: '-0.02em',
              }}>
                {activeNode.name}
              </h4>
              <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 600, marginBottom: 'var(--space-4)' }}>
                Mastery Level: {activeNode.level || 'Intermediate'}
              </div>

              {/* Proof / Verification Context */}
              <div style={{
                padding: 'var(--space-3) var(--space-4)',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-primary)',
                marginBottom: 'var(--space-4)',
              }}>
                <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--fg-tertiary)', marginBottom: 4, textTransform: 'uppercase' }}>
                  Verification Artifact
                </div>
                <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--fg-primary)', marginBottom: 2 }}>
                  {activeNode.evidenceSource}
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--fg-secondary)', margin: 0, lineHeight: 1.5 }}>
                  "{activeNode.evidenceSnippet}"
                </p>
              </div>

              {/* Connected Dependencies */}
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--fg-tertiary)', marginBottom: 6, textTransform: 'uppercase' }}>
                  Pathway Connections
                </div>
                <div className="flex flex-wrap gap-1">
                  {activeNode.connections.length > 0 ? (
                    activeNode.connections.map(cId => {
                      const connNode = nodeMap.get(cId);
                      return (
                        <button
                          key={cId}
                          onClick={() => setSelectedNodeId(cId)}
                          style={{
                            padding: '3px 8px', borderRadius: 'var(--radius-sm)',
                            background: 'var(--bg-elevated)', border: '1px solid var(--border-primary)',
                            fontSize: '0.6875rem', color: 'var(--fg-secondary)', cursor: 'pointer',
                          }}
                        >
                          → {connNode?.name.split(' ')[0] || cId}
                        </button>
                      );
                    })
                  ) : (
                    <span style={{ fontSize: '0.75rem', color: 'var(--fg-tertiary)' }}>Terminal milestone</span>
                  )}
                </div>
              </div>
            </div>

            {/* Direct Contextual Action Button */}
            {activeNode.actionLink && (
              <Link
                to={activeNode.actionLink}
                className="btn btn-primary"
                style={{ width: '100%', gap: 8, marginTop: 'var(--space-4)' }}
              >
                <span>{activeNode.actionText || 'Take Action'}</span>
                <ArrowRight size={14} />
              </Link>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <style>{`
        @media (max-width: 900px) {
          #constellation-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
