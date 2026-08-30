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
      <div className="mx-auto max-w-md py-16 text-center space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-red-200 bg-red-50 text-red-600">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-semibold text-slate-900">{error || 'Complaint Not Found'}</h2>
        <p className="text-xs text-slate-600">The requested record is unavailable.</p>
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
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 transition-colors hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Triage Dashboard</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Complaint Details & Timeline (8 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-card sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div className="flex flex-wrap items-center gap-2">
                <CategoryBadge category={complaint.category} size="md" />
                <PriorityBadge priority={priority} priorityScore={priorityScore} size="md" />
              </div>
              <StatusBadge status={complaint.status} size="md" />
            </div>

            <h1 className="text-xl font-semibold leading-snug text-slate-900 sm:text-2xl">
              {complaint.title}
            </h1>

            {/* Sub-meta details bar */}
            <div className="grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600 sm:grid-cols-2">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-primary-600" />
                <span>Area: <strong className="text-slate-800">{complaint.area}</strong></span>
              </div>

              <div className="flex items-center gap-1.5">
                <User className="h-4 w-4 text-slate-500" />
                <span>Citizen: <strong className="text-slate-800">{complaint.createdBy?.name} ({complaint.createdBy?.email})</strong></span>
              </div>

              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-slate-500" />
                <span>Submitted: <strong className="text-slate-800">{formatDate(complaint.createdAt)}</strong></span>
              </div>

              <div className="flex items-center gap-1.5">
                <Flame className="h-4 w-4 text-red-500" />
                <span>Upvotes: <strong className="text-primary-700">{upvotes} citizen votes</strong></span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                Citizen Description
              </h3>
              <p className="whitespace-pre-line rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-relaxed text-slate-700">
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
                    className="h-72 w-full rounded-xl object-cover"
                  />
                </div>
              </div>
            )}

            {/* Citizen Feedback View if Resolved */}
            {complaint.feedbackGiven && complaint.feedbackRating && (
              <div className="space-y-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-700">
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
                  <p className="rounded-xl border border-emerald-200 bg-white p-3 text-xs italic text-slate-700">
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
          <div className="sticky top-24 space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3 text-xs font-semibold uppercase tracking-[0.12em] text-primary-700">
              <FileEdit className="h-4 w-4" />
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
