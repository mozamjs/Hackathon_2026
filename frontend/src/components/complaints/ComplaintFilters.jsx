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
    <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
      {/* Top row: Search bar & Sort */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* Search */}
        <div className="md:col-span-6 relative flex items-center">
          <div className="pointer-events-none absolute left-3.5 text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search complaints by title, keyword, or area..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 transition-all focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-100"
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
          <div className="pointer-events-none absolute left-3.5 text-slate-400">
            <MapPin className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder="Filter by area..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 transition-all focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-100"
          />
        </div>

        {/* Sort */}
        <div className="md:col-span-3 flex items-center gap-2">
          <div className="relative w-full">
            <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              <ArrowUpDown className="h-4 w-4" />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-8 text-sm text-slate-800 focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-100"
            >
              <option value="recent">Most Recent</option>
              <option value="upvotes">Most Upvoted</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="mr-1 flex flex-shrink-0 items-center gap-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
          <Filter className="h-3.5 w-3.5" />
          Category:
        </span>
        {CATEGORIES.map((cat) => {
          const isSelected = category === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategory(cat.id)}
              className={`flex-shrink-0 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
                isSelected
                  ? 'border-primary-600 bg-primary-600 text-white shadow-sm'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Status Pills and Reset Button */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-2">
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="flex-shrink-0 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
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
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
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
            className="ml-auto flex items-center gap-1 text-xs font-medium text-slate-500 transition-colors hover:text-red-600"
          >
            <X className="h-3.5 w-3.5" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ComplaintFilters;
