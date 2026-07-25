import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, LockKeyhole } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext.jsx';
import { getError } from '../services/api.js';
const schema = z.object({ email: z.string().email('Enter a valid email address.'), password: z.string().min(8, 'Password must be at least 8 characters.') });
export function LoginPage() {
  const { login, isAuthenticated } = useAuth(); const navigate = useNavigate(); const location = useLocation(); const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });
  if (isAuthenticated) return <Navigate to="/admin/dashboard" replace />;
  async function submit(values) { try { await login(values); toast.success('Welcome back.'); navigate(location.state?.from?.pathname || '/admin/dashboard', { replace: true }); } catch (error) { toast.error(getError(error)); } }
  return <main className="login-page"><Link className="brand login-brand" to="/"><span>✦</span> LeadDesk</Link><section className="login-card"><div className="lock-icon"><LockKeyhole /></div><p className="eyebrow">ADMIN PORTAL</p><h1>Welcome back.</h1><p>Sign in to keep your pipeline moving.</p><form onSubmit={handleSubmit(submit)} noValidate><label>Email address<input type="email" autoComplete="email" placeholder="admin@leaddesk.dev" {...register('email')} /></label>{errors.email && <small className="field-error">{errors.email.message}</small>}<label>Password<input type="password" autoComplete="current-password" placeholder="••••••••" {...register('password')} /></label>{errors.password && <small className="field-error">{errors.password.message}</small>}<button className="button primary full" disabled={isSubmitting}>{isSubmitting ? 'Signing in…' : <>Sign in <ArrowRight size={17} /></>}</button></form></section></main>;
}
