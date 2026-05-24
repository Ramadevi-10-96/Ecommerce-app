import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || []);

  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(res => setProducts(res.data));
  }, []);

  const addToCart = (product) => {
    const existing = cart.find(i => i._id === product._id);
    let newCart;
    if (existing) {
      newCart = cart.map(i => i._id === product._id ? { ...i, qty: i.qty + 1 } : i);
    } else {
      newCart = [...cart, { ...product, qty: 1 }];
    }
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    alert(`${product.name} added to cart!`);
  };

  return (
    <div style={{ padding: '24px' }}>
      <h2>Products</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px,1fr))', gap: '20px' }}>
        {products.map(p => (
          <div key={p._id} style={{ border: '1px solid #ddd', borderRadius: '10px', padding: '16px' }}>
            <img src={p.image || 'https://via.placeholder.com/200'} alt={p.name} style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '6px' }}/>
            <h3 style={{ margin: '10px 0 4px' }}>{p.name}</h3>
            <p style={{ color: '#555', fontSize: '14px' }}>{p.description}</p>
            <p style={{ fontWeight: 'bold', color: '#1a1a2e' }}>₹{p.price}</p>
            <button onClick={() => addToCart(p)} style={{ background: '#1a1a2e', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', width: '100%' }}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}