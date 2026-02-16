import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-8">
      <div className="bg-[#121212] border border-[#1F1F1F] rounded-lg p-8 max-w-md text-center">
        <h1 className="text-2xl font-bold text-white mb-2">404</h1>
        <p className="text-[#808080] text-sm mb-6">This page doesn’t exist. If you expected the CEO dashboard, make sure you’re running the app from the <code className="text-[#10B981] bg-[#1F1F1F] px-1 rounded">ember-dashboard</code> folder.</p>
        <Link
          href="/"
          className="inline-block px-4 py-2 bg-[#10B981] text-[#0A0A0A] font-medium rounded-lg hover:opacity-90 transition-opacity"
        >
          Go to dashboard
        </Link>
      </div>
    </div>
  )
}
