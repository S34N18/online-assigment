import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('token') || '');

  const login = (userData, token) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    setUser(userData);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setToken('');
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
