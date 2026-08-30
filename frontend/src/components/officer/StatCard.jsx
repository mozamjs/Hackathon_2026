import React from 'react';

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'brand',
}) => {
  const colorMap = {
    brand: 'from-blue-600/20 to-indigo-600/10 border-blue-500/30 text-blue-400',
    amber: 'from-amber-600/20 to-yellow-600/10 border-amber-500/30 text-amber-400',
    emerald: 'from-emerald-600/20 to-teal-600/10 border-emerald-500/30 text-emerald-400',
    rose: 'from-rose-600/20 to-red-600/10 border-rose-500/30 text-rose-400',
    purple: 'from-purple-600/20 to-indigo-600/10 border-purple-500/30 text-purple-400',
    cyan: 'from-cyan-600/20 to-blue-600/10 border-cyan-500/30 text-cyan-400',
  };

  const selectedColor = colorMap[color] || colorMap.brand;

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-card transition-all hover:border-slate-300">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
          {title}
        </span>
        {Icon && (
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-xl border bg-slate-50 ${selectedColor} shadow-sm`}
          >
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>

      <div>
        <div className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          {value !== undefined ? value : '—'}
        </div>
        {subtitle && <p className="mt-1 text-xs text-slate-600">{subtitle}</p>}
      </div>

      {trend && (
        <div className="mt-3 flex items-center gap-1 border-t border-slate-200 pt-2.5 text-[11px] text-slate-500">
          {trend}
        </div>
      )}
    </div>
  );
};

export default StatCard;
