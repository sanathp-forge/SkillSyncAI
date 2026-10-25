// ============================================
// SKILLSYNC AI — SETTINGS PAGE
// ============================================
import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Bell, Palette, Database, LogOut, Save } from 'lucide-react';
import { PageHeader, AppFooter } from '@/components/common/UI';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { authApi } from '@/services/api';

export default function SettingsPage() {
  const { user, updateUser, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [targetRole, setTargetRole] = useState(user?.target_role || '');
  const [expLevel, setExpLevel] = useState(user?.experience_level || 'junior');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const saveProfile = async () => {
    setSaving(true);
    try {
      const updated = await authApi.updateProfile({ full_name: fullName, target_role: targetRole, experience_level: expLevel as any });
      updateUser(updated);
    } catch {
      updateUser({ full_name: fullName, target_role: targetRole, experience_level: expLevel as any });
    } finally {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <div style={{ padding: 'var(--space-6)', maxWidth: 800 }}>
      <PageHeader title="Settings" description="Manage your account, preferences, and integrations." />

      {/* Profile */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-static" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-5)' }}>
        <div className="flex items-center gap-3" style={{ marginBottom: 'var(--space-5)' }}>
          <User size={18} style={{ color: 'var(--accent-primary)' }} />
          <h3 style={{ fontWeight: 700, fontSize: '1.0625rem' }}>Profile</h3>
        </div>

        <div className="grid grid-2" style={{ gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
          <div>
            <label className="label" htmlFor="s-name">Full Name</label>
            <input id="s-name" className="input" value={fullName} onChange={e => setFullName(e.target.value)} />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input" value={user?.email || ''} disabled style={{ opacity: 0.6 }} />
          </div>
        </div>

        <div className="grid grid-2" style={{ gap: 'var(--space-4)', marginBottom: 'var(--space-5)' }}>
          <div>
            <label className="label" htmlFor="s-role">Target Role</label>
            <input id="s-role" className="input" value={targetRole} onChange={e => setTargetRole(e.target.value)} placeholder="e.g. Full-Stack Developer" />
          </div>
          <div>
            <label className="label" htmlFor="s-exp">Experience Level</label>
            <select id="s-exp" className="input" value={expLevel} onChange={e => setExpLevel(e.target.value)}>
              <option value="student">Student</option>
              <option value="fresh_graduate">Fresh Graduate</option>
              <option value="junior">Junior (0-2 years)</option>
              <option value="mid">Mid-Level (2-5 years)</option>
              <option value="senior">Senior (5+ years)</option>
            </select>
          </div>
        </div>

        <button className="btn btn-primary" onClick={saveProfile} disabled={saving}>
          <Save size={15} /> {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Profile'}
        </button>
      </motion.div>

      {/* Appearance */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card-static" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-5)' }}>
        <div className="flex items-center gap-3" style={{ marginBottom: 'var(--space-5)' }}>
          <Palette size={18} style={{ color: 'var(--accent-cyan)' }} />
          <h3 style={{ fontWeight: 700, fontSize: '1.0625rem' }}>Appearance</h3>
        </div>

        <div className="flex gap-3">
          {(['dark', 'light'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              style={{
                padding: 'var(--space-4) var(--space-6)',
                borderRadius: 'var(--radius-lg)',
                border: `2px solid ${theme === t ? 'var(--accent-primary)' : 'var(--border-primary)'}`,
                background: theme === t ? 'var(--accent-primary-light)' : 'var(--bg-secondary)',
                cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem',
                color: theme === t ? 'var(--accent-primary)' : 'var(--fg-secondary)',
                transition: 'all var(--duration-fast)',
              }}
            >
              {t === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode'}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Integrations */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card-static" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-5)' }}>
        <div className="flex items-center gap-3" style={{ marginBottom: 'var(--space-4)' }}>
          <Database size={18} style={{ color: 'var(--accent-emerald)' }} />
          <h3 style={{ fontWeight: 700, fontSize: '1.0625rem' }}>Integrations</h3>
        </div>

        {[
          { name: 'GitHub OAuth', desc: 'Connect GitHub to verify skills via repository analysis', status: 'not_configured', action: 'Configure in backend .env' },
          { name: 'LLM Provider (OpenAI)', desc: 'Required for AI resume analysis, mock interviews, and roadmap generation', status: 'not_configured', action: 'Set OPENAI_API_KEY in backend' },
          { name: 'Code Sandbox', desc: 'Required for real code execution in challenges', status: 'not_configured', action: 'Deploy sandbox service' },
        ].map(int => (
          <div key={int.name} style={{
            padding: 'var(--space-4)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-primary)',
            marginBottom: 'var(--space-3)',
          }}>
            <div className="flex items-start justify-between">
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: 4 }}>{int.name}</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--fg-tertiary)' }}>{int.desc}</div>
              </div>
              <span style={{
                fontSize: '0.6875rem', padding: '2px 8px', borderRadius: 'var(--radius-full)',
                background: 'var(--accent-rose-light)', color: 'var(--accent-rose)', fontWeight: 600, flexShrink: 0,
              }}>
                Not configured
              </span>
            </div>
            <div style={{ marginTop: 'var(--space-2)', fontSize: '0.75rem', color: 'var(--accent-cyan)', fontFamily: 'monospace' }}>
              → {int.action}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Danger Zone */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{
        padding: 'var(--space-6)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--accent-rose)',
        background: 'var(--accent-rose-light)',
      }}>
        <h3 style={{ fontWeight: 700, fontSize: '1.0625rem', color: 'var(--accent-rose)', marginBottom: 'var(--space-4)' }}>
          Account
        </h3>
        <button className="btn btn-secondary" onClick={logout} style={{ color: 'var(--accent-rose)', borderColor: 'var(--accent-rose)' }}>
          <LogOut size={15} /> Sign Out
        </button>
      </motion.div>

      <AppFooter />
    </div>
  );
}
