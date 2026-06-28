"use client"

import { useEffect } from "react"
import axios from "axios"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  // Cek apakah ini error 429 (rate limit) — jangan tampilkan tombol retry
  // karena itu yang menyebabkan retry loop di console
  const isRateLimit =
    error.message?.includes("429") ||
    (axios.isAxiosError(error) && error.response?.status === 429)

  const isTooManyRequests =
    isRateLimit ||
    error.message?.toLowerCase().includes("too many requests") ||
    error.message?.toLowerCase().includes("rate limit")

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center px-4">
      <img src="/errorpicture.png" alt="Error" className="w-40 h-40 object-contain" />

      {isTooManyRequests ? (
        <>
          <h2 className="text-2xl font-bold text-[#6C4735]">
            Terlalu banyak permintaan 🐻
          </h2>
          <p className="text-sm text-gray-500 max-w-sm">
            Server sedang sibuk. Tunggu beberapa detik lalu refresh halaman.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-full bg-[var(--mamabear-dark-pink)] px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition"
          >
            Refresh halaman
          </button>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold text-[#6C4735]">
            Something went wrong
          </h2>
          <p className="text-sm text-gray-500 max-w-sm">
            {error.message}
          </p>
          <button
            onClick={() => reset()}
            className="rounded-full bg-[var(--mamabear-dark-pink)] px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition"
          >
            Try again
          </button>
        </>
      )}
    </div>
  )
}