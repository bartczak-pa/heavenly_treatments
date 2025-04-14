import React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./styles/globals.css";
import { validateEnv } from '@/lib/env';
import { Playfair_Display, Open_Sans } from 'next/font/google';
import * as Toast from '@radix-ui/react-toast';
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Serif font for headings
const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700'],
});

// Sans-serif font for body text
const openSans = Open_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-open-sans',
  weight: ['300', '400', '500', '600', '700'],
});

// Validate environment variables on startup
validateEnv();

// Base Metadata (can be overridden by pages)
export const metadata: Metadata = {
  metadataBase: process.env.NEXT_PUBLIC_BASE_URL ? new URL(process.env.NEXT_PUBLIC_BASE_URL) : undefined,
  title: {
    default: 'Heavenly Treatments with Hayleybell - Wellness & Self-Care',
    template: '%s | Heavenly Treatments with Hayleybell', 
  },
  description: "Discover relaxing massage therapies, rejuvenating facials, and holistic body treatments in Biggleswade. Book your journey to wellness with Heavenly Treatments.",
  keywords: ['Massage', 'Facial', 'Reflexology', 'Body Treatments', 'Kelso', 'Wellness', 'Spa', 'Heavenly Treatments', 'Heavenly Treatments with Hayleybell', 'Heavenly Treatments with Hayleybell Kelso', 'Scottish Borders', 'Scottish Borders Massage', 'Scottish Borders Facials', 'Scottish Borders Body Treatments'],
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: process.env.NEXT_PUBLIC_BASE_URL || '',
    siteName: 'Heavenly Treatments with Hayleybell',
    title: 'Heavenly Treatments with Hayleybell - Wellness & Self-Care',
    description: 'Relaxing massage, facial, reflexology, and body treatments in Biggleswade.',
    images: [
      {
        url: '/images/logo.png',
        width: 1200, // Standard OG width
        height: 630, // Standard OG height
        alt: 'Heavenly Treatments with Hayleybell logo',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${openSans.variable} antialiased`}>
      <body className="font-sans min-h-screen bg-background text-foreground">
        <SpeedInsights />
        <Toast.Provider swipeDirection="right">
          {children}
          <Toast.Viewport className="fixed bottom-0 right-0 p-4" />
        </Toast.Provider>
        <Analytics />
      </body>
    </html>
  );
}
