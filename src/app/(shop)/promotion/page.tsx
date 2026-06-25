"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useCart } from "@/hooks/useCart";
import { useCheckout } from "@/context/CheckoutContext";
import { bundleApi } from "@/lib/api/bundleHamper";
import { normalizeApiResponse } from "@/lib/api/normalize-api-response";
import { formatPrice } from "@/lib/utils";
import type { CartItem } from "@/types";

type BundleItem = {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  bundlePrice: number;
  discountPrice: number;
  isActive: boolean;
  stock: number;
  items: Array<{ productId: string; quantity: number }>;
};

function toNumber(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function mapBundle(raw: unknown): BundleItem {
  const row = (raw ?? {}) as Record<string, unknown>;
  const rawItems = Array.isArray(row.items) ? row.items : [];

  return {
    id: String(row.id ?? row.bundleId ?? ""),
    name: String(row.name ?? "Unnamed Bundle"),
    slug: String(row.slug ?? ""),
    description: String(row.description ?? ""),
    imageUrl: String(row.imageUrl ?? "/Logo Mamabear.png"),
    bundlePrice: toNumber(row.bundlePrice ?? row.bundle_price, 0),
    discountPrice: toNumber(row.discountPrice ?? row.discount_price, 0),
    isActive: Boolean(row.isActive ?? row.is_active ?? true),
    stock: toNumber(row.stock, 0),
    items: rawItems.map((item) => {
      const value = (item ?? {}) as Record<string, unknown>;
      return {
        productId: String(value.productId ?? value.product_id ?? ""),
        quantity: Math.max(1, toNumber(value.quantity ?? value.qty, 1)),
      };
    }),
  };
}

/**
 * Bangun satu CartItem yang mewakili bundle secara keseluruhan.
 * Harga yang digunakan adalah bundlePrice / discountPrice dari bundle,
 * bukan harga satuan per produk — ini memastikan diskon bundle terefleksi di cart.
 */
function buildBundleCartItem(bundle: BundleItem): CartItem {
  return {
    id: `bundle-${bundle.id}`,
    productId: bundle.id,
    quantity: 1,
    name: bundle.name,
    basePrice: bundle.bundlePrice,
    discountPrice: bundle.discountPrice || bundle.bundlePrice,
    image: bundle.imageUrl,
    variantLabel: "Bundle Hamper",
    categoryName: "Bundle",
  };
}

export default function PromotionLandingPage() {
  const router = useRouter();
  const { addItem } = useCart();
  const { postItems } = useCheckout();

  const [bundles, setBundles] = useState<BundleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const activeBundles = useMemo(
    () => bundles.filter((bundle) => bundle.isActive),
    [bundles],
  );

  const heroBundle = useMemo(() => {
    if (activeBundles.length === 0) return null;
    return [...activeBundles].sort(
      (left, right) => right.discountPrice - left.discountPrice,
    )[0];
  }, [activeBundles]);

  const collectionBundles = useMemo(() => {
    if (!heroBundle) return activeBundles;
    return activeBundles.filter((bundle) => bundle.id !== heroBundle.id);
  }, [activeBundles, heroBundle]);

  const fetchBundles = useCallback(async () => {
    setIsLoading(true);
    try {
      // FIX: gunakan bundleApi (nama baru) dan getAll() yang memanggil public endpoint
      const { data } = await bundleApi.getAll();
      const normalized = normalizeApiResponse<unknown>(data);
      const rows = Array.isArray(normalized.data) ? normalized.data : [];
      setBundles(rows.map(mapBundle).filter((bundle) => bundle.id));
    } catch (error) {
      console.error("Failed to fetch bundles", error);
      toast.error("Failed to load promotion bundles");
      setBundles([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchBundles();
  }, [fetchBundles]);

  /**
   * FIX: sebelumnya menambahkan tiap produk bundle ke cart secara terpisah
   * dengan harga 0, sehingga diskon bundle tidak terefleksi.
   *
   * Sekarang bundle diperlakukan sebagai satu item cart dengan bundlePrice/discountPrice,
   * konsisten dengan handlePurchaseNow yang sudah benar dari awal.
   */
  const handleAddBundleToCart = (bundle: BundleItem) => {
    if (bundle.stock <= 0) {
      toast.error("Stok bundle habis");
      return;
    }

    addItem(buildBundleCartItem(bundle));
    toast.success(`${bundle.name} ditambahkan ke keranjang`);
  };

  const handlePurchaseNow = (bundle: BundleItem) => {
    postItems([buildBundleCartItem(bundle)]);
    router.push("/checkout/info");
  };

  return (
    <main className="min-h-screen bg-pink-50 text-gray-800">
      <section className="relative overflow-hidden bg-gradient-to-br from-pink-200 via-rose-100 to-pink-50">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2">
          <div>
            <span className="mb-5 inline-block rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-md">
              Mother's Day Special • 1 - 31 May
            </span>

            <h1 className="mb-6 text-5xl leading-tight font-extrabold md:text-6xl">
              {heroBundle ? (
                <>
                  Celebrate Mom With <span className="text-rose-500">{heroBundle.name}</span>
                </>
              ) : (
                <>
                  Celebrate Mom With The Perfect{" "}
                  <span className="text-rose-500">All-In-One Bundle Hamper</span>
                </>
              )}
            </h1>

            <p className="mb-8 max-w-xl text-lg text-gray-600 md:text-xl">
              {heroBundle
                ? `${heroBundle.description} Enjoy premium goodies and heartfelt gifting for only ${formatPrice(heroBundle.discountPrice || heroBundle.bundlePrice)}.`
                : "Surprise your loved ones with our beautifully curated Mother's Day hamper bundle. Enjoy premium goodies and elegant packaging."}
            </p>

            <div className="mb-8 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() => heroBundle && handleAddBundleToCart(heroBundle)}
                disabled={!heroBundle || isLoading}
                className="rounded-full bg-rose-500 px-8 py-4 text-lg font-bold text-white shadow-lg transition-transform hover:-translate-y-1 hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Add To Cart
              </button>

              <button
                type="button"
                onClick={() => heroBundle && handlePurchaseNow(heroBundle)}
                disabled={!heroBundle || isLoading}
                className="rounded-full border-2 border-rose-400 px-8 py-4 text-lg font-bold text-rose-500 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Purchase Now
              </button>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="rounded-2xl bg-white px-5 py-4 shadow-md">
                <p className="text-lg font-bold">🚚 Free Shipping</p>
                <p className="text-sm text-gray-600">For orders above Rp 200.000</p>
              </div>

              <div className="rounded-2xl bg-white px-5 py-4 shadow-md">
                <p className="text-lg font-bold">🎁 Limited Promotion</p>
                <p className="text-sm text-gray-600">Valid while stock lasts</p>
              </div>
            </div>
          </div>

          <div className="relative flex justify-center">
            <div className="absolute -left-8 -top-8 h-40 w-40 rounded-full bg-pink-300 opacity-40 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-rose-300 opacity-40 blur-3xl" />

            <div className="relative flex h-[500px] w-full max-w-lg items-center justify-center overflow-hidden rounded-[32px] bg-white shadow-2xl">
              {heroBundle ? (
                <img
                  src={heroBundle.imageUrl}
                  alt={heroBundle.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="px-6 text-center">
                  <p className="mb-2 text-2xl font-bold text-rose-500">Bundle Coming Soon</p>
                  <p className="text-gray-500">No active promotion bundle available right now.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-14 text-center">
          <h2 className="mb-4 text-4xl font-extrabold">Why Moms Love This Bundle</h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Carefully selected premium items packed beautifully to create the perfect gifting experience.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              title: "Premium Quality",
              desc: "High-quality curated items specially prepared for Mother's Day.",
            },
            {
              title: "Elegant Packaging",
              desc: "Luxury hamper wrapping that makes every gift feel extra special.",
            },
            {
              title: "Affordable Special Price",
              desc: "Get the full all-in-one hamper bundle at a limited promo price.",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="rounded-3xl bg-white p-8 shadow-lg transition-all hover:shadow-2xl"
            >
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-pink-100 text-3xl">
                💖
              </div>
              <h3 className="mb-3 text-2xl font-bold">{item.title}</h3>
              <p className="leading-relaxed text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 flex flex-col items-center justify-between gap-6 md:flex-row">
            <div>
              <h2 className="mb-3 text-4xl font-extrabold">Our Hamper Collection</h2>
              <p className="text-lg text-gray-600">Explore our bundle hampers and choose your favorite gift.</p>
            </div>

            <button
              type="button"
              onClick={() => {
                const target = document.getElementById("bundle-collection");
                target?.scrollIntoView({ behavior: "smooth" });
              }}
              className="rounded-full bg-rose-500 px-7 py-4 font-bold text-white shadow-lg transition-transform hover:-translate-y-1 hover:bg-rose-600"
            >
              Shop Collection
            </button>
          </div>

          <div id="bundle-collection" className="grid gap-8 md:grid-cols-3">
            {isLoading ? (
              <p className="col-span-full py-10 text-center text-gray-500">Loading bundle collection...</p>
            ) : collectionBundles.length === 0 ? (
              <p className="col-span-full py-10 text-center text-gray-500">No additional bundles available right now.</p>
            ) : (
              collectionBundles.map((bundle) => (
                <div
                  key={bundle.id}
                  className="overflow-hidden rounded-3xl bg-pink-50 shadow-lg transition hover:shadow-2xl"
                >
                  <div className="h-72 bg-white">
                    <img
                      src={bundle.imageUrl}
                      alt={bundle.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="p-6">
                    <h3 className="mb-2 text-2xl font-bold">{bundle.name}</h3>
                    <p className="mb-5 line-clamp-2 text-gray-600">{bundle.description}</p>

                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm text-gray-400 line-through">
                          {formatPrice(bundle.bundlePrice)}
                        </p>
                        <p className="text-3xl font-extrabold text-rose-500">
                          {formatPrice(bundle.discountPrice || bundle.bundlePrice)}
                        </p>
                      </div>

                      <div className="flex flex-col gap-2">
                        <button
                          type="button"
                          onClick={() => handleAddBundleToCart(bundle)}
                          className="rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-600"
                        >
                          Add To Cart
                        </button>
                        <button
                          type="button"
                          onClick={() => handlePurchaseNow(bundle)}
                          className="rounded-full border border-rose-400 px-4 py-2 text-sm font-semibold text-rose-500 transition hover:bg-rose-100"
                        >
                          Purchase Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto max-w-5xl rounded-[40px] bg-gradient-to-r from-rose-500 to-pink-500 p-12 text-center text-white shadow-2xl">
          <h2 className="mb-6 text-4xl font-extrabold md:text-5xl">Make Your Day Extra Special</h2>

          <p className="mx-auto mb-10 max-w-3xl text-lg text-pink-100 md:text-xl">
            Grab the all-in-one hamper bundle now and share your appreciation with a meaningful gift.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <button
              type="button"
              onClick={() => heroBundle && handlePurchaseNow(heroBundle)}
              disabled={!heroBundle}
              className="rounded-full bg-white px-8 py-4 text-lg font-bold text-rose-500 shadow-lg transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Purchase Now
            </button>

            <button
              type="button"
              onClick={() => heroBundle && handleAddBundleToCart(heroBundle)}
              disabled={!heroBundle}
              className="rounded-full border-2 border-white px-8 py-4 text-lg font-bold text-white transition hover:bg-white hover:text-rose-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Add To Cart
            </button>
          </div>
        </div>
      </section>

      <footer className="border-t border-pink-100 bg-white py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 md:flex-row">
          <div>
            <h3 className="text-2xl font-extrabold text-rose-500">MamaBear</h3>
            <p className="mt-1 text-gray-500">Mother's Day Promotion</p>
          </div>

          <div className="flex gap-4 text-sm text-gray-500">
            <a href="#" className="transition hover:text-rose-500">Instagram</a>
            <a href="#" className="transition hover:text-rose-500">TikTok</a>
            <a href="#" className="transition hover:text-rose-500">Contact Us</a>
          </div>
        </div>
      </footer>
    </main>
  );
}