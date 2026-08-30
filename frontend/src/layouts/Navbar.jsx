import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useToast from '../hooks/useToast';
import {
  ShieldCheck,
  PlusCircle,
  FolderOpen,
  LayoutDashboard,
  FileText,
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
    `flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
      isActive
        ? 'bg-brand-600/20 text-brand-400 border border-brand-500/30'
        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
    }`;

  return (
    <header className="sticky top-0 z-40 glass-header border-b border-slate-800/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/25 group-hover:scale-105 transition-transform duration-200">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-brand-300 font-sans">
                  CivicFix
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-500/20 text-brand-300 px-1.5 py-0.5 rounded border border-brand-500/30">
                  Portal
                </span>
              </div>
              <span className="text-[11px] text-slate-400 -mt-1 hidden sm:block">
                Citizen Resolution Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5">
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/complaints" className={navLinkClass}>
              <Compass className="w-4 h-4" />
              <span>Browse Issues</span>
            </NavLink>

            {isAuthenticated && isCitizen && (
              <>
                <NavLink to="/dashboard" className={navLinkClass}>
                  <LayoutDashboard className="w-4 h-4" />
                  <span>My Dashboard</span>
                </NavLink>
                <NavLink to="/complaints/mine" className={navLinkClass}>
                  <FolderOpen className="w-4 h-4" />
                  <span>My Complaints</span>
                </NavLink>
                <NavLink
                  to="/complaints/new"
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600/30 transition-all ml-1 shadow-sm"
                >
                  <PlusCircle className="w-4 h-4 text-emerald-400" />
                  <span>Report Issue</span>
                </NavLink>
              </>
            )}

            {isAuthenticated && isOfficer && (
              <>
                <NavLink to="/officer/dashboard" className={navLinkClass}>
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Officer Portal</span>
                </NavLink>
              </>
            )}
          </nav>

          {/* User / Auth Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2.5 px-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-xl">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                      isOfficer
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                    }`}
                  >
                    {isOfficer ? '👮' : <User className="w-4 h-4" />}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-slate-200 leading-tight">
                      {user?.name || 'User'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium capitalize">
                      {user?.role}
                    </span>
                  </div>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 hover:text-rose-400 hover:bg-rose-950/30"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="primary" size="sm">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-slate-800 p-4 animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col gap-2">
            <NavLink
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={navLinkClass}
            >
              Home
            </NavLink>
            <NavLink
              to="/complaints"
              onClick={() => setMobileMenuOpen(false)}
              className={navLinkClass}
            >
              <Compass className="w-4 h-4" />
              <span>Browse Issues</span>
            </NavLink>

            {isAuthenticated && isCitizen && (
              <>
                <NavLink
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className={navLinkClass}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>My Dashboard</span>
                </NavLink>
                <NavLink
                  to="/complaints/mine"
                  onClick={() => setMobileMenuOpen(false)}
                  className={navLinkClass}
                >
                  <FolderOpen className="w-4 h-4" />
                  <span>My Complaints</span>
                </NavLink>
                <NavLink
                  to="/complaints/new"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-semibold bg-emerald-600/20 text-emerald-300 border border-emerald-500/30"
                >
                  <PlusCircle className="w-4 h-4 text-emerald-400" />
                  <span>Report New Issue</span>
                </NavLink>
              </>
            )}

            {isAuthenticated && isOfficer && (
              <NavLink
                to="/officer/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className={navLinkClass}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Officer Dashboard</span>
              </NavLink>
            )}

            <div className="pt-3 mt-2 border-t border-slate-800">
              {isAuthenticated ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-brand-500/20 text-brand-300 border border-brand-500/30 flex items-center justify-center font-bold text-xs">
                      {isOfficer ? '👮' : user?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-200">{user?.name}</div>
                      <div className="text-xs text-slate-400 capitalize">{user?.role}</div>
                    </div>
                  </div>
                  <Button
                    onClick={handleLogout}
                    variant="danger"
                    size="sm"
                    className="text-xs"
                  >
                    <LogOut className="w-3.5 h-3.5 mr-1" />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="primary" size="sm" className="w-full">
                      Register
                    </Button>
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
