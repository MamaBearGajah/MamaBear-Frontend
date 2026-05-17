import { memo } from 'react';

const KeyBenefit = ({productWeight} : {productWeight:string}) => {
  return (<div>
              <div className='grid grid-cols-2 grid-rows-3 mt-3 border bg-gray-100 rounded-lg p-4 gap-2'>
                <div className='col-start-1 col-end-3 row-start-1 row-end-2 font-bold text-[var(--mamabear-dark-pink)]'>KEY BENEFIT</div>
                <div className='col-start-1 col-end-2 row-start-2 row-end-3'>Affordable Items</div>
                <div className='col-start-2 col-end-3 row-start-2 row-end-3'>High Quality</div>
                <div className='col-start-1 col-end-2 row-start-3 row-end-4'>Many Variants</div>
                <div className='col-start-2 col-end-3 row-start-3 row-end-4'>Nutritious</div>
              </div>
              <br></br>
              <div className='flex justify-start items-center'>
                <img src='/package-svgrepo-com.svg' className='w-[20px]'></img>{productWeight} gram (15 sacks)
              </div>
            </div>
  );
};

export default KeyBenefit;