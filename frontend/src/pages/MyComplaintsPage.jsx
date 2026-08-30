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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-brand-400 text-xs font-bold uppercase tracking-wider mb-1">
            <FolderOpen className="w-4 h-4" />
            <span>Personal Reports Registry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-sans">
            My Submitted Complaints
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
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
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              statusFilter === 'all'
                ? 'bg-brand-600 text-white shadow'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            All ({complaints.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              statusFilter === 'pending'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'bg-slate-900 text-slate-400 hover:text-amber-300'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Pending ({pendingCount})</span>
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('in-progress')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              statusFilter === 'in-progress'
                ? 'bg-sky-500 text-slate-950 shadow'
                : 'bg-slate-900 text-slate-400 hover:text-sky-300'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>In Progress ({inProgressCount})</span>
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('resolved')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              statusFilter === 'resolved'
                ? 'bg-emerald-500 text-slate-950 shadow'
                : 'bg-slate-900 text-slate-400 hover:text-emerald-300'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Resolved ({resolvedCount})</span>
          </button>
        </div>

        {/* Local Search */}
        <div className="relative flex items-center sm:max-w-xs w-full">
          <div className="absolute left-3.5 text-slate-400 pointer-events-none">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search my complaints..."
            className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-10 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
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
              ? 'You have not submitted any complaints'
              : 'No matching complaints found'
          }
          description={
            complaints.length === 0
              ? 'Whenever you report a civic issue, it will be catalogued here for live tracking.'
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
