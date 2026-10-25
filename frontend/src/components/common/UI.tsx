// ============================================
// SKILLSYNC AI — SHARED UI COMPONENTS
// ============================================
import { type ReactNode, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Info, CheckCircle, XCircle, Loader2 } from 'lucide-react';

// ---- Score Ring ----
export function ScoreRing({
  score, size = 120, strokeWidth = 8, color,
  label, showPercentage = true,
}: {
  score: number; size?: number; strokeWidth?: number;
  color?: string; label?: string; showPercentage?: boolean;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const [offset, setOffset] = useState(circumference);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOffset(circumference - (score / 100) * circumference);
    }, 300);
    return () => clearTimeout(timer);
  }, [score, circumference]);

  const getColor = () => {
    if (color) return color;
    if (score >= 75) return '#DFFF00'; // Electric RGB Yellow
    if (score >= 60) return '#B8FF57'; // Lime
    if (score >= 45) return '#42E8E0'; // Cyan
    if (score >= 30) return '#FFBF47'; // Amber
    return '#FF5C5C'; // Rose
  };

  return (
    <div className="score-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="rgba(255, 255, 255, 0.06)" strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={getColor()} strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: 'stroke-dashoffset 1s var(--ease-out)',
            filter: `drop-shadow(0 0 8px ${getColor()}66)`,
          }}
        />
      </svg>
      <div style={{
        position: 'absolute', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        {showPercentage && (
          <span style={{
            fontSize: size > 100 ? '1.75rem' : '1.25rem',
            fontWeight: 800, color: 'var(--fg-primary)',
          }}>
            <AnimatedNumber value={score} />
          </span>
        )}
        {label && (
          <span style={{ fontSize: '0.6875rem', color: 'var(--fg-tertiary)', fontWeight: 500 }}>
            {label}
          </span>
        )}
      </div>
    </div>
  );
}

// ---- Animated Number ----
export function AnimatedNumber({ value, duration = 1000 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(animate);
    };
    animate();
  }, [value, duration]);

  return <>{display}</>;
}

// ---- Badge ----
export function Badge({
  children, variant = 'primary', size = 'md',
}: {
  children: ReactNode; variant?: 'primary' | 'cyan' | 'emerald' | 'amber' | 'rose' | 'ghost';
  size?: 'sm' | 'md';
}) {
  const cls = variant === 'ghost' ? 'badge' : `badge badge-${variant}`;
  return (
    <span className={cls} style={{
      ...(variant === 'ghost' ? { background: 'var(--bg-tertiary)', color: 'var(--fg-secondary)' } : {}),
      ...(size === 'sm' ? { fontSize: '0.6875rem', padding: '2px 8px' } : {}),
    }}>
      {children}
    </span>
  );
}

// ---- Demo Banner ----
export function DemoBanner() {
  const [backendLive, setBackendLive] = useState(false);

  useEffect(() => {
    fetch('/api/v1/health')
      .then(res => res.json())
      .then(data => {
        if (data && data.status === 'healthy') {
          setBackendLive(true);
        }
      })
      .catch(() => setBackendLive(false));
  }, []);

  if (backendLive) {
    return (
      <div style={{
        padding: 'var(--space-2) var(--space-4)',
        background: 'rgba(223, 255, 0, 0.05)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid rgba(223, 255, 0, 0.22)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 'var(--space-2)',
        marginBottom: 'var(--space-4)',
      }}>
        <div className="flex items-center gap-2">
          <span style={{
            width: 7, height: 7, borderRadius: '50%',
            background: 'var(--accent-primary)',
            boxShadow: '0 0 10px var(--accent-primary)',
          }} />
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
            Backend Active — FastAPI & PyMuPDF Intelligence Service Connected (:8000)
          </span>
        </div>
        <span style={{ fontSize: '0.6875rem', color: 'var(--fg-secondary)', fontWeight: 500 }}>
          Real AI Extraction & Analysis Online
        </span>
      </div>
    );
  }

  return (
    <div style={{
      padding: 'var(--space-2) var(--space-4)',
      background: 'rgba(255, 191, 71, 0.06)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid rgba(255, 191, 71, 0.25)',
      display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
      marginBottom: 'var(--space-4)',
    }}>
      <AlertTriangle size={14} style={{ color: 'var(--accent-amber)', flexShrink: 0 }} />
      <span style={{ fontSize: '0.75rem', color: 'var(--fg-secondary)' }}>
        Demo Mode — Showing sample data. Connect the backend for real AI-powered analysis.
      </span>
    </div>
  );
}


// ---- Page Header ----
export function PageHeader({
  title, description, action, badge,
}: {
  title: string; description?: string; action?: ReactNode; badge?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-start justify-between"
      style={{
        marginBottom: 'var(--space-6)',
        flexWrap: 'wrap', gap: 'var(--space-4)',
      }}
    >
      <div>
        <div className="flex items-center gap-3">
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: 'var(--space-1)' }}>
            {title}
          </h1>
          {badge && <Badge variant="primary">{badge}</Badge>}
        </div>
        {description && (
          <p style={{ fontSize: '0.875rem', color: 'var(--fg-tertiary)', maxWidth: 600, margin: 0 }}>
            {description}
          </p>
        )}
      </div>
      {action && <div>{action}</div>}
    </motion.div>
  );
}

// ---- Stat Card ----
export function StatCard({
  icon: Icon, label, value, change, color = 'var(--accent-primary)',
  onClick,
}: {
  icon: React.ElementType; label: string; value: string | number;
  change?: string; color?: string; onClick?: () => void;
}) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="card"
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      onClick={onClick}
    >
      <div className="flex items-start justify-between" style={{ marginBottom: 'var(--space-3)' }}>
        <div style={{
          width: 40, height: 40, borderRadius: 'var(--radius-md)',
          background: `color-mix(in srgb, ${color} 12%, transparent)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={20} style={{ color }} />
        </div>
        {change && (
          <span style={{
            fontSize: '0.75rem', fontWeight: 600,
            color: change.startsWith('+') ? 'var(--accent-emerald)' : 'var(--accent-rose)',
          }}>
            {change}
          </span>
        )}
      </div>
      <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--fg-primary)', marginBottom: 2 }}>
        {typeof value === 'number' ? <AnimatedNumber value={value} /> : value}
      </div>
      <div style={{ fontSize: '0.8125rem', color: 'var(--fg-tertiary)' }}>{label}</div>
    </motion.div>
  );
}

// ---- Loading Skeleton ----
export function Skeleton({ width, height = 20, radius }: { width?: string | number; height?: number; radius?: number }) {
  return (
    <div className="skeleton" style={{
      width: width || '100%', height,
      borderRadius: radius || 'var(--radius-md)',
    }} />
  );
}

export function CardSkeleton() {
  return (
    <div className="card-static" style={{ padding: 'var(--space-6)' }}>
      <Skeleton width={120} height={16} />
      <div style={{ marginTop: 'var(--space-3)' }}><Skeleton width="80%" height={24} /></div>
      <div style={{ marginTop: 'var(--space-2)' }}><Skeleton width="60%" height={14} /></div>
    </div>
  );
}

// ---- Empty State ----
export function EmptyState({
  icon: Icon = Info, title, description, action,
}: {
  icon?: React.ElementType; title: string; description?: string; action?: ReactNode;
}) {
  return (
    <div className="empty-state">
      <Icon className="empty-state-icon" />
      <div className="empty-state-title">{title}</div>
      {description && <div className="empty-state-description">{description}</div>}
      {action && <div style={{ marginTop: 'var(--space-4)' }}>{action}</div>}
    </div>
  );
}

// ---- Loading Spinner ----
export function LoadingSpinner({ size = 24 }: { size?: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-8)' }}>
      <Loader2 size={size} style={{ animation: 'spin 1s linear infinite', color: 'var(--accent-primary)' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ---- Progress Bar ----
export function ProgressBar({ value, max = 100, color, label }: { value: number; max?: number; color?: string; label?: string }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div>
      {label && (
        <div className="flex justify-between" style={{ marginBottom: 'var(--space-1)' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--fg-secondary)' }}>{label}</span>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--fg-primary)' }}>{Math.round(pct)}%</span>
        </div>
      )}
      <div className="progress-bar">
        <div className="progress-bar-fill" style={{
          width: `${pct}%`,
          ...(color ? { background: color } : {}),
        }} />
      </div>
    </div>
  );
}

// ---- Status Badge ----
export function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { color: string; bg: string; icon: React.ElementType }> = {
    completed: { color: 'var(--accent-emerald)', bg: 'var(--accent-emerald-light)', icon: CheckCircle },
    passed: { color: 'var(--accent-emerald)', bg: 'var(--accent-emerald-light)', icon: CheckCircle },
    in_progress: { color: 'var(--accent-cyan)', bg: 'var(--accent-cyan-light)', icon: Loader2 },
    active: { color: 'var(--accent-cyan)', bg: 'var(--accent-cyan-light)', icon: Loader2 },
    pending: { color: 'var(--accent-amber)', bg: 'var(--accent-amber-light)', icon: Info },
    failed: { color: 'var(--accent-rose)', bg: 'var(--accent-rose-light)', icon: XCircle },
    error: { color: 'var(--accent-rose)', bg: 'var(--accent-rose-light)', icon: XCircle },
  };
  const c = config[status] || config.pending;
  const Icon = c.icon;

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '2px 10px', borderRadius: 'var(--radius-full)',
      background: c.bg, color: c.color,
      fontSize: '0.75rem', fontWeight: 600,
    }}>
      <Icon size={12} />
      {status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
    </span>
  );
}

// ---- App Footer (Personal Credit) ----
export function AppFooter() {
  return (
    <footer style={{
      marginTop: 'var(--space-12)',
      paddingTop: 'var(--space-6)',
      paddingBottom: 'var(--space-8)',
      borderTop: '1px solid var(--border-secondary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 'var(--space-4)',
      color: 'var(--fg-tertiary)',
      fontSize: '0.8125rem',
    }}>
      <div className="flex items-center gap-2">
        <span style={{
          width: 7, height: 7, borderRadius: '50%',
          background: 'var(--accent-primary)',
          boxShadow: '0 0 10px var(--accent-primary)',
          display: 'inline-block',
        }} />
        <span style={{ color: 'var(--fg-secondary)', fontWeight: 600 }}>
          Built with precision by <strong style={{ color: 'var(--fg-primary)' }}>Sanath P</strong>
        </span>
      </div>
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1.5">
          <img
            src="/images/skillsync-symbol-transparent.png"
            alt="SkillSync AI"
            style={{ width: 16, height: 16, objectFit: 'contain', verticalAlign: 'middle' }}
          />
          SkillSync AI &copy; {new Date().getFullYear()}
        </span>
        <span style={{
          padding: '2px 8px',
          borderRadius: 'var(--radius-full)',
          background: 'rgba(223, 255, 0, 0.08)',
          border: '1px solid rgba(223, 255, 0, 0.25)',
          color: 'var(--accent-primary)',
          fontSize: '0.6875rem',
          fontWeight: 700,
        }}>
          Obsidian Constellation
        </span>
      </div>
    </footer>
  );
}
