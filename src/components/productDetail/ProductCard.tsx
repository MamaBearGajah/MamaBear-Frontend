"use client";

import { useState, useEffect } from "react";
import ProductCarousel from "./ProductCarousel";
import AddToCartQuantity from "./AddToCartQuantity";
import { Product } from "@/types";
import Stars from "./Stars";
import StructuredSnippet from "./StructuredSnippet";
import { ProductVariant } from "@/types";
import ShareThisProduct from "./ShareThisProduct";
import KeyBenefit from "./KeyBenefit";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function ProductCard({
  productId,
  product,
  productVariant,
  isTop5BestsellerFlag,
}: {
  productId: string;
  product: Product;
  productVariant: ProductVariant[];
  isTop5BestsellerFlag: boolean;
}) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null
  );
  const [variantSelectedImage, setvariantSelectedImage] = useState<
    string | null
  >(null);
  const [theprice, setThePrice] = useState<number>(Number(product.basePrice));
  const productVariantData = productVariant;

  useEffect(() => {
    if (!productVariantData || productVariantData.length === 0) {
      return;
    }

    const saveVariant = (variant: ProductVariant) => {
      try {
        localStorage.setItem(
          `selectedVariant:${productId}`,
          JSON.stringify({
            id: variant.id,
            name: variant.name,
            value: variant.value,
          })
        );
      } catch {
        // ignore localStorage failures
      }
    };

    const stored = localStorage.getItem(`selectedVariant:${productId}`);
    let initialVariant: ProductVariant | null = null;

    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed?.id) {
          initialVariant =
            productVariantData.find((variant) => variant.id === parsed.id) ??
            null;
        }
      } catch {
        // malformed JSON
      }
    }

    if (!initialVariant) {
      initialVariant = productVariantData[0];
    }

    if (initialVariant) {
      setSelectedVariant(initialVariant);
      console.log("selected variant", selectedVariant);
      setThePrice(
        Number(initialVariant.discountPrice ?? initialVariant.basePrice)
      );
      setvariantSelectedImage(initialVariant.imageUrl ?? "/Logo Mamabear.png");
      saveVariant(initialVariant);

      window.dispatchEvent(
        new CustomEvent("mamabear-selected-variant", {
          detail: {
            id: initialVariant.id,
            name: initialVariant.name,
            value: initialVariant.value,
          },
        })
      );
    }
  }, [productId, productVariantData]);

  const imageArray = product.images.map((item) => item.imageUrl);
  const fetchedProduct = product;
  const productName = product.name;
  const productCategory = product?.category?.name ?? "No Category";
  const productStock = product.stock;
  const productWeight = product.weight;
  const productBasePrice = product.basePrice;
  const productDiscountPrice = product.discountPrice;
  const discountPercent = Number(
    (
      ((productBasePrice - productDiscountPrice) / productBasePrice) *
      100
    ).toFixed(0)
  );
  function NotVariantPrice() {
    setThePrice(Number(product.discountPrice));
  }
  return (
    <div>
      <Breadcrumb>
        <BreadcrumbList className="gap-x-1 gap-y-1 text-[11px] leading-tight sm:text-sm">
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/products">Products</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{productCategory}</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{productName}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="my-4 h-px w-full bg-pink-200/70" />

      <div className="rounded transition-transform duration-200 md:flex md:items-start">
        <div className="w-full md:w-[35%]">
          <ProductCarousel
            productId={productId}
            images={imageArray}
            variantselectedimage={variantSelectedImage}
            setvariantselectedimage={setvariantSelectedImage}
            NotVariantPrice={NotVariantPrice}
            discountPercent={discountPercent}
          />
        </div>
        <div className="flex w-full flex-col gap-2 py-2 md:w-[60%] md:pl-10">
          <h4 className="text-dark-pink text-xs">{productCategory}</h4>
          <h2 className="text-xl font-bold md:text-3xl">{productName}</h2>
          <div className="flex items-center justify-start">
            <Stars rating={product.avgRating ?? 0} />
            <div className="mr-2 ml-2 hidden md:mr-6 md:ml-6 md:block">
              ({product.reviewCount ?? 0} reviews)
            </div>
            {isTop5BestsellerFlag ? (
              <span className="ml-3 rounded-full bg-pink-300 px-3 py-1 text-sm text-[var(--mamabear-dark-pink)] md:px-4 md:py-2 md:text-sm">
                🏆Bestseller
              </span>
            ) : null}
          </div>
          <div className="flex items-end justify-start">
            <p className="text-2xl font-[var(--font-quicksand)] font-bold text-[var(--mamabear-dark-pink)] md:text-3xl">
              Rp {productDiscountPrice}
            </p>
            <p className="ml-3 text-base opacity-35 md:text-lg">
              <s>Rp {theprice}</s>
            </p>
            <div className="ml-3 rounded-full bg-[var(--mamabear-dark-pink)] px-4 py-1.5 text-sm font-bold whitespace-nowrap text-[var(--mamabear-light-pink)] md:px-4 md:py-2 md:text-sm">
              Save{" "}
              {(
                ((productBasePrice - productDiscountPrice) / productBasePrice) *
                100
              ).toFixed(0)}
              %
            </div>
          </div>
          <p>
            {productStock ? (
              <span className="flex items-center gap-1 text-sm md:text-sm">
                <img className="w-[20px]" src="/check.svg" alt="check" />
                In Stock
              </span>
            ) : (
              <span className="flex items-center gap-1 text-sm md:text-sm">
                <img className="w-[20px]" src="/cross.svg" alt="cross" />
                Not Available
              </span>
            )}
          </p>
          <p className="mt-6 md:mt-10">
            <span className="text-sm font-bold text-[var(--mamabear-dark-pink)] md:text-lg">
              {productVariantData[0].name}
            </span>
          </p>
          <div className="mb-0">
            {productVariantData.map((item) => {
              const isDisabled = item.stock === 0 || item.isActive === false;
              function variantSelected(item: ProductVariant) {
                if (isDisabled) return;
                setSelectedVariant(item);
                setThePrice(Number(item.discountPrice ?? item.basePrice));
                setvariantSelectedImage(item.imageUrl ?? "/Logo Mamabear.png");
                try {
                  localStorage.setItem(
                    `selectedVariant:${productId}`,
                    JSON.stringify({
                      id: item.id,
                      name: item.name,
                      value: item.value,
                    })
                  );
                  window.dispatchEvent(
                    new CustomEvent("mamabear-selected-variant", {
                      detail: {
                        id: item.id,
                        name: item.name,
                        value: item.value,
                      },
                    })
                  );
                } catch {}
              }

              return (
                <button
                  key={item.value}
                  onClick={() => variantSelected(item)}
                  disabled={isDisabled}
                  className={`mt-1 mb-1 rounded-full border-2 px-3 py-1 text-sm whitespace-nowrap transition-all duration-300 md:mt-3 md:mb-3 md:px-5 md:py-2 md:text-base ${
                    selectedVariant?.id === item.id
                      ? "border-[var(--mamabear-dark-pink)] bg-[var(--mamabear-dark-pink)] text-white"
                      : "border-gray-300 bg-white text-black"
                  } ${
                    isDisabled
                      ? "cursor-not-allowed line-through opacity-40"
                      : "cursor-pointer hover:scale-105 hover:shadow-lg"
                  } `}
                >
                  {item.value}

                  {item.stock === 0 && (
                    <span className="ml-2 text-xs">(Out of Stock)</span>
                  )}
                </button>
              );
            })}
            <br></br>
            <br></br>
            <KeyBenefit productWeight={productWeight} />
          </div>
          <div className="hidden md:block">
            <AddToCartQuantity
              price={theprice}
              product={fetchedProduct}
              variant={selectedVariant}
            />
          </div>
          <div>
            <StructuredSnippet />
          </div>
          <div>
            <ShareThisProduct />
          </div>
        </div>
      </div>
    </div>
  );
}
