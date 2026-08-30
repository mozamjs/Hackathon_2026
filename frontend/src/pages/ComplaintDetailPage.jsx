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
      <div className="mx-auto max-w-md py-16 text-center space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-red-200 bg-red-50 text-red-600">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-semibold text-slate-900">{error || 'Complaint Not Found'}</h2>
        <p className="text-xs text-slate-600">
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
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 transition-colors hover:text-slate-900"
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
      <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-card sm:p-8">
        {/* Badges & Meta row */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <CategoryBadge category={complaint.category} size="md" />
            <PriorityBadge priority={priority} priorityScore={priorityScore} size="md" />
          </div>
          <StatusBadge status={complaint.status} size="md" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold leading-snug text-slate-900 sm:text-3xl">
          {complaint.title}
        </h1>

        {/* Sub-meta details bar */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
          <div className="flex items-center gap-1.5 font-medium text-slate-800">
            <MapPin className="h-4 w-4 text-primary-600" />
            <span>{complaint.area}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <User className="h-4 w-4 text-slate-500" />
            <span>Submitted by: </span>
            <strong className="text-slate-800">
              {complaint.createdBy?.name || 'Citizen'}
            </strong>
          </div>

          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-slate-500" />
            <span>Logged: </span>
            <strong className="text-slate-800">{formatDate(complaint.createdAt)}</strong>
            <span className="text-slate-500">({formatRelativeTime(complaint.createdAt)})</span>
          </div>
        </div>

        {/* Full Description */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
            Issue Description
          </h3>
          <p className="whitespace-pre-line rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-relaxed text-slate-700 sm:text-base">
            {complaint.description}
          </p>
        </div>

        {complaint.imageUrl && (
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              Submitted Image
            </h3>
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-2">
              <img
                src={complaint.imageUrl}
                alt={complaint.title}
                className="h-80 w-full rounded-xl object-cover"
              />
            </div>
          </div>
        )}

        {/* Interactive Upvote & Priority Computation Box */}
        <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:flex-row sm:items-center">
          <div>
            <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-primary-700">
              Civic Engagement & Urgency Metric
            </span>
            <p className="mt-0.5 text-xs text-slate-600">
              Score: <strong className="text-slate-800">{priorityScore}</strong> = ({upvotes} upvotes × 2) + {daysSinceCreated} days active
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
          <div className="space-y-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-800">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-800">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
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
              <div className="space-y-2 rounded-xl border border-emerald-200 bg-white p-4">
                <div className="flex items-center gap-2">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < complaint.feedbackRating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-amber-700">
                    {complaint.feedbackRating} / 5 Stars
                  </span>
                  <span className="text-xs text-slate-500">by Citizen Author</span>
                </div>
                {complaint.feedbackComment && (
                  <p className="text-xs italic text-slate-600">
                    "{complaint.feedbackComment}"
                  </p>
                )}
              </div>
            ) : (
              <p className="text-xs text-emerald-700">
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
