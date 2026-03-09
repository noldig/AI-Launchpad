import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Launchpad',
  description: 'Von der Idee zum MVP — strukturiert, schlank, ready for development.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
