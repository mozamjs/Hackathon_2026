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
    <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col justify-between relative overflow-hidden group hover:border-slate-700 transition-all">
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          {title}
        </span>
        {Icon && (
          <div
            className={`w-9 h-9 rounded-xl bg-gradient-to-br ${selectedColor} border flex items-center justify-center shadow-sm`}
          >
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div>
        <div className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight font-sans">
          {value !== undefined ? value : '—'}
        </div>
        {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
      </div>

      {trend && (
        <div className="mt-3 pt-2.5 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-1">
          {trend}
        </div>
      )}
    </div>
  );
};

export default StatCard;
