import { useState, useEffect, useCallback } from "react";

export type ToastType =
  "default" | "destructive" | "success" | "warning" | "info";

export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant: ToastType;
  duration?: number;
}

export interface ToastOptions {
  title: string;
  description?: string;
  variant?: ToastType;
  duration?: number;
}

// Create a store for toasts
const toasts: Toast[] = [];
let listeners: Function[] = [];

const addToast = (toast: Toast) => {
  toasts.push(toast);
  listeners.forEach((listener) => listener([...toasts]));

  // Auto dismiss after duration
  if (toast.duration) {
    setTimeout(() => {
      dismissToast(toast.id);
    }, toast.duration);
  }
};

const dismissToast = (id: string) => {
  const index = toasts.findIndex((t) => t.id === id);
  if (index !== -1) {
    toasts.splice(index, 1);
    listeners.forEach((listener) => listener([...toasts]));
  }
};

export function useToast() {
  const [toastList, setToastList] = useState<Toast[]>(toasts);

  useEffect(() => {
    listeners.push(setToastList);

    return () => {
      listeners = listeners.filter((listener) => listener !== setToastList);
    };
  }, []);

  const toast = useCallback((options: ToastOptions) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = {
      id,
      title: options.title,
      description: options.description,
      variant: options.variant || "default",
      duration: options.duration || 5000,
    };

    addToast(newToast);
    return id;
  }, []);

  return { toast, toasts: toastList, dismiss: dismissToast };
}
