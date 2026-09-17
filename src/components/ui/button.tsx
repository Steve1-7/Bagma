import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, cloneElement, forwardRef, isValidElement, ReactElement } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', asChild = false, children, ...props }, ref) => {
    const styles = cn(
      'inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
      {
        'bg-red hover:bg-red/90 text-white focus:ring-red': variant === 'primary',
        'bg-charcoal hover:bg-charcoal/90 text-white focus:ring-charcoal': variant === 'secondary',
        'border-2 border-red text-red hover:bg-red hover:text-white focus:ring-red': variant === 'outline',
        'bg-transparent hover:bg-charcoal/10 text-white focus:ring-charcoal': variant === 'ghost',
        'bg-red/10 hover:bg-red/20 text-red focus:ring-red': variant === 'danger',
      },
      {
        'px-3 py-1.5 text-sm': size === 'sm',
        'px-4 py-2 text-base': size === 'md',
        'px-6 py-3 text-lg': size === 'lg',
      },
      className
    );

    if (asChild && isValidElement(children)) {
      const child = children as ReactElement<{ className?: string }>;
      return cloneElement(child, { ...props, className: cn(styles, child.props.className) });
    }

    return <button ref={ref} className={styles} {...props}>{children}</button>;
  }
);

Button.displayName = 'Button';

export default Button;
