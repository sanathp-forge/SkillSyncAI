// ============================================
// SKILLSYNC AI — PREMIUM LANDING PAGE
// ============================================
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText, Target, GitBranch, Map, Code, MessageSquare,
  TrendingUp, Shield, ArrowRight, CheckCircle, Sparkles,
  BarChart3, Zap, Brain, ChevronRight, Star
} from 'lucide-react';
import LandingNav from '@/components/common/LandingNav';
import { ScoreRing, AnimatedNumber } from '@/components/common/UI';
import { useAuth } from '@/hooks/useAuth';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
};

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.1 } },
  viewport: { once: true },
};

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  return (
    <div style={{ overflow: 'hidden' }}>
      <LandingNav />

      {/* ---- HERO SECTION ---- */}
      <section style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        position: 'relative', paddingTop: 80,
      }}>
        {/* Background Effects */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'var(--gradient-hero)',
          pointerEvents: 'none',
        }} />
        <div className="bg-grid" style={{
          position: 'absolute', inset: 0, opacity: 0.3, pointerEvents: 'none',
        }} />

        {/* Floating Orbs */}
        <div style={{
          position: 'absolute', top: '15%', left: '10%', width: 300, height: 300,
          background: 'radial-gradient(circle, rgba(223,255,0,0.12) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none',
          animation: 'pulse-glow 4s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', bottom: '20%', right: '15%', width: 250, height: 250,
          background: 'radial-gradient(circle, rgba(66,232,224,0.09) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none',
          animation: 'pulse-glow 5s ease-in-out infinite 1s',
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: 1280, margin: '0 auto' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-16)',
            alignItems: 'center',
          }} className="hero-grid">
            {/* Left: Copy */}
            <motion.div {...fadeInUp}>
              <div className="flex items-center gap-2.5" style={{ marginBottom: 'var(--space-4)' }}>
                <img
                  src="/images/skillsync-symbol-transparent.png"
                  alt="SkillSync AI Symbol"
                  style={{
                    width: 30,
                    height: 30,
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 0 8px rgba(223, 255, 0, 0.45))',
                  }}
                />
                <div className="badge badge-primary" style={{ gap: 6 }}>
                  <Sparkles size={12} /> AI-Powered Career Intelligence
                </div>
              </div>

              <h1 style={{
                fontSize: 'clamp(2.5rem, 5vw, 3.75rem)',
                fontWeight: 900, lineHeight: 1.08,
                letterSpacing: '-0.03em',
                marginBottom: 'var(--space-5)',
              }}>
                Your skills.{' '}
                <span className="gradient-text-accent">Your next opportunity.</span>
              </h1>

              <p style={{
                fontSize: '1.125rem', lineHeight: 1.7, color: 'var(--fg-secondary)',
                maxWidth: 520, marginBottom: 'var(--space-8)',
              }}>
                Turn your resume, projects, and skills into an evidence-backed career roadmap.
                Discover skill gaps, prove your capabilities, and prepare for the roles you want.
              </p>

              <div className="flex gap-4" style={{ flexWrap: 'wrap' }}>
                <Link to={isAuthenticated ? "/app/resume" : "/login"} className="btn btn-primary btn-lg" style={{ gap: 8 }}>
                  Analyze My Resume <ArrowRight size={18} />
                </Link>
                <a href="#features" className="btn btn-secondary btn-lg">
                  Explore the Platform
                </a>
              </div>

              {/* Trust Signals */}
              <div className="flex items-center gap-6" style={{ marginTop: 'var(--space-8)' }}>
                {[
                  { label: 'Evidence-Based', icon: Shield },
                  { label: 'AI-Powered', icon: Brain },
                  { label: 'Adaptive', icon: Zap },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-2">
                    <item.icon size={14} style={{ color: 'var(--accent-primary)' }} />
                    <span style={{ fontSize: '0.8125rem', color: 'var(--fg-tertiary)', fontWeight: 500 }}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right: Product Preview */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            >
              <div style={{
                position: 'relative', perspective: 1000,
              }}>
                {/* Main Preview Card */}
                <div className="glass-strong" style={{
                  borderRadius: 'var(--radius-xl)', padding: 'var(--space-6)',
                  position: 'relative',
                }}>
                  {/* Gradient border glow */}
                  <div style={{
                    position: 'absolute', inset: -1,
                    borderRadius: 'var(--radius-xl)',
                    background: 'var(--gradient-accent)',
                    opacity: 0.3, filter: 'blur(8px)',
                    zIndex: -1,
                  }} />

                  <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-5)' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--fg-tertiary)', fontWeight: 500 }}>Career Readiness</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--fg-primary)' }}>Full-Stack Developer</div>
                    </div>
                    <ScoreRing score={72} size={80} strokeWidth={6} label="Match" />
                  </div>

                  {/* Skill bars */}
                  {[
                    { skill: 'React / TypeScript', level: 88, color: 'var(--accent-cyan)' },
                    { skill: 'Python / FastAPI', level: 82, color: 'var(--accent-primary)' },
                    { skill: 'PostgreSQL', level: 75, color: 'var(--accent-emerald)' },
                    { skill: 'Docker / DevOps', level: 45, color: 'var(--accent-amber)' },
                    { skill: 'AWS Cloud', level: 35, color: 'var(--accent-rose)' },
                  ].map(s => (
                    <div key={s.skill} style={{ marginBottom: 'var(--space-3)' }}>
                      <div className="flex justify-between" style={{ marginBottom: 4 }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--fg-secondary)' }}>{s.skill}</span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--fg-primary)' }}>{s.level}%</span>
                      </div>
                      <div className="progress-bar" style={{ height: 6 }}>
                        <div className="progress-bar-fill" style={{ width: `${s.level}%`, background: s.color }} />
                      </div>
                    </div>
                  ))}

                  {/* Evidence Tags */}
                  <div className="flex flex-wrap gap-2" style={{ marginTop: 'var(--space-4)' }}>
                    {['3 GitHub repos verified', '5 skills matched', '2 gaps identified'].map(t => (
                      <span key={t} style={{
                        padding: '4px 10px', borderRadius: 'var(--radius-full)',
                        fontSize: '0.6875rem', fontWeight: 500,
                        background: 'var(--bg-tertiary)', color: 'var(--fg-secondary)',
                        border: '1px solid var(--border-primary)',
                      }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Floating Mini Cards */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="glass"
                  style={{
                    position: 'absolute', top: -20, right: -30,
                    padding: '12px 16px', borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-lg)',
                  }}
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle size={14} style={{ color: 'var(--accent-emerald)' }} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--fg-primary)' }}>
                      React verified
                    </span>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  className="glass"
                  style={{
                    position: 'absolute', bottom: 20, left: -40,
                    padding: '12px 16px', borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-lg)',
                  }}
                >
                  <div className="flex items-center gap-2">
                    <TrendingUp size={14} style={{ color: 'var(--accent-cyan)' }} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--fg-primary)' }}>
                      +12% this week
                    </span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        <style>{`
          @media (max-width: 968px) {
            .hero-grid { grid-template-columns: 1fr !important; gap: var(--space-10) !important; }
          }
        `}</style>
      </section>

      {/* ---- OFFICIAL SKILLSYNC AI BRAND SHOWCASE ---- */}
      <section style={{ padding: 'var(--space-6) var(--space-6) var(--space-12)', position: 'relative', zIndex: 1 }}>
        <div className="container" style={{ maxWidth: 1080, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-strong"
            style={{
              padding: 'var(--space-10) var(--space-8)',
              borderRadius: 'var(--radius-xl)',
              background: 'radial-gradient(ellipse at center, rgba(223, 255, 0, 0.05) 0%, rgba(9, 10, 10, 0.75) 75%)',
              border: '1px solid rgba(255, 255, 255, 0.09)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
            }}
          >
            {/* Ambient Lighting Behind Logo */}
            <div style={{
              position: 'absolute', top: '20%', width: 260, height: 260,
              background: 'radial-gradient(circle, rgba(223, 255, 0, 0.12) 0%, transparent 70%)',
              filter: 'blur(50px)', pointerEvents: 'none',
            }} />
            
            <img
              src="/images/skillsync-logo-transparent.png"
              alt="SkillSync AI Official Brand Identity"
              style={{
                maxHeight: 180,
                width: 'auto',
                maxWidth: '92%',
                objectFit: 'contain',
                filter: 'drop-shadow(0 0 24px rgba(223, 255, 0, 0.35))',
                marginBottom: 'var(--space-5)',
              }}
            />

            <p style={{
              fontSize: '0.9375rem',
              color: 'var(--fg-secondary)',
              maxWidth: 580,
              margin: '0 auto',
              lineHeight: 1.6,
            }}>
              Next-generation career intelligence engine mapping validated developer competencies against real-time market specifications with mathematical proof.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ---- FEATURES SECTION ---- */}
      <section id="features" className="section" style={{ position: 'relative' }}>
        <div className="container" style={{ maxWidth: 1280, margin: '0 auto' }}>
          <motion.div {...fadeInUp} className="text-center" style={{ marginBottom: 'var(--space-12)' }}>
            <span className="badge badge-primary" style={{ marginBottom: 'var(--space-3)' }}>Features</span>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 800, marginBottom: 'var(--space-3)' }}>
              Everything you need for{' '}
              <span className="gradient-text">career success</span>
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--fg-tertiary)', maxWidth: 600, margin: '0 auto' }}>
              A complete workflow from resume analysis to interview preparation, powered by evidence-based AI.
            </p>
          </motion.div>

          <motion.div {...staggerContainer} className="grid" style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'var(--space-5)',
          }}>
            {[
              { icon: FileText, title: 'AI Resume Analyzer', desc: 'Extract skills, identify gaps, and get role-specific improvement suggestions with AI-powered analysis.', color: 'var(--accent-primary)' },
              { icon: Target, title: 'Semantic Job Matching', desc: 'Compare your profile against job descriptions with explainable scores and detailed requirement analysis.', color: 'var(--accent-cyan)' },
              { icon: Shield, title: 'Evidence Verification', desc: 'Verify skills through GitHub repositories, coding challenges, and practical assessments.', color: 'var(--accent-emerald)' },
              { icon: GitBranch, title: 'Skill Gap Engine', desc: 'Identify missing skills with dependency graphs and prioritized learning recommendations.', color: 'var(--accent-amber)' },
              { icon: Map, title: 'Career Roadmap', desc: 'Generate personalized, adaptive learning plans with curated resources and milestones.', color: 'var(--chart-6)' },
              { icon: Code, title: 'Coding Challenges', desc: 'Prove your skills with practical challenges in Python and SQL with automated evaluation.', color: 'var(--accent-primary)' },
              { icon: MessageSquare, title: 'AI Mock Interviews', desc: 'Practice technical and behavioral interviews with structured AI feedback.', color: 'var(--accent-cyan)' },
              { icon: TrendingUp, title: 'Market Intelligence', desc: 'Track in-demand skills, trending technologies, and compare with your profile.', color: 'var(--accent-emerald)' },
              { icon: BarChart3, title: 'Career Dashboard', desc: 'Track your progress, evidence, and career readiness with beautiful analytics.', color: 'var(--accent-amber)' },
            ].map((feature, i) => (
              <motion.div key={feature.title} variants={{
                initial: { opacity: 0, y: 20 },
                whileInView: { opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.05 } },
              }}>
                <div className="card ambient-glow" style={{
                  height: '100%', display: 'flex', flexDirection: 'column',
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 'var(--radius-lg)',
                    background: `color-mix(in srgb, ${feature.color} 12%, transparent)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: 'var(--space-4)',
                  }}>
                    <feature.icon size={22} style={{ color: feature.color }} />
                  </div>
                  <h4 style={{ fontSize: '1.0625rem', fontWeight: 700, marginBottom: 'var(--space-2)' }}>
                    {feature.title}
                  </h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--fg-tertiary)', margin: 0, lineHeight: 1.6 }}>
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ---- HOW IT WORKS ---- */}
      <section id="how-it-works" className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container" style={{ maxWidth: 1280, margin: '0 auto' }}>
          <motion.div {...fadeInUp} className="text-center" style={{ marginBottom: 'var(--space-12)' }}>
            <span className="badge badge-cyan" style={{ marginBottom: 'var(--space-3)' }}>How It Works</span>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 800, marginBottom: 'var(--space-3)' }}>
              From resume to{' '}
              <span className="gradient-text-accent">career readiness</span>
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--fg-tertiary)', maxWidth: 600, margin: '0 auto' }}>
              A systematic, evidence-based approach to career development.
            </p>
          </motion.div>

          <div className="grid" style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 'var(--space-6)',
          }}>
            {[
              { step: '01', title: 'Upload Resume', desc: 'Upload your PDF resume for AI-powered analysis and skill extraction.', icon: FileText },
              { step: '02', title: 'Match Jobs', desc: 'Compare against job descriptions for explainable compatibility scores.', icon: Target },
              { step: '03', title: 'Verify Skills', desc: 'Connect GitHub repos and complete assessments for evidence-based verification.', icon: Shield },
              { step: '04', title: 'Bridge Gaps', desc: 'Get a personalized roadmap with resources, exercises, and milestones.', icon: Map },
              { step: '05', title: 'Practice', desc: 'Solve coding challenges and practice mock interviews.', icon: Code },
              { step: '06', title: 'Track Progress', desc: 'Monitor your career readiness and skill development over time.', icon: BarChart3 },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                style={{
                  padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-primary)',
                  position: 'relative',
                }}
              >
                <span style={{
                  fontSize: '3rem', fontWeight: 900,
                  position: 'absolute', top: 'var(--space-4)', right: 'var(--space-4)',
                  opacity: 0.06, lineHeight: 1,
                }}>
                  {item.step}
                </span>
                <div style={{
                  width: 40, height: 40, borderRadius: 'var(--radius-md)',
                  background: 'var(--gradient-accent)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 'var(--space-4)',
                }}>
                  <item.icon size={20} color="white" />
                </div>
                <h4 style={{ fontWeight: 700, marginBottom: 'var(--space-2)' }}>{item.title}</h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--fg-tertiary)', margin: 0 }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- MODULES PREVIEW ---- */}
      <section id="modules" className="section">
        <div className="container" style={{ maxWidth: 1280, margin: '0 auto' }}>
          <motion.div {...fadeInUp} className="text-center" style={{ marginBottom: 'var(--space-12)' }}>
            <span className="badge badge-emerald" style={{ marginBottom: 'var(--space-3)' }}>Platform</span>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 800, marginBottom: 'var(--space-3)' }}>
              Built for serious{' '}
              <span className="gradient-text">career development</span>
            </h2>
          </motion.div>

          {/* Resume Analysis Preview */}
          <motion.div {...fadeInUp} className="glass-strong" style={{
            borderRadius: 'var(--radius-xl)', padding: 'var(--space-8)',
            marginBottom: 'var(--space-8)',
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: 'var(--space-8)', alignItems: 'center',
          }} id="module-preview-grid">
            <div>
              <div className="badge badge-primary" style={{ marginBottom: 'var(--space-3)' }}>Resume Analysis</div>
              <h3 style={{ fontWeight: 800, marginBottom: 'var(--space-3)', fontSize: '1.5rem' }}>
                AI-powered resume intelligence
              </h3>
              <p style={{ color: 'var(--fg-tertiary)', marginBottom: 'var(--space-4)' }}>
                Extract skills, education, and experience from your PDF resume. Get role-specific suggestions
                and identify areas for improvement.
              </p>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {['PDF text extraction', 'Skill normalization', 'Section scoring', 'Missing section detection', 'Improvement suggestions'].map(item => (
                  <li key={item} className="flex items-center gap-2" style={{
                    padding: 'var(--space-2) 0', fontSize: '0.875rem', color: 'var(--fg-secondary)',
                  }}>
                    <CheckCircle size={14} style={{ color: 'var(--accent-emerald)', flexShrink: 0 }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card-static" style={{ padding: 'var(--space-6)' }}>
              <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-4)' }}>
                <span style={{ fontWeight: 700 }}>Resume Score</span>
                <ScoreRing score={78} size={60} strokeWidth={5} />
              </div>
              {['Contact Info', 'Experience', 'Skills', 'Education', 'Projects'].map((section, i) => (
                <div key={section} className="flex items-center justify-between" style={{
                  padding: 'var(--space-2) 0',
                  borderBottom: i < 4 ? '1px solid var(--border-secondary)' : 'none',
                }}>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--fg-secondary)' }}>{section}</span>
                  <div className="flex items-center gap-2">
                    <div className="progress-bar" style={{ width: 80, height: 4 }}>
                      <div className="progress-bar-fill" style={{ width: `${[95, 82, 75, 90, 65][i]}%` }} />
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--fg-primary)', width: 30, textAlign: 'right' }}>
                      {[95, 82, 75, 90, 65][i]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Evidence + Roadmap Side by Side */}
          <div className="grid" style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: 'var(--space-6)',
          }}>
            {/* Evidence Card */}
            <motion.div {...fadeInUp} className="card-static" style={{ padding: 'var(--space-6)' }}>
              <div className="badge badge-emerald" style={{ marginBottom: 'var(--space-3)' }}>Skill Evidence</div>
              <h4 style={{ fontWeight: 700, marginBottom: 'var(--space-4)' }}>Verify through repositories</h4>
              {[
                { skill: 'React', repo: 'user/dashboard-app', confidence: 92, icon: CheckCircle },
                { skill: 'Python', repo: 'user/ml-pipeline', confidence: 88, icon: CheckCircle },
                { skill: 'Docker', repo: 'user/api-service', confidence: 45, icon: Star },
              ].map(e => (
                <div key={e.skill} className="flex items-center gap-3" style={{
                  padding: 'var(--space-3)', marginBottom: 'var(--space-2)',
                  background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)',
                }}>
                  <e.icon size={16} style={{
                    color: e.confidence > 70 ? 'var(--accent-emerald)' : 'var(--accent-amber)',
                  }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{e.skill}</div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--fg-tertiary)' }}>{e.repo}</div>
                  </div>
                  <span style={{
                    fontSize: '0.75rem', fontWeight: 700,
                    color: e.confidence > 70 ? 'var(--accent-emerald)' : 'var(--accent-amber)',
                  }}>
                    {e.confidence}%
                  </span>
                </div>
              ))}
            </motion.div>

            {/* Roadmap Card */}
            <motion.div {...fadeInUp} className="card-static" style={{ padding: 'var(--space-6)' }}>
              <div className="badge badge-primary" style={{ marginBottom: 'var(--space-3)' }}>Career Roadmap</div>
              <h4 style={{ fontWeight: 700, marginBottom: 'var(--space-4)' }}>Adaptive learning path</h4>
              {[
                { skill: 'Linux Fundamentals', status: 'completed', hours: 15 },
                { skill: 'Docker & Containers', status: 'in_progress', hours: 20 },
                { skill: 'CI/CD Pipelines', status: 'not_started', hours: 12 },
                { skill: 'AWS Core Services', status: 'not_started', hours: 30 },
              ].map((step, i) => (
                <div key={step.skill} className="flex items-center gap-3" style={{
                  padding: 'var(--space-3) 0',
                  borderBottom: i < 3 ? '1px solid var(--border-secondary)' : 'none',
                }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: 'var(--radius-full)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: step.status === 'completed' ? 'var(--accent-emerald)'
                      : step.status === 'in_progress' ? 'var(--accent-cyan)'
                      : 'var(--bg-tertiary)',
                    border: step.status === 'not_started' ? '2px solid var(--border-primary)' : 'none',
                    flexShrink: 0,
                  }}>
                    {step.status === 'completed' && <CheckCircle size={12} color="white" />}
                    {step.status === 'in_progress' && <div style={{
                      width: 8, height: 8, borderRadius: '50%', background: 'white',
                    }} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '0.8125rem', fontWeight: 600,
                      textDecoration: step.status === 'completed' ? 'line-through' : 'none',
                      color: step.status === 'completed' ? 'var(--fg-tertiary)' : 'var(--fg-primary)',
                    }}>
                      {step.skill}
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--fg-tertiary)' }}>{step.hours}h estimated</div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        <style>{`
          @media (max-width: 768px) {
            #module-preview-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>

      {/* ---- CTA SECTION ---- */}
      <section className="section" style={{
        background: 'var(--bg-secondary)', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at center, rgba(223,255,0,0.06) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />
        <div className="container text-center" style={{ maxWidth: 700, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <motion.div {...fadeInUp}>
            <h2 style={{
              fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 800,
              marginBottom: 'var(--space-4)',
            }}>
              Ready to accelerate your{' '}
              <span className="gradient-text">career?</span>
            </h2>
            <p style={{
              fontSize: '1.0625rem', color: 'var(--fg-tertiary)',
              maxWidth: 500, margin: '0 auto var(--space-8)',
            }}>
              Start with a free resume analysis. No credit card required.
              Build your evidence-backed career roadmap today.
            </p>
            <Link to={isAuthenticated ? "/app" : "/login"} className="btn btn-primary btn-lg" style={{ gap: 8 }}>
              Get Started Free <ChevronRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ---- FOOTER ---- */}
      <footer style={{
        padding: 'var(--space-10) 0 var(--space-6)',
        borderTop: '1px solid var(--border-primary)',
      }}>
        <div className="container" style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div className="flex justify-between items-start" style={{
            flexWrap: 'wrap', gap: 'var(--space-8)', marginBottom: 'var(--space-8)',
          }}>
            <div style={{ maxWidth: 300 }}>
              <div className="flex items-center gap-2.5" style={{ marginBottom: 'var(--space-3)' }}>
                <img
                  src="/images/skillsync-symbol-transparent.png"
                  alt="SkillSync AI"
                  style={{
                    width: 34,
                    height: 34,
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 0 8px rgba(223, 255, 0, 0.45))',
                  }}
                />
                <span style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.02em' }}>
                  Skill<span style={{ color: '#DFFF00' }}>Sync</span> <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--fg-secondary)', verticalAlign: 'super' }}>AI</span>
                </span>
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--fg-tertiary)', margin: 0 }}>
                Evidence-Based Career Intelligence and Job Readiness Platform.
              </p>
            </div>

            {[
              { title: 'Platform', links: ['Resume Analyzer', 'Job Matching', 'Skill Evidence', 'Career Roadmap'] },
              { title: 'Resources', links: ['Documentation', 'API Reference', 'GitHub', 'Changelog'] },
              { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'] },
            ].map(col => (
              <div key={col.title}>
                <h5 style={{ fontWeight: 700, fontSize: '0.8125rem', marginBottom: 'var(--space-3)', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--fg-tertiary)' }}>
                  {col.title}
                </h5>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {col.links.map(link => (
                    <li key={link} style={{ marginBottom: 'var(--space-2)' }}>
                      <a href="#" style={{ fontSize: '0.8125rem', color: 'var(--fg-secondary)' }}>{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div style={{
            borderTop: '1px solid var(--border-primary)',
            paddingTop: 'var(--space-6)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            textAlign: 'center',
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--fg-primary)',
              letterSpacing: '0.02em',
            }}>
              <span>Built with precision by Sanath P</span>
              <span style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#DFFF00',
                boxShadow: '0 0 10px #DFFF00, 0 0 18px rgba(223, 255, 0, 0.7)',
                display: 'inline-block',
              }} />
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--fg-tertiary)', margin: 0 }}>
              © {new Date().getFullYear()} SkillSync AI — Obsidian Constellation Career Intelligence Engine
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
