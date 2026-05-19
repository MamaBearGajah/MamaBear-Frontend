"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "warning" | "info";

type ToastItem = {
  id: string;
  title: string;
  description?: string;
  type: ToastType;
};

type ToastInput = Omit<ToastItem, "id"> & {
  duration?: number;
};

type ToastContextValue = {
  toast: (input: ToastInput) => void;
  dismiss: (id: string) => void;
};

const ToastContext = React.createContext<ToastContextValue | null>(null);

const typeClasses: Record<ToastType, string> = {
  success: "border-[var(--mb-success)]/30 bg-white",
  error: "border-[var(--mb-error)]/30 bg-white",
  warning: "border-[var(--mb-warning)]/30 bg-white",
  info: "border-[var(--mb-info)]/30 bg-white",
};

const dotClasses: Record<ToastType, string> = {
  success: "bg-[var(--mb-success)]",
  error: "bg-[var(--mb-error)]",
  warning: "bg-[var(--mb-warning)]",
  info: "bg-[var(--mb-info)]",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<ToastItem[]>([]);

  const dismiss = React.useCallback((id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const toast = React.useCallback(
    ({ duration = 3500, ...input }: ToastInput) => {
      const id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : String(Date.now());

      setItems((current) => [...current, { id, ...input }]);
      window.setTimeout(() => dismiss(id), duration);
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}

      <div className="fixed right-4 top-4 z-[60] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3">
        {items.map((item) => (
          <div
            key={item.id}
            className={cn(
              "flex gap-3 rounded-3xl border p-4 shadow-lg",
              "animate-in slide-in-from-right-4 fade-in duration-200",
              typeClasses[item.type]
            )}
          >
            <span
              className={cn(
                "mt-1 h-2.5 w-2.5 shrink-0 rounded-full",
                dotClasses[item.type]
              )}
            />

            <div className="min-w-0 flex-1">
              <p className="font-bold text-[var(--mb-brown)]">{item.title}</p>

              {item.description && (
                <p className="mt-1 text-sm leading-5 text-[var(--mb-muted)]">
                  {item.description}
                </p>
              )}
            </div>

            <button
              type="button"
              className="rounded-full px-2 text-xl leading-none text-[var(--mb-muted)] hover:bg-[var(--mb-bg-soft)]"
              onClick={() => dismiss(item.id)}
              aria-label="Dismiss toast"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }

  return context;
}