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
      'bg-primary text-white shadow-sm hover:bg-[#1a3a8a] focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2',
    secondary:
      'bg-secondary text-white shadow-sm hover:bg-[#005a52] focus-visible:outline-2 focus-visible:outline-secondary focus-visible:outline-offset-2',
    outline:
      'bg-transparent border border-outline-variant text-on-surface-variant hover:bg-surface-container hover:text-on-surface hover:border-outline',
    ghost:
      'bg-transparent text-on-surface-variant hover:bg-surface-container hover:text-on-surface',
    danger:
      'bg-error text-white shadow-sm hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-error focus-visible:outline-offset-2',
    accent:
      'bg-secondary text-white shadow-sm hover:bg-[#005a52]',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${base} ${sizes[size] || sizes.md} ${variants[variant] || variants.primary} ${className}`}
      style={{ ['--tw-active-scale']: '0.98' }}
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
