import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Home, Compass } from 'lucide-react';
import Button from '../components/common/Button';

export const NotFoundPage = () => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-8 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-red-200 bg-red-50 text-red-600 shadow-sm">
        <ShieldAlert className="h-10 w-10" />
      </div>
      <h1 className="mb-2 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
        404 — Page Not Found
      </h1>
      <p className="mb-8 max-w-md text-sm text-slate-600 sm:text-base">
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
