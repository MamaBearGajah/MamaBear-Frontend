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
    ctaLabel: "Coba Almon Mix",
    imageUrl: "/Image%20HomePage/featured1.png",
  },
  {
    badge: "Top Brand Choice",
    title: "Pilihan Terpercaya Mama & Kids",
    description:
      "Mamabear dipercaya untuk menemani kebutuhan nutrisi Mama selama menyusui.",
    ctaLabel: "Kenapa Mamabear?",
    imageUrl: "/Image%20HomePage/featured2.jpeg",
  },
];

export default function FeaturedCardsSection() {
  return (
    <section className="w-full bg-white py-6 md:py-8">
      <div className="hidden w-full px-0 md:block">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {featuredCards.map((card) => (
            <article
              key={card.title}
              className="relative overflow-hidden rounded-[20px] bg-gradient-to-br from-[#C95F86] via-[#D86D88] to-[#E7A7BC] p-6 text-white"
            >
              <div className="grid h-full grid-cols-1 gap-4 md:grid-cols-[1fr_232px] md:items-end">
                <div>
                  <p className="text-[13px] leading-5 font-medium text-white/95">
                    {card.badge}
                  </p>
                  <h3 className="mt-2 max-w-full text-[20px] leading-[1.08] font-bold text-white md:max-w-[360px] md:text-[28px]">
                    {card.title}
                  </h3>
                  <p className="mt-3 max-w-full text-[13px] leading-[20px] text-white/95 md:max-w-[330px]">
                    {card.description}
                  </p>
                  <button
                    type="button"
                    className="mt-5 inline-flex items-center rounded-full bg-[#6C4735] px-4 py-2 text-[13px] font-semibold text-white"
                  >
                    {card.ctaLabel}
                    <span className="ml-2">&gt;</span>
                  </button>
                </div>

                <div className="relative h-[200px] w-full self-end justify-self-end overflow-hidden rounded-[18px] border border-white bg-gradient-to-b from-[#FACBD8] to-white/75 md:h-[220px] md:max-w-[232px]">
                  {card.imageUrl ? (
                    <Image
                      src={card.imageUrl}
                      alt={card.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center px-4 text-center text-sm font-semibold text-[#6C4735]/80">
                      Image placeholder
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="w-full px-0 md:hidden">
        <div className="grid grid-cols-1 gap-4">
          {featuredCards.map((card) => (
            <article
              key={card.title}
              className="relative overflow-hidden rounded-[18px] bg-gradient-to-br from-[#C95F86] via-[#D86D88] to-[#E7A7BC] px-4 py-4 text-white"
            >
              <div className="flex min-h-[154px] items-center gap-3">
                <div className="min-w-0 flex-1 pr-0.5">
                  <p className="text-[11px] leading-4 font-medium text-white/95">
                    {card.badge}
                  </p>
                  <h3 className="mt-1 max-w-[150px] text-[16px] leading-[1.08] font-bold text-white">
                    {card.title}
                  </h3>
                  <p className="mt-2 max-w-[155px] text-[10px] leading-[15px] text-white/95">
                    {card.description}
                  </p>
                  <button
                    type="button"
                    className="mt-3 inline-flex items-center rounded-full bg-[#6C4735] px-3 py-1.5 text-[11px] font-semibold text-white"
                  >
                    {card.ctaLabel}
                    <span className="ml-2">&gt;</span>
                  </button>
                </div>

                <div className="relative h-[128px] w-[128px] shrink-0 overflow-hidden rounded-[16px] border border-white bg-gradient-to-b from-[#FACBD8] to-white/75">
                  {card.imageUrl ? (
                    <Image
                      src={card.imageUrl}
                      alt={card.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center px-4 text-center text-sm font-semibold text-[#6C4735]/80">
                      Image placeholder
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
