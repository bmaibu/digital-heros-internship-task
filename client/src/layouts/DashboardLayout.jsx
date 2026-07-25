import { BarChart3, LogOut, Menu, Users, X } from 'lucide-react';
import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export function DashboardLayout() {
  const { admin, logout } = useAuth(); const navigate = useNavigate(); const [open, setOpen] = useState(false);
  function signOut() { logout(); navigate('/admin/login'); }
  const links = [{ to: '/admin/dashboard', label: 'Dashboard', icon: BarChart3 }, { to: '/admin/leads', label: 'Leads', icon: Users }];
  return <div className="admin-shell"><aside className={open ? 'sidebar open' : 'sidebar'}><NavLink className="brand" to="/admin/dashboard"><span>✦</span> LeadDesk</NavLink><div className="sidebar-label">WORKSPACE</div><nav>{links.map(({ to, label, icon: Icon }) => <NavLink end={to.endsWith('dashboard')} key={to} to={to} onClick={() => setOpen(false)}><Icon size={19} />{label}</NavLink>)}</nav><div className="sidebar-bottom"><div className="admin-avatar">{admin?.username?.[0]?.toUpperCase()}</div><div><strong>{admin?.username}</strong><small>Administrator</small></div><button aria-label="Log out" onClick={signOut}><LogOut size={18} /></button></div></aside><div className="admin-content"><header className="admin-header"><button className="mobile-nav" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button><div><span className="header-kicker">GOOD TO SEE YOU</span><h1>{admin?.username}</h1></div><div className="header-date">{new Intl.DateTimeFormat('en', { weekday: 'long', month: 'short', day: 'numeric' }).format(new Date())}</div></header><Outlet /></div></div>;
}
