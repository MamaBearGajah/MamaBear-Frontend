import { cn } from "@/lib/utils";
import type { ProductStatus } from "@/types";

const statusConfig: Record<
  ProductStatus,
  { label: string; className: string }
> = {
  active: {
    label: "Active",
    className: "bg-green-100 text-green-800 border-green-200",
  },
  inactive: {
    label: "Inactive",
    className: "bg-muted text-muted-foreground border-border",
  },
  draft: {
    label: "Draft",
    className: "bg-amber-100 text-amber-800 border-amber-200",
  },
};

interface StatusBadgeProps {
  status: ProductStatus;
  className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        config.className,
        className,
      )}
    >
      {config.label}
    </span>
  );
}