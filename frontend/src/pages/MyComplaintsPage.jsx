import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FolderOpen, PlusCircle, Clock, RefreshCw, CheckCircle2, Search, Filter } from 'lucide-react';
import ComplaintCard from '../components/complaints/ComplaintCard';
import FeedbackModal from '../components/complaints/FeedbackModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';
import complaintService from '../services/complaintService';

export const MyComplaintsPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedComplaintForFeedback, setSelectedComplaintForFeedback] = useState(null);

  const fetchMyComplaints = async () => {
    setLoading(true);
    try {
      const res = await complaintService.getMyComplaints();
      if (res?.data) {
        setComplaints(res.data);
      }
    } catch (err) {
      console.error('Failed to load my complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyComplaints();
  }, []);

  const filteredComplaints = complaints.filter((c) => {
    const matchesStatus =
      statusFilter === 'all' ? true : c.status === statusFilter;
    const matchesSearch =
      searchQuery.trim() === ''
        ? true
        : c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const pendingCount = complaints.filter((c) => c.status === 'pending').length;
  const inProgressCount = complaints.filter((c) => c.status === 'in-progress').length;
  const resolvedCount = complaints.filter((c) => c.status === 'resolved').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-primary-700">
            <FolderOpen className="h-4 w-4" />
            <span>Personal Reports Registry</span>
          </div>
          <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
            My Submitted Complaints
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Track real-time status updates, field actions, and review completed municipal repairs.
          </p>
        </div>

        <Link to="/complaints/new">
          <Button variant="accent" size="md" icon={PlusCircle}>
            Report New Issue
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-card sm:flex-row sm:items-center">
        {/* Status Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
              statusFilter === 'all'
                ? 'bg-primary-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            All ({complaints.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('pending')}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
              statusFilter === 'pending'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Pending ({pendingCount})</span>
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('in-progress')}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
              statusFilter === 'in-progress'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>In Progress ({inProgressCount})</span>
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('resolved')}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
              statusFilter === 'resolved'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Resolved ({resolvedCount})</span>
          </button>
        </div>

        {/* Local Search */}
        <div className="relative w-full sm:max-w-xs">
          <div className="pointer-events-none absolute left-3.5 text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search my complaints..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-100"
          />
        </div>
      </div>

      {/* Complaints Grid */}
      {loading ? (
        <LoadingSpinner message="Fetching your complaints..." />
      ) : filteredComplaints.length === 0 ? (
        <EmptyState
          title={
            complaints.length === 0
              ? 'No complaints yet'
              : 'No matching complaints found'
          }
          description={
            complaints.length === 0
              ? 'Your reported issues will appear here once you submit your first complaint.'
              : 'Try clearing your search or status filter to see all your reports.'
          }
          actionLabel={complaints.length === 0 ? 'Report an Issue Now' : 'Show All My Reports'}
          onAction={() => {
            if (complaints.length === 0) {
              window.location.href = '/complaints/new';
            } else {
              setStatusFilter('all');
              setSearchQuery('');
            }
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredComplaints.map((complaint) => (
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

export default MyComplaintsPage;
