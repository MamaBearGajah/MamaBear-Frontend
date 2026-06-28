import type { Metadata } from "next";
import {
	AlertTriangle,
	BadgeCheck,
	FileText,
	Gavel,
	Mail,
	ShieldAlert,
} from "lucide-react";

export const metadata: Metadata = {
	title: "Terms of Service | MamaBear",
	description:
		"Terms governing your use of MamaBear website, products, and services.",
};

const LAST_UPDATED = "June 18, 2026";

const ELIGIBILITY_RULES = [
	"You are at least the age of majority in your jurisdiction or have permission from a parent or legal guardian.",
	"You have the legal capacity to enter into a binding agreement.",
	"The information you provide is accurate and up to date.",
];

const ACCOUNT_RESPONSIBILITIES = [
	"Maintaining the confidentiality of your login credentials.",
	"All activities that occur under your account.",
	"Promptly notifying us of any unauthorized access or security breach.",
];

const ORDER_COMMITMENTS = [
	"All information provided is accurate.",
	"You are authorized to use the selected payment method.",
	"Payment must be successfully processed before your order is fulfilled.",
];

const SHIPPING_DELAY_CAUSES = [
	"Shipping carriers",
	"Customs clearance",
	"Weather conditions",
	"Natural disasters",
	"Other circumstances beyond our reasonable control",
];

const ACCEPTABLE_USE_RESTRICTIONS = [
	"Use the website for any unlawful purpose.",
	"Attempt to gain unauthorized access to our systems.",
	"Upload malicious software or harmful code.",
	"Interfere with the operation or security of the website.",
	"Copy, scrape, or reproduce website content without permission.",
	"Use automated tools to access the website without authorization.",
];

const INTELLECTUAL_PROPERTY_CONTENT = [
	"Logos",
	"Trademarks",
	"Product images",
	"Graphics",
	"Text",
	"Videos",
	"Website design",
	"Software",
];

const THIRD_PARTY_SERVICES = [
	"Payment providers",
	"Shipping companies",
	"Analytics services",
	"Social media platforms",
];

const WARRANTY_EXCLUSIONS = [
	"Merchantability",
	"Fitness for a particular purpose",
	"Non-infringement",
];

const LIABILITY_SCENARIOS = [
	"Use of or inability to use the website",
	"Delayed or failed deliveries",
	"Data loss",
	"Service interruptions",
	"Unauthorized access to your account",
	"Errors or omissions in website content",
];

const INDEMNIFICATION_SCENARIOS = [
	"Your violation of these Terms.",
	"Your misuse of the website.",
	"Your infringement of another person's rights.",
];

function TermsPage() {
	return (
		<main className="min-h-screen bg-[#FFF7FA] py-10 text-[#3B1F0E]">
			<div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 md:px-8">
				<section className="overflow-hidden rounded-3xl border border-[#F6D8E2] bg-white shadow-sm">
					<div className="bg-gradient-to-r from-[#FAD1DE] via-[#FCE3EA] to-[#FFF4F8] px-6 py-8 md:px-10 md:py-10">
						<div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#D5557E]">
							<FileText size={16} />
							Terms of Service
						</div>
						<h1 className="text-3xl font-black leading-tight md:text-4xl">
							Terms of Service
						</h1>
						<p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#6C4735] md:text-base">
							Welcome to MamaBear. These Terms govern your access to and use of our website, products, and services. By accessing or using our website, you agree to be bound by these Terms.
						</p>
						<p className="mt-4 text-sm font-semibold text-[#8B6352]">
							Last Updated: {LAST_UPDATED}
						</p>
						<p className="mt-2 text-sm text-[#6C4735] md:text-base">
							If you do not agree with these Terms, please do not use our website.
						</p>
					</div>
				</section>

				<section className="grid grid-cols-1 gap-4 md:grid-cols-3">
					<div className="rounded-2xl border border-[#F3D4DE] bg-white p-5 shadow-sm">
						<p className="text-sm font-semibold text-[#8B6352]">User Responsibilities</p>
						<p className="mt-2 text-2xl font-black text-[#D5557E]">Eligibility & Conduct</p>
						<p className="mt-2 text-sm text-[#6C4735]">You must provide accurate information and use the site lawfully.</p>
					</div>
					<div className="rounded-2xl border border-[#F3D4DE] bg-white p-5 shadow-sm">
						<p className="text-sm font-semibold text-[#8B6352]">Order Terms</p>
						<p className="mt-2 text-2xl font-black text-[#D5557E]">Payments & Fulfillment</p>
						<p className="mt-2 text-sm text-[#6C4735]">Orders may be refused, cancelled, or limited at our discretion.</p>
					</div>
					<div className="rounded-2xl border border-[#F3D4DE] bg-white p-5 shadow-sm">
						<p className="text-sm font-semibold text-[#8B6352]">Legal Scope</p>
						<p className="mt-2 text-2xl font-black text-[#D5557E]">Liability & Law</p>
						<p className="mt-2 text-sm text-[#6C4735]">Includes warranties, liability limits, and governing law terms.</p>
					</div>
				</section>

				<section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
					<article className="rounded-3xl border border-[#F0D9E2] bg-white p-6 shadow-sm md:p-8">
						<h2 className="text-2xl font-black">1. Eligibility</h2>
						<ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-[#6C4735] md:text-base">
							{ELIGIBILITY_RULES.map((item) => (
								<li key={item}>{item}</li>
							))}
						</ul>
					</article>

					<article className="rounded-3xl border border-[#F0D9E2] bg-white p-6 shadow-sm md:p-8">
						<h2 className="text-2xl font-black">2. Account Registration</h2>
						<p className="mt-4 text-sm leading-relaxed text-[#6C4735] md:text-base">
							You may be required to create an account to access certain features. You are responsible for:
						</p>
						<ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[#6C4735] md:text-base">
							{ACCOUNT_RESPONSIBILITIES.map((item) => (
								<li key={item}>{item}</li>
							))}
						</ul>
						<p className="mt-3 text-sm leading-relaxed text-[#6C4735] md:text-base">
							We reserve the right to suspend or terminate accounts that violate these Terms.
						</p>
					</article>
				</section>

				<section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
					<article className="rounded-3xl border border-[#F0D9E2] bg-white p-6 shadow-sm md:p-8">
						<h2 className="text-2xl font-black">3. Orders and Payments</h2>
						<p className="mt-4 text-sm leading-relaxed text-[#6C4735] md:text-base">
							By placing an order, you agree that:
						</p>
						<ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[#6C4735] md:text-base">
							{ORDER_COMMITMENTS.map((item) => (
								<li key={item}>{item}</li>
							))}
						</ul>
						<p className="mt-3 text-sm leading-relaxed text-[#6C4735] md:text-base">
							We may refuse, cancel, or limit orders at our discretion, including orders suspected of fraud or unauthorized activity.
						</p>
					</article>

					<article className="rounded-3xl border border-[#F0D9E2] bg-white p-6 shadow-sm md:p-8">
						<h2 className="text-2xl font-black">4. Pricing and Availability</h2>
						<p className="mt-4 text-sm leading-relaxed text-[#6C4735] md:text-base">
							We strive to ensure all product information is accurate. However, we reserve the right to correct pricing errors, update descriptions, modify availability, and cancel impacted orders.
						</p>
						<p className="mt-3 text-sm leading-relaxed text-[#6C4735] md:text-base">
							If your order is canceled after payment, a full refund will be issued.
						</p>
					</article>
				</section>

				<section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
					<article className="rounded-3xl border border-[#F0D9E2] bg-white p-6 shadow-sm md:p-8">
						<h2 className="text-2xl font-black">5. Shipping</h2>
						<p className="mt-4 text-sm leading-relaxed text-[#6C4735] md:text-base">
							Delivery times are estimates only and are not guaranteed.
						</p>
						<p className="mt-3 text-sm leading-relaxed text-[#6C4735] md:text-base">
							We are not responsible for delays caused by:
						</p>
						<ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[#6C4735] md:text-base">
							{SHIPPING_DELAY_CAUSES.map((item) => (
								<li key={item}>{item}</li>
							))}
						</ul>
						<p className="mt-3 text-sm leading-relaxed text-[#6C4735] md:text-base">
							Risk of loss transfers to the customer once the order has been delivered to the provided shipping address.
						</p>
					</article>

					<article className="rounded-3xl border border-[#F0D9E2] bg-white p-6 shadow-sm md:p-8">
						<h2 className="text-2xl font-black">6. Returns and Refunds</h2>
						<p className="mt-4 text-sm leading-relaxed text-[#6C4735] md:text-base">
							Returns and refunds are subject to our Refund Policy. Please review our Refund Policy before making a purchase.
						</p>
					</article>
				</section>

				<section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
					<article className="rounded-3xl border border-[#F0D9E2] bg-white p-6 shadow-sm md:p-8">
						<h2 className="text-2xl font-black">7. Product Information</h2>
						<p className="mt-4 text-sm leading-relaxed text-[#6C4735] md:text-base">
							We make every effort to display products accurately. However, product colors may vary by screen, dimensions may vary due to tolerances, and packaging may differ from images shown.
						</p>
						<p className="mt-3 text-sm leading-relaxed text-[#6C4735] md:text-base">
							We do not guarantee that product descriptions are completely free from errors.
						</p>
					</article>

					<article className="rounded-3xl border border-[#F0D9E2] bg-white p-6 shadow-sm md:p-8">
						<h2 className="text-2xl font-black">8. Acceptable Use</h2>
						<p className="mt-4 text-sm leading-relaxed text-[#6C4735] md:text-base">
							You agree not to:
						</p>
						<ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[#6C4735] md:text-base">
							{ACCEPTABLE_USE_RESTRICTIONS.map((item) => (
								<li key={item}>{item}</li>
							))}
						</ul>
						<p className="mt-3 text-sm leading-relaxed text-[#6C4735] md:text-base">
							Violation may result in suspension or termination of your access.
						</p>
					</article>
				</section>

				<section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
					<article className="rounded-3xl border border-[#F0D9E2] bg-white p-6 shadow-sm md:p-8">
						<h2 className="text-2xl font-black">9. Intellectual Property</h2>
						<p className="mt-4 text-sm leading-relaxed text-[#6C4735] md:text-base">
							All content on this website, including but not limited to, is owned by or licensed to MamaBear and protected by applicable intellectual property laws:
						</p>
						<ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[#6C4735] md:text-base">
							{INTELLECTUAL_PROPERTY_CONTENT.map((item) => (
								<li key={item}>{item}</li>
							))}
						</ul>
						<p className="mt-3 text-sm leading-relaxed text-[#6C4735] md:text-base">
							You may not reproduce, distribute, modify, or use our content without prior written permission.
						</p>
					</article>

					<article className="rounded-3xl border border-[#F0D9E2] bg-white p-6 shadow-sm md:p-8">
						<h2 className="text-2xl font-black">10. Third-Party Services</h2>
						<p className="mt-4 text-sm leading-relaxed text-[#6C4735] md:text-base">
							Our website may integrate with or link to third-party services, including:
						</p>
						<ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[#6C4735] md:text-base">
							{THIRD_PARTY_SERVICES.map((item) => (
								<li key={item}>{item}</li>
							))}
						</ul>
						<p className="mt-3 text-sm leading-relaxed text-[#6C4735] md:text-base">
							We are not responsible for the content, policies, or practices of third-party services.
						</p>
					</article>
				</section>

				<section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
					<article className="rounded-3xl border border-[#F0D9E2] bg-white p-6 shadow-sm md:p-8">
						<div className="mb-4 inline-flex items-center gap-2 text-[#D5557E]">
							<AlertTriangle size={18} />
							<h2 className="text-2xl font-black text-[#3B1F0E]">11. Disclaimer of Warranties</h2>
						</div>
						<p className="text-sm leading-relaxed text-[#6C4735] md:text-base">
							Our website, products, and services are provided on an "as is" and "as available" basis.
						</p>
						<p className="mt-3 text-sm leading-relaxed text-[#6C4735] md:text-base">
							To the fullest extent permitted by law, we disclaim all warranties, including:
						</p>
						<ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[#6C4735] md:text-base">
							{WARRANTY_EXCLUSIONS.map((item) => (
								<li key={item}>{item}</li>
							))}
						</ul>
						<p className="mt-3 text-sm leading-relaxed text-[#6C4735] md:text-base">
							We do not guarantee the website will be uninterrupted, error-free, or free from harmful components.
						</p>
					</article>

					<article className="rounded-3xl border border-[#F0D9E2] bg-white p-6 shadow-sm md:p-8">
						<div className="mb-4 inline-flex items-center gap-2 text-[#D5557E]">
							<ShieldAlert size={18} />
							<h2 className="text-2xl font-black text-[#3B1F0E]">12. Limitation of Liability</h2>
						</div>
						<p className="text-sm leading-relaxed text-[#6C4735] md:text-base">
							To the maximum extent permitted by law, MamaBear and its personnel will not be liable for indirect, incidental, consequential, special, or punitive damages arising from:
						</p>
						<ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[#6C4735] md:text-base">
							{LIABILITY_SCENARIOS.map((item) => (
								<li key={item}>{item}</li>
							))}
						</ul>
						<p className="mt-3 text-sm leading-relaxed text-[#6C4735] md:text-base">
							Our total liability for any claim will not exceed the amount paid for the applicable order.
						</p>
					</article>
				</section>

				<section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
					<article className="rounded-3xl border border-[#F0D9E2] bg-white p-6 shadow-sm md:p-8">
						<h2 className="text-2xl font-black">13. Indemnification</h2>
						<p className="mt-4 text-sm leading-relaxed text-[#6C4735] md:text-base">
							You agree to indemnify and hold harmless MamaBear, its affiliates, officers, employees, and agents from claims, damages, liabilities, losses, or expenses arising from:
						</p>
						<ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[#6C4735] md:text-base">
							{INDEMNIFICATION_SCENARIOS.map((item) => (
								<li key={item}>{item}</li>
							))}
						</ul>
					</article>

					<article className="rounded-3xl border border-[#F0D9E2] bg-white p-6 shadow-sm md:p-8">
						<h2 className="text-2xl font-black">14. Termination</h2>
						<p className="mt-4 text-sm leading-relaxed text-[#6C4735] md:text-base">
							We reserve the right to suspend or terminate your access to the website without prior notice if you violate these Terms or engage in conduct we reasonably believe is unlawful, fraudulent, or harmful.
						</p>
					</article>
				</section>

				<section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
					<article className="rounded-3xl border border-[#F0D9E2] bg-white p-6 shadow-sm md:p-8">
						<div className="mb-4 inline-flex items-center gap-2 text-[#D5557E]">
							<Gavel size={18} />
							<h2 className="text-2xl font-black text-[#3B1F0E]">15. Governing Law</h2>
						</div>
						<p className="text-sm leading-relaxed text-[#6C4735] md:text-base">
							These Terms are governed by and interpreted in accordance with the laws of the jurisdiction in which MamaBear operates, without regard to conflict of law principles.
						</p>
						<p className="mt-3 text-sm leading-relaxed text-[#6C4735] md:text-base">
							Any disputes arising under these Terms are subject to the exclusive jurisdiction of competent courts in that jurisdiction.
						</p>
					</article>

					<article className="rounded-3xl border border-[#F0D9E2] bg-white p-6 shadow-sm md:p-8">
						<h2 className="text-2xl font-black">16. Changes to These Terms</h2>
						<p className="mt-4 text-sm leading-relaxed text-[#6C4735] md:text-base">
							We may update these Terms from time to time. Changes take effect when posted on this page with an updated "Last Updated" date.
						</p>
						<p className="mt-3 text-sm leading-relaxed text-[#6C4735] md:text-base">
							Continued use of the website after changes are posted constitutes acceptance of the revised Terms.
						</p>
					</article>
				</section>

				<section className="rounded-3xl border border-[#F2C9D7] bg-gradient-to-r from-[#FCE5EC] to-[#FFEFF4] p-6 shadow-sm md:p-8">
					<div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-[#D5557E]">
						<BadgeCheck size={14} />
						17. Contact Us
					</div>
					<p className="text-sm leading-relaxed text-[#6C4735] md:text-base">
						If you have questions about these Terms of Service, please contact us:
					</p>
					<p className="mt-4 text-sm font-semibold text-[#3B1F0E] md:text-base">
						Email: support@mamabear.id
					</p>
					<p className="mt-1 text-sm font-semibold text-[#3B1F0E] md:text-base">
						Business Hours: Monday-Friday, 9:00 AM-6:00 PM (Local Time)
					</p>
					<p className="mt-4 text-sm leading-relaxed text-[#6C4735] md:text-base">
						Please include your name, contact information, and details of your inquiry, and we will respond as soon as reasonably possible.
					</p>
					<a
						href="mailto:support@mamabear.id"
						className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#D5557E] px-5 py-2.5 text-sm font-bold text-white transition hover:opacity-90"
					>
						<Mail size={16} />
						Contact MamaBear
					</a>
				</section>
			</div>
		</main>
	);
}

export default TermsPage;
