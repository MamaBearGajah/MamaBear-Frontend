"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type AccordionItem = {
  id: string;
  title: string;
  content: React.ReactNode;
};

type AccordionProps = {
  items: AccordionItem[];
  defaultOpenId?: string;
  className?: string;
};

export function Accordion({ items, defaultOpenId, className }: AccordionProps) {
  const [openId, setOpenId] = React.useState<string | null>(
    defaultOpenId ?? null
  );

  return (
    <div className={cn("space-y-3", className)}>
      {items.map((item) => {
        const isOpen = openId === item.id;

        return (
          <div
            key={item.id}
            className="overflow-hidden rounded-3xl border border-[var(--mb-border)] bg-white"
          >
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-extrabold text-[var(--mb-brown)]"
              onClick={() => setOpenId(isOpen ? null : item.id)}
              aria-expanded={isOpen}
            >
              <span>{item.title}</span>
              <span className="text-xl text-[var(--mb-pink)]">
                {isOpen ? "−" : "+"}
              </span>
            </button>

            {isOpen && (
              <div className="border-t border-[var(--mb-border)] px-5 py-4 text-sm leading-6 text-[var(--mb-muted)]">
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}