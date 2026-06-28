import { BadgeCheck } from "lucide-react";

function AuthBanner() {
  return (
    <>
      {/* Mobile top bar */}
      <div className="flex items-center justify-center gap-2 bg-[linear-gradient(135deg,rgba(213,85,126,0.95)_0%,rgba(108,71,53,0.85)_100%)] py-6 lg:hidden">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-sm font-bold text-white">
          MB
        </div>
        <span className="text-2xl font-black text-white">mamabear</span>
      </div>

      {/* Desktop left banner — sticky full height */}
      <div className="sticky top-0 hidden h-screen w-[50%] shrink-0 bg-[url(/authBgImage.webp)] bg-cover bg-right bg-no-repeat lg:block">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(213,85,126,0.85)_0%,rgba(108,71,53,0.7)_100%)]" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center p-12 text-center">
          <div className="flex items-center justify-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-lg font-bold text-white">
              MB
            </div>
            <span className="text-3xl font-black text-white">mamabear</span>
          </div>
          <h2 className="mb-4 mt-6 text-3xl leading-tight font-black text-white">
            Supporting Every Mama&apos;s Journey 🐻
          </h2>
          <p className="mb-8 leading-relaxed text-pink-100">
            Join 50,000+ breastfeeding mamas who trust Mamabear for natural,
            effective ASI boosters.
          </p>
          <div className="w-full max-w-xs space-y-3 text-left">
            {[
              "Exclusive member discounts",
              "Free lactation consultation",
              "Personalized product recommendations",
              "Track your orders easily",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 text-white">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20">
                  <BadgeCheck size={14} />
                </div>
                <span className="text-sm font-semibold">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default AuthBanner;