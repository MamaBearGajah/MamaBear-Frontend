import { Skeleton } from "@/components/ui/skeleton";

export default function ProductFormLoading() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6 md:p-8">
      <div className="space-y-2 border-b border-border pb-6">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-4 w-56" />
      </div>
      <Skeleton className="h-96 w-full max-w-3xl rounded-xl" />
    </div>
  );
}