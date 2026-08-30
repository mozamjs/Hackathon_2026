import React from 'react';
import { Layers, MapPin } from 'lucide-react';

export const CategoryBreakdown = ({ topCategories = [], topAreas = [], total = 0 }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Top Categories */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800">
        <h4 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
          <Layers className="w-4 h-4 text-brand-400" />
          <span>Issues by Category</span>
        </h4>

        {topCategories.length === 0 ? (
          <p className="text-xs text-slate-500 py-4">No category data recorded yet.</p>
        ) : (
          <div className="space-y-3">
            {topCategories.map((item) => {
              const percentage = total > 0 ? Math.round((item.count / total) * 100) : 0;
              return (
                <div key={item.category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300 capitalize">
                      {item.category}
                    </span>
                    <span className="text-slate-400 font-mono">
                      {item.count} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-brand-500 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Top Areas */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800">
        <h4 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-emerald-400" />
          <span>Top Affected Areas</span>
        </h4>

        {topAreas.length === 0 ? (
          <p className="text-xs text-slate-500 py-4">No area data recorded yet.</p>
        ) : (
          <div className="space-y-3">
            {topAreas.map((item) => {
              const percentage = total > 0 ? Math.round((item.count / total) * 100) : 0;
              return (
                <div key={item.area} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300 truncate max-w-[200px]">
                      {item.area}
                    </span>
                    <span className="text-slate-400 font-mono">
                      {item.count} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryBreakdown;
