import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Restore session from token
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Token expired or invalid", error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const data = res.data;
      
      localStorage.setItem('token', data.access_token);
      
      // Update state
      setUser({
        id: data.user_id,
        name: data.full_name,
        email: data.email,
        role: data.role,
        department: data.role === 'CITIZEN' ? 'Citizen' : 'Officer',
        badge: data.role === 'ADMIN' ? 'ADM-001' : (data.role === 'OFFICER' ? 'BDG-001' : 'Citizen'),
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"
      });
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.detail || "Login failed");
      }
      throw new Error("Login failed. Check your network connection.");
    }
  };

  const signup = async (name, email, password) => {
    try {
      // Register
      await api.post('/auth/register', { 
        email, 
        password, 
        full_name: name,
        phone: "0000000000" // Placeholder
      });
      
      // Auto login after signup
      return await login(email, password);
    } catch (error) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.detail || "Registration failed");
      }
      throw new Error("Registration failed.");
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  const switchRole = async (role) => {
    // For local testing convenience during dev
    try {
      if (role === 'ADMIN') {
        await login('admin@civiceye.org', 'password123');
      } else if (role === 'OFFICER') {
        await login('officer@civiceye.org', 'password123');
      } else {
        await login('citizen@civiceye.org', 'password123');
      }
    } catch (e) {
      console.warn("Switch role failed - accounts might not be seeded yet.");
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, signup, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
