import React from 'react';
import { Clock, RefreshCw, CheckCircle2, ShieldAlert } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export const StatusTimeline = ({ complaint }) => {
  const status = complaint?.status || 'pending';
  const isPending = status === 'pending';
  const isInProgress = status === 'in-progress';
  const isResolved = status === 'resolved';

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800">
      <h3 className="text-base font-bold text-slate-100 mb-6 flex items-center gap-2">
        <Clock className="w-5 h-5 text-brand-400" />
        <span>Complaint Lifecycle & Audit Trail</span>
      </h3>

      <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
        {/* Step 1: Submission */}
        <div className="relative">
          <div className="absolute -left-6 sm:-left-8 top-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-brand-600 text-white flex items-center justify-center shadow-lg shadow-brand-500/20 border-2 border-slate-950">
            <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div className="flex flex-col">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-bold text-slate-100">Submitted by Citizen</span>
              <span className="text-xs text-slate-400 font-mono">
                {formatDate(complaint?.createdAt)}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Issue logged in municipal registry and categorized as{' '}
              <span className="font-semibold text-slate-200 capitalize">
                {complaint?.category}
              </span>
              .
            </p>
          </div>
        </div>

        {/* Step 2: Officer Review & In-Progress */}
        <div className="relative">
          <div
            className={`absolute -left-6 sm:-left-8 top-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shadow-lg border-2 border-slate-950 ${
              isInProgress || isResolved
                ? 'bg-sky-600 text-white shadow-sky-500/20'
                : 'bg-slate-800 text-slate-500'
            }`}
          >
            <RefreshCw
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                isInProgress ? 'animate-spin' : ''
              }`}
              style={{ animationDuration: '4s' }}
            />
          </div>
          <div className="flex flex-col">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span
                className={`text-sm font-bold ${
                  isInProgress || isResolved ? 'text-slate-100' : 'text-slate-500'
                }`}
              >
                Municipal Triage & Operations
              </span>
              {(isInProgress || isResolved) && (
                <span className="text-xs text-sky-400 font-medium bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                  {isResolved ? 'Completed' : 'Active'}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {isInProgress
                ? 'Assigned to field municipal team for on-site inspection and remedial action.'
                : isResolved
                ? 'Field work was initiated and completed.'
                : 'Awaiting officer triage and field team assignment.'}
            </p>

            {complaint?.officerRemark && (
              <div className="mt-3 p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-2.5 text-xs text-slate-300">
                <ShieldAlert className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-brand-300">Official Remark: </span>
                  <span>{complaint.officerRemark}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Step 3: Resolution */}
        <div className="relative">
          <div
            className={`absolute -left-6 sm:-left-8 top-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shadow-lg border-2 border-slate-950 ${
              isResolved
                ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                : 'bg-slate-800 text-slate-500'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div className="flex flex-col">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span
                className={`text-sm font-bold ${
                  isResolved ? 'text-emerald-300' : 'text-slate-500'
                }`}
              >
                Resolution & Verification
              </span>
              {isResolved && complaint?.resolvedAt && (
                <span className="text-xs text-emerald-400 font-mono">
                  {formatDate(complaint.resolvedAt)}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {isResolved
                ? 'Complaint has been marked resolved by municipal officer. Citizen feedback requested.'
                : 'Final municipal verification pending.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusTimeline;
