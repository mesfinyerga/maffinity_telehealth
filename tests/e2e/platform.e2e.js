const { chromium } = require('playwright');
const { expect } = require('@playwright/test');

describe('TeleHealth Platform E2E Tests', () => {
  let browser;
  let context;
  let page;

  beforeAll(async () => {
    browser = await chromium.launch({ headless: true });
    context = await browser.newContext({
      viewport: { width: 1280, height: 720 },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    });
    page = await context.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  describe('Doctor Portal E2E', () => {
    beforeEach(async () => {
      await page.goto('http://localhost:5173');
    });

    it('should complete doctor login flow', async () => {
      // Wait for login page to load
      await page.waitForSelector('input[type="email"]');
      
      // Fill login form
      await page.fill('input[type="email"]', 'doctor@telehealth.com');
      await page.fill('input[type="password"]', 'doctor123');
      
      // Submit form
      await page.click('button[type="submit"]');
      
      // Wait for dashboard to load
      await page.waitForSelector('text=Dashboard');
      
      // Verify successful login
      expect(await page.textContent('h1')).toContain('Dashboard');
      expect(await page.isVisible('text=Total Patients')).toBeTruthy();
    });

    it('should navigate between different sections', async () => {
      // Login first
      await page.fill('input[type="email"]', 'doctor@telehealth.com');
      await page.fill('input[type="password"]', 'doctor123');
      await page.click('button[type="submit"]');
      await page.waitForSelector('text=Dashboard');

      // Navigate to Appointments
      await page.click('text=Appointments');
      await page.waitForSelector('text=Appointment Management');
      expect(await page.textContent('h1')).toContain('Appointment Management');

      // Navigate to Consultations
      await page.click('text=Consultations');
      await page.waitForSelector('text=Active Consultations');
      expect(await page.textContent('h1')).toContain('Active Consultations');

      // Navigate to AI Analysis
      await page.click('text=AI Analysis');
      await page.waitForSelector('text=AI-Powered Medical Analysis');
      expect(await page.textContent('h1')).toContain('AI-Powered Medical Analysis');
    });

    it('should handle appointment filtering', async () => {
      // Login and navigate to appointments
      await page.fill('input[type="email"]', 'doctor@telehealth.com');
      await page.fill('input[type="password"]', 'doctor123');
      await page.click('button[type="submit"]');
      await page.waitForSelector('text=Dashboard');
      await page.click('text=Appointments');
      await page.waitForSelector('text=Appointment Management');

      // Test date filtering
      await page.fill('input[type="date"]', '2024-12-06');
      await page.waitForTimeout(1000); // Wait for filter to apply

      // Verify appointments are filtered
      const appointmentCards = await page.$$('.appointment-card');
      expect(appointmentCards.length).toBeGreaterThan(0);
    });

    it('should toggle theme correctly', async () => {
      // Login first
      await page.fill('input[type="email"]', 'doctor@telehealth.com');
      await page.fill('input[type="password"]', 'doctor123');
      await page.click('button[type="submit"]');
      await page.waitForSelector('text=Dashboard');

      // Get initial theme
      const initialTheme = await page.evaluate(() => 
        document.documentElement.classList.contains('dark')
      );

      // Toggle theme
      await page.click('[data-testid="theme-toggle"]');
      await page.waitForTimeout(500);

      // Verify theme changed
      const newTheme = await page.evaluate(() => 
        document.documentElement.classList.contains('dark')
      );
      expect(newTheme).toBe(!initialTheme);
    });
  });

  describe('Patient Mobile App E2E', () => {
    beforeEach(async () => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('http://localhost:5174');
    });

    it('should complete patient login flow', async () => {
      await page.waitForSelector('input[type="email"]');
      
      await page.fill('input[type="email"]', 'patient@telehealth.com');
      await page.fill('input[type="password"]', 'patient123');
      await page.click('button[type="submit"]');
      
      await page.waitForSelector('text=Good morning');
      expect(await page.isVisible('text=Health Score')).toBeTruthy();
    });

    it('should interact with AI triage chatbot', async () => {
      // Login first
      await page.fill('input[type="email"]', 'patient@telehealth.com');
      await page.fill('input[type="password"]', 'patient123');
      await page.click('button[type="submit"]');
      await page.waitForSelector('text=Good morning');

      // Navigate to AI Health Check
      await page.click('text=AI Health');
      await page.waitForSelector('text=AI Health Assistant');

      // Send a message to the chatbot
      const messageInput = 'input[placeholder="Describe your symptoms..."]';
      await page.fill(messageInput, 'I have been experiencing headaches for 2 days');
      await page.click('button[aria-label="Send message"]');

      // Wait for AI response
      await page.waitForSelector('.ai-message', { timeout: 10000 });
      
      // Verify response received
      const aiMessages = await page.$$('.ai-message');
      expect(aiMessages.length).toBeGreaterThan(0);
    });

    it('should switch languages correctly', async () => {
      // Login first
      await page.fill('input[type="email"]', 'patient@telehealth.com');
      await page.fill('input[type="password"]', 'patient123');
      await page.click('button[type="submit"]');
      await page.waitForSelector('text=Good morning');

      // Navigate to Profile
      await page.click('text=Profile');
      await page.waitForSelector('text=Language');

      // Switch to Amharic
      await page.click('text=አማርኛ (Amharic)');
      await page.waitForTimeout(1000);

      // Verify language changed
      expect(await page.isVisible('text=መገለጫ')).toBeTruthy(); // "Profile" in Amharic
    });

    it('should navigate using bottom navigation', async () => {
      // Login first
      await page.fill('input[type="email"]', 'patient@telehealth.com');
      await page.fill('input[type="password"]', 'patient123');
      await page.click('button[type="submit"]');
      await page.waitForSelector('text=Good morning');

      // Test bottom navigation
      const navItems = ['AI Health', 'Appointments', 'Chat', 'Profile'];
      
      for (const item of navItems) {
        await page.click(`text=${item}`);
        await page.waitForTimeout(500);
        
        // Verify navigation worked
        const activeNavItem = await page.$('.bottom-nav .active');
        expect(activeNavItem).toBeTruthy();
      }
    });

    it('should handle responsive design on different screen sizes', async () => {
      // Test tablet size
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.reload();
      await page.waitForSelector('input[type="email"]');

      // Verify layout adapts
      const container = await page.$('.container');
      const containerWidth = await container.evaluate(el => el.offsetWidth);
      expect(containerWidth).toBeLessThanOrEqual(768);

      // Test desktop size
      await page.setViewportSize({ width: 1024, height: 768 });
      await page.reload();
      await page.waitForSelector('input[type="email"]');

      // Verify layout adapts again
      const newContainer = await page.$('.container');
      const newContainerWidth = await newContainer.evaluate(el => el.offsetWidth);
      expect(newContainerWidth).toBeGreaterThan(containerWidth);
    });
  });

  describe('Admin Dashboard E2E', () => {
    beforeEach(async () => {
      await page.setViewportSize({ width: 1280, height: 720 });
      await page.goto('http://localhost:5175');
    });

    it('should complete admin login flow', async () => {
      await page.waitForSelector('input[type="email"]');
      
      await page.fill('input[type="email"]', 'admin@telehealth.com');
      await page.fill('input[type="password"]', 'admin123');
      await page.click('button[type="submit"]');
      
      await page.waitForSelector('text=System Overview');
      expect(await page.isVisible('text=Total Users')).toBeTruthy();
    });

    it('should display user management interface', async () => {
      // Login first
      await page.fill('input[type="email"]', 'admin@telehealth.com');
      await page.fill('input[type="password"]', 'admin123');
      await page.click('button[type="submit"]');
      await page.waitForSelector('text=System Overview');

      // Navigate to Users
      await page.click('text=Users');
      await page.waitForSelector('text=User Management');

      // Verify user table is displayed
      expect(await page.isVisible('table')).toBeTruthy();
      expect(await page.isVisible('text=Name')).toBeTruthy();
      expect(await page.isVisible('text=Email')).toBeTruthy();
      expect(await page.isVisible('text=Role')).toBeTruthy();
    });

    it('should filter users by search', async () => {
      // Login and navigate to users
      await page.fill('input[type="email"]', 'admin@telehealth.com');
      await page.fill('input[type="password"]', 'admin123');
      await page.click('button[type="submit"]');
      await page.waitForSelector('text=System Overview');
      await page.click('text=Users');
      await page.waitForSelector('text=User Management');

      // Use search functionality
      await page.fill('input[placeholder="Search users..."]', 'doctor');
      await page.waitForTimeout(1000);

      // Verify search results
      const userRows = await page.$$('tbody tr');
      expect(userRows.length).toBeGreaterThan(0);
    });

    it('should display analytics charts', async () => {
      // Login first
      await page.fill('input[type="email"]', 'admin@telehealth.com');
      await page.fill('input[type="password"]', 'admin123');
      await page.click('button[type="submit"]');
      await page.waitForSelector('text=System Overview');

      // Verify charts are rendered
      const charts = await page.$$('.recharts-wrapper');
      expect(charts.length).toBeGreaterThan(0);

      // Verify chart data is displayed
      expect(await page.isVisible('.recharts-area')).toBeTruthy();
      expect(await page.isVisible('.recharts-bar')).toBeTruthy();
    });
  });

  describe('Cross-Platform Integration', () => {
    it('should maintain session across different apps', async () => {
      // Login to doctor portal
      await page.goto('http://localhost:5173');
      await page.fill('input[type="email"]', 'doctor@telehealth.com');
      await page.fill('input[type="password"]', 'doctor123');
      await page.click('button[type="submit"]');
      await page.waitForSelector('text=Dashboard');

      // Navigate to admin dashboard with same session
      await page.goto('http://localhost:5175');
      
      // Should redirect to login since different role
      await page.waitForSelector('input[type="email"]');
      expect(await page.isVisible('text=Admin Login')).toBeTruthy();
    });

    it('should handle API errors gracefully', async () => {
      // Intercept API calls and return errors
      await page.route('**/api/**', route => {
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Internal Server Error' })
        });
      });

      await page.goto('http://localhost:5173');
      await page.fill('input[type="email"]', 'doctor@telehealth.com');
      await page.fill('input[type="password"]', 'doctor123');
      await page.click('button[type="submit"]');

      // Should show error message
      await page.waitForSelector('text=Login failed');
      expect(await page.isVisible('text=Please try again')).toBeTruthy();
    });

    it('should work offline with service worker', async () => {
      // Enable offline mode
      await context.setOffline(true);

      await page.goto('http://localhost:5174');
      
      // Should show offline indicator or cached content
      await page.waitForTimeout(2000);
      
      // Re-enable online mode
      await context.setOffline(false);
    });
  });

  describe('Performance Tests', () => {
    it('should load pages within acceptable time limits', async () => {
      const startTime = Date.now();
      
      await page.goto('http://localhost:5173');
      await page.waitForSelector('input[type="email"]');
      
      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(3000); // Should load within 3 seconds
    });

    it('should handle large datasets efficiently', async () => {
      // Login to admin dashboard
      await page.goto('http://localhost:5175');
      await page.fill('input[type="email"]', 'admin@telehealth.com');
      await page.fill('input[type="password"]', 'admin123');
      await page.click('button[type="submit"]');
      await page.waitForSelector('text=System Overview');

      // Navigate to users with large dataset
      await page.click('text=Users');
      
      const startTime = Date.now();
      await page.waitForSelector('table tbody tr');
      const renderTime = Date.now() - startTime;
      
      expect(renderTime).toBeLessThan(2000); // Should render within 2 seconds
    });
  });
});

