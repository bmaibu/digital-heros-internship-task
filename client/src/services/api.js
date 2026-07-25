import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://leaddesk-api-8if3.onrender.com/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('leaddesk_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getError = (error) => error.response?.data?.message || 'Something went wrong. Please try again.';
export default api;
