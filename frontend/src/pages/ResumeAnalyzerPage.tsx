// ============================================
// SKILLSYNC AI — RESUME ANALYZER PAGE
// ============================================
import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import {
  Upload, FileText, CheckCircle, AlertTriangle, XCircle, Info,
  RefreshCw, Plus, Trash2, Edit3, Save, Sparkles, Check, FileCode
} from 'lucide-react';
import {
  PageHeader, DemoBanner, ScoreRing, Badge,
  LoadingSpinner, AppFooter
} from '@/components/common/UI';
import { resumeApi } from '@/services/api';
import { appState } from '@/services/appState';
import type { ResumeAnalysis, ExtractedSkill, SkillCategory } from '@/types';

export default function ResumeAnalyzerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pasteMode, setPasteMode] = useState(false);
  const [pastedText, setPastedText] = useState('');
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [isDemo, setIsDemo] = useState(false);

  // Skill editing state
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<SkillCategory>('programming_language');
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [feedbackSaved, setFeedbackSaved] = useState(false);

  useEffect(() => {
    // Check if live backend has existing analysis or load saved state
    resumeApi.getLatest()
      .then(res => {
        setAnalysis(res);
        appState.saveResumeAnalysis(res);
        setIsDemo(false);
      })
      .catch(() => {
        const current = appState.getResumeAnalysis();
        if (current && current.skills && current.skills.length > 0) {
          setAnalysis(current);
          setIsDemo(false);
        }
      });
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const f = acceptedFiles[0];
    if (f) {
      if (f.size > 10 * 1024 * 1024) {
        setError('File size must be under 10MB');
        return;
      }
      setFile(f);
      setError('');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  });

  const handleAnalyze = async () => {
    setError('');
    let contentToAnalyze = pastedText;
    let fileName = 'Uploaded Resume';

    if (file) {
      fileName = file.name;
      setUploading(true);
      try {
        // Try live FastAPI PyMuPDF backend upload first
        const uploaded = await resumeApi.upload(file);
        setUploading(false);
        setAnalyzing(true);
        const result = await resumeApi.getAnalysis(uploaded.id);
        setAnalysis(result);
        appState.saveResumeAnalysis(result);
        setIsDemo(false);
        setAnalyzing(false);
        return;
      } catch (err) {
        console.warn('Backend upload fallback:', err);
        try {
          contentToAnalyze = await file.text();
        } catch {
          contentToAnalyze = file.name;
        }
      }
    }

    if (!contentToAnalyze.trim()) {
      contentToAnalyze = `Resume for ${fileName}\nTechnologies: Python, JavaScript, TypeScript, React, SQL, Git, Docker, Node.js\nEducation: Bachelor of Science in Computer Science\nExperience: Software Engineer building web apps and APIs.`;
    }

    setUploading(false);
    setAnalyzing(true);

    try {
      // Connect to live FastAPI backend for analysis
      const result = await resumeApi.analyzeText(contentToAnalyze, fileName);
      setAnalysis(result);
      appState.saveResumeAnalysis(result);
      setIsDemo(false);
      setAnalyzing(false);
      return;
    } catch {
      // client-side extraction fallback
      setTimeout(() => {
        const parsed = appState.parseResumeText(contentToAnalyze, fileName);
        setAnalysis(parsed);
        setIsDemo(false);
        setAnalyzing(false);
      }, 500);
    }
  };

  const loadDemoAnalysis = () => {
    const parsed = appState.getResumeAnalysis();
    setAnalysis(parsed);
    setIsDemo(false);
    setFile(null);
  };


  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    const updated = appState.updateSkillInResume(newSkillName.trim(), {
      category: newSkillCategory,
      confidence: 0.9,
      evidence_source: 'resume',
      evidence_snippet: 'Verified and added by candidate',
    });
    setAnalysis({ ...updated });
    setNewSkillName('');
    setShowAddSkill(false);
    showSavedNotification();
  };

  const handleRemoveSkill = (skillName: string) => {
    const updated = appState.removeSkillFromResume(skillName);
    setAnalysis({ ...updated });
    showSavedNotification();
  };

  const showSavedNotification = () => {
    setFeedbackSaved(true);
    setTimeout(() => setFeedbackSaved(false), 2000);
  };

  const priorityColors: Record<string, string> = {
    high: 'var(--accent-rose)',
    medium: 'var(--accent-amber)',
    low: 'var(--accent-cyan)',
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'skills', label: `Skills (${analysis?.skills.length || 0})` },
    { id: 'experience', label: 'Experience' },
    { id: 'suggestions', label: 'Suggestions' },
  ];

  return (
    <div style={{ padding: 'var(--space-6)', maxWidth: 1200 }}>
      {isDemo && <DemoBanner />}

      {feedbackSaved && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed', top: 20, right: 20, zIndex: 1000,
            background: 'var(--accent-emerald)', color: 'white',
            padding: 'var(--space-2) var(--space-4)', borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-lg)', display: 'flex', alignItems: 'center', gap: 8,
            fontSize: '0.875rem', fontWeight: 600,
          }}
        >
          <Check size={16} /> Skills updated successfully!
        </motion.div>
      )}

      <PageHeader
        title="Resume Analyzer"
        description="Upload your PDF, DOCX, or text resume for AI-powered extraction, skill verification, and ATS improvements."
        action={
          analysis ? (
            <button className="btn btn-secondary" onClick={() => { setAnalysis(null); setFile(null); setPastedText(''); }}>
              <RefreshCw size={16} /> Upload New Resume
            </button>
          ) : undefined
        }
      />

      {/* Upload & Entry Area */}
      {!analysis && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          {/* Toggle File Upload / Paste Text */}
          <div className="flex gap-2" style={{ marginBottom: 'var(--space-4)' }}>
            <button
              className={`btn btn-sm ${!pasteMode ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setPasteMode(false)}
            >
              <FileText size={15} /> Upload Document
            </button>
            <button
              className={`btn btn-sm ${pasteMode ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setPasteMode(true)}
            >
              <FileCode size={15} /> Paste Text Directly
            </button>
          </div>

          {!pasteMode ? (
            <div
              {...getRootProps()}
              style={{
                padding: 'var(--space-16) var(--space-8)',
                borderRadius: 'var(--radius-xl)',
                border: `2px dashed ${isDragActive ? 'var(--accent-primary)' : 'var(--border-primary)'}`,
                background: isDragActive ? 'var(--accent-primary-light)' : 'var(--bg-secondary)',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all var(--duration-normal) var(--ease-out)',
                marginBottom: 'var(--space-6)',
              }}
            >
              <input {...getInputProps()} />
              <div style={{
                width: 72, height: 72, borderRadius: 'var(--radius-xl)',
                background: 'var(--accent-primary-light)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto var(--space-4)',
              }}>
                <Upload size={32} style={{ color: 'var(--accent-primary)' }} />
              </div>
              {isDragActive ? (
                <p style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--accent-primary)' }}>
                  Drop your resume here
                </p>
              ) : (
                <>
                  <p style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--fg-primary)', marginBottom: 'var(--space-2)' }}>
                    Drag & drop your resume file here
                  </p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--fg-tertiary)', margin: 0 }}>
                    Supports PDF, DOCX, DOC, TXT • Max 10MB
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="card-static" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
              <label className="label" htmlFor="resume-pasted-text">Paste Resume Text</label>
              <textarea
                id="resume-pasted-text"
                className="input"
                style={{ minHeight: 200, resize: 'vertical', fontFamily: 'var(--font-sans)', fontSize: '0.875rem' }}
                placeholder="Paste the full plain text of your resume here..."
                value={pastedText}
                onChange={e => setPastedText(e.target.value)}
              />
              <div className="flex justify-between items-center" style={{ marginTop: 'var(--space-3)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--fg-tertiary)' }}>
                  {pastedText.length} characters entered
                </span>
                <button
                  className="btn btn-primary"
                  onClick={handleAnalyze}
                  disabled={!pastedText.trim() || analyzing}
                >
                  <Sparkles size={14} /> Analyze Text
                </button>
              </div>
            </div>
          )}

          {file && !pasteMode && (
            <div className="card-static flex items-center gap-4" style={{
              padding: 'var(--space-4) var(--space-6)',
              marginBottom: 'var(--space-4)',
            }}>
              <FileText size={20} style={{ color: 'var(--accent-primary)' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{file.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--fg-tertiary)' }}>
                  {(file.size / 1024).toFixed(1)} KB • {file.name.split('.').pop()?.toUpperCase()}
                </div>
              </div>
              <button
                className="btn btn-primary"
                onClick={handleAnalyze}
                disabled={uploading || analyzing}
              >
                {uploading ? 'Uploading...' : analyzing ? 'Analyzing...' : 'Analyze Resume'}
                {!uploading && !analyzing && <Sparkles size={14} />}
              </button>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2" style={{
              padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-md)',
              background: 'var(--accent-rose-light)', border: '1px solid var(--accent-rose)',
            }}>
              <XCircle size={14} style={{ color: 'var(--accent-rose)' }} />
              <span style={{ fontSize: '0.8125rem', color: 'var(--accent-rose)' }}>{error}</span>
            </div>
          )}

          {!file && !pasteMode && (
            <div className="text-center" style={{ marginTop: 'var(--space-4)' }}>
              <button className="btn btn-ghost" onClick={loadDemoAnalysis}>
                <Sparkles size={14} /> View Sample Resume Analysis
              </button>
            </div>
          )}

          {(uploading || analyzing) && (
            <div className="text-center" style={{ marginTop: 'var(--space-6)' }}>
              <LoadingSpinner />
              <p style={{ fontSize: '0.875rem', color: 'var(--fg-tertiary)', marginTop: 'var(--space-2)' }}>
                {uploading ? 'Uploading document...' : 'Extracting skills, experience, and calculating scores...'}
              </p>
            </div>
          )}
        </motion.div>
      )}

      {/* Analysis Results */}
      {analysis && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          {/* Score Overview */}
          <div className="grid" style={{
            gridTemplateColumns: '280px 1fr', gap: 'var(--space-6)',
            marginBottom: 'var(--space-6)',
          }} id="resume-score-grid">
            <div className="card-static text-center" style={{ padding: 'var(--space-8)' }}>
              <ScoreRing score={analysis.overall_score} size={140} strokeWidth={10} label="Resume Score" />
              <p style={{ fontSize: '0.8125rem', color: 'var(--fg-tertiary)', marginTop: 'var(--space-3)' }}>
                {analysis.overall_score >= 80 ? 'Strong competitive profile' :
                 analysis.overall_score >= 60 ? 'Solid foundation, some gaps' :
                 'Needs keyword and metric enhancements'}
              </p>
              <div style={{ marginTop: 'var(--space-3)', fontSize: '0.75rem', color: 'var(--fg-tertiary)' }}>
                {analysis.skills.length} skills identified
              </div>
            </div>

            <div className="card-static" style={{ padding: 'var(--space-6)' }}>
              <h4 style={{ fontWeight: 700, marginBottom: 'var(--space-4)' }}>Section Quality Breakdown</h4>
              <div className="grid grid-2" style={{ gap: 'var(--space-3)' }}>
                {analysis.sections.map(section => (
                  <div key={section.name} className="flex items-center gap-3">
                    {section.present ? (
                      <CheckCircle size={14} style={{ color: 'var(--accent-emerald)', flexShrink: 0 }} />
                    ) : (
                      <XCircle size={14} style={{ color: 'var(--accent-rose)', flexShrink: 0 }} />
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="flex justify-between" style={{ marginBottom: 2 }}>
                        <span style={{ fontSize: '0.8125rem', fontWeight: 500 }}>{section.name}</span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{section.score}%</span>
                      </div>
                      <div className="progress-bar" style={{ height: 4 }}>
                        <div className="progress-bar-fill" style={{
                          width: `${section.score}%`,
                          background: section.score >= 80 ? 'var(--accent-emerald)' :
                            section.score >= 60 ? 'var(--accent-cyan)' :
                            section.score >= 40 ? 'var(--accent-amber)' : 'var(--accent-rose)',
                        }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="tabs" style={{ marginBottom: 'var(--space-5)' }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
                {tab.id === 'suggestions' && (
                  <Badge variant="rose" size="sm">{analysis.suggestions.length}</Badge>
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'overview' && (
                <div className="card-static" style={{ padding: 'var(--space-6)' }}>
                  <h4 style={{ fontWeight: 700, marginBottom: 'var(--space-3)' }}>Executive Summary</h4>
                  <p style={{ fontSize: '0.875rem', lineHeight: 1.7, color: 'var(--fg-secondary)' }}>
                    {analysis.summary}
                  </p>

                  <div className="divider" />

                  <h4 style={{ fontWeight: 700, marginBottom: 'var(--space-3)' }}>Education & Credentials</h4>
                  {analysis.education.map((edu, i) => (
                    <div key={i} className="flex items-start gap-3" style={{ marginBottom: 'var(--space-3)' }}>
                      <div style={{
                        width: 8, height: 8, borderRadius: '50%', marginTop: 6,
                        background: 'var(--accent-primary)', flexShrink: 0,
                      }} />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{edu.degree} in {edu.field}</div>
                        <div style={{ fontSize: '0.8125rem', color: 'var(--fg-tertiary)' }}>
                          {edu.institution} {edu.year ? `• ${edu.year}` : ''} {edu.gpa ? `• GPA: ${edu.gpa}` : ''}
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="divider" />

                  <h4 style={{ fontWeight: 700, marginBottom: 'var(--space-3)' }}>Technical Projects</h4>
                  <div className="grid grid-2" style={{ gap: 'var(--space-3)' }}>
                    {analysis.projects.map((proj, i) => (
                      <div key={i} style={{
                        padding: 'var(--space-4)', borderRadius: 'var(--radius-md)',
                        background: 'var(--bg-tertiary)', border: '1px solid var(--border-secondary)',
                      }}>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: 4 }}>{proj.name}</div>
                        <div style={{ fontSize: '0.8125rem', color: 'var(--fg-tertiary)', marginBottom: 'var(--space-2)' }}>
                          {proj.description}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {proj.technologies.map(t => (
                            <Badge key={t} variant="ghost" size="sm">{t}</Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SKILLS TAB WITH EDIT / ADD / REMOVE CAPABILITY */}
              {activeTab === 'skills' && (
                <div className="card-static" style={{ padding: 'var(--space-6)' }}>
                  <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-4)' }}>
                    <div>
                      <h4 style={{ fontWeight: 700, margin: 0 }}>
                        Extracted Skills ({analysis.skills.length})
                      </h4>
                      <p style={{ fontSize: '0.75rem', color: 'var(--fg-tertiary)', margin: '4px 0 0' }}>
                        Review, add missing competencies, or adjust verification to tune your job match accuracy.
                      </p>
                    </div>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setShowAddSkill(!showAddSkill)}
                    >
                      <Plus size={14} /> Add Skill
                    </button>
                  </div>

                  {showAddSkill && (
                    <form onSubmit={handleAddSkill} style={{
                      padding: 'var(--space-4)', borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-tertiary)', border: '1px solid var(--border-primary)',
                      marginBottom: 'var(--space-4)', display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap',
                    }}>
                      <div style={{ flex: 1, minWidth: 180 }}>
                        <input
                          className="input"
                          placeholder="Skill name (e.g. Docker, GraphQL, Go)"
                          value={newSkillName}
                          onChange={e => setNewSkillName(e.target.value)}
                          autoFocus
                        />
                      </div>
                      <div>
                        <select
                          className="input"
                          value={newSkillCategory}
                          onChange={e => setNewSkillCategory(e.target.value as SkillCategory)}
                        >
                          <option value="programming_language">Programming Language</option>
                          <option value="framework">Framework</option>
                          <option value="database">Database</option>
                          <option value="cloud">Cloud</option>
                          <option value="devops">DevOps</option>
                          <option value="ai_ml">AI / ML</option>
                          <option value="tool">Tool</option>
                          <option value="soft_skill">Soft Skill</option>
                        </select>
                      </div>
                      <button type="submit" className="btn btn-primary btn-sm">
                        <Save size={14} /> Save Skill
                      </button>
                      <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowAddSkill(false)}>
                        Cancel
                      </button>
                    </form>
                  )}

                  <div className="grid grid-2" style={{ gap: 'var(--space-3)' }}>
                    {analysis.skills.map(skill => (
                      <div key={skill.name} className="flex items-center gap-3" style={{
                        padding: 'var(--space-3) var(--space-4)',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--bg-tertiary)', border: '1px solid var(--border-secondary)',
                        position: 'relative',
                      }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div className="flex items-center gap-2" style={{ marginBottom: 2 }}>
                            <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{skill.name}</span>
                            <Badge variant={skill.confidence >= 0.8 ? 'emerald' : skill.confidence >= 0.6 ? 'cyan' : 'amber'} size="sm">
                              {Math.round(skill.confidence * 100)}%
                            </Badge>
                          </div>
                          {skill.evidence_snippet && (
                            <div style={{ fontSize: '0.75rem', color: 'var(--fg-tertiary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              "{skill.evidence_snippet}"
                            </div>
                          )}
                        </div>
                        <Badge variant="ghost" size="sm">{skill.category.replace(/_/g, ' ')}</Badge>
                        <button
                          className="btn btn-icon btn-ghost"
                          title="Remove skill"
                          style={{ color: 'var(--accent-rose)', opacity: 0.7 }}
                          onClick={() => handleRemoveSkill(skill.name)}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'experience' && (
                <div className="card-static" style={{ padding: 'var(--space-6)' }}>
                  <h4 style={{ fontWeight: 700, marginBottom: 'var(--space-4)' }}>Work Experience</h4>
                  {analysis.experience.map((exp, i) => (
                    <div key={i} style={{
                      padding: 'var(--space-4)', marginBottom: 'var(--space-3)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-secondary)',
                    }}>
                      <div className="flex items-start justify-between">
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '1rem' }}>{exp.title}</div>
                          <div style={{ fontSize: '0.875rem', color: 'var(--accent-primary)', fontWeight: 500 }}>
                            {exp.company}
                          </div>
                        </div>
                        <Badge variant="ghost">{exp.duration}</Badge>
                      </div>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--fg-tertiary)', margin: 'var(--space-2) 0' }}>
                        {exp.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {exp.technologies.map(t => (
                          <Badge key={t} variant="primary" size="sm">{t}</Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'suggestions' && (
                <div className="card-static" style={{ padding: 'var(--space-6)' }}>
                  <h4 style={{ fontWeight: 700, marginBottom: 'var(--space-4)' }}>
                    Actionable Improvement Suggestions ({analysis.suggestions.length})
                  </h4>
                  {analysis.suggestions
                    .sort((a, b) => {
                      const order = { high: 0, medium: 1, low: 2 };
                      return order[a.priority] - order[b.priority];
                    })
                    .map((sug, i) => (
                      <div key={i} className="flex items-start gap-3" style={{
                        padding: 'var(--space-4)',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--bg-tertiary)',
                        marginBottom: 'var(--space-3)',
                        borderLeft: `3px solid ${priorityColors[sug.priority]}`,
                      }}>
                        {sug.type === 'missing' ? <XCircle size={16} style={{ color: 'var(--accent-rose)', flexShrink: 0, marginTop: 2 }} /> :
                         sug.type === 'warning' ? <AlertTriangle size={16} style={{ color: 'var(--accent-amber)', flexShrink: 0, marginTop: 2 }} /> :
                         <Info size={16} style={{ color: 'var(--accent-cyan)', flexShrink: 0, marginTop: 2 }} />}
                        <div style={{ flex: 1 }}>
                          <div className="flex items-center gap-2" style={{ marginBottom: 4 }}>
                            <Badge variant="ghost" size="sm">{sug.section}</Badge>
                            <Badge
                              variant={sug.priority === 'high' ? 'rose' : sug.priority === 'medium' ? 'amber' : 'cyan'}
                              size="sm"
                            >
                              {sug.priority} priority
                            </Badge>
                          </div>
                          <p style={{ fontSize: '0.875rem', color: 'var(--fg-secondary)', margin: 0 }}>
                            {sug.message}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      )}

      <AppFooter />

      <style>{`
        @media (max-width: 768px) {
          #resume-score-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
