"use client"

import React, { useState, useEffect } from "react";
import {
  Heart,
  Shield,
  Mail,
  MapPin,
  Phone,
  ArrowRight,
} from "lucide-react";
import BackTop from "@/components/common/BackToTop";

const TABS = [
  { id: "story", label: "Our Story", icon: Heart },
  { id: "policies", label: "Policies", icon: Shield },
  { id: "contact", label: "Contact Us", icon: MapPin },
];

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState("story");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const storyImages = {
    mom: "https://images.unsplash.com/photo-1770261430794-d1dce27c8995?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWlsaW5nJTIwbW90aGVyJTIwaG9sZGluZyUyMGJhYnl8ZW58MXx8fHwxNzc4MjQwNzM1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    ingredients:
      "https://images.unsplash.com/photo-1586446269504-ea31c44a5c8a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbG1vbmRzJTIwYW5kJTIwdGVhJTIwaGVhbHRoeSUyMG9yZ2FuaWN8ZW58MXx8fHwxNzc4MjQwNzQ2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    shipping:
      "https://images.unsplash.com/photo-1631010231931-d2c396b444ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaGlwcGluZyUyMGJveGVzJTIwZWNvbW1lcmNlfGVufDF8fHx8MTc3ODI0MDc1MXww&ixlib=rb-4.1.0&q=80&w=1080",
  };


  const renderStory = () => (
    <div className="space-y-16 animate-in fade-in duration-500">
      {/* Intro */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <span
            className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full inline-block mb-4"
            style={{
              backgroundColor: "#FACBD8",
              color: "#D5557E",
            }}
          >
            Berawal dari sebuah pengalaman
          </span>
          <h2
            className="text-4xl font-black mb-6 leading-tight"
            style={{ color: "#3B1F0E" }}
          >
            Dari Perjuangan Menjadi Solusi Bagi Jutaan Mama
          </h2>
          <div
            className="space-y-4 text-base leading-relaxed"
            style={{ color: "#6C4735" }}
          >
            <p>
              <strong>Agnes Susanti Widjaja</strong> adalah ibu
              dari 3 anak sekaligus founder Mamabear Indonesia.
              Sama seperti semua ibu yang baru mulai menyusui,
              ekspektasi Agnes adalah ASI lancar setelah
              melahirkan.
            </p>
            <p>
              Tapi realitanya, ASI tidak lancar mengakibatkan
              problem berat badan bayi yang tidak kunjung naik.
              Bahkan, Agnes juga merasakan <em>baby blues</em>{" "}
              yang mengarah ke depresi pasca melahirkan.
              Akhirnya, impian ASI eksklusif harus berakhir
              hanya setelah 40 hari setelah melahirkan karena
              sulit ASI.
            </p>
          </div>
        </div>
        <div className="relative">
          <div
            className="absolute inset-0 translate-x-4 translate-y-4 rounded-3xl"
            style={{ backgroundColor: "#FACBD8" }}
          ></div>
          <img
            src={storyImages.mom}
            alt="Mother and Baby"
            className="relative z-10 rounded-3xl w-full h-full object-cover shadow-xl aspect-[4/3]"
          />
        </div>
      </div>

      {/* Motivation & Ingredients */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="order-2 lg:order-1 relative">
          <div
            className="absolute inset-0 -translate-x-4 translate-y-4 rounded-3xl"
            style={{ backgroundColor: "#FFF0F5" }}
          ></div>
          <img
            src={storyImages.ingredients}
            alt="Natural Ingredients"
            className="relative z-10 rounded-3xl w-full h-full object-cover shadow-xl aspect-[4/3]"
          />
        </div>
        <div className="order-1 lg:order-2">
          <h3
            className="text-3xl font-black mb-4"
            style={{ color: "#3B1F0E" }}
          >
            Mulai Termotivasi
          </h3>
          <p
            className="text-base leading-relaxed mb-6"
            style={{ color: "#6C4735" }}
          >
            Walaupun berat, ini jadi motivasi bagi Agnes untuk
            mencari solusi ASI yang efektif. Berbekal pengalaman
            dan ilmu sebagai tamatan Sarjana di{" "}
            <strong>Food Technology & Nutrition</strong>, Agnes
            banyak menemukan manfaat dari bahan-bahan natural
            yang dapat menjadi ASI Booster.
          </p>
          <div
            className="bg-white p-6 rounded-2xl border"
            style={{ borderColor: "#FACBD8" }}
          >
            <p
              className="italic text-sm leading-relaxed"
              style={{ color: "#8B6352" }}
            >
              "Bahan-bahan natural tersebut lalu dikombinasikan
              dengan riset dan teknologi terkini sehingga
              terciptalah produk pelancar ASI dengan brand
              MamaBear yang dapat digunakan untuk membantu
              produksi ASI ibu menyusui."
            </p>
          </div>
        </div>
      </div>

      {/* Impact */}
      <div className="bg-[#FFF5F8] rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden">
        <div
          className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full opacity-20"
          style={{ backgroundColor: "#D5557E" }}
        ></div>
        <div
          className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 rounded-full opacity-20"
          style={{ backgroundColor: "#D5557E" }}
        ></div>

        <div className="w-full relative z-10">
          <h3
            className="text-3xl font-black mb-6"
            style={{ color: "#3B1F0E" }}
          >
            Mulai Hadir di Indonesia
          </h3>
          <p
            className="text-base leading-relaxed mb-10"
            style={{ color: "#6C4735" }}
          >
            Mamabear Indonesia lalu hadir di tahun 2016 dengan
            fokus pada produk-produk ASI Booster berkualitas.
            Setiap produk Mamabear berpedoman pada riset, bahan
            alami, dan produksi lokal dengan standar higienitas
            tertinggi—dirancang untuk menuntun, menutrisi dan
            melindungi kesehatan ibu & bayi.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-white">
              <div
                className="text-4xl font-black mb-2"
                style={{ color: "#D5557E" }}
              >
                1M+
              </div>
              <p
                className="text-sm font-semibold"
                style={{ color: "#6C4735" }}
              >
                Ibu Menyusui Terbantu
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-white">
              <div
                className="text-4xl font-black mb-2"
                style={{ color: "#D5557E" }}
              >
                500+
              </div>
              <p
                className="text-sm font-semibold"
                style={{ color: "#6C4735" }}
              >
                Agen Tersedia
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-white">
              <div
                className="text-4xl font-black mb-2"
                style={{ color: "#D5557E" }}
              >
                2016
              </div>
              <p
                className="text-sm font-semibold"
                style={{ color: "#6C4735" }}
              >
                Tahun Berdiri
              </p>
            </div>
          </div>
          <p
            className="mt-8 font-bold text-lg"
            style={{ color: "#D5557E" }}
          >
            Mamabear siap hadir dan membantu mama dengan solusi
            menyusui yang terbaik! 💕
          </p>
        </div>
      </div>
    </div>
  );


  const renderPolicies = () => (
    <div className="animate-in fade-in duration-500 w-full space-y-12">
      {/* Term and condition */}
      <section
        className="bg-white p-8 rounded-3xl border shadow-sm"
        style={{ borderColor: "#F0D9E2" }}
      >
        <h3
          className="text-2xl font-black mb-6 pb-4 border-b"
          style={{ color: "#3B1F0E", borderColor: "#F0D9E2" }}
        >
          Terms & Conditions
        </h3>
        <div
          className="space-y-6 text-sm leading-relaxed"
          style={{ color: "#6C4735" }}
        >
          <div>
            <h4
              className="font-bold text-base mb-2"
              style={{ color: "#D5557E" }}
            >
              1. Perkenalan
            </h4>
            <p>
              Syarat dan Ketentuan Standar Situs Web ini akan
              mengatur penggunaan Anda atas situs web Mamabear.
              Dengan menggunakan Situs Web ini, Anda setuju
              untuk menerima semua syarat dan ketentuan yang
              tertulis di sini.
            </p>
          </div>
          <div>
            <h4
              className="font-bold text-base mb-2"
              style={{ color: "#D5557E" }}
            >
              2. Hak Kekayaan Intelektual
            </h4>
            <p>
              Selain konten yang Anda miliki, Mamabear dan/atau
              pemberi lisensinya memiliki semua hak kekayaan
              intelektual dan materi yang terkandung dalam Situs
              Web ini.
            </p>
          </div>
          <div>
            <h4
              className="font-bold text-base mb-2"
              style={{ color: "#D5557E" }}
            >
              3. Batasan
            </h4>
            <p>
              Anda dibatasi dari menerbitkan materi situs web
              apa pun di media lain, menjual/mengkomersialkan
              materi, atau menggunakan situs ini dengan cara
              yang bertentangan dengan hukum dan peraturan yang
              berlaku.
            </p>
          </div>
          <div>
            <h4
              className="font-bold text-base mb-2"
              style={{ color: "#D5557E" }}
            >
              4. Kebijakan Lainnya
            </h4>
            <p>
              Ketentuan ini merupakan keseluruhan perjanjian
              antara Mamabear dan Anda. Ketentuan ini diatur
              oleh dan ditafsirkan sesuai dengan hukum
              Indonesia.
            </p>
          </div>
        </div>
      </section>

      {/* Privacy Policy */}
      <section
        className="bg-white p-8 rounded-3xl border shadow-sm"
        style={{ borderColor: "#F0D9E2" }}
      >
        <h3
          className="text-2xl font-black mb-6 pb-4 border-b"
          style={{ color: "#3B1F0E", borderColor: "#F0D9E2" }}
        >
          Privacy Policy
        </h3>
        <div
          className="space-y-6 text-sm leading-relaxed"
          style={{ color: "#6C4735" }}
        >
          <p>
            <strong>Pengumpulan Informasi:</strong> Kami
            mengumpulkan informasi dari Anda ketika Anda
            mendaftar, melakukan pembelian, atau mengikuti
            kontes. Data mencakup nama, email, nomor telepon,
            dan informasi pembayaran.
          </p>
          <p>
            <strong>Penggunaan Informasi:</strong> Digunakan
            untuk personalisasi, meningkatkan layanan, memproses
            transaksi, dan mengirim email berkala. Informasi
            tidak akan dijual kepada pihak ketiga tanpa izin
            Anda.
          </p>
          <p>
            <strong>Keamanan:</strong> Kami menerapkan berbagai
            langkah keamanan termasuk enkripsi untuk menjaga
            kerahasiaan informasi sensitif yang Anda kirimkan.
          </p>
          <p>
            <strong>Kuki (Cookies):</strong> Ya, kami
            menggunakan kuki untuk meningkatkan pengalaman
            pengguna, tanpa mengaitkan ke informasi pribadi yang
            dapat diidentifikasi.
          </p>
        </div>
      </section>

      {/* Refund and Return Policy */}
      <section
        className="bg-white p-8 rounded-3xl border shadow-sm"
        style={{ borderColor: "#F0D9E2" }}
      >
        <h3
          className="text-2xl font-black mb-6 pb-4 border-b"
          style={{ color: "#3B1F0E", borderColor: "#F0D9E2" }}
        >
          Return and Refund Policy
        </h3>
        <div
          className="space-y-6 text-sm leading-relaxed"
          style={{ color: "#6C4735" }}
        >
          <p>
            <strong>Jangka Waktu Pengembalian:</strong> Anda
            memiliki waktu 7-14 hari kalender untuk
            mengembalikan barang terhitung sejak tanggal
            diterima.
          </p>
          <p>
            <strong>Syarat:</strong> Barang harus baru, belum
            digunakan, tidak dicuci, dengan kemasan asli dan
            nota pembelian. Barang diskon final tidak bisa
            dikembalikan.
          </p>
          <p>
            <strong>Prosedur:</strong> Hubungi admin via
            WhatsApp/Email, lampirkan foto/video unboxing, dan
            kirimkan barang ke alamat kami setelah disetujui.
            Biaya pengiriman ditanggung pembeli kecuali terdapat
            kesalahan dari pihak kami.
          </p>
          <p>
            <strong>Refund & Exchange:</strong> Refund akan
            diproses setelah barang kami terima dan periksa
            (sekitar 3-7 hari kerja). Penukaran hanya berlaku
            untuk produk rusak atau cacat produksi.
          </p>
        </div>
      </section>

      {/* Shipping Policy */}
      <section
        className="bg-white p-8 rounded-3xl border shadow-sm"
        style={{ borderColor: "#F0D9E2" }}
      >
        <h3
          className="text-2xl font-black mb-6 pb-4 border-b"
          style={{ color: "#3B1F0E", borderColor: "#F0D9E2" }}
        >
          Shipping & Delivery
        </h3>
        <div
          className="space-y-4 text-sm leading-relaxed"
          style={{ color: "#6C4735" }}
        >
          <p>
            Kami melayani pengiriman ke seluruh Indonesia
            (domestik) dan beberapa pengiriman internasional.
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-4">
            <li>
              <strong>Reguler (JABODETABEK):</strong> 1 - 3 Hari
              Kerja
            </li>
            <li>
              <strong>Reguler (Luar JABODETABEK):</strong> 3 - 5
              Hari Kerja
            </li>
            <li>
              <strong>Ekonomi/Kargo:</strong> 5 - 14 Hari Kerja
            </li>
            <li>
              <strong>Instant/Same Day:</strong> 3 - 8 Jam
              (sesuai jam operasional)
            </li>
          </ul>
          <p
            className="mt-4 p-4 rounded-xl"
            style={{
              backgroundColor: "#FFF5F8",
              color: "#D5557E",
            }}
          >
            <strong>Penting:</strong> Pesanan masuk sebelum
            pukul 15.00 WIB akan diproses hari yang sama. Kami
            tidak bertanggung jawab atas keterlambatan akibat
            alamat tidak lengkap/salah.
          </p>
        </div>
      </section>
    </div>
  );

  const renderContact = () => (
    <div className="animate-in fade-in duration-500 w-full">
      <div className="text-center mb-12">
        <h2
          className="text-4xl font-black mb-4"
          style={{ color: "#3B1F0E" }}
        >
          Get in Touch
        </h2>
        <p
          className="text-base max-w-lg mx-auto"
          style={{ color: "#8B6352" }}
        >
          Punya pertanyaan lebih lanjut? Tim kami siap membantu
          Mama kapan saja!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          className="bg-white p-8 rounded-3xl border text-center hover:-translate-y-1 transition-transform shadow-sm"
          style={{ borderColor: "#F0D9E2" }}
        >
          <div
            className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-6"
            style={{ backgroundColor: "#FACBD8" }}
          >
            <MapPin size={28} style={{ color: "#D5557E" }} />
          </div>
          <h3
            className="font-black text-lg mb-3"
            style={{ color: "#3B1F0E" }}
          >
            Visit Us
          </h3>
          <p
            className="text-sm leading-relaxed"
            style={{ color: "#6C4735" }}
          >
            SOHO 2, Graha Natura DS 39,
            <br />
            Surabaya, Jawa Timur 60217
          </p>
        </div>

        <div
          className="bg-white p-8 rounded-3xl border text-center hover:-translate-y-1 transition-transform shadow-sm"
          style={{ borderColor: "#F0D9E2" }}
        >
          <div
            className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-6"
            style={{ backgroundColor: "#FACBD8" }}
          >
            <Phone size={28} style={{ color: "#D5557E" }} />
          </div>
          <h3
            className="font-black text-lg mb-3"
            style={{ color: "#3B1F0E" }}
          >
            WhatsApp
          </h3>
          <p
            className="text-sm leading-relaxed mb-4"
            style={{ color: "#6C4735" }}
          >
            +62 888-869-5757
          </p>
          <a
            href="https://wa.me/628888695757"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-full transition-colors hover:opacity-90"
            style={{
              backgroundColor: "#D5557E",
              color: "white",
            }}
          >
            Chat Now <ArrowRight size={14} />
          </a>
        </div>

        <div
          className="bg-white p-8 rounded-3xl border text-center hover:-translate-y-1 transition-transform shadow-sm"
          style={{ borderColor: "#F0D9E2" }}
        >
          <div
            className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-6"
            style={{ backgroundColor: "#FACBD8" }}
          >
            <Mail size={28} style={{ color: "#D5557E" }} />
          </div>
          <h3
            className="font-black text-lg mb-3"
            style={{ color: "#3B1F0E" }}
          >
            Email
          </h3>
          <p
            className="text-sm leading-relaxed mb-4"
            style={{ color: "#6C4735" }}
          >
            sales@mamabear.co.id
          </p>
          <a
            href="mailto:sales@mamabear.co.id"
            className="inline-flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-full border-2 transition-colors hover:bg-pink-50"
            style={{ borderColor: "#D5557E", color: "#D5557E" }}
          >
            Send Email
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className="w-full flex flex-col bg-white"
      style={{ fontFamily: "'Urbanist', sans-serif" }}
    >
      <BackTop />
      {/* Header Banner - Full Bleed */}
      <div
        className="w-full relative overflow-hidden"
        style={{
          minHeight: "350px",
          backgroundColor: "#FFF5F8",
        }}
      >
        <div className="absolute inset-0 z-0">
          <img
            src={storyImages.shipping}
            alt="Mamabear background"
            className="w-full h-full object-cover opacity-10"
            style={{ objectPosition: "center 60%" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FFF5F8] to-transparent"></div>
        </div>
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-6 py-20 text-center">
          <span
            className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full mb-4 shadow-sm"
            style={{
              backgroundColor: "white",
              color: "#D5557E",
            }}
          >
            <Heart size={14} /> Tentang Mamabear
          </span>
          <h1
            className="text-5xl md:text-6xl font-black mb-4"
            style={{ color: "#3B1F0E" }}
          >
            We Are Mamabear
          </h1>
          <p
            className="text-lg max-w-xl mx-auto"
            style={{ color: "#6C4735" }}
          >
            Menuntun, menutrisi dan melindungi kesehatan ibu &
            bayi sejak 2016.
          </p>
        </div>
      </div>

      {/* Navigation Tabs - Full Bleed Background, Centered Content */}
      <div
        className="w-full border-b sticky top-[64px] z-30 bg-white/95 backdrop-blur-sm"
        style={{ borderColor: "#F0D9E2" }}
      >
        <div className="px-6 sm:px-12 lg:px-16 overflow-x-auto no-scrollbar">
          <div className="flex justify-start md:justify-center gap-8 min-w-max">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-5 font-bold text-sm border-b-2 transition-all whitespace-nowrap`}
                style={{
                  color:
                    activeTab === tab.id
                      ? "#D5557E"
                      : "#8B6352",
                  borderColor:
                    activeTab === tab.id
                      ? "#D5557E"
                      : "transparent",
                }}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full bg-[#FAFAFA] flex-1">
        <div className="px-6 sm:px-12 lg:px-16 py-16">
          {activeTab === "story" && renderStory()}
          {activeTab === "policies" && renderPolicies()}
          {activeTab === "contact" && renderContact()}
        </div>
      </div>
    </div>
  );
}