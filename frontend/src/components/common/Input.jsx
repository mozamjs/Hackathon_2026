import React, { forwardRef } from 'react';

export const Input = forwardRef(
  (
    {
      label,
      error,
      helperText,
      icon: Icon,
      type = 'text',
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {Icon && (
            <div className="absolute left-3.5 pointer-events-none text-on-surface-variant/70">
              <Icon className="w-4 h-4" />
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            type={type}
            className={`
              w-full bg-surface-container-lowest border rounded-lg
              px-3.5 py-2.5 text-sm text-on-surface
              placeholder:text-on-surface-variant/50
              transition-colors duration-150
              focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
              ${Icon ? 'pl-10' : ''}
              ${error
                ? 'border-error/70 focus:ring-error/30 focus:border-error'
                : 'border-outline-variant hover:border-outline'
              }
              ${className}
            `}
            {...props}
          />
        </div>
        {error && <span className="text-xs text-error font-medium">{error}</span>}
        {!error && helperText && <span className="text-xs text-on-surface-variant">{helperText}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
