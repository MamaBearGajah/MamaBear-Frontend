

const USPCard = () => {
  return (
    <div className='grid grid-cols-2 grid-rows-2 gap-5 w-full p-3 md:w-[60%]'>
      <div className='col-start-1 col-end-2 row-start-1 row-end-2 rounded-lg pt-3 pb-3 pl-3 text-start flex justify-start items-center bg-pink-50'><img className='w-[20px] mr-3' src='/check.svg'/> Boost Breast Milk Production</div>
      <div className='col-start-2 col-end-3 row-start-1 row-end-2 rounded-lg pt-2 pb-2 pl-3 text-center flex justify-start items-center bg-pink-50'><img className='w-[20px] mr-3' src='/check.svg'/>Rich In Antioxidants</div>
      <div className='col-start-1 col-end-2 row-start-2 row-end-3 rounded-lg pt-2 pb-2 pl-3 text-center flex justify-start items-center bg-pink-50'><img className='w-[20px] mr-3' src='/check.svg'/>Calming & Relaxing</div>
      <div className='col-start-2 col-end-3 row-start-2 row-end-3 rounded-lg pt-2 pb-2 pl-3 text-center flex justify-start items-center bg-pink-50'><img className='w-[20px] mr-3' src='/check.svg'/>No Preservatives</div>
    </div>
  );
};

export default USPCard;