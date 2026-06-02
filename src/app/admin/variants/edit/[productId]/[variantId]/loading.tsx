import { Skeleton } from "@/components/ui/skeleton";

export default function VariantsLoading() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6 md:p-8">
      <div className="border-border space-y-2 border-b pb-6">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-4 w-56" />
      </div>
      <Skeleton className="h-6 w-36" />
      <Skeleton className="h-10 w-full max-w-xl" />
      <Skeleton className="h-80 w-full rounded-xl" />
    </div>
  );
}
