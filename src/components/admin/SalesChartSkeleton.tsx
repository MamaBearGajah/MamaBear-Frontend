import { Skeleton } from "@/components/ui/skeleton";

export default function SalesChartSkeleton() {
  return (
    <div className="rounded-[32px] border border-[#F1E9EB] bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-56" />
          <Skeleton className="h-3 w-72" />
        </div>
        <Skeleton className="h-9 w-40 rounded-full" />
      </div>
      <Skeleton className="h-[360px] w-full rounded-[28px]" />
    </div>
  );
}
