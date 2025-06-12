import api from './api';

export async function login(email, password) {
  const { data } = await api.post('/auth/login', { email, password });
  return data;
}

export async function validateToken(token) {
  const { data } = await api.get('/auth/profile', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}
