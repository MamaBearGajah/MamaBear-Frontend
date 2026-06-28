"use client";

import { useState } from "react";

export default function ProductDescription({
  productDescription,
}: {
  productDescription: string;
}) {
  const [expanded, setExpanded] = useState(false);

  const MAX_LENGTH = 120;

  const isLong = productDescription.length > MAX_LENGTH;

  const displayText =
    expanded || !isLong
      ? productDescription
      : productDescription.slice(0, MAX_LENGTH) + "...";

  return (
    <div>
      <p className="mt-2 mb-2 text-sm text-gray-500">
        {displayText}
      </p>

      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="text-sm font-medium text-pink-600 hover:underline"
        >
          {expanded ? "Show less" : "Learn more"}
        </button>
      )}
    </div>
  );
}