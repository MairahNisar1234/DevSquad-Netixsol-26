import { useLocation, useNavigate } from 'react-router-dom';
// 1. Import your custom api instance
import api from "../services/api.js"; 
import Navbar from "../components/Navbar";
import Footer from "../components/footer";
import { useCart } from "../context/CartContext";
import { teaProducts } from "../data/data.js";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  
  const { cart, subtotal, delivery, total } = location.state || { cart: [], subtotal: 0, delivery: 0, total: 0 };

  const recommendations = teaProducts
    .filter(p => !cart.some(item => item.name === p.name))
    .slice(0, 4);

  const handlePlaceOrder = async () => {
    // 2. userId is still needed for the payload, but token is handled by api.js
    const userId = localStorage.getItem('userId');

    if (!userId) {
      alert("Please log in to complete your purchase.");
      navigate('/login');
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    const orderPayload = {
      userId,
      items: cart.map(item => ({
        productId: item._id,
        name: item.name,
        price: Number(item.price),
        quantity: Number(item.quantity),
        variantName: item.variantName
      })),
      total: Number(total.toFixed(2))
    };

    try {
      // 3. Simplified post request using the api instance
      await api.post('/orders', orderPayload);

      alert("Order successful! Your tea is on the way.");
      clearCart(); 
      navigate('/dashboard'); 
      
    } catch (error) {
      const serverMessage = error.response?.data?.error;
      console.error("Order error:", serverMessage);
      alert(`Order Failed: ${serverMessage || "Could not connect to server"}`);
    }
  };

  return (
    <div className="bg-white min-h-screen font-sans flex flex-col">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10 flex-grow">
        {/* Progress Steps */}
        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[3px] text-gray-300 mb-12">
          <span className="text-gray-400">1. MY BAG</span>
          <div className="h-[1px] bg-gray-100 flex-grow mx-10"></div>
          <span className="text-gray-400">2. DELIVERY</span>
          <div className="h-[1px] bg-gray-100 flex-grow mx-10"></div>
          <span className="text-black">3. REVIEW & PAYMENT</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* LEFT: Cart Items Review */}
          <div className="lg:col-span-7">
            <div className=" p-6 rounded-sm">
              {cart.map((item, idx) => (
                <div key={idx} className="flex gap-6 py-6 border-b border-gray-100 last:border-0">
                  <div className="w-20 h-20 bg-gray-50 flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-[14px] font-bold uppercase tracking-tight">{item.name}</h4>
                        <p className="text-gray-400 text-xs mt-1">{item.variantName}</p>
                      </div>
                      <div className="flex items-center gap-4 text-sm font-bold">
                        <span>Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <div className="flex justify-end mt-4">
                      <span className="font-bold">€{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
              <div className="mt-6 pt-6 border-t flex justify-between font-bold uppercase tracking-widest text-sm text-blue-500">
                <span>Secure Payment Review</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Summary & Final Action */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-[#f6f6f6] p-8 rounded-sm">
              <h3 className="text-[14px] font-bold uppercase tracking-[2px] mb-8">Order summary</h3>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between text-gray-500 font-medium">
                  <span>Subtotal</span>
                  <span>€{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500 font-medium">
                  <span>Delivery</span>
                  <span>€{delivery.toFixed(2)}</span>
                </div>
                <div className="h-[1px] bg-gray-200 my-4"></div>
                <div className="flex justify-between font-black text-lg">
                  <span>Total</span>
                  <span>€{total.toFixed(2)}</span>
                </div>
              </div>
              
              <button 
                onClick={handlePlaceOrder}
                className="w-full bg-[#1a1a1a] text-white py-5 mt-10 text-[12px] font-black uppercase tracking-[3px] hover:bg-black transition-all shadow-xl"
              >
                Place Order & Pay
              </button>
            </div>

            <div className="bg-[#f6f6f6] p-8 rounded-sm">
              <h3 className="text-[14px] font-bold uppercase tracking-[2px] mb-6">Accepted Payments</h3>
              <div className="flex gap-3">
                {['VISA', 'MASTERCARD', 'PAYPAL', 'AMEX'].map((card) => (
                  <div key={card} className="h-8 w-12 bg-white border border-gray-200 rounded-sm flex items-center justify-center text-[8px] font-bold text-gray-400">
                    {card}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* --- YOU MAY ALSO LIKE SECTION --- */}
        <div className="mt-24 mb-12">
          <div className="flex items-center gap-4 mb-10">
            <h3 className="text-[14px] font-bold uppercase tracking-[4px]">You may also like</h3>
            <div className="h-[1px] bg-gray-100 flex-grow"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {recommendations.map((prod, idx) => (
              <div 
                key={idx} 
                className="group cursor-pointer"
                onClick={() => navigate(`/product/${prod._id || idx}`)}
              >
                <div className="aspect-square bg-[#f9f9f9] mb-4 overflow-hidden relative">
                  <img 
                    src={prod.image} 
                    alt={prod.name} 
                    className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform bg-white/80 backdrop-blur-sm">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-center">View Product</p>
                  </div>
                </div>
                <h4 className="text-[12px] font-bold uppercase tracking-tight mb-1">{prod.name}</h4>
                <p className="text-gray-400 text-[11px] uppercase tracking-widest">
                  €{prod.variants?.[0]?.price?.toFixed(2) || "0.00"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PaymentPage;