import React from 'react';
import { AlertTriangle, ThumbsUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import UpvoteButton from './UpvoteButton';
import PriorityBadge from '../common/PriorityBadge';
import StatusBadge from '../common/StatusBadge';

export const DuplicateWarning = ({ duplicates = [], onUpvoted }) => {
  if (!duplicates || duplicates.length === 0) return null;

  return (
    <div className="p-5 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-100 flex flex-col gap-4 animate-in fade-in slide-in-from-top-3 duration-200">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-bold text-amber-200">
            Potential Duplicate Issues Detected in this Area ({duplicates.length})
          </h4>
          <p className="text-xs text-amber-300/80 mt-0.5">
            Similar active issues have already been reported in this category & area. Consider upvoting an existing issue to boost its municipal priority score instead of filing a duplicate!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2.5 max-h-60 overflow-y-auto pr-1">
        {duplicates.map((dup) => (
          <div
            key={dup._id}
            className="p-3.5 rounded-xl bg-slate-900/90 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <PriorityBadge priority={dup.priority} priorityScore={dup.priorityScore} size="sm" />
                <StatusBadge status={dup.status} size="sm" />
              </div>
              <h5 className="text-sm font-semibold text-slate-100 line-clamp-1">{dup.title}</h5>
              <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{dup.description}</p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <UpvoteButton complaint={dup} onUpvoted={onUpvoted} size="sm" />
              <Link
                to={`/complaints/${dup._id}`}
                target="_blank"
                className="inline-flex items-center gap-1 text-xs font-semibold text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 px-2.5 py-1.5 rounded-lg border border-amber-500/30 transition-colors"
              >
                <span>View</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DuplicateWarning;
