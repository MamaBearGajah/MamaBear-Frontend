"use client"

import { useState, useEffect } from "react";
import { getProductId } from "../../../server";
import { mockProducts } from "../../lib/MockProducts";
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
} from "@/components/ui/breadcrumb"

export default function ProductCard({
  productId, product, productVariant, isTop5BestsellerFlag
}: {
  productId: string;
  product: Product;
  productVariant: ProductVariant[];
  isTop5BestsellerFlag: boolean;
})  {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [variantSelectedImage, setvariantSelectedImage] = useState<string | null>(null);
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
          initialVariant = productVariantData.find((variant) => variant.id === parsed.id) ?? null;
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
      setThePrice(Number(initialVariant.discountPrice ?? initialVariant.basePrice));
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

  // const imageArray = mockProducts[0].images.map((item) => item.imageUrl)
  const imageArray = product.images.map((item) => item.imageUrl)
  const fetchedProduct = product;
  const productName = product.name;
  const productCategory = product?.category?.name ?? "No Category";
  const productDescription = product.description;
  // const productImageArray = product.images.map((item) => item.imageUrl) ?? [];
  const productStock = product.stock; 
  const productWeight = product.weight;
  const productBasePrice = product.basePrice;
  const productDiscountPrice = product.discountPrice;
  // console.log("ProductVariant", productVariant)
  function NotVariantPrice(){
    setThePrice(Number(product.discountPrice));
  }
  return (
    <div>
        <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/product">Components</BreadcrumbLink>
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
          <br></br>
          <hr></hr>
          <br></br>

    <div className="md:flex md:items-start rounded transition-transform duration-200">

        <div className='md:w-[35%]'>
            <ProductCarousel images={imageArray} variantselectedimage={variantSelectedImage} setvariantselectedimage={setvariantSelectedImage} NotVariantPrice={NotVariantPrice}/>
        </div>
        <div className='p-2 md:pl-10 rounded-md w-[90%] md:w-[60%] flex flex-col gap-2'>
            <h4 className='text-xs text-[var(--mamabear-dark-pink)]'>{productCategory}</h4>
            <h2 className='text-2xl font-bold'>{productName}</h2>
            <div className='flex justify-start items-center'> 
              <Stars rating={mockProducts[0].rating}/>
              <div className='ml-2 mr-2 md:ml-6 md:mr-6 md:block hidden'>(284 reviews)</div>
              {isTop5BestsellerFlag ? 
                (<span className='bg-pink-300 text-[var(--mamabear-dark-pink)] rounded-full md:pl-4 md:pr-4 pl-5 pr-5 pt-2 pb-2 ml-4'>🏆Bestseller</span>) 
                : null
              }
              </div>
            <div className='flex items-end justify-start'>
              <p className='text-[var(--mamabear-dark-pink)] md:text-4xl text-2xl font-bold font-[var(--font-quicksand)]'>Rp {productDiscountPrice}</p>
              <p className='md:text-xl text-md ml-4 opacity-35'><s>Rp {theprice}</s></p>
              <div className='ml-4 pl-6 pr-6 pt-2 pb-2 font-bold rounded-full text-sm md:text-xl bg-[var(--mamabear-dark-pink)] text-[var(--mamabear-light-pink)]'>
                Save {(((productBasePrice - productDiscountPrice) / productBasePrice) * 100).toFixed(0)}%
              </div>
            </div>
            <p>{productStock ? 
                (
                  <span className="flex items-center gap-1">
                    <img className="w-[20px]" src="/check.svg" alt="check" />
                    In Stock
                  </span>
                ) :
                (
                  <span className="flex items-center gap-1">
                    <img className="w-[20px]" src="/cross.svg" alt="cross" />
                    Not Available
                  </span>
                )
              }
            </p>
            <p className='mt-2 mb-2 text-sm text-gray-500'>{productDescription}</p>
            <p><span className='text-[var(--mamabear-dark-pink)] font-bold'>{productVariantData[0].name}</span></p>
            <div className='mt-3 mb-2'>
          {
            productVariantData.map((item) => {
              const isDisabled =
                item.stock === 0 || item.isActive === false;

              function variantSelected(item: ProductVariant) {
                if (isDisabled) return;
                setSelectedVariant(item);
                setThePrice(
                  Number(item.discountPrice ?? item.basePrice)
                );
                setvariantSelectedImage(
                  item.imageUrl ?? "/Logo Mamabear.png"
                );
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
                  className={`
                    rounded-full
                    md:px-8 px-4
                    py-2 md:py-4
                    mb-3 mt-3
                    border-2
                    whitespace-nowrap
                    transition-all duration-300

                    ${
                      selectedVariant?.id === item.id
                        ? "bg-[var(--mamabear-dark-pink)] text-white border-[var(--mamabear-dark-pink)]"
                        : "bg-white text-black border-gray-300"
                    }

                    ${
                      isDisabled
                        ? "opacity-40 line-through cursor-not-allowed"
                        : "cursor-pointer hover:shadow-lg hover:scale-105"
                    }
                  `}
                >
                  {item.value}

                  {item.stock === 0 && (
                    <span className="ml-2 text-xs">
                      (Out of Stock)
                    </span>
                  )}
                </button>
              );
            })}
              <br></br><br></br>
              <KeyBenefit weight={productWeight}/>
            </div>

            {/* <AddToCartQuantity price={Number(productDiscountPrice)} product={fetchedProduct}/> */}
            
            <AddToCartQuantity price={theprice} product={fetchedProduct} variant={selectedVariant}/>
            <div>
              <StructuredSnippet/>
            </div>
            <div>
              <ShareThisProduct/>
            </div>
        </div>

    </div>
    </div>
  );
}
