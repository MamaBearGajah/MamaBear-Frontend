import Link from "next/link";

type PromoCard = {
  badge: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  tone: "left" | "right";
};

const promoCards: PromoCard[] = [
  {
    badge: "First Order Special",
    title: "Baru Pertama Kali Belanja? Dapatkan Diskon 15%",
    description: "Gunakan Kode MAMABEAR15 untuk pembelian pertama Mama.",
    ctaLabel: "Pakai Promo",
    ctaHref: "/product",
    tone: "left",
  },
  {
    badge: "Free Service",
    title: "Bingung Pilih Produk? Konsultasikan kepada Kami",
    description:
      "Tim konsultan kami siap membantu Mama menemukan pilihan yang sesuai dengan kebutuhan menyusui.",
    ctaLabel: "Konsultasi Gratis",
    ctaHref: "/consultation",
    tone: "right",
  },
];

export default function PromoSection() {
  return (
    <section className="w-full bg-[#FFF6F8] py-6 md:py-0">
      <div className="mx-auto w-full max-w-[1280px] px-0">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[823px_minmax(0,1fr)]">
          <article className="relative overflow-hidden rounded-[24px] bg-[linear-gradient(135deg,#D5557E_0%,#FACBD8_100%)] p-6 text-white lg:h-[293px] lg:w-[823px]">
            <div className="h-full">
              <div>
                <p className="text-[11px] font-medium text-white/90">
                  {promoCards[0].badge}
                </p>
                <h3 className="mt-2 max-w-[320px] text-[20px] leading-[1.1] font-black md:text-[24px]">
                  {promoCards[0].title}
                </h3>
                <p className="mt-3 max-w-[300px] text-[12px] leading-[16px] text-white/90">
                  {promoCards[0].description}
                </p>

                <Link
                  href={promoCards[0].ctaHref}
                  className="mt-4 inline-flex items-center rounded-full bg-[#6C4735] px-5 py-2 text-[12px] font-semibold text-white transition hover:opacity-90"
                >
                  {promoCards[0].ctaLabel}
                  <span className="ml-2">→</span>
                </Link>
              </div>

              <div className="relative mt-4 h-[160px] w-[160px] overflow-hidden rounded-[22px] border border-white/80 bg-gradient-to-br from-[#F7D2DB] via-white to-[#E7A7BC] md:h-[180px] md:w-[180px] lg:absolute lg:top-[23px] lg:left-[549px] lg:mt-0 lg:h-[249px] lg:w-[249px]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.6),transparent_50%)]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="mx-auto h-20 w-20 rounded-[12px] border border-white/70 bg-white/40 lg:h-24 lg:w-24" />
                  </div>
                </div>
              </div>
            </div>
          </article>

          <article className="relative overflow-hidden rounded-[26px] bg-[#6C4735]">
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(108,67,53,0.88)_0%,rgba(108,67,53,0.72)_42%,rgba(108,67,53,0.38)_100%)]" />
            <div className="relative z-10 h-[220px] p-6 md:h-[245px] md:p-8">
              <div className="max-w-[340px] text-white">
                <p className="text-[11px] font-medium text-white/85">
                  {promoCards[1].badge}
                </p>
                <h3 className="mt-2 max-w-[300px] text-[18px] leading-[1.1] font-black md:text-[22px]">
                  {promoCards[1].title}
                </h3>
                <p className="mt-3 max-w-[280px] text-[12px] leading-[16px] text-white/85">
                  {promoCards[1].description}
                </p>

                <Link
                  href={promoCards[1].ctaHref}
                  className="mt-4 inline-flex items-center rounded-full bg-[#E35F8A] px-4 py-2 text-[12px] font-semibold text-white transition hover:opacity-90"
                >
                  {promoCards[1].ctaLabel}
                  <span className="ml-2">→</span>
                </Link>
              </div>

              <div className="absolute inset-y-0 right-0 w-[55%] bg-[linear-gradient(180deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0)_100%)]" />
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
