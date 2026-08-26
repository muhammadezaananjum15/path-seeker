import { create } from 'zustand';
import apiClient from '../services/apiClient';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'graduate' | 'professional' | 'admin';
  isVerified?: boolean;
  profileImage?: string;
}

export interface AuthProfile {
  educationLevel?: string;
  skills?: string[];
  interests?: string[];
  bio?: string;
  resumeUrl?: string;
  profileImage?: string;
}

interface AuthState {
  user: AuthUser | null;
  profile: AuthProfile | null;
  accessToken: string | null;
  isAuthenticated: boolean;

  // Actions
  setAuth: (user: AuthUser, accessToken: string, refreshToken?: string, profile?: AuthProfile) => void;
  setUser: (user: AuthUser) => void;
  setProfile: (profile: AuthProfile) => void;
  logout: () => void;
  hasRole: (roles: string | string[]) => boolean;
  isAdmin: () => boolean;
}

// ─── Rehydrate from localStorage ─────────────────────────────────────────────
const savedUser = (() => {
  try {
    const raw = localStorage.getItem('pathseeker_user');
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
})();
const savedToken = localStorage.getItem('pathseeker_access_token');

// ─── Store ────────────────────────────────────────────────────────────────────
export const useAuthStore = create<AuthState>((set, get) => ({
  user: savedUser,
  profile: null,
  accessToken: savedToken,
  isAuthenticated: Boolean(savedToken && savedUser),

  setAuth: (user, accessToken, refreshToken, profile) => {
    localStorage.setItem('pathseeker_user', JSON.stringify(user));
    localStorage.setItem('pathseeker_access_token', accessToken);
    if (refreshToken) {
      localStorage.setItem('pathseeker_refresh_token', refreshToken);
    }
    set({ user, accessToken, isAuthenticated: true, profile: profile ?? null });
  },

  setUser: (user) => {
    localStorage.setItem('pathseeker_user', JSON.stringify(user));
    set({ user });
  },

  setProfile: (profile) => {
    set({ profile });
  },

  logout: () => {
    localStorage.removeItem('pathseeker_user');
    localStorage.removeItem('pathseeker_access_token');
    localStorage.removeItem('pathseeker_refresh_token');
    // Optionally notify backend
    apiClient.post('/auth/logout').catch(() => {});
    set({ user: null, profile: null, accessToken: null, isAuthenticated: false });
  },

  hasRole: (roles) => {
    const user = get().user;
    if (!user) return false;
    if (Array.isArray(roles)) return roles.includes(user.role);
    return user.role === roles;
  },

  isAdmin: () => get().user?.role === 'admin',
}));
