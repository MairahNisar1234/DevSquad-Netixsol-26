import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();
  
  const subtotal = cart.reduce((acc, item) => acc + (Number(item.price || 0) * item.quantity), 0);
  const delivery = subtotal > 0 ? 3.95 : 0;
  const total = subtotal + delivery;

  const handlePurchase = () => {
    console.log("PURCHASE CLICKED");

    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }

    // This state is what Payment.jsx reads to get the IDs
    navigate("/payment", {
      state: { cart, subtotal, delivery, total }
    });
  };

  return (
    <div style={{ padding: "60px 10%", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ fontFamily: "'Prosto One', cursive" }}>My Bag</h1>
      
      {cart.length === 0 ? (
        <p>Your bag is empty. <Link to="/products">Keep shopping</Link></p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "60px" }}>
          <div>
            {cart.map((item) => (
              <div key={item._id} style={{ display: "flex", gap: "20px", marginBottom: "30px", borderBottom: "1px solid #eee", paddingBottom: "20px" }}>
                <img src={item.image} style={{ width: "100px", height: "100px", objectFit: "cover" }} alt={item.name} />
                <div style={{ flex: 1 }}>
                  <h4>{item.name}</h4>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "10px 0" }}>
                    <button type="button" onClick={() => updateQuantity(item._id, -1)}>-</button>
                    <span>{item.quantity}</span>
                    <button type="button" onClick={() => updateQuantity(item._id, 1)}>+</button>
                  </div>
                  <button type="button" onClick={() => removeFromCart(item._id)}>REMOVE</button>
                </div>
                <div>€{(Number(item.price || 0) * item.quantity).toFixed(2)}</div>
              </div>
            ))}
          </div>

          <div style={{ background: "#f9f9f9", padding: "30px", height: "fit-content" }}>
            <h3>Order Summary</h3>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>Subtotal</span> <span>€{subtotal.toFixed(2)}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>Delivery</span> <span>€{delivery.toFixed(2)}</span></div>
            <hr />
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", marginBottom: "20px" }}>
              <span>Total</span> <span>€{total.toFixed(2)}</span>
            </div>
            
            <button 
              onClick={handlePurchase} 
              style={{
                width: "100%",
                padding: "15px",
                background: "#000",
                color: "#fff",
                border: "#000",
                cursor: "pointer",
                marginTop: "20px",
                fontWeight: "bold"
              }}
            >
              GO TO PAYMENT
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;