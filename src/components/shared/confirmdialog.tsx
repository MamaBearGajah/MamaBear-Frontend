"use client";

import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type ConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  onConfirm: () => void;
};

export function ConfirmDialog({
  open,
  onOpenChange,
  title = "Konfirmasi aksi",
  description = "Apakah kamu yakin ingin melanjutkan aksi ini?",
  confirmLabel = "Ya, lanjutkan",
  cancelLabel = "Batal",
  isLoading = false,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      footer={
        <>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>

          <Button
            variant="destructive"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="rounded-2xl bg-[var(--mb-bg-soft)] p-4 text-sm leading-6 text-[var(--mb-muted)]">
        Aksi ini mungkin tidak dapat dibatalkan. Pastikan data yang dipilih
        sudah benar.
      </div>
    </Dialog>
  );
}