import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  FolderOpen,
  Clock,
  RefreshCw,
  CheckCircle2,
  ThumbsUp,
  Star,
  ArrowRight,
  AlertCircle,
  Compass,
} from 'lucide-react';
import Button from '../components/common/Button';
import ComplaintCard from '../components/complaints/ComplaintCard';
import FeedbackModal from '../components/complaints/FeedbackModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import complaintService from '../services/complaintService';
import useAuth from '../hooks/useAuth';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaintForFeedback, setSelectedComplaintForFeedback] = useState(null);

  const fetchMyComplaints = async () => {
    try {
      const res = await complaintService.getMyComplaints();
      if (res?.data) {
        setComplaints(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch personal complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyComplaints();
  }, []);

  // Compute metrics
  const total = complaints.length;
  const pending = complaints.filter((c) => c.status === 'pending').length;
  const inProgress = complaints.filter((c) => c.status === 'in-progress').length;
  const resolved = complaints.filter((c) => c.status === 'resolved').length;
  const totalUpvotes = complaints.reduce((sum, c) => sum + (c.upvotes || 0), 0);
  const pendingFeedbackList = complaints.filter(
    (c) => c.status === 'resolved' && !c.feedbackGiven
  );

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-brand-400 text-xs font-bold uppercase tracking-wider mb-1">
            <LayoutDashboard className="w-4 h-4" />
            <span>Citizen Control Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-sans">
            Welcome back, {user?.name || 'Citizen'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track your submitted municipal complaints, civic upvotes, and resolution statuses.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/complaints/new">
            <Button variant="accent" size="md" icon={PlusCircle}>
              Report New Issue
            </Button>
          </Link>
          <Link to="/complaints">
            <Button variant="outline" size="md" icon={Compass}>
              Community Feed
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="glass-panel p-4 rounded-2xl border border-slate-800">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Total Filed
          </span>
          <div className="text-2xl font-black text-slate-100 font-sans mt-1">{total}</div>
          <span className="text-[10px] text-slate-500">Your total submissions</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-amber-500/20 bg-amber-500/5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Pending
          </span>
          <div className="text-2xl font-black text-amber-300 font-sans mt-1">{pending}</div>
          <span className="text-[10px] text-slate-400">Awaiting triage</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-sky-500/20 bg-sky-500/5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1">
            <RefreshCw className="w-3.5 h-3.5" /> In Progress
          </span>
          <div className="text-2xl font-black text-sky-300 font-sans mt-1">{inProgress}</div>
          <span className="text-[10px] text-slate-400">Field units active</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
          </span>
          <div className="text-2xl font-black text-emerald-300 font-sans mt-1">{resolved}</div>
          <span className="text-[10px] text-slate-400">Repairs completed</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-brand-500/20 bg-brand-500/5 col-span-2 lg:col-span-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-400 flex items-center gap-1">
            <ThumbsUp className="w-3.5 h-3.5" /> Upvotes
          </span>
          <div className="text-2xl font-black text-brand-300 font-sans mt-1">{totalUpvotes}</div>
          <span className="text-[10px] text-slate-400">Community support</span>
        </div>
      </div>

      {/* Actionable Pending Feedback Alert */}
      {pendingFeedbackList.length > 0 && (
        <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-300">
          <div className="flex items-start gap-3">
            <Star className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5 fill-amber-400" />
            <div>
              <h3 className="text-sm font-bold text-emerald-200">
                Action Required: {pendingFeedbackList.length} Resolved Issue{pendingFeedbackList.length > 1 ? 's' : ''} Awaiting Your Review!
              </h3>
              <p className="text-xs text-emerald-300/80 mt-0.5">
                The municipal team marked your complaint resolved. Rate their repair quality to help maintain civic accountability.
              </p>
            </div>
          </div>
          <Button
            onClick={() => setSelectedComplaintForFeedback(pendingFeedbackList[0])}
            variant="accent"
            size="sm"
            className="flex-shrink-0"
          >
            <span>Rate First Resolution</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}

      {/* Recent Submissions Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-100">My Recent Reports</h2>
            <p className="text-xs text-slate-400">Issues you submitted to the municipal registry</p>
          </div>

          {complaints.length > 0 && (
            <Link
              to="/complaints/mine"
              className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1"
            >
              <span>View All ({complaints.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {loading ? (
          <LoadingSpinner message="Loading your dashboard data..." />
        ) : complaints.length === 0 ? (
          <EmptyState
            title="No complaints filed yet"
            description="You haven't reported any civic issues yet. Notice a pothole, broken streetlight, or garbage backlog? File a report now!"
            actionLabel="Report Your First Issue"
            onAction={() => (window.location.href = '/complaints/new')}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {complaints.slice(0, 6).map((complaint) => (
              <ComplaintCard
                key={complaint._id}
                complaint={complaint}
                onUpvoted={(updated) => {
                  setComplaints((prev) =>
                    prev.map((c) => (c._id === updated._id ? updated : c))
                  );
                }}
                onLeaveFeedback={(c) => setSelectedComplaintForFeedback(c)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={Boolean(selectedComplaintForFeedback)}
        onClose={() => setSelectedComplaintForFeedback(null)}
        complaint={selectedComplaintForFeedback}
        onFeedbackSubmitted={(updated) => {
          setComplaints((prev) =>
            prev.map((c) => (c._id === updated._id ? updated : c))
          );
        }}
      />
    </div>
  );
};

export default DashboardPage;
