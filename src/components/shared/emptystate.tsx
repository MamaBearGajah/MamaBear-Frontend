import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
};

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-3xl border border-dashed border-[var(--mb-border)] bg-white px-6 py-12 text-center",
        className
      )}
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--mb-pink-soft)] text-2xl text-[var(--mb-pink)]">
        {icon ?? "🐻"}
      </div>

      <h3 className="text-lg font-extrabold text-[var(--mb-brown)]">{title}</h3>

      {description && (
        <p className="mt-2 max-w-md text-sm leading-6 text-[var(--mb-muted)]">
          {description}
        </p>
      )}

      {actionLabel && onAction && (
        <Button className="mt-6" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}