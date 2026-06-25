"use client";

import React, { useState, useRef } from "react";
import { X, Loader } from "lucide-react";
import { consultationApi } from "@/lib/api/consultation";

interface ScheduleVideoCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ScheduleVideoCallModal({
  isOpen,
  onClose,
  onSuccess,
}: ScheduleVideoCallModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    consultationDate: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === modalRef.current) onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name || !formData.email || !formData.consultationDate) {
      setError("Mohon lengkapi semua field yang wajib diisi");
      return;
    }

    setIsLoading(true);

    try {
      // Gabungkan subject dan consultationDate ke dalam message
      // karena CreateConsultationDto BE hanya terima: name, email, phone, message
      const parts: string[] = [];
      if (formData.subject) parts.push(`Topik: ${formData.subject}`);
      parts.push(`Tanggal konsultasi: ${formData.consultationDate}`);
      if (formData.message) parts.push(`\n${formData.message}`);

      const combinedMessage = parts.join("\n");

      await consultationApi.create({
        name: formData.name,
        email: formData.email,
        ...(formData.phone && { phone: formData.phone }),
        message: combinedMessage,
      });

      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        consultationDate: "",
      });

      setTimeout(() => {
        onClose();
        setSuccess(false);
        onSuccess?.();
      }, 2000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal menjadwalkan konsultasi"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <div
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
        style={{ fontFamily: "'Urbanist', sans-serif" }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 z-10 rounded-full p-2 transition-colors hover:bg-gray-100"
        >
          <X size={24} style={{ color: "#6C4735" }} />
        </button>

        {/* Modal Content */}
        <div className="p-6 sm:p-10">
          <h2
            className="mb-2 text-2xl font-black sm:text-3xl"
            style={{ color: "#6C4735" }}
          >
            Schedule Your Video Call
          </h2>
          <p className="mb-8" style={{ color: "#8B6352" }}>
            Book a 45-minute personalized consultation with our certified
            lactation consultant
          </p>

          {success ? (
            <div
              className="rounded-2xl p-8 text-center"
              style={{ backgroundColor: "#FFF5F8" }}
            >
              <div
                className="mb-4 flex h-16 w-16 items-center justify-center rounded-full mx-auto"
                style={{ backgroundColor: "#D5557E" }}
              >
                <svg
                  className="h-8 w-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3
                className="mb-2 text-xl font-bold"
                style={{ color: "#6C4735" }}
              >
                Consultation Scheduled! 🎉
              </h3>
              <p style={{ color: "#8B6352" }}>
                Thank you for booking. You'll receive confirmation details via
                email shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {error && (
                <div
                  className="rounded-lg border-l-4 p-4"
                  style={{
                    borderColor: "#D5557E",
                    backgroundColor: "#FFF5F8",
                    color: "#6C4735",
                  }}
                >
                  {error}
                </div>
              )}

              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block font-semibold"
                  style={{ color: "#6C4735" }}
                >
                  Full Name <span style={{ color: "#D5557E" }}>*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your full name"
                  className="w-full rounded-xl border-2 px-4 py-3 outline-none transition-colors focus:border-[#D5557E]"
                  style={{ borderColor: "#FACBD8", color: "#6C4735" }}
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block font-semibold"
                  style={{ color: "#6C4735" }}
                >
                  Email <span style={{ color: "#D5557E" }}>*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  className="w-full rounded-xl border-2 px-4 py-3 outline-none transition-colors focus:border-[#D5557E]"
                  style={{ borderColor: "#FACBD8", color: "#6C4735" }}
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block font-semibold"
                  style={{ color: "#6C4735" }}
                >
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+62 8XX XXX XXXX"
                  className="w-full rounded-xl border-2 px-4 py-3 outline-none transition-colors focus:border-[#D5557E]"
                  style={{ borderColor: "#FACBD8", color: "#6C4735" }}
                />
              </div>

              {/* Subject */}
              <div>
                <label
                  htmlFor="subject"
                  className="mb-2 block font-semibold"
                  style={{ color: "#6C4735" }}
                >
                  Subject
                </label>
                <input
                  id="subject"
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="e.g., Latching Issues, Low Supply"
                  className="w-full rounded-xl border-2 px-4 py-3 outline-none transition-colors focus:border-[#D5557E]"
                  style={{ borderColor: "#FACBD8", color: "#6C4735" }}
                />
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block font-semibold"
                  style={{ color: "#6C4735" }}
                >
                  Tell us about your concerns
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Please describe your breastfeeding concerns in detail..."
                  rows={4}
                  className="w-full rounded-xl border-2 px-4 py-3 outline-none transition-colors focus:border-[#D5557E] resize-none"
                  style={{ borderColor: "#FACBD8", color: "#6C4735" }}
                />
              </div>

              {/* Consultation Date */}
              <div>
                <label
                  htmlFor="consultationDate"
                  className="mb-2 block font-semibold"
                  style={{ color: "#6C4735" }}
                >
                  Preferred Consultation Date{" "}
                  <span style={{ color: "#D5557E" }}>*</span>
                </label>
                <input
                  id="consultationDate"
                  type="datetime-local"
                  name="consultationDate"
                  value={formData.consultationDate}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border-2 px-4 py-3 outline-none transition-colors focus:border-[#D5557E]"
                  style={{ borderColor: "#FACBD8", color: "#6C4735" }}
                  required
                />
              </div>

              {/* Price Display */}
              <div
                className="rounded-xl p-4"
                style={{ backgroundColor: "#FFF5F8" }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold" style={{ color: "#6C4735" }}>
                    Consultation Price:
                  </span>
                  <span
                    className="text-lg font-black"
                    style={{ color: "#D5557E" }}
                  >
                    Rp 150.000
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-full py-3 font-bold text-white transition-transform hover:scale-105 disabled:opacity-70 sm:py-4"
                style={{ backgroundColor: "#D5557E" }}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader size={20} className="animate-spin" />
                    Scheduling...
                  </span>
                ) : (
                  "Schedule Consultation"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}