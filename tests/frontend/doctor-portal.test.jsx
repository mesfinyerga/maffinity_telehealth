import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../src/contexts/AuthContext';
import { ThemeProvider } from '../../src/contexts/ThemeContext';
import Login from '../../src/components/auth/Login';
import Dashboard from '../../src/components/pages/Dashboard';
import '@testing-library/jest-dom';

// Mock fetch for API calls
global.fetch = jest.fn();

const MockProviders = ({ children }) => (
  <BrowserRouter>
    <ThemeProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>
);

describe('Doctor Portal Components', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  describe('Login Component', () => {
    it('renders login form correctly', () => {
      render(
        <MockProviders>
          <Login />
        </MockProviders>
      );

      expect(screen.getByText('Welcome Back')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('validates email format', async () => {
      render(
        <MockProviders>
          <Login />
        </MockProviders>
      );

      const emailInput = screen.getByPlaceholderText('Enter your email');
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
      });
    });

    it('validates password requirement', async () => {
      render(
        <MockProviders>
          <Login />
        </MockProviders>
      );

      const emailInput = screen.getByPlaceholderText('Enter your email');
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      fireEvent.change(emailInput, { target: { value: 'doctor@test.com' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Password is required')).toBeInTheDocument();
      });
    });

    it('submits form with valid credentials', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          access_token: 'mock-token',
          user: { id: 1, email: 'doctor@test.com', role: 'DOCTOR' }
        })
      });

      render(
        <MockProviders>
          <Login />
        </MockProviders>
      );

      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Enter your password');
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      fireEvent.change(emailInput, { target: { value: 'doctor@test.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'doctor@test.com',
            password: 'password123'
          })
        });
      });
    });

    it('handles login error', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Invalid credentials' })
      });

      render(
        <MockProviders>
          <Login />
        </MockProviders>
      );

      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Enter your password');
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      fireEvent.change(emailInput, { target: { value: 'doctor@test.com' } });
      fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
      });
    });
  });

  describe('Dashboard Component', () => {
    beforeEach(() => {
      // Mock localStorage
      Storage.prototype.getItem = jest.fn(() => JSON.stringify({
        access_token: 'mock-token',
        user: { id: 1, email: 'doctor@test.com', role: 'DOCTOR' }
      }));
    });

    it('renders dashboard with statistics', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          totalPatients: 150,
          todayAppointments: 8,
          pendingConsultations: 3,
          completedConsultations: 45
        })
      });

      render(
        <MockProviders>
          <Dashboard />
        </MockProviders>
      );

      await waitFor(() => {
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Total Patients')).toBeInTheDocument();
        expect(screen.getByText('Today\'s Appointments')).toBeInTheDocument();
      });
    });

    it('displays loading state', () => {
      fetch.mockImplementation(() => new Promise(() => {})); // Never resolves

      render(
        <MockProviders>
          <Dashboard />
        </MockProviders>
      );

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('handles API error gracefully', async () => {
      fetch.mockRejectedValueOnce(new Error('API Error'));

      render(
        <MockProviders>
          <Dashboard />
        </MockProviders>
      );

      await waitFor(() => {
        expect(screen.getByText('Error loading dashboard data')).toBeInTheDocument();
      });
    });

    it('renders charts when data is available', async () => {
      fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            totalPatients: 150,
            todayAppointments: 8,
            pendingConsultations: 3,
            completedConsultations: 45
          })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ([
            { date: '2024-01-01', appointments: 5 },
            { date: '2024-01-02', appointments: 8 },
            { date: '2024-01-03', appointments: 6 }
          ])
        });

      render(
        <MockProviders>
          <Dashboard />
        </MockProviders>
      );

      await waitFor(() => {
        expect(screen.getByText('Weekly Appointments')).toBeInTheDocument();
      });
    });
  });

  describe('Theme Integration', () => {
    it('applies dark theme correctly', () => {
      render(
        <MockProviders>
          <Login />
        </MockProviders>
      );

      const container = screen.getByRole('main') || document.body;
      
      // Check if dark theme classes are applied
      expect(container.className).toContain('dark');
    });

    it('toggles theme on button click', async () => {
      render(
        <MockProviders>
          <Dashboard />
        </MockProviders>
      );

      const themeToggle = screen.getByRole('button', { name: /toggle theme/i });
      
      fireEvent.click(themeToggle);

      await waitFor(() => {
        // Theme should toggle
        expect(localStorage.setItem).toHaveBeenCalledWith('theme', expect.any(String));
      });
    });
  });

  describe('Responsive Design', () => {
    it('adapts to mobile viewport', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      render(
        <MockProviders>
          <Dashboard />
        </MockProviders>
      );

      // Check if mobile-specific elements are rendered
      const sidebar = screen.getByRole('navigation');
      expect(sidebar).toHaveClass('mobile-hidden');
    });

    it('shows desktop layout on larger screens', () => {
      // Mock desktop viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });

      render(
        <MockProviders>
          <Dashboard />
        </MockProviders>
      );

      const sidebar = screen.getByRole('navigation');
      expect(sidebar).not.toHaveClass('mobile-hidden');
    });
  });
});

