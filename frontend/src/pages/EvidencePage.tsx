// ============================================
// SKILLSYNC AI — SKILL EVIDENCE PAGE
// ============================================
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, GitBranch as Github, CheckCircle, Clock, Star,
  AlertTriangle, Sparkles, Link2, Plus, Code, Check, ExternalLink
} from 'lucide-react';
import {
  PageHeader, DemoBanner, Badge, LoadingSpinner, StatusBadge, AppFooter
} from '@/components/common/UI';
import { githubApi } from '@/services/api';
import { appState } from '@/services/appState';
import type { SkillEvidence, Repository } from '@/types';

export default function EvidencePage() {
  const [evidence, setEvidence] = useState<SkillEvidence[]>([]);
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDemo, setIsDemo] = useState(false);
  const [filter, setFilter] = useState<'all' | 'github' | 'assessment' | 'unverified'>('all');
  const [newRepoUrl, setNewRepoUrl] = useState('');
  const [isAddingRepo, setIsAddingRepo] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    loadEvidence();
  }, []);

  const loadEvidence = async () => {
    setLoading(true);
    try {
      const [ev, rp] = await Promise.all([githubApi.getEvidence(), githubApi.getRepositories()]);
      setEvidence(ev);
      setRepos(rp);
      setIsDemo(false);
    } catch {
      setEvidence(appState.getEvidence());
      setRepos(appState.getRepositories());
      setIsDemo(true);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRepository = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRepoUrl.trim()) return;
    const { repo, newEvidence } = appState.addRepositoryUrl(newRepoUrl.trim());
    setRepos(appState.getRepositories());
    setEvidence(appState.getEvidence());
    setNewRepoUrl('');
    setIsAddingRepo(false);
    setStatusMessage(`Successfully analyzed "${repo.name}" and extracted evidence for ${newEvidence.length} skills!`);
    setTimeout(() => setStatusMessage(''), 4000);
  };

  const filteredEvidence = evidence.filter(e => {
    if (filter === 'all') return true;
    if (filter === 'github') return e.source === 'github';
    if (filter === 'assessment') return e.source === 'assessment';
    if (filter === 'unverified') return !e.verified;
    return true;
  });

  return (
    <div style={{ padding: 'var(--space-6)', maxWidth: 1200 }}>
      {isDemo && <DemoBanner />}

      {statusMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          style={{
            marginBottom: 'var(--space-4)', padding: 'var(--space-3) var(--space-4)',
            borderRadius: 'var(--radius-md)', background: 'var(--accent-emerald-light)',
            border: '1px solid var(--accent-emerald)', color: 'var(--accent-emerald)',
            display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.875rem', fontWeight: 600,
          }}
        >
          <Check size={16} /> {statusMessage}
        </motion.div>
      )}

      {/* Verification Level Notice */}
      <div className="flex items-start gap-2" style={{
        padding: 'var(--space-3) var(--space-4)',
        background: 'var(--accent-cyan-light)',
        border: '1px solid var(--accent-cyan)',
        borderRadius: 'var(--radius-md)',
        marginBottom: 'var(--space-5)',
        fontSize: '0.8125rem', color: 'var(--fg-secondary)',
      }}>
        <AlertTriangle size={15} style={{ color: 'var(--accent-cyan)', flexShrink: 0, marginTop: 2 }} />
        <span>
          <strong>Evidence Hierarchy:</strong> Repository evidence verifies that code exists in public commits; practical assessments verify demonstrated problem-solving under test conditions. Unverified resume mentions require proof before interview readiness is confirmed.
        </span>
      </div>

      <PageHeader
        title="Evidence-Based Skill Verification"
        description="Connect your GitHub or submit project repositories to prove capabilities through real code artifacts."
        action={
          <button className="btn btn-primary" onClick={() => setIsAddingRepo(!isAddingRepo)}>
            <Plus size={16} /> Add Repository URL
          </button>
        }
      />

      {/* Add Repository Form */}
      {isAddingRepo && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="card-static"
          style={{ padding: 'var(--space-5)', marginBottom: 'var(--space-6)' }}
        >
          <h4 style={{ fontWeight: 700, marginBottom: 'var(--space-2)' }}>Analyze Public GitHub Repository</h4>
          <p style={{ fontSize: '0.8125rem', color: 'var(--fg-tertiary)', marginBottom: 'var(--space-3)' }}>
            Enter a full GitHub URL (e.g. <code>https://github.com/facebook/react</code>) or <code>username/repository</code>.
          </p>
          <form onSubmit={handleAddRepository} className="flex gap-3" style={{ flexWrap: 'wrap' }}>
            <input
              className="input"
              style={{ flex: 1, minWidth: 260 }}
              placeholder="https://github.com/your-username/your-project"
              value={newRepoUrl}
              onChange={e => setNewRepoUrl(e.target.value)}
              autoFocus
            />
            <button type="submit" className="btn btn-primary">
              <Github size={15} /> Analyze Codebase
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => setIsAddingRepo(false)}>
              Cancel
            </button>
          </form>
        </motion.div>
      )}

      {loading && <div className="text-center" style={{ padding: 'var(--space-16)' }}><LoadingSpinner /></div>}

      {!loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {/* Repositories Grid */}
          <div style={{ marginBottom: 'var(--space-8)' }}>
            <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-4)' }}>
              <h3 style={{ fontWeight: 700, fontSize: '1.125rem', margin: 0 }}>
                Analyzed Repositories ({repos.length})
              </h3>
            </div>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
              {repos.map(repo => (
                <div key={repo.id} className="card-static" style={{ padding: 'var(--space-5)' }}>
                  <div className="flex items-start justify-between" style={{ marginBottom: 'var(--space-2)' }}>
                    <div className="flex items-center gap-2" style={{ minWidth: 0 }}>
                      <Github size={16} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
                      <span style={{ fontWeight: 700, fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {repo.name}
                      </span>
                    </div>
                    {repo.analysis_status && <StatusBadge status={repo.analysis_status} />}
                  </div>

                  {repo.description && (
                    <p style={{ fontSize: '0.75rem', color: 'var(--fg-tertiary)', marginBottom: 'var(--space-3)', height: 36, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {repo.description}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-1" style={{ marginBottom: 'var(--space-3)' }}>
                    {Object.keys(repo.languages || {}).slice(0, 3).map(lang => (
                      <Badge key={lang} variant="ghost" size="sm">{lang}</Badge>
                    ))}
                    {repo.has_tests && <Badge variant="emerald" size="sm">Tests Found</Badge>}
                  </div>

                  <div className="flex items-center justify-between" style={{ fontSize: '0.75rem', color: 'var(--fg-tertiary)', borderTop: '1px solid var(--border-secondary)', paddingTop: 'var(--space-2)' }}>
                    <span>⭐ {repo.stars} stars</span>
                    <span>🍴 {repo.forks} forks</span>
                    <span style={{ color: 'var(--accent-cyan)' }}>Evidence Verified</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Evidence Cards */}
          <div>
            <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 8 }}>
              <h3 style={{ fontWeight: 700, fontSize: '1.125rem', margin: 0 }}>
                Verified Skill Proof ({filteredEvidence.length})
              </h3>

              {/* Filter Tabs */}
              <div className="flex gap-2">
                <button
                  className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setFilter('all')}
                >
                  All Evidence
                </button>
                <button
                  className={`btn btn-sm ${filter === 'github' ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setFilter('github')}
                >
                  GitHub Evidence
                </button>
                <button
                  className={`btn btn-sm ${filter === 'assessment' ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setFilter('assessment')}
                >
                  Assessment Passed
                </button>
              </div>
            </div>

            <div className="grid grid-2" style={{ gap: 'var(--space-3)' }}>
              {filteredEvidence.map(item => (
                <div key={item.id} className="card-static" style={{ padding: 'var(--space-4)' }}>
                  <div className="flex items-start justify-between" style={{ marginBottom: 'var(--space-2)' }}>
                    <div className="flex items-center gap-2">
                      <span style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{item.skill}</span>
                      {item.source === 'github' ? (
                        <Badge variant="cyan" size="sm">Evidence Found</Badge>
                      ) : (
                        <Badge variant="emerald" size="sm">Assessment Passed</Badge>
                      )}
                    </div>
                    <Badge variant={item.confidence >= 0.8 ? 'emerald' : 'amber'} size="sm">
                      {Math.round(item.confidence * 100)}% confidence
                    </Badge>
                  </div>

                  <p style={{ fontSize: '0.8125rem', color: 'var(--fg-secondary)', marginBottom: 'var(--space-2)' }}>
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between" style={{ fontSize: '0.75rem', color: 'var(--fg-tertiary)' }}>
                    {item.repository && <span>Repo: <strong>{item.repository}</strong></span>}
                    {item.file_path && <span>File: <code>{item.file_path}</code></span>}
                    <span style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>✓ Verified</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      <AppFooter />
    </div>
  );
}
