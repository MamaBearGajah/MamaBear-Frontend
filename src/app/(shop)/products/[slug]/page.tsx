import ProductSection from "@/components/productDetail/ProductSection";
import ReviewSection from "@/components/productDetail/ReviewSection";
import { Metadata } from "next";
import {fetchProductSlug2, getProductVariantById} from "../../../../lib/api/products"
import { fetchProducts } from "../../../../lib/api/products";
import { fetchProductVariantId } from "../../../../lib/api/products";
import { fetchProductVariantId2 } from "../../../../lib/api/products";
import { Product, ProductVariant } from "@/types";
import FilterSection from "@/components/FilterSection";
import { fetchProductSlug } from "../../../../../services";
// import {getList} from "@/lib/api/reviews";
import AddToCartMobile from "@/components/cart/AddToCartMobile";
import {isTop5Bestseller} from "@/lib/utils";
import { getProductBySlug2, getAllProducts } from "@/lib/api/products";
import { getProductList } from "@/lib/api/products";

type Props = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    // Decode in case of URL encoding issues
    const slug = decodeURIComponent(params.slug);
    const product = await getProductBySlug2(slug);

    if (!product) {
      return { title: "Product Not Found" };
    }

    return {
      title: `${product.name} | MamaBear`,
      description:
        product.description || `Buy ${product.name} at MamaBear.`,

      openGraph: {
        title: product.name,
        description: product.description,
        images: [
          {
            url: product.images?.[0]?.imageUrl || "/default-og-image.jpg",
            width: 1200,
            height: 630,
            alt: product.name,
          },
        ],
        type: "website",
      },

      twitter: {
        card: "summary_large_image",
        title: product.name,
        description: product.description,
        images: [product.images?.[0]?.imageUrl || "/default-og-image.jpg"],
      },
    };
  } catch (error) {
    // ✅ Never throw from generateMetadata — always return a fallback
    console.error("[generateMetadata] Failed to fetch product metadata:", error);
    return {
      title: "MamaBear | Product",
      description: "Explore our products at MamaBear.",
    };
  }
}

// export async function generateMetadata({
//   params,
// }: {
//   params: { slug: string };
// }): Promise<Metadata> {

//   const product = await getProductBySlug2(params.slug);

//   if (!product) {
//     return {
//       title: "Product Not Found",
//     };
//   }

//   return {
//     title: `${product.name} | MamaBear`,
    
//     description:
//       product.description ||
//       `Buy ${product.name} at MamaBear.`,

//     openGraph: {
//       title: product.name,
//       description: product.description,

//       images: [
//         {
//           url:
//             product.images?.[0]?.imageUrl ||
//             "/default-og-image.jpg",

//           width: 1200,
//           height: 630,
//           alt: product.name,
//         },
//       ],

//       type: "website",
//     },

//     twitter: {
//       card: "summary_large_image",
//       title: product.name,
//       description: product.description,

//       images: [
//         product.images?.[0]?.imageUrl ||
//         "/default-og-image.jpg",
//       ],
//     },
//   };
// }


export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
    const { slug } = await params;

    if (!slug) {
        return 
        <div>Product Not Found</div>
    }

    //fetch all data using old API no mockproduct
    // const fetchedAllData = await fetchProducts();
    // const fetchedAllDataData = await fetchedAllData.data.data;

    //fetch all data using new API with mockproduct
    const fetchedAllDataData = await getAllProducts();
    // const slicedData = fetchedAllDataData?.slice(0,3);
    const slicedData = fetchedAllDataData
      .sort((a:Product, b:Product) => parseFloat(b.avgRating ?? "0") - parseFloat(a.avgRating ?? "0"))
      .slice(0, 5);

    //fetch one data by slug using old API no mockproduct
    // const fetchedDataData = await fetchProductSlug2(slug);

    //fetch one data by slug using new API with mockproduct
    const fetchedDataData = await getProductBySlug2(slug);
    const productId = fetchedDataData.id;

    //fetch product variant by product id using old API no mockproduct
    // const productVariant = await fetchProductVariantId2(productId)

    //fetch product variant by product id using new API with mockproduct
    const productVariant = await getProductVariantById(productId);


    const isTop5BestsellerFlag = isTop5Bestseller(fetchedAllDataData, productId);
    
    return (
        <div className="mx-auto w-full xl:w-[100%] md:flex md:flex-col justify-center gap-2 px-5 lg:px-20 bg-light-pink/25">
            <div className="w-full block md:flex md:justify-center items-start">
                <div className='w-full md:w-[100%] top-2'><ProductSection productId={productId} product={fetchedDataData}  productVariant={productVariant} isTop5BestsellerFlag={isTop5BestsellerFlag}/></div>
            </div>
            <div className="w-full">
                <ReviewSection productId={productId} product={fetchedDataData} slicedData={slicedData}/>
            </div>
            <div className="block lg:hidden">
                <AddToCartMobile productId={productId} product={fetchedDataData} />
            </div>
        </div>
    );
}
``