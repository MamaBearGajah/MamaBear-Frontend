"use client";
import { useState, useEffect } from "react";
import { useCart } from "@/hooks/useCart";
import { CartItem } from "@/types/index";
import { ShoppingCart } from "lucide-react";
import { Product } from "@/types/index";
import { nanoid } from "nanoid";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
const AddToCartMobile = ({
  productId,
  product,
}: {
  productId: string;
  product: Product;
}) => {
  const { addItem } = useCart();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [variants, setVariants] = useState<any[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<{
    id: string;
    name?: string;
    value?: string;
  } | null>(null);

  const updateSelectedVariantFromStorage = () => {
    try {
      const stored = localStorage.getItem(`selectedVariant:${productId}`);
      if (!stored) {
        setSelectedVariant(null);
        return;
      }

      try {
        const parsed = JSON.parse(stored);
        if (parsed?.id) {
          setSelectedVariant({
            id: parsed.id,
            name: parsed.name,
            value: parsed.value,
          });
          return;
        }
      } catch {
        // malformed JSON, fall back to raw value
      }

      setSelectedVariant({ id: stored });
    } catch {
      // ignore localStorage access errors
    }
  };

  useEffect(() => {
    const fetchVariants = async () => {
      try {
        const res = await fetch(`/api/products/${productId}/variants`);
        if (!res.ok) return;
        const data = await res.json();
        setVariants(Array.isArray(data) ? data : (data?.variants ?? []));
      } catch (e) {
        // ignore fetch errors
      }
    };

    const handleVariantSelected = (event: Event) => {
      const customEvent = event as CustomEvent<{
        id: string;
        name?: string;
        value?: string;
      }>;
      const detail = customEvent.detail;
      if (detail?.id) {
        setSelectedVariant({
          id: detail.id,
          name: detail.name,
          value: detail.value,
        });
      }
    };

    updateSelectedVariantFromStorage();
    window.addEventListener("storage", updateSelectedVariantFromStorage);
    window.addEventListener("mamabear-selected-variant", handleVariantSelected);
    fetchVariants();

    return () => {
      window.removeEventListener("storage", updateSelectedVariantFromStorage);
      window.removeEventListener(
        "mamabear-selected-variant",
        handleVariantSelected
      );
    };
  }, [productId]);

  const activeVariant =
    variants.find((item) => item.id === selectedVariant?.id) ?? null;
  const activePrice = Number(
    activeVariant?.discountPrice ??
      activeVariant?.basePrice ??
      product.discountPrice ??
      product.basePrice
  );
  const totalPrice = quantity * activePrice;

  const formatPrice = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);

  const handleCheckout = () => {
    if (!selectedVariant) {
      toast.error(
        "Please choose a product variant on the product page before adding to cart."
      );
      return;
    }

    const variant = variants.find((x) => x.id === selectedVariant.id) ?? null;
    const label =
      variant?.name && variant?.value
        ? `${variant.name}: ${variant.value}`
        : selectedVariant.name && selectedVariant.value
          ? `${selectedVariant.name}: ${selectedVariant.value}`
          : (selectedVariant.name ?? selectedVariant.value ?? "Variant");

    addItem({
      id: nanoid(),
      productId: product.id,
      variantId: variant?.id ?? selectedVariant.id,
      variantName: variant?.name ?? selectedVariant.name,
      variantValue: variant?.value ?? selectedVariant.value,
      variantLabel: label,
      name: product.name,
      basePrice: Number(variant?.basePrice ?? product.basePrice),
      discountPrice: variant?.discountPrice
        ? Number(variant.discountPrice)
        : product.discountPrice
          ? Number(product.discountPrice)
          : undefined,
      image:
        variant?.imageUrl ??
        product.images?.[0]?.imageUrl ??
        "/Logo Mamabear.png",
      quantity: quantity,
    } as CartItem);
    toast.success("Item added to cart");
    router.push("/checkout/info");
  };

  return (
    <div className="fixed right-0 bottom-0 left-0 z-50 border-t border-pink-100 bg-white/98 shadow-[0_-10px_30px_rgba(213,85,126,0.12)] backdrop-blur md:hidden">
      <div className="grid grid-cols-[1.15fr_1fr_auto] items-stretch">
        <button
          type="button"
          onClick={() => quantity > 1 && setQuantity(quantity - 1)}
          className="flex min-h-[84px] items-center justify-center border-r border-[var(--mamabear-light-pink)] bg-white px-3"
        >
          <div className="flex items-center gap-2 rounded-full border border-[var(--mamabear-light-pink)] bg-[var(--mamabear-light-pink)]/35 px-3 py-2 text-[var(--mamabear-dark-pink)]">
            <button
              type="button"
              onClick={() => quantity > 1 && setQuantity(quantity - 1)}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-lg font-bold shadow-sm transition hover:bg-pink-50"
            >
              -
            </button>
            <span className="min-w-6 text-center text-sm font-bold">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-lg font-bold shadow-sm transition hover:bg-pink-50"
            >
              +
            </button>
          </div>
        </button>

        <button
          type="button"
          onClick={handleCheckout}
          disabled={!selectedVariant}
          className={`flex min-h-[84px] flex-col items-center justify-center gap-1 px-3 text-white transition active:scale-[0.99] ${
            selectedVariant
              ? "bg-[var(--mamabear-brown)] hover:opacity-95"
              : "cursor-not-allowed bg-[var(--mamabear-brown)] opacity-50"
          }`}
        >
          <ShoppingCart className="h-6 w-6" strokeWidth={2.2} />
          <span className="text-sm leading-tight font-medium">Add To Cart</span>
        </button>

        <button
          type="button"
          onClick={handleCheckout}
          disabled={!selectedVariant}
          className={`flex min-h-[84px] flex-col items-start justify-center gap-0.5 px-4 text-left text-white transition active:scale-[0.99] ${
            selectedVariant
              ? "bg-[var(--mamabear-dark-pink)] hover:opacity-95"
              : "cursor-not-allowed bg-[var(--mamabear-dark-pink)] opacity-50"
          }`}
        >
          <span className="text-sm leading-tight font-medium">Checkout</span>
          <span className="text-base leading-tight font-bold">
            {formatPrice(totalPrice)}
          </span>
        </button>
      </div>
    </div>
  );
};

export default AddToCartMobile;
