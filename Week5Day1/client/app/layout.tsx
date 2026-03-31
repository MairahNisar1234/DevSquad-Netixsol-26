import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DevSquad | Real-Time Blog",
  description: "Launched on March 30, 2026",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap" rel="stylesheet"></link>
      </head>
      <body className="bg-[#F8FAFC] antialiased">
        {children}
      </body>
    </html>
  );
}