import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Compass, PlusCircle, Sparkles, Filter } from 'lucide-react';
import ComplaintFilters from '../components/complaints/ComplaintFilters';
import ComplaintCard from '../components/complaints/ComplaintCard';
import FeedbackModal from '../components/complaints/FeedbackModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';
import complaintService from '../services/complaintService';
import useAuth from '../hooks/useAuth';
import useDebounce from '../hooks/useDebounce';

export const ComplaintsListPage = () => {
  const { isAuthenticated, isCitizen } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [status, setStatus] = useState(searchParams.get('status') || 'all');
  const [area, setArea] = useState(searchParams.get('area') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'recent');

  const debouncedSearch = useDebounce(search, 350);
  const debouncedArea = useDebounce(area, 350);

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaintForFeedback, setSelectedComplaintForFeedback] = useState(null);

  // Sync state with URL search params
  useEffect(() => {
    const params = {};
    if (debouncedSearch) params.search = debouncedSearch;
    if (category && category !== 'all') params.category = category;
    if (status && status !== 'all') params.status = status;
    if (debouncedArea) params.area = debouncedArea;
    if (sort && sort !== 'recent') params.sort = sort;
    setSearchParams(params, { replace: true });
  }, [debouncedSearch, category, status, debouncedArea, sort, setSearchParams]);

  // Fetch complaints whenever debounced or selected filters change
  useEffect(() => {
    const fetchComplaints = async () => {
      setLoading(true);
      try {
        const res = await complaintService.getComplaints({
          search: debouncedSearch,
          category,
          status,
          area: debouncedArea,
          sort,
        });
        if (res?.data) {
          setComplaints(res.data);
        }
      } catch (err) {
        console.error('Failed to load complaints:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [debouncedSearch, category, status, debouncedArea, sort]);

  const handleResetFilters = () => {
    setSearch('');
    setCategory('all');
    setStatus('all');
    setArea('');
    setSort('recent');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-primary-700">
            <Compass className="h-4 w-4" />
            <span>Community Feed</span>
          </div>
          <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
            Public Civic Complaints
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Browse, search, and upvote local municipal issues across all municipal domains.
          </p>
        </div>

        {isAuthenticated && isCitizen && (
          <Link to="/complaints/new">
            <Button variant="accent" size="md" icon={PlusCircle}>
              Submit New Complaint
            </Button>
          </Link>
        )}
      </div>

      {/* Filter Toolbar */}
      <ComplaintFilters
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        status={status}
        setStatus={setStatus}
        area={area}
        setArea={setArea}
        sort={sort}
        setSort={setSort}
        onReset={handleResetFilters}
      />

      {/* Results Section */}
      <div>
        <div className="mb-4 flex items-center justify-between px-1 text-xs text-slate-500">
          <span>
            Showing <strong className="text-slate-800">{complaints.length}</strong> complaint
            {complaints.length === 1 ? '' : 's'}
          </span>
          <span className="font-mono text-slate-600">
            Sorted by: {sort === 'upvotes' ? 'Most Upvoted' : 'Most Recent'}
          </span>
        </div>

        {loading ? (
          <LoadingSpinner message="Filtering civic complaints..." />
        ) : complaints.length === 0 ? (
          <EmptyState
            title="No matching complaints found"
            description="Try loosening your filters or search keywords to see more community reports."
            actionLabel="Reset All Filters"
            onAction={handleResetFilters}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {complaints.map((complaint) => (
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

      {/* Citizen Feedback Modal */}
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

export default ComplaintsListPage;
