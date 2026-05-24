import React, { useEffect, useState } from 'react';
import axios from 'axios';

const statusColors = { pending: '#f39c12', processing: '#3498db', shipped: '#9b59b6', delivered: '#2ecc71' };

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:5000/api/orders/my', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setOrders(res.data));
  }, []);

  return (
    <div style={{ padding: '24px', maxWidth: '700px', margin: '0 auto' }}>
      <h2>My Orders</h2>
      {orders.length === 0 ? <p>No orders yet.</p> : orders.map(order => (
        <div key={order._id} style={{ border: '1px solid #ddd', borderRadius: '10px', padding: '16px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <strong>Order #{order._id.slice(-6).toUpperCase()}</strong>
            <span style={{ background: statusColors[order.status], color: 'white', padding: '2px 10px', borderRadius: '12px', fontSize: '12px' }}>
              {order.status}
            </span>
          </div>
          <p style={{ color: '#555', fontSize: '14px', margin: '6px 0' }}>
            {new Date(order.createdAt).toLocaleDateString()} · {order.items.length} items · ₹{order.total}
          </p>
          <p style={{ fontSize: '13px', color: '#888' }}>Deliver to: {order.address}</p>
        </div>
      ))}
    </div>
  );
}