import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to={isAuthenticated ? (isAdmin ? '/admin' : '/menu') : '/'} className="navbar-brand">
        🍕 PizzaCraft
      </Link>

      <div className="navbar-links">
        {isAuthenticated && !isAdmin && (
          <>
            <Link to="/menu" className="navbar-link">Menu</Link>
            <Link to="/build-pizza" className="navbar-link">Build Pizza</Link>
            <Link to="/my-orders" className="navbar-link">My Orders</Link>
            <Link to="/cart" className="navbar-link" style={{ position: 'relative' }}>
              🛒
              {count > 0 && (
                <span style={{
                  position: 'absolute', top: '-8px', right: '-10px',
                  background: 'var(--orange)', color: '#fff', borderRadius: '50%',
                  width: '18px', height: '18px', fontSize: '11px', fontWeight: '700',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>{count}</span>
              )}
            </Link>
          </>
        )}
        {isAuthenticated && isAdmin && (
          <Link to="/admin" className="navbar-link">Admin Panel</Link>
        )}
        {isAuthenticated ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Hi, {user?.name?.split(' ')[0]}</span>
            <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
