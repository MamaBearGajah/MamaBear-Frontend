"use client"

import { memo } from 'react';
import {
  FaWhatsapp,
  FaFacebook,
  FaInstagram,
  FaTiktok,
} from "react-icons/fa";

const ShareThisProductDetail = ({isOpen}:{isOpen: boolean}) => {

    const productUrl =
        typeof window !== "undefined"
        ? window.location.href
        : ""

    const encodedUrl = encodeURIComponent(productUrl)

    const shareLinks = {
        whatsapp: `https://wa.me/?text=${encodedUrl}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        instagram: `https://www.instagram.com/?url=${encodedUrl}`,
        tiktok: `https://www.tiktok.com/share?url=${encodedUrl}`,
    }


    const openLink = (url: string) => {
        window.open(url, "_blank")
    }

    const copyLink = async () => {
        await navigator.clipboard.writeText(productUrl)
        alert("Link copied!")
    }

  return (
    <div>
      {isOpen && (
        <div className='absolute top-10 left-0 bg-white p-4 rounded shadow-lg z-10'>
            <img className='w-[20px] absolute top-2 right-2 cursor-pointer hover:bg-gray-200' src='/cross.svg'></img>
          <h3 className='text-lg font-bold mb-2'>Share This Product</h3>

            <div className="grid grid-cols-4 gap-4">

              <button
                onClick={() =>
                  openLink(shareLinks.whatsapp)
                }
                className="flex flex-col items-center gap-2 cursor-pointer hover:border transition duration-300 border-green-500 rounded-lg p-2"
              >
                <div className="rounded-full bg-green-100 p-4">
                  <FaWhatsapp size={24} />
                </div>

                <span className="text-sm">
                  WhatsApp
                </span>
              </button>

              <button
                onClick={() =>
                  openLink(shareLinks.facebook)
                }
                className="flex flex-col items-center gap-2 cursor-pointer hover:border transition duration-300 border-blue-500 rounded-lg p-2"
              >
                <div className="rounded-full bg-blue-100 p-4">
                  <FaFacebook size={24} />
                </div>

                <span className="text-sm">
                  Facebook
                </span>
              </button>

              <button
                onClick={copyLink}
                className="flex flex-col items-center gap-2 cursor-pointer hover:border transition duration-300 border-pink-500 rounded-lg p-2"
              >
                <div className="rounded-full bg-pink-100 p-4">
                  <FaInstagram size={24} />
                </div>

                <span className="text-sm">
                  Instagram
                </span>
              </button>

              <button
                onClick={copyLink}
                className="flex flex-col items-center gap-2 cursor-pointer hover:border transition duration-300 border-gray-500 rounded-lg p-2"
              >
                <div className="rounded-full bg-gray-200 p-4">
                  <FaTiktok size={24} />
                </div>

                <span className="text-sm">
                  TikTok
                </span>
              </button>
            </div>

        </div>
      )}
    </div>
  );
};

export default ShareThisProductDetail;