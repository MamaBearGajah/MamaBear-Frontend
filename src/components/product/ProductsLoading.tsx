import { Skeleton } from "@/components/shared/skeleton";

export function ProductsLoading() {
  return (
    <div className="grid grid-cols-2 gap-4 md:gap-5 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-[2rem] border border-[var(--mb-border)] bg-white shadow-sm"
        >
          <Skeleton className="aspect-[4/3] rounded-b-none rounded-t-[2rem]" />

          <div className="space-y-4 p-6">
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-7 w-full" />
            <Skeleton className="h-7 w-4/5" />
            <Skeleton className="h-5 w-2/3" />

            <div className="flex gap-2">
              <Skeleton className="h-8 w-20 rounded-full" />
              <Skeleton className="h-8 w-20 rounded-full" />
            </div>

            <Skeleton className="h-8 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}