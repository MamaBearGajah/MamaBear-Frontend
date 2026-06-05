"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, MapPin, ShoppingBag, Gift } from "lucide-react";
import AuthGuard from "@/components/auth/AuthGuard";
import { cn } from "@/lib/utils";

const ACCOUNT_LINKS = [
  { href: "/account/profile", label: "My Profile", icon: User },
  { href: "/account/addresses", label: "Address Book", icon: MapPin },
  { href: "/account/orders", label: "My Orders", icon: ShoppingBag },
  { href: "/account/membership", label: "Membership", icon: Gift },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AuthGuard>
    <div className="min-h-screen bg-[#FAFAFA] pb-20">
      {/* Banner Header Minimalis */}
      <div className="w-full bg-[#D5557E] h-32 sm:h-40" />

      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 -mt-16 sm:-mt-20">
        <div className="flex flex-col md:flex-row gap-6 lg:gap-8">
          
          {/* Sidebar Navigasi */}
          <aside className="w-full md:w-64 lg:w-72 shrink-0">
            <div className="bg-white rounded-2xl border p-4 shadow-sm sticky top-24" style={{ borderColor: "#F0D9E2" }}>
              {/* Menu Desktop (Vertical) & Mobile (Horizontal Scroll) */}
              <nav className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
                {ACCOUNT_LINKS.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap",
                        isActive 
                          ? "bg-[#FFF5F8] text-[#D5557E] border-2 border-[#D5557E]" 
                          : "text-[#8B6352] hover:bg-pink-50 border-2 border-transparent"
                      )}
                    >
                      <link.icon size={18} className={isActive ? "text-[#D5557E]" : "text-[#8B6352]"} />
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Konten Halaman (Berubah-ubah sesuai URL) */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
          
        </div>
      </div>
    </div>
    </AuthGuard>
  );
}