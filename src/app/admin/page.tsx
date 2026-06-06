import { ArrowUpRight, Bell, Box, DollarSign, Search, ShoppingBag, User } from "lucide-react";

export default function Admin() {
  return (
    <div className="min-h-full bg-background px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 flex flex-col gap-6 rounded-[32px] border border-[#F1E9EB] bg-white/80 p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Dashboard Overview</p>
            <h1 className="mt-1 text-3xl font-heading font-semibold text-foreground">Admin Dashboard</h1>
            <p className="mt-2 text-sm text-muted-foreground">Thursday, May 7, 2026</p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-[260px]">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search..."
                className="h-12 w-full rounded-full border border-[#E9D9DF] bg-white pl-12 pr-4 text-sm text-foreground shadow-sm outline-none transition focus:border-dark-pink"
              />
            </div>
            <button
              type="button"
              className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-brown shadow-sm transition hover:bg-[#F7F0F2]"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
            </button>
            <div className="inline-flex items-center gap-3 rounded-full bg-white px-4 py-3 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--mamabear-dark-pink)] text-sm font-bold text-white">
                A
              </div>
              <span className="text-sm font-medium text-foreground">Admin</span>
            </div>
          </div>
        </header>

        <section className="grid gap-4 xl:grid-cols-4">
          <div className="rounded-[30px] border border-[#F1E9EB] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FDE7ED] text-[#C75483]">
                <DollarSign className="h-5 w-5" />
              </span>
              <span className="text-sm font-semibold text-emerald-600">+23.5%</span>
            </div>
            <p className="mt-6 text-sm uppercase tracking-[0.3em] text-muted-foreground">Total Revenue</p>
            <p className="mt-3 text-3xl font-semibold text-foreground">Rp 18,450,000</p>
          </div>

          <div className="rounded-[30px] border border-[#F1E9EB] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F5EBE7] text-[#A66A3A]">
                <ShoppingBag className="h-5 w-5" />
              </span>
              <span className="text-sm font-semibold text-emerald-600">+12.8%</span>
            </div>
            <p className="mt-6 text-sm uppercase tracking-[0.3em] text-muted-foreground">Total Orders</p>
            <p className="mt-3 text-3xl font-semibold text-foreground">342</p>
          </div>

          <div className="rounded-[30px] border border-[#F1E9EB] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E6F6EE] text-[#1D8A5D]">
                <User className="h-5 w-5" />
              </span>
              <span className="text-sm font-semibold text-emerald-600">+8.1%</span>
            </div>
            <p className="mt-6 text-sm uppercase tracking-[0.3em] text-muted-foreground">Customers</p>
            <p className="mt-3 text-3xl font-semibold text-foreground">1,248</p>
          </div>

          <div className="rounded-[30px] border border-[#F1E9EB] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F6EEF4] text-[#7C4F9A]">
                <Box className="h-5 w-5" />
              </span>
              <span className="text-sm font-semibold text-emerald-600">+2 this month</span>
            </div>
            <p className="mt-6 text-sm uppercase tracking-[0.3em] text-muted-foreground">Products</p>
            <p className="mt-3 text-3xl font-semibold text-foreground">12</p>
          </div>
        </section>

        <section className="mt-6 grid gap-4 xl:grid-cols-[2fr_1fr]">
          <div className="rounded-[32px] border border-[#F1E9EB] bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">Revenue & Orders</p>
                <p className="mt-1 text-sm text-muted-foreground">Monthly trends for revenue and order volume</p>
              </div>
              <div className="inline-flex rounded-full bg-[#F9F2F6] px-4 py-2 text-sm font-semibold text-[#7C4F9A]">
                This Month
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[28px] border border-[#F4E8EC] bg-[#FBF4F6] p-5">
              <div className="absolute inset-x-0 top-8 h-px bg-[#E9D5DF]" />
              <div className="absolute inset-x-0 top-24 h-px bg-[#E9D5DF]" />
              <div className="absolute inset-x-0 top-40 h-px bg-[#E9D5DF]" />
              <div className="absolute inset-x-0 top-56 h-px bg-[#E9D5DF]" />
              <div className="absolute inset-x-0 top-72 h-px bg-[#E9D5DF]" />

              <div className="relative flex h-[320px] flex-col justify-end">
                <div className="absolute left-6 bottom-20 h-3 w-16 rounded-full bg-[#FBC3D3]" />
                <div className="absolute left-[120px] bottom-32 h-3 w-36 rounded-full bg-[#FBC3D3]" />
                <div className="absolute left-[220px] bottom-24 h-3 w-28 rounded-full bg-[#FBC3D3]" />
                <div className="absolute left-[320px] bottom-36 h-3 w-48 rounded-full bg-[#FBC3D3]" />
                <div className="absolute left-[420px] bottom-16 h-3 w-24 rounded-full bg-[#FBC3D3]" />
                <div className="absolute left-[520px] bottom-28 h-3 w-20 rounded-full bg-[#FBC3D3]" />
                <div className="absolute inset-x-0 bottom-0 h-1 bg-[#E9D5DF]" />
              </div>

              <div className="mt-6 grid grid-cols-3 gap-4 text-center text-xs text-muted-foreground">
                <span>Apr 1</span>
                <span>Apr 15</span>
                <span>May 1</span>
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-[#F1E9EB] bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">Revenue by Category</p>
                <p className="mt-1 text-sm text-muted-foreground">Category performance for this month</p>
              </div>
              <span className="text-sm font-semibold text-[#C75483]">28%</span>
            </div>

            <div className="flex flex-col items-center gap-6">
              <div className="relative flex h-48 w-48 items-center justify-center rounded-full bg-[conic-gradient(from_180deg_at_50%_50%,#D63664_0_28%,#9B5B2C_28%_54%,#F0AD40_54%_69%,#18B17C_69%_83%,#7263F0_83%_100%)]">
                <div className="h-24 w-24 rounded-full bg-white" />
              </div>

              <div className="w-full space-y-3">
                {[
                  { color: "bg-[#D63664]", name: "ASI Tea", value: "28%" },
                  { color: "bg-[#9B5B2C]", name: "Capsules", value: "26%" },
                  { color: "bg-[#F0AD40]", name: "Kookie Bites", value: "17%" },
                  { color: "bg-[#7263F0]", name: "Almond Cookies", value: "15%" },
                  { color: "bg-[#18B17C]", name: "Zoya Mix", value: "9%" },
                  { color: "bg-[#B97BF5]", name: "Almon Mix", value: "5%" },
                ].map((item) => (
                  <div key={item.name} className="flex items-center justify-between rounded-3xl bg-[#F9F2F4] px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex h-3.5 w-3.5 rounded-full ${item.color}`} aria-hidden="true" />
                      <span className="text-sm text-foreground">{item.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-foreground">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 xl:grid-cols-[1.8fr_1fr]">
          <div className="rounded-[32px] border border-[#F1E9EB] bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">Recent Orders</p>
              <button className="inline-flex items-center gap-2 text-sm font-semibold text-[#C75483] transition hover:text-[#9F3D62]">
                View All
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>

            <div className="overflow-hidden rounded-[28px] border border-[#F2E4E9] bg-[#FCF5F7]">
              <div className="grid grid-cols-4 gap-4 border-b border-[#F1E1E6] px-6 py-4 text-xs uppercase tracking-[0.12em] text-muted-foreground">
                <span>Order #</span>
                <span>Customer</span>
                <span>Total</span>
                <span>Status</span>
              </div>
              <div className="space-y-3 px-6 py-4 text-sm text-foreground">
                {[
                  { id: "MB-2024-0001", customer: "Siti Rahma", total: "Rp 325.000", status: "Delivered", color: "bg-emerald-100 text-emerald-700" },
                  { id: "MB-2024-0002", customer: "Dewi Anggraeni", total: "Rp 240.000", status: "Shipped", color: "bg-violet-100 text-violet-700" },
                  { id: "MB-2024-0003", customer: "Putri Maharani", total: "Rp 180.000", status: "Processing", color: "bg-sky-100 text-sky-700" },
                ].map((order) => (
                  <div key={order.id} className="grid grid-cols-4 gap-4 items-center rounded-3xl bg-white px-4 py-4 shadow-sm">
                    <span className="font-semibold text-[#4B2F2F]">{order.id}</span>
                    <span className="text-sm text-muted-foreground">{order.customer}</span>
                    <span className="font-medium text-foreground">{order.total}</span>
                    <span className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold ${order.color}`}>{order.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-[#F1E9EB] bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">Low Stock Alert</p>
              <span className="text-lg">⚠️</span>
            </div>

            <div className="space-y-4">
              {[
                { label: "Almon Mix", detail: "15 units left" },
                { label: "ASI Booster Tea", detail: "18 units left" },
                { label: "Almon Mix", detail: "22 units left" },
              ].map((item, index) => (
                <div key={`${item.label}-${index}`} className="flex items-center gap-4 rounded-[26px] bg-[#FFF1F4] p-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#F7D2DC] text-[#C75483] text-sm font-semibold">
                    {item.label.split(" ")[0].slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
