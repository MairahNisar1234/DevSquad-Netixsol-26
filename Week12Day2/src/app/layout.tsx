import type { Metadata } from "next";
import "./globals.css"; // Assumes Tailwind CSS is imported here

export const metadata: Metadata = {
  title: "Serenity Essence Minting Hub",
  description: "Mint your unique digital masterpiece on-chain",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-900 text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}