"use client";

import { useState } from "react";
import { toast } from "sonner";

export default function GoogleTagManagerWidget() {
  const [gtmId, setGtmId] = useState("");

  const handleSave = async () => {
    if (!gtmId.startsWith("GTM-")) {
      toast.error("Invalid GTM ID");
      return;
    }

    // Save to database
    await fetch("/api/settings/gtm", {
      method: "POST",
      body: JSON.stringify({ gtmId }),
    });

    toast.success("Google Tag Manager saved");
  };

  return (
    <div className="rounded-xl border bg-white p-6">
      <h2 className="text-lg font-semibold">
        Google Tag Manager
      </h2>

      <p className="mt-2 text-sm text-gray-500">
        Enter your GTM Container ID.
      </p>

      <input
        value={gtmId}
        onChange={(e) => setGtmId(e.target.value)}
        placeholder="GTM-XXXXXXX"
        className="mt-4 w-full rounded-md border p-2"
      />

      <button
        onClick={handleSave}
        className="mt-4 rounded-md bg-dark-pink px-4 py-2 text-white"
      >
        Save
      </button>
    </div>
  );
}