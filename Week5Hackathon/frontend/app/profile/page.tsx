"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Car, Gavel, Heart, Edit3, X, Camera, Plus, Clock, Trash2, Trophy, Star } from 'lucide-react';
import Navbar from '../../src/components/layout/Navbar';
import Footer from '../../src/components/layout/Footer';
import { io } from "socket.io-client";

// ─── Backend Configuration ───────────────────────────────────────────────────
const BACKEND_URL = "https://auction-backend-gt06.onrender.com";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("personal");
  const [userData, setUserData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Updated to use the live BACKEND_URL for Socket.io
    const socket = io(BACKEND_URL, { transports: ["websocket"] });
    
    socket.on('notification', (data) => {
      switch (data.type) {
        case 'BID_START':
          alert(`🚀 NEW AUCTION!\n${data.message}`); break;
        case 'BID_ENDED':
          alert(`🛑 CLOSED: ${data.message}`);
          window.dispatchEvent(new Event("refreshBids")); break;
        case 'BID_WINNER':
          if (userData && (data.winnerId === userData._id || data.winnerId === userData.id)) {
            alert(`🏆 CONGRATULATIONS! You won the auction for ${data.auctionId}!`);
          } else { alert(`🏁 SOLD: ${data.message}`); }
          window.dispatchEvent(new Event("refreshBids")); break;
        default:
          alert(`📢 ${data.title}\n${data.message}`);
      }
    });
    return () => { socket.disconnect(); };
  }, [userData]);

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      // Updated to use BACKEND_URL
      const response = await fetch(`${BACKEND_URL}/users/profile`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) setUserData(await response.json());
    } catch (error) { console.error(error); }
  };

  useEffect(() => { fetchProfile(); }, []);

  return (
    <>
      <Navbar />
      <section>
        {/* --- Main Profile Header --- */}
        <div className="bg-[#dce8f8] py-14 text-center">
          <h1 className="text-5xl font-extrabold text-[#1e2b58] mb-3 tracking-tight">My Profile</h1>
          <div className="flex justify-center mb-4">
            <span className="block w-16 h-1 bg-[#1a2e5a] rounded-full"></span>
          </div>
          <p className="text-gray-500 text-sm">
            Lorem ipsum dolor sit amet consectetur. At in pretium semper vitae eu eu mus.
          </p>
        </div>
        <div className="bg-[#d6e4f7] py-3 px-10 border-b border-[#c2d6f0] flex justify-center items-center">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-gray-500">
            <span>Home</span> 
            <span className="text-gray-400 text-lg">›</span> 
            <span className="text-[#1a2e5a] font-bold">My Profile</span>
          </div>
        </div>
      </section>

      <div className="bg-white min-h-screen font-sans text-[#1e2b58]">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-56 shrink-0">
            <div className="border border-gray-200 rounded-sm overflow-hidden sticky top-24">
              {[
                { id: "personal", label: "Personal Information", icon: <User size={15}/> },
                { id: "my-cars", label: "My Cars", icon: <Car size={15}/> },
                { id: "my-bids", label: "My Bids", icon: <Gavel size={15}/> },
                { id: "wishlist", label: "Wishlist", icon: <Heart size={15}/> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium border-b last:border-b-0 border-gray-100 transition-all text-left
                    ${activeTab === tab.id ? 'bg-[#f0f4ff] text-[#1e2b58] font-bold border-l-4 border-l-[#f5c518]' : 'text-gray-500 hover:text-[#1e2b58] hover:bg-gray-50'}`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>
          </aside>

          <div className="flex-1">
            {activeTab === "personal" && <PersonalInfoView user={userData} refreshUser={fetchProfile} />}
            {activeTab === "my-cars" && <MyCarsView />}
            {activeTab === "my-bids" && <MyBidsView currentUser={userData} />}
            {activeTab === "wishlist" && <WishlistView />}
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
}

/* ===================== WISHLIST VIEW ===================== */
function WishlistView() {
  const [wishlist, setWishlist] = useState<any[]>([]);

  const syncWishlist = () => {
    const data = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setWishlist(data);
  };

  useEffect(() => {
    syncWishlist();
    window.addEventListener("wishlistUpdated", syncWishlist);
    window.addEventListener("storage", syncWishlist);
    return () => {
      window.removeEventListener("wishlistUpdated", syncWishlist);
      window.removeEventListener("storage", syncWishlist);
    };
  }, []);

  const removeFromWishlist = (id: string) => {
    const current = JSON.parse(localStorage.getItem("wishlist") || "[]");
    const updated = current.filter((item: any) => item._id !== id);
    localStorage.setItem("wishlist", JSON.stringify(updated));
    setWishlist(updated);
    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-[#1e2b58]">My Wishlist ({wishlist.length})</h2>
      </div>
      {wishlist.length === 0 ? (
        <div className="border border-dashed border-gray-200 rounded-sm p-12 text-center text-gray-400 text-sm">
          Your wishlist is empty.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {wishlist.map((item) => (
            <div key={item._id} className="border border-gray-200 rounded-sm overflow-hidden bg-white shadow-sm relative group">
              <button
                onClick={() => removeFromWishlist(item._id)}
                className="absolute top-2 right-2 z-10 bg-white/90 p-1.5 rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
              >
                <Trash2 size={14} />
              </button>
              <div className="relative h-40">
                <img src={item.images?.[0]} className="w-full h-full object-cover" alt="car" />
              </div>
              <div className="p-4">
                <h4 className="font-bold text-sm text-[#1e2b58] truncate">{item.title || `${item.make} ${item.model}`}</h4>
                <p className="text-[10px] text-gray-400 font-bold uppercase mb-3">{item.make} • {item.model}</p>
                <div className="flex justify-between items-center">
                  <p className="font-black text-[#1e2b58]">${item.basePrice?.toLocaleString()}</p>
                  <Link href={`/auction/${item._id}`}>
                    <span className="text-[10px] font-black uppercase text-[#1e2b58] underline cursor-pointer">View</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ===================== MY BIDS VIEW — DYNAMIC DATA ===================== */
function MyBidsView({ currentUser }: { currentUser: any }) {
  const [bids, setBids] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMyBids = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${BACKEND_URL}/bids/my-history`, {
        headers: { "Authorization": `Bearer ${token}` },
      });
      const result = await res.json();
      if (result.success) setBids(result.data);
    } catch (err) {
      console.error("Failed to fetch bids:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBids();
    window.addEventListener("refreshBids", fetchMyBids);
    return () => window.removeEventListener("refreshBids", fetchMyBids);
  }, []);

  const handleSubmitBid = (auctionId: string) => {
    window.location.href = `/auction/${auctionId}`;
  };

  if (loading) return <div className="text-center py-10 text-sm text-gray-400">Loading your bids...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#1e2b58] inline-block">My Bids</h2>
        <div className="h-[3px] w-16 bg-[#f5c518] mt-1 rounded-full" />
      </div>

      {bids.length === 0 ? (
        <div className="border border-dashed border-gray-200 rounded-sm p-12 text-center text-gray-400 text-sm">
          No bids placed yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {bids.map((bid) => {
            const auction = bid.auctionId;
            const isWinner =
              auction?.status === "closed" &&
              (auction?.winnerId === currentUser?._id || auction?.winnerId === currentUser?.id);

            const isActive = auction?.status === "active";
            const winningBid = auction?.currentBid ?? auction?.basePrice;
            const yourBid = bid.amount;
            const isYourBidWinning = winningBid === yourBid;

            return (
              <div key={bid._id} className="border border-gray-200 rounded-sm overflow-hidden bg-white shadow-sm flex flex-col">
                <div className="relative">
                  {auction?.trending && (
                    <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-sm flex items-center gap-1">
                      Trending 🔥
                    </div>
                  )}
                  <button className="absolute top-2 right-2 z-10 bg-white/80 p-1 rounded-full text-gray-400 hover:text-[#f5c518] transition-colors">
                    <Star size={13} />
                  </button>
                  <img
                    src={auction?.images?.[0] || "https://placehold.co/400x260?text=Car"}
                    alt={auction?.title}
                    className="w-full h-44 object-cover"
                  />
                </div>

                <div className="text-center pt-3 pb-1 px-3">
                  <p className="text-sm font-bold text-[#1e2b58]">
                    {auction?.title || `${auction?.make} ${auction?.model}`}
                  </p>
                </div>

                <div className="flex gap-2 px-3 py-2">
                  <div className="flex-1 bg-[#1e2b58] text-white rounded-sm px-2 py-1.5 text-center">
                    <p className="text-xs font-black">${winningBid?.toLocaleString() ?? "—"}</p>
                    <p className="text-[9px] font-semibold opacity-80 mt-0.5">Winning Bid</p>
                  </div>
                  <div className={`flex-1 rounded-sm px-2 py-1.5 text-center ${isYourBidWinning ? "bg-green-100 text-green-700" : "bg-red-100 text-red-500"}`}>
                    <p className="text-xs font-black">${yourBid?.toLocaleString() ?? "—"}</p>
                    <p className="text-[9px] font-semibold opacity-80 mt-0.5">Your Current Bid</p>
                  </div>
                </div>

                <div className="flex items-center justify-between px-3 pb-2">
                  <CountdownTimer endTime={auction?.endTime} />
                  
                  <div className="text-right">
                    <p className="text-sm font-black text-[#1e2b58]">{auction?.bidCount || 0}</p>
                    <p className="text-[8px] text-gray-400 font-semibold uppercase">Total Bids</p>
                  </div>
                </div>

                {isWinner && (
                  <div className="mx-3 mb-2">
                    <span className="bg-[#f5c518] text-[#1e2b58] text-[9px] font-black px-3 py-1 rounded-sm flex items-center gap-1 w-fit">
                      <Trophy size={9} /> YOU WON
                    </span>
                  </div>
                )}

                <div className="px-3 pb-3 mt-auto">
                  <button
                    onClick={() => handleSubmitBid(auction?._id)}
                    disabled={!isActive}
                    className={`w-full py-2.5 text-xs font-black uppercase rounded-sm tracking-wide transition-colors ${
                      isActive ? "bg-[#1e2b58] text-white hover:bg-[#243d7a]" : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {isActive ? "Submit A Bid" : "Auction Closed"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ===================== COUNTDOWN HELPER ===================== */
function CountdownTimer({ endTime }: { endTime: string }) {
  const [timeLeft, setTimeLeft] = useState<any>({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    if (!endTime) return;
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(endTime).getTime() - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, mins: 0, secs: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          mins: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          secs: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  const timeData = [
    { v: timeLeft.days, l: "days" },
    { v: timeLeft.hours, l: "hours" },
    { v: timeLeft.mins, l: "mins" },
    { v: timeLeft.secs, l: "secs" },
  ];

  return (
    <div className="flex items-end gap-1">
      {timeData.map((t) => (
        <div key={t.l} className="flex flex-col items-center">
          <span className="bg-[#1e2b58] text-white text-[10px] font-black px-1.5 py-0.5 rounded-sm min-w-[22px] text-center">
            {t.v.toString().padStart(2, '0')}
          </span>
          <span className="text-[7px] text-gray-400 mt-0.5">{t.l}</span>
        </div>
      ))}
    </div>
  );
}

/* ===================== PERSONAL INFO VIEW ===================== */
function PersonalInfoView({ user, refreshUser }: any) {
  const [editSection, setEditSection] = useState<string | null>(null);
  const [tempData, setTempData] = useState<any>({});
  const [uploading, setUploading] = useState(false);

  const startEditing = (section: string) => { setTempData({ ...user }); setEditSection(section); };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BACKEND_URL}/users/update-profile`, {
      method: "PATCH",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(tempData),
    });
    if (response.ok) { refreshUser(); setEditSection(null); }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return; setUploading(true);
    const token = localStorage.getItem("token");
    const formData = new FormData(); formData.append("image", file);
    try {
      const res = await fetch(`${BACKEND_URL}/users/upload-avatar`, {
        method: "POST", headers: { "Authorization": `Bearer ${token}` }, body: formData,
      });
      if (res.ok) refreshUser();
    } catch (err) { console.error(err); }
    finally { setUploading(false); }
  };

  return (
    <div className="space-y-6">
      <SectionCard
        title="Personal Information"
        onEdit={() => editSection === "personal" ? setEditSection(null) : startEditing("personal")}
        isEditing={editSection === "personal"}
      >
        <div className="flex items-start gap-8">
          <div className="relative group shrink-0">
            <div className="w-20 h-20 rounded-full bg-gray-100 overflow-hidden border-4 border-white shadow-sm">
              <img
                src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=1e2b58&color=fff`}
                className={`w-full h-full object-cover ${uploading ? 'opacity-30' : ''}`}
                alt="Avatar"
              />
            </div>
            <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
              <Camera size={18} />
              <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
            </label>
          </div>
          <div className="grid grid-cols-2 gap-x-12 gap-y-6 flex-1">
            <InfoItem label="Full Name" value={user?.name} editValue={tempData.name} isEditing={editSection === "personal"} onChange={(v: string) => setTempData({...tempData, name: v})} />
            <InfoItem label="Email" value={user?.email} />
            <InfoItem label="Mobile Number" value={user?.phone} editValue={tempData.phone} isEditing={editSection === "personal"} onChange={(v: string) => setTempData({...tempData, phone: v})} />
            <InfoItem label="Nationality" value={user?.nationality} editValue={tempData.nationality} isEditing={editSection === "personal"} onChange={(v: string) => setTempData({...tempData, nationality: v})} />
          </div>
        </div>
        {editSection === "personal" && <SaveButton onSave={handleSave} />}
      </SectionCard>

      <SectionCard
        title="Address"
        onEdit={() => editSection === "address" ? setEditSection(null) : startEditing("address")}
        isEditing={editSection === "address"}
      >
        <div className="grid grid-cols-2 gap-x-12 gap-y-6">
          <InfoItem label="Country" value={user?.country} editValue={tempData.country} isEditing={editSection === "address"} onChange={(v: string) => setTempData({...tempData, country: v})} />
          <InfoItem label="City" value={user?.city} editValue={tempData.city} isEditing={editSection === "address"} onChange={(v: string) => setTempData({...tempData, city: v})} />
          <InfoItem label="Address 1" value={user?.address1} editValue={tempData.address1} isEditing={editSection === "address"} onChange={(v: string) => setTempData({...tempData, address1: v})} />
          <InfoItem label="Land Line" value={user?.landline} editValue={tempData.landline} isEditing={editSection === "address"} onChange={(v: string) => setTempData({...tempData, landline: v})} />
        </div>
        {editSection === "address" && <SaveButton onSave={handleSave} />}
      </SectionCard>

      <SectionCard
        title="Traffic File Information"
        onEdit={() => editSection === "traffic" ? setEditSection(null) : startEditing("traffic")}
        isEditing={editSection === "traffic"}
      >
        <div className="grid grid-cols-2 gap-x-16 gap-y-6">
          <div className="space-y-6">
            <InfoItem label="Traffic Information Type" value={user?.trafficInfoType} editValue={tempData.trafficInfoType} isEditing={editSection === "traffic"} onChange={(v: string) => setTempData({...tempData, trafficInfoType: v})} />
            <InfoItem label="Traffic File Number" value={user?.trafficFileNumber} editValue={tempData.trafficFileNumber} isEditing={editSection === "traffic"} onChange={(v: string) => setTempData({...tempData, trafficFileNumber: v})} />
            <InfoItem label="Plate Number" value={user?.plateNumber} editValue={tempData.plateNumber} isEditing={editSection === "traffic"} onChange={(v: string) => setTempData({...tempData, plateNumber: v})} />
            <InfoItem label="Issue City" value={user?.issueCity} editValue={tempData.issueCity} isEditing={editSection === "traffic"} onChange={(v: string) => setTempData({...tempData, issueCity: v})} />
          </div>
          <div className="space-y-6">
            <InfoItem label="Plate State" value={user?.plateState} editValue={tempData.plateState} isEditing={editSection === "traffic"} onChange={(v: string) => setTempData({...tempData, plateState: v})} />
            <InfoItem label="Plate Code" value={user?.plateCode} editValue={tempData.plateCode} isEditing={editSection === "traffic"} onChange={(v: string) => setTempData({...tempData, plateCode: v})} />
            <InfoItem label="Driver License Number" value={user?.driverLicenseNumber} editValue={tempData.driverLicenseNumber} isEditing={editSection === "traffic"} onChange={(v: string) => setTempData({...tempData, driverLicenseNumber: v})} />
          </div>
        </div>
        {editSection === "traffic" && <SaveButton onSave={handleSave} />}
      </SectionCard>
    </div>
  );
}

/* ===================== MY CARS VIEW ===================== */
function MyCarsView() {
  const [auctions, setAuctions] = useState<any[]>([]);
  const router = useRouter();

  const fetchMyAuctions = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${BACKEND_URL}/auctions/my-auctions`, {
      headers: { "Authorization": `Bearer ${token}` },
    });
    if (res.ok) setAuctions(await res.json());
  };

  useEffect(() => { fetchMyAuctions(); }, []);

  const handleDeleteAuction = async (id: string) => {
    if (!window.confirm("Delete this auction?")) return;
    const token = localStorage.getItem("token");
    await fetch(`${BACKEND_URL}/auctions/${id}`, {
      method: "DELETE", headers: { "Authorization": `Bearer ${token}` },
    });
    fetchMyAuctions();
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-[#1e2b58]">My Cars</h2>
        <button
          onClick={() => router.push('/sellcar')}
          className="bg-[#1e2b58] text-white px-5 py-2 rounded-sm font-bold text-sm flex items-center gap-2"
        >
          <Plus size={15} /> Add New
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {auctions.map((item) => (
          <div key={item._id} className="border border-gray-200 rounded-sm overflow-hidden bg-white shadow-sm">
            <div className="relative h-40">
              <img src={item.images?.[0]} className="w-full h-full object-cover" alt="car" />
              <button
                onClick={() => handleDeleteAuction(item._id)}
                className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-all"
              >
                <Trash2 size={14} />
              </button>
            </div>
            <div className="p-4">
              <h4 className="font-bold text-sm text-[#1e2b58] truncate">{item.title}</h4>
              <p className="text-[10px] text-gray-400 font-bold uppercase mb-3">{item.make} • {item.model} • {item.odometer} KM</p>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase">Base Price</p>
                  <p className="font-black text-[#1e2b58]">${item.basePrice?.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-400 flex items-center gap-1 justify-end font-bold uppercase">
                    <Clock size={10} /> {new Date(item.endTime).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ===================== UI HELPERS ===================== */
function InfoItem({ label, value, editValue, isEditing, onChange }: any) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</span>
      {isEditing && onChange ? (
        <input
          className="border-b border-blue-200 text-sm outline-none pb-1 text-[#1e2b58] font-semibold"
          value={editValue || ""}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <span className="text-sm font-semibold text-[#1e2b58]">{value || "—"}</span>
      )}
    </div>
  );
}

function SectionCard({ title, children, onEdit, isEditing }: any) {
  return (
    <div className="border border-gray-200 rounded-sm overflow-hidden bg-white mb-6">
      <div className="bg-[#1e2b58] px-5 py-3 flex justify-between items-center text-white">
        <h3 className="font-bold text-sm uppercase">{title}</h3>
        {onEdit && (
          <button onClick={onEdit}>
            {isEditing ? <X size={16} /> : <Edit3 size={16} />}
          </button>
        )}
      </div>
      <div className="p-8">{children}</div>
    </div>
  );
}

function SaveButton({ onSave }: { onSave: () => void }) {
  return (
    <div className="flex justify-end mt-6 pt-6 border-t border-gray-100">
      <button
        onClick={onSave}
        className="bg-[#1e2b58] text-white px-10 py-2.5 rounded-sm font-bold text-xs uppercase hover:bg-[#243d7a]"
      >
        Save Changes
      </button>
    </div>
  );
}