"use client";
import { useEffect, useState } from "react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const depth = (window.scrollY / scrollable) * 100;
      setVisible(depth >= 30);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return visible ? (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-20 right-12 cursor-pointer hover:shadow-2xl flex items-center gap-2 px-4 py-2 z-50 bg-[var(--mamabear-dark-pink)] text-white rounded-full text-sm font-medium transition-all"
    >
      ↑ Back to top
    </button>
  ) : null;
}