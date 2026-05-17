// Testimonial component for displaying customer stories and reasons to choose Mamabear

type ReasonCard = {
  title: string;
  description: string;
  imageLabel: string;
  logos: string[];
};

type StoryCard = {
  initials: string;
  name: string;
  city: string;
  quote: string;
  rating: string;
  tags: string[];
};

const reasonCards: ReasonCard[] = [
  {
    title: "Pilihan Terpercaya Mama Menyusui",
    description:
      "Dipercaya banyak Mama dan terpilih sebagai brand choice dengan produk bernutrisi yang praktis untuk rutinitas harian.",
    imageLabel: "Image from backend",
    logos: ["Brand Choice", "Top Choice", "Customer Favorite"],
  },
  {
    title: "Produk Halal & Terdaftar BPOM",
    description:
      "Dirancang untuk mendampingi kebutuhan menyusui dengan bahan berkualitas, legal, dan nyaman dikonsumsi setiap hari.",
    imageLabel: "Image from backend",
    logos: ["Badan POM", "Halal Indonesia"],
  },
];

const storyCards: StoryCard[] = [
  {
    initials: "SR",
    name: "Siti Rahma",
    city: "Jakarta",
    quote:
      "Rasa enak dan bantu banget jaga energi selama menyusui. Pengiriman juga cepat.",
    rating: "★★★★★",
    tags: ["ASI Booster Tea - Thai Milk Tea"],
  },
  {
    initials: "DA",
    name: "Dewi Anggraeni",
    city: "Surabaya",
    quote:
      "Aku cocok sama variannya, praktis disiapkan dan bikin ASI terasa lebih lancar.",
    rating: "★★★★★",
    tags: ["Kookie Bites - Chocolate Chip"],
  },
  {
    initials: "PM",
    name: "Putri Maharani",
    city: "Bandung",
    quote:
      "Konsultasinya helpful, jadi lebih yakin pilih produk yang sesuai kebutuhan.",
    rating: "★★★★★",
    tags: ["Lactation Consultation"],
  },
  {
    initials: "AP",
    name: "Ayu Permata",
    city: "Yogyakarta",
    quote:
      "Packaging aman dan rasanya konsisten. Sudah repeat order beberapa kali.",
    rating: "★★★★★",
    tags: ["ASI Booster Capsules - Premium"],
  },
];

const Testimonial = () => {
  return (
    <section className="w-full bg-white py-8 md:py-10">
      <div className="mx-auto w-full max-w-[1280px] px-0">
        <div className="flex justify-center">
          <span className="inline-flex rounded-full bg-[#F7C4D2] px-4 py-1 text-[11px] font-semibold tracking-[0.12em] text-[#D5557E] uppercase">
            💬 Real Stories
          </span>
        </div>
        <h2 className="mt-3 text-center text-[34px] leading-[1.08] font-black text-[#6C4735]">
          Kenapa Harus Mamabear?
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
          {reasonCards.map((card) => (
            <article
              key={card.title}
              className="overflow-hidden rounded-[26px] border border-[#F0C7D5] bg-[#FFF2F6]"
            >
              <div className="grid h-full grid-cols-1 md:grid-cols-[1.2fr_0.9fr]">
                <div className="flex flex-col justify-between p-6 md:p-8">
                  <div>
                    <h3 className="max-w-[360px] text-[26px] leading-[1.08] font-black text-[#6C4735]">
                      {card.title}
                    </h3>
                    <p className="mt-3 max-w-[420px] text-[14px] leading-7 text-[#7D5A4D]">
                      {card.description}
                    </p>
                  </div>
                  <div className="h-[60px]" />
                </div>

                <div className="relative flex min-h-[230px] items-center justify-center overflow-hidden rounded-[26px] border-t border-[#F0C7D5] bg-gradient-to-br from-[#FCD9E3] via-[#F8C7D6] to-[#EFAAC0] md:min-h-0 md:rounded-[26px] md:border-t-0 md:border-l-0">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.6),transparent_55%)]" />
                  <div className="relative z-10 text-center text-[12px] font-medium text-white/50">
                    Image Placeholder
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 flex justify-center md:mt-12">
          <span className="inline-flex rounded-full bg-[#F7C4D2] px-4 py-1 text-[11px] font-semibold tracking-[0.12em] text-[#D5557E] uppercase">
            💬 Real Stories
          </span>
        </div>
        <h2 className="mt-3 text-center text-[34px] leading-[1.08] font-black text-[#6C4735]">
          Cerita Mama yang Sudah Mencoba
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {storyCards.map((story) => (
            <article
              key={story.name}
              className="rounded-[20px] border border-[#F0C7D5] bg-[#FFF2F6] p-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#D5557E] text-[13px] font-bold text-white">
                  {story.initials}
                </div>
                <div className="flex flex-col">
                  <p className="text-[16px] leading-tight font-semibold text-[#6C4735]">
                    {story.name}
                  </p>
                  <p className="text-[12px] text-[#9B7A6A]">{story.city}</p>
                </div>
              </div>
              <div className="mt-3 text-[13px] text-[#F4A300]">
                {story.rating}
              </div>
              <p className="mt-2 text-[13px] leading-[20px] text-[#7B6155]">
                {story.quote}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {story.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-[#F6D6DF] px-3 py-1 text-[11px] font-medium text-[#8A5A4B]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
