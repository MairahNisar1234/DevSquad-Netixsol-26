import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// 1. Import your custom api service
import api from '../services/api.js'; 
import Navbar from '../components/Navbar3';
import Footer from '../components/footer';
import { useCart } from '../context/CartContext';
import { teaProducts } from "../data/data";

const iconMap = {
  '50g': '50-icon.png',
  '100g': '100-icon.png',
  '170g': '170g-can.png',
  'serve': 'serve.png', 
  'water': 'water.png', 
  'color':'color.png', 
  'clock': 'time.png'
};

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        // 2. Use the api instance (replaces localhost:5000)
        const res = await api.get(`/products/${id}`);
        const data = res.data;
        
        setProduct(data);
        if (data.variants?.length > 0) setSelectedVariant(data.variants[0]);
      } catch (err) {
        console.error("Error fetching product details:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProductDetails();
  }, [id]);

  const recommendations = teaProducts
    .filter((p) => p.name !== product?.name)
    .slice(0, 3);

  if (loading) return <div className="h-screen flex items-center justify-center font-prosto uppercase tracking-[3px] text-gray-400">Loading tea profile...</div>;
  if (!product) return <div className="h-screen flex items-center justify-center font-prosto">Product not found.</div>;

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Navbar />
      
      {/* SECTION 1: TOP MAIN DETAILS */}
      <div style={{ maxWidth: "1100px", margin: "60px auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", padding: "0 20px" }}>
        {/* LEFT: Image */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <img src={product.image} alt={product.name} style={{ width: "100%", mixBlendMode: "multiply" }} />
        </div>

        {/* RIGHT: Details */}
        <div className='font-sans' style={{ textAlign: "left" }}>
          <h1 className="font-prosto" style={{ fontSize: "2.5rem", fontWeight: "400", margin: "0 0 10px 0" }}>{product.name}</h1>
          <p style={{ color: "#666", marginBottom: "25px", fontSize: "14px", lineHeight: "1.6" }}>{product.description}</p>

          <div style={{ display: "flex", gap: "25px", marginBottom: "30px", color: "#444", fontSize: "12px", fontWeight: "bold" }}>
            <span className="flex items-center gap-2"><img src="/globe.png" alt="Origin" style={{ width: "18px" }} /> Origin: {product.origin}</span>
            <span className="flex items-center gap-2"><img src="/redeem.png" alt="Organic" style={{ width: "18px" }} /> {product.isOrganic ? "Organic" : "Standard"}</span>
            <span className="flex items-center gap-2"><img src="/eco.png" alt="Vegan" style={{ width: "18px" }} /> Vegan</span>
          </div>

          <div className="font-prosto" style={{ fontSize: "2.2rem", fontWeight: "bold", marginBottom: "25px", color:"black" }}>
            €{selectedVariant ? selectedVariant.price.toFixed(2) : "0.00"}
          </div>

          <h4 style={{ marginBottom: "15px", fontWeight: "700", fontSize: "12px", textTransform: "uppercase", color: "#999" }}>Variants</h4>
          <div style={{ display: "flex", gap: "15px", marginBottom: "40px" }}>
            {product.variants?.map((v) => {
              const filename = iconMap[v.name] || 'default-bag.png';
              return (
                <div 
                  key={v._id} 
                  onClick={() => setSelectedVariant(v)}
                  style={{ 
                    display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", padding: "8px",
                    border: selectedVariant?._id === v._id ? "2px solid #EAB308" : "1px solid #eee",
                    background: selectedVariant?._id === v._id ? "#fff" : "#f9f9f9",
                    borderRadius: "4px", width: "70px", transition: "0.2s"
                  }}
                >
                  <img src={`/${filename}`} alt={v.name} style={{ width: "40px", height: "50px", objectFit: "contain" }} onError={(e) => e.target.src = '/default-bag.png'} />
                  <span style={{ fontSize: "9px", fontWeight: "bold", marginTop: "5px" }}>{v.name}</span>
                </div>
              );
            })}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", border: "1px solid #ddd" }}>
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ padding: "10px 15px", cursor: "pointer" }}>-</button>
              <span style={{ padding: "0 15px", fontWeight: "bold" }}>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} style={{ padding: "10px 15px", cursor: "pointer" }}>+</button>
            </div>
            <button 
              onClick={() => addToCart(product, quantity, selectedVariant)} 
              style={{ flex: 1, padding: "15px", background: "#222", color: "#fff", border: "none", cursor: "pointer", fontWeight: "bold", fontSize: "12px", letterSpacing: "2px" }}
            >
              👜 ADD TO BAG
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 2: INSTRUCTIONS & ABOUT */}
      <div className="bg-[#f6f6f6] py-20 font-sans">
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px" }}>
          <div>
            <h2 className="font-prosto text-xl mb-10">Steeping instructions</h2>
            <div className="space-y-6 text-[11px] font-bold uppercase tracking-widest text-gray-500">
              <div className="border-b border-gray-200 pb-3 flex justify-between">
                <span>Serving Size</span>
                <span className="text-black">1 tsp per cup</span>
              </div>
              <div className="border-b border-gray-200 pb-3 flex justify-between">
                <span>Water Temperature</span>
                <span className="text-black">100°C</span>
              </div>
              <div className="border-b border-gray-200 pb-3 flex justify-between">
                <span>Steeping Time</span>
                <span className="text-black">3 - 5 Minutes</span>
              </div>
              <div className="flex items-center gap-3 pt-4">
                <div className="w-4 h-4 rounded-full bg-[#b85c5c]"></div>
                <span className="text-black">Color after 3 minutes</span>
              </div>
            </div>
          </div>

          <div className="border-l border-gray-200 pl-10">
            <h2 className="font-prosto text-xl mb-10">About this tea</h2>
            <div className="grid grid-cols-2 gap-y-10">
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Flavor</p>
                <p className="text-[12px] font-bold uppercase">{product.flavor || 'Spicy'}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Caffeine</p>
                <p className="text-[12px] font-bold uppercase">{product.caffeine || 'Medium'}</p>
              </div>
            </div>
            <div className="mt-12">
              <h3 className="text-[10px] text-gray-400 font-bold uppercase mb-3">Ingredient</h3>
              <p className="text-[13px] leading-relaxed text-gray-600">
                {product.ingredients || "Black Ceylon tea, Ginger root, Cloves, Black pepper, Cinnamon sticks."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: RECOMMENDATIONS */}
      <div style={{ maxWidth: "1100px", margin: "80px auto", padding: "0 20px" }}>
        <h2 className="font-prosto text-2xl text-center mb-16">You may also like</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {recommendations.map((item, idx) => (
            <div 
              key={idx} 
              className="text-center group cursor-pointer" 
              onClick={() => { navigate(`/product/${item._id || idx}`); window.scrollTo(0,0); }}
            >
              <div className=" aspect-square mb-6 p-8">
                <img src={item.image} alt={item.name} className="w-full h-full object-contain group-hover:scale-105 transition-all" />
              </div>
              <h4 className="font-prosto text-[13px] uppercase mb-2 tracking-tighter px-4">{item.name}</h4>
              <p className="font-sans text-[11px] font-bold text-gray-400">€{item.variants?.[0]?.price.toFixed(2)} / 50g</p>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetails;