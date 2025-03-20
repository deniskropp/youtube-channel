import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/header"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "AI Channel - YouTube Clone",
  description: "A YouTube clone for an AI-focused channel",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  )
}



import './globals.css'