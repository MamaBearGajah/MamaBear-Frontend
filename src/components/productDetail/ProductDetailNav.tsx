"use client";

import { useState, useEffect } from "react";

type Props = {
  setParentNavValue: (value: string) => void;
};

export default function ProductDetailNav({ setParentNavValue }: Props) {
  const [navValue, setnavValue] = useState("Description");
  const [active, setActive] = useState("Description");
  const handleClick = (value: string) => {
    setnavValue(value);
    setParentNavValue(value);
    setActive(value);
  };
  return (
    <div>
      <div className="hidden w-full gap-10 pb-5 font-bold md:flex md:items-center md:justify-start">
        <p
          onClick={() => handleClick("Description")}
          className={`cursor-pointer ${active === "Description" ? "text-[var(--mamabear-dark-pink)] underline" : null}`}
        >
          Description
        </p>

        <p
          onClick={() => handleClick("Review")}
          className={`cursor-pointer ${active === "Review" ? "text-[var(--mamabear-dark-pink)] underline" : null}`}
        >
          Review
        </p>
      </div>

      <div className="block w-full md:hidden">
        <div className="flex w-full gap-3">
          <button
            onClick={() => handleClick("Description")}
            className={`flex-1 rounded-3xl px-4 py-2 transition-all duration-300 ${
              active === "Description"
                ? "border border-[var(--mamabear-dark-pink)] bg-[var(--mamabear-dark-pink)] font-bold text-white shadow-sm"
                : "border border-[var(--mamabear-light-pink)] bg-white text-[var(--mamabear-dark-pink)]"
            }`}
          >
            Description
          </button>
          <button
            onClick={() => handleClick("Review")}
            className={`flex-1 rounded-3xl px-4 py-2 transition-all duration-300 ${
              active === "Review"
                ? "border border-[var(--mamabear-dark-pink)] bg-[var(--mamabear-dark-pink)] font-bold text-white shadow-sm"
                : "border border-[var(--mamabear-light-pink)] bg-white text-[var(--mamabear-dark-pink)]"
            }`}
          >
            Review
          </button>
        </div>
      </div>
      <hr></hr>
    </div>
  );
}
