import { useState, useCallback, useRef } from 'react';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

const DEFAULT_DURATION = 3000;
const MAX_TOASTS = 5;

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const removeToast = useCallback((id: string) => {
    // Nettoyer le timeout si il existe
    const timeout = timeoutsRef.current.get(id);
    if (timeout) {
      clearTimeout(timeout);
      timeoutsRef.current.delete(id);
    }
    
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    if (!toast.message || typeof toast.message !== 'string') {
      console.error('Message de toast invalide');
      return;
    }

    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast = { ...toast, id };
    
    setToasts(prev => {
      // Limiter le nombre de toasts
      const updatedToasts = [...prev, newToast];
      if (updatedToasts.length > MAX_TOASTS) {
        const removedToast = updatedToasts.shift();
        if (removedToast) {
          const timeout = timeoutsRef.current.get(removedToast.id);
          if (timeout) {
            clearTimeout(timeout);
            timeoutsRef.current.delete(removedToast.id);
          }
        }
      }
      return updatedToasts;
    });
    
    // Auto remove after duration
    if (toast.duration !== 0) {
      const timeout = setTimeout(() => {
        removeToast(id);
      }, toast.duration || DEFAULT_DURATION);
      
      timeoutsRef.current.set(id, timeout);
    }
  }, [removeToast]);

  const clearAllToasts = useCallback(() => {
    // Nettoyer tous les timeouts
    timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    timeoutsRef.current.clear();
    setToasts([]);
  }, []);

  return {
    toasts,
    addToast,
    removeToast,
    clearAllToasts
  };
};