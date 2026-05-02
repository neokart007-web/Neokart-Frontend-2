import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "../components/common/Navbar";
import FloatingActions from "../components/common/FloatingActions";
import Footer from "../components/common/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HEEDY",
  description: "Premium skincare and cosmetics for your daily routine.",
};

import { CartProvider } from "../context/CartContext";
import { ToastProvider } from "../context/ToastContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col relative" suppressHydrationWarning>
        <ToastProvider>
          <CartProvider>
            <Navbar />
            {children}
            <Footer />
            <FloatingActions />
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
