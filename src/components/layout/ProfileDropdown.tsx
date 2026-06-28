"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { User, MapPin, Settings, LogOut, ChevronDown, ShoppingBag, Gift } from "lucide-react";

interface ProfileDropdownProps {
  user: { name?: string; email?: string };
  onLogout: () => void;
}

export default function ProfileDropdown({ user, onLogout }: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const MENU_ITEMS = [
    { icon: User, label: "My Profile", path: "/account/profile" },
    { icon: ShoppingBag, label: "My Orders", path: "/account/orders" },
    { icon: MapPin, label: "Saved Addresses", path: "/account/addresses" },
    { icon: Gift, label: "Membership", path: "/account/membership" },
    { icon: Settings, label: "Settings", path: "/account/profile?tab=settings" },
  ];

  const safeName = user?.name || "Member";

  return (
    <div className="relative hidden sm:flex items-center gap-2" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-4 py-2 rounded-full transition-all font-semibold text-sm border border-[#F8D7E3] hover:bg-[#FDF2F5]"
        style={{ color: "#F05A89" }}
      >
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center text-white font-black shrink-0"
          style={{ backgroundColor: "#F05A89", fontSize: "10px" }}
        >
          {safeName.charAt(0).toUpperCase()}
        </div>
        <span className="hidden lg:inline max-w-[100px] truncate text-gray-700">
          {safeName.split(" ")[0]}
        </span>
        <ChevronDown size={13} className={`transition-transform text-[#F05A89] ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 top-full mt-2 w-56 bg-white rounded-3xl shadow-lg border border-[#F8D7E3] py-2 z-50 animate-in fade-in zoom-in-95 duration-200"
        >
          <div className="px-4 py-3 border-b border-[#F8D7E3]">
            <p className="font-bold text-sm truncate text-gray-800">{safeName}</p>
            <p className="text-xs truncate text-gray-500 mt-0.5">{user?.email}</p>
          </div>
          
          <div className="py-2">
            {MENU_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.path}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#FDF2F5] text-sm font-medium transition-colors text-gray-700 group"
              >
                <item.icon size={16} className="text-[#F05A89] group-hover:scale-110 transition-transform" /> 
                {item.label}
              </Link>
            ))}
          </div>

          <div className="border-t border-[#F8D7E3] mx-3 my-1" />
          
          <button
            onClick={() => { 
              setIsOpen(false); 
              onLogout(); 
            }}
            className="flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 text-sm w-full text-left transition-colors text-red-500 font-bold"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      )}
    </div>
  );
}