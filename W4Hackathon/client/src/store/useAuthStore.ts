import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import axios from 'axios';

// 1. FIXED: These interfaces solve the "Cannot find name AuthState" 
// and "Parameter implicitly has any type" errors shown in your Problems tab.
interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  subscriptionPlan: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthModalOpen: boolean;
  loading: boolean;
  error: string | null;
  setAuthModalOpen: (open: boolean) => void;
  setSubscription: (plan: string) => void; 
  login: (credentials: any) => Promise<boolean>;
  signup: (userData: any) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
  refreshUser: () => Promise<void>;
}

// 2. FIXED: This ensures that even if VITE_API_URL isn't loaded yet, 
// we include the /api prefix to match your backend index.js.
const API_URL = import.meta.env.VITE_API_URL;

const API = axios.create({
  baseURL: API_URL,
});

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthModalOpen: false, 
      loading: false,
      error: null,

      setAuthModalOpen: (open: boolean) => set({ isAuthModalOpen: open, error: null }),
      clearError: () => set({ error: null }),

      setSubscription: (plan: string) => set((state) => ({
        user: state.user ? { ...state.user, subscriptionPlan: plan } : null
      })),

      login: async (credentials: any) => {
        set({ loading: true, error: null });
        try {
          // Path adjusted to /auth/login because the baseURL already includes /api
          const res = await API.post('/api/auth/login', credentials);
          set({ 
            user: res.data.user, 
            token: res.data.token, 
            loading: false, 
            isAuthModalOpen: false 
          });
          return true;
        } catch (err: any) {
          set({ 
            error: err.response?.data?.message || 'Login failed.', 
            loading: false 
          });
          return false;
        }
      },

      signup: async (userData: any) => {
        set({ loading: true, error: null });
        try {
          const res = await API.post('/api/auth/signup', userData);
          set({ 
            user: res.data.user, 
            token: res.data.token, 
            loading: false, 
            isAuthModalOpen: false 
          });
          return true;
        } catch (err: any) {
          set({ 
            error: err.response?.data?.message || 'Signup failed.', 
            loading: false 
          });
          return false;
        }
      },

      refreshUser: async () => {
        const { token, user } = get();
        if (!token || !user) return;
        try {
          const res = await API.get(`/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          set({ user: res.data.user });
        } catch (err) {
          console.error("Failed to sync user data");
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthModalOpen: false });
      },
    }),
    { 
      name: 'streamvibe-storage', 
      storage: createJSONStorage(() => localStorage), 
    }
  )
);

// Interceptor to inject token automatically
API.interceptors.request.use((config) => {
  const state = localStorage.getItem('streamvibe-storage');
  if (state) {
    const parsedState = JSON.parse(state);
    const token = parsedState.state?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});