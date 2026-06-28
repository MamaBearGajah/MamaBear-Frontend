"use client";

import { MessageCircle, ShieldCheck, Undo2 } from "lucide-react";

const RETURN_WINDOW_OPTIONS = ["7 days", "14 days", "30 days"];

const ELIGIBLE_ITEMS = [
	"Unused and in original condition",
	"In the original packaging",
	"With all tags, accessories, and manuals included",
	"Accompanied by proof of purchase (order number or receipt)",
];

const NON_REFUNDABLE_ITEMS = [
	"Digital products or downloadable content",
	"Gift cards",
	"Personalized or custom-made products",
	"Perishable goods (food, flowers, etc.)",
	"Opened hygiene products (cosmetics, underwear, earrings)",
	"Clearance or final sale items (if stated before purchase)",
];

const REFUND_TIMELINE = [
	"Item is received and inspected by our team",
	"Refund request is approved or rejected",
	"Update is sent to your registered email",
	"Approved refund is processed in 5-10 business days",
	"Funds are returned to the original payment method",
];

function RefundPage() {
	const handleWhatsAppClick = () => {
		const shouldOpenChat = window.confirm(
			"Do you want to talk to MamaBear Customer Service on WhatsApp?"
		);

		if (!shouldOpenChat) return;

		const phone = "628888695757";
		const text = encodeURIComponent(
			"Hi MamaBear Customer Service, I would like help regarding a refund request."
		);
		window.open(`https://wa.me/${phone}?text=${text}`, "_blank", "noopener,noreferrer");
	};

	return (
		<main className="min-h-screen bg-[#FFF7FA] py-10 text-[#3B1F0E]">
			<div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 md:px-8">
				<section className="overflow-hidden rounded-3xl border border-[#F6D8E2] bg-white shadow-sm">
					<div className="bg-gradient-to-r from-[#FAD1DE] via-[#FCE3EA] to-[#FFF4F8] px-6 py-8 md:px-10 md:py-10">
						<div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#D5557E]">
							<Undo2 size={16} />
							Return & Refund Information
						</div>
						<h1 className="text-3xl font-black leading-tight md:text-4xl">
							Refund Policy
						</h1>
						<p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#6C4735] md:text-base">
							Our refund policy is designed to protect customers while ensuring fair use. Please review the rules below before submitting a return or refund request.
						</p>
					</div>
				</section>

				<section className="grid grid-cols-1 gap-4 md:grid-cols-3">
					<div className="rounded-2xl border border-[#F3D4DE] bg-white p-5 shadow-sm">
						<p className="text-sm font-semibold text-[#8B6352]">Return Window</p>
						<p className="mt-2 text-2xl font-black text-[#D5557E]">7-30 Days</p>
						<p className="mt-2 text-sm text-[#6C4735]">
							Depending on product category and campaign terms.
						</p>
					</div>
					<div className="rounded-2xl border border-[#F3D4DE] bg-white p-5 shadow-sm">
						<p className="text-sm font-semibold text-[#8B6352]">Issue Report</p>
						<p className="mt-2 text-2xl font-black text-[#D5557E]">24-72 Hours</p>
						<p className="mt-2 text-sm text-[#6C4735]">
							For damaged, defective, or incorrect items.
						</p>
					</div>
					<div className="rounded-2xl border border-[#F3D4DE] bg-white p-5 shadow-sm">
						<p className="text-sm font-semibold text-[#8B6352]">Refund Speed</p>
						<p className="mt-2 text-2xl font-black text-[#D5557E]">5-10 Days</p>
						<p className="mt-2 text-sm text-[#6C4735]">
							Business days after approval and inspection.
						</p>
					</div>
				</section>

				<section className="space-y-6 rounded-3xl border border-[#F0D9E2] bg-white p-6 shadow-sm md:p-8">
					<h2 className="text-2xl font-black">1. Return Window</h2>
					<p className="text-sm leading-relaxed text-[#6C4735] md:text-base">
						Customers may request a return within one of these windows after receiving the item:
					</p>
					<ul className="list-disc space-y-2 pl-5 text-sm text-[#6C4735] md:text-base">
						{RETURN_WINDOW_OPTIONS.map((window) => (
							<li key={window}>{window}</li>
						))}
					</ul>
					<p className="rounded-xl bg-[#FFF3F7] p-4 text-sm text-[#8B6352]">
						Requests submitted after the applicable period may not be eligible.
					</p>
				</section>

				<section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
					<div className="rounded-3xl border border-[#F0D9E2] bg-white p-6 shadow-sm md:p-8">
						<h2 className="text-2xl font-black">2. Eligible Items</h2>
						<ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-[#6C4735] md:text-base">
							{ELIGIBLE_ITEMS.map((item) => (
								<li key={item}>{item}</li>
							))}
						</ul>
					</div>

					<div className="rounded-3xl border border-[#F0D9E2] bg-white p-6 shadow-sm md:p-8">
						<h2 className="text-2xl font-black">3. Non-Refundable Items</h2>
						<ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-[#6C4735] md:text-base">
							{NON_REFUNDABLE_ITEMS.map((item) => (
								<li key={item}>{item}</li>
							))}
						</ul>
					</div>
				</section>

				<section className="rounded-3xl border border-[#F0D9E2] bg-white p-6 shadow-sm md:p-8">
					<h2 className="text-2xl font-black">4. Damaged, Defective, or Incorrect Items</h2>
					<p className="mt-4 text-sm leading-relaxed text-[#6C4735] md:text-base">
						Please report issues within 24-72 hours of delivery and include clear photos or videos. Based on verification results, we may provide a full refund, replacement, or exchange.
					</p>
				</section>

				<section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
					<div className="rounded-3xl border border-[#F0D9E2] bg-white p-6 shadow-sm md:p-8">
						<h2 className="text-2xl font-black">5. Change of Mind</h2>
						<ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-[#6C4735] md:text-base">
							<li>May be accepted when the item is unopened and unused.</li>
							<li>Return shipping cost is paid by the customer.</li>
							<li>Original shipping charges are usually non-refundable.</li>
						</ul>
					</div>

					<div className="rounded-3xl border border-[#F0D9E2] bg-white p-6 shadow-sm md:p-8">
						<h2 className="text-2xl font-black">6. Refund Process</h2>
						<ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-[#6C4735] md:text-base">
							{REFUND_TIMELINE.map((step) => (
								<li key={step}>{step}</li>
							))}
						</ul>
					</div>
				</section>

				<section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
					<div className="rounded-3xl border border-[#F0D9E2] bg-white p-6 shadow-sm md:p-8">
						<h2 className="text-2xl font-black">7. Shipping Fees</h2>
						<ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-[#6C4735] md:text-base">
							<li>Original shipping fees are generally non-refundable.</li>
							<li>Return shipping is customer responsibility unless the item is wrong, defective, or damaged in delivery.</li>
						</ul>
					</div>

					<div className="rounded-3xl border border-[#F0D9E2] bg-white p-6 shadow-sm md:p-8">
						<h2 className="text-2xl font-black">8. Exchanges</h2>
						<ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-[#6C4735] md:text-base">
							<li>Defective items</li>
							<li>Wrong size or color (subject to stock availability)</li>
							<li>Incorrect item shipped</li>
						</ul>
					</div>
				</section>

				<section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
					<div className="rounded-3xl border border-[#F0D9E2] bg-white p-6 shadow-sm md:p-8">
						<h2 className="text-2xl font-black">9. Order Cancellation</h2>
						<ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-[#6C4735] md:text-base">
							<li>Orders cancelled before shipment are eligible for a full refund.</li>
							<li>If the order has shipped, customers must follow the standard return process.</li>
						</ul>
					</div>

					<div className="rounded-3xl border border-[#F0D9E2] bg-white p-6 shadow-sm md:p-8">
						<h2 className="text-2xl font-black">10. Fraud Prevention</h2>
						<ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-[#6C4735] md:text-base">
							<li>Refunds may be denied if items show signs of use or intentional damage.</li>
							<li>Incomplete returns and false claims may be rejected.</li>
							<li>Excessive or suspicious refund behavior may be investigated and denied.</li>
						</ul>
					</div>
				</section>

				<section className="rounded-3xl border border-[#F2C9D7] bg-gradient-to-r from-[#FCE5EC] to-[#FFEFF4] p-6 shadow-sm md:p-8">
					<div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
						<div className="max-w-3xl">
							<div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-[#D5557E]">
								<ShieldCheck size={14} />
								Need Help With Your Refund?
							</div>
							<h2 className="text-2xl font-black md:text-3xl">Talk to Customer Service on WhatsApp</h2>
							<p className="mt-2 text-sm leading-relaxed text-[#6C4735] md:text-base">
								If you need help checking eligibility, preparing return evidence, or tracking refund status, our support team is ready to assist.
							</p>
						</div>

						<button
							type="button"
							onClick={handleWhatsAppClick}
							className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#1EBE5A]"
						>
							<MessageCircle size={18} />
							Talk to Customer Service
						</button>
					</div>
				</section>
			</div>
		</main>
	);
}

export default RefundPage;
