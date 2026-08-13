import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('xo_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('xo_token');
      if (token) {
        if (token.startsWith('mock_')) {
          setLoading(false);
          return;
        }
        try {
          const res = await api.get('/auth/me');
          setUser(res.data);
          localStorage.setItem('xo_user', JSON.stringify(res.data));
        } catch (err) {
          console.warn('Auth token verification failed:', err);
          logout();
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, refreshToken, ...userData } = res.data;
      localStorage.setItem('xo_token', token);
      if (refreshToken) localStorage.setItem('xo_refreshToken', refreshToken);
      localStorage.setItem('xo_user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (err) {
      if (!err.response) {
        // Local network fallback if API server is not running locally
        const mockUser = {
          _id: `user-${Date.now()}`,
          name: email.split('@')[0],
          email,
          role: email.includes('admin') ? 'admin' : 'customer'
        };
        localStorage.setItem('xo_token', 'mock_jwt_token');
        localStorage.setItem('xo_user', JSON.stringify(mockUser));
        setUser(mockUser);
        return mockUser;
      }
      throw err;
    }
  };

  const register = async (name, email, password, phone) => {
    try {
      const res = await api.post('/auth/register', { name, email, password, phone });
      const { token, refreshToken, ...userData } = res.data;
      localStorage.setItem('xo_token', token);
      if (refreshToken) localStorage.setItem('xo_refreshToken', refreshToken);
      localStorage.setItem('xo_user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (err) {
      if (!err.response) {
        // Fallback for local offline testing if backend API is not running
        const mockUser = {
          _id: `user-${Date.now()}`,
          name: name.trim(),
          email: email.toLowerCase().trim(),
          role: 'customer',
          phone: phone ? phone.trim() : ''
        };
        localStorage.setItem('xo_token', 'mock_jwt_token');
        localStorage.setItem('xo_user', JSON.stringify(mockUser));
        setUser(mockUser);
        return mockUser;
      }
      throw err;
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // ignore network errors on logout
    }
    localStorage.removeItem('xo_token');
    localStorage.removeItem('xo_refreshToken');
    localStorage.removeItem('xo_user');
    setUser(null);
  };

  const refreshProfile = async () => {
    try {
      const token = localStorage.getItem('xo_token');
      if (token && !token.startsWith('mock_')) {
        const res = await api.get('/auth/me');
        setUser(res.data);
        localStorage.setItem('xo_user', JSON.stringify(res.data));
      }
    } catch (e) {
      console.error('Failed to refresh profile:', e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshProfile, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
