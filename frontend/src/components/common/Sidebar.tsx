// ============================================
// SKILLSYNC AI — OBSIDIAN APP NAVIGATION
// Black × RGB Yellow Glassmorphic Sidebar
// ============================================
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, FileText, Target, GitBranch, Shield, Map,
  Code, MessageSquare, TrendingUp, BarChart3, FolderOpen, Settings,
  ChevronLeft, ChevronRight, Sparkles, LogOut, Sun, Moon,
  Menu, X
} from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
  badge?: string;
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: 'Overview', path: '/app' },
  { icon: FileText, label: 'Resume Analyzer', path: '/app/resume' },
  { icon: Target, label: 'Job Matching', path: '/app/matching' },
  { icon: GitBranch, label: 'Skill Gap Analysis', path: '/app/skill-gap' },
  { icon: Shield, label: 'Skill Evidence', path: '/app/evidence' },
  { icon: Map, label: 'Career Roadmap', path: '/app/roadmap' },
  { icon: Code, label: 'Coding Challenges', path: '/app/challenges' },
  { icon: MessageSquare, label: 'AI Mock Interviews', path: '/app/interviews' },
  { icon: TrendingUp, label: 'Job Market', path: '/app/market' },
  { icon: BarChart3, label: 'Progress & Reports', path: '/app/progress' },
  { icon: FolderOpen, label: 'My Resumes', path: '/app/resumes' },
  { icon: Settings, label: 'Settings', path: '/app/settings' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  const isActive = (path: string) => {
    if (path === '/app') return location.pathname === '/app';
    if (path === '/app/skill-gap') return location.pathname === '/app/skill-gap' || location.pathname === '/app/gap';
    if (path === '/app/progress') return location.pathname === '/app/progress' || location.pathname === '/app/reports';
    return location.pathname.startsWith(path);
  };

  const sidebarContent = (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      padding: collapsed ? 'var(--space-3)' : 'var(--space-4)',
    }}>
      {/* Logo & Collapse Header */}
      <div className="flex items-center justify-between" style={{
        padding: 'var(--space-2) var(--space-2)',
        marginBottom: 'var(--space-5)',
        borderBottom: '1px solid var(--border-secondary)',
        paddingBottom: 'var(--space-4)',
      }}>
        <Link to="/app" className="flex items-center gap-2.5" style={{ textDecoration: 'none' }}>
          <img
            src="/images/skillsync-symbol-transparent.png"
            alt="SkillSync AI"
            style={{
              width: 32,
              height: 32,
              objectFit: 'contain',
              flexShrink: 0,
              filter: 'drop-shadow(0 0 8px rgba(223, 255, 0, 0.45))',
            }}
          />
          {!collapsed && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '1.0625rem', fontWeight: 800, color: 'var(--fg-primary)', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
                Skill<span style={{ color: 'var(--accent-primary)', textShadow: '0 0 10px rgba(223, 255, 0, 0.35)' }}>Sync</span> <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--fg-secondary)', verticalAlign: 'super' }}>AI</span>
              </span>
              <span style={{ fontSize: '0.625rem', color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                Obsidian Engine
              </span>
            </div>
          )}
        </Link>

        <button
          className="btn btn-icon btn-ghost hide-mobile"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          style={{
            flexShrink: 0,
            color: 'var(--fg-secondary)',
            padding: 6,
          }}
        >
          {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex flex-col gap-1" style={{ flex: 1, overflowY: 'auto' }}>
        {navItems.map(item => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-3)',
                padding: collapsed ? 'var(--space-3)' : 'var(--space-2) var(--space-3)',
                borderRadius: 'var(--radius-md)',
                color: active ? 'var(--accent-primary)' : 'var(--fg-secondary)',
                background: active ? 'rgba(223, 255, 0, 0.08)' : 'transparent',
                border: active ? '1px solid rgba(223, 255, 0, 0.22)' : '1px solid transparent',
                textDecoration: 'none',
                fontSize: '0.8125rem',
                fontWeight: active ? 700 : 500,
                transition: 'all var(--duration-fast) var(--ease-out)',
                justifyContent: collapsed ? 'center' : 'flex-start',
                position: 'relative',
              }}
              onMouseEnter={e => {
                if (!active) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                  e.currentTarget.style.color = 'var(--fg-primary)';
                  const icon = e.currentTarget.querySelector('svg');
                  if (icon) icon.style.color = 'var(--accent-primary)';
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--fg-secondary)';
                  const icon = e.currentTarget.querySelector('svg');
                  if (icon) icon.style.color = '';
                }
              }}
              title={collapsed ? item.label : undefined}
            >
              <item.icon size={17} style={{ flexShrink: 0, transition: 'color 0.2s ease' }} />
              {!collapsed && (
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.label}
                </span>
              )}
              {active && (
                <div style={{
                  position: 'absolute',
                  left: -1,
                  top: '20%',
                  bottom: '20%',
                  width: 3,
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--accent-primary)',
                  boxShadow: '0 0 10px var(--accent-primary)',
                }} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom User & Mode Controls */}
      <div className="flex flex-col gap-2" style={{
        borderTop: '1px solid var(--border-secondary)',
        paddingTop: 'var(--space-3)',
        marginTop: 'var(--space-3)',
      }}>
        <button
          className="btn btn-ghost"
          onClick={toggleTheme}
          style={{
            justifyContent: collapsed ? 'center' : 'flex-start',
            width: '100%',
            padding: 'var(--space-2) var(--space-3)',
            fontSize: '0.8125rem',
            color: 'var(--fg-secondary)',
          }}
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          {!collapsed && <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>

        {/* User Profile Tile */}
        {!collapsed && user && (
          <div className="flex items-center gap-2.5" style={{
            padding: 'var(--space-2) var(--space-3)',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255, 255, 255, 0.035)',
            border: '1px solid var(--border-secondary)',
          }}>
            <div style={{
              width: 30,
              height: 30,
              borderRadius: 'var(--radius-full)',
              background: 'linear-gradient(135deg, #DFFF00, #B8FF57)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              fontWeight: 800,
              color: '#050505',
              flexShrink: 0,
            }}>
              {user.full_name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: 'var(--fg-primary)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {user.full_name}
              </div>
              <div style={{
                fontSize: '0.6875rem',
                color: 'var(--fg-tertiary)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {user.email}
              </div>
            </div>
            <button
              className="btn btn-icon btn-ghost"
              onClick={logout}
              aria-label="Logout"
              title="Logout"
              style={{ padding: 4, color: 'var(--fg-tertiary)' }}
            >
              <LogOut size={15} />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Hamburger */}
      <button
        className="btn btn-icon btn-ghost"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
        style={{
          position: 'fixed',
          top: 'var(--space-3)',
          left: 'var(--space-3)',
          zIndex: 'var(--z-sticky)',
          display: 'none',
          background: 'rgba(9, 10, 10, 0.85)',
          border: '1px solid var(--border-primary)',
          backdropFilter: 'blur(16px)',
        }}
        id="sidebar-mobile-toggle"
      >
        <Menu size={20} color="#DFFF00" />
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.75)',
              backdropFilter: 'blur(8px)',
              zIndex: 'var(--z-overlay)',
              display: 'none',
            }}
            id="sidebar-overlay"
          />
        )}
      </AnimatePresence>

      {/* Desktop Obsidian Glass Sidebar */}
      <aside
        id="app-sidebar"
        style={{
          width: collapsed ? 72 : 250,
          minHeight: '100vh',
          background: 'rgba(9, 10, 10, 0.82)',
          borderRight: '1px solid var(--border-primary)',
          backdropFilter: 'blur(24px) saturate(130%)',
          WebkitBackdropFilter: 'blur(24px) saturate(130%)',
          transition: 'width var(--duration-normal) var(--ease-out)',
          flexShrink: 0,
          overflow: 'hidden',
          position: 'relative',
          zIndex: 'var(--z-sticky)',
        }}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Glass Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              bottom: 0,
              width: 270,
              background: 'rgba(9, 10, 10, 0.95)',
              borderRight: '1px solid var(--border-primary)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              zIndex: 'var(--z-modal)',
              display: 'none',
              boxShadow: 'var(--shadow-xl)',
            }}
            id="sidebar-mobile"
          >
            <button
              className="btn btn-icon btn-ghost"
              onClick={() => setMobileOpen(false)}
              style={{ position: 'absolute', top: 'var(--space-3)', right: 'var(--space-3)', zIndex: 1 }}
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
            {sidebarContent}
          </motion.aside>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          #app-sidebar { display: none !important; }
          #sidebar-mobile-toggle { display: flex !important; }
          #sidebar-overlay { display: block !important; }
          #sidebar-mobile { display: block !important; }
        }
      `}</style>
    </>
  );
}
