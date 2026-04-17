import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const CartSidebar = () => {
  const { cart, isCartOpen, toggleCart, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const subtotal = cart.reduce((acc, item) => {
    const price = Number(item.price) || 0;
    return acc + (price * item.quantity);
  }, 0);

  const delivery = subtotal > 0 ? 3.95 : 0;
  const total = subtotal + delivery;

  const handlePurchase = () => {
    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }

    toggleCart(); // close sidebar

    navigate("/payment", {
      state: { cart, subtotal, delivery, total }
    });
  };

  return (
    <div style={{ position: "fixed", top: 0, right: 0, width: "400px", height: "100%", background: "white", zIndex: 99999, boxShadow: "-5px 0 15px rgba(0,0,0,0.1)", padding: "30px", overflowY: "auto" }}>
      
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "30px" }}>
        <h2 style={{ fontSize: "1.5rem" }}>My Bag</h2>
        <button onClick={toggleCart} style={{ cursor: "pointer", border: "none", background: "none" }}>✕</button>
      </div>

      {cart.length === 0 ? (
        <p>Your bag is empty.</p>
      ) : (
        cart.map((item) => {
          const itemPrice = Number(item.price) || 0;

          return (
            <div key={item._id} style={{ display: "flex", gap: "20px", marginBottom: "20px", alignItems: "center" }}>
              
              <img src={item.image} style={{ width: "80px", height: "80px", objectFit: "cover" }} />

              <div style={{ flex: 1 }}>
                <h4 style={{ margin: "0 0 5px 0" }}>{item.name}</h4>

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <button onClick={() => updateQuantity(item._id, -1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item._id, 1)}>+</button>
                </div>

                <button 
                  onClick={() => removeFromCart(item._id)}
                  style={{ background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: "0.8rem" }}
                >
                  REMOVE
                </button>
              </div>

              <div>€{(itemPrice * item.quantity).toFixed(2)}</div>

            </div>
          );
        })
      )}

      <div style={{ marginTop: "30px", borderTop: "1px solid #eee", paddingTop: "20px" }}>
        
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Subtotal</span>
          <span>€{subtotal.toFixed(2)}</span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Delivery</span>
          <span>€{delivery.toFixed(2)}</span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: "1.2rem", margin: "20px 0" }}>
          <span>Total</span>
          <span>€{total.toFixed(2)}</span>
        </div>

        <button
          onClick={handlePurchase}
          style={{
            width: "100%",
            padding: "15px",
            background: "#000",
            color: "#fff",
            border: "none",
            cursor: "pointer"
          }}
        >
          PURCHASE
        </button>

      </div>

    </div>
  );
};

export default CartSidebar;