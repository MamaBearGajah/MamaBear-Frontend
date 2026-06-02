"use client";

import { Product } from "@/types";

const Top5Bestseller = ({
  product,
  productId,
}: {
  product: Product[];
  productId: string;
}) => {

  const top5Bestsellers = [...product]
    .sort((a, b) => b.soldCount - a.soldCount)
    .slice(0, 5);

  const isBestSeller = top5Bestsellers.some(
    (item) => item.id === productId
  );

  if (!isBestSeller) return null;

  return (
    <span className='bg-pink-300 text-[var(--mamabear-dark-pink)] rounded-full md:pl-4 md:pr-4 pl-5 pr-5 pt-2 pb-2 ml-4'>
      🏆 Bestseller
    </span>
  );
};

export default Top5Bestseller;