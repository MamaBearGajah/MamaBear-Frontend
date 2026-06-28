import Link from "next/link";

export default function PromoBar() {
  const promoText =
    "Mother's Day Special: Get the all-in-one hamper bundle for only Rp 100.000! | Free shipping for orders above";

  return (
    <div className="bg-brown text-white">
      <div className="mx-auto hidden w-full max-w-7xl justify-center px-6 py-2 text-center text-sm sm:flex">
        <Link href="/promotion">
          {promoText}{" "}
          <span className="font-semibold">Rp 200.000</span> | ASI Booster
          specialist since 2020 ✨
        </Link>
      </div>

      {/* MOBILE-ONLY: promo bar text for mobile version */}
      <div className="mx-auto w-full overflow-hidden py-2 sm:hidden">
        <Link href="/promotion" className="block w-full">
          <div className="promo-marquee-track text-[10px] leading-none whitespace-nowrap">
            <span className="pr-8">
              {promoText}{" "}
              <span className="font-semibold">Rp 200.000</span> | ASI Booster
              specialist since 2020 ✨
            </span>
            <span className="pr-8" aria-hidden>
              {promoText}{" "}
              <span className="font-semibold">Rp 200.000</span> | ASI Booster
              specialist since 2020 ✨
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}