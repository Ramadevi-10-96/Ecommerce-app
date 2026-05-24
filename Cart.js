import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || []);
  const navigate = useNavigate();

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  const remove = (id) => {
    const updated = cart.filter(i => i._id !== id);
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const checkout = async () => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');
    try {
      await axios.post('http://localhost:5000/api/orders', {
        items: cart.map(i => ({ product: i._id, quantity: i.qty, price: i.price })),
        total,
        address: prompt('Enter delivery address:')
      }, { headers: { Authorization: `Bearer ${token}` } });
      localStorage.removeItem('cart');
      setCart([]);
      alert('Order placed successfully!');
      navigate('/orders');
    } catch (err) {
      alert('Checkout failed. Please login.');
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '700px', margin: '0 auto' }}>
      <h2>Your Cart</h2>
      {cart.length === 0 ? <p>Cart is empty.</p> : (
        <>
          {cart.map(item => (
            <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', border: '1px solid #eee', borderRadius: '8px', marginBottom: '10px' }}>
              <div>
                <strong>{item.name}</strong>
                <p style={{ margin: 0, color: '#555', fontSize: '14px' }}>Qty: {item.qty} × ₹{item.price}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <strong>₹{item.price * item.qty}</strong>
                <button onClick={() => remove(item._id)} style={{ background: '#e94560', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>Remove</button>
              </div>
            </div>
          ))}
          <div style={{ textAlign: 'right', marginTop: '16px' }}>
            <strong style={{ fontSize: '18px' }}>Total: ₹{total}</strong>
            <br/>
            <button onClick={checkout} style={{ background: '#1a1a2e', color: 'white', border: 'none', padding: '12px 28px', borderRadius: '8px', cursor: 'pointer', marginTop: '12px', fontSize: '16px' }}>
              Place Order
            </button>
          </div>
        </>
      )}
    </div>
  );
}