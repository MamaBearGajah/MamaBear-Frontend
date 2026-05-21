import { ProductsLoading } from "@/components/product/ProductsLoading";

export default function Loading() {
  return (
    <main className="min-h-screen bg-[#FFF5F8] px-4 py-8 md:px-8 lg:px-12">
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-8 h-5 w-32 animate-pulse rounded-full bg-[#FACBD8]" />

        <div className="grid items-start gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="sticky top-24 h-[520px] rounded-[1.5rem] border border-[#F6CEDA] bg-white p-6 shadow-[0_8px_22px_rgba(213,85,126,0.08)]">
            <div className="h-8 w-28 animate-pulse rounded-full bg-[#FACBD8]" />
            <div className="mt-8 space-y-4">
              {Array.from({ length: 10 }).map((_, index) => (
                <div
                  key={index}
                  className="h-5 w-full animate-pulse rounded-full bg-[#FFF5F8]"
                />
              ))}
            </div>
          </aside>

          <section className="min-w-0 space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-3">
                <div className="h-8 w-52 animate-pulse rounded-full bg-[#FACBD8]" />
                <div className="h-4 w-32 animate-pulse rounded-full bg-[#FFF5F8]" />
              </div>

              <div className="h-12 w-48 animate-pulse rounded-full bg-[#FFF5F8]" />
            </div>

            <ProductsLoading />
          </section>
        </div>
      </div>
    </main>
  );
}