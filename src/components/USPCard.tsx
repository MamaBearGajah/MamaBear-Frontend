

const USPCard = () => {
  return (
    <div className='grid grid-cols-2 grid-rows-2 gap-5 w-full p-3 md:w-[90%] border'>
      <div className='col-start-1 col-end-2 row-start-1 row-end-2 rounded-full pt-2 pb-2 text-center flex justify-center items-center bg-[var(--mamabear-light-pink)]'><img className='w-[20px]' src='/check.svg'/> Boost Breast Milk Production</div>
      <div className='col-start-2 col-end-3 row-start-1 row-end-2 rounded-full pt-2 pb-2 text-center flex justify-center items-centerbg-[var(--mamabear-light-pink)]'><img className='w-[20px]' src='/check.svg'/>Rich In Antioxidants</div>
      <div className='col-start-1 col-end-2 row-start-2 row-end-3 rounded-full pt-2 pb-2 text-center flex justify-center items-center bg-[var(--mamabear-light-pink)]'><img className='w-[20px]' src='/check.svg'/>Calming & Relaxing</div>
      <div className='col-start-2 col-end-3 row-start-2 row-end-3 rounded-full pt-2 pb-2 text-center flex justify-center items-center bg-[var(--mamabear-light-pink)]'><img className='w-[20px]' src='/check.svg'/>No Preservatives</div>
    </div>
  );
};

export default USPCard;