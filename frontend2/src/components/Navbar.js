import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav style={{ background: '#1a1a2e', padding: '12px 24px', display: 'flex', gap: '16px', alignItems: 'center', color: 'white' }}>
      <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '18px' }}>🛒 ShopApp</Link>
      <div style={{ marginLeft: 'auto', display: 'flex', gap: '16px', alignItems: 'center' }}>
        <Link to="/cart" style={{ color: 'white', textDecoration: 'none' }}>Cart</Link>
        {user ? (
          <>
            <Link to="/orders" style={{ color: 'white', textDecoration: 'none' }}>My Orders</Link>
            {user.role === 'admin' && <Link to="/admin" style={{ color: '#ffd700', textDecoration: 'none' }}>Admin</Link>}
            <button onClick={logout} style={{ background: '#e94560', border: 'none', color: 'white', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Login</Link>
            <Link to="/register" style={{ color: 'white', textDecoration: 'none' }}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}