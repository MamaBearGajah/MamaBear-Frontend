import Image from "next/image";

// Testimonial component for displaying customer stories and reasons to choose Mamabear

type ReasonCard = {
  title: string;
  description: string;
  imageLabel: string;
  logos: Array<{
    src: string;
    alt: string;
    width: number;
    height: number;
    className?: string;
  }>;
  imageSrc: string;
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
      "Dipercaya banyak Mama dan terpilih sebagai Brand Choice 2024 for Mama & Kids serta Brand Choice 2024, Mamabear hadir untuk menemani perjalanan menyusui dengan produk yang praktis, enak, dan mudah jadi rutinitas harian.",
    imageLabel: "Image from backend",
    logos: [
      {
        src: "/Image%20HomePage/brandchoice-1.png",
        alt: "Brand Choice 1",
        width: 80,
        height: 80,
        className: "-translate-x-1 md:-translate-x-1 lg:-translate-x-1",
      },
      {
        src: "/Image%20HomePage/brandchoice-2.png",
        alt: "Brand Choice 2",
        width: 80,
        height: 80,
        className: "-translate-x-3 md:-translate-x-4 lg:-translate-x-4",
      },
    ],
    imageSrc: "/Image%20HomePage/testi1.png",
  },
  {
    title: "Produk Halal & Terdaftar BPOM",
    description:
      "Dibuat untuk menemani rutinitas Mama menyusui, produk Mamabear telah bersertifikasi Halal dan terdaftar BPOM, sehingga Mama bisa mengonsumsinya dengan lebih tenang setiap hari.",
    imageLabel: "Image from backend",
    logos: [
      {
        src: "/Image%20HomePage/logo-bpom.png",
        alt: "Badan POM",
        width: 92,
        height: 64,
      },
      {
        src: "/Image%20HomePage/logo-halal.png",
        alt: "Halal Indonesia",
        width: 92,
        height: 64,
      },
    ],
    imageSrc: "/Image%20HomePage/testi2.png",
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
  // API fetch rules (COMMENTED - API not available yet)
  // --------------------------------------------------
  // Endpoint: GET /api/testimonials
  // Expected response shape: { items: StoryCard[] }
  // Fields required per StoryCard: initials, name, city, quote, rating, tags
  // Pagination: optional query params `?page=1&limit=20`
  // Caching: client may cache for 30s; server should return stable ids
  // Usage (enable when API ready):
  // const [fetchedStories, setFetchedStories] = useState<StoryCard[] | null>(null);
  // useEffect(() => {
  //   let mounted = true;
  //   fetch('/api/testimonials')
  //     .then((res) => res.json())
  //     .then((data) => {
  //       if (!mounted) return;
  //       setFetchedStories(Array.isArray(data.items) ? data.items : data);
  //     })
  //     .catch(() => {
  //       if (!mounted) return;
  //       setFetchedStories(null);
  //     });
  //   return () => {
  //     mounted = false;
  //   };
  // }, []);
  // In JSX replace `storyCards` with `fetchedStories ?? storyCards`

  return (
    <section className="w-full bg-white py-8 md:py-10">
      <div className="w-full px-0">
        <div className="flex justify-center">
          <span className="inline-flex rounded-full bg-[#F7C4D2] px-4 py-1 text-[11px] font-semibold tracking-[0.12em] text-[#D5557E] uppercase">
            💬 Real Stories
          </span>
        </div>
        <h2 className="mt-3 text-center text-[34px] leading-[1.08] font-black text-[#6C4735]">
          Kenapa Harus Mamabear?
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {reasonCards.map((card) => (
            <article
              key={card.title}
              className="relative overflow-hidden rounded-[28px] border border-[#F0C7D5] bg-[#FFF2F6] lg:h-[7cm]"
            >
              <div className="grid h-full grid-cols-1 gap-0 md:grid-cols-2 md:items-stretch lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:items-stretch">
                <div
                  className={`flex h-full min-w-0 flex-col justify-between p-5 pb-2 md:p-6 md:pb-3 ${card.title.includes("Pilihan Terpercaya") ? "pr-0 md:pr-0" : ""}`}
                >
                  <div>
                    {card.title.includes("Pilihan Terpercaya") ? (
                      <h3 className="max-w-full text-[29px] leading-[1.05] font-bold text-[#6C4735]">
                        {card.title}
                      </h3>
                    ) : (
                      <h3
                        className="max-w-full text-[29px] leading-[1.05] font-bold text-[#6C4735]"
                        style={
                          {
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          } as any
                        }
                      >
                        {card.title}
                      </h3>
                    )}
                    {card.title.includes("Pilihan Terpercaya") ? (
                      <p className="mt-2 max-w-full text-[10px] leading-[1.35] text-[#7D5A4D]">
                        {card.description
                          .split("Brand Choice 2024")
                          .map((part, i, arr) => (
                            <span key={i}>
                              {part}
                              {i < arr.length - 1 && (
                                <strong className="font-semibold">
                                  Brand Choice 2024
                                </strong>
                              )}
                            </span>
                          ))}
                      </p>
                    ) : card.title.includes("Halal") ? (
                      <p className="mt-2 max-w-full text-[10px] leading-[1.35] text-[#7D5A4D]">
                        {card.description
                          .split(/(bersertifikasi Halal|terdaftar BPOM)/)
                          .map((part, i) =>
                            part === "bersertifikasi Halal" ||
                            part === "terdaftar BPOM" ? (
                              <strong key={i} className="font-semibold">
                                {part}
                              </strong>
                            ) : (
                              <span key={i}>{part}</span>
                            )
                          )}
                      </p>
                    ) : (
                      <p className="mt-2 max-w-full text-[10px] leading-[1.35] text-[#7D5A4D]">
                        {card.description}
                      </p>
                    )}
                  </div>

                  <div className="relative mt-4 flex flex-wrap items-center justify-end gap-0 md:gap-0">
                    {card.logos.map((logo) => (
                      <div
                        key={logo.alt}
                        className={`relative shrink-0 ${logo.className ?? ""} ${logo.alt?.toLowerCase().includes("brand choice 2") ? "md:translate-x-(-5) translate-x-2" : ""} ${logo.alt?.toLowerCase().includes("bpom") || logo.alt?.toLowerCase().includes("badan pom") ? "translate-x-2 md:translate-x-14" : ""} ${logo.alt?.toLowerCase().includes("halal") ? "translate-x-4 md:translate-x-8 lg:translate-x-7" : ""}`}
                        style={{ width: logo.width, height: logo.height }}
                      >
                        <Image
                          src={logo.src}
                          alt={logo.alt}
                          fill
                          className="object-contain"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="relative flex h-full w-full min-w-0 items-stretch">
                  <div className="relative h-full w-full overflow-hidden rounded-[28px] bg-gradient-to-b from-[#FACBD8] to-white/75">
                    <Image
                      src={card.imageSrc}
                      alt={card.title}
                      fill
                      className="rounded-[28px] object-cover"
                    />
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
