import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  PlusCircle,
  Compass,
  ArrowRight,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  Users,
  Flame,
  Clock,
  Layers,
  Car,
  Trash2,
  Droplets,
  Zap,
  HelpCircle,
} from 'lucide-react';
import Button from '../components/common/Button';
import ComplaintCard from '../components/complaints/ComplaintCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import complaintService from '../services/complaintService';
import useAuth from '../hooks/useAuth';

export const HomePage = () => {
  const { isAuthenticated, isOfficer } = useAuth();
  const [trendingComplaints, setTrendingComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopComplaints = async () => {
      try {
        const res = await complaintService.getComplaints({ sort: 'upvotes' });
        if (res?.data) {
          setTrendingComplaints(res.data.slice(0, 6));
        }
      } catch (err) {
        console.error('Failed to fetch home complaints:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTopComplaints();
  }, []);

  const categoriesPreview = [
    { id: 'road', name: 'Roads & Potholes', icon: Car, color: 'from-amber-500/20 to-amber-600/10 text-amber-400 border-amber-500/30' },
    { id: 'garbage', name: 'Garbage & Sanitation', icon: Trash2, color: 'from-emerald-500/20 to-emerald-600/10 text-emerald-400 border-emerald-500/30' },
    { id: 'water', name: 'Water & Pipelines', icon: Droplets, color: 'from-cyan-500/20 to-cyan-600/10 text-cyan-400 border-cyan-500/30' },
    { id: 'electricity', name: 'Power & Lights', icon: Zap, color: 'from-yellow-500/20 to-yellow-600/10 text-yellow-400 border-yellow-500/30' },
  ];

  return (
    <div className="space-y-16 py-4">
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden glass-card border border-slate-800 p-8 sm:p-12 lg:p-16 text-center">
        {/* Glow ambient background elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-brand-600/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -top-10 right-10 w-72 h-72 bg-emerald-600/10 rounded-full blur-[90px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-semibold shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Assisted Municipal Resolution Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-100 tracking-tight font-sans leading-tight">
            Fix Your City.{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-400 via-indigo-300 to-emerald-400">
              Together.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Report municipal hazards, upvote neighborhood issues to increase priority urgency, and track real-time repairs with verified officer dispatch and citizen feedback.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            {isOfficer ? (
              <Link to="/officer/dashboard">
                <Button size="lg" variant="primary" icon={ShieldCheck}>
                  Go to Officer Portal
                </Button>
              </Link>
            ) : (
              <Link to="/complaints/new">
                <Button size="lg" variant="accent" icon={PlusCircle}>
                  Report an Issue
                </Button>
              </Link>
            )}

            <Link to="/complaints">
              <Button size="lg" variant="outline" icon={Compass}>
                Browse Community Feed
              </Button>
            </Link>
          </div>

          {/* Micro Stats Bar */}
          <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-800/80 max-w-lg mx-auto">
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-100 font-sans">100%</div>
              <div className="text-[11px] text-slate-400 font-medium">Public Transparency</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-brand-400 font-sans">Dynamic</div>
              <div className="text-[11px] text-slate-400 font-medium">Priority Formula</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-emerald-400 font-sans">Gemini AI</div>
              <div className="text-[11px] text-slate-400 font-medium">Officer Briefings</div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Quick Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-100">Municipal Categories</h2>
            <p className="text-xs text-slate-400">Quickly explore or file issues by civic domain</p>
          </div>
          <Link
            to="/complaints"
            className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categoriesPreview.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.id}
                to={`/complaints?category=${cat.id}`}
                className={`p-5 rounded-2xl bg-gradient-to-br ${cat.color} border hover:scale-[1.02] transition-all flex items-center gap-4 group shadow-sm`}
              >
                <div className="w-12 h-12 rounded-xl bg-slate-900/90 border border-current flex items-center justify-center flex-shrink-0 group-hover:rotate-6 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-100">{cat.name}</h3>
                  <span className="text-xs text-slate-400 flex items-center gap-1 group-hover:text-white transition-colors">
                    Explore reports <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* How it Works 3-Step Section */}
      <section className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800 space-y-8">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-100">How CivicFix Operates</h2>
          <p className="text-xs text-slate-400 mt-1">
            Transforming municipal grievance handling with democratic upvoting and AI triage
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-600/20 border border-brand-500/30 text-brand-400 font-black flex items-center justify-center text-base">
              1
            </div>
            <h3 className="text-base font-bold text-slate-100">Citizen Submits</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Citizens submit municipal issues with location data. Real-time duplicate detection suggests existing active tickets to prevent spam.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600/20 border border-amber-500/30 text-amber-400 font-black flex items-center justify-center text-base">
              2
            </div>
            <h3 className="text-base font-bold text-slate-100">Community Prioritizes</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Neighbors upvote shared problems. The dynamic algorithm computes urgency score: <code className="text-amber-300 font-mono">(upvotes × 2) + age</code>.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 font-black flex items-center justify-center text-base">
              3
            </div>
            <h3 className="text-base font-bold text-slate-100">Officer Fixes & Verifies</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Officers triage critical bottlenecks with AI summaries, dispatch maintenance units, and receive 1-5 star citizen feedback upon resolution.
            </p>
          </div>
        </div>
      </section>

      {/* Trending Community Issues Section */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-rose-500 animate-pulse" />
              <h2 className="text-xl font-bold text-slate-100">Trending & High Priority Issues</h2>
            </div>
            <p className="text-xs text-slate-400">
              Community issues with highest citizen upvotes and urgent municipal priority
            </p>
          </div>

          <Link to="/complaints?sort=upvotes">
            <Button variant="ghost" size="sm">
              <span>View All Ranked Issues</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner message="Fetching community complaints..." />
        ) : trendingComplaints.length === 0 ? (
          <div className="p-8 text-center glass-panel rounded-2xl text-slate-400 text-sm">
            No complaints found. Be the first to report an issue!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingComplaints.map((complaint) => (
              <ComplaintCard
                key={complaint._id}
                complaint={complaint}
                onUpvoted={(updated) => {
                  setTrendingComplaints((prev) =>
                    prev.map((c) => (c._id === updated._id ? updated : c))
                  );
                }}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
