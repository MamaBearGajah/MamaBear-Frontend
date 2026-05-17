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
      <div className="mx-auto w-full max-w-[1280px] px-0">
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
                <p className="mt-2 max-w-[220px] text-[13px] leading-5 text-[#8D6B5B]">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mx-auto mt-24 max-w-[920px] text-center">
          <h2 className="text-[34px] leading-[1.15] font-black text-[#6C4735] md:text-[42px]">
            Dapatkan Promo & Tips
            <br />
            Menyusui untuk Mama
          </h2>
          <p className="mx-auto mt-6 max-w-[760px] text-[18px] leading-8 text-[#8D6B5B]">
            Daftar promo dan nikmati info promo, produk baru, serta tips ringan
            seputar menyusui.
          </p>

          <form className="mx-auto mt-12 flex max-w-[820px] flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
            <label className="sr-only" htmlFor="subscribe-email">
              Email Address
            </label>
            <input
              id="subscribe-email"
              type="email"
              placeholder="Enter Email Address"
              className="h-[62px] w-full rounded-full border-2 border-[#F2D9E0] bg-white px-6 text-[16px] text-[#6C4735] outline-none placeholder:text-[#B49A90] focus:border-[#D5557E] sm:max-w-[520px]"
            />
            <button
              type="submit"
              className="inline-flex h-[62px] items-center justify-center rounded-full bg-[#D5557E] px-8 text-[16px] font-semibold text-white transition hover:opacity-90"
            >
              Daftar Sekarang
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
