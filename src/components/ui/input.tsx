import { cn } from '@/lib/utils';
import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          ref={ref}
          className={cn(
            'w-full px-4 py-3 rounded-lg bg-charcoal border border-charcoal/50 text-white placeholder:text-white/50 transition-all duration-200 focus:outline-none focus:border-red focus:ring-1 focus:ring-red',
            error && 'border-red focus:border-red',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
