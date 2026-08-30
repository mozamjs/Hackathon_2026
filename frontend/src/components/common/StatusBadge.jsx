import React from 'react';
import { Clock, RefreshCw, CheckCircle2 } from 'lucide-react';

export const StatusBadge = ({ status, size = 'md' }) => {
  const normalized = status?.toLowerCase() || 'pending';

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  const base = `inline-flex items-center gap-1.5 font-medium rounded-full border ${sizeClasses[size] || sizeClasses.md}`;

  if (normalized === 'resolved') {
    return (
      <span className={`${base} bg-green-50 text-green-700 border-green-200`}>
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span>Resolved</span>
      </span>
    );
  }

  if (normalized === 'in-progress') {
    return (
      <span className={`${base} bg-blue-50 text-blue-700 border-blue-200`}>
        <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
        <span>In Progress</span>
      </span>
    );
  }

  return (
    <span className={`${base} bg-amber-50 text-amber-700 border-amber-200`}>
      <Clock className="w-3.5 h-3.5" />
      <span>Pending</span>
    </span>
  );
};

export default StatusBadge;
