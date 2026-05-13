import { memo } from 'react';

const ShareThisProduct = () => {
  return (
    <div className='cursor-pointer hover:scale-102 transition duration-300 flex justify-start items-center'>
      <img className='w-[20px]' src='/share.svg'></img> <h2 className='ml-2'>Share This Product</h2>
    </div>
  );
};

export default ShareThisProduct;