import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ember CEO Dashboard',
  description: 'Executive decision cockpit for Ember',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
