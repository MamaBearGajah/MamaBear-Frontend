import Link from "next/link";
import Image from "next/image";

type PromoCard = {
  badge: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  tone: "left" | "right";
};

function MobilePromoCard({ card }: { card: PromoCard }) {
  const imageSrc =
    card.tone === "left"
      ? "/Image%20HomePage/promo1.png"
      : "/Image%20HomePage/promo2.png";

  if (card.tone === "right") {
    return (
      <article className="relative overflow-hidden rounded-[20px] bg-[#6C4735] text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/Image%20HomePage/promo2.png')" }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(108,67,53,0.88)_0%,rgba(108,67,53,0.72)_42%,rgba(108,67,53,0.38)_100%)]" />

        <div className="relative z-10 flex min-h-[176px] flex-col justify-between gap-3 p-4">
          <div className="min-w-0">
            <p className="text-[12px] font-medium text-white/90">
              {card.badge}
            </p>
            <h3 className="mt-2 max-w-[210px] text-[17px] leading-[1.12] font-black text-white">
              {card.title}
            </h3>
            <p className="mt-2 max-w-[220px] text-[11px] leading-[16px] text-white/90">
              {card.description}
            </p>
          </div>

          <Link
            href={card.ctaHref}
            className="inline-flex w-max items-center rounded-full bg-[#E35F8A] px-4 py-2 text-[12px] font-semibold text-white transition hover:opacity-90"
          >
            {card.ctaLabel}
            <span className="ml-2">→</span>
          </Link>
        </div>
      </article>
    );
  }

  return (
    <article className="relative overflow-hidden rounded-[20px] bg-[linear-gradient(135deg,#D5557E_0%,#FACBD8_100%)] text-white">
      <div className="relative z-10 grid min-h-[168px] grid-cols-[minmax(0,1fr)_128px] items-stretch gap-3 p-4">
        <div className="flex min-w-0 flex-col justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[12px] font-medium text-white/90">
              {card.badge}
            </p>
            <h3 className="mt-2 max-w-[168px] text-[16px] leading-[1.12] font-black text-white">
              {card.title}
            </h3>
            <p className="mt-2 max-w-[176px] text-[10px] leading-[15px] text-white/90">
              {card.description}
            </p>
          </div>

          <Link
            href={card.ctaHref}
            className="inline-flex w-max items-center rounded-full bg-[#6C4735] px-4 py-2 text-[12px] font-semibold text-white transition hover:opacity-90"
          >
            {card.ctaLabel}
            <span className="ml-2">→</span>
          </Link>
        </div>

        <div className="relative aspect-[1.12/1] w-full overflow-hidden rounded-[16px] border border-white/80 bg-white/10">
          <Image
            src={imageSrc}
            alt={card.title}
            fill
            className="object-cover"
          />
        </div>
      </div>
    </article>
  );
}

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
    badge: "FREE SERVICE",
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
    <section className="w-full bg-white pt-8 pb-6 md:pt-5 md:pb-0">
      {/* Desktop layout: keep original grid */}
      <div className="hidden w-full px-0 md:block">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[18.5cm_minmax(0,1fr)]">
          <article className="relative overflow-hidden rounded-[24px] bg-[linear-gradient(135deg,#D5557E_0%,#FACBD8_100%)] p-6 text-white lg:h-[7cm] lg:w-full lg:pl-[40px]">
            <div className="flex h-full">
              <div className="flex flex-1 flex-col justify-center gap-3 lg:pr-[260px]">
                <p className="text-[12px] font-medium text-white/90">
                  {promoCards[0].badge}
                </p>

                <h3 className="w-full max-w-none font-['Quicksand'] text-[28px] leading-[1.1] font-black text-white">
                  {promoCards[0].title}
                </h3>

                <p className="max-w-[300px] text-[12px] leading-[16px] text-white/90">
                  {(() => {
                    const txt = promoCards[0].description;
                    const code = "MAMABEAR15";
                    if (txt.includes(code)) {
                      const parts = txt.split(code);
                      return (
                        <>
                          {parts[0]}
                          <span className="mx-1 inline-block rounded-full bg-[#F7B7C9]/80 px-2 py-0.5 align-middle text-[12px] font-bold text-white uppercase">
                            {code}
                          </span>
                          {parts[1]}
                        </>
                      );
                    }
                    return txt;
                  })()}
                </p>

                <div>
                  <Link
                    href={promoCards[0].ctaHref}
                    className="inline-flex items-center rounded-full bg-[#6C4735] px-5 py-2 text-[12px] font-semibold text-white transition hover:opacity-90"
                  >
                    {promoCards[0].ctaLabel}
                    <span className="ml-2">→</span>
                  </Link>
                </div>
              </div>

              <div className="relative mt-4 h-[160px] w-[160px] overflow-hidden rounded-[22px] border border-white/80 md:h-[180px] md:w-[180px] lg:absolute lg:top-[20px] lg:right-[20px] lg:bottom-[20px] lg:mt-0 lg:h-[220px] lg:w-[220px]">
                <Image
                  src="/Image%20HomePage/promo1.png"
                  alt="promo"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </article>

          <article className="relative overflow-hidden rounded-[26px] bg-[#6C4735] lg:h-[7cm]">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/Image%20HomePage/promo2.png')" }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(108,67,53,0.88)_0%,rgba(108,67,53,0.72)_42%,rgba(108,67,53,0.38)_100%)]" />
            <div className="relative z-10 flex h-full items-center p-6 md:p-8">
              <div className="flex max-w-[340px] flex-col justify-center gap-3 text-white">
                <p className="text-[12px] font-medium text-white/85">
                  {promoCards[1].badge}
                </p>

                <h3 className="max-w-[300px] text-[18px] leading-[1.1] font-black text-white md:text-[22px]">
                  {promoCards[1].title}
                </h3>

                <p className="max-w-[280px] text-[12px] leading-[16px] text-white/85">
                  {promoCards[1].description}
                </p>

                <Link
                  href={promoCards[1].ctaHref}
                  className="inline-flex w-max items-center rounded-full bg-[#E35F8A] px-4 py-2 text-[12px] font-semibold text-white transition hover:opacity-90"
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

      {/* MOBILE-ONLY: stacked promo cards with equal height and visible images */}
      <div className="w-full md:hidden">
        <div className="space-y-4">
          {promoCards.map((card) => (
            <MobilePromoCard key={card.title} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}
