import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ShieldCheck,
  MapPin,
  Clock,
  User,
  Star,
  CheckCircle2,
  FileEdit,
  Send,
  AlertTriangle,
  Flame,
  MessageSquare,
} from 'lucide-react';
import CategoryBadge from '../../components/common/CategoryBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import StatusBadge from '../../components/common/StatusBadge';
import StatusTimeline from '../../components/complaints/StatusTimeline';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import Select from '../../components/common/Select';
import Textarea from '../../components/common/Textarea';
import useToast from '../../hooks/useToast';
import complaintService from '../../services/complaintService';
import { formatDate, formatRelativeTime } from '../../utils/formatters';
import { calculatePriority } from '../../utils/priority';

export const OfficerComplaintDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Status update form state
  const [status, setStatus] = useState('pending');
  const [remark, setRemark] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchComplaint = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await complaintService.getComplaintById(id);
      if (res?.data) {
        setComplaint(res.data);
        setStatus(res.data.status || 'pending');
        setRemark(res.data.officerRemark || '');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Complaint not found.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchComplaint();
    }
  }, [id]);

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!complaint?._id) return;

    setUpdating(true);
    try {
      const res = await complaintService.updateComplaintStatus(complaint._id, {
        status,
        remark,
      });
      success(`Complaint status updated to "${status}".`);
      if (res?.data) {
        setComplaint(res.data);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update status.';
      toastError(msg);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="py-12">
        <LoadingSpinner message="Retrieving officer audit records..." />
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
        <p className="text-xs text-slate-400">The requested record is unavailable.</p>
        <Link to="/officer/dashboard">
          <Button variant="outline" size="sm" icon={ArrowLeft}>
            Back to Officer Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  const { priority, priorityScore, daysSinceCreated, upvotes } = calculatePriority(complaint);

  const statusOptions = [
    { value: 'pending', label: 'Pending Review' },
    { value: 'in-progress', label: 'In Progress (Field Unit Dispatched)' },
    { value: 'resolved', label: 'Resolved (Work Verified Complete)' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/officer/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Triage Dashboard</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Complaint Details & Timeline (8 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
              <div className="flex items-center gap-2 flex-wrap">
                <CategoryBadge category={complaint.category} size="md" />
                <PriorityBadge priority={priority} priorityScore={priorityScore} size="md" />
              </div>
              <StatusBadge status={complaint.status} size="md" />
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100 font-sans leading-snug">
              {complaint.title}
            </h1>

            {/* Sub-meta details bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300 p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-brand-400" />
                <span>Area: <strong className="text-white">{complaint.area}</strong></span>
              </div>

              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-slate-400" />
                <span>Citizen: <strong className="text-white">{complaint.createdBy?.name} ({complaint.createdBy?.email})</strong></span>
              </div>

              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>Submitted: <strong className="text-white">{formatDate(complaint.createdAt)}</strong></span>
              </div>

              <div className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-rose-400" />
                <span>Upvotes: <strong className="text-brand-300">{upvotes} citizen votes</strong></span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Citizen Description
              </h3>
              <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line bg-slate-950/50 p-5 rounded-2xl border border-slate-800/80">
                {complaint.description}
              </p>
            </div>

            {/* Citizen Feedback View if Resolved */}
            {complaint.feedbackGiven && complaint.feedbackRating && (
              <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                    Citizen Feedback on Resolution
                  </span>
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < complaint.feedbackRating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                {complaint.feedbackComment && (
                  <p className="text-xs text-slate-200 italic bg-slate-950/60 p-3 rounded-xl border border-emerald-500/20">
                    "{complaint.feedbackComment}"
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Audit Timeline */}
          <StatusTimeline complaint={complaint} />
        </div>

        {/* Right Column: Officer Action Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card rounded-3xl p-6 border border-brand-500/30 bg-gradient-to-b from-slate-900 via-slate-900 to-brand-950/30 shadow-xl space-y-5 sticky top-24">
            <div className="flex items-center gap-2 text-brand-400 text-xs font-bold uppercase tracking-wider pb-3 border-b border-slate-800">
              <FileEdit className="w-4 h-4" />
              <span>Officer Action Panel</span>
            </div>

            <form onSubmit={handleUpdateStatus} className="space-y-4">
              <Select
                label="Update Operational Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                options={statusOptions}
                required
              />

              <Textarea
                label="Official Dispatch Note / Remark"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder="e.g., Road repair unit #4 deployed with asphalt leveling equipment. Completion ETA: 24h."
                rows={4}
                helperText="This note is immediately rendered on the citizen's audit timeline."
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={updating}
                icon={Send}
                className="w-full mt-2"
              >
                Save Status & Remarks
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficerComplaintDetailPage;
