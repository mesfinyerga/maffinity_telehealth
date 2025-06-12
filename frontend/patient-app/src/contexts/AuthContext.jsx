import { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, validateToken } from '../lib/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('patientToken'));

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const userData = await validateToken(token);
          setUser(userData);
        } catch (error) {
          console.error('Auth validation failed:', error);
          localStorage.removeItem('patientToken');
          setToken(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const login = async (email, password) => {
    try {
      const data = await apiLogin(email, password);
      localStorage.setItem('patientToken', data.accessToken);
      setToken(data.accessToken);
      setUser(data.user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      const data = await apiRegister(userData);
      localStorage.setItem('patientToken', data.accessToken);
      setToken(data.accessToken);
      setUser(data.user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('patientToken');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

