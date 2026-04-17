import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

const OrderPage = () => {
  const { cart } = useContext(CartContext);

  // Simple calculation for subtotal
  const subtotal = cart.reduce((acc, item) => acc + item.selectedVariant.price, 0);
  const delivery = 3.95;

  return (
    <div style={{ padding: '50px' }}>
      <h1>Your Order</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cart.map((item, index) => (
            <div key={index} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p>{item.name} - {item.selectedVariant.name}</p>
              <p>€{item.selectedVariant.price}</p>
            </div>
          ))}
          <hr />
          <p>Subtotal: €{subtotal.toFixed(2)}</p>
          <p>Delivery: €{delivery}</p>
          <h3>Total: €{(subtotal + delivery).toFixed(2)}</h3>
          
          <button onClick={() => alert("Proceeding to payment...")}>
            PURCHASE
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderPage;