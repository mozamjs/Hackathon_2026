import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Home, Compass } from 'lucide-react';
import Button from '../components/common/Button';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
      <div className="w-20 h-20 rounded-3xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-6 shadow-xl shadow-rose-500/5">
        <ShieldAlert className="w-10 h-10" />
      </div>
      <h1 className="text-4xl sm:text-5xl font-black text-slate-100 font-sans tracking-tight mb-2">
        404 — Page Not Found
      </h1>
      <p className="text-sm sm:text-base text-slate-400 max-w-md mb-8">
        The municipal portal page you are looking for does not exist or has been moved.
      </p>

      <div className="flex items-center gap-4">
        <Link to="/">
          <Button variant="primary" size="md" icon={Home}>
            Back to Home
          </Button>
        </Link>
        <Link to="/complaints">
          <Button variant="outline" size="md" icon={Compass}>
            Browse Issues
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
