"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  isLoggedin: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedin, setIsLoggedin] = useState(false);

  const login = () => {
    setIsLoggedin(true);
    // Set a timeout to log out after 25 minutes (1,200,000 milliseconds)
    setTimeout(() => {
      setIsLoggedin(false);
      localStorage.removeItem("phoneNumber");
    }, 1200000);
  };

  const logout = () => setIsLoggedin(false);

  return (
    <AuthContext.Provider value={{ isLoggedin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
