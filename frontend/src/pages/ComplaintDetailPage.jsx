import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Clock,
  User,
  ShieldCheck,
  Star,
  Flame,
  CheckCircle2,
  AlertTriangle,
  FileEdit,
  ShieldAlert,
} from 'lucide-react';
import CategoryBadge from '../components/common/CategoryBadge';
import PriorityBadge from '../components/common/PriorityBadge';
import StatusBadge from '../components/common/StatusBadge';
import UpvoteButton from '../components/complaints/UpvoteButton';
import StatusTimeline from '../components/complaints/StatusTimeline';
import FeedbackModal from '../components/complaints/FeedbackModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import complaintService from '../services/complaintService';
import { formatDate, formatRelativeTime } from '../utils/formatters';
import { calculatePriority } from '../utils/priority';
import useAuth from '../hooks/useAuth';

export const ComplaintDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isOfficer, isCitizen } = useAuth();

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  const fetchComplaint = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await complaintService.getComplaintById(id);
      if (res?.data) {
        setComplaint(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Complaint not found or invalid ID.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchComplaint();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="py-12">
        <LoadingSpinner message="Retrieving complaint details..." />
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-100">{error || 'Complaint Not Found'}</h2>
        <p className="text-xs text-slate-400">
          The requested complaint ID does not exist or may have been removed.
        </p>
        <Link to="/complaints">
          <Button variant="outline" size="sm" icon={ArrowLeft}>
            Back to Complaints List
          </Button>
        </Link>
      </div>
    );
  }

  const { priority, priorityScore, daysSinceCreated, upvotes } = calculatePriority(complaint);
  const isAuthor =
    user &&
    (complaint.createdBy?._id === user.id ||
      complaint.createdBy === user.id ||
      complaint.createdBy?.id === user.id);

  const canLeaveFeedback =
    complaint.status === 'resolved' &&
    isAuthor &&
    !complaint.feedbackGiven;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to previous page</span>
        </button>

        {isOfficer && (
          <Link to={`/officer/complaints/${complaint._id}`}>
            <Button variant="primary" size="sm" icon={FileEdit}>
              Manage as Officer
            </Button>
          </Link>
        )}
      </div>

      {/* Main Details Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
        {/* Badges & Meta row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5 flex-wrap">
            <CategoryBadge category={complaint.category} size="md" />
            <PriorityBadge priority={priority} priorityScore={priorityScore} size="md" />
          </div>
          <StatusBadge status={complaint.status} size="md" />
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-sans tracking-tight leading-snug">
          {complaint.title}
        </h1>

        {/* Sub-meta details bar */}
        <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-xs text-slate-400 p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center gap-1.5 text-slate-200 font-medium">
            <MapPin className="w-4 h-4 text-brand-400" />
            <span>{complaint.area}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <User className="w-4 h-4 text-slate-400" />
            <span>Submitted by: </span>
            <strong className="text-slate-200">
              {complaint.createdBy?.name || 'Citizen'}
            </strong>
          </div>

          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>Logged: </span>
            <strong className="text-slate-200">{formatDate(complaint.createdAt)}</strong>
            <span className="text-slate-500">({formatRelativeTime(complaint.createdAt)})</span>
          </div>
        </div>

        {/* Full Description */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Issue Description
          </h3>
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed whitespace-pre-line bg-slate-950/50 p-5 rounded-2xl border border-slate-800/80">
            {complaint.description}
          </p>
        </div>

        {/* Interactive Upvote & Priority Computation Box */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-brand-400 uppercase tracking-wider block">
              Civic Engagement & Urgency Metric
            </span>
            <p className="text-xs text-slate-400 mt-0.5">
              Score: <strong className="text-slate-200">{priorityScore}</strong> = ({upvotes} upvotes × 2) + {daysSinceCreated} days active
            </p>
          </div>

          <div className="flex items-center gap-3">
            <UpvoteButton
              complaint={complaint}
              onUpvoted={(updated) => setComplaint(updated)}
              size="lg"
            />
          </div>
        </div>

        {/* Citizen Feedback Banner */}
        {complaint.status === 'resolved' && (
          <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-100 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 font-bold text-sm text-emerald-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Municipal Resolution Verified</span>
              </div>

              {canLeaveFeedback && (
                <Button
                  onClick={() => setIsFeedbackModalOpen(true)}
                  variant="accent"
                  size="sm"
                  icon={Star}
                >
                  Rate This Resolution
                </Button>
              )}
            </div>

            {complaint.feedbackGiven ? (
              <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-500/20 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < complaint.feedbackRating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-amber-300">
                    {complaint.feedbackRating} / 5 Stars
                  </span>
                  <span className="text-xs text-slate-400">by Citizen Author</span>
                </div>
                {complaint.feedbackComment && (
                  <p className="text-xs text-slate-300 italic">
                    "{complaint.feedbackComment}"
                  </p>
                )}
              </div>
            ) : (
              <p className="text-xs text-emerald-300/80">
                This issue was fixed by the municipal team. Feedback has not yet been provided by the author.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Audit Timeline */}
      <StatusTimeline complaint={complaint} />

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        complaint={complaint}
        onFeedbackSubmitted={(updated) => setComplaint(updated)}
      />
    </div>
  );
};

export default ComplaintDetailPage;
