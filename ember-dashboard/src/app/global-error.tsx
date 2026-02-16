'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#0A0A0A', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: '#121212', border: '1px solid #1F1F1F', borderRadius: 8, padding: 32, maxWidth: 400, textAlign: 'center' }}>
            <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Something went wrong</h2>
            <p style={{ color: '#808080', fontSize: 14, marginBottom: 24 }}>{error.message || 'A critical error occurred.'}</p>
            <button
              onClick={reset}
              style={{ padding: '10px 20px', background: '#10B981', color: '#0A0A0A', fontWeight: 500, border: 'none', borderRadius: 8, cursor: 'pointer' }}
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
