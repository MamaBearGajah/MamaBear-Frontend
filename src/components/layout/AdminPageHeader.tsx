import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface AdminPageHeaderProps {
  title: string;
  userName?: string;
  showGlobalSearch?: boolean;
}

export default function AdminPageHeader({
  title,
  userName = "Admin",
  showGlobalSearch = true,
}: AdminPageHeaderProps) {
  const today = format(new Date(), "EEEE, d MMMM yyyy", { locale: localeId });

  return (
    <header className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="mt-1 text-sm capitalize text-muted-foreground">{today}</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {showGlobalSearch ? (
          <div className="relative hidden md:block">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search…"
              className="w-48 pl-9 lg:w-56"
              disabled
              aria-label="Global search (coming soon)"
            />
          </div>
        ) : null}
        <button
          type="button"
          className="relative rounded-lg border border-border p-2 text-muted-foreground transition-colors hover:bg-muted"
          aria-label="Notifications"
        >
          <Bell className="size-5" />
          <span className="absolute -top-0.5 -right-0.5 size-2.5 rounded-full bg-red-500" />
        </button>
        <div className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5">
          <span
            className="flex size-8 items-center justify-center rounded-full bg-[var(--mamabear-dark-pink)] text-sm font-semibold text-white"
            aria-hidden
          >
            {userName.charAt(0).toUpperCase()}
          </span>
          <span className="text-sm font-medium text-foreground">{userName}</span>
        </div>
      </div>
    </header>
  );
}