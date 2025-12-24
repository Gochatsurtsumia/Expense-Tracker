import React, { createContext, useState, useEffect, useContext } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await authAPI.getMe();
          setUser(response.data.data.user);
        } catch (error) {
          localStorage.removeItem("token");
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const response = await authAPI.login({ email, password });
    const { user, token } = response.data.data;
    localStorage.setItem("token", token);
    setUser(user);
    return response.data;
  };

  const register = async (name, email, password) => {
    const response = await authAPI.register({ name, email, password });
    const { user, token } = response.data.data;
    localStorage.setItem("token", token);
    setUser(user);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
