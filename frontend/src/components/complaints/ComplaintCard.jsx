import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, User, MessageSquare, Star, ArrowRight, ShieldAlert } from 'lucide-react';
import CategoryBadge from '../common/CategoryBadge';
import PriorityBadge from '../common/PriorityBadge';
import StatusBadge from '../common/StatusBadge';
import UpvoteButton from './UpvoteButton';
import { formatRelativeTime } from '../../utils/formatters';
import { calculatePriority } from '../../utils/priority';
import useAuth from '../../hooks/useAuth';

export const ComplaintCard = ({
  complaint,
  onUpvoted,
  onLeaveFeedback,
  showActions = true,
}) => {
  const { user } = useAuth();

  const { priority, priorityScore } = calculatePriority(complaint);
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
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-card transition-all duration-300 hover:border-slate-300 hover:shadow-soft">
      {/* Top Banner Accent for Critical/High */}
      {priority === 'critical' && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-600 via-rose-500 to-orange-500" />
      )}
      {priority === 'high' && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-amber-500" />
      )}

      <div>
        {/* Header Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <CategoryBadge category={complaint.category} size="sm" />
            <PriorityBadge priority={priority} priorityScore={priorityScore} size="sm" />
          </div>
          <StatusBadge status={complaint.status} size="sm" />
        </div>

        {/* Title */}
        <Link
          to={`/complaints/${complaint._id}`}
          className="mb-2 block text-base font-semibold text-slate-900 transition-colors group-hover/title:text-primary-700 sm:text-lg"
        >
          {complaint.title}
        </Link>

        {/* Description */}
        <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-slate-600">
          {complaint.description}
        </p>

        {/* Officer Remark Alert (if any) */}
        {complaint.officerRemark && (
          <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
            <ShieldAlert className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" />
            <div>
              <span className="font-semibold">Officer Remark: </span>
              <span>{complaint.officerRemark}</span>
            </div>
          </div>
        )}

        {/* Feedback Display if Resolved & Given */}
        {complaint.feedbackGiven && complaint.feedbackRating && (
          <div className="mb-4 flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 p-2.5 text-xs text-emerald-800">
            <div className="flex items-center gap-1.5 font-medium">
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
              <span>Citizen Verified Resolution</span>
            </div>
            {complaint.feedbackComment && (
              <span className="max-w-[150px] truncate italic text-slate-500">
                "{complaint.feedbackComment}"
              </span>
            )}
          </div>
        )}
      </div>

      {/* Meta info & Action Footer */}
      <div className="mt-2 border-t border-slate-200 pt-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-x-2 gap-y-3 text-xs text-slate-500">
          <div className="flex items-center gap-1.5 font-medium text-slate-700">
            <MapPin className="h-3.5 w-3.5 text-primary-600" />
            <span className="truncate max-w-[180px]">{complaint.area}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-slate-500" />
              <span>{formatRelativeTime(complaint.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1 text-slate-500">
              <User className="h-3.5 w-3.5 text-slate-500" />
              <span className="truncate max-w-[100px]">
                {complaint.createdBy?.name || 'Citizen'}
              </span>
            </div>
          </div>
        </div>

        {showActions && (
          <div className="flex items-center justify-between gap-2 pt-1">
            <UpvoteButton complaint={complaint} onUpvoted={onUpvoted} size="sm" />

            <div className="flex items-center gap-2">
              {canLeaveFeedback && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (onLeaveFeedback) onLeaveFeedback(complaint);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-emerald-500"
                >
                  <Star className="h-3.5 w-3.5" />
                  <span>Rate Resolution</span>
                </button>
              )}

              <Link
                to={`/complaints/${complaint._id}`}
                className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50"
              >
                <span>Details</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintCard;
