import type { Metadata } from "next";
import {
	Cookie,
	Lock,
	Mail,
	ShieldCheck,
	UserCheck,
} from "lucide-react";

export const metadata: Metadata = {
	title: "Privacy Policy | MamaBear",
	description:
		"Learn how MamaBear collects, uses, stores, and protects your personal information.",
};

const LAST_UPDATED = "June 18, 2026";

const PERSONAL_INFORMATION = [
	"Full name",
	"Email address",
	"Phone number",
	"Shipping address",
	"Billing address",
	"Payment information (processed securely through third-party payment providers)",
	"Account login credentials",
];

const AUTOMATIC_INFORMATION = [
	"IP address",
	"Browser type and version",
	"Device information",
	"Operating system",
	"Pages visited",
	"Time spent on pages",
	"Referral website",
	"Cookies and similar tracking technologies",
];

const USAGE_PURPOSES = [
	"Process and fulfill orders",
	"Deliver purchased products",
	"Process payments",
	"Send order confirmations and shipping updates",
	"Provide customer support",
	"Improve our website and services",
	"Personalize your shopping experience",
	"Detect and prevent fraud",
	"Comply with legal obligations",
	"Send promotional emails (only if you have opted in)",
];

const SHARING_PARTIES = [
	"Shipping and courier companies",
	"Payment processors",
	"Website hosting providers",
	"Analytics providers",
	"Marketing service providers",
	"Government authorities when required by law",
];

const YOUR_RIGHTS = [
	"Access your personal information",
	"Correct inaccurate information",
	"Request deletion of your information",
	"Restrict or object to certain processing",
	"Withdraw consent where processing is based on consent",
	"Request a copy of your data (data portability)",
];

function PrivacyPage() {
	return (
		<main className="min-h-screen bg-[#FFF7FA] py-10 text-[#3B1F0E]">
			<div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 md:px-8">
				<section className="overflow-hidden rounded-3xl border border-[#F6D8E2] bg-white shadow-sm">
					<div className="bg-gradient-to-r from-[#FAD1DE] via-[#FCE3EA] to-[#FFF4F8] px-6 py-8 md:px-10 md:py-10">
						<div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#D5557E]">
							<ShieldCheck size={16} />
							Privacy Policy
						</div>
						<h1 className="text-3xl font-black leading-tight md:text-4xl">
							Privacy Policy
						</h1>
						<p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#6C4735] md:text-base">
							Welcome to MamaBear. We value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or make a purchase.
						</p>
						<p className="mt-4 text-sm font-semibold text-[#8B6352]">
							Last Updated: {LAST_UPDATED}
						</p>
						<p className="mt-2 text-sm text-[#6C4735] md:text-base">
							By using our website, you agree to the practices described in this Privacy Policy.
						</p>
					</div>
				</section>

				<section className="grid grid-cols-1 gap-4 md:grid-cols-3">
					<div className="rounded-2xl border border-[#F3D4DE] bg-white p-5 shadow-sm">
						<p className="text-sm font-semibold text-[#8B6352]">What We Collect</p>
						<p className="mt-2 text-2xl font-black text-[#D5557E]">Personal Data</p>
						<p className="mt-2 text-sm text-[#6C4735]">Information required for accounts, orders, and support.</p>
					</div>
					<div className="rounded-2xl border border-[#F3D4DE] bg-white p-5 shadow-sm">
						<p className="text-sm font-semibold text-[#8B6352]">How We Protect</p>
						<p className="mt-2 text-2xl font-black text-[#D5557E]">Safeguards</p>
						<p className="mt-2 text-sm text-[#6C4735]">Administrative, technical, and physical protection controls.</p>
					</div>
					<div className="rounded-2xl border border-[#F3D4DE] bg-white p-5 shadow-sm">
						<p className="text-sm font-semibold text-[#8B6352]">Your Control</p>
						<p className="mt-2 text-2xl font-black text-[#D5557E]">Privacy Rights</p>
						<p className="mt-2 text-sm text-[#6C4735]">Access, correction, deletion, restriction, and portability rights.</p>
					</div>
				</section>

				<section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
					<article className="rounded-3xl border border-[#F0D9E2] bg-white p-6 shadow-sm md:p-8">
						<h2 className="text-2xl font-black">1. Information We Collect</h2>
						<p className="mt-4 text-sm font-semibold text-[#3B1F0E] md:text-base">Personal Information</p>
						<ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-[#6C4735] md:text-base">
							{PERSONAL_INFORMATION.map((item) => (
								<li key={item}>{item}</li>
							))}
						</ul>

						<p className="mt-5 text-sm font-semibold text-[#3B1F0E] md:text-base">Automatically Collected Information</p>
						<ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-[#6C4735] md:text-base">
							{AUTOMATIC_INFORMATION.map((item) => (
								<li key={item}>{item}</li>
							))}
						</ul>
					</article>

					<article className="rounded-3xl border border-[#F0D9E2] bg-white p-6 shadow-sm md:p-8">
						<h2 className="text-2xl font-black">2. How We Use Your Information</h2>
						<ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-[#6C4735] md:text-base">
							{USAGE_PURPOSES.map((item) => (
								<li key={item}>{item}</li>
							))}
						</ul>
					</article>
				</section>

				<section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
					<article className="rounded-3xl border border-[#F0D9E2] bg-white p-6 shadow-sm md:p-8">
						<div className="mb-4 inline-flex items-center gap-2 text-[#D5557E]">
							<Lock size={18} />
							<h2 className="text-2xl font-black text-[#3B1F0E]">3. Payment Information</h2>
						</div>
						<p className="text-sm leading-relaxed text-[#6C4735] md:text-base">
							We do not store your complete payment card information on our servers.
						</p>
						<p className="mt-3 text-sm leading-relaxed text-[#6C4735] md:text-base">
							Payments are processed securely through trusted third-party payment providers that comply with industry security standards.
						</p>
					</article>

					<article className="rounded-3xl border border-[#F0D9E2] bg-white p-6 shadow-sm md:p-8">
						<div className="mb-4 inline-flex items-center gap-2 text-[#D5557E]">
							<Cookie size={18} />
							<h2 className="text-2xl font-black text-[#3B1F0E]">4. Cookies</h2>
						</div>
						<p className="text-sm leading-relaxed text-[#6C4735] md:text-base">Our website uses cookies and similar technologies to:</p>
						<ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[#6C4735] md:text-base">
							<li>Remember your preferences</li>
							<li>Keep you signed in</li>
							<li>Analyze website traffic</li>
							<li>Improve website performance</li>
							<li>Personalize content and advertisements where applicable</li>
						</ul>
						<p className="mt-3 text-sm leading-relaxed text-[#6C4735] md:text-base">
							You can disable cookies through browser settings, although some website features may not function properly.
						</p>
					</article>
				</section>

				<section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
					<article className="rounded-3xl border border-[#F0D9E2] bg-white p-6 shadow-sm md:p-8">
						<h2 className="text-2xl font-black">5. Sharing Your Information</h2>
						<p className="mt-4 text-sm leading-relaxed text-[#6C4735] md:text-base">
							We do not sell your personal information.
						</p>
						<p className="mt-3 text-sm leading-relaxed text-[#6C4735] md:text-base">
							We may share your information with trusted third parties, including:
						</p>
						<ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[#6C4735] md:text-base">
							{SHARING_PARTIES.map((item) => (
								<li key={item}>{item}</li>
							))}
						</ul>
						<p className="mt-3 text-sm leading-relaxed text-[#6C4735] md:text-base">
							These parties only receive information necessary to perform their services.
						</p>
					</article>

					<article className="rounded-3xl border border-[#F0D9E2] bg-white p-6 shadow-sm md:p-8">
						<h2 className="text-2xl font-black">6. Data Security</h2>
						<p className="mt-4 text-sm leading-relaxed text-[#6C4735] md:text-base">
							We implement reasonable administrative, technical, and physical safeguards to protect your personal information from unauthorized access, disclosure, alteration, or destruction.
						</p>
						<p className="mt-3 text-sm leading-relaxed text-[#6C4735] md:text-base">
							While we strive to protect your information, no method of internet transmission or electronic storage is completely secure.
						</p>
					</article>
				</section>

				<section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
					<article className="rounded-3xl border border-[#F0D9E2] bg-white p-6 shadow-sm md:p-8">
						<h2 className="text-2xl font-black">7. Data Retention</h2>
						<p className="mt-4 text-sm leading-relaxed text-[#6C4735] md:text-base">
							We retain your personal information only as long as necessary to:
						</p>
						<ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[#6C4735] md:text-base">
							<li>Fulfill your orders</li>
							<li>Maintain your account</li>
							<li>Comply with legal obligations</li>
							<li>Resolve disputes</li>
							<li>Enforce our agreements</li>
						</ul>
						<p className="mt-3 text-sm leading-relaxed text-[#6C4735] md:text-base">
							When no longer required, data is securely deleted or anonymized where appropriate.
						</p>
					</article>

					<article className="rounded-3xl border border-[#F0D9E2] bg-white p-6 shadow-sm md:p-8">
						<div className="mb-4 inline-flex items-center gap-2 text-[#D5557E]">
							<UserCheck size={18} />
							<h2 className="text-2xl font-black text-[#3B1F0E]">8. Your Rights</h2>
						</div>
						<p className="text-sm leading-relaxed text-[#6C4735] md:text-base">
							Depending on your location and applicable laws, you may have the right to:
						</p>
						<ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[#6C4735] md:text-base">
							{YOUR_RIGHTS.map((item) => (
								<li key={item}>{item}</li>
							))}
						</ul>
						<p className="mt-3 text-sm leading-relaxed text-[#6C4735] md:text-base">
							To exercise these rights, contact us using the details listed below.
						</p>
					</article>
				</section>

				<section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
					<article className="rounded-3xl border border-[#F0D9E2] bg-white p-6 shadow-sm md:p-8">
						<h2 className="text-2xl font-black">9. Marketing Communications</h2>
						<p className="mt-4 text-sm leading-relaxed text-[#6C4735] md:text-base">
							If you subscribe to our newsletter or promotional emails, you may receive updates about new products, promotions, and special offers.
						</p>
						<p className="mt-3 text-sm leading-relaxed text-[#6C4735] md:text-base">
							You may unsubscribe anytime via the "Unsubscribe" link in our emails or by contacting us directly.
						</p>
					</article>

					<article className="rounded-3xl border border-[#F0D9E2] bg-white p-6 shadow-sm md:p-8">
						<h2 className="text-2xl font-black">10. Third-Party Links</h2>
						<p className="mt-4 text-sm leading-relaxed text-[#6C4735] md:text-base">
							Our website may contain links to third-party websites.
						</p>
						<p className="mt-3 text-sm leading-relaxed text-[#6C4735] md:text-base">
							We are not responsible for the privacy practices or content of external websites, and we encourage you to review their privacy policies before sharing personal information.
						</p>
					</article>
				</section>

				<section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
					<article className="rounded-3xl border border-[#F0D9E2] bg-white p-6 shadow-sm md:p-8">
						<h2 className="text-2xl font-black">11. Children's Privacy</h2>
						<p className="mt-4 text-sm leading-relaxed text-[#6C4735] md:text-base">
							Our website is not intended for individuals under the age required by applicable law to use our services independently.
						</p>
						<p className="mt-3 text-sm leading-relaxed text-[#6C4735] md:text-base">
							We do not knowingly collect personal information from children. If such data is identified, we will take steps to delete it.
						</p>
					</article>

					<article className="rounded-3xl border border-[#F0D9E2] bg-white p-6 shadow-sm md:p-8">
						<h2 className="text-2xl font-black">12. International Data Transfers</h2>
						<p className="mt-4 text-sm leading-relaxed text-[#6C4735] md:text-base">
							If you access our website from outside the country where our servers are located, your information may be transferred to and processed in another jurisdiction.
						</p>
						<p className="mt-3 text-sm leading-relaxed text-[#6C4735] md:text-base">
							By using our website, you consent to such transfers where permitted by applicable law.
						</p>
					</article>
				</section>

				<section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
					<article className="rounded-3xl border border-[#F0D9E2] bg-white p-6 shadow-sm md:p-8">
						<h2 className="text-2xl font-black">13. Changes to This Privacy Policy</h2>
						<p className="mt-4 text-sm leading-relaxed text-[#6C4735] md:text-base">
							We may update this Privacy Policy from time to time.
						</p>
						<p className="mt-3 text-sm leading-relaxed text-[#6C4735] md:text-base">
							Any changes will be posted on this page with an updated "Last Updated" date. Continued use of our website after changes become effective indicates acceptance of the revised policy.
						</p>
					</article>

					<article className="rounded-3xl border border-[#F2C9D7] bg-gradient-to-r from-[#FCE5EC] to-[#FFEFF4] p-6 shadow-sm md:p-8">
						<div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-[#D5557E]">
							<Mail size={14} />
							14. Contact Us
						</div>
						<p className="text-sm leading-relaxed text-[#6C4735] md:text-base">
							If you have questions, concerns, or requests regarding this Privacy Policy or how your personal information is handled, contact MamaBear at:
						</p>
						<p className="mt-4 text-sm font-semibold text-[#3B1F0E] md:text-base">
							Email: support@mamabear.id
						</p>
						<p className="mt-1 text-sm font-semibold text-[#3B1F0E] md:text-base">
							Business Hours: Monday-Friday, 9:00 AM-6:00 PM (Local Time)
						</p>
						<p className="mt-4 text-sm leading-relaxed text-[#6C4735] md:text-base">
							Please include your name, email address, and details of your inquiry so we can assist you promptly.
						</p>
					</article>
				</section>
			</div>
		</main>
	);
}

export default PrivacyPage;
