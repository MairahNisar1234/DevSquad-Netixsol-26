"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import Navbar from "../../src/components/layout/Navbar";
import Footer from "../../src/components/layout/Footer"; 

const MAKES = ["Toyota", "Honda", "Ford", "BMW", "Mercedes", "Audi", "Hyundai", "Kia", "Nissan", "Chevrolet"];

const MODELS: Record<string, string[]> = {
  Toyota: ["Camry", "Corolla", "RAV4", "Land Cruiser", "Prado"],
  Honda: ["Civic", "Accord", "CR-V", "Pilot", "HR-V"],
  Ford: ["F-150", "Mustang", "Explorer", "Escape", "Edge"],
  BMW: ["3 Series", "5 Series", "X3", "X5", "7 Series"],
  Mercedes: ["C-Class", "E-Class", "GLE", "S-Class", "GLC"],
  Audi: ["A3", "A4", "Q5", "Q7", "A6"],
  Hyundai: ["Elantra", "Tucson", "Santa Fe", "Sonata", "Creta"],
  Kia: ["Sportage", "Sorento", "Seltos", "Picanto", "Carnival"],
  Nissan: ["Altima", "Sentra", "Rogue", "Pathfinder", "X-Trail"],
  Chevrolet: ["Malibu", "Equinox", "Traverse", "Silverado", "Tahoe"],
};

const YEARS = Array.from({ length: 30 }, (_, i) => String(2025 - i));
const ENGINE_SIZES = ["1.0L", "1.2L", "1.4L", "1.5L", "1.6L", "2.0L", "2.4L", "2.5L", "3.0L", "3.5L", "4.0L+"];
const PAINTS = ["White", "Black", "Silver", "Grey", "Red", "Blue", "Green", "Brown", "Gold", "Orange"];

export default function SellYourCar() {
  const [partyType, setPartyType] = useState("Dealer");
  const [modification, setModification] = useState("Completely stock");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    vin: "", year: "", mileage: "", engineSize: "", paint: "",
    gccSpecs: "", accidentHistory: "", fullServiceHistory: "",
    notes: "", maxBid: "", endTime: "",
  });

  const set = (field: keyof typeof form) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => 
    setForm((p) => ({ ...p, [field]: e.target.value }));

  const handlePhotoAdd = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos((p) => [...p, ...Array.from(e.target.files!)]);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos((p) => p.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (photos.length < 5) {
      alert("Please upload at least 5 images of your car.");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    
    // keys for all fields in the form state
    const allDataKeys = [
      "firstName", "lastName", "email", "phone", 
      "vin", "year", "mileage", "engineSize", "paint", 
      "gccSpecs", "accidentHistory", "fullServiceHistory", 
      "notes", "maxBid", "endTime"
    ];

    allDataKeys.forEach((key) => {
      formData.append(key, form[key as keyof typeof form]);
    });

    formData.append("make", make);
    formData.append("model", model);
    formData.append("partyType", partyType);
    formData.append("modification", modification);

    photos.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Authentication error: Please log in again.");
        setIsSubmitting(false);
        return;
      }

      // Pointing to your specific Render backend URL
      const response = await fetch("https://auction-backend-gt06.onrender.com/auctions/create", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        alert("Success! Your car is now listed.");
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || "Failed to create auction"}`);
      }
    } catch (error) {
      alert("Could not connect to the server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', Arial, sans-serif; background: #fff; color: #333; font-size: 13px; overflow-x: hidden; }
        
        @media (max-width: 768px) {
          .nav-links { display: none; }
          .hero h1 { font-size: 26px; }
          .form-row { grid-template-columns: 1fr !important; }
        }

        .hero { background: #dce5f0; padding: 36px 20px 28px; text-align: center; }
        .hero h1 { font-size: 34px; font-weight: 700; color: #1a1a1a; letter-spacing: -0.5px; margin-bottom: 4px; }
        .underline-word { position: relative; display: inline-block; }
        .underline-word::after { content: ''; display: block; height: 3px; background: #f5a623; border-radius: 2px; margin-top: 2px; }
        .hero-sub { font-size: 12.5px; color: #555; margin-top: 6px; }
        
        .page { max-width: 520px; margin: 0 auto; padding: 22px 16px 60px; width: 100%; }
        .breadcrumb { font-size: 12px; color: #777; margin-bottom: 10px; }
        .breadcrumb a { color: #f5a623; text-decoration: none; font-weight: 500; }
        .page-title { font-size: 20px; font-weight: 700; color: #1a1a1a; margin-bottom: 10px; }
        .page-desc { font-size: 12.5px; color: #555; line-height: 1.65; margin-bottom: 5px; }
        
        .card { border: 1px solid #d4dce8; border-radius: 6px; margin-top: 18px; background: #fff; overflow: hidden; }
        .card-head { background: #dce5f0; padding: 9px 14px; font-size: 13px; font-weight: 600; color: #1a1a1a; }
        .card-body { padding: 16px 14px; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
        .form-group { margin-bottom: 12px; }
        label.field-label { display: block; font-size: 11.5px; font-weight: 500; color: #444; margin-bottom: 4px; }
        label.field-label .req { color: #e04040; }
        
        input[type="text"], input[type="email"], input[type="number"], input[type="datetime-local"], select, textarea { width: 100%; padding: 7px 9px; font-size: 12.5px; font-family: 'Inter', Arial, sans-serif; color: #333; background: #fff; border: 1px solid #c5cdd8; border-radius: 4px; outline: none; appearance: none; transition: border-color .15s; }
        input:focus, select:focus, textarea:focus { border-color: #7899c8; box-shadow: 0 0 0 2px rgba(100,140,200,0.12); }
        select { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='9' height='5' viewBox='0 0 9 5'%3E%3Cpath d='M1 1l3.5 3L8 1' stroke='%23888' stroke-width='1.2' fill='none' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 9px center; padding-right: 26px; cursor: pointer; }
        textarea { min-height: 88px; resize: vertical; }
        
        .toggle-group { display: flex; width: 100%; }
        .tbtn { flex: 1; padding: 6px 16px; font-size: 12.5px; font-family: 'Inter', Arial, sans-serif; font-weight: 400; cursor: pointer; border: 1px solid #c5cdd8; background: #fff; color: #444; transition: all .15s; line-height: 1.4; }
        .tbtn:first-child { border-radius: 4px 0 0 4px; }
        .tbtn:last-child  { border-radius: 0 4px 4px 0; border-left: none; }
        .tbtn.on { background: #1b2d50; color: #fff; border-color: #1b2d50; }
        
        .phone-row { display: flex; gap: 6px; }
        .phone-code { width: 64px; flex-shrink: 0; font-size: 12px; }
        
        .bid-wrap { position: relative; }
        .bid-wrap .dollar { position: absolute; left: 9px; top: 50%; transform: translateY(-50%); font-size: 12.5px; color: #555; pointer-events: none; }
        .bid-wrap input { padding-left: 18px; }
        
        .photo-btn-label { display: inline-flex; align-items: center; gap: 5px; padding: 6px 14px; font-size: 12.5px; font-family: 'Inter', Arial, sans-serif; border: 1px solid #c5cdd8; border-radius: 4px; background: #fff; color: #444; cursor: pointer; transition: background .15s; }
        .photo-btn-label:hover { background: #f4f6fb; }
        
        .photo-previews { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
        .photo-item { position: relative; width: 58px; height: 58px; }
        .photo-item img { width: 100%; height: 100%; object-fit: cover; border-radius: 4px; border: 1px solid #d4dce8; }
        .remove-btn { position: absolute; top: -5px; right: -5px; background: #e04040; color: #fff; border: none; border-radius: 50%; width: 16px; height: 16px; font-size: 10px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-weight: bold; }
        
        .submit-btn { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; max-width: 140px; padding: 10px; margin-top: 18px; background: #1b2d50; color: #fff; font-family: 'Inter', Arial, sans-serif; font-size: 13.5px; font-weight: 600; border: none; border-radius: 5px; cursor: pointer; transition: background .15s; text-align: center; }
        .submit-btn:hover:not(:disabled) { background: #243c6a; }
        .submit-btn:disabled { background: #6c7a91; cursor: not-allowed; }

        .spinner {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      <Navbar/>
    
      <div className="hero">
        <h1>
          <span className="underline-word">Sell</span> Your Car
        </h1>
        <p className="hero-sub">
          Fast and secure listings for the best price.
        </p>
      </div>

      <div className="page">
        <p className="breadcrumb"><a href="#">Home</a> &gt; Sell Your Car</p>
        <h2 className="page-title">Tell us about your car</h2>
        <p className="page-desc">
          Details about the car's title status as well as <strong>at least 5 photos</strong> that highlight the car's condition.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="card">
            <div className="card-head">Your Info</div>
            <div className="card-body">
              <div className="form-group">
                <label className="field-label">Dealer or Private party?</label>
                <div className="toggle-group">
                  {["Dealer", "Private party"].map((t) => (
                    <button key={t} type="button" className={`tbtn${partyType === t ? " on" : ""}`}
                      onClick={() => setPartyType(t)}>{t}</button>
                  ))}
                </div>
              </div>
              <div className="form-row">
                <div>
                  <label className="field-label">First name<span className="req">*</span></label>
                  <input type="text" value={form.firstName} onChange={set("firstName")} required />
                </div>
                <div>
                  <label className="field-label">Last name<span className="req">*</span></label>
                  <input type="text" value={form.lastName} onChange={set("lastName")} required />
                </div>
              </div>
              <div className="form-row">
                <div>
                  <label className="field-label">Email<span className="req">*</span></label>
                  <input type="email" value={form.email} onChange={set("email")} required />
                </div>
                <div>
                  <label className="field-label">phone number<span className="req">*</span></label>
                  <div className="phone-row">
                    <select className="phone-code" defaultValue="PK +92">
                      <option>PK +92</option>
                      <option>US +1</option>
                      <option>UK +44</option>
                      <option>AE +971</option>
                    </select>
                    <input type="text" value={form.phone} onChange={set("phone")} required style={{ flex: 1 }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-head">Car Details</div>
            <div className="card-body">
              <div className="form-row">
                <div>
                  <label className="field-label">VIN<span className="req">*</span></label>
                  <input type="text" value={form.vin} onChange={set("vin")} required />
                </div>
                <div>
                  <label className="field-label">Year<span className="req">*</span></label>
                  <select value={form.year} onChange={set("year")} required>
                    <option value="">Select Year</option>
                    {YEARS.map((y) => <option key={y}>{y}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div>
                  <label className="field-label">Make<span className="req">*</span></label>
                  <select value={make} onChange={(e) => { setMake(e.target.value); setModel(""); }} required>
                    <option value="">Select Make</option>
                    {MAKES.map((m) => <option key={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="field-label">Model<span className="req">*</span></label>
                  <select value={model} onChange={(e) => setModel(e.target.value)} required>
                    <option value="">All Models</option>
                    {(MODELS[make] || []).map((m) => <option key={m}>{m}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div>
                  <label className="field-label">Mileage (in miles)</label>
                  <input type="number" value={form.mileage} onChange={set("mileage")} min="0" />
                </div>
                <div>
                  <label className="field-label">Engine size</label>
                  <select value={form.engineSize} onChange={set("engineSize")}>
                    <option value="">Select</option>
                    {ENGINE_SIZES.map((e) => <option key={e}>{e}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div>
                  <label className="field-label">Paint<span className="req">*</span></label>
                  <select value={form.paint} onChange={set("paint")} required>
                    <option value="">Select</option>
                    {PAINTS.map((p) => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="field-label">Has GCC Specs</label>
                  <select value={form.gccSpecs} onChange={set("gccSpecs")}>
                    <option value="">Select</option>
                    <option>Yes</option>
                    <option>No</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="field-label">Noteworthy options/features</label>
                <textarea value={form.notes} onChange={set("notes")} />
              </div>
              <div className="form-row">
                <div>
                  <label className="field-label">Accident History</label>
                  <select value={form.accidentHistory} onChange={set("accidentHistory")}>
                    <option value="">Select</option>
                    <option>Original paint</option>
                    <option>Partially Repainted</option>
                    <option>Totally Repainted</option>
                  </select>
                </div>
                <div>
                  <label className="field-label">Full Service History</label>
                  <select value={form.fullServiceHistory} onChange={set("fullServiceHistory")}>
                    <option value="">Select</option>
                    <option>Yes</option>
                    <option>No</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div>
                  <label className="field-label">Has the car been modified?</label>
                  <div className="toggle-group">
                    {["Completely stock", "Modified"].map((t) => (
                      <button key={t} type="button" className={`tbtn${modification === t ? " on" : ""}`}
                        onClick={() => setModification(t)}>{t}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="field-label">Max Bid<span className="req">*</span></label>
                  <div className="bid-wrap">
                    <span className="dollar">$</span>
                    <input type="number" value={form.maxBid} onChange={set("maxBid")} min="0" required />
                  </div>
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '12px' }}>
                <label className="field-label">Auction End Date & Time<span className="req">*</span></label>
                <input 
                  type="datetime-local" 
                  value={form.endTime} 
                  onChange={set("endTime")} 
                  required 
                  min={(() => {
                    const now = new Date();
                    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
                    return now.toISOString().slice(0, 16);
                  })()} 
                />
              </div>

              <div className="form-group">
                <label className="field-label">Upload Photos <span className="req">*</span> (Min 5)</label>
                <label className="photo-btn-label" htmlFor="photo-input">
                  📷 Add Photos
                  <input id="photo-input" type="file" accept="image/*" multiple
                    style={{ display: "none" }} onChange={handlePhotoAdd} />
                </label>
                {photos.length > 0 && (
                  <div className="photo-previews">
                    {photos.map((f, i) => (
                      <div key={i} className="photo-item">
                        <img src={URL.createObjectURL(f)} alt="" />
                        <button type="button" className="remove-btn" onClick={() => handleRemovePhoto(i)}>✕</button>
                      </div>
                    ))}
                  </div>
                )}
                {photos.length > 0 && photos.length < 5 && (
                  <p style={{ color: '#e04040', fontSize: '11px', marginTop: '5px' }}>
                    You need {5 - photos.length} more photo(s).
                  </p>
                )}
              </div>
            </div>
          </div>
          <button 
            type="submit" 
            className="submit-btn" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="spinner"></div>
                Saving...
              </>
            ) : (
              "Submit"
            )}
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
}