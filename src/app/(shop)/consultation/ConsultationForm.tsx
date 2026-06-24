
"use client";

/**
 * src/app/(shop)/consultation/ConsultationForm.tsx
 * Form submit konsultasi ke BE (POST /consultations)
 * Sinkron dengan CreateConsultationDto backend
 */

import { useState } from "react";
import { Send, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { consultationApi } from "@/lib/api/consultation";

export function ConsultationForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const setField =
    (key: keyof typeof form) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement
      >
    ) =>
      setForm((prev) => ({
        ...prev,
        [key]: e.target.value,
      }));

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    const name = form.name.trim();
    const email = form.email.trim();
    const phone = form.phone.trim();
    const message = form.message.trim();

    if (!name || !email || !message) {
      toast.error(
        "Nama, email, dan pesan wajib diisi"
      );
      return;
    }

    if (name.length > 100) {
      toast.error(
        "Nama maksimal 100 karakter"
      );
      return;
    }

    if (phone.length > 30) {
      toast.error(
        "Nomor WhatsApp maksimal 30 karakter"
      );
      return;
    }

    if (message.length > 5000) {
      toast.error(
        "Pesan maksimal 5000 karakter"
      );
      return;
    }

    const phoneRegex =
      /^(\+62|62|0)[0-9]{8,15}$/;

    if (
      phone &&
      !phoneRegex.test(phone)
    ) {
      toast.error(
        "Nomor WhatsApp tidak valid"
      );
      return;
    }

    setSubmitting(true);

    try {
      await consultationApi.create({
        name,
        email,
        phone: phone || undefined,
        message,
      });

      setForm({
        name: "",
        email: "",
        phone: "",
        message: "",
      });

      setSubmitted(true);

      toast.success(
        "Konsultasi berhasil dikirim"
      );
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error?.message ||
        "Gagal mengirim konsultasi";

      toast.error(
        Array.isArray(errorMessage)
          ? errorMessage.join(", ")
          : errorMessage
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div
        id="booking"
        className="flex flex-col items-center justify-center gap-4 py-16 text-center"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="size-8 text-green-600" />
        </div>

        <h3
          className="text-xl font-bold"
          style={{ color: "#6C4735" }}
        >
          Pesan Terkirim!
        </h3>

        <p
          className="max-w-sm text-sm"
          style={{ color: "#8B6352" }}
        >
          Tim konsultan kami akan
          menghubungi kamu dalam 1×24 jam
          kerja. Terima kasih sudah
          mempercayai Mamabear 🐻
        </p>
      </div>
    );
  }

  return (
    <div
      id="booking"
      className="mx-auto w-full max-w-xl"
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-3xl border border-pink-100 bg-white p-8 shadow-sm"
      >
        <h3
          className="text-xl font-bold"
          style={{ color: "#6C4735" }}
        >
          Kirim Pertanyaan
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 space-y-1 sm:col-span-1">
            <label
              className="text-sm font-medium"
              style={{ color: "#6C4735" }}
            >
              Nama *
            </label>

            <input
              required
              value={form.name}
              onChange={setField("name")}
              placeholder="Nama lengkap"
              maxLength={100}
              autoComplete="name"
              className="h-11 w-full rounded-xl border border-pink-100 px-4 text-sm outline-none focus:border-pink-300"
              style={{ color: "#4C3437" }}
            />
          </div>

          <div className="col-span-2 space-y-1 sm:col-span-1">
            <label
              className="text-sm font-medium"
              style={{ color: "#6C4735" }}
            >
              Email *
            </label>

            <input
              required
              type="email"
              value={form.email}
              onChange={setField("email")}
              placeholder="email@contoh.com"
              autoComplete="email"
              className="h-11 w-full rounded-xl border border-pink-100 px-4 text-sm outline-none focus:border-pink-300"
              style={{ color: "#4C3437" }}
            />
          </div>
        </div>

        <div className="space-y-1">
          <label
            className="text-sm font-medium"
            style={{ color: "#6C4735" }}
          >
            No. WhatsApp{" "}
            <span className="text-xs text-gray-400">
              — opsional
            </span>
          </label>

          <input
            value={form.phone}
            onChange={setField("phone")}
            placeholder="081234567890"
            maxLength={30}
            inputMode="tel"
            autoComplete="tel"
            className="h-11 w-full rounded-xl border border-pink-100 px-4 text-sm outline-none focus:border-pink-300"
            style={{ color: "#4C3437" }}
          />
        </div>

        <div className="space-y-1">
          <label
            className="text-sm font-medium"
            style={{ color: "#6C4735" }}
          >
            Pesan / Pertanyaan *
          </label>

          <textarea
            required
            rows={5}
            value={form.message}
            onChange={setField("message")}
            maxLength={5000}
            placeholder="Ceritakan kondisi & pertanyaanmu di sini..."
            className="w-full resize-none rounded-xl border border-pink-100 px-4 py-3 text-sm outline-none focus:border-pink-300"
            style={{ color: "#4C3437" }}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl py-3 font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          style={{
            backgroundColor: "#D5557E",
          }}
        >
          {submitting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Send className="size-4" />
          )}

          {submitting
            ? "Mengirim..."
            : "Kirim Pesan"}
        </button>
      </form>
    </div>
  );
}
