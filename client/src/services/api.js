import axios from 'axios';

const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  const isProductionHost =
    typeof window !== 'undefined' &&
    window.location.hostname !== 'localhost' &&
    window.location.hostname !== '127.0.0.1';

  // On deployed non-localhost environments (e.g. Vercel), never allow a loopback / localhost API URL
  if (isProductionHost) {
    if (!envUrl || envUrl.includes('localhost') || envUrl.includes('127.0.0.1')) {
      return 'https://leaddesk-api-8if3.onrender.com/api';
    }
    return envUrl;
  }

  // Local development environment
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
