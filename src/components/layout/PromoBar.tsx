export default function PromoBar() {
  return (
    <div className="bg-brown text-white">
      <div className="mx-auto hidden w-full max-w-[1280px] justify-center px-[2cm] py-2 text-center text-sm sm:flex">
        Free shipping for orders above{" "}
        <span className="font-semibold">Rp 200.000</span> | ASI Booster
        specialist since 2020 ✨
      </div>

      {/* MOBILE-ONLY: promo bar text for mobile version */}
      <div className="mx-auto flex w-full justify-center px-2 py-2 text-center text-[10px] leading-none whitespace-nowrap sm:hidden">
        Free shipping for orders above{" "}
        <span className="font-semibold">Rp 200.000</span> | ASI Booster
        specialist since 2020 ✨
      </div>
    </div>
  );
}
