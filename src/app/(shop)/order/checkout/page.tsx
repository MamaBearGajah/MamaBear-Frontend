import Link from "next/link";
const Checkout= () => {
  return (
    <div className='border h-[20vh] md:h-[40vh] flex flex-col justify-center'>
      <h2>Checkout Page</h2>
        <Link href='../payment'>Checkout</Link>
    </div>
  );
};

export default Checkout;