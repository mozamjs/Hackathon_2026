import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, LogIn, ShieldAlert } from 'lucide-react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import useAuth from '../hooks/useAuth';
import useToast from '../hooks/useToast';

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

  return (
    <div className="mx-auto max-w-md py-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card sm:p-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-600 text-white shadow-sm">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-semibold text-slate-900">Sign in to AwamDesk</h1>
          <p className="mt-1 text-sm text-slate-600">
            Access your citizen reports or municipal officer dashboard.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700">
            <ShieldAlert className="h-4 w-4 flex-shrink-0 text-red-500" />
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
            placeholder="e.g., name@example.gov"
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
            className="mt-2 w-full"
          >
            Sign In
          </Button>
        </form>

        {/* Register Prompt */}
        <div className="mt-6 border-t border-slate-200 pt-6 text-center text-sm text-slate-600">
          Don't have an account?{' '}
          <Link to="/signup" className="font-semibold text-primary-700 underline-offset-2 hover:underline">
            Register as a Citizen
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
