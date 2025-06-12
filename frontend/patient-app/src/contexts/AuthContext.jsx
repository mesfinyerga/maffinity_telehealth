import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock authentication service for development
const mockAuthService = {
  login: async (email, password) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email === 'patient@telehealth.com' && password === 'patient123') {
      const mockUser = {
        id: '1',
        email: 'patient@telehealth.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'PATIENT',
        phone: '+251911234567',
        dateOfBirth: '1990-01-15',
        gender: 'male',
        onboardingCompleted: true
      };
      
      const mockToken = 'mock-patient-token-' + Date.now();
      
      return {
        success: true,
        user: mockUser,
        accessToken: mockToken,
        refreshToken: 'mock-refresh-token'
      };
    }
    
    throw new Error('Invalid credentials');
  },
  
  register: async (userData) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockUser = {
      id: Date.now().toString(),
      ...userData,
      role: 'PATIENT',
      onboardingCompleted: false
    };
    
    const mockToken = 'mock-patient-token-' + Date.now();
    
    return {
      success: true,
      user: mockUser,
      accessToken: mockToken,
      refreshToken: 'mock-refresh-token'
    };
  },
  
  validateToken: async (token) => {
    if (token && token.startsWith('mock-patient-token')) {
      return {
        id: '1',
        email: 'patient@telehealth.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'PATIENT',
        phone: '+251911234567',
        dateOfBirth: '1990-01-15',
        gender: 'male',
        onboardingCompleted: true
      };
    }
    
    throw new Error('Invalid token');
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('patientToken'));

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const userData = await mockAuthService.validateToken(token);
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
      const data = await mockAuthService.login(email, password);
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
      const data = await mockAuthService.register(userData);
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

