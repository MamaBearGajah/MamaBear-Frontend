"use client"

import { useEffect } from "react"

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

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
    <img src='/errorpicture.png' alt='Error' className='w-100 h-100' />
      <h2 className="text-2xl font-bold">
        Something went wrong
      </h2>

      <p className="text-sm text-gray-500">
        {error.message}
      </p>

      <button
        onClick={() => reset()}
        className="rounded-md bg-[var(--mamabear-dark-pink)] px-4 py-2 text-white"
      >
        Try again
      </button>
    </div>
  )
}