import { getProductId } from "../../server";
import { mockProducts } from "../../lib/MockProducts";
import Stars from "./Stars";

export default async function ProductCard({
  productId,
}: {
  productId: number;
})  {
  const fetchedProduct = await getProductId(productId);
  return (
    <div className="bg-white border border-zinc-300 md:flex md:items-start rounded transition-transform duration-200 cursor-pointer hover:-translate-y-1 hover:shadow-lg">
        <div>
            {/* <img src={fetchedProduct.images[0]}   className="w-[400px]"/> */}
            <img src={mockProducts[0].images[0].imageUrl}   className="w-[400px]"/>
        </div>
        <div className='p-2 rounded-md'>
            {/* <h2>{fetchedProduct.title}</h2>
            <p>{fetchedProduct.price}</p>
            <p>{fetchedProduct.description}</p> */}
            <h4>{mockProducts[0].category.name}</h4>
            <h2>{mockProducts[0].name}</h2>
            <div className='flex justify-start'> <Stars rating={mockProducts[0].rating}/>{mockProducts[0].bestseller ? (<span className='bg-pink-400 rounded-lg p-2 ml-2'>🏆Bestseller</span>) : null}</div>

            <p>{mockProducts[0].price}</p>
            <p>{mockProducts[0].description}</p>
            <div>Add To Cart</div>
        </div>

    </div>
  );
}
