import Link from "next/link";
const Thankyou = () => {
  return (
    <div className='border h-[20vh] md:h-[40vh] flex flex-col justify-center'>
      <h2>Thankyou Page</h2>
        <Link href='/'>Home</Link>
    </div>
  );
};

export default Thankyou;