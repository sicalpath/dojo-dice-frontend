import "./globals.css";
import "./loader.css";
import Loader from "./loader";
import { Providers } from "./providers";

import type { Metadata } from "next";
// import { Inter } from 'next/font/google'
import './globals.css'
import React, { Suspense } from "react";

// const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Dojo Dice",
  description: "Dojo is good, web3mq is good",
  openGraph: {
    title: "dojo, web3mq",
    description: "cool cool cool",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`w-screen  no-scrollbar bg-white`}
      >
        <Providers>
          <Suspense fallback={<Loader />}>{children}</Suspense>
        </Providers>

        {/* <Loader /> */}
      </body>
    </html>
  )
}
