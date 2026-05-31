"use client"
import {useState, useEffect, React} from 'react';
import Link from "next/link";
import {useCart} from "@/hooks/useCart";
import { CartItem } from "@/types/index";
import {Product} from "@/types/index";
import { nanoid } from 'nanoid';
import { toast } from 'sonner';
const AddToCartMobile = ({ productId, product }: { productId: string; product: Product }) => {
  const { addItem } = useCart();
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
        setVariants(Array.isArray(data) ? data : data?.variants ?? []);
      } catch (e) {
        // ignore fetch errors
      }
    };

    const handleVariantSelected = (event: Event) => {
      const customEvent = event as CustomEvent<{ id: string; name?: string; value?: string }>;
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
      window.removeEventListener("mamabear-selected-variant", handleVariantSelected);
    };
  }, [productId]);
  return (
    <div className="flex justify-between items-center md:hidden fixed bottom-0 left-0 right-0 bg-dark-pink p-4 border-t shadow-md cursor-pointer gap-2 z-50 transition duration-300">
      <div className='flex items-center gap-2'>
        <span onClick={() => quantity > 1 && setQuantity(quantity - 1)}>-</span>
        <span className='font-bold bg-white text-black p-3 rounded-full'>{quantity}</span>
        <span onClick={() => setQuantity(quantity + 1)}>+</span>
      </div>

      <div className="flex-1 px-2">
        <div className="mb-2 text-sm text-white">
          {selectedVariant ? (
            <span>
              Selected variant: {selectedVariant.name && selectedVariant.value ? `${selectedVariant.name}: ${selectedVariant.value}` : selectedVariant.name ?? selectedVariant.value}
            </span>
          ) : (
            <span>Please choose a variant from the product page first.</span>
          )}
        </div>

        <button
          onClick={() => {
            if (!selectedVariant) {
              toast.error('Please choose a product variant on the product page before adding to cart.');
              return;
            }

            const variant = variants.find((x) => x.id === selectedVariant.id) ?? null;
            const label = variant?.name && variant?.value
              ? `${variant.name}: ${variant.value}`
              : selectedVariant.name && selectedVariant.value
              ? `${selectedVariant.name}: ${selectedVariant.value}`
              : selectedVariant.name ?? selectedVariant.value ?? 'Variant';

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
              image: variant?.imageUrl ?? (product.images?.[0]?.imageUrl ?? '/Logo Mamabear.png'),
              quantity: quantity,
            } as CartItem);
            toast.success('Item added to cart');
          }}
          disabled={!selectedVariant}
          className={`text-white transition duration-300 flex items-center gap-1 ${!selectedVariant ? 'opacity-50 cursor-not-allowed' : 'hover:underline cursor-pointer'}`}
        >
          <img src='/cart.svg' className='w-[20px] h-[20px]' alt="Add to Cart" />
          Add To Cart
        </button>
      </div>
      <Link href="#"><h2 className='text-white hover:underline transition duration-300'>Checkout</h2></Link>
    </div>
  );
};

export default AddToCartMobile;