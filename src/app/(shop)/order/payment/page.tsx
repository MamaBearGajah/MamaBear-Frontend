import Link from "next/link";
const Payment = () => {
  return (
    <div className='border h-[20vh] md:h-[40vh] flex flex-col justify-center'>
      <h2>Payment Page</h2>
        <Link href='../thankyou'>Purchase</Link>
    </div>
  );
};

export default Payment;