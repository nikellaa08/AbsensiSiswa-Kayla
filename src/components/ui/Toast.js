'use client';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import {
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import { cn } from '@/utils/helpers';

const ToastContext = createContext(null);

let counter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (type, message) => {
      const id = ++counter;
      setToasts((prev) => [...prev, { id, type, message }]);
      setTimeout(() => dismiss(id), 3500);
    },
    [dismiss]
  );

  const value = useMemo(
    () => ({
      success: (message) => push('success', message),
      error: (message) => push('error', message),
      info: (message) => push('info', message),
    }),
    [push]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Container toast */}
      <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-full max-w-sm flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              'pointer-events-auto flex items-start gap-3 rounded-xl border bg-white p-4 shadow-card-hover animate-toast-in',
              t.type === 'success' && 'border-emerald-200',
              t.type === 'error' && 'border-red-200',
              t.type === 'info' && 'border-blue-200'
            )}
          >
            <span
              className={cn(
                'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full',
                t.type === 'success' && 'bg-emerald-100 text-emerald-600',
                t.type === 'error' && 'bg-red-100 text-red-600',
                t.type === 'info' && 'bg-blue-100 text-blue-600'
              )}
            >
              {t.type === 'success' && <CheckCircleIcon className="h-4 w-4" />}
              {t.type === 'error' && <XCircleIcon className="h-4 w-4" />}
              {t.type === 'info' && <InformationCircleIcon className="h-4 w-4" />}
            </span>
            <p className="flex-1 text-sm font-medium text-gray-800">{t.message}</p>
            <button
              onClick={() => dismiss(t.id)}
              className="text-gray-300 transition hover:text-gray-500"
              aria-label="Tutup notifikasi"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast harus digunakan di dalam <ToastProvider>.');
  }
  return ctx;
}
