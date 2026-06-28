import ProductCard from "./ProductCard";
import { Product } from "@/types";
import { ProductVariant } from "@/types";
// import ProductModal from "./ProductModal"

export default async function ProductSection({
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
  return (
    <div className="flex flex-col justify-center pt-5">
      <ProductCard
        productId={productId}
        product={product}
        productVariant={productVariant}
        isTop5BestsellerFlag={isTop5BestsellerFlag}
      />
      {/* <ProductModal/> */}
    </div>
  );
}
