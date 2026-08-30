import React from 'react';
import { Search, Filter, ArrowUpDown, X, MapPin } from 'lucide-react';
import { CATEGORIES, STATUSES } from '../../utils/constants';

export const ComplaintFilters = ({
  search,
  setSearch,
  category,
  setCategory,
  status,
  setStatus,
  area,
  setArea,
  sort,
  setSort,
  onReset,
}) => {
  const hasActiveFilters =
    search ||
    category !== 'all' ||
    status !== 'all' ||
    area ||
    sort !== 'recent';

  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col gap-4 mb-6">
      {/* Top row: Search bar & Sort */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* Search */}
        <div className="md:col-span-6 relative flex items-center">
          <div className="absolute left-3.5 text-slate-400 pointer-events-none">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search complaints by title, keyword, or area..."
            className="w-full bg-slate-900/90 border border-slate-700/80 hover:border-slate-600 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Area Filter */}
        <div className="md:col-span-3 relative flex items-center">
          <div className="absolute left-3.5 text-slate-400 pointer-events-none">
            <MapPin className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder="Filter by area..."
            className="w-full bg-slate-900/90 border border-slate-700/80 hover:border-slate-600 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
          />
        </div>

        {/* Sort */}
        <div className="md:col-span-3 flex items-center gap-2">
          <div className="relative w-full">
            <div className="absolute left-3.5 text-slate-400 pointer-events-none top-1/2 -translate-y-1/2">
              <ArrowUpDown className="w-4 h-4" />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full appearance-none bg-slate-900/90 border border-slate-700/80 hover:border-slate-600 rounded-xl pl-10 pr-8 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
            >
              <option value="recent">Most Recent</option>
              <option value="upvotes">Most Upvoted</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1 mr-1 flex-shrink-0">
          <Filter className="w-3.5 h-3.5" />
          Category:
        </span>
        {CATEGORIES.map((cat) => {
          const isSelected = category === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategory(cat.id)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                isSelected
                  ? 'bg-brand-600 text-white border-brand-500 shadow-md shadow-brand-600/20'
                  : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Status Pills and Reset Button */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex-shrink-0">
            Status:
          </span>
          {STATUSES.map((st) => {
            const isSelected = status === st.id;
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => setStatus(st.id)}
                className={`flex-shrink-0 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-slate-200 text-slate-950 font-bold shadow'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {st.label}
              </button>
            );
          })}
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="text-xs font-medium text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors ml-auto"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ComplaintFilters;
