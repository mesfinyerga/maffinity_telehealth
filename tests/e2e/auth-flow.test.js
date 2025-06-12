const axios = require('axios');
const baseURL = process.env.TEST_API_BASE_URL || 'http://localhost:3000/api/v1';

describe('User authentication flow', () => {
  it('registers, logs in and loads profile', async () => {
    const email = `user${Date.now()}@test.com`;
    const password = 'testpass';

    // register
    const registerRes = await axios.post(`${baseURL}/auth/register`, {
      email,
      password,
      firstName: 'Test',
      lastName: 'User',
      role: 'patient'
    });
    expect(registerRes.status).toBe(201);
    expect(registerRes.data).toHaveProperty('accessToken');

    // login
    const loginRes = await axios.post(`${baseURL}/auth/login`, { email, password });
    expect(loginRes.status).toBe(201 || 200);
    const token = loginRes.data.accessToken;
    expect(token).toBeTruthy();

    // profile
    const profileRes = await axios.get(`${baseURL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    expect(profileRes.status).toBe(200);
    expect(profileRes.data.email).toBe(email);
  });
});
