'use client';
// Custom hook Local Storage (sync otomatis ke localStorage)
import { useCallback, useEffect, useState } from 'react';

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    if (typeof window === 'undefined') {
      return typeof initialValue === 'function' ? initialValue() : initialValue;
    }
    try {
      const raw = localStorage.getItem(key);
      return raw !== null
        ? JSON.parse(raw)
        : typeof initialValue === 'function'
        ? initialValue()
        : initialValue;
    } catch {
      return typeof initialValue === 'function' ? initialValue() : initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // abaikan error quota / privacy mode
    }
  }, [key, value]);

  const remove = useCallback(() => {
    try {
      localStorage.removeItem(key);
    } catch {
      // abaikan
    }
    setValue(undefined);
  }, [key]);

  return [value, setValue, remove];
}
