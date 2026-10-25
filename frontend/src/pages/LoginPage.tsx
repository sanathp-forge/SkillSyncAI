// ============================================
// SKILLSYNC AI — LOGIN / REGISTER PAGE
// ============================================
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Mail, Lock, User, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { AppFooter } from '@/components/common/UI';

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login, register, demoLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isRegister) {
        await register(email, password, name);
      } else {
        await login(email, password);
      }
      navigate('/app');
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    demoLogin();
    navigate('/app');
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', padding: 'var(--space-6)',
    }}>
      {/* Background */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'var(--gradient-hero)',
        pointerEvents: 'none',
      }} />
      <div className="bg-grid" style={{
        position: 'absolute', inset: 0, opacity: 0.2, pointerEvents: 'none',
      }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          width: '100%', maxWidth: 420, position: 'relative', zIndex: 1,
        }}
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-2" style={{ marginBottom: 'var(--space-8)' }}>
          <Link to="/" className="flex items-center gap-3" style={{ textDecoration: 'none' }}>
            <img
              src="/images/skillsync-symbol-transparent.png"
              alt="SkillSync AI"
              style={{
                width: 44,
                height: 44,
                objectFit: 'contain',
                filter: 'drop-shadow(0 0 12px rgba(223, 255, 0, 0.5))',
              }}
            />
            <span style={{ fontSize: '1.625rem', fontWeight: 900, color: 'var(--fg-primary)', letterSpacing: '-0.02em' }}>
              Skill<span style={{ color: '#DFFF00' }}>Sync</span> <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--fg-secondary)', verticalAlign: 'super' }}>AI</span>
            </span>
          </Link>
        </div>

        {/* Card */}
        <div className="glass-strong" style={{
          borderRadius: 'var(--radius-xl)', padding: 'var(--space-8)',
        }}>
          <div className="text-center" style={{ marginBottom: 'var(--space-6)' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 'var(--space-2)' }}>
              {isRegister ? 'Create your account' : 'Welcome back'}
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--fg-tertiary)', margin: 0 }}>
              {isRegister ? 'Start your evidence-based career journey' : 'Sign in to continue your progress'}
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2" style={{
              padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-md)',
              background: 'var(--accent-rose-light)', marginBottom: 'var(--space-4)',
              border: '1px solid var(--accent-rose)',
            }}>
              <AlertCircle size={14} style={{ color: 'var(--accent-rose)' }} />
              <span style={{ fontSize: '0.8125rem', color: 'var(--accent-rose)' }}>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {isRegister && (
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <label className="label" htmlFor="name">Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{
                    position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                    color: 'var(--fg-tertiary)',
                  }} />
                  <input
                    id="name" className="input" type="text"
                    placeholder="John Doe"
                    value={name} onChange={e => setName(e.target.value)}
                    style={{ paddingLeft: 38 }} required
                  />
                </div>
              </div>
            )}

            <div style={{ marginBottom: 'var(--space-4)' }}>
              <label className="label" htmlFor="email">Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{
                  position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                  color: 'var(--fg-tertiary)',
                }} />
                <input
                  id="email" className="input" type="email"
                  placeholder="you@example.com"
                  value={email} onChange={e => setEmail(e.target.value)}
                  style={{ paddingLeft: 38 }} required
                />
              </div>
            </div>

            <div style={{ marginBottom: 'var(--space-6)' }}>
              <label className="label" htmlFor="password">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{
                  position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                  color: 'var(--fg-tertiary)',
                }} />
                <input
                  id="password" className="input"
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password} onChange={e => setPassword(e.target.value)}
                  style={{ paddingLeft: 38, paddingRight: 38 }}
                  required minLength={6}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{
                  position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--fg-tertiary)', padding: 4,
                }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button className="btn btn-primary btn-lg" type="submit" disabled={loading}
              style={{ width: '100%', marginBottom: 'var(--space-4)' }}>
              {loading ? 'Please wait...' : isRegister ? 'Create Account' : 'Sign In'}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <div style={{
            position: 'relative', textAlign: 'center',
            margin: 'var(--space-4) 0',
          }}>
            <div style={{
              position: 'absolute', top: '50%', left: 0, right: 0,
              height: 1, background: 'var(--border-primary)',
            }} />
            <span style={{
              position: 'relative', background: 'var(--bg-elevated)',
              padding: '0 var(--space-3)',
              fontSize: '0.75rem', color: 'var(--fg-tertiary)',
            }}>
              or
            </span>
          </div>

          <button className="btn btn-secondary btn-lg" onClick={handleDemoLogin}
            style={{ width: '100%', marginBottom: 'var(--space-4)' }}>
            <Sparkles size={16} /> Explore Demo Mode
          </button>

          <p className="text-center" style={{ fontSize: '0.8125rem', color: 'var(--fg-tertiary)', margin: 0 }}>
            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={() => { setIsRegister(!isRegister); setError(''); }}
              style={{
                background: 'none', border: 'none', color: 'var(--accent-primary)',
                cursor: 'pointer', fontWeight: 600, fontSize: '0.8125rem',
              }}
            >
              {isRegister ? 'Sign in' : 'Create one'}
            </button>
          </p>
        </div>

        <AppFooter />
      </motion.div>
    </div>
  );
}
