// ============================================
// SKILLSYNC AI — JOB MARKET INTELLIGENCE PAGE
// ============================================
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, AlertTriangle, Database } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  Cell, PieChart, Pie, Legend
} from 'recharts';
import {
  PageHeader, DemoBanner, Badge, LoadingSpinner, EmptyState, AppFooter
} from '@/components/common/UI';
import { marketApi } from '@/services/api';
import { demoMarket } from '@/services/demoData';
import type { MarketOverview } from '@/types';

const COLORS = ['#DFFF00', '#F4FF5E', '#B8FF57', '#42E8E0', '#FFBF47', '#34d399', '#38bdf8', '#fbbf24', '#e2e8f0', '#FF5C5C'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div style={{
        background: 'var(--bg-elevated)', border: '1px solid var(--border-primary)',
        borderRadius: 'var(--radius-md)', padding: 'var(--space-3)',
        boxShadow: 'var(--shadow-lg)',
      }}>
        <p style={{ fontWeight: 700, margin: '0 0 4px', fontSize: '0.8125rem' }}>{label}</p>
        <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--accent-primary)' }}>
          {payload[0].value} job postings
        </p>
      </div>
    );
  }
  return null;
};

export default function MarketPage() {
  const [data, setData] = useState<MarketOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const d = await marketApi.getOverview();
      setData(d);
    } catch {
      setData(demoMarket);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 'var(--space-6)' }}>
        <PageHeader title="Job Market Intelligence" description="Loading market data..." />
        <div className="text-center" style={{ padding: 'var(--space-16)' }}><LoadingSpinner /></div>
      </div>
    );
  }

  const d = data || demoMarket;
  const categories = ['all', ...new Set(d.top_skills.map(s => s.category))];

  const filteredSkills = activeCategory === 'all'
    ? d.top_skills
    : d.top_skills.filter(s => s.category === activeCategory);

  const trendBadge = (trend: string) => {
    if (trend === 'rising') return <span style={{ fontSize: '0.7rem', color: 'var(--accent-emerald)' }}>↑ Rising</span>;
    if (trend === 'declining') return <span style={{ fontSize: '0.7rem', color: 'var(--accent-rose)' }}>↓ Declining</span>;
    return <span style={{ fontSize: '0.7rem', color: 'var(--fg-tertiary)' }}>→ Stable</span>;
  };

  return (
    <div style={{ padding: 'var(--space-6)', maxWidth: 1200 }}>
      {d.is_demo_data && <DemoBanner />}

      {/* Data source disclaimer */}
      <div className="flex items-start gap-2" style={{
        padding: 'var(--space-3) var(--space-4)', background: 'var(--bg-tertiary)',
        borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-5)',
        fontSize: '0.8125rem', color: 'var(--fg-tertiary)',
      }}>
        <Database size={13} style={{ flexShrink: 0, marginTop: 2 }} />
        <span>
          Data source: {d.sources.join(', ')} • Freshness: {d.data_freshness} •
          {d.total_jobs_analyzed} postings analyzed •
          Upload a CSV via API to use real job market data.
        </span>
      </div>

      <PageHeader
        title="Job Market Intelligence"
        description={`Skill demand analysis from ${d.total_jobs_analyzed.toLocaleString()} job postings.`}
      />

      {/* Summary stats */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
        <div className="card-static text-center" style={{ padding: 'var(--space-5)' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
            {d.total_jobs_analyzed.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--fg-tertiary)' }}>Jobs Analyzed</div>
        </div>
        <div className="card-static text-center" style={{ padding: 'var(--space-5)' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
            {d.trending_skills.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--fg-tertiary)' }}>Rising Skills</div>
        </div>
        <div className="card-static text-center" style={{ padding: 'var(--space-5)' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
            {d.top_skills.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--fg-tertiary)' }}>Skills Tracked</div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="card-static" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
        <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-4)' }}>Top In-Demand Skills</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={filteredSkills.slice(0, 10)} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <XAxis dataKey="skill" tick={{ fontSize: 12, fill: 'var(--fg-tertiary)' }} />
            <YAxis tick={{ fontSize: 11, fill: 'var(--fg-tertiary)' }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="demand_count" radius={[4, 4, 0, 0]}>
              {filteredSkills.slice(0, 10).map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Skill Table with category filter */}
      <div className="card-static" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
        <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
          <h3 style={{ fontWeight: 700 }}>Skill Demand Details</h3>
          <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
            {categories.slice(0, 6).map(cat => (
              <button
                key={cat}
                className="btn btn-sm"
                style={{
                  background: activeCategory === cat ? 'var(--gradient-primary)' : 'transparent',
                  color: activeCategory === cat ? 'white' : 'var(--fg-secondary)',
                  border: activeCategory === cat ? 'none' : '1px solid var(--border-primary)',
                }}
                onClick={() => setActiveCategory(cat)}
              >
                {cat === 'all' ? 'All' : cat.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Skill</th>
                <th>Category</th>
                <th>Job Postings</th>
                <th>Trend</th>
              </tr>
            </thead>
            <tbody>
              {filteredSkills.map((skill, i) => (
                <motion.tr
                  key={skill.skill}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <td style={{ fontWeight: 700, color: 'var(--fg-tertiary)' }}>#{i + 1}</td>
                  <td style={{ fontWeight: 600, color: 'var(--fg-primary)' }}>{skill.skill}</td>
                  <td><Badge variant="ghost" size="sm">{skill.category.replace(/_/g, ' ')}</Badge></td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="progress-bar" style={{ width: 80, height: 4 }}>
                        <div className="progress-bar-fill" style={{
                          width: `${Math.round((skill.demand_count / d.top_skills[0].demand_count) * 100)}%`,
                        }} />
                      </div>
                      <span style={{ fontWeight: 600, fontSize: '0.8125rem' }}>{skill.demand_count}</span>
                    </div>
                  </td>
                  <td>{trendBadge(skill.trend)}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Trending Skills */}
      {d.trending_skills.length > 0 && (
        <div className="card-static" style={{ padding: 'var(--space-6)' }}>
          <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-4)' }}>
            <TrendingUp size={18} style={{ display: 'inline', marginRight: 8, color: 'var(--accent-emerald)' }} />
            Rising Skills to Watch
          </h3>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-3)' }}>
            {d.trending_skills.map(skill => (
              <div key={skill.skill} style={{
                padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)',
                background: 'var(--accent-emerald-light)',
                border: '1px solid rgba(52,211,153,0.2)',
              }}>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--fg-primary)', marginBottom: 4 }}>
                  {skill.skill}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--fg-tertiary)', marginBottom: 8 }}>
                  {skill.category.replace(/_/g, ' ')}
                </div>
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--accent-emerald)' }}>
                    {skill.demand_count} postings
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--accent-emerald)' }}>↑ Rising</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <AppFooter />
    </div>
  );
}
