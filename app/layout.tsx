import React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./styles/globals.css";
import { validateEnv } from '@/lib/env';
import { Playfair_Display, Open_Sans } from 'next/font/google';

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

export const metadata: Metadata = {
  title: "Heavenly Treatments",
  description: "Your journey to wellness and self-care begins here",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${openSans.variable} antialiased`}>
      <body className="font-sans min-h-screen bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
