const CartDrawer = ({ isOpen, onClose, cart }) => {
  return (
    <div className={`drawer ${isOpen ? 'open' : ''}`}>
      <h3>My Bag</h3>
      
      {/* Cart Item Row */}
      {cart.map((item) => (
        <div key={item.id} className="cart-item">
          <img src={item.image} alt={item.name} />
          <div>
            <p>{item.name} - {item.selectedVariant.name}</p>
            <button>REMOVE</button>
          </div>
          <div>
            <button>-</button> <span>{item.quantity}</span> <button>+</button>
          </div>
          <p>€{item.selectedVariant.price}</p>
        </div>
      ))}

      <hr />
      <div className="totals">
        <p>Subtotal: €{calculateSubtotal(cart)}</p>
        <p>Delivery: €3.95</p>
        <p>Total: €{calculateTotal(cart)}</p>
      </div>
      
      <button className="purchase-btn">PURCHASE</button>
    </div>
  );
};