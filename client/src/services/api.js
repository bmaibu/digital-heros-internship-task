import axios from 'axios';

const PRODUCTION_API_URL = 'https://leaddesk-api-8if3.onrender.com/api';

const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL?.trim();
  const isLoopbackUrl = /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(?::\d+)?(?:\/|$)/i.test(envUrl || '');

  // Vite replaces PROD at build time. A deployed bundle must never be able to
  // direct a visitor's browser to its own localhost address.
  if (import.meta.env.PROD) return !envUrl || isLoopbackUrl ? PRODUCTION_API_URL : envUrl.replace(/\/$/, '');

  return envUrl || 'http://localhost:5005/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('leaddesk_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getError = (error) => error.response?.data?.message || 'Something went wrong. Please try again.';
export default api;
