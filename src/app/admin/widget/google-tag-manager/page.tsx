// src/app/admin/widget/google-tag-manager/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Tag, ArrowLeft, ExternalLink } from "lucide-react";

export default function GoogleTagManagerPage() {
  const router = useRouter();
  const [gtmId, setGtmId]   = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState(false);

  useEffect(() => {
    fetch("/api/analytics-settings")
      .then((r) => r.json())
      .then((data) => { if (data.gtmId) setGtmId(data.gtmId); })
      .catch(() => {});
  }, []);

  const save = async () => {
    setSaving(true);
    setSaved(false);
    await fetch("/api/analytics-settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gtmId }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-6 max-w-xl">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Widgets
      </button>

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-500 text-white">
          <Tag className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-xl font-semibold">Google Tag Manager</h1>
          <p className="text-sm text-gray-500">Manage tracking tags in one place</p>
        </div>
      </div>

      {/* Form */}
      <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Container ID
          </label>
          <input
            value={gtmId}
            onChange={(e) => setGtmId(e.target.value)}
            placeholder="GTM-XXXXXXX"
            className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <p className="text-xs text-gray-400">
            Found in Google Tag Manager → your container name → top right corner
          </p>
        </div>

        {saved && (
          <p className="text-sm text-green-600 font-medium">
            ✓ Saved — changes will apply on the next page load
          </p>
        )}

        <button
          onClick={save}
          disabled={saving}
          className="w-full rounded-lg bg-yellow-500 py-2 text-sm font-semibold text-white hover:bg-yellow-600 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save"}
        </button>

        {/* Help */}
        <a
          href="https://tagmanager.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-yellow-600 hover:underline"
        >
          Open Google Tag Manager <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      {/* Note */}
      <p className="mt-4 text-xs text-gray-400">
        Recommended: Use GTM to manage GA4 and all other tracking tags from one dashboard.
        Once GTM is set, you don't need to enter a GA4 ID separately.
      </p>
    </div>
  );
} 