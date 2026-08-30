import React from 'react';
import { Car, Trash2, Droplets, Zap, HelpCircle } from 'lucide-react';

const categoryMap = {
  road:        { label: 'Roads & Potholes', icon: Car,        style: 'bg-amber-50 text-amber-700 border-amber-200' },
  garbage:     { label: 'Garbage & Waste',  icon: Trash2,     style: 'bg-green-50 text-green-700 border-green-200' },
  water:       { label: 'Water & Sewage',   icon: Droplets,   style: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
  electricity: { label: 'Power & Lighting', icon: Zap,        style: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  other:       { label: 'Other',            icon: HelpCircle, style: 'bg-surface-container text-on-surface-variant border-outline-variant' },
};

export const CategoryBadge = ({ category, showIcon = true, size = 'md' }) => {
  const normalized = category?.toLowerCase() || 'other';
  const item = categoryMap[normalized] || categoryMap.other;
  const Icon = item.icon;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
    lg: 'px-3 py-1.5 text-sm gap-2',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-lg border ${item.style} ${sizeClasses[size] || sizeClasses.md}`}
    >
      {showIcon && <Icon className="w-3.5 h-3.5 flex-shrink-0" />}
      <span>{item.label}</span>
    </span>
  );
};

export default CategoryBadge;
