'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Database } from '@/lib/db';

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  login: (userId: string) => void;
  logout: () => void;
  updateProfile: (user: User) => void;
  createUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = Database.getCurrentUser();
    setCurrentUser(user);
    setIsLoading(false);
  }, []);

  const login = (userId: string) => {
    const users = Database.getUsers();
    const user = users.find((u) => u.id === userId);
    if (user) {
      Database.setCurrentUser(user);
      setCurrentUser(user);
    }
  };

  const logout = () => {
    Database.setCurrentUser(null);
    setCurrentUser(null);
  };

  const updateProfile = (user: User) => {
    const users = Database.getUsers();
    const updated = users.map((u) => (u.id === user.id ? user : u));
    Database.saveUsers(updated);
    Database.setCurrentUser(user);
    setCurrentUser(user);
  };

  const createUser = (user: User) => {
    const users = Database.getUsers();
    users.push(user);
    Database.saveUsers(users);
    Database.setCurrentUser(user);
    setCurrentUser(user);
  };

  return (
    <AuthContext.Provider value={{ currentUser, isLoading, login, logout, updateProfile, createUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

// Initialize demo data on app start
if (typeof window !== 'undefined') {
  Database.initializeDemoData?.();
}
