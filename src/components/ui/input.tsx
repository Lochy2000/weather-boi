import React from 'react';
import { cn } from '../../lib/utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string | null;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, prefix, suffix, ...props }, ref) => {
    return (
      <div className="relative">
        <div className="relative flex items-center">
          {prefix && (
            <div className="absolute left-3 text-neutral-300">
              {prefix}
            </div>
          )}
          <input
            type={type}
            className={cn(
              'flex h-11 w-full rounded-lg border border-neutral-200 bg-neutral-0 px-3 py-2 text-base ring-offset-neutral-0 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
              prefix && 'pl-10',
              suffix && 'pr-10',
              error && 'border-red-500 focus-visible:ring-red-500',
              className
            )}
            ref={ref}
            {...props}
          />
          {suffix && (
            <div className="absolute right-3 text-neutral-300">
              {suffix}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };