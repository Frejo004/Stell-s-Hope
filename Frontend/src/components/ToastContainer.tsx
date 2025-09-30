import React from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { Toast } from '../hooks/useToast';

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

const ToastIcon = ({ type }: { type: Toast['type'] }) => {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info
  };
  const Icon = icons[type];
  return <Icon className="w-5 h-5" />;
};

export default function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center p-4 rounded-lg shadow-lg min-w-80 ${
            toast.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' :
            toast.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' :
            toast.type === 'warning' ? 'bg-yellow-50 text-yellow-800 border border-yellow-200' :
            'bg-blue-50 text-blue-800 border border-blue-200'
          }`}
        >
          <div className={`mr-3 ${
            toast.type === 'success' ? 'text-green-500' :
            toast.type === 'error' ? 'text-red-500' :
            toast.type === 'warning' ? 'text-yellow-500' :
            'text-blue-500'
          }`}>
            <ToastIcon type={toast.type} />
          </div>
          <p className="flex-1 text-sm font-medium">{toast.message}</p>
          <button
            onClick={() => onRemove(toast.id)}
            className="ml-3 p-1 hover:bg-black hover:bg-opacity-10 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}