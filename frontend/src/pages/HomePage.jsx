import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  PlusCircle,
  Compass,
  ArrowRight,
  BadgeCheck,
  Car,
  Trash2,
  Droplets,
  Zap,
  FileText,
  Users,
  BriefcaseBusiness,
  CircleCheckBig,
} from 'lucide-react';
import Button from '../components/common/Button';
import ComplaintCard from '../components/complaints/ComplaintCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import complaintService from '../services/complaintService';
import useAuth from '../hooks/useAuth';

export const HomePage = () => {
  const { isOfficer } = useAuth();
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
    { id: 'road', name: 'Roads & Potholes', icon: Car },
    { id: 'garbage', name: 'Waste & Sanitation', icon: Trash2 },
    { id: 'water', name: 'Water & Pipes', icon: Droplets },
    { id: 'electricity', name: 'Power & Lights', icon: Zap },
  ];

  const steps = [
    { title: 'Report', text: 'Describe the issue, location, and urgency in a simple form.' },
    { title: 'Review', text: 'Residents can check existing reports and upvote the most serious problems.' },
    { title: 'Action', text: 'Officers review and prioritize eligible complaints for field response.' },
    { title: 'Resolved', text: 'Track updates and provide feedback once the work is complete.' },
  ];

  return (
    <div className="space-y-12 py-2">
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="grid gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:px-10 lg:py-12">
          <div className="flex flex-col justify-center">
            <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-3 py-1.5 text-xs font-medium text-primary-700">
              <BadgeCheck className="h-3.5 w-3.5" />
              Public service portal
            </div>
            <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              Report Problems. Improve Your Community.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
              Report local civic issues, track progress, and help your community get problems resolved faster.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              {isOfficer ? (
                <Link to="/officer/dashboard">
                  <Button variant="primary" size="lg" icon={ShieldCheck}>Officer Portal</Button>
                </Link>
              ) : (
                <Link to="/complaints/new">
                  <Button variant="primary" size="lg" icon={PlusCircle}>Report a Complaint</Button>
                </Link>
              )}
              <Link to="/complaints">
                <Button variant="outline" size="lg" icon={Compass}>Browse Complaints</Button>
              </Link>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <div className="mb-6 flex items-center justify-between gap-3 border-b border-slate-200 pb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Service Snapshot</p>
                  <h2 className="mt-1 text-xl font-semibold text-slate-900">Civic priorities</h2>
                </div>
                <div className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">Updated today</div>
              </div>
              <div className="space-y-4">
                {[
                  ['Road maintenance', '24 reports'],
                  ['Water supply', '18 reports'],
                  ['Waste collection', '12 reports'],
                  ['Street lighting', '9 reports'],
                ].map(([label, count], idx) => (
                  <div key={label}>
                    <div className="mb-1 flex items-center justify-between text-sm text-slate-600">
                      <span>{label}</span>
                      <span>{count}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-200">
                      <div
                        className="h-2 rounded-full bg-primary-600"
                        style={{ width: `${70 - idx * 10}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="meta-label">Categories</p>
            <h2 className="mt-1 text-2xl font-semibold text-slate-900">Common issues</h2>
          </div>
          <Link to="/complaints" className="inline-flex items-center gap-1 text-sm font-medium text-primary-700 hover:text-primary-800">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {categoriesPreview.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.id}
                to={`/complaints?category=${category.id}`}
                className="rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-slate-300 hover:bg-slate-50"
              >
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">{category.name}</h3>
                <div className="mt-2 inline-flex items-center gap-1 text-sm text-slate-500">
                  Explore reports <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="meta-label">How it works</p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-900">Simple and transparent</h2>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {steps.map((step, index) => (
            <div key={step.title} className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 text-sm font-semibold text-white">
                {index + 1}
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="meta-label">Community attention</p>
            <h2 className="mt-1 text-2xl font-semibold text-slate-900">Trending issues</h2>
          </div>
          <Link to="/complaints?sort=upvotes" className="inline-flex items-center gap-1 text-sm font-medium text-primary-700 hover:text-primary-800">
            View rank <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner message="Loading community complaints..." />
        ) : trendingComplaints.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
            No complaints found right now.
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {trendingComplaints.map((complaint) => (
              <ComplaintCard key={complaint._id} complaint={complaint} onUpvoted={(updated) => setTrendingComplaints((prev) => prev.map((c) => c._id === updated._id ? updated : c))} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
