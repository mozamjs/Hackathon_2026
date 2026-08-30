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
    <div className="group glass-card rounded-2xl p-5 border border-slate-800/90 hover:border-brand-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-brand-500/5 flex flex-col justify-between relative overflow-hidden">
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
          className="block group/title text-base sm:text-lg font-bold text-slate-100 group-hover/title:text-brand-400 transition-colors line-clamp-2 mb-2"
        >
          {complaint.title}
        </Link>

        {/* Description */}
        <p className="text-sm text-slate-300/90 line-clamp-2 mb-4 leading-relaxed">
          {complaint.description}
        </p>

        {/* Officer Remark Alert (if any) */}
        {complaint.officerRemark && (
          <div className="mb-4 p-3 rounded-xl bg-slate-900/90 border border-slate-700/60 flex items-start gap-2.5 text-xs text-slate-300">
            <ShieldAlert className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-brand-300">Officer Remark: </span>
              <span>{complaint.officerRemark}</span>
            </div>
          </div>
        )}

        {/* Feedback Display if Resolved & Given */}
        {complaint.feedbackGiven && complaint.feedbackRating && (
          <div className="mb-4 p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-300">
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
              <span className="text-slate-400 truncate max-w-[150px] italic">
                "{complaint.feedbackComment}"
              </span>
            )}
          </div>
        )}
      </div>

      {/* Meta info & Action Footer */}
      <div className="pt-4 border-t border-slate-800/80 mt-2">
        <div className="flex flex-wrap items-center justify-between gap-y-3 gap-x-2 text-xs text-slate-400 mb-3">
          <div className="flex items-center gap-1.5 text-slate-300 font-medium">
            <MapPin className="w-3.5 h-3.5 text-brand-400" />
            <span className="truncate max-w-[180px]">{complaint.area}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>{formatRelativeTime(complaint.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1 text-slate-400">
              <User className="w-3.5 h-3.5 text-slate-500" />
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
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all"
                >
                  <Star className="w-3.5 h-3.5" />
                  <span>Rate Resolution</span>
                </button>
              )}

              <Link
                to={`/complaints/${complaint._id}`}
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-xl border border-slate-700 transition-colors"
              >
                <span>Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintCard;
