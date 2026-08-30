import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Clock,
  RefreshCw,
  CheckCircle2,
  Flame,
  AlertTriangle,
  Star,
  Layers,
  FileEdit,
  ArrowRight,
  Filter,
  Search,
  MapPin,
  Calendar,
} from 'lucide-react';
import StatCard from '../../components/officer/StatCard';
import AiBriefingCard from '../../components/officer/AiBriefingCard';
import CategoryBreakdown from '../../components/officer/CategoryBreakdown';
import StatusUpdateModal from '../../components/officer/StatusUpdateModal';
import PriorityBadge from '../../components/common/PriorityBadge';
import StatusBadge from '../../components/common/StatusBadge';
import CategoryBadge from '../../components/common/CategoryBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import complaintService from '../../services/complaintService';
import { formatRelativeTime } from '../../utils/formatters';
import useAuth from '../../hooks/useAuth';

export const OfficerDashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters for triage table
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Selected complaint for modal status update
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, complaintsRes] = await Promise.all([
        complaintService.getOfficerStats(),
        complaintService.getComplaints({ sort: 'upvotes' }),
      ]);

      if (statsRes?.data) setStats(statsRes.data);
      if (complaintsRes?.data) setComplaints(complaintsRes.data);
    } catch (err) {
      console.error('Failed to load officer dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleStatusUpdated = (updated) => {
    setComplaints((prev) =>
      prev.map((c) => (c._id === updated._id ? updated : c))
    );
    // Refresh stats
    complaintService.getOfficerStats().then((res) => {
      if (res?.data) setStats(res.data);
    });
  };

  // Filter complaints for triage queue
  const filteredTriageList = complaints.filter((c) => {
    const matchesStatus =
      statusFilter === 'all' ? true : c.status === statusFilter;
    const matchesPriority =
      priorityFilter === 'all' ? true : c.priority === priorityFilter;
    const matchesSearch =
      searchTerm.trim() === ''
        ? true
        : c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesPriority && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Officer Header Banner */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-card sm:flex-row sm:items-center sm:p-8">
        <div>
          <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-amber-700">
            <ShieldCheck className="h-4 w-4" />
            <span>Municipal Operations Portal</span>
          </div>
          <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
            Officer Triage Command — {user?.name || 'Officer'}
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Live municipal issue queue, dynamic priority triage, and automated Gemini AI briefings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={fetchDashboardData}
            variant="outline"
            size="sm"
            icon={RefreshCw}
          >
            Refresh Telemetry
          </Button>
        </div>
      </div>

      {/* KPI Metric Stat Cards */}
      {loading ? (
        <LoadingSpinner message="Calculating operational telemetry..." />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Complaints"
            value={stats?.total || 0}
            subtitle={`${stats?.complaintsToday || 0} filed today`}
            icon={Layers}
            color="brand"
          />
          <StatCard
            title="Pending Triage"
            value={stats?.pending || 0}
            subtitle="Needs status / field assignment"
            icon={Clock}
            color="amber"
          />
          <StatCard
            title="Active In-Progress"
            value={stats?.inProgress || 0}
            subtitle="Field teams operating"
            icon={RefreshCw}
            color="cyan"
          />
          <StatCard
            title="Resolved Tickets"
            value={stats?.resolved || 0}
            subtitle={`Citizen Avg Rating: ${stats?.averageFeedbackRating ? `★ ${stats.averageFeedbackRating}/5` : 'N/A'}`}
            icon={CheckCircle2}
            color="emerald"
          />
        </div>
      )}

      {/* Gemini AI Briefing Card */}
      <AiBriefingCard />

      {/* Category and Area Distribution */}
      {stats && (
        <CategoryBreakdown
          topCategories={stats.topCategories}
          topAreas={stats.topAreas}
          total={stats.total}
        />
      )}

      {/* Live Triage Queue Table */}
      <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
              <Flame className="h-5 w-5 text-red-500" />
              <span>Municipal Triage & Dispatch Queue</span>
            </h3>
            <p className="mt-0.5 text-xs text-slate-600">
              Prioritize critical issues with high community upvotes and assign field repair teams
            </p>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-100"
              >
                <option value="all">All Priorities</option>
                <option value="critical">Critical Priority</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>

            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-100"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>

            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Quick search..."
                className="w-36 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-100 sm:w-44"
              />
            </div>
          </div>
        </div>

        {/* Triage Queue Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                <th className="px-4 py-3.5">Priority & Score</th>
                <th className="px-4 py-3.5">Issue Details</th>
                <th className="px-4 py-3.5">Category & Area</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Citizen Feedback</th>
                <th className="px-4 py-3.5 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {filteredTriageList.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-sm text-slate-500">
                    No complaints matching current triage filters.
                  </td>
                </tr>
              ) : (
                filteredTriageList.map((complaint) => (
                  <tr
                    key={complaint._id}
                    className="group transition-colors hover:bg-slate-50"
                  >
                    {/* Priority */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <PriorityBadge
                        priority={complaint.priority}
                        priorityScore={complaint.priorityScore}
                        size="sm"
                      />
                    </td>

                    {/* Details */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <Link
                        to={`/officer/complaints/${complaint._id}`}
                        className="block line-clamp-1 font-semibold text-slate-900 transition-colors hover:text-primary-700"
                      >
                        {complaint.title}
                      </Link>
                      <div className="mt-0.5 flex items-center gap-2 text-[11px] text-slate-500">
                        <span>by {complaint.createdBy?.name || 'Citizen'}</span>
                        <span>•</span>
                        <span>{formatRelativeTime(complaint.createdAt)}</span>
                        <span>•</span>
                        <span className="font-semibold text-primary-700">
                          {complaint.upvotes} upvotes
                        </span>
                      </div>
                    </td>

                    {/* Category & Area */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <CategoryBadge category={complaint.category} size="sm" />
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          {complaint.area}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status={complaint.status} size="sm" />
                    </td>

                    {/* Feedback */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {complaint.feedbackGiven && complaint.feedbackRating ? (
                        <div className="flex items-center gap-1 text-amber-400 font-bold">
                          <span>★ {complaint.feedbackRating}/5</span>
                          <span className="text-[10px] text-slate-400 font-normal">
                            verified
                          </span>
                        </div>
                      ) : complaint.status === 'resolved' ? (
                        <span className="text-slate-500 text-[11px]">
                          Pending citizen rating
                        </span>
                      ) : (
                        <span className="text-slate-600 text-[11px]">—</span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedComplaint(complaint)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-brand-600/20 text-brand-300 border border-brand-500/30 hover:bg-brand-600 hover:text-white transition-all"
                        >
                          <FileEdit className="w-3.5 h-3.5" />
                          <span>Update Status</span>
                        </button>
                        <Link
                          to={`/officer/complaints/${complaint._id}`}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          title="Full Audit View"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Status Update Modal */}
      <StatusUpdateModal
        isOpen={Boolean(selectedComplaint)}
        onClose={() => setSelectedComplaint(null)}
        complaint={selectedComplaint}
        onUpdated={handleStatusUpdated}
      />
    </div>
  );
};

export default OfficerDashboardPage;
