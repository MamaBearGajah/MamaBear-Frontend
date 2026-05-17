export default function CategorySection() {
  const categories = [
    "Minuman",
    "Cookies",
    "Paket ASI",
    "Teh Pelancar",
    "Zoya Mix",
    "Kapsul",
  ];

  // gradient variants per card (deterministic for SSR)
  const gradientClasses = [
    "bg-gradient-to-r from-[#FACBD8] to-[#D86D88]",
    "bg-gradient-to-l from-[#D86D88] to-white",
    "bg-gradient-to-br from-[#D86D88] to-white",
    "bg-gradient-to-tl from-[#FACBD8] to-[#D86D88]",
    "bg-gradient-to-tr from-[#D86D88] to-[#FACBD8]",
    "bg-gradient-to-bl from-[#FACBD8] to-white",
  ];

  const productCounts = [5, 3, 4, 3, 4, 3];

  return (
    <section className="w-full bg-white pt-16 pb-12 md:pt-20 md:pb-5">
      <div className="mx-auto w-full max-w-[1280px] px-0">
        <div className="mx-auto max-w-[760px] text-center">
          <span className="inline-flex h-[24px] w-[154.09375px] items-center justify-center rounded-full bg-[#FACBD8] px-3 py-1 font-['Quicksand'] text-[12px] leading-4 font-bold tracking-[0.6px] text-[#D5557E] uppercase">
            Shop by Category
          </span>
          <h2 className="mx-auto mt-4 h-[36px] w-[474px] max-w-full text-center font-['Quicksand'] text-[36px] leading-[36px] font-black tracking-[0px] text-[#6C4735]">
            Apa Favorit Mama Hari Ini?
          </h2>
          <p className="mx-auto mt-3 h-[40px] w-[448px] max-w-full text-center font-['Quicksand'] text-[14px] leading-[20px] font-normal tracking-[0px] text-[#8D6B5B]">
            Mulai dari minuman hangat sampai camilan praktis, semua bisa jadi
            teman menyusui Mama.
          </p>
        </div>

        <div className="mt-10">
          <div className="mx-auto flex h-[220px] w-full items-stretch justify-between overflow-x-auto">
            {categories.map((category, index) => {
              const gradient = gradientClasses[index % gradientClasses.length];
              const count = productCounts[index] ?? 0;

              return (
                <div
                  key={category}
                  className="relative h-[220px] w-[200px] flex-shrink-0 overflow-hidden rounded-[16px] border border-[#D5557E]"
                >
                  <div className={`absolute inset-0 ${gradient}`} />

                  {/* Placeholder center content */}
                  <div className="relative z-10 flex h-full w-full items-center justify-center">
                    <div className="px-2 text-center">
                      <div className="mb-2 text-sm font-semibold text-white/90">
                        Placeholder
                      </div>
                    </div>
                  </div>
                  {/* Bottom overlay for title and product count */}
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-center">
                    <div className="w-full bg-gradient-to-t from-black/75 via-black/45 to-transparent py-3 text-center">
                      <div className="text-sm font-semibold text-white">
                        {category}
                      </div>
                      <div className="mt-1 text-[11px] text-white/80">
                        {count} products
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
