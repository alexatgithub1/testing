'use client'

import { useEffect } from 'react'

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
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-8">
      <div className="bg-[#121212] border border-[#1F1F1F] rounded-lg p-8 max-w-md text-center">
        <h2 className="text-xl font-semibold text-white mb-2">Something went wrong</h2>
        <p className="text-[#808080] text-sm mb-6">{error.message || 'An error occurred loading the dashboard.'}</p>
        <button
          onClick={reset}
          className="px-4 py-2 bg-[#10B981] text-[#0A0A0A] font-medium rounded-lg hover:opacity-90 transition-opacity"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
