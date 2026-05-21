"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  closeOnOverlayClick?: boolean;
}

export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  className,
  closeOnOverlayClick = true,
}: DialogProps) {
  React.useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onOpenChange(false);
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6"
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        aria-label="Close dialog overlay"
        className="absolute inset-0 bg-[var(--mb-brown)]/35 backdrop-blur-sm"
        onClick={closeOnOverlayClick ? () => onOpenChange(false) : undefined}
      />

      <div
        className={cn(
          "relative z-10 w-full max-w-lg rounded-3xl border border-[var(--mb-border)] bg-white shadow-xl",
          "animate-in fade-in zoom-in-95 duration-200",
          className
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-[var(--mb-border)] p-6">
          <div className="space-y-1">
            {title && (
              <h2 className="text-xl font-extrabold text-[var(--mb-brown)]">
                {title}
              </h2>
            )}

            {description && (
              <p className="text-sm leading-6 text-[var(--mb-muted)]">
                {description}
              </p>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            aria-label="Close dialog"
          >
            <span className="text-xl leading-none">×</span>
          </Button>
        </div>

        <div className="p-6">{children}</div>

        {footer && (
          <div className="flex justify-end gap-3 border-t border-[var(--mb-border)] p-6">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}