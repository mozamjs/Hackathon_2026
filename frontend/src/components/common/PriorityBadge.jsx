import React from 'react';
import { getPriorityTheme } from '../../utils/priority';
import { Flame } from 'lucide-react';

const priorityStyles = {
  critical: 'bg-red-50 text-red-700 border-red-200',
  high:     'bg-orange-50 text-orange-700 border-orange-200',
  medium:   'bg-yellow-50 text-yellow-700 border-yellow-200',
  low:      'bg-surface-container text-on-surface-variant border-outline-variant',
};

const dotColors = {
  critical: 'bg-red-500',
  high:     'bg-orange-500',
  medium:   'bg-yellow-500',
  low:      'bg-on-surface-variant/40',
};

export const PriorityBadge = ({ priority, priorityScore, showScore = true, size = 'md' }) => {
  const normalized = priority?.toLowerCase() || 'low';
  const theme = getPriorityTheme(priority);

  const style = priorityStyles[normalized] || priorityStyles.low;
  const dot   = dotColors[normalized] || dotColors.low;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full border ${style} ${sizeClasses[size] || sizeClasses.md}`}
      title={`Priority: ${theme.label}${priorityScore !== undefined ? ` (Score: ${priorityScore})` : ''}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {normalized === 'critical' && <Flame className="w-3.5 h-3.5" />}
      <span>{theme.label}</span>
      {showScore && priorityScore !== undefined && (
        <span className="font-normal opacity-70 font-mono text-[10px]">
          {priorityScore}
        </span>
      )}
    </span>
  );
};

export default PriorityBadge;
