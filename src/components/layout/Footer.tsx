import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone, Check } from "lucide-react";
import { FaInstagram, FaFacebook, FaYoutube, FaComments } from "react-icons/fa";

const certifications = ["BPOM Certified", "Halal MUI", "ISO 9001"];

import Newsletter from "../Newsletter";
export default function Footer() {
  return (
    <footer className="bg-[#D5557E] font-[var(--font-quicksand)] text-white">
      <div className="mx-auto w-full max-w-[1280px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-[1.25fr_1fr_1fr_1.25fr]">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <Image
                src="/Logo Mamabear.png"
                alt="MamaBear logo"
                width={36}
                height={36}
                className="h-[36px] w-[36px] object-contain"
              />
            </div>

            <p className="max-w-[320px] text-[13px] leading-[1.5] text-white/90">
              Superfood products specially formulated to
              <br />
              support breastfeeding mothers in their
              <br />
              most important journey. Because every drop matters. 💗
            </p>

            <div className="mt-5 flex items-center gap-3">
              <Link
                href="https://www.instagram.com/mamabearid/"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30"
                title="Instagram"
                aria-label="Instagram"
              >
                <FaInstagram size={16} />
              </Link>
              <Link
                href="https://www.facebook.com/mamabearcoid/"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30"
                title="Facebook"
                aria-label="Facebook"
              >
                <FaFacebook size={16} />
              </Link>
              <Link
                href="https://www.youtube.com/channel/UCs2bKV4_gToSL_SFSHpMT8Q"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30"
                title="YouTube"
                aria-label="YouTube"
              >
                <FaYoutube size={16} />
              </Link>
              <Link
                href="https://api.whatsapp.com/send/?phone=628888695757&text&type=phone_number&app_absent=0"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30"
                title="Message"
                aria-label="Message"
              >
                <FaComments size={16} />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 md:contents">
            <div>
              <h4 className="mb-3 text-[15px] font-semibold text-white">
                Our Products
              </h4>
              <div className="space-y-3 text-[13px] leading-[1.6] text-white/90">
                <Link
                  href="/products/mamabear-teh-pelancar-asi-isi-20-sachet"
                  className="block transition hover:text-[#FACBD8]"
                >
                  ASI Booster Tea
                </Link>
                <Link
                  href="/products/mamabear-asi-booster-30-kapsul"
                  className="block transition hover:text-[#FACBD8]"
                >
                  ASI Booster Capsules
                </Link>
                <Link
                  href="/products/mamabear-kukis-almond-oat"
                  className="block transition hover:text-[#FACBD8]"
                >
                  Kookie Bites
                </Link>
                <Link
                  href="/products/mamabear-kukis-almond-oat"
                  className="block transition hover:text-[#FACBD8]"
                >
                  Almond Oat Cookies
                </Link>
                <Link
                  href="/products/mamabear-zoyamix-rasa-cokelat-isi-10-sachet"
                  className="block transition hover:text-[#FACBD8]"
                >
                  Zoya Mix
                </Link>
                <Link
                  href="/products/mamabear-almonmix-isi-6-sachet"
                  className="block transition hover:text-[#FACBD8]"
                >
                  Almon Mix
                </Link>
                <Link
                  href="/products"
                  className="block transition hover:text-[#FACBD8]"
                >
                  Bundle Packages
                </Link>
              </div>
            </div>

            <div>
              <h4 className="mb-3 text-[15px] font-semibold text-white">
                Support
              </h4>
              <div className="space-y-3 text-[13px] leading-[1.6] text-white/90">
                <Link
                  href="/consultation"
                  className="block transition hover:text-[#FACBD8]"
                >
                  Lactation Consultation
                </Link>
                <Link
                  href="/faq"
                  className="block transition hover:text-[#FACBD8]"
                >
                  FAQ
                </Link>
                <Link
                  href="/about"
                  className="block transition hover:text-[#FACBD8]"
                >
                  Shipping Info
                </Link>
                <Link
                  href="/about"
                  className="block transition hover:text-[#FACBD8]"
                >
                  Returns & Refunds
                </Link>
                <Link
                  href="/account/orders"
                  className="block transition hover:text-[#FACBD8]"
                >
                  Track My Order
                </Link>
                <Link
                  href="/contact"
                  className="block transition hover:text-[#FACBD8]"
                >
                  Contact Us
                </Link>
                <Link
                  href="/about"
                  className="block transition hover:text-[#FACBD8]"
                >
                  Articles
                </Link>
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-[15px] font-semibold text-white">
              Get In Touch
            </h4>
            <div className="space-y-2 text-[13px] text-white/95">
              <div>
                <p className="mb-1 flex items-center gap-2 font-medium text-white/90">
                  <Phone
                    size={13}
                    className="text-white/90"
                    strokeWidth={1.6}
                  />
                  WhatsApp Customer Care
                </p>
                <p className="pl-5 text-[15px] leading-none font-bold text-white">
                  +62 812-3456-7890
                </p>
                <p className="pl-5 text-[12px] leading-[1.45] text-white/75">
                  Mon–Sat, 08.00–17.00 WIB
                </p>
              </div>

              <div>
                <p className="mb-1 flex items-center gap-2 font-medium text-white/90">
                  <Mail size={13} className="text-white/90" strokeWidth={1.6} />
                  Email Us
                </p>
                <p className="pl-5 text-[15px] leading-none font-bold text-white">
                  hello@mamabear.id
                </p>
              </div>

              <div>
                <p className="mb-1 flex items-center gap-2 font-medium text-white/90">
                  <MapPin
                    size={13}
                    className="text-white/90"
                    strokeWidth={1.6}
                  />
                  Our Store
                </p>
                <p className="pl-5 text-[15px] leading-none font-bold text-white">
                  Jakarta, Indonesia
                </p>
              </div>

              <div className="mt-5 flex w-full items-center justify-start gap-1 md:mt-6 md:max-w-[220px] md:flex-wrap md:gap-2">
                {certifications.map((label) => (
                  <span
                    key={label}
                    className="inline-flex shrink-0 items-center gap-1 rounded-full bg-white/20 px-2 py-1 text-[11px] font-semibold whitespace-nowrap text-white shadow-sm md:px-3"
                  >
                    <Check size={10} strokeWidth={3} className="text-white" />
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-7 border-t border-white/35 pt-4">
          <div className="flex flex-col gap-2 text-[11px] text-white/80 md:flex-row md:items-center md:justify-between">
            <p>
              © {new Date().getFullYear()} Mamabear. Made with ♥ for every
              nursing mama.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="transition hover:text-[#FACBD8]">
                Privacy Policy
              </Link>
              <Link href="/terms" className="transition hover:text-[#FACBD8]">
                Terms of Service
              </Link>
              <Link href="#" className="transition hover:text-[#FACBD8]">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
