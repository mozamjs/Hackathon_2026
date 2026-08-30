import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  type = 'button',
  icon: Icon,
  className = '',
  onClick,
  ...props
}) => {
  const base =
    'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 select-none disabled:opacity-50 disabled:cursor-not-allowed';

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-sm gap-2',
    icon: 'p-2',
  };

  const variants = {
    primary:
      'bg-primary-600 text-white shadow-sm hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2',
    secondary:
      'bg-slate-800 text-white shadow-sm hover:bg-slate-900',
    outline:
      'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300',
    ghost:
      'bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-900',
    danger:
      'bg-red-600 text-white shadow-sm hover:bg-red-700',
    accent:
      'bg-emerald-600 text-white shadow-sm hover:bg-emerald-700',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${base} ${sizes[size] || sizes.md} ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        Icon && <Icon className="w-4 h-4 flex-shrink-0" />
      )}
      {children}
    </button>
  );
};

export default Button;
