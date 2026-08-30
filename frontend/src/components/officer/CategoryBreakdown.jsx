import React from 'react';
import { Layers, MapPin } from 'lucide-react';

export const CategoryBreakdown = ({ topCategories = [], topAreas = [], total = 0 }) => {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Top Categories */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
        <h4 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-800">
          <Layers className="h-4 w-4 text-primary-600" />
          <span>Issues by Category</span>
        </h4>

        {topCategories.length === 0 ? (
          <p className="py-4 text-xs text-slate-500">No category data recorded yet.</p>
        ) : (
          <div className="space-y-3">
            {topCategories.map((item) => {
              const percentage = total > 0 ? Math.round((item.count / total) * 100) : 0;
              return (
                <div key={item.category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold capitalize text-slate-700">
                      {item.category}
                    </span>
                    <span className="font-mono text-slate-500">
                      {item.count} ({percentage}%)
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-primary-500 transition-all duration-500"
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
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
        <h4 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-800">
          <MapPin className="h-4 w-4 text-emerald-600" />
          <span>Top Affected Areas</span>
        </h4>

        {topAreas.length === 0 ? (
          <p className="py-4 text-xs text-slate-500">No area data recorded yet.</p>
        ) : (
          <div className="space-y-3">
            {topAreas.map((item) => {
              const percentage = total > 0 ? Math.round((item.count / total) * 100) : 0;
              return (
                <div key={item.area} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="max-w-[200px] truncate font-semibold text-slate-700">
                      {item.area}
                    </span>
                    <span className="font-mono text-slate-500">
                      {item.count} ({percentage}%)
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all duration-500"
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
