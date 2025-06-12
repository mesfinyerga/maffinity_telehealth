// Mock authentication service for development
export const mockAuthService = {
  login: async (email, password) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock successful login for demo credentials
    if (email === 'doctor@telehealth.com' && password === 'doctor123') {
      const mockUser = {
        id: '1',
        email: 'doctor@telehealth.com',
        firstName: 'John',
        lastName: 'Smith',
        role: 'DOCTOR',
        specialization: 'General Medicine',
        licenseNumber: 'MD123456',
        phone: '+251911234567'
      };
      
      const mockToken = 'mock-jwt-token-' + Date.now();
      
      return {
        success: true,
        user: mockUser,
        accessToken: mockToken,
        refreshToken: 'mock-refresh-token'
      };
    }
    
    throw new Error('Invalid credentials');
  },
  
  validateToken: async (token) => {
    // Mock token validation
    if (token && token.startsWith('mock-jwt-token')) {
      return {
        id: '1',
        email: 'doctor@telehealth.com',
        firstName: 'John',
        lastName: 'Smith',
        role: 'DOCTOR',
        specialization: 'General Medicine',
        licenseNumber: 'MD123456',
        phone: '+251911234567'
      };
    }
    
    throw new Error('Invalid token');
  }
};

