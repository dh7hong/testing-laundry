// src/context/AuthContext.tsx
"use client";
import React, { createContext, useContext } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { AuthState, authState, loginSelector } from '@/store';

interface AuthContextType {
  login: (phoneNumber: string) => void;
  logout: () => void;
  isLoggedIn: boolean;
  phoneNumber: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = useRecoilValue(authState);
  const setAuthState = useSetRecoilState(authState);
  const setLogin = useSetRecoilState(loginSelector);
  const setLogout = useSetRecoilState(authState);

  const loginHandler = (phoneNumber: string) => {
    const newAuthState: AuthState = { isLoggedIn: true, phoneNumber };
    setAuthState(newAuthState);  // Update Recoil state
    setLogin(newAuthState);  // Update Recoil selector
    localStorage.setItem("auth", JSON.stringify(newAuthState));  // Save to localStorage
    console.log("Logged in:", newAuthState);  // Add this line
  };

  const logoutHandler = () => {
    // Perform side effects first
    localStorage.clear();
    console.log("Logged out");

    // Perform Recoil state update separately
    setTimeout(() => setLogout((prevState) => ({
      ...prevState,
      isLoggedIn: false,
      phoneNumber: null
    })), 0);
  };

  return (
    <AuthContext.Provider value={{ ...auth, login: loginHandler, logout: logoutHandler }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
