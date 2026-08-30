import React from 'react';
import { ShieldCheck, Heart, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/60 backdrop-blur-lg mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1 */}
          <div className="md:col-span-2 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg text-white">CivicFix</span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm">
              Empowering civic participation through community transparency, intelligent prioritization, and direct municipal officer accountability.
            </p>
            <div className="flex items-center gap-2 text-xs text-brand-400 bg-brand-500/10 border border-brand-500/20 px-3 py-1.5 rounded-lg w-fit mt-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Powered by Gemini AI for Officer Briefings</span>
            </div>
          </div>

          {/* Col 2 */}
          <div className="flex flex-col gap-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Navigation</h4>
            <Link to="/" className="text-sm text-slate-400 hover:text-slate-200 transition-colors">
              Home
            </Link>
            <Link to="/complaints" className="text-sm text-slate-400 hover:text-slate-200 transition-colors">
              Browse Community Issues
            </Link>
            <Link to="/complaints/new" className="text-sm text-slate-400 hover:text-slate-200 transition-colors">
              Report an Issue
            </Link>
          </div>

          {/* Col 3 */}
          <div className="flex flex-col gap-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Portals & Roles</h4>
            <Link to="/login" className="text-sm text-slate-400 hover:text-slate-200 transition-colors">
              Citizen Portal
            </Link>
            <Link to="/login" className="text-sm text-slate-400 hover:text-slate-200 transition-colors">
              Municipal Officer Login
            </Link>
            <Link to="/signup" className="text-sm text-slate-400 hover:text-slate-200 transition-colors">
              Register Account
            </Link>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} CivicFix Portal. Built for municipal transparency & civic collaboration.</p>
          <div className="flex items-center gap-1">
            <span>Dynamic priority formula: (upvotes × 2) + age</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
