"use client";

/**
 * src/components/chat/ChatbotWidget.tsx
 *
 * Dipasang HANYA di src/app/(shop)/layout.tsx — JANGAN di app/layout.tsx (root layout)
 * agar tidak terjadi hydration mismatch SSR/CSR.
 *
 *   import ChatbotWidget from "@/components/chat/ChatbotWidget";
 *   // dalam JSX setelah <Footer />:
 *   <ChatbotWidget />
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Loader2, Bot, User, ChevronRight } from "lucide-react";
import { chatbotApi } from "@/lib/api/chatbot";

type Role = "user" | "bot";

interface Message {
  id: string;
  role: Role;
  text: string;
  suggestions?: string[];
  time: string;
}

function nowTime() {
  return new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
}

const WELCOME: Message = {
  id: "welcome",
  role: "bot",
  text: "Halo! Saya asisten Mamabear 🐻 Ada yang bisa saya bantu? Tanya soal produk, pengiriman, atau pembayaran ya!",
  suggestions: [
    "Produk apa yang tersedia?",
    "Cara order produk",
    "Berapa ongkos kirim?",
    "Metode pembayaran apa saja?",
  ],
  time: nowTime(),
};

/** Suggestion fallback yang ditampilkan kalau chatbot tidak menemukan FAQ yang cocok */
const FALLBACK_SUGGESTIONS = [
  "Cara order produk",
  "Status pesanan saya",
  "Hubungi CS",
];

function Bubble({ msg, onSuggestion }: { msg: Message; onSuggestion: (s: string) => void }) {
  const isBot = msg.role === "bot";
  return (
    <div className={`flex gap-2 ${isBot ? "items-start" : "items-start flex-row-reverse"}`}>
      <div
        className={`flex size-7 shrink-0 items-center justify-center rounded-full text-white mt-0.5 ${
          isBot ? "bg-[#D95A87]" : "bg-[#6C4735]"
        }`}
      >
        {isBot ? <Bot className="size-4" /> : <User className="size-4" />}
      </div>

      <div className={`max-w-[80%] space-y-2 ${isBot ? "" : "items-end flex flex-col"}`}>
        <div
          className={`rounded-2xl px-3 py-2 text-sm leading-relaxed ${
            isBot
              ? "rounded-tl-none bg-[#FDF0F5] text-[#4C3437]"
              : "rounded-tr-none bg-[#D95A87] text-white"
          }`}
        >
          {msg.text}
        </div>
        <p className="text-[10px] text-gray-400 px-1">{msg.time}</p>

        {isBot && msg.suggestions && msg.suggestions.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {msg.suggestions.map((s) => (
              <button
                key={s}
                onClick={() => onSuggestion(s)}
                className="flex items-center gap-1 rounded-full border border-[#F4C0D1] bg-white px-3 py-1 text-xs font-medium text-[#D95A87] hover:bg-[#FDF0F5] transition-colors"
              >
                {s}
                <ChevronRight className="size-3" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ChatbotWidget() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mount hanya di client setelah hydration selesai
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
      }, 50);
    }
  }, [messages, open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      const userMsg: Message = {
        id: Date.now().toString(),
        role: "user",
        text: trimmed,
        time: nowTime(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setLoading(true);

      try {
        const res = await chatbotApi.query(trimmed);

        // FIX: logika suggestions sebelumnya terbalik.
        // Sekarang: kalau ada suggestedFaqIds → kosongkan (FAQ sudah ditampilkan di answer),
        // kalau tidak ada match → tampilkan fallback suggestion untuk mengarahkan user.
        const suggestions =
          res.suggestedFaqIds.length === 0 ? FALLBACK_SUGGESTIONS : [];

        const botMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: "bot",
          text: res.answer,
          suggestions,
          time: nowTime(),
        };
        setMessages((prev) => [...prev, botMsg]);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "bot",
            text: "Maaf, saya sedang gangguan. Silakan hubungi CS kami di WhatsApp 😊",
            suggestions: FALLBACK_SUGGESTIONS,
            time: nowTime(),
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [loading]
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  // Jangan render apapun saat SSR / sebelum hydration
  if (!mounted) return null;

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Buka chatbot"
        className={`fixed bottom-5 right-4 z-40 flex size-14 items-center justify-center rounded-full bg-[#D95A87] text-white shadow-lg transition-all duration-200 hover:scale-110 hover:bg-[#C04878] sm:bottom-6 sm:right-6 sm:size-16 ${
          open ? "scale-0 opacity-0 pointer-events-none" : "scale-100 opacity-100"
        }`}
      >
        <MessageCircle className="size-6 sm:size-7" />
        <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-[#6C4735] text-[9px] font-bold text-white">
          1
        </span>
      </button>

      {/* Chat Window */}
      {open && (
        <>
          {/* Mobile backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/20 sm:hidden"
            onClick={() => setOpen(false)}
            aria-hidden
          />

          <div
            role="dialog"
            aria-label="Chatbot Mamabear"
            className="fixed z-50 flex flex-col overflow-hidden rounded-t-2xl border border-[#F1E9EB] bg-white shadow-2xl bottom-0 left-0 right-0 h-[85vh] sm:bottom-6 sm:left-auto sm:right-6 sm:h-[520px] sm:w-[380px] sm:rounded-2xl"
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-[#F1E9EB] bg-[#D95A87] px-4 py-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/20">
                <Bot className="size-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">Mamabear Assistant</p>
                <p className="text-xs text-white/70">Biasanya membalas dalam beberapa detik</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Tutup chat"
                className="rounded-full p-1.5 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-4">
              {messages.map((msg) => (
                <Bubble key={msg.id} msg={msg} onSuggestion={sendMessage} />
              ))}
              {loading && (
                <div className="flex items-start gap-2">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#D95A87] text-white mt-0.5">
                    <Bot className="size-4" />
                  </div>
                  <div className="rounded-2xl rounded-tl-none bg-[#FDF0F5] px-4 py-3">
                    <Loader2 className="size-4 animate-spin text-[#D95A87]" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 border-t border-[#F1E9EB] bg-white px-3 py-3 sm:px-4"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ketik pertanyaan..."
                disabled={loading}
                className="h-10 flex-1 rounded-full border border-[#EFE6EA] bg-[#FDF8FA] px-4 text-sm text-[#4C3437] outline-none placeholder:text-gray-400 focus:border-[#D95A87] disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label="Kirim pesan"
                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#D95A87] text-white transition-colors hover:bg-[#C04878] disabled:opacity-40"
              >
                <Send className="size-4" />
              </button>
            </form>

            {/* iPhone safe area */}
            <div className="h-[env(safe-area-inset-bottom,0px)] sm:hidden" />
          </div>
        </>
      )}
    </>
  );
}