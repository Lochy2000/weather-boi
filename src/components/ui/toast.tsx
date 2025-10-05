import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface ToastProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  duration?: number;
}

export function Toast({
  open,
  onOpenChange,
  title,
  description,
  action,
  duration = 0,
}: ToastProps) {
  useEffect(() => {
    if (open && duration > 0) {
      const timer = setTimeout(() => {
        onOpenChange(false);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [open, duration, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 transition-all duration-300 ease-out transform">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 max-w-md min-w-[300px]">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              {title}
            </h3>
            {description && (
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                {description}
              </p>
            )}
            {action && (
              <button
                onClick={action.onClick}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
              >
                {action.label}
              </button>
            )}
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
