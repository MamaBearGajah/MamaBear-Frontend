"use client";

import { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface MamaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function MamaModal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  className,
}: MamaModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "rounded-modal border border-mama-border bg-white p-0 shadow-mama sm:max-w-lg",
          className
        )}
      >
        <div className="border-b border-mama-border px-6 py-5">
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold text-mama-brown">
              {title}
            </DialogTitle>
            {description && (
              <DialogDescription className="text-sm text-mama-muted">
                {description}
              </DialogDescription>
            )}
          </DialogHeader>
        </div>

        <div className="px-6 py-5">{children}</div>

        {footer && (
          <div className="flex items-center justify-end gap-3 border-t border-mama-border px-6 py-4">
            {footer}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}