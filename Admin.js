import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', price: '', image: '', category: '', stock: '' });
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get('http://localhost:5000/api/products').then(r => setProducts(r.data));
    axios.get('http://localhost:5000/api/orders', { headers: { Authorization: `Bearer ${token}` } }).then(r => setOrders(r.data));
  }, []);

  const addProduct = async (e) => {
    e.preventDefault();
    const res = await axios.post('http://localhost:5000/api/products', { ...form, price: Number(form.price), stock: Number(form.stock) },
      { headers: { Authorization: `Bearer ${token}` } });
    setProducts([...products, res.data]);
    setForm({ name: '', description: '', price: '', image: '', category: '', stock: '' });
    alert('Product added!');
  };

  const deleteProduct = async (id) => {
    await axios.delete(`http://localhost:5000/api/products/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    setProducts(products.filter(p => p._id !== id));
  };

  const updateStatus = async (id, status) => {
    await axios.put(`http://localhost:5000/api/orders/${id}`, { status }, { headers: { Authorization: `Bearer ${token}` } });
    setOrders(orders.map(o => o._id === id ? { ...o, status } : o));
  };

  const inputStyle = { width: '100%', padding: '8px', margin: '4px 0', borderRadius: '6px', border: '1px solid #ddd', boxSizing: 'border-box' };

  return (
    <div style={{ padding: '24px' }}>
      <h2>Admin Dashboard</h2>

      <h3>Add Product</h3>
      <form onSubmit={addProduct} style={{ maxWidth: '500px', marginBottom: '32px' }}>
        <input placeholder="Product name" value={form.name} onChange={e => setForm({...form,name:e.target.value})} style={inputStyle} required/>
        <input placeholder="Description" value={form.description} onChange={e => setForm({...form,description:e.target.value})} style={inputStyle}/>
        <input placeholder="Price (₹)" value={form.price} onChange={e => setForm({...form,price:e.target.value})} style={inputStyle} required/>
        <input placeholder="Image URL" value={form.image} onChange={e => setForm({...form,image:e.target.value})} style={inputStyle}/>
        <input placeholder="Category" value={form.category} onChange={e => setForm({...form,category:e.target.value})} style={inputStyle}/>
        <input placeholder="Stock quantity" value={form.stock} onChange={e => setForm({...form,stock:e.target.value})} style={inputStyle}/>
        <button type="submit" style={{ background: '#27ae60', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '6px', cursor: 'pointer', marginTop: '8px' }}>Add Product</button>
      </form>

      <h3>Products ({products.length})</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '32px' }}>
        <thead><tr style={{ background: '#f5f5f5' }}>
          <th style={{ padding: '10px', textAlign: 'left' }}>Name</th>
          <th style={{ padding: '10px', textAlign: 'left' }}>Price</th>
          <th style={{ padding: '10px', textAlign: 'left' }}>Stock</th>
          <th style={{ padding: '10px' }}>Action</th>
        </tr></thead>
        <tbody>{products.map(p => (
          <tr key={p._id} style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '10px' }}>{p.name}</td>
            <td style={{ padding: '10px' }}>₹{p.price}</td>
            <td style={{ padding: '10px' }}>{p.stock}</td>
            <td style={{ padding: '10px', textAlign: 'center' }}>
              <button onClick={() => deleteProduct(p._id)} style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '5px 12px', borderRadius: '5px', cursor: 'pointer' }}>Delete</button>
            </td>
          </tr>
        ))}</tbody>
      </table>

      <h3>Orders ({orders.length})</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead><tr style={{ background: '#f5f5f5' }}>
          <th style={{ padding: '10px', textAlign: 'left' }}>Order ID</th>
          <th style={{ padding: '10px', textAlign: 'left' }}>Customer</th>
          <th style={{ padding: '10px', textAlign: 'left' }}>Total</th>
          <th style={{ padding: '10px', textAlign: 'left' }}>Status</th>
        </tr></thead>
        <tbody>{orders.map(o => (
          <tr key={o._id} style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '10px', fontSize: '13px' }}>#{o._id.slice(-6).toUpperCase()}</td>
            <td style={{ padding: '10px' }}>{o.user?.name}</td>
            <td style={{ padding: '10px' }}>₹{o.total}</td>
            <td style={{ padding: '10px' }}>
              <select value={o.status} onChange={e => updateStatus(o._id, e.target.value)} style={{ padding: '4px 8px', borderRadius: '4px' }}>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
              </select>
            </td>
          </tr>
        ))}</tbody>
      </table>
    </div>
  );
}