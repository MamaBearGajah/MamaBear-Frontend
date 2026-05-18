import Link from "next/link";
const Payment = () => {
  return (
    <div className='border flex flex-col justify-evenly items-center gap-8'>
      <h2>Checkout</h2>
      <div className='grid grid-cols-4 grid-rows-1 gap-20 border'>
        <div className='col-span-1 flex flex-col items-center gap-2'>
          <div className='rounded-full p-3 bg-[#FDE8E8]'><h3>1</h3></div>
          <p>Shipping Info</p>
        </div>
        <div className='col-span-1 flex flex-col items-center gap-2 '>
          <div className='rounded-full p-3 bg-[#FDE8E8]'><h3>2</h3></div>
          <p>Shipping Method</p>
        </div>
        <div className='col-span-1 flex flex-col items-center gap-2'>
          <div className='rounded-full p-3 bg-[#FDE8E8]'><h3>3</h3></div>
          <p>Payment</p>
        </div>
        <div className='col-span-1  flex flex-col items-center gap-2'>
          <div className='rounded-full p-3 bg-[#FDE8E8]'><h3>4</h3></div>
          <p>Review</p>
        </div>
      </div>
      <Link href='../thankyou'>Purchase</Link>
    </div>
  );
};

export default Payment;