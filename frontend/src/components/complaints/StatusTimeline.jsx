import React from 'react';
import { Clock, RefreshCw, CheckCircle2, ShieldAlert } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export const StatusTimeline = ({ complaint }) => {
  const status = complaint?.status || 'pending';
  const isPending = status === 'pending';
  const isInProgress = status === 'in-progress';
  const isResolved = status === 'resolved';

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
      <h3 className="mb-6 flex items-center gap-2 text-base font-semibold text-slate-900">
        <Clock className="h-5 w-5 text-primary-600" />
        <span>Complaint Lifecycle & Audit Trail</span>
      </h3>

      <div className="relative space-y-8 pl-6 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 sm:pl-8 sm:before:left-4">
        {/* Step 1: Submission */}
        <div className="relative">
          <div className="absolute -left-6 top-0 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-primary-600 text-white shadow-sm sm:-left-8 sm:h-8 sm:w-8">
            <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </div>
          <div className="flex flex-col">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-semibold text-slate-900">Submitted by Citizen</span>
              <span className="font-mono text-xs text-slate-500">
                {formatDate(complaint?.createdAt)}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-600">
              Issue logged in municipal registry and categorized as{' '}
              <span className="font-semibold capitalize text-slate-800">
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
                className={`text-sm font-semibold ${
                  isInProgress || isResolved ? 'text-slate-900' : 'text-slate-500'
                }`}
              >
                Municipal Triage & Operations
              </span>
              {(isInProgress || isResolved) && (
                <span className="rounded border border-sky-200 bg-sky-50 px-2 py-0.5 text-xs font-medium text-sky-700">
                  {isResolved ? 'Completed' : 'Active'}
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-slate-600">
              {isInProgress
                ? 'Assigned to field municipal team for on-site inspection and remedial action.'
                : isResolved
                ? 'Field work was initiated and completed.'
                : 'Awaiting officer triage and field team assignment.'}
            </p>

            {complaint?.officerRemark && (
              <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                <ShieldAlert className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" />
                <div>
                  <span className="font-semibold">Official Remark: </span>
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
                className={`text-sm font-semibold ${
                  isResolved ? 'text-emerald-700' : 'text-slate-500'
                }`}
              >
                Resolution & Verification
              </span>
              {isResolved && complaint?.resolvedAt && (
                <span className="font-mono text-xs text-emerald-700">
                  {formatDate(complaint.resolvedAt)}
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-slate-600">
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
