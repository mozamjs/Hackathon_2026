import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

export const Select = forwardRef(
  (
    {
      label,
      error,
      helperText,
      options = [],
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <select
            id={selectId}
            ref={ref}
            className={`w-full appearance-none bg-slate-900/90 border rounded-xl px-3.5 py-2.5 pr-10 text-sm text-slate-100 placeholder-slate-500 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 cursor-pointer ${
              error
                ? 'border-rose-500/80 focus:ring-rose-500 focus:border-rose-500'
                : 'border-slate-700/80 hover:border-slate-600'
            } ${className}`}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value ?? opt.id} value={opt.value ?? opt.id} className="bg-slate-900 text-slate-100">
                {opt.label || opt.name}
              </option>
            ))}
          </select>
          <div className="absolute right-3.5 pointer-events-none text-slate-400">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
        {error && <span className="text-xs text-rose-400 font-medium">{error}</span>}
        {!error && helperText && <span className="text-xs text-slate-400">{helperText}</span>}
      </div>
    );
  }
);

Select.displayName = 'Select';
export default Select;
