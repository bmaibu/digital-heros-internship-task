import { createContext, useContext, useState } from 'react';
import api from '../services/api.js';
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => JSON.parse(localStorage.getItem('leaddesk_admin') || 'null'));
  async function login(credentials) { const { data } = await api.post('/auth/login', credentials); localStorage.setItem('leaddesk_token', data.token); localStorage.setItem('leaddesk_admin', JSON.stringify(data.admin)); setAdmin(data.admin); }
  function logout() { localStorage.removeItem('leaddesk_token'); localStorage.removeItem('leaddesk_admin'); setAdmin(null); }
  return <AuthContext.Provider value={{ admin, login, logout, isAuthenticated: Boolean(admin) }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
