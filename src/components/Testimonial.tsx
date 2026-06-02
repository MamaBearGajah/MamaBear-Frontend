import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

// Testimonial component for displaying customer stories and reasons to choose Mamabear

type ReasonCard = {
  title: string;
  description: string;
  imageLabel: string;
  badges: Array<{
    label: string;
    textClassName?: string;
  }>;
  imageSrc: string;
};

function BadgePill({
  label,
  textClassName = "text-[#6C4735]",
  allowWrap = false,
}: {
  label: string;
  textClassName?: string;
  allowWrap?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[#FACBD8] px-2 py-0.5 text-[9px] leading-none font-bold shadow-[0_1px_2px_rgba(108,67,53,0.05)] sm:px-2.5 sm:text-[10px]">
      <CheckCircle2
        className="h-3 w-3 shrink-0 text-[#6C4735]"
        strokeWidth={2.75}
      />
      <span
        className={`${textClassName} font-bold ${allowWrap ? "text-left whitespace-normal" : "whitespace-nowrap"}`}
      >
        {label}
      </span>
    </span>
  );
}

type StoryCard = {
  initials: string;
  name: string;
  city: string;
  quote: string;
  rating: number;
  tags: string[];
};

const reasonCards: ReasonCard[] = [
  {
    title: "Pilihan Terpercaya Mama Menyusui",
    description:
      "Dipercaya banyak Mama dan terpilih sebagai Brand Choice 2024 for Mama & Kids serta Brand Choice 2024, Mamabear hadir untuk menemani perjalanan menyusui dengan produk yang praktis, enak, dan mudah jadi rutinitas harian.",
    imageLabel: "Image from backend",
    badges: [{ label: "Brand Choice 2024" }],
    imageSrc: "/Image%20HomePage/testi1.jpg",
  },
  {
    title: "Produk Halal & Terdaftar BPOM",
    description:
      "Dibuat untuk menemani rutinitas Mama menyusui, produk Mamabear telah bersertifikasi Halal dan terdaftar BPOM, sehingga Mama bisa mengonsumsinya dengan lebih tenang setiap hari.",
    imageLabel: "Image from backend",
    badges: [
      { label: "BPOM RI" },
      { label: "Halal MUI" },
      { label: "ISO 9001" },
    ],
    imageSrc: "/Image%20HomePage/testi2.jpg",
  },
];

const storyCards: StoryCard[] = [
  {
    initials: "SR",
    name: "Siti Rahma",
    city: "Jakarta",
    quote:
      '"ASI Booster Tea Thai Milk Tea rasa enak banget! Seminggu minum udah kerasa bedanya. Baby jadi lebih kenyang dan tidur lebih lama. Thank you Mamabear! 💕"',
    rating: 5,
    tags: ["ASI Booster Tea - Thai Milk Tea"],
  },
  {
    initials: "DA",
    name: "Dewi Anggraeni",
    city: "Surabaya",
    quote:
      '"Kookie Bites jadi snack wajib saya saat nursing session: Enak, nggak bikin gemuk, dan ASI makin banyak. Udah order ke-5 nih" 😍',
    rating: 5,
    tags: ["Kookie Bites - Chocolate Chip"],
  },
  {
    initials: "PM",
    name: "Putri Maharani",
    city: "Bandung",
    quote:
      '"Konsultasi laktasinya helpful banget! Konsultannya sabar dan helpful. Masalah latch yang udah 2 minggu akhirnya selesai dalam 1 sesi!"',
    rating: 5,
    tags: ["Lactation Consultation"],
  },
  {
    initials: "AP",
    name: "Ayu Permata",
    city: "Yogyakarta",
    quote:
      '"Capsules Premium luar biasa! Dalam 3 hari ASI udah melimpah ruah. Bayi nggak perlu sufor lagi. Worth every rupiah! 🥹"',
    rating: 5,
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
    <section className="w-full bg-[#FEF2F5] pt-6 pb-8 md:py-10">
      <div className="w-full px-0">
        <div className="flex justify-center">
          <span className="inline-flex h-[24px] items-center justify-center rounded-full bg-[#FACBD8] px-3 py-1 font-['Quicksand'] text-[12px] leading-4 font-bold tracking-[0.6px] text-[#D5557E] uppercase">
            <span>💬 Real Stories</span>
          </span>
        </div>
        <h2 className="mt-3 text-center text-[24px] leading-[1.05] font-black text-[#6C4735] md:text-[34px] md:leading-[1.08]">
          Kenapa Harus Mamabear?
        </h2>

        {/* Desktop/Testimonial (unchanged) - visible on md and up */}
        <div className="hidden md:block">
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {reasonCards.map((card) => (
              <article
                key={card.title}
                className="relative overflow-hidden rounded-[28px] border border-[#F0C7D5] bg-white lg:h-[7cm]"
              >
                <div className="grid h-full grid-cols-1 gap-0 md:grid-cols-2 md:items-stretch lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:items-stretch">
                  <div
                    className={`flex h-full min-w-0 flex-col p-5 pb-2 md:p-6 md:pb-3 ${card.title.includes("Pilihan Terpercaya") ? "pr-0 md:pr-0" : ""}`}
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

                    <div
                      className={`relative mt-8 flex flex-nowrap items-center justify-start gap-1.5 ${card.title.includes("Produk Halal") ? "overflow-visible" : "overflow-hidden"} md:mt-10 md:gap-2`}
                    >
                      {card.badges.map((badge) => (
                        <BadgePill
                          key={badge.label}
                          label={badge.label}
                          textClassName={badge.textClassName}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="relative flex h-full w-full min-w-0 items-stretch">
                    <div className="relative h-full w-full overflow-hidden bg-gradient-to-b from-white to-white/75">
                      <Image
                        src={card.imageSrc}
                        alt={card.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover"
                      />
                      <div className="pointer-events-none absolute inset-y-0 left-0 w-[58%] bg-[linear-gradient(90deg,rgba(255,255,255,1)_0%,rgba(255,255,255,0.94)_28%,rgba(255,255,255,0.72)_58%,rgba(255,255,255,0)_100%)]" />
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* MOBILE-ONLY: keep this block separate from the desktop card layout */}
        <div className="mt-6 md:hidden">
          <div className="space-y-4 px-0">
            {reasonCards.map((card) => (
              <article
                key={card.title}
                className="flex flex-row-reverse items-stretch overflow-hidden rounded-[16px] border border-[#F0C7D5] bg-white"
              >
                <div className="relative w-[40%] min-w-[110px] self-stretch overflow-hidden">
                  <div className="absolute inset-0 overflow-hidden bg-gradient-to-b from-white to-white/75">
                    <Image
                      src={card.imageSrc}
                      alt={card.title}
                      fill
                      className="object-cover"
                    />
                    <div className="pointer-events-none absolute inset-y-0 left-0 w-[70%] bg-[linear-gradient(90deg,rgba(255,255,255,1)_0%,rgba(255,255,255,0.94)_24%,rgba(255,255,255,0.7)_56%,rgba(255,255,255,0)_100%)]" />
                  </div>
                </div>

                <div className="flex min-w-0 flex-1 flex-col justify-between p-4 pr-3">
                  <div>
                    <h3 className="text-[15px] leading-[1.15] font-bold break-words text-[#6C4735]">
                      {card.title}
                    </h3>
                    <p className="mt-1 text-[11px] leading-[1.45] break-words text-[#7D5A4D]">
                      {card.description}
                    </p>
                  </div>

                  <div
                    className={`mt-3 flex gap-1.5 ${card.title.includes("Produk Halal") ? "flex-wrap items-start justify-start overflow-visible" : "flex-nowrap overflow-hidden"}`}
                  >
                    {card.badges.map((badge) => (
                      <BadgePill
                        key={badge.label}
                        label={badge.label}
                        textClassName={badge.textClassName}
                        allowWrap={card.title.includes("Produk Halal")}
                      />
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-12 flex justify-center md:mt-12">
          <span className="inline-flex h-[24px] items-center justify-center rounded-full bg-[#FACBD8] px-3 py-1 font-['Quicksand'] text-[12px] leading-4 font-bold tracking-[0.6px] text-[#D5557E] uppercase">
            <span>💬 Real Stories</span>
          </span>
        </div>
        <h2 className="mt-3 text-center text-[24px] leading-[1.05] font-black text-[#6C4735] md:text-[34px] md:leading-[1.08]">
          Mama's Love Mamabear
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {storyCards.map((story) => (
            <article
              key={story.name}
              className="rounded-[20px] border border-[#F0C7D5] bg-white p-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#D5557E] text-[13px] font-bold text-white">
                  {story.initials}
                </div>
                <div className="flex flex-col">
                  <p className="text-[14px] leading-tight font-semibold text-[#6C4735]">
                    {story.name}
                  </p>
                  <p className="text-[12px] text-[#9B7A6A]">{story.city}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-0.5" aria-hidden>
                {Array.from({ length: story.rating }).map((_, i) => (
                  <svg
                    key={i}
                    className="h-2.5 w-2.5 sm:h-3 sm:w-3"
                    viewBox="0 0 24 24"
                    fill="#F4A300"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path d="M12 .587l3.668 7.431L23.5 9.748l-5.75 5.602L19.335 24 12 20.201 4.665 24l1.585-8.65L.5 9.748l7.832-1.73L12 .587z" />
                  </svg>
                ))}
                <span className="sr-only">{story.rating} dari 5 bintang</span>
              </div>
              <p className="mt-2 text-[13px] leading-[20px] text-[#7B6155]">
                {story.quote}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {story.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-[#FACBD8] px-3 py-1 text-[11px] font-bold text-[#D5557E]"
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
