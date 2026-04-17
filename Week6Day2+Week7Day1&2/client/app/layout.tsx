import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/src/context/cartContext"; 
import { SocketProvider } from "@/src/context/socketContext";
import { AuthProvider } from "@/src/context/authContext";
import { Toaster } from "react-hot-toast";
import LayoutNavbar from "@/src/components/layout/LayoutNavbar"; 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "SHOP.CO | Elite Garments",
  description: "Premium quality modern aesthetics for your wardrobe.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <SocketProvider>
            <CartProvider>
              <Toaster position="top-right" reverseOrder={false} />
              
              {/* This will now switch between Admin and User Navbars automatically */}
              <LayoutNavbar />

              <main className="flex-grow">
                {children}
              </main>
              
            </CartProvider>
          </SocketProvider>
        </AuthProvider>
      </body>
    </html>
  );
}