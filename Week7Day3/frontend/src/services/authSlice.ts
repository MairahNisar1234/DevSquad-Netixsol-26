import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  isInitialized: boolean; // Tracks if localStorage has been checked
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  isInitialized: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Call this in a useEffect in your Root Layout or App component
    hydrateAuth: (state) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('auth_token');
        const userStr = localStorage.getItem('auth_user');
        
        if (token && userStr) {
          try {
            state.user = JSON.parse(userStr);
            state.token = token;
            state.isAuthenticated = true;
          } catch (error) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
          }
        }
      }
      state.isInitialized = true;
    },
    
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', action.payload.token);
        localStorage.setItem('auth_user', JSON.stringify(action.payload.user));
      }
    },
    
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { 
  setCredentials, 
  clearCredentials, 
  setLoading, 
  hydrateAuth 
} = authSlice.actions;

export default authSlice.reducer;