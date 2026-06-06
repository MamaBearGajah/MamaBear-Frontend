"use client";

import { useState } from "react";

export default function AnalyticsSettings() {
  const [measurementId, setMeasurementId] = useState("");

  const save = async () => {
    await fetch("/api/settings/google-analytics", {
      method: "POST",
      body: JSON.stringify({
        measurementId,
      }),
    });
  };

  return (
    <div className="rounded-lg border p-6">
      <h2 className="mb-4 font-semibold">
        Google Analytics
      </h2>

      <input
        value={measurementId}
        onChange={(e) => setMeasurementId(e.target.value)}
        placeholder="G-XXXXXXXXXX"
        className="w-full rounded border p-2"
      />

      <button
        onClick={save}
        className="mt-4 rounded bg-black px-4 py-2 text-white"
      >
        Save
      </button>
    </div>
  );
}