"use client"
import Link from "next/link";
const AddToCartMobile = () => {
  return (
    <div className="flex justify-between md:hidden fixed bottom-0 left-0 right-0 bg-dark-pink p-4 border-t shadow-md cursor-pointer flex items-center justify-center gap-2 z-50 transition duration-300">
      <img src='/cart.svg' className='w-[20px] h-[20px]' alt="Add to Cart" />
      <Link href="#"><h2 className='text-white hover:underline transition duration-300'>Add To Cart</h2></Link>
      <Link href="#"><h2 className='text-white hover:underline transition duration-300'>Checkout</h2></Link>
    </div>
  );
};

export default AddToCartMobile;