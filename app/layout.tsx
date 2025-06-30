import type React from "react"
import AuthProvider from "@/components/providers/session-provider"
import './globals.css'

export const metadata = {
  title: "Circular Metronome",
  description: "A better approach practicing your timing",
  generator: 'v0.dev',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Circular Metronome',
  },
  formatDetection: {
    telephone: false,
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#000000',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Circular Metronome" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="apple-touch-icon" href="/placeholder-logo.png" />
        <link rel="icon" href="/placeholder-logo.png" />
      </head>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}