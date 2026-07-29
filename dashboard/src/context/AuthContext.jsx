import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Mock roles for the dashboard
  const MOCK_USERS = {
    'admin@civiceye.org': {
      id: 3,
      name: "System Administrator",
      email: "admin@civiceye.org",
      password: "password123", // Adding mock passwords
      role: "ADMIN",
      department: "Central Municipal Governance",
      badge: "ADM-001",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"
    },
    'officer@civiceye.org': {
      id: 1,
      name: "Inspector K. Arumugam",
      email: "officer@civiceye.org",
      password: "password123",
      role: "OFFICER",
      department: "Highways Department",
      badge: "BDG-4402",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
    },
    'citizen@civiceye.org': {
      id: 2,
      name: "Priya Ramesh",
      email: "citizen@civiceye.org",
      password: "password123",
      role: "CITIZEN",
      department: "Citizen Sentinel",
      badge: "Civic Champion",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
    }
  };

  // Load custom users from localStorage on startup
  const [customUsers, setCustomUsers] = useState({});
  
  useEffect(() => {
    const saved = localStorage.getItem('civiceye_users');
    if (saved) {
      setCustomUsers(JSON.parse(saved));
    }
  }, []);

  const login = (email, password) => {
    const allUsers = { ...MOCK_USERS, ...customUsers };
    const userProfile = allUsers[email];
    
    if (!userProfile) {
      throw new Error("Email not found. Please sign up.");
    }
    
    if (userProfile.password !== password) {
      throw new Error("Invalid password.");
    }
    
    // Don't leak password in state
    const { password: _, ...safeProfile } = userProfile;
    setUser(safeProfile);
    setIsAuthenticated(true);
    return true;
  };

  const signup = (name, email, password) => {
    const allUsers = { ...MOCK_USERS, ...customUsers };
    if (allUsers[email]) {
      throw new Error("Email already registered. Please sign in.");
    }

    const newProfile = {
      id: Math.floor(Math.random() * 1000000), // Random high ID so it doesn't conflict
      name: name,
      email: email,
      password: password,
      role: "CITIZEN",
      department: "Citizen",
      badge: "New User",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"
    };

    const updatedCustomUsers = { ...customUsers, [email]: newProfile };
    setCustomUsers(updatedCustomUsers);
    localStorage.setItem('civiceye_users', JSON.stringify(updatedCustomUsers));

    const { password: _, ...safeProfile } = newProfile;
    setUser(safeProfile);
    setIsAuthenticated(true);
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const switchRole = (role) => {
    if (role === 'ADMIN') {
      const { password: _, ...safeProfile } = MOCK_USERS['admin@civiceye.org'];
      setUser(safeProfile);
    } else if (role === 'OFFICER') {
      const { password: _, ...safeProfile } = MOCK_USERS['officer@civiceye.org'];
      setUser(safeProfile);
    } else {
      const { password: _, ...safeProfile } = MOCK_USERS['citizen@civiceye.org'];
      setUser(safeProfile);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, signup, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

