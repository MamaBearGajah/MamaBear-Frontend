export default function PromotionLandingPage() {
  return (
    <main className="min-h-screen bg-pink-50 text-gray-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-pink-200 via-rose-100 to-pink-50">
        <div className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block bg-rose-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md mb-5">
              Mother’s Day Special • 1 - 31 May
            </span>

            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
              Celebrate Mom With The Perfect <span className="text-rose-500">All-In-One Bundle Hamper</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl">
              Surprise your loved ones with our beautifully curated Mother’s Day hamper bundle. Enjoy premium goodies, elegant packaging, and heartfelt gifting — all for only <span className="font-bold text-rose-500">Rp 200.000</span>.
            </p>

            <div className="flex flex-wrap gap-4 mb-8">
              <button className="px-8 py-4 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold text-lg shadow-lg transition-transform hover:-translate-y-1">
                Add To Cart
              </button>

              <button className="px-8 py-4 rounded-full border-2 border-rose-400 text-rose-500 hover:bg-rose-100 font-bold text-lg transition">
                Purchase Now
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="bg-white rounded-2xl px-5 py-4 shadow-md">
                <p className="font-bold text-lg">🚚 Free Shipping</p>
                <p className="text-gray-600 text-sm">
                  For orders above Rp 200.000
                </p>
              </div>

              <div className="bg-white rounded-2xl px-5 py-4 shadow-md">
                <p className="font-bold text-lg">🎁 Limited Promotion</p>
                <p className="text-gray-600 text-sm">
                  Valid from 1 - 31 May only
                </p>
              </div>
            </div>
          </div>

          {/* Hero Image Placeholder */}
          <div className="relative flex justify-center">
            <div className="absolute -top-8 -left-8 w-40 h-40 bg-pink-300 rounded-full blur-3xl opacity-40"></div>
            <div className="absolute bottom-0 right-0 w-56 h-56 bg-rose-300 rounded-full blur-3xl opacity-40"></div>

            <div className="relative w-full max-w-lg h-[500px] rounded-[32px] border-4 border-dashed border-rose-300 bg-white shadow-2xl flex items-center justify-center overflow-hidden">
              <div className="text-center px-6">
                <p className="text-2xl font-bold text-rose-500 mb-2">
                  Hero Product Image
                </p>
                <p className="text-gray-500">
                  Replace this placeholder with your hamper image
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-extrabold mb-4">
            Why Moms Love This Bundle
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Carefully selected premium items packed beautifully to create the perfect gifting experience.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: 'Premium Quality',
              desc: 'High-quality curated items specially prepared for Mother’s Day.',
            },
            {
              title: 'Elegant Packaging',
              desc: 'Luxury hamper wrapping that makes every gift feel extra special.',
            },
            {
              title: 'Affordable Special Price',
              desc: 'Get the full all-in-one hamper bundle for only Rp 200.000.',
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all"
            >
              <div className="w-16 h-16 rounded-2xl bg-pink-100 flex items-center justify-center text-3xl mb-6">
                💖
              </div>
              <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Product Showcase */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
            <div>
              <h2 className="text-4xl font-extrabold mb-3">
                Mother’s Day Hamper Collection
              </h2>
              <p className="text-gray-600 text-lg">
                Placeholder product gallery for your hamper products.
              </p>
            </div>

            <button className="px-7 py-4 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold shadow-lg transition-transform hover:-translate-y-1">
              Shop Collection
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="rounded-3xl overflow-hidden bg-pink-50 shadow-lg hover:shadow-2xl transition"
              >
                <div className="h-72 border-b-2 border-dashed border-rose-300 flex items-center justify-center bg-white">
                  <div className="text-center px-4">
                    <p className="text-xl font-bold text-rose-500">
                      Product Image Placeholder
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                      Replace with actual product image
                    </p>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2">
                    Bundle Hamper {item}
                  </h3>
                  <p className="text-gray-600 mb-5">
                    Beautifully curated gift hamper package perfect for Mother’s Day gifting.
                  </p>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400 line-through">
                        Rp 350.000
                      </p>
                      <p className="text-3xl font-extrabold text-rose-500">
                        Rp 200.000
                      </p>
                    </div>

                    <button className="px-5 py-3 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-semibold transition">
                      Add To Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-rose-500 to-pink-500 rounded-[40px] p-12 text-white text-center shadow-2xl">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
            Make Mother’s Day Extra Special
          </h2>

          <p className="text-lg md:text-xl text-pink-100 mb-10 max-w-3xl mx-auto">
            Limited-time promotion from 1 - 31 May. Grab the all-in-one hamper bundle for only Rp 200.000 and enjoy free shipping on orders above Rp 200.000.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-8 py-4 rounded-full bg-white text-rose-500 font-bold text-lg shadow-lg hover:scale-105 transition-transform">
              Purchase Now
            </button>

            <button className="px-8 py-4 rounded-full border-2 border-white text-white font-bold text-lg hover:bg-white hover:text-rose-500 transition">
              Add To Cart
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-pink-100 py-8 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h3 className="text-2xl font-extrabold text-rose-500">
              YourBrand
            </h3>
            <p className="text-gray-500 mt-1">
              Mother’s Day Promotion • 1 - 31 May
            </p>
          </div>

          <div className="flex gap-4 text-sm text-gray-500">
            <a href="#" className="hover:text-rose-500 transition">
              Instagram
            </a>
            <a href="#" className="hover:text-rose-500 transition">
              TikTok
            </a>
            <a href="#" className="hover:text-rose-500 transition">
              Contact Us
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
