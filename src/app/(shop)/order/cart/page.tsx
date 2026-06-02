import Link from "next/link";
const Cart = () => {
  return (
    <div className='border h-[20vh] md:h-[40vh] flex flex-col justify-center'>
      <h2>Cart Page</h2>
        <Link href='../checkout'>Checkout</Link>
    </div>
  );
};

export default Cart;