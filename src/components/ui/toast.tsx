import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Toast as ToastType } from '@/types';

interface ToastProps {
  toast: ToastType;
  onClose: () => void;
}

export default function Toast({ toast, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, toast.duration || 5000);

    return () => clearTimeout(timer);
  }, [toast, onClose]);

  return (
    <div
      className={cn(
        'fixed bottom-4 right-4 z-50 max-w-sm transition-all duration-300',
        {
          'opacity-0 translate-y-4': !isVisible,
          'opacity-100 translate-y-0': isVisible,
        }
      )}
    >
      <div
        className={cn(
          'rounded-lg p-4 shadow-lg flex items-start gap-3',
          {
            'bg-green-500/20 border border-green-500/50 text-green-400':
              toast.type === 'success',
            'bg-red/20 border border-red/50 text-red': toast.type === 'error',
            'bg-blue-500/20 border border-blue-500/50 text-blue-400':
              toast.type === 'info',
            'bg-yellow-500/20 border border-yellow-500/50 text-yellow-400':
              toast.type === 'warning',
          }
        )}
      >
        <div className="flex-1">
          <p className="font-semibold">{toast.message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-current/70 hover:text-current transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
