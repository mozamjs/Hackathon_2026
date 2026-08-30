import React from 'react';

export const BrandMark = ({ className = 'h-9 w-9', showWordmark = false }) => {
  return (
    <div className="flex items-center gap-3">
      <svg
        viewBox="0 0 64 64"
        aria-hidden="true"
        className={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M32 5C21.5 5 13 13.5 13 24c0 13.9 19 32.5 19 32.5S51 37.9 51 24C51 13.5 42.5 5 32 5Z"
          fill="#EAF2FF"
          stroke="#1E293B"
          strokeWidth="2.4"
          strokeLinejoin="round"
        />
        <path
          d="M22 34L32 15L42 34"
          stroke="#F97316"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M25.5 27.5H38.5"
          stroke="#1E293B"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M18 39.5C22 35 27 32.5 32 32.5C37.5 32.5 43.5 35 46 39.5"
          stroke="#1E293B"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.9"
        />
      </svg>
      {showWordmark && (
        <div className="leading-none">
          <div className="text-lg font-semibold tracking-[-0.04em] text-slate-900">AwamDesk</div>
          <div className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-slate-500">
            Report. Track. Improve.
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandMark;
