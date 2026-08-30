import React from 'react';
import { AlertTriangle, ThumbsUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import UpvoteButton from './UpvoteButton';
import PriorityBadge from '../common/PriorityBadge';
import StatusBadge from '../common/StatusBadge';

export const DuplicateWarning = ({ duplicates = [], onUpvoted }) => {
  if (!duplicates || duplicates.length === 0) return null;

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-900 animate-in fade-in slide-in-from-top-3 duration-200">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
        <div>
          <h4 className="text-sm font-semibold text-amber-800">
            Potential Duplicate Issues Detected in this Area ({duplicates.length})
          </h4>
          <p className="mt-0.5 text-xs text-amber-700">
            Similar active issues have already been reported in this category & area. Consider upvoting an existing issue to boost its municipal priority score instead of filing a duplicate!
          </p>
        </div>
      </div>

      <div className="grid max-h-60 grid-cols-1 gap-2.5 overflow-y-auto pr-1">
        {duplicates.map((dup) => (
          <div
            key={dup._id}
            className="flex flex-col justify-between gap-3 rounded-xl border border-amber-200 bg-white p-3.5 sm:flex-row sm:items-center"
          >
            <div className="flex-1">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <PriorityBadge priority={dup.priority} priorityScore={dup.priorityScore} size="sm" />
                <StatusBadge status={dup.status} size="sm" />
              </div>
              <h5 className="line-clamp-1 text-sm font-semibold text-slate-900">{dup.title}</h5>
              <p className="mt-0.5 line-clamp-1 text-xs text-slate-600">{dup.description}</p>
            </div>

            <div className="flex flex-shrink-0 items-center gap-2">
              <UpvoteButton complaint={dup} onUpvoted={onUpvoted} size="sm" />
              <Link
                to={`/complaints/${dup._id}`}
                target="_blank"
                className="inline-flex items-center gap-1 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-xs font-semibold text-amber-700 transition-colors hover:bg-amber-100"
              >
                <span>View</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DuplicateWarning;
