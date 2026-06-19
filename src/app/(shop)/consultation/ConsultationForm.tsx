"use client";

/**
 * src/app/(shop)/consultation/ConsultationForm.tsx
 * Form submit konsultasi ke BE (POST /consultations)
 * Import di consultation/page.tsx yang sudah ada.
 */

import { useState } from "react";
import { Send, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { consultationApi } from "@/lib/api/consultation";

export function ConsultationForm() {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", subject: "", message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Nama, email, dan pesan wajib diisi");
      return;
    }
    setSubmitting(true);
    try {
      await consultationApi.submit({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        subject: form.subject.trim() || "Konsultasi Umum",
        message: form.message.trim(),
      });
      setSubmitted(true);
    } catch (e: any) {
      toast.error(e?.response?.data?.error?.message ?? "Gagal mengirim, coba lagi");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div id="booking" className="flex flex-col items-center justify-center gap-4 py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="size-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold" style={{ color: "#6C4735" }}>Pesan Terkirim!</h3>
        <p className="max-w-sm text-sm" style={{ color: "#8B6352" }}>
          Tim konsultan kami akan menghubungi kamu dalam 1×24 jam kerja. Terima kasih sudah mempercayai Mamabear 🐻
        </p>
      </div>
    );
  }

  return (
    <div id="booking" className="mx-auto w-full max-w-xl">
      <form onSubmit={handleSubmit} className="rounded-3xl border border-pink-100 bg-white p-8 shadow-sm space-y-4">
        <h3 className="text-xl font-bold" style={{ color: "#6C4735" }}>Kirim Pertanyaan</h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 sm:col-span-1 space-y-1">
            <label className="text-sm font-medium" style={{ color: "#6C4735" }}>Nama *</label>
            <input
              value={form.name} onChange={set("name")} required
              placeholder="Nama lengkap"
              className="h-11 w-full rounded-xl border border-pink-100 px-4 text-sm outline-none focus:border-pink-300"
              style={{ color: "#4C3437" }}
            />
          </div>
          <div className="col-span-2 sm:col-span-1 space-y-1">
            <label className="text-sm font-medium" style={{ color: "#6C4735" }}>Email *</label>
            <input
              type="email" value={form.email} onChange={set("email")} required
              placeholder="email@contoh.com"
              className="h-11 w-full rounded-xl border border-pink-100 px-4 text-sm outline-none focus:border-pink-300"
              style={{ color: "#4C3437" }}
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium" style={{ color: "#6C4735" }}>No. WhatsApp <span className="text-xs text-gray-400">— opsional</span></label>
          <input
            value={form.phone} onChange={set("phone")}
            placeholder="08xxxxxxxxxx"
            className="h-11 w-full rounded-xl border border-pink-100 px-4 text-sm outline-none focus:border-pink-300"
            style={{ color: "#4C3437" }}
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium" style={{ color: "#6C4735" }}>Topik</label>
          <select
            value={form.subject} onChange={set("subject")}
            className="h-11 w-full rounded-xl border border-pink-100 px-4 text-sm outline-none focus:border-pink-300 bg-white"
            style={{ color: "#4C3437" }}
          >
            <option value="">Pilih topik...</option>
            <option>Konsultasi Menyusui</option>
            <option>Produk ASI Booster</option>
            <option>Nutrisi Ibu Menyusui</option>
            <option>Pijat Oksitosin</option>
            <option>Lainnya</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium" style={{ color: "#6C4735" }}>Pesan / Pertanyaan *</label>
          <textarea
            value={form.message} onChange={set("message")} required
            rows={5}
            placeholder="Ceritakan kondisi & pertanyaanmu di sini..."
            className="w-full rounded-xl border border-pink-100 px-4 py-3 text-sm outline-none focus:border-pink-300 resize-none"
            style={{ color: "#4C3437" }}
          />
        </div>

        <button
          type="submit" disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl py-3 font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          style={{ backgroundColor: "#D5557E" }}
        >
          {submitting ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
          {submitting ? "Mengirim..." : "Kirim Pesan"}
        </button>
      </form>
    </div>
  );
}