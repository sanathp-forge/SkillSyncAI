// ============================================
// SKILLSYNC AI — LANDING NAVBAR
// ============================================
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Sun, Moon, Sparkles } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { motion, AnimatePresence } from 'framer-motion';

export default function LandingNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const links = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Modules', href: '#modules' },
  ];

  return (
    <nav className="landing-nav glass-strong" style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 'var(--z-sticky)',
      padding: 'var(--space-3) var(--space-6)',
    }}>
      <div className="container flex items-center justify-between" style={{ maxWidth: 1280, margin: '0 auto' }}>
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5" style={{ textDecoration: 'none' }}>
          <img
            src="/images/skillsync-symbol-transparent.png"
            alt="SkillSync AI"
            style={{
              width: 36,
              height: 36,
              objectFit: 'contain',
              flexShrink: 0,
              filter: 'drop-shadow(0 0 10px rgba(223, 255, 0, 0.45))',
            }}
          />
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--fg-primary)', letterSpacing: '-0.02em' }}>
            Skill<span style={{ color: '#DFFF00' }}>Sync</span> <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--fg-secondary)', verticalAlign: 'super' }}>AI</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="flex items-center gap-6 hide-mobile">
          {links.map(l => (
            <a key={l.label} href={l.href} style={{
              color: 'var(--fg-secondary)', fontSize: '0.875rem', fontWeight: 500,
              textDecoration: 'none', transition: 'color var(--duration-fast) ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--fg-primary)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--fg-secondary)')}
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button className="btn btn-icon btn-ghost" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Link to="/login" className="btn btn-secondary btn-sm hide-mobile">Sign In</Link>
          <Link to="/login" className="btn btn-primary btn-sm hide-mobile">Get Started</Link>
          <button
            className="btn btn-icon btn-ghost"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            style={{ display: 'none' }}
            id="mobile-menu-btn"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              overflow: 'hidden',
              borderTop: '1px solid var(--border-primary)',
              marginTop: 'var(--space-3)',
              paddingTop: 'var(--space-4)',
            }}
          >
            <div className="flex flex-col gap-3" style={{ padding: 'var(--space-2) 0' }}>
              {links.map(l => (
                <a key={l.label} href={l.href} onClick={() => setMobileOpen(false)} style={{
                  color: 'var(--fg-secondary)', fontSize: '0.875rem', fontWeight: 500,
                  textDecoration: 'none', padding: 'var(--space-2) 0',
                }}>
                  {l.label}
                </a>
              ))}
              <Link to="/login" className="btn btn-secondary" onClick={() => setMobileOpen(false)}>Sign In</Link>
              <Link to="/login" className="btn btn-primary" onClick={() => setMobileOpen(false)}>Get Started</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          #mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}
