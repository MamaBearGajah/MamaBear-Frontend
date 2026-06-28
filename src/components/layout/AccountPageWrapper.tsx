"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  icon?: LucideIcon;
  actionButton?: React.ReactNode;
  children: React.ReactNode;
}

export function AccountPageWrapper({ title, icon: Icon, actionButton, children }: Props) {
  return (
    <div className="bg-white rounded-3xl border border-[#F8D7E3] shadow-sm animate-in fade-in duration-300">
      {/* Header Container dengan Ikon */}
      <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-[#F8D7E3]">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="p-2.5 bg-[#FDF2F5] rounded-xl text-[#F05A89]">
              <Icon size={20} strokeWidth={2.5} />
            </div>
          )}
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">{title}</h2>
        </div>
        {actionButton && <div>{actionButton}</div>}
      </div>
      
      {/* Content Container */}
      <div className="p-6 sm:p-8">
        {children}
      </div>
    </div>
  );
}