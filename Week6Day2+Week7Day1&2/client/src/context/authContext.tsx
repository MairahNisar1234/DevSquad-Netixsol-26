'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 1. Updated User Interface
interface User {
  _id: string;         // Changed from id to _id to match MongoDB
  name: string;
  email: string;
  picture?: string;
  avatar?: string;
  loyaltyPoints?: number; // Added loyaltyPoints
  provider?: string;
  lastLogin?: string;
}

// 2. Updated Context Interface
interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>; // Added setUser
  loading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 1. Single source of truth for initialization
  useEffect(() => {
    const initAuth = () => {
      const savedUser = localStorage.getItem('user_data');
      const token = localStorage.getItem('access_token');

      if (savedUser && token) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          console.error("Auth hydration failed", e);
          localStorage.removeItem('user_data');
          localStorage.removeItem('access_token');
        }
      }
      setLoading(false); // Only stop loading AFTER checking storage
    };

    initAuth();
  }, []);

  const login = (token: string, userData: User) => {
    localStorage.setItem('access_token', token);
    localStorage.setItem('user_data', JSON.stringify(userData));
    setUser(userData);
    router.push('/');
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_data');
    setUser(null);
    // Optional: Clear cart on logout to fix your inconsistency
    // localStorage.removeItem('cart'); 
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout }}>
      {/* 2. Don't render children until we know the auth status */}
      {!loading ? children : (
        <div className="flex h-screen items-center justify-center">
           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
        </div>
      )}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};