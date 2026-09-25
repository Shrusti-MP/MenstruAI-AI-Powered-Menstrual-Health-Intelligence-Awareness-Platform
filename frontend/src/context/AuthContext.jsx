import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('menstruai_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('menstruai_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      const savedToken = localStorage.getItem('menstruai_token');
      if (savedToken) {
        try {
          const userData = await authService.getMe();
          setUser(userData);
          localStorage.setItem('menstruai_user', JSON.stringify(userData));
        } catch {
          // Token invalid or expired
          logout();
        }
      }
      setLoading(false);
    };

    verifyUser();
  }, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    setToken(data.access_token);
    setUser(data.user);
    localStorage.setItem('menstruai_token', data.access_token);
    localStorage.setItem('menstruai_user', JSON.stringify(data.user));
    return data;
  };

  const register = async (registerData) => {
    const data = await authService.register(registerData);
    setToken(data.access_token);
    setUser(data.user);
    localStorage.setItem('menstruai_token', data.access_token);
    localStorage.setItem('menstruai_user', JSON.stringify(data.user));
    return data;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (e) {
      // ignore network errors on logout
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('menstruai_token');
      localStorage.removeItem('menstruai_user');
    }
  };

  const updateProfile = async (updateData) => {
    const updatedUser = await authService.updateProfile(updateData);
    setUser(updatedUser);
    localStorage.setItem('menstruai_user', JSON.stringify(updatedUser));
    return updatedUser;
  };

  const deleteAccount = async (confirmation) => {
    const result = await authService.deleteAccount(confirmation);
    logout();
    return result;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        deleteAccount,
      }}
    >
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
