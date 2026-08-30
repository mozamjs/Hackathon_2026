import React, { createContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = useCallback((msg, duration) => addToast(msg, 'success', duration), [addToast]);
  const error = useCallback((msg, duration) => addToast(msg, 'error', duration), [addToast]);
  const info = useCallback((msg, duration) => addToast(msg, 'info', duration), [addToast]);
  const warning = useCallback((msg, duration) => addToast(msg, 'warning', duration), [addToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast, success, error, info, warning }}>
      {children}
      {/* Toast Notification Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((toast) => {
          let bgClass = 'bg-white border-slate-200 text-slate-700';
          let IconComponent = Info;
          let iconColor = 'text-blue-600';

          if (toast.type === 'success') {
            bgClass = 'bg-emerald-50 border-emerald-200 text-emerald-800';
            IconComponent = CheckCircle2;
            iconColor = 'text-emerald-600';
          } else if (toast.type === 'error') {
            bgClass = 'bg-red-50 border-red-200 text-red-700';
            IconComponent = AlertCircle;
            iconColor = 'text-red-600';
          } else if (toast.type === 'warning') {
            bgClass = 'bg-amber-50 border-amber-200 text-amber-800';
            IconComponent = AlertTriangle;
            iconColor = 'text-amber-600';
          }

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3 rounded-xl border p-4 shadow-soft transition-all duration-200 ${bgClass}`}
            >
              <IconComponent className={`mt-0.5 h-5 w-5 flex-shrink-0 ${iconColor}`} />
              <p className="flex-1 text-sm font-medium">{toast.message}</p>
              <button
                onClick={() => removeToast(toast.id)}
                className="rounded p-0.5 text-slate-500 transition-colors hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};
