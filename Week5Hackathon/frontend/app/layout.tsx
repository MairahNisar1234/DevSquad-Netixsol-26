import type { Metadata } from "next";
import { Josefin_Sans, Lato } from "next/font/google";
import "./globals.css";

const josefin = Josefin_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-josefin", // This creates a CSS variable
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
  variable: "--font-lato", // This creates a CSS variable
});

export const metadata: Metadata = {
  title: "Auction Dashboard",
  description: "Car Auction Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${josefin.variable} ${lato.variable}`}>
      <body>{children}</body>
    </html>
  );
}