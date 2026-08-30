import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useToast from '../hooks/useToast';
import {
  ShieldCheck,
  PlusCircle,
  FolderOpen,
  LayoutDashboard,
  LogOut,
  User,
  Menu,
  X,
  Compass,
} from 'lucide-react';
import Button from '../components/common/Button';

export const Navbar = () => {
  const { user, isAuthenticated, isOfficer, isCitizen, logout } = useAuth();
  const { info } = useToast();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    info('You have been logged out successfully.');
    navigate('/');
    setMobileMenuOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
      isActive
        ? 'bg-primary-50 text-primary-700'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 text-white shadow-sm">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-slate-900">CivicFix</span>
                <span className="rounded border border-primary-200 bg-primary-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary-700">
                  Portal
                </span>
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            <NavLink to="/" className={navLinkClass}>Home</NavLink>
            <NavLink to="/complaints" className={navLinkClass}>
              <Compass className="h-4 w-4" />
              Browse Complaints
            </NavLink>

            {isAuthenticated && isCitizen && (
              <>
                <NavLink to="/dashboard" className={navLinkClass}>
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </NavLink>
                <NavLink to="/complaints/mine" className={navLinkClass}>
                  <FolderOpen className="h-4 w-4" />
                  My Complaints
                </NavLink>
                <NavLink to="/complaints/new" className={navLinkClass}>
                  <PlusCircle className="h-4 w-4" />
                  Report
                </NavLink>
              </>
            )}

            {isAuthenticated && isOfficer && (
              <NavLink to="/officer/dashboard" className={navLinkClass}>
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </NavLink>
            )}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary-100 text-primary-700">
                    {isOfficer ? 'O' : <User className="h-4 w-4" />}
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-semibold text-slate-900">{user?.name || 'User'}</div>
                    <div className="text-[10px] uppercase tracking-[0.08em] text-slate-500">{user?.role}</div>
                  </div>
                </div>
                <Button onClick={handleLogout} variant="ghost" size="sm" className="gap-1.5 text-slate-700">
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </Link>
                <Link to="/signup">
                  <Button variant="primary" size="sm">Register</Button>
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-md p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            <NavLink to="/" onClick={() => setMobileMenuOpen(false)} className={navLinkClass}>Home</NavLink>
            <NavLink to="/complaints" onClick={() => setMobileMenuOpen(false)} className={navLinkClass}>
              <Compass className="h-4 w-4" />Browse Complaints
            </NavLink>

            {isAuthenticated && isCitizen && (
              <>
                <NavLink to="/dashboard" onClick={() => setMobileMenuOpen(false)} className={navLinkClass}>
                  <LayoutDashboard className="h-4 w-4" />Dashboard
                </NavLink>
                <NavLink to="/complaints/mine" onClick={() => setMobileMenuOpen(false)} className={navLinkClass}>
                  <FolderOpen className="h-4 w-4" />My Complaints
                </NavLink>
                <NavLink to="/complaints/new" onClick={() => setMobileMenuOpen(false)} className={navLinkClass}>
                  <PlusCircle className="h-4 w-4" />Report Complaint
                </NavLink>
              </>
            )}

            {isAuthenticated && isOfficer && (
              <NavLink to="/officer/dashboard" onClick={() => setMobileMenuOpen(false)} className={navLinkClass}>
                <LayoutDashboard className="h-4 w-4" />Officer Dashboard
              </NavLink>
            )}

            <div className="mt-2 border-t border-slate-200 pt-3">
              {isAuthenticated ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary-100 text-primary-700 text-sm font-semibold">
                      {isOfficer ? 'O' : user?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{user?.name}</div>
                      <div className="text-[10px] uppercase tracking-[0.08em] text-slate-500">{user?.role}</div>
                    </div>
                  </div>
                  <Button onClick={handleLogout} variant="danger" size="sm">Logout</Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full">Sign In</Button>
                  </Link>
                  <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="primary" size="sm" className="w-full">Register</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
