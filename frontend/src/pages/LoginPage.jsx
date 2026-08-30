import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, LogIn, Sparkles, User, ShieldAlert } from 'lucide-react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import useAuth from '../hooks/useAuth';
import useToast from '../hooks/useToast';
import { DEMO_USERS } from '../utils/constants';

export const LoginPage = () => {
  const { login } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please fill in both email and password.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    try {
      const user = await login(email, password);
      success(`Welcome back, ${user.name}!`);

      if (from) {
        navigate(from, { replace: true });
      } else if (user.role === 'officer') {
        navigate('/officer/dashboard', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      const msg =
        err.response?.data?.message || 'Invalid email or password. Please try again.';
      setErrorMessage(msg);
      toastError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (demo) => {
    setEmail(demo.email);
    setPassword(demo.password);
    setErrorMessage('');
  };

  return (
    <div className="max-w-md mx-auto py-8">
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white mx-auto mb-3 shadow-lg shadow-brand-500/25">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-slate-100 font-sans">Sign In to CivicFix</h1>
          <p className="text-xs text-slate-400 mt-1">
            Access your citizen reports or municipal officer dashboard
          </p>
        </div>

        {/* Quick Demo Accounts Selection */}
        <div className="mb-6 p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-300 mb-2.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Quick Demo Accounts (1-Click)</span>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {DEMO_USERS.map((demo) => {
              const isOfficer = demo.role === 'officer';
              return (
                <button
                  key={demo.email}
                  type="button"
                  onClick={() => handleDemoLogin(demo)}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 transition-all text-left group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{isOfficer ? '👮' : '👤'}</span>
                    <div>
                      <div className="text-xs font-bold text-slate-200 group-hover:text-white">
                        {demo.name}
                      </div>
                      <div className="text-[10px] text-slate-400">{demo.email}</div>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      isOfficer
                        ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                        : 'bg-brand-500/15 text-brand-300 border-brand-500/30'
                    }`}
                  >
                    {demo.tag}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            icon={Mail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g., ahmed@civicfix.demo"
            required
          />

          <Input
            label="Password"
            type="password"
            icon={Lock}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            icon={LogIn}
            className="w-full mt-2"
          >
            Sign In
          </Button>
        </form>

        {/* Register Prompt */}
        <div className="text-center mt-6 pt-6 border-t border-slate-800 text-xs text-slate-400">
          Don't have an account?{' '}
          <Link to="/signup" className="text-brand-400 hover:text-brand-300 font-semibold underline">
            Register as a Citizen
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
