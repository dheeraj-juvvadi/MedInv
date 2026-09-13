"use client";

import { useToast } from "@/hooks/use-toast";
import { X } from "lucide-react";

export function Toaster() {
  const { toasts, dismiss } = useToast();
  return (
    <div className="toast-stack" aria-live="polite">
      {toasts.map((toast) => (
        <div
          className="toast-message"
          role={toast.variant === "destructive" ? "alert" : "status"}
          key={toast.id}
        >
          <div>
            <strong>{toast.title}</strong>
            {toast.description && <p>{toast.description}</p>}
          </div>
          <button
            className="icon-control"
            onClick={() => dismiss(toast.id)}
            aria-label="Dismiss notification"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
