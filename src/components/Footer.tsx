import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone, Check } from "lucide-react";
import { FaInstagram, FaFacebook, FaYoutube, FaComments } from "react-icons/fa";

const certifications = ["BPOM Certified", "Halal MUI", "ISO 9001"];

export default function Footer() {
  return (
    <footer className="mt-14 bg-[#D5557E] font-[var(--font-quicksand)] text-white">
      <div className="mx-auto w-full max-w-[1280px] px-0 py-8">
        <div className="grid gap-8 md:grid-cols-[1.25fr_1fr_1fr_1.25fr]">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <Image
                src="/Logo Mamabear.png"
                alt="MamaBear logo"
                width={28}
                height={28}
                className="h-[28px] w-[28px] object-contain"
              />
            </div>

            <p className="max-w-[230px] text-[13px] leading-[1.5] text-white/90">
              Superfood products specially formulated to support breastfeeding
              mothers in their most important journey. Because every drop
              matters. 💗
            </p>

            <div className="mt-5 flex items-center gap-3">
              <Link
                href="#"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#D5557E] transition hover:opacity-85"
                title="Instagram"
              >
                <FaInstagram size={14} />
              </Link>
              <Link
                href="#"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#D5557E] transition hover:opacity-85"
                title="Facebook"
              >
                <FaFacebook size={14} />
              </Link>
              <Link
                href="#"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#D5557E] transition hover:opacity-85"
                title="YouTube"
              >
                <FaYoutube size={14} />
              </Link>
              <Link
                href="#"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#D5557E] transition hover:opacity-85"
                title="Message"
              >
                <FaComments size={14} />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-[15px] font-semibold">Our Products</h4>
            <div className="space-y-1.5 text-[13px] text-white/90">
              <Link href="#" className="block transition hover:text-[#FACBD8]">
                ASI Booster Tea
              </Link>
              <Link href="#" className="block transition hover:text-[#FACBD8]">
                ASI Booster Capsules
              </Link>
              <Link href="#" className="block transition hover:text-[#FACBD8]">
                Kookie Bites
              </Link>
              <Link href="#" className="block transition hover:text-[#FACBD8]">
                Almond Oat Cookies
              </Link>
              <Link href="#" className="block transition hover:text-[#FACBD8]">
                Zoya Mix
              </Link>
              <Link href="#" className="block transition hover:text-[#FACBD8]">
                Almon Mix
              </Link>
              <Link href="#" className="block transition hover:text-[#FACBD8]">
                Bundle Packages
              </Link>
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-[15px] font-semibold">Support</h4>
            <div className="space-y-1.5 text-[13px] text-white/90">
              <Link href="#" className="block transition hover:text-[#FACBD8]">
                Lactation Consultation
              </Link>
              <Link href="#" className="block transition hover:text-[#FACBD8]">
                FAQ
              </Link>
              <Link href="#" className="block transition hover:text-[#FACBD8]">
                Shipping Info
              </Link>
              <Link href="#" className="block transition hover:text-[#FACBD8]">
                Returns & Refunds
              </Link>
              <Link href="#" className="block transition hover:text-[#FACBD8]">
                Track My Order
              </Link>
              <Link href="#" className="block transition hover:text-[#FACBD8]">
                Contact Us
              </Link>
              <Link href="#" className="block transition hover:text-[#FACBD8]">
                Blog & Tips
              </Link>
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-[15px] font-semibold">Get In Touch</h4>
            <div className="space-y-3 text-[13px] text-white/95">
              <div>
                <p className="mb-1 flex items-center gap-2 font-semibold">
                  <Phone size={12} className="text-[#FACBD8]" />
                  WhatsApp Customer Care
                </p>
                <p className="pl-5 text-white/85">+62 812 - 3456 - 7890</p>
                <p className="pl-5 text-white/85">Mon-Sat, 08.00-17.00 WIB</p>
              </div>

              <div>
                <p className="mb-1 flex items-center gap-2 font-semibold">
                  <Mail size={12} className="text-[#FACBD8]" />
                  Email Us
                </p>
                <p className="pl-5 text-white/85">hello@mamabear.id</p>
              </div>

              <div>
                <p className="mb-1 flex items-center gap-2 font-semibold">
                  <MapPin size={12} className="text-[#FACBD8]" />
                  Our Store
                </p>
                <p className="pl-5 text-white/85">Surabaya, Indonesia</p>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {certifications.map((label) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-[#7C5A4A]"
                  >
                    <Check
                      size={9}
                      strokeWidth={3}
                      className="text-[#8D6B5B]"
                    />
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
              <Link href="#" className="transition hover:text-[#FACBD8]">
                Privacy Policy
              </Link>
              <Link href="#" className="transition hover:text-[#FACBD8]">
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
