'use client';

import { useToastStore } from '@/hooks/use-toast';
import Toast from '@/components/ui/toast';
import { useEffect } from 'react';

export default function ToastProvider() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}
