"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import Navbar from "../../../../src/components/layout/Navbar";
import Footer from "../../../../src/components/layout/Footer";
import { FiStar } from "react-icons/fi";
import { io } from "socket.io-client"; // Added for real-time

// ─── Backend Configuration ───────────────────────────────────────────────────
const BACKEND_URL = "https://auction-backend-gt06.onrender.com";

// ─── Shipping Tracker Component ───────────────────────────────────────────────
function ShippingTracker({ step }: { step: number }) {
  const paymentDate = new Date();
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 2);

  const fmt = (d: Date) =>
    d.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });

  const fillPercent = step === 0 ? 0 : step === 1 ? 50 : 100;

  return (
    <div className="bg-white border border-gray-200 rounded-sm px-4 md:px-6 py-5 mt-4">
      <div className="flex justify-between items-start mb-8 md:mb-5">
        <div>
          <p className="text-xs md:text-sm font-bold text-[#1e2b58] leading-tight">{fmt(paymentDate)}</p>
          <p className="text-[10px] md:text-[11px] text-gray-400 mt-0.5">Payment Date</p>
        </div>
        <div className="text-right">
          <p className="text-xs md:text-sm font-bold text-[#1e2b58] leading-tight">{fmt(deliveryDate)}</p>
          <p className="text-[10px] md:text-[11px] text-gray-400 mt-0.5">
            {step >= 2 ? "Vehicle Delivered" : "Expected Delivery Date"}
          </p>
        </div>
      </div>

      <div className="relative" style={{ height: "52px" }}>
        <div
          className="absolute bg-gray-200"
          style={{ top: "13px", left: "13px", right: "13px", height: "2px" }}
        />

        <div
          className="absolute bg-green-500 transition-all duration-700"
          style={{
            top: "13px",
            left: "13px",
            height: "2px",
            width: fillPercent === 0
              ? "0px"
              : `calc(${fillPercent}% - ${fillPercent === 50 ? "13px" : "0px"})`,
          }}
        />

        <TrackNode done={step >= 0} style={{ position: "absolute", left: 0, top: 0 }} label="Ready For Shipping" labelAlign="left" />
        <TrackNode done={step >= 1} style={{ position: "absolute", left: "50%", top: 0, transform: "translateX(-50%)" }} label="In Transit" labelAlign="center" />
        <TrackNode done={step >= 2} style={{ position: "absolute", right: 0, top: 0 }} label="Delivered" labelAlign="right" />
      </div>
    </div>
  );
}

function TrackNode({ done, style, label, labelAlign }: any) {
  return (
    <div style={{ ...style, display: "flex", flexDirection: "column", alignItems: "center", width: "28px" }}>
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          border: done ? "2px solid #22c55e" : "2px solid #d1d5db",
          backgroundColor: done ? "#22c55e" : "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.5s",
          flexShrink: 0,
          zIndex: 10
        }}
      >
        {done ? (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#e5e7eb" }} />
        )}
      </div>

      <p
        style={{
          marginTop: 6,
          fontSize: 9,
          fontWeight: 700,
          whiteSpace: "nowrap",
          color: done ? "#16a34a" : "#9ca3af",
          textAlign: labelAlign,
          transform: labelAlign === "left"
            ? "translateX(0)"
            : labelAlign === "right"
            ? "translateX(calc(-100% + 28px))"
            : "translateX(-50%) translateX(14px)",
          transition: "color 0.4s",
        }}
        className="md:text-[11px]"
      >
        {label}
      </p>
    </div>
  );
}

export default function DummyPayment() {
  const { id } = useParams();
  const router = useRouter();
  const [auction, setAuction] = useState<any>(null);
  const [bids, setBids] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingStep, setShippingStep] = useState(0);

  useEffect(() => {
    const fetchWinnerData = async () => {
      try {
        const { data } = await axios.get(`${BACKEND_URL}/auctions/${id}`);
        setAuction(data);
        const bidsRes = await axios.get(`${BACKEND_URL}/bids/auction/${id}`);
        setBids(bidsRes.data.history || []);
      } catch (error) {
        console.error("Error fetching auction", error);
      }
    };
    fetchWinnerData();

    // ─── Real-time Socket Setup ───
    const socket = io(BACKEND_URL, { transports: ["websocket"] });

    socket.on("bid-placed", (data) => {
      // Ensure the bid belongs to this specific auction
      if (data.auctionId === id || data.auctionId?.$oid === id) {
        const newBidEntry = {
          _id: data._id,
          amount: data.amount,
          bidderId: data.bidderId?.name ? data.bidderId : { name: "Recent Bidder" },
          createdAt: data.createdAt
        };

        setBids((prev) => [newBidEntry, ...prev]);
        setAuction((prev: any) => ({
          ...prev,
          highestBid: data.amount
        }));
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [id]);

  const handleDummyPayment = () => {
    if (shippingStep >= 2) {
      router.push("/dashboard");
      return;
    }

    setIsProcessing(true);
    setTimeout(async () => {
      const nextStep = shippingStep + 1;
      setShippingStep(nextStep);
      if (nextStep === 1) toast.success("Payment received!");
      else if (nextStep === 2) toast.success("Vehicle delivered! 🎉");
      setIsProcessing(false);
    }, 2000);
  };

  const buttonLabel = () => {
    if (isProcessing) return "Processing...";
    if (shippingStep === 0) return "Make Payment";
    if (shippingStep === 1) return "Confirm Delivery";
    return "Go to Dashboard";
  };

  if (!auction) return <div className="min-h-screen flex items-center justify-center font-bold text-[#1e2b58]">Loading...</div>;

  return (
    <>
      <Navbar />
      <main className="bg-white min-h-screen pb-20 font-sans text-[#1e2b58]">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-8">

          {/* Main Card */}
          <div className="border border-gray-200 rounded-sm overflow-hidden shadow-sm">
            <div className="bg-[#1e2b58] px-5 py-3 flex justify-between items-center">
              <h2 className="text-sm font-bold text-white uppercase tracking-tight">{auction.make} {auction.model}</h2>
              <FiStar className="text-white/60 w-4 h-4" />
            </div>

            {/* Image Gallery */}
            <div className="flex flex-col md:flex-row gap-2 p-3">
              <div className="relative w-full md:w-[55%] shrink-0">
                <img
                  src={auction.images?.[0]}
                  className="w-full h-[220px] md:h-[300px] object-cover rounded-sm"
                  alt="Main"
                />
                <span className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase">Winner View</span>
              </div>
              <div className="flex-1 grid grid-cols-3 md:grid-cols-2 gap-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <img
                    key={i}
                    src={auction.images?.[i] || auction.images?.[0]}
                    className="w-full h-[70px] md:h-[94px] object-cover rounded-sm"
                    alt={`Car ${i}`}
                  />
                ))}
              </div>
            </div>

            {/* Stats Row */}
            <div className="border-t border-gray-100 px-5 py-4 flex flex-col lg:flex-row lg:items-center gap-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1">
                <StatItem value={new Date(auction.endTime).toLocaleDateString('en-GB')} label="Winning Date" />
                <StatItem value={new Date(auction.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} label="End Time" />
                <StatItem value={`$${(auction.highestBid || auction.basePrice)?.toLocaleString()}`} label="Winning Bid" isGreen />
                <StatItem value={auction.lotNumber || '379831'} label="Lot No." />
              </div>

              <div className="flex flex-col gap-2 lg:items-end border-t lg:border-t-0 pt-4 lg:pt-0">
                {shippingStep === 0 && (
                  <p className="text-[10px] md:text-xs text-red-500 font-semibold">Note: Please make payment in 6 Days</p>
                )}
                <div className="lg:text-right">
                  <p className="text-sm font-black text-green-500">
                    ${(auction.highestBid || auction.basePrice)?.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-gray-400 font-semibold uppercase">{shippingStep === 0 ? "Pending Amount" : "Amount Paid"}</p>
                </div>
                <button
                  onClick={handleDummyPayment}
                  disabled={isProcessing}
                  className="w-full lg:w-auto px-8 py-2.5 border-2 border-[#1e2b58] text-[#1e2b58] text-sm font-bold rounded-sm uppercase tracking-wide hover:bg-[#1e2b58] hover:text-white transition-all disabled:opacity-50"
                >
                  {buttonLabel()}
                </button>
              </div>
            </div>

            <div className="border-t border-gray-100 px-5 pb-5 overflow-x-hidden">
              <ShippingTracker step={shippingStep} />
            </div>
          </div>

          {/* Bottom Content */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h3 className="text-base font-bold text-[#1e2b58] mb-1 uppercase">Description</h3>
                <div className="w-10 h-0.5 bg-[#f5c518] mb-4"></div>
                <p className="text-gray-500 text-sm leading-relaxed">{auction.description}</p>
              </div>

              <div className="border border-gray-200 rounded-sm overflow-hidden">
                <div className="bg-[#1e2b58] text-white px-5 py-3 font-bold text-sm uppercase">Winner</div>
                <div className="bg-white p-6 flex flex-col sm:flex-row items-center gap-6">
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(bids[0]?.bidderId?.name || "User")}&background=1e2b58&color=fff&size=80`}
                    className="w-14 h-14 rounded-full border-2 border-gray-100 shadow shrink-0"
                    alt="Winner"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4 flex-1 w-full text-center sm:text-left">
                    <InfoItem label="Full Name" value={bids[0]?.bidderId?.name || "N/A"} />
                    <InfoItem label="Email" value={bids[0]?.bidderId?.email || "N/A"} />
                    <InfoItem label="Mobile" value={bids[0]?.bidderId?.phone || "N/A"} />
                    <InfoItem label="Nationality" value={bids[0]?.bidderId?.nationality || "N/A"} />
                  </div>
                </div>
              </div>
            </div>

            {/* Bidders List Sidebar */}
            <div className="border border-gray-200 rounded-sm overflow-hidden h-fit shadow-sm">
              <div className="bg-[#1e2b58] text-white px-5 py-3 font-bold text-sm flex items-center gap-2 uppercase">
                <span className="block w-1 h-4 bg-[#f5c518] rounded-full"></span> Bidders List
              </div>
              <div className="divide-y divide-gray-100 bg-white">
                {bids.length > 0 ? bids.slice(0, 5).map((bid, index) => (
                  <div key={index} className="flex justify-between items-center px-5 py-3 hover:bg-gray-50 transition-colors">
                    <span className="text-sm text-gray-600 font-medium">{bid.bidderId?.name || "Anonymous"}</span>
                    <span className="text-sm font-black text-[#1e2b58]">$ {bid.amount?.toLocaleString()}</span>
                  </div>
                )) : (
                  <div className="px-5 py-6 text-center text-xs text-gray-400 font-bold uppercase">No bids</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function StatItem({ value, label, isGreen }: any) {
  return (
    <div>
      <p className={`text-sm font-bold ${isGreen ? 'text-green-500' : 'text-[#1e2b58]'}`}>{value}</p>
      <p className="text-[10px] text-gray-400 uppercase font-semibold mt-0.5 tracking-tighter">{label}</p>
    </div>
  );
}

function InfoItem({ label, value }: any) {
  return (
    <div className="space-y-1">
      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
      <p className="text-sm font-semibold text-[#1e2b58]">{value}</p>
    </div>
  );
}
