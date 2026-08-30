import React, { createContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('civicfix_user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('civicfix_token') || null;
  });

  const [loading, setLoading] = useState(true);

  // Synchronize authentication state on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('civicfix_token');
      if (storedToken) {
        try {
          const res = await authService.getMe();
          if (res?.data) {
            setUser(res.data);
            localStorage.setItem('civicfix_user', JSON.stringify(res.data));
          }
        } catch (err) {
          console.warn('[AuthContext] Session verification failed, clearing invalid session.');
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();

    // Listen to 401 unauthorized events from axios interceptor
    const handleUnauthorized = () => {
      setUser(null);
      setToken(null);
      localStorage.removeItem('civicfix_token');
      localStorage.removeItem('civicfix_user');
      localStorage.removeItem('civicfix_refresh_token');
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, []);

  const login = async (email, password) => {
    const res = await authService.login(email, password);
    const { token: accessToken, refreshToken, user: userData } = res.data;

    localStorage.setItem('civicfix_token', accessToken);
    if (refreshToken) {
      localStorage.setItem('civicfix_refresh_token', refreshToken);
    }
    localStorage.setItem('civicfix_user', JSON.stringify(userData));

    setToken(accessToken);
    setUser(userData);
    return userData;
  };

  const signup = async (name, email, password) => {
    const res = await authService.signup(name, email, password);
    const { token: accessToken, refreshToken, user: userData } = res.data;

    localStorage.setItem('civicfix_token', accessToken);
    if (refreshToken) {
      localStorage.setItem('civicfix_refresh_token', refreshToken);
    }
    localStorage.setItem('civicfix_user', JSON.stringify(userData));

    setToken(accessToken);
    setUser(userData);
    return userData;
  };

  const logout = useCallback(() => {
    localStorage.removeItem('civicfix_token');
    localStorage.removeItem('civicfix_refresh_token');
    localStorage.removeItem('civicfix_user');
    setToken(null);
    setUser(null);
  }, []);

  const updateUser = (newUserData) => {
    const updated = { ...user, ...newUserData };
    setUser(updated);
    localStorage.setItem('civicfix_user', JSON.stringify(updated));
  };

  const isAuthenticated = Boolean(token && user);
  const isOfficer = user?.role === 'officer';
  const isCitizen = user?.role === 'citizen';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isOfficer,
        isCitizen,
        login,
        signup,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
