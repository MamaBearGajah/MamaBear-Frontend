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
  },
  {
    badge: "Top Brand Choice",
    title: "Pilihan Terpercaya Mama & Kids",
    description:
      "Mamabear dipercaya untuk menemani kebutuhan nutrisi Mama selama menyusui.",
    ctaLabel: "Kenapa Mamabear?",
  },
];

export default function FeaturedCardsSection() {
  return (
    <section className="w-full bg-white py-6 md:py-8">
      <div className="mx-auto w-full max-w-[1280px] px-0">
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
                  <h3 className="mt-2 max-w-[360px] text-[28px] leading-[1.08] font-bold">
                    {card.title}
                  </h3>
                  <p className="mt-3 max-w-[330px] text-[13px] leading-[20px] text-white/95">
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
    </section>
  );
}
