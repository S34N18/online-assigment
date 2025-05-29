import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const userData = localStorage.getItem('user');
      // Check if userData exists and is not just whitespace
      if (userData && userData.trim() !== '') {
        return JSON.parse(userData);
      }
      return null;
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
      // Clear corrupted data
      localStorage.removeItem('user');
      return null;
    }
  });
  
  const [token, setToken] = useState(() => {
    try {
      const storedToken = localStorage.getItem('token');
      return storedToken || '';
    } catch (error) {
      console.error('Error getting token from localStorage:', error);
      return '';
    }
  });

  // Check if token is expired with better error handling
  const isTokenExpired = (token) => {
    if (!token || typeof token !== 'string') return true;
    
    try {
      // Check if token has the correct JWT format (3 parts separated by dots)
      const parts = token.split('.');
      if (parts.length !== 3) return true;
      
      const payload = JSON.parse(atob(parts[1]));
      
      // Check if payload has exp field
      if (!payload.exp) return true;
      
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  };

  // Auto-logout if token is expired
  useEffect(() => {
    if (token && isTokenExpired(token)) {
      console.log('Token expired, logging out...');
      logout();
    }
  }, [token]);

  const login = (userData, userToken) => {
    try {
      if (!userData || !userToken) {
        throw new Error('Invalid user data or token');
      }
      
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', userToken);
      setUser(userData);
      setToken(userToken);
    } catch (error) {
      console.error('Error during login:', error);
      // Optionally show user-friendly error message
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setUser(null);
      setToken('');
    } catch (error) {
      console.error('Error during logout:', error);
      // Still clear state even if localStorage fails
      setUser(null);
      setToken('');
    }
  };
  
  // Clear auth state if localStorage is cleared externally
  useEffect(() => {
    const handleStorageChange = (e) => {
      // Only handle changes to our specific keys
      if (e.key === 'user' || e.key === 'token') {
        try {
          const storedUser = localStorage.getItem('user');
          const storedToken = localStorage.getItem('token');
          
          if (!storedUser || !storedToken) {
            setUser(null);
            setToken('');
          } else {
            // Validate the stored data
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setToken(storedToken);
          }
        } catch (error) {
          console.error('Error handling storage change:', error);
          setUser(null);
          setToken('');
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const isAuthenticated = !!user && !!token && !isTokenExpired(token);

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      login, 
      logout, 
      isAuthenticated 
    }}>
      {children}
    </AuthContext.Provider>
  );
};