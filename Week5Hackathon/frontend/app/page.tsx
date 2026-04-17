"use client";

import TopBar from "../src/components/home/TopBar";
import Navbar from "../src/components/home/Navbar";
import HeroBanner from "../src/components/home/HeroBanner";
import LiveAuction from "../src/components/home/LiveCard";
import Footer from "../src/components/layout/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <TopBar />
      <Navbar />
      <HeroBanner />
      <LiveAuction />
      <Footer />
    </div>
  );
}