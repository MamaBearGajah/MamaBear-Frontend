import Link from "next/link";
import Image from "next/image";

type FeaturedCard = {
  badge: string;
  title: string;
  description: string;
  ctaLabel: string;
  imageUrl?: string;
};

const featuredCards: FeaturedCard[] = [
  {
    badge: "Pilihan Mama",
    title: "Almon Mix untuk Mama Menyusui",
    description:
      "Minuman almond kaya nutrisi dengan 7 varian rasa favorit untuk temani hari menyusui Mama.",
    ctaLabel: "Shop Now",
    imageUrl: "/Image%20HomePage/featured1.png",
  },
  {
    badge: "Top Brand Choice",
    title: "Pilihan Terpercaya Mama & Kids",
    description:
      "Mamabear dipercaya untuk menemani kebutuhan nutrisi Mama selama menyusui.",
    ctaLabel: "Why Mamabear?",
    imageUrl: "/Image%20HomePage/featured2.jpeg",
  },
];

export default function FeaturedCardsSection() {
  const almonMixProductDetailLink = "/products/mamabear-almonmix-isi-6-sachet";
  const aboutPageLink = "/about";

  return (
    <section className="w-full bg-[#FEF2F5] py-6 md:py-8">
      {/* Shared grid — works on both mobile and desktop */}
      <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-2">
        {featuredCards.map((card) => {
          const href = card.ctaLabel === "Shop Now" ? almonMixProductDetailLink : aboutPageLink;
          return (
            <article
              key={card.title}
              className="relative overflow-hidden rounded-[18px] bg-gradient-to-br from-[#C95F86] via-[#D86D88] to-[#E7A7BC] p-4 text-white sm:p-6 md:rounded-[20px]"
            >
              {/* Mobile: side-by-side text + image */}
              <div className="flex items-center gap-3 md:hidden">
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-medium text-white/90">{card.badge}</p>
                  <h3 className="mt-1 text-[15px] leading-[1.1] font-bold text-white">
                    {card.title}
                  </h3>
                  <p className="mt-1.5 text-[11px] leading-[1.5] text-white/90">
                    {card.description}
                  </p>
                  <Link
                    href={href}
                    className="mt-3 inline-flex items-center rounded-full bg-[#6C4735] px-3 py-1.5 text-[11px] font-semibold text-white"
                  >
                    {card.ctaLabel}
                    <span className="ml-1.5 text-[11px] font-normal">➜</span>
                  </Link>
                </div>
                <div className="relative h-[140px] w-[140px] shrink-0 overflow-hidden rounded-[14px] border border-white bg-gradient-to-b from-[#FACBD8] to-white/75">
                  {card.imageUrl && (
                    <Image
                      src={card.imageUrl}
                      alt={card.title}
                      fill
                      sizes="140px"
                      className="object-cover"
                    />
                  )}
                </div>
              </div>

              {/* Desktop: stacked layout */}
              <div className="hidden md:grid md:h-full md:grid-cols-[1fr_232px] md:items-end md:gap-4">
                <div>
                  <p className="text-[13px] leading-5 font-medium text-white/95">
                    {card.badge}
                  </p>
                  <h3 className="mt-2 max-w-[360px] text-[20px] leading-[1.08] font-bold text-white md:text-[28px]">
                    {card.title}
                  </h3>
                  <p className="mt-3 max-w-[330px] text-[13px] leading-[20px] text-white/95">
                    {card.description}
                  </p>
                  <Link
                    href={href}
                    className="mt-5 inline-flex items-center rounded-full bg-[#6C4735] px-4 py-2 text-[13px] font-semibold text-white"
                  >
                    {card.ctaLabel}
                    <span className="ml-2 text-[13px] font-normal">➜</span>
                  </Link>
                </div>
                <div className="relative h-[200px] w-full self-end justify-self-end overflow-hidden rounded-[18px] border border-white bg-gradient-to-b from-[#FACBD8] to-white/75 md:h-[220px] md:max-w-[232px]">
                  {card.imageUrl && (
                    <Image
                      src={card.imageUrl}
                      alt={card.title}
                      fill
                      sizes="232px"
                      className="object-cover"
                    />
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}