"use client"
import { useState, memo } from 'react';
import ShareThisProductDetail from './ShareThisProductDetail';

const ShareThisProduct = () => {
  const [isOpen, setIsOpen] = useState(false);

  function toggleShareOptions() {
    setIsOpen(!isOpen);
  }

  return (
    <div className='cursor-pointer hover:scale-101 transition duration-300 flex justify-start items-center' onClick={toggleShareOptions}>
      <img className='w-[20px]' src='/share.svg'></img> 
      <h2 className='ml-2 hover:underline'>Share This Product</h2>
      <ShareThisProductDetail isOpen={isOpen} />
    </div>
  );
};

export default ShareThisProduct;