import { memo } from 'react';

const StructuredSnippet = () => {
  return (
    <div className='border-t-[1px] md:flex md:justify-evenly md:items-center mt-2 mb-2 p-5 text-xs'>
      <div className='flex flex-col justify-center items-center'>
        <img className='w-[20px]' src='/shield.svg'/>
        BPOM & Halal Certified
      </div>
      <div className='flex flex-col justify-center items-center'>
        <img className='w-[20px]' src='/truck.svg'/>
        Free Shipping 200K
      </div>
      <div className='flex flex-col justify-center items-center'>
        <img className='w-[20px]' src='/return.svg'/>
        7 Day Return Policy
      </div>
    </div>
  );
};

export default StructuredSnippet;