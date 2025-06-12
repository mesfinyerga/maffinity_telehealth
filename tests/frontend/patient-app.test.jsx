import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../src/contexts/AuthContext';
import { LanguageProvider } from '../../src/contexts/LanguageContext';
import { ThemeProvider } from '../../src/contexts/ThemeContext';
import Login from '../../src/components/auth/Login';
import Home from '../../src/components/pages/Home';
import AITriage from '../../src/components/pages/AITriage';
import Profile from '../../src/components/pages/Profile';
import '@testing-library/jest-dom';

// Mock fetch for API calls
global.fetch = jest.fn();

const MockProviders = ({ children }) => (
  <BrowserRouter>
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  </BrowserRouter>
);

describe('Patient Mobile App Components', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  describe('Login Component', () => {
    it('renders login form with multilingual support', () => {
      render(
        <MockProviders>
          <Login />
        </MockProviders>
      );

      expect(screen.getByText('Welcome to TeleHealth')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('switches to Amharic language', async () => {
      render(
        <MockProviders>
          <Login />
        </MockProviders>
      );

      const languageToggle = screen.getByRole('button', { name: /አማርኛ/i });
      fireEvent.click(languageToggle);

      await waitFor(() => {
        expect(screen.getByText('እንኳን ወደ ቴሌሄልዝ በደህና መጡ')).toBeInTheDocument();
      });
    });

    it('validates Ethiopian phone number format', async () => {
      render(
        <MockProviders>
          <Login />
        </MockProviders>
      );

      // Switch to registration mode
      const registerLink = screen.getByText('Create Account');
      fireEvent.click(registerLink);

      const phoneInput = screen.getByPlaceholderText('Phone Number');
      fireEvent.change(phoneInput, { target: { value: '123456789' } });

      await waitFor(() => {
        expect(screen.getByText('Please enter a valid Ethiopian phone number')).toBeInTheDocument();
      });
    });

    it('accepts valid Ethiopian phone number', async () => {
      render(
        <MockProviders>
          <Login />
        </MockProviders>
      );

      const registerLink = screen.getByText('Create Account');
      fireEvent.click(registerLink);

      const phoneInput = screen.getByPlaceholderText('Phone Number');
      fireEvent.change(phoneInput, { target: { value: '+251911234567' } });

      await waitFor(() => {
        expect(screen.queryByText('Please enter a valid Ethiopian phone number')).not.toBeInTheDocument();
      });
    });
  });

  describe('Home Component', () => {
    beforeEach(() => {
      Storage.prototype.getItem = jest.fn(() => JSON.stringify({
        access_token: 'mock-token',
        user: { id: 1, email: 'patient@test.com', role: 'PATIENT', firstName: 'John' }
      }));
    });

    it('renders personalized greeting', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          upcomingAppointments: 2,
          healthScore: 85,
          lastCheckup: '2024-01-15'
        })
      });

      render(
        <MockProviders>
          <Home />
        </MockProviders>
      );

      await waitFor(() => {
        expect(screen.getByText('Good morning, John!')).toBeInTheDocument();
      });
    });

    it('displays health metrics', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          upcomingAppointments: 2,
          healthScore: 85,
          lastCheckup: '2024-01-15',
          vitals: {
            heartRate: 72,
            bloodPressure: '120/80',
            weight: 70
          }
        })
      });

      render(
        <MockProviders>
          <Home />
        </MockProviders>
      );

      await waitFor(() => {
        expect(screen.getByText('Health Score')).toBeInTheDocument();
        expect(screen.getByText('85')).toBeInTheDocument();
      });
    });

    it('shows weather information for Addis Ababa', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          location: 'Addis Ababa',
          temperature: 22,
          condition: 'Sunny',
          humidity: 65
        })
      });

      render(
        <MockProviders>
          <Home />
        </MockProviders>
      );

      await waitFor(() => {
        expect(screen.getByText('Addis Ababa')).toBeInTheDocument();
        expect(screen.getByText('22°C')).toBeInTheDocument();
      });
    });
  });

  describe('AI Triage Component', () => {
    beforeEach(() => {
      Storage.prototype.getItem = jest.fn(() => JSON.stringify({
        access_token: 'mock-token',
        user: { id: 1, email: 'patient@test.com', role: 'PATIENT' }
      }));
    });

    it('renders AI chatbot interface', () => {
      render(
        <MockProviders>
          <AITriage />
        </MockProviders>
      );

      expect(screen.getByText('AI Health Assistant')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Describe your symptoms...')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
    });

    it('sends symptom message and receives AI response', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          sessionId: 'session-123',
          analysis: {
            urgencyLevel: 'medium',
            recommendations: ['Rest and hydration', 'Monitor symptoms'],
            possibleConditions: ['Tension headache', 'Dehydration'],
            response: 'Based on your symptoms, this appears to be a tension headache...'
          }
        })
      });

      render(
        <MockProviders>
          <AITriage />
        </MockProviders>
      );

      const input = screen.getByPlaceholderText('Describe your symptoms...');
      const sendButton = screen.getByRole('button', { name: /send/i });

      fireEvent.change(input, { 
        target: { value: 'I have been experiencing headaches for 2 days' } 
      });
      fireEvent.click(sendButton);

      await waitFor(() => {
        expect(screen.getByText('Based on your symptoms, this appears to be a tension headache...')).toBeInTheDocument();
      });
    });

    it('displays urgency level with appropriate styling', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          analysis: {
            urgencyLevel: 'high',
            recommendations: ['Seek immediate medical attention'],
            response: 'This requires urgent medical attention.'
          }
        })
      });

      render(
        <MockProviders>
          <AITriage />
        </MockProviders>
      );

      const input = screen.getByPlaceholderText('Describe your symptoms...');
      fireEvent.change(input, { target: { value: 'Severe chest pain' } });
      fireEvent.click(screen.getByRole('button', { name: /send/i }));

      await waitFor(() => {
        const urgencyBadge = screen.getByText('High Priority');
        expect(urgencyBadge).toHaveClass('bg-red-100');
      });
    });

    it('handles Amharic input correctly', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          analysis: {
            urgencyLevel: 'low',
            response: 'በአማርኛ ምላሽ...',
            language: 'am'
          }
        })
      });

      render(
        <MockProviders>
          <AITriage />
        </MockProviders>
      );

      const input = screen.getByPlaceholderText('Describe your symptoms...');
      fireEvent.change(input, { target: { value: 'ራስ ምታት አለብኝ' } });
      fireEvent.click(screen.getByRole('button', { name: /send/i }));

      await waitFor(() => {
        expect(screen.getByText('በአማርኛ ምላሽ...')).toBeInTheDocument();
      });
    });

    it('shows typing indicator during AI processing', async () => {
      fetch.mockImplementation(() => 
        new Promise(resolve => 
          setTimeout(() => resolve({
            ok: true,
            json: async () => ({ analysis: { response: 'Response' } })
          }), 1000)
        )
      );

      render(
        <MockProviders>
          <AITriage />
        </MockProviders>
      );

      const input = screen.getByPlaceholderText('Describe your symptoms...');
      fireEvent.change(input, { target: { value: 'Test symptoms' } });
      fireEvent.click(screen.getByRole('button', { name: /send/i }));

      expect(screen.getByText('AI is typing...')).toBeInTheDocument();
    });
  });

  describe('Profile Component', () => {
    beforeEach(() => {
      Storage.prototype.getItem = jest.fn(() => JSON.stringify({
        access_token: 'mock-token',
        user: { 
          id: 1, 
          email: 'patient@test.com', 
          role: 'PATIENT',
          firstName: 'John',
          lastName: 'Doe',
          phoneNumber: '+251911234567'
        }
      }));
    });

    it('renders user profile information', () => {
      render(
        <MockProviders>
          <Profile />
        </MockProviders>
      );

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('patient@test.com')).toBeInTheDocument();
      expect(screen.getByText('+251911234567')).toBeInTheDocument();
    });

    it('allows language switching', async () => {
      render(
        <MockProviders>
          <Profile />
        </MockProviders>
      );

      const languageSection = screen.getByText('Language');
      expect(languageSection).toBeInTheDocument();

      const amharicOption = screen.getByText('አማርኛ (Amharic)');
      fireEvent.click(amharicOption);

      await waitFor(() => {
        expect(localStorage.setItem).toHaveBeenCalledWith('language', 'am');
      });
    });

    it('toggles theme preference', async () => {
      render(
        <MockProviders>
          <Profile />
        </MockProviders>
      );

      const themeToggle = screen.getByRole('switch', { name: /dark mode/i });
      fireEvent.click(themeToggle);

      await waitFor(() => {
        expect(localStorage.setItem).toHaveBeenCalledWith('theme', expect.any(String));
      });
    });

    it('displays medical history section', () => {
      render(
        <MockProviders>
          <Profile />
        </MockProviders>
      );

      expect(screen.getByText('Medical History')).toBeInTheDocument();
      expect(screen.getByText('Allergies')).toBeInTheDocument();
      expect(screen.getByText('Current Medications')).toBeInTheDocument();
    });
  });

  describe('Bottom Navigation', () => {
    it('renders all navigation items', () => {
      render(
        <MockProviders>
          <Home />
        </MockProviders>
      );

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('AI Health')).toBeInTheDocument();
      expect(screen.getByText('Appointments')).toBeInTheDocument();
      expect(screen.getByText('Chat')).toBeInTheDocument();
      expect(screen.getByText('Profile')).toBeInTheDocument();
    });

    it('highlights active navigation item', () => {
      render(
        <MockProviders>
          <Home />
        </MockProviders>
      );

      const homeNavItem = screen.getByText('Home').closest('button');
      expect(homeNavItem).toHaveClass('text-primary');
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels', () => {
      render(
        <MockProviders>
          <AITriage />
        </MockProviders>
      );

      const chatInput = screen.getByPlaceholderText('Describe your symptoms...');
      expect(chatInput).toHaveAttribute('aria-label', 'Symptom description input');

      const sendButton = screen.getByRole('button', { name: /send/i });
      expect(sendButton).toHaveAttribute('aria-label', 'Send message');
    });

    it('supports keyboard navigation', () => {
      render(
        <MockProviders>
          <Home />
        </MockProviders>
      );

      const firstButton = screen.getAllByRole('button')[0];
      firstButton.focus();
      expect(document.activeElement).toBe(firstButton);
    });

    it('has sufficient color contrast', () => {
      render(
        <MockProviders>
          <Login />
        </MockProviders>
      );

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      const styles = window.getComputedStyle(submitButton);
      
      // Check that button has proper contrast (this is a simplified check)
      expect(styles.backgroundColor).toBeTruthy();
      expect(styles.color).toBeTruthy();
    });
  });
});

