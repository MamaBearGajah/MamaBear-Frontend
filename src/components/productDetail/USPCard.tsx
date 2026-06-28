const USPCard = () => {
  return (
    <div className="bg-light-pink/25 grid w-full grid-cols-1 gap-3 rounded-lg p-5 md:w-[60%] md:grid-cols-2">
      <div className="flex items-center justify-start rounded-lg bg-pink-50 px-3 py-3 text-left">
        <img className="mr-3 w-[20px]" src="/check.svg" /> Boost Breast Milk
        Production
      </div>
      <div className="flex items-center justify-start rounded-lg bg-pink-50 px-3 py-3 text-left">
        <img className="mr-3 w-[20px]" src="/check.svg" />
        Rich In Antioxidants
      </div>
      <div className="flex items-center justify-start rounded-lg bg-pink-50 px-3 py-3 text-left">
        <img className="mr-3 w-[20px]" src="/check.svg" />
        Calming & Relaxing
      </div>
      <div className="flex items-center justify-start rounded-lg bg-pink-50 px-3 py-3 text-left">
        <img className="mr-3 w-[20px]" src="/check.svg" />
        No Preservatives
      </div>
    </div>
  );
};

export default USPCard;
