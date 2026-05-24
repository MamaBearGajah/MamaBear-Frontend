import { Gift, Package, ShoppingBag, MessageCircle, Truck } from "lucide-react";

const benefits = [
  {
    icon: Gift,
    title: "Voucher & Promo Spesial",
    description: "Belanja lebih hemat untuk Mama.",
  },
  {
    icon: Package,
    title: "Paket Bundle Hemat",
    description: "Stok produk favorit jadi lebih praktis.",
  },
  {
    icon: ShoppingBag,
    title: "Belanja Mudah",
    description: "Checkout cepat dan aman.",
  },
  {
    icon: MessageCircle,
    title: "Konsultasi Gratis",
    description: "Bantu Mama pilih produk yang sesuai.",
  },
  {
    icon: Truck,
    title: "Pengiriman Cepat",
    description: "Dikirim ke berbagai wilayah Indonesia.",
  },
];

export default function SubscribeSection() {
  return (
    <section className="w-full bg-white py-10 md:py-14">
      {/* Desktop layout (keep unchanged) */}
      <div className="hidden w-full px-0 md:block">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-5">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <div
                key={benefit.title}
                className="flex flex-col items-center text-center"
              >
                <div className="flex h-[72px] w-[72px] items-center justify-center rounded-[18px] bg-[#FFF2F6]">
                  <Icon
                    size={28}
                    strokeWidth={1.8}
                    className="text-[#D5557E]"
                  />
                </div>
                <h3 className="mt-4 text-[16px] font-bold text-[#6C4735]">
                  {benefit.title}
                </h3>
                <p className="mt-2 max-w-[220px] text-[12px] leading-5 whitespace-normal text-[#8D6B5B] md:whitespace-nowrap">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mx-auto mt-32 max-w-[1280px] px-3 text-center md:px-[3cm]">
          <h2 className="text-[34px] leading-[1.15] font-black text-[#6C4735] md:text-[42px]">
            Dapatkan Promo & Tips
            <br />
            Menyusui untuk Mama
          </h2>
          <p className="mx-auto mt-6 max-w-[760px] text-[18px] leading-8 text-[#8D6B5B] md:max-w-none md:whitespace-nowrap">
            Daftar promo dan nikmati info promo, produk baru, serta tips ringan
            seputar menyusui.
          </p>

          <form
            className="mx-auto mt-12 flex max-w-[1160px] flex-col gap-4 px-3 md:flex-row md:items-center md:justify-center md:px-0"
            suppressHydrationWarning
          >
            <label className="sr-only" htmlFor="subscribe-email">
              Email Address
            </label>
            <input
              id="subscribe-email"
              type="email"
              placeholder="Enter Email Address"
              className="h-[62px] w-full min-w-0 flex-1 rounded-full border-2 border-[#F2D9E0] bg-white px-6 text-[16px] text-[#6C4735] outline-none placeholder:text-[#B49A90] focus:border-[#D5557E] md:w-auto md:max-w-[1200px]"
            />
            <button
              type="submit"
              className="inline-flex h-[62px] shrink-0 items-center justify-center rounded-full bg-[#D5557E] px-6 text-[16px] font-semibold whitespace-nowrap text-white transition hover:opacity-90 md:ml-4"
            >
              Daftar Sekarang
            </button>
          </form>
        </div>
      </div>

      {/* MOBILE-ONLY: stacked benefits + subscribe form with horizontal padding */}
      <div className="w-full px-0 md:hidden">
        <div className="grid grid-cols-2 gap-4">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div
                key={benefit.title}
                className="flex flex-col items-center text-center"
              >
                <div className="flex h-[56px] w-[56px] items-center justify-center rounded-[16px] bg-[#FFF2F6]">
                  <Icon
                    size={24}
                    strokeWidth={1.8}
                    className="text-[#D5557E]"
                  />
                </div>
                <h3 className="mt-3 text-[14px] font-bold text-[#6C4735]">
                  {benefit.title}
                </h3>
                <p className="mt-1 text-[12px] text-[#8D6B5B]">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-20 text-center">
          <h2 className="text-[22px] font-black text-[#6C4735]">
            Dapatkan Promo & Tips Menyusui untuk Mama
          </h2>
          <p className="mt-3 text-[14px] text-[#8D6B5B]">
            Daftar promo dan nikmati info promo, produk baru, serta tips ringan
            seputar menyusui.
          </p>

          <form
            className="mx-auto mt-4 flex max-w-[720px] flex-col gap-3 px-0"
            suppressHydrationWarning
          >
            <label className="sr-only" htmlFor="subscribe-email-mobile">
              Email Address
            </label>
            <input
              id="subscribe-email-mobile"
              type="email"
              placeholder="Enter Email Address"
              className="h-[52px] w-full rounded-full border-2 border-[#F2D9E0] bg-white px-4 text-[14px] text-[#6C4735] outline-none placeholder:text-[#B49A90]"
            />
            <button
              type="submit"
              className="inline-flex h-[52px] items-center justify-center rounded-full bg-[#D5557E] px-4 text-[14px] font-semibold text-white"
            >
              Daftar Sekarang
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
