import Link from "next/link";

export default function PromoBar() {
  return (
    <div className="bg-brown text-white">
      <div className="mx-auto hidden w-full max-w-[1280px] justify-center px-[2cm] py-2 text-center text-sm sm:flex">
        <Link href="/promotions" passHref>
          Mother’s Day Special: Get the all-in-one hamper bundle for only Rp 100.000! | 
          Free shipping for orders above{" "}
          <span className="font-semibold">Rp 200.000</span> | ASI Booster
          specialist since 2020 ✨
        </Link>
      </div>

      {/* MOBILE-ONLY: promo bar text for mobile version */}
      <div className="mx-auto flex w-full justify-center px-2 py-2 text-center text-[10px] leading-none whitespace-nowrap sm:hidden">
        <Link href="/promotions" passHref>
          Mother’s Day Special: Get the all-in-one hamper bundle for only Rp 100.000! | 
          Free shipping for orders above{" "}
          <span className="font-semibold">Rp 200.000</span> | ASI Booster
          specialist since 2020 ✨
        </Link>
      </div>
    </div>
  );
}
