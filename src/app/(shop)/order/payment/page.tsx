import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import { Button } from "@/components/button";

const Payment = () => {
  return (
    <div className='border flex flex-col justify-evenly items-center gap-8'>
      <h2>Checkout</h2>
      <div className='grid grid-cols-4 grid-rows-1 gap-20 border text-[10px]'>
        <div className='col-span-1 flex flex-col items-center gap-2'>
          <div className='rounded-full p-2 w-8 h-8 bg-green-500 flex justify-center items-center'><h3 className='mamabear-font-4'>✔</h3></div>
          <p>Shipping Info</p>
        </div>
        <div className='col-span-1 flex flex-col items-center gap-2 '>
          <div className='rounded-full p-2 w-8 h-8 bg-green-500 flex justify-center items-center'><h3 className='mamabear-font-4'>✔</h3></div>
          <p>Shipping Method</p>
        </div>
        <div className='col-span-1 flex flex-col items-center gap-2'>
          <div className='rounded-full p-2 w-8 h-8 bg-green-500 flex justify-center items-center'><h3 className='mamabear-font-4'>✔</h3></div>
          <p>Payment</p>
        </div>
        <div className='col-span-1  flex flex-col items-center gap-2'>
          <div className='rounded-full p-2 w-8 h-8 bg-green-500 flex justify-center items-center'><h3 className='mamabear-font-4'>4</h3></div>
          <p>Review</p>
        </div>
      </div>
      <div className='flex gap-10 justify-center w-full'>
        <div className='md:w-[60%] border'>
          <Card>
            <CardHeader>
              <CardTitle>Order Review</CardTitle>
              <CardDescription />
            </CardHeader>

            <CardContent className='border m-2 p-2 rounded-md bg-gray-200 flex flex-col justify-start'>
              <p>Shipping Address</p>
              <p>Siti</p>
              <p>08123456789</p>
              <p>Jl. Mawar No. 123, Jakarta</p>
            </CardContent>
            <div>

            </div>
            <CardContent className='border m-2 p-2 rounded-md bg-gray-200 flex flex-col justify-start'>
              <p>Shipping</p>
              <p>JNE Regular</p>
              <p>2-3 Days</p>
              <p>Rp. 15000</p>
            </CardContent>
              <CardContent className='border m-2 p-2 rounded-md bg-gray-200 flex flex-col justify-start'>
                Order Summary
              </CardContent>

            <CardFooter>
              <Button className='md:w-[30%]'><Link href='../thankyou'>    &lt; Back</Link></Button>
              <Button className='md:w-[60%]'><Link href='../thankyou'>Purchase</Link></Button>
            </CardFooter>
          </Card>
        </div>
        <div className='md:w-[30%] border'>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription />
            </CardHeader>

            <CardContent />

            <CardFooter />
          </Card>
        </div>
      </div>

    </div>
  );
};

export default Payment;