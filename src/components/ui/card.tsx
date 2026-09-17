import { cn } from '@/lib/utils';
import { HTMLAttributes, forwardRef } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'premium' | 'glass';
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl overflow-hidden',
          {
            'bg-charcoal border border-charcoal/50': variant === 'default',
            'bg-gradient-to-br from-charcoal to-black border border-gold/20 shadow-lg': variant === 'premium',
            'bg-charcoal/50 backdrop-blur-sm border border-white/10': variant === 'glass',
          },
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
