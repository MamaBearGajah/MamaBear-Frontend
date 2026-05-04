import Link from "next/link";
const TopProducts = () => {
  return (
    <div className='border w-full flex flex-col justify-center items-center p-10'>
      <h2 className='font-quicksand'>Top Product</h2>
        <Link href='../app/product/1'>Checkout</Link>
    </div>
  );
};

export default TopProducts;