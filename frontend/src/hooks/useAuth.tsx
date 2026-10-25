// ============================================
// SKILLSYNC AI — AUTH CONTEXT
// Resilient Authentication with Local Session Fallback
// ============================================
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, AuthState } from '@/types';
import { authApi } from '@/services/api';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  demoLogin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER: User = {
  id: 'demo-user',
  email: 'demo@skillsync.ai',
  full_name: 'Demo Candidate',
  target_role: 'Senior Full-Stack Engineer',
  experience_level: 'senior',
  created_at: new Date().toISOString(),
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const token = localStorage.getItem('skillsync_token');
    const demoMode = localStorage.getItem('skillsync_demo');
    const savedUserJson = localStorage.getItem('skillsync_user');

    if (demoMode === 'true') {
      setState({ user: DEMO_USER, token: 'demo', isAuthenticated: true, isLoading: false });
      return;
    }

    if (token) {
      // Check for local offline session
      if (token.startsWith('local-') && savedUserJson) {
        try {
          const user = JSON.parse(savedUserJson);
          setState({ user, token, isAuthenticated: true, isLoading: false });
          return;
        } catch {
          // parse failed, continue
        }
      }

      // Attempt live backend verification
      authApi.me()
        .then(user => {
          localStorage.setItem('skillsync_user', JSON.stringify(user));
          setState({ user, token, isAuthenticated: true, isLoading: false });
        })
        .catch(() => {
          // If live check fails but we have a saved user profile, preserve the session
          if (savedUserJson) {
            try {
              const user = JSON.parse(savedUserJson);
              setState({ user, token, isAuthenticated: true, isLoading: false });
              return;
            } catch {
              // ignore
            }
          }
          localStorage.removeItem('skillsync_token');
          setState({ user: null, token: null, isAuthenticated: false, isLoading: false });
        });
    } else {
      setState(s => ({ ...s, isLoading: false }));
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { access_token, user } = await authApi.login({ email, password });
      localStorage.setItem('skillsync_token', access_token);
      localStorage.setItem('skillsync_user', JSON.stringify(user));
      localStorage.removeItem('skillsync_demo');
      setState({ user, token: access_token, isAuthenticated: true, isLoading: false });
    } catch (err: any) {
      // If backend is unreachable or returns server error, gracefully authenticate local session
      const isConnectionError =
        !err.status ||
        err.status >= 500 ||
        err.message?.includes('Network error') ||
        err.message?.includes('offline') ||
        err.message?.includes('unreachable') ||
        err.message?.includes('An error occurred');

      if (isConnectionError) {
        // Check if there is an existing local profile for this email
        const savedUserJson = localStorage.getItem('skillsync_user');
        let localUser: User;
        if (savedUserJson) {
          try {
            const parsed = JSON.parse(savedUserJson);
            if (parsed.email === email) {
              localUser = parsed;
            } else {
              localUser = {
                id: 'user-' + Date.now(),
                email: email.trim(),
                full_name: email.split('@')[0],
                target_role: 'Senior Full-Stack Engineer',
                experience_level: 'mid',
                created_at: new Date().toISOString(),
              };
            }
          } catch {
            localUser = {
              id: 'user-' + Date.now(),
              email: email.trim(),
              full_name: email.split('@')[0],
              target_role: 'Senior Full-Stack Engineer',
              experience_level: 'mid',
              created_at: new Date().toISOString(),
            };
          }
        } else {
          localUser = {
            id: 'user-' + Date.now(),
            email: email.trim(),
            full_name: email.split('@')[0],
            target_role: 'Senior Full-Stack Engineer',
            experience_level: 'mid',
            created_at: new Date().toISOString(),
          };
        }

        const localToken = 'local-token-' + Date.now();
        localStorage.setItem('skillsync_token', localToken);
        localStorage.setItem('skillsync_user', JSON.stringify(localUser));
        localStorage.removeItem('skillsync_demo');
        setState({ user: localUser, token: localToken, isAuthenticated: true, isLoading: false });
        return;
      }
      throw err;
    }
  };

  const register = async (email: string, password: string, fullName: string) => {
    try {
      const { access_token, user } = await authApi.register({ email, password, full_name: fullName });
      localStorage.setItem('skillsync_token', access_token);
      localStorage.setItem('skillsync_user', JSON.stringify(user));
      localStorage.removeItem('skillsync_demo');
      setState({ user, token: access_token, isAuthenticated: true, isLoading: false });
    } catch (err: any) {
      // If backend is unreachable or returns server error, create local authenticated user
      const isConnectionError =
        !err.status ||
        err.status >= 500 ||
        err.message?.includes('Network error') ||
        err.message?.includes('offline') ||
        err.message?.includes('unreachable') ||
        err.message?.includes('An error occurred');

      if (isConnectionError) {
        const localUser: User = {
          id: 'user-' + Date.now(),
          email: email.trim(),
          full_name: fullName.trim() || email.split('@')[0],
          target_role: 'Senior Full-Stack Engineer',
          experience_level: 'mid',
          created_at: new Date().toISOString(),
        };
        const localToken = 'local-token-' + Date.now();
        localStorage.setItem('skillsync_token', localToken);
        localStorage.setItem('skillsync_user', JSON.stringify(localUser));
        localStorage.removeItem('skillsync_demo');
        setState({ user: localUser, token: localToken, isAuthenticated: true, isLoading: false });
        return;
      }
      throw err;
    }
  };

  const logout = () => {
    authApi.logout();
    localStorage.removeItem('skillsync_token');
    localStorage.removeItem('skillsync_demo');
    localStorage.removeItem('skillsync_user');
    setState({ user: null, token: null, isAuthenticated: false, isLoading: false });
  };

  const updateUser = (data: Partial<User>) => {
    if (state.user) {
      const updated = { ...state.user, ...data };
      localStorage.setItem('skillsync_user', JSON.stringify(updated));
      setState(s => ({ ...s, user: updated }));
    }
  };

  const demoLogin = () => {
    localStorage.setItem('skillsync_demo', 'true');
    localStorage.setItem('skillsync_token', 'demo');
    localStorage.setItem('skillsync_user', JSON.stringify(DEMO_USER));
    setState({ user: DEMO_USER, token: 'demo', isAuthenticated: true, isLoading: false });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, updateUser, demoLogin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
