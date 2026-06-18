import type { Metadata } from "next";
import {
	AlertTriangle,
	Clock3,
	Globe,
	Mail,
	PackageSearch,
	ShieldCheck,
	Truck,
} from "lucide-react";

export const metadata: Metadata = {
	title: "Shipping Information | MamaBear",
	description:
		"Shipping timelines, rates, tracking, international delivery, and support details for MamaBear orders.",
};

const SHIPPING_METHODS = [
	{ method: "Standard Shipping", eta: "3-7 Business Days" },
	{ method: "Express Shipping", eta: "1-3 Business Days" },
	{ method: "International Shipping", eta: "7-21 Business Days" },
];

const RATE_FACTORS = [
	"Delivery destination",
	"Package weight and dimensions",
	"Selected shipping method",
];

const TRACKING_DETAILS = [
	"Your tracking number",
	"Courier information",
	"A tracking link to monitor your shipment",
];

const INTERNATIONAL_NOTES = [
	"Customers are responsible for any import duties, customs fees, VAT, or local taxes imposed by their country.",
	"Customs clearance may delay delivery beyond estimated shipping times.",
];

const INCORRECT_ADDRESS_NOTES = [
	"Contact us immediately if your order has not yet shipped.",
	"Once shipped, we may not be able to modify the delivery address.",
	"Additional shipping charges may apply if a package must be re-shipped.",
];

const FAILED_DELIVERY_REASONS = [
	"No one is available to receive the package",
	"The delivery address is incorrect",
	"The package is unclaimed",
];

const DAMAGED_PACKAGE_EVIDENCE = [
	"The damaged packaging",
	"The shipping label",
	"The damaged product",
];

function ShippingPage() {
	return (
		<main className="min-h-screen bg-[#FFF7FA] py-10 text-[#3B1F0E]">
			<div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 md:px-8">
				<section className="overflow-hidden rounded-3xl border border-[#F6D8E2] bg-white shadow-sm">
					<div className="bg-gradient-to-r from-[#FAD1DE] via-[#FCE3EA] to-[#FFF4F8] px-6 py-8 md:px-10 md:py-10">
						<div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#D5557E]">
							<Truck size={16} />
							Shipping Information
						</div>
						<h1 className="text-3xl font-black leading-tight md:text-4xl">
							Shipping Information
						</h1>
						<p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#6C4735] md:text-base">
							We aim to process and deliver your order as quickly and safely as possible. Please review the information below regarding our shipping process.
						</p>
					</div>
				</section>

				<section className="grid grid-cols-1 gap-4 md:grid-cols-3">
					<div className="rounded-2xl border border-[#F3D4DE] bg-white p-5 shadow-sm">
						<p className="text-sm font-semibold text-[#8B6352]">Processing Time</p>
						<p className="mt-2 text-2xl font-black text-[#D5557E]">1-3 Days</p>
						<p className="mt-2 text-sm text-[#6C4735]">Business days after payment confirmation.</p>
					</div>
					<div className="rounded-2xl border border-[#F3D4DE] bg-white p-5 shadow-sm">
						<p className="text-sm font-semibold text-[#8B6352]">Tracking Activation</p>
						<p className="mt-2 text-2xl font-black text-[#D5557E]">Up to 24h</p>
						<p className="mt-2 text-sm text-[#6C4735]">Tracking links may need time to become active.</p>
					</div>
					<div className="rounded-2xl border border-[#F3D4DE] bg-white p-5 shadow-sm">
						<p className="text-sm font-semibold text-[#8B6352]">Damage Report</p>
						<p className="mt-2 text-2xl font-black text-[#D5557E]">48 Hours</p>
						<p className="mt-2 text-sm text-[#6C4735]">Notify us promptly if your package arrives damaged.</p>
					</div>
				</section>

				<section className="rounded-3xl border border-[#F0D9E2] bg-white p-6 shadow-sm md:p-8">
					<div className="mb-4 inline-flex items-center gap-2 text-[#D5557E]">
						<Clock3 size={18} />
						<h2 className="text-2xl font-black text-[#3B1F0E]">Order Processing</h2>
					</div>
					<ul className="list-disc space-y-2 pl-5 text-sm text-[#6C4735] md:text-base">
						<li>Orders are processed within 1-3 business days after payment has been confirmed.</li>
						<li>Orders placed on weekends or public holidays are processed on the next business day.</li>
						<li>During peak periods (sales, holidays, promotions), processing times may be slightly longer.</li>
					</ul>
				</section>

				<section className="rounded-3xl border border-[#F0D9E2] bg-white p-6 shadow-sm md:p-8">
					<div className="mb-4 inline-flex items-center gap-2 text-[#D5557E]">
						<Truck size={18} />
						<h2 className="text-2xl font-black text-[#3B1F0E]">Shipping Methods & Delivery Times</h2>
					</div>

					<div className="overflow-hidden rounded-2xl border border-[#F3D4DE]">
						<table className="w-full border-collapse text-left text-sm md:text-base">
							<thead className="bg-[#FFF0F5] text-[#6C4735]">
								<tr>
									<th className="px-4 py-3 font-bold">Shipping Method</th>
									<th className="px-4 py-3 font-bold">Estimated Delivery Time</th>
								</tr>
							</thead>
							<tbody>
								{SHIPPING_METHODS.map((row) => (
									<tr key={row.method} className="border-t border-[#F3D4DE] bg-white">
										<td className="px-4 py-3 font-semibold text-[#3B1F0E]">{row.method}</td>
										<td className="px-4 py-3 text-[#6C4735]">{row.eta}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					<p className="mt-4 rounded-xl bg-[#FFF3F7] p-4 text-sm text-[#8B6352]">
						Delivery times are estimates and may vary by location, customs processing, weather conditions, and courier delays.
					</p>
				</section>

				<section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
					<div className="rounded-3xl border border-[#F0D9E2] bg-white p-6 shadow-sm md:p-8">
						<h2 className="text-2xl font-black">Shipping Rates</h2>
						<p className="mt-4 text-sm leading-relaxed text-[#6C4735] md:text-base">
							Shipping costs are calculated during checkout based on:
						</p>
						<ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[#6C4735] md:text-base">
							{RATE_FACTORS.map((factor) => (
								<li key={factor}>{factor}</li>
							))}
						</ul>
						<p className="mt-4 text-sm leading-relaxed text-[#6C4735] md:text-base">
							We may offer free shipping for orders that meet a minimum purchase amount during promotional periods.
						</p>
					</div>

					<div className="rounded-3xl border border-[#F0D9E2] bg-white p-6 shadow-sm md:p-8">
						<div className="mb-4 inline-flex items-center gap-2 text-[#D5557E]">
							<PackageSearch size={18} />
							<h2 className="text-2xl font-black text-[#3B1F0E]">Order Tracking</h2>
						</div>
						<p className="text-sm leading-relaxed text-[#6C4735] md:text-base">
							Once your order ships, you will receive a confirmation email containing:
						</p>
						<ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[#6C4735] md:text-base">
							{TRACKING_DETAILS.map((item) => (
								<li key={item}>{item}</li>
							))}
						</ul>
						<p className="mt-4 text-sm leading-relaxed text-[#6C4735] md:text-base">
							Tracking information may take up to 24 hours to become active.
						</p>
					</div>
				</section>

				<section className="rounded-3xl border border-[#F0D9E2] bg-white p-6 shadow-sm md:p-8">
					<div className="mb-4 inline-flex items-center gap-2 text-[#D5557E]">
						<Globe size={18} />
						<h2 className="text-2xl font-black text-[#3B1F0E]">International Shipping</h2>
					</div>
					<p className="text-sm leading-relaxed text-[#6C4735] md:text-base">
						We ship to selected countries worldwide.
					</p>
					<p className="mt-3 text-sm font-semibold text-[#3B1F0E] md:text-base">Please note:</p>
					<ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-[#6C4735] md:text-base">
						{INTERNATIONAL_NOTES.map((note) => (
							<li key={note}>{note}</li>
						))}
					</ul>
				</section>

				<section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
					<div className="rounded-3xl border border-[#F0D9E2] bg-white p-6 shadow-sm md:p-8">
						<h2 className="text-2xl font-black">Incorrect Shipping Address</h2>
						<p className="mt-4 text-sm leading-relaxed text-[#6C4735] md:text-base">
							Please ensure your shipping address is accurate before completing your order.
						</p>
						<ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[#6C4735] md:text-base">
							{INCORRECT_ADDRESS_NOTES.map((note) => (
								<li key={note}>{note}</li>
							))}
						</ul>
					</div>

					<div className="rounded-3xl border border-[#F0D9E2] bg-white p-6 shadow-sm md:p-8">
						<h2 className="text-2xl font-black">Failed Delivery Attempts</h2>
						<p className="mt-4 text-sm leading-relaxed text-[#6C4735] md:text-base">
							If delivery cannot be completed because:
						</p>
						<ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[#6C4735] md:text-base">
							{FAILED_DELIVERY_REASONS.map((reason) => (
								<li key={reason}>{reason}</li>
							))}
						</ul>
						<p className="mt-4 text-sm leading-relaxed text-[#6C4735] md:text-base">
							The courier may return the package to us, and additional shipping charges may apply to resend the order.
						</p>
					</div>
				</section>

				<section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
					<div className="rounded-3xl border border-[#F0D9E2] bg-white p-6 shadow-sm md:p-8">
						<div className="mb-4 inline-flex items-center gap-2 text-[#D5557E]">
							<AlertTriangle size={18} />
							<h2 className="text-2xl font-black text-[#3B1F0E]">Lost or Delayed Shipments</h2>
						</div>
						<p className="text-sm leading-relaxed text-[#6C4735] md:text-base">
							If your package is delayed beyond estimated delivery time:
						</p>
						<ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-[#6C4735] md:text-base">
							<li>Check your tracking information.</li>
							<li>Contact the shipping carrier for updates.</li>
							<li>If you still need assistance, contact our customer support team.</li>
						</ol>
						<p className="mt-4 text-sm leading-relaxed text-[#6C4735] md:text-base">
							We will work with the carrier to help locate your shipment.
						</p>
					</div>

					<div className="rounded-3xl border border-[#F0D9E2] bg-white p-6 shadow-sm md:p-8">
						<h2 className="text-2xl font-black">Damaged Packages</h2>
						<p className="mt-4 text-sm leading-relaxed text-[#6C4735] md:text-base">
							If your package arrives damaged, notify us within 48 hours of delivery and provide your order number.
						</p>
						<p className="mt-3 text-sm font-semibold text-[#3B1F0E] md:text-base">Include photos of:</p>
						<ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-[#6C4735] md:text-base">
							{DAMAGED_PACKAGE_EVIDENCE.map((item) => (
								<li key={item}>{item}</li>
							))}
						</ul>
						<p className="mt-4 text-sm leading-relaxed text-[#6C4735] md:text-base">
							We will review your claim and arrange a replacement or refund where appropriate.
						</p>
					</div>
				</section>

				<section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
					<div className="rounded-3xl border border-[#F0D9E2] bg-white p-6 shadow-sm md:p-8">
						<h2 className="text-2xl font-black">Split Shipments</h2>
						<p className="mt-4 text-sm leading-relaxed text-[#6C4735] md:text-base">
							If your order contains multiple items, they may be shipped separately depending on product availability or warehouse location.
						</p>
						<p className="mt-3 text-sm leading-relaxed text-[#6C4735] md:text-base">
							You will receive tracking information for each shipment if applicable.
						</p>
					</div>

					<div className="rounded-3xl border border-[#F0D9E2] bg-white p-6 shadow-sm md:p-8">
						<h2 className="text-2xl font-black">Shipping Restrictions</h2>
						<p className="mt-4 text-sm leading-relaxed text-[#6C4735] md:text-base">
							Some products may not be available for shipment to certain countries or regions due to legal, safety, or carrier restrictions.
						</p>
						<p className="mt-3 text-sm leading-relaxed text-[#6C4735] md:text-base">
							If we cannot ship your order, we will notify you and issue a refund if necessary.
						</p>
					</div>
				</section>

				<section className="rounded-3xl border border-[#F2C9D7] bg-gradient-to-r from-[#FCE5EC] to-[#FFEFF4] p-6 shadow-sm md:p-8">
					<div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-[#D5557E]">
						<ShieldCheck size={14} />
						Contact Us
					</div>
					<h2 className="text-2xl font-black md:text-3xl">Need Help With Shipping?</h2>
					<p className="mt-2 text-sm leading-relaxed text-[#6C4735] md:text-base">
						If you have questions regarding shipping or your order, contact our customer support team and include:
					</p>
					<ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-[#6C4735] md:text-base">
						<li>Your order number</li>
						<li>Full name</li>
						<li>Email address</li>
						<li>A brief description of your inquiry</li>
					</ul>

					<a
						href="mailto:hello@mamabear.id"
						className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#D5557E] px-5 py-2.5 text-sm font-bold text-white transition hover:opacity-90"
					>
						<Mail size={16} />
						Contact Support
					</a>

					<p className="mt-4 text-sm text-[#8B6352]">Our support team will respond as soon as possible during business hours.</p>
				</section>
			</div>
		</main>
	);
}

export default ShippingPage;
