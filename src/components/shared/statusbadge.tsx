import { cn } from "@/lib/utils";

type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "completed"
  | "cancelled"
  | "failed";

type StatusBadgeProps = {
  status: OrderStatus;
  className?: string;
};

const statusConfig: Record<
  OrderStatus,
  {
    label: string;
    className: string;
  }
> = {
  pending: {
    label: "Menunggu",
    className: "bg-amber-50 text-amber-700 ring-amber-200",
  },
  paid: {
    label: "Dibayar",
    className: "bg-blue-50 text-blue-700 ring-blue-200",
  },
  processing: {
    label: "Diproses",
    className: "bg-purple-50 text-purple-700 ring-purple-200",
  },
  shipped: {
    label: "Dikirim",
    className: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  },
  completed: {
    label: "Selesai",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  },
  cancelled: {
    label: "Dibatalkan",
    className: "bg-gray-50 text-gray-700 ring-gray-200",
  },
  failed: {
    label: "Gagal",
    className: "bg-red-50 text-red-700 ring-red-200",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ring-1 ring-inset",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}