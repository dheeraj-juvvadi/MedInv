import type { Metadata } from "next"
import { Archivo_Black, Sora, IBM_Plex_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProviderWrapper } from "@/components/theme-provider-wrapper"

const sora = Sora({ subsets: ["latin"], variable: "--font-sans", display: "swap" })
const archivo = Archivo_Black({ subsets: ["latin"], weight: "400", variable: "--font-display", display: "swap" })
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono", display: "swap" })

export const metadata: Metadata = {
  title: 'Medical Inventory System',
  description: 'Clinical supply intelligence with live inventory, expiry, and order control.',
  icons: {
    icon: [{ url: 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 32 32\'%3E%3Crect width=\'32\' height=\'32\' rx=\'7\' fill=\'%230F1512\'/%3E%3Cpath d=\'M16 9v14M9 16h14\' stroke=\'%237BD3B2\' stroke-width=\'3.5\' stroke-linecap=\'round\'/%3E%3C/svg%3E', type: 'image/svg+xml' }],
  },
  openGraph: {
    title: 'MedInv · Medical Inventory System',
    description: 'Clinical supply intelligence with live inventory, expiry, and order control.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'MedInv · Medical Inventory System',
    description: 'Clinical supply intelligence with live inventory, expiry, and order control.',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
        <style>{`:root{color-scheme:light dark}`}</style>
      </head>
      <body className={`${sora.variable} ${archivo.variable} ${plexMono.variable} font-sans min-h-screen`}>
        <ThemeProviderWrapper>{children}</ThemeProviderWrapper>
      </body>
    </html>
  )
}
