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
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-card sm:flex-row sm:items-center sm:p-8">
        <div>
          <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-primary-700">
            <LayoutDashboard className="h-4 w-4" />
            <span>Citizen Control Center</span>
          </div>
          <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
            Welcome back, {user?.name || 'Citizen'}
          </h1>
          <p className="mt-1 text-sm text-slate-600">
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
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
            Total Filed
          </span>
          <div className="mt-1 text-2xl font-semibold text-slate-900">{total}</div>
          <span className="text-[10px] text-slate-500">Your total submissions</span>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <span className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-amber-700">
            <Clock className="w-3.5 h-3.5" /> Pending
          </span>
          <div className="mt-1 text-2xl font-semibold text-amber-800">{pending}</div>
          <span className="text-[10px] text-amber-700/80">Awaiting triage</span>
        </div>

        <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4">
          <span className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-sky-700">
            <RefreshCw className="w-3.5 h-3.5" /> In Progress
          </span>
          <div className="mt-1 text-2xl font-semibold text-sky-800">{inProgress}</div>
          <span className="text-[10px] text-sky-700/80">Field units active</span>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <span className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-700">
            <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
          </span>
          <div className="mt-1 text-2xl font-semibold text-emerald-800">{resolved}</div>
          <span className="text-[10px] text-emerald-700/80">Repairs completed</span>
        </div>

        <div className="col-span-2 rounded-2xl border border-primary-200 bg-primary-50 p-4 lg:col-span-1">
          <span className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-primary-700">
            <ThumbsUp className="w-3.5 h-3.5" /> Upvotes
          </span>
          <div className="mt-1 text-2xl font-semibold text-primary-800">{totalUpvotes}</div>
          <span className="text-[10px] text-primary-700/80">Community support</span>
        </div>
      </div>

      {/* Actionable Pending Feedback Alert */}
      {pendingFeedbackList.length > 0 && (
        <div className="flex flex-col justify-between gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3">
            <Star className="mt-0.5 h-6 w-6 flex-shrink-0 fill-amber-400 text-amber-500" />
            <div>
              <h3 className="text-sm font-semibold text-emerald-800">
                Action Required: {pendingFeedbackList.length} Resolved Issue{pendingFeedbackList.length > 1 ? 's' : ''} Awaiting Your Review!
              </h3>
              <p className="mt-0.5 text-xs text-emerald-700">
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
            <h2 className="text-lg font-semibold text-slate-900">My Recent Reports</h2>
            <p className="text-xs text-slate-600">Issues you submitted to the municipal registry</p>
          </div>

          {complaints.length > 0 && (
            <Link
              to="/complaints/mine"
              className="flex items-center gap-1 text-xs font-semibold text-primary-700 hover:text-primary-800"
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
            title="No complaints yet"
            description="Your reported issues will appear here once you submit your first complaint."
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
