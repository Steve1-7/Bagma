import { cn } from '@/lib/utils';
import { TextareaHTMLAttributes, forwardRef } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <textarea
          ref={ref}
          className={cn(
            'w-full px-4 py-3 rounded-lg bg-charcoal border border-charcoal/50 text-white placeholder:text-white/50 transition-all duration-200 focus:outline-none focus:border-red focus:ring-1 focus:ring-red resize-none',
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

Textarea.displayName = 'Textarea';

export default Textarea;
