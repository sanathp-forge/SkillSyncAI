// ============================================
// SKILLSYNC AI — APPLICATION SHELL
// Dynamic Starfield Galaxy Background + Responsive Shell
// ============================================
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Sidebar from '@/components/common/Sidebar';
import { LoadingSpinner } from '@/components/common/UI';
import GalaxyBackground from '@/components/common/GalaxyBackground';

export default function AppLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg-primary)' }}>
        <LoadingSpinner size={40} />
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      position: 'relative',
      overflowX: 'hidden',
    }}>
      {/* Animated Galaxy Star Background */}
      <GalaxyBackground />

      {/* Main App Container */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        width: '100%',
        minHeight: '100vh',
      }}>
        <Sidebar />
        <main style={{
          flex: 1,
          minWidth: 0,
          overflowY: 'auto',
          position: 'relative',
        }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
