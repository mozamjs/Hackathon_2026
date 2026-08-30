import React from 'react';
import { Link } from 'react-router-dom';
import BrandMark from '../components/common/BrandMark';

export const Footer = () => {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="mb-3 flex items-center gap-3">
              <BrandMark className="h-10 w-10" />
              <div>
                <div className="text-lg font-semibold tracking-[-0.04em] text-slate-900">AwamDesk</div>
                <div className="text-[9px] font-medium uppercase tracking-[0.16em] text-slate-500">Report. Track. Improve.</div>
              </div>
            </div>
            <p className="max-w-md text-sm text-slate-600">
              Empowering residents to report issues, follow progress, and hold public services accountable.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Navigation</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link to="/" className="hover:text-slate-900">Home</Link></li>
              <li><Link to="/complaints" className="hover:text-slate-900">Browse Complaints</Link></li>
              <li><Link to="/complaints/new" className="hover:text-slate-900">Report a Complaint</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Accounts</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link to="/login" className="hover:text-slate-900">Citizen Portal</Link></li>
              <li><Link to="/login" className="hover:text-slate-900">Officer Login</Link></li>
              <li><Link to="/signup" className="hover:text-slate-900">Register</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-200 pt-5 text-sm text-slate-500">
          © {new Date().getFullYear()} AwamDesk. Built for municipal transparency and civic collaboration.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
