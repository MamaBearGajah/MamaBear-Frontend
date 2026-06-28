export default function ProductsLoading() {
  return (
    <main className="min-h-[60vh] bg-light-pink/25 py-6 md:py-10">
      <div className="container-main space-y-4">
        <div className="animate-pulse space-y-3">
          <div className="h-4 w-40 rounded bg-light-pink" />
          <div className="h-9 w-56 rounded bg-light-pink" />
          <div className="h-4 w-32 rounded bg-light-pink" />
        </div>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <aside className="w-full shrink-0 lg:w-[280px]">
            <div className="h-[420px] animate-pulse rounded-2xl border border-border/80 bg-white" />
          </aside>

          <div className="min-w-0 flex-1 space-y-4">
            <div className="flex justify-end">
              <div className="h-10 w-[220px] animate-pulse rounded-full bg-white" />
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[3/4] animate-pulse rounded-2xl border border-border/80 bg-white"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
