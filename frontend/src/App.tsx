// ============================================
// SKILLSYNC AI — MAIN APP ROUTER
// ============================================
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { ThemeProvider } from '@/hooks/useTheme';
import { AuthProvider } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/common/UI';
import AppLayout from '@/layouts/AppLayout';

// Lazy load pages for better performance
const LandingPage = lazy(() => import('@/pages/LandingPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const ResumeAnalyzerPage = lazy(() => import('@/pages/ResumeAnalyzerPage'));
const JobMatchingPage = lazy(() => import('@/pages/JobMatchingPage'));
const SkillGapPage = lazy(() => import('@/pages/SkillGapPage'));
const EvidencePage = lazy(() => import('@/pages/EvidencePage'));
const RoadmapPage = lazy(() => import('@/pages/RoadmapPage'));
const ChallengesPage = lazy(() => import('@/pages/ChallengesPage'));
const InterviewsPage = lazy(() => import('@/pages/InterviewsPage'));
const MarketPage = lazy(() => import('@/pages/MarketPage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));

function PageLoader() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 0' }}>
      <LoadingSpinner size={32} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />

              {/* Protected App Routes */}
              <Route path="/app" element={<AppLayout />}>
                <Route index element={<DashboardPage />} />
                <Route path="resume" element={<ResumeAnalyzerPage />} />
                <Route path="matching" element={<JobMatchingPage />} />
                <Route path="skill-gap" element={<SkillGapPage />} />
                <Route path="gap" element={<SkillGapPage />} />
                <Route path="evidence" element={<EvidencePage />} />
                <Route path="roadmap" element={<RoadmapPage />} />
                <Route path="challenges" element={<ChallengesPage />} />
                <Route path="interviews" element={<InterviewsPage />} />
                <Route path="market" element={<MarketPage />} />
                <Route path="progress" element={<DashboardPage />} />
                <Route path="reports" element={<DashboardPage />} />
                <Route path="resumes" element={<ResumeAnalyzerPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
