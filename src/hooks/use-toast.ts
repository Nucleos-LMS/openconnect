import { useState, useCallback } from 'react';

interface ToastOptions {
  title?: string;
  description: string;
  status?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastOptions[]>([]);

  const toast = useCallback((options: ToastOptions) => {
    setToasts((prev) => [...prev, options]);
    if (options.duration) {
      setTimeout(() => {
        setToasts((prev) => prev.slice(1));
      }, options.duration);
    }
  }, []);

  return toast;
}
