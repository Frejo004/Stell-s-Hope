import { useToast as useGlobalToast } from '../contexts/ToastContext';
import { Toast } from '../types';

export type { Toast };

export const useToast = () => {
  const { toasts, addToast, removeToast } = useGlobalToast();

  // Adapt to old signature if needed
  const legacyAddToast = (toast: Omit<Toast, 'id'>) => {
    addToast(toast.message, toast.type, toast.duration);
  };

  return {
    toasts,
    addToast: legacyAddToast,
    removeToast,
    clearAllToasts: () => { } // Optional
  };
};