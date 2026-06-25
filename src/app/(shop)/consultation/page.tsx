"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BackToTop from "@/components/common/BackToTop";
import ScheduleVideoCallModal from "@/components/consultation/ScheduleVideoCallModal";
import { ConsultationForm } from "@/app/(shop)/consultation/ConsultationForm";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import {
  Calendar,
  Video,
  MessageCircle,
  HeartHandshake,
  Star,
  CheckCircle2,
  Clock,
  Award,
} from "lucide-react";

export default function ConsultationPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { state } = useAuth();
  const router = useRouter();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleScheduleClick = () => {
    if (!state.isAuthenticated) {
      toast.error("Please log in to schedule a consultation");
      router.push("/auth");
      return;
    }
    setIsModalOpen(true);
  };

  return (
    <div className="w-full" style={{ fontFamily: "'Urbanist', sans-serif" }}>
      <BackToTop />
      {/* Hero Section - Full Bleed */}
      <section className="relative flex h-[60vh] min-h-[500px] w-full items-center">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1542385151-efd9000785a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RoZXIlMjBob2xkaW5nJTIwYmFieXxlbnwxfHx8fDE3NzgyNDM1MTl8MA&ixlib=rb-4.1.0&q=80&w=1080")`,
          }}
        >
          {/* Gradient Overlay */}
          <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#FFF5F8] via-[#FFF5F8]/80 to-transparent"></div>
        </div>

        <div className="relative z-20 w-full px-6 sm:px-12 lg:px-24">
          <div className="max-w-2xl">
            <span
              className="mb-4 inline-block rounded-full px-4 py-1.5 text-xs font-bold"
              style={{ backgroundColor: "#FACBD8", color: "#6C4735" }}
            >
              👩‍⚕️ Expert Support for Your Journey
            </span>
            <h1
              className="mb-6 text-4xl leading-tight font-black md:text-5xl lg:text-6xl"
              style={{ color: "#6C4735" }}
            >
              Empowering your{" "}
              <span style={{ color: "#D5557E" }}>breastfeeding</span>{" "}
              experience.
            </h1>
            <p
              className="mb-8 text-lg leading-relaxed font-medium md:text-xl"
              style={{ color: "#8B6352" }}
            >
              Get personalized guidance, emotional support, and evidence-based
              advice from our certified lactation consultants. Because every
              drop counts, and you don't have to do it alone. 🐻
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="#booking"
                className="rounded-full px-8 py-4 font-bold text-white shadow-lg transition-transform hover:-translate-y-1"
                style={{ backgroundColor: "#D5557E" }}
              >
                Book a Free Session
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us - Full Width Banner */}
      <section
        className="w-full px-6 py-20 sm:px-12 lg:px-24"
        style={{ backgroundColor: "#FACBD8" }}
      >
        <div className="mb-16 text-center">
          <h2
            className="mb-4 text-3xl font-black md:text-4xl"
            style={{ color: "#6C4735" }}
          >
            Why Consult with Mamabear?
          </h2>
          <p className="text-lg" style={{ color: "#8B6352" }}>
            We combine clinical expertise with warm, mother-to-mother empathy.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-12">
          {/* Feature 1 */}
          <div className="transform rounded-3xl bg-white p-8 text-center shadow-sm transition-transform hover:-translate-y-2">
            <div
              className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full"
              style={{ backgroundColor: "#FFF5F8" }}
            >
              <HeartHandshake size={32} style={{ color: "#D5557E" }} />
            </div>
            <h3 className="mb-3 text-xl font-bold" style={{ color: "#6C4735" }}>
              Judgment-Free Zone
            </h3>
            <p style={{ color: "#8B6352" }}>
              Every mother's journey is unique. We provide a safe space to share
              your struggles without any pressure or judgment.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="transform rounded-3xl bg-white p-8 text-center shadow-sm transition-transform hover:-translate-y-2">
            <div
              className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full"
              style={{ backgroundColor: "#FFF5F8" }}
            >
              <Award size={32} style={{ color: "#D5557E" }} />
            </div>
            <h3 className="mb-3 text-xl font-bold" style={{ color: "#6C4735" }}>
              Certified Experts
            </h3>
            <p style={{ color: "#8B6352" }}>
              Our team consists of IBCLC-certified consultants who stay updated
              with the latest breastfeeding medicine research.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="transform rounded-3xl bg-white p-8 text-center shadow-sm transition-transform hover:-translate-y-2">
            <div
              className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full"
              style={{ backgroundColor: "#FFF5F8" }}
            >
              <Video size={32} style={{ color: "#D5557E" }} />
            </div>
            <h3 className="mb-3 text-xl font-bold" style={{ color: "#6C4735" }}>
              Flexible Access
            </h3>
            <p style={{ color: "#8B6352" }}>
              Choose between private 1-on-1 video calls or text-based
              consultation based on your availability and comfort.
            </p>
          </div>
        </div>
      </section>

      {/* Meet the Experts Section */}
      <section className="w-full bg-white px-6 py-24 sm:px-12 lg:px-24">
        <div className="flex flex-col items-center gap-16 lg:flex-row">
          <div className="w-full lg:w-1/3">
            <h2
              className="mb-6 text-3xl font-black md:text-4xl"
              style={{ color: "#6C4735" }}
            >
              Meet Your <br className="hidden lg:block" /> Support Village
            </h2>
            <p className="mb-8 text-lg" style={{ color: "#8B6352" }}>
              Our compassionate consultants have helped thousands of mothers
              overcome latching issues, low supply, and pumping challenges.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={24} style={{ color: "#D5557E" }} />
                <span className="font-semibold" style={{ color: "#6C4735" }}>
                  IBCLC Certified
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 size={24} style={{ color: "#D5557E" }} />
                <span className="font-semibold" style={{ color: "#6C4735" }}>
                  5+ Years Experience
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 size={24} style={{ color: "#D5557E" }} />
                <span className="font-semibold" style={{ color: "#6C4735" }}>
                  Moms Themselves
                </span>
              </div>
            </div>
          </div>

          <div className="grid w-full grid-cols-1 gap-8 sm:grid-cols-2 lg:w-2/3">
            {/* Expert 1 */}
            <div className="overflow-hidden rounded-3xl border-2 border-transparent shadow-lg transition-colors hover:border-[#FACBD8]">
              <img
                src="https://images.unsplash.com/photo-1576669802218-d535933f897c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMGZlbWFsZSUyMGRvY3RvcnxlbnwxfHx8fDE3NzgyNDM1MTl8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Dr. Sarah"
                className="h-72 w-full object-cover object-top"
              />
              <div className="p-6" style={{ backgroundColor: "#FFF5F8" }}>
                <div className="mb-2 flex items-start justify-between">
                  <h3
                    className="text-xl font-black"
                    style={{ color: "#6C4735" }}
                  >
                    Dr. Ayu Larasati
                  </h3>
                  <div className="flex text-yellow-400">
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                  </div>
                </div>
                <p
                  className="mb-3 text-sm font-bold"
                  style={{ color: "#D5557E" }}
                >
                  IBCLC, Pediatrician
                </p>
                <p className="text-sm" style={{ color: "#8B6352" }}>
                  "I believe every mother deserves the right support system to
                  achieve their breastfeeding goals without guilt."
                </p>
              </div>
            </div>

            {/* Expert 2 */}
            <div className="overflow-hidden rounded-3xl border-2 border-transparent shadow-lg transition-colors hover:border-[#FACBD8]">
              <img
                src="https://images.unsplash.com/photo-1673865641073-4479f93a7776?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBkb2N0b3IlMjBzbWlsZXxlbnwxfHx8fDE3NzgyNDM1MjB8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Bidan Nisa"
                className="h-72 w-full object-cover object-top"
              />
              <div className="p-6" style={{ backgroundColor: "#FFF5F8" }}>
                <div className="mb-2 flex items-start justify-between">
                  <h3
                    className="text-xl font-black"
                    style={{ color: "#6C4735" }}
                  >
                    Bidan Nisa
                  </h3>
                  <div className="flex text-yellow-400">
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                  </div>
                </div>
                <p
                  className="mb-3 text-sm font-bold"
                  style={{ color: "#D5557E" }}
                >
                  Lactation Counselor
                </p>
                <p className="text-sm" style={{ color: "#8B6352" }}>
                  "Helping mothers navigate the early postpartum days is my
                  calling. Let's make this journey beautiful together."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

  {/* Consultation Options */}
<section
  id="booking"
  className="w-full px-6 py-24 sm:px-12 lg:px-24"
  style={{ backgroundColor: "#FFF5F8" }}
>
  <div className="mb-16 text-center">
    <h2
      className="mb-6 text-3xl font-black md:text-5xl"
      style={{ color: "#6C4735" }}
    >
      Ready to Talk?
    </h2>

    <p
      className="mx-auto max-w-2xl text-lg"
      style={{ color: "#8B6352" }}
    >
      Pilih metode konsultasi yang paling nyaman untuk Anda.
    </p>
  </div>

  {/* Cards */}
  <div className="mx-auto mb-20 grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
    {/* WhatsApp */}
    <div
      className="flex flex-col rounded-[2rem] bg-white p-8 shadow-sm"
      style={{ border: "2px solid #FACBD8" }}
    >
      <div
        className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl"
        style={{ backgroundColor: "#FFF5F8" }}
      >
        <MessageCircle
          size={30}
          style={{ color: "#D5557E" }}
        />
      </div>

      <h3
        className="mb-2 text-2xl font-black"
        style={{ color: "#6C4735" }}
      >
        WhatsApp Consultation
      </h3>

      <p
        className="mb-6 text-lg font-bold"
        style={{ color: "#D5557E" }}
      >
        Gratis
      </p>

      <p
        className="mb-8"
        style={{ color: "#8B6352" }}
      >
        Untuk pertanyaan singkat dan kebutuhan konsultasi cepat.
      </p>

      <a
        href="https://wa.me/628888695757"
        target="_blank"
        rel="noreferrer"
        className="mt-auto rounded-full py-4 text-center font-bold"
        style={{
          backgroundColor: "#FACBD8",
          color: "#6C4735",
        }}
      >
        Chat via WhatsApp
      </a>
    </div>

    {/* Video Call */}
    <div
      className="relative flex flex-col rounded-[2rem] bg-white p-8 shadow-lg"
      style={{ border: "2px solid #D5557E" }}
    >
      <div
        className="absolute top-4 right-4 rounded-full px-4 py-1 text-xs font-bold text-white"
        style={{ backgroundColor: "#D5557E" }}
      >
        RECOMMENDED
      </div>

      <div
        className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl"
        style={{ backgroundColor: "#FFF5F8" }}
      >
        <Video
          size={30}
          style={{ color: "#D5557E" }}
        />
      </div>

      <h3
        className="mb-2 text-2xl font-black"
        style={{ color: "#6C4735" }}
      >
        Video Consultation
      </h3>

      <p
        className="mb-6 text-lg font-bold"
        style={{ color: "#D5557E" }}
      >
        Rp150.000
      </p>

      <p
        className="mb-8"
        style={{ color: "#8B6352" }}
      >
        Konsultasi mendalam dengan konsultan laktasi profesional.
      </p>

      <button
        onClick={handleScheduleClick}
        className="mt-auto rounded-full py-4 font-bold text-white transition hover:opacity-90"
        style={{ backgroundColor: "#D5557E" }}
      >
        Schedule Video Call
      </button>
    </div>
  </div>

  {/* Consultation Form */}
  <div className="mx-auto max-w-4xl">
    <div className="mb-8 text-center">
      <h3
        className="mb-3 text-3xl font-black"
        style={{ color: "#6C4735" }}
      >
        Kirim Pertanyaan
      </h3>

      <p
        style={{ color: "#8B6352" }}
      >
        Isi formulir berikut dan tim Mamabear akan menghubungi Anda.
      </p>
    </div>

    <ConsultationForm />
  </div>
</section>

      {/* Final CTA Banner */}
      <section
        className="mb-6 w-full px-6 py-16 sm:mb-8 sm:px-12 lg:mb-10 lg:px-24"
        style={{ backgroundColor: "#D5557E" }}
      >
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-8 text-center md:flex-row md:text-left">
          <div>
            <h2 className="mb-2 text-2xl font-black text-white md:text-3xl">
              Not sure where to start?
            </h2>
            <p className="text-pink-100">
              Take our 2-minute assessment to see what support you need.
            </p>
          </div>
          <button
            className="rounded-full bg-white px-8 py-4 font-bold whitespace-nowrap transition-transform hover:scale-105"
            style={{ color: "#D5557E" }}
          >
            Take Assessment
          </button>
        </div>
      </section>

      {/* Modal */}
      <ScheduleVideoCallModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
