import type { Metadata } from "next";
import Image from "next/image";
import {
	Mail,
	MapPin,
	MessageCircle,
	Phone,
} from "lucide-react";

export const metadata: Metadata = {
	title: "Contact Us | MamaBear",
	description:
		"Get in touch with MamaBear customer support via email, phone, WhatsApp, or visit our office.",
};

function ContactPage() {
	return (
		<main className="min-h-screen bg-[#FFF7FA] py-10 text-[#3B1F0E]">
			<div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 md:px-8">
				<section className="overflow-hidden rounded-3xl border border-[#F6D8E2] bg-white shadow-sm">
					<div className="relative h-[220px] w-full md:h-[280px]">
						<Image
							src="/Banner Dekorasi MP - USP Kapsul-01.jpg"
							alt="MamaBear contact banner"
							fill
							className="object-cover"
							priority
						/>
						<div className="absolute inset-0 bg-gradient-to-r from-[#3B1F0E]/55 to-[#3B1F0E]/20" />
						<div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10">
							<p className="mb-2 inline-flex w-fit rounded-full bg-white px-3 py-1 text-xs font-bold text-[#D5557E]">
								Contact Us
							</p>
							<h1 className="text-3xl font-black text-white md:text-4xl">
								We are here to help you
							</h1>
							<p className="mt-2 max-w-2xl text-sm text-white/90 md:text-base">
								Reach our support team for order updates, product questions, shipping assistance, and after-sales support.
							</p>
						</div>
					</div>
				</section>

				<section className="grid grid-cols-1 gap-5 md:grid-cols-2">
					<article className="rounded-3xl border border-[#F0D9E2] bg-white p-6 shadow-sm">
						<div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFE8EF] text-[#D5557E]">
							<Mail size={22} />
						</div>
						<h2 className="text-2xl font-black">Email</h2>
						<p className="mt-2 text-sm text-[#6C4735] md:text-base">
							Send us your inquiry and we will respond during business hours.
						</p>
						<a
							href="mailto:hello@mamabear.id"
							className="mt-5 inline-flex rounded-full bg-[#D5557E] px-5 py-2.5 text-sm font-bold text-white transition hover:opacity-90"
						>
							hello@mamabear.id
						</a>
					</article>

					<article className="rounded-3xl border border-[#F0D9E2] bg-white p-6 shadow-sm">
						<div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFE8EF] text-[#D5557E]">
							<Phone size={22} />
						</div>
						<h2 className="text-2xl font-black">Phone</h2>
						<p className="mt-2 text-sm text-[#6C4735] md:text-base">
							Call our customer care team for urgent assistance.
						</p>
						<a
							href="tel:+6281234567890"
							className="mt-5 inline-flex rounded-full bg-[#D5557E] px-5 py-2.5 text-sm font-bold text-white transition hover:opacity-90"
						>
							+62 812-3456-7890
						</a>
					</article>

					<article className="rounded-3xl border border-[#F0D9E2] bg-white p-6 shadow-sm">
						<div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E8FFF0] text-[#25D366]">
							<MessageCircle size={22} />
						</div>
						<h2 className="text-2xl font-black">WhatsApp</h2>
						<p className="mt-2 text-sm text-[#6C4735] md:text-base">
							Chat with us directly for faster support.
						</p>
						<a
							href="https://wa.me/628888695757"
							target="_blank"
							rel="noreferrer"
							className="mt-5 inline-flex rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#1EBE5A]"
						>
							+62 888-869-5757
						</a>
					</article>

					<article className="rounded-3xl border border-[#F0D9E2] bg-white p-6 shadow-sm">
						<div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFE8EF] text-[#D5557E]">
							<MapPin size={22} />
						</div>
						<h2 className="text-2xl font-black">Office Address</h2>
						<p className="mt-2 text-sm leading-relaxed text-[#6C4735] md:text-base">
							SOHO 2, Graha Natura DS 39,
							<br />
							Surabaya, Jawa Timur 60217,
							<br />
							Indonesia
						</p>
					</article>
				</section>
			</div>
		</main>
	);
}

export default ContactPage;