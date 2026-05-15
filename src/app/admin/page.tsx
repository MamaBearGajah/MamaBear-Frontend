export default function AdminDashboardPage() {
  const today = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <div className="flex flex-1 flex-col p-6 md:p-8">
      <header className="mb-8 border-b border-border pb-6">
        <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="mt-1 text-sm capitalize text-muted-foreground">{today}</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-32 animate-pulse rounded-xl border border-border bg-muted/50"
            aria-hidden
          />
        ))}
      </div>

      <p className="mt-8 text-sm text-muted-foreground">
        Ringkasan penjualan dan statistik akan ditampilkan di sini setelah integrasi API
        laporan.
      </p>
    </div>
  );
}
