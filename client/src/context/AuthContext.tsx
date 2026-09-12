import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => Promise<void>;
  register: (name: string, email: string, password?: string) => Promise<void>;
  logout: () => void;
  setUser: (user: UserProfile | null) => void;
}

const STORAGE_KEY_USER = 'aurapages_user_v1';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY_USER);
    }
  }, [user]);

  const login = async (email: string, password?: string) => {
    try {
      const res = await authService.login(email, password);
      setUser(res.user);
    } catch {
      // Fallback for offline/mock login
      const fallbackUser: UserProfile = { name: email.split('@')[0], email };
      setUser(fallbackUser);
    }
  };

  const register = async (name: string, email: string, password?: string) => {
    try {
      const res = await authService.register(name, email, password);
      setUser(res.user);
    } catch {
      // Fallback for offline/mock registration
      const fallbackUser: UserProfile = { name, email };
      setUser(fallbackUser);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
