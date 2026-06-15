import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { items, removeItem, total } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="page" style={{ textAlign: 'center', paddingTop: '4rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</div>
        <h2 style={{ marginBottom: '0.5rem' }}>Your cart is empty</h2>
        <p className="text-muted" style={{ marginBottom: '2rem' }}>Add some delicious pizzas to get started!</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/menu" className="btn btn-primary">Browse Menu</Link>
          <Link to="/build-pizza" className="btn btn-outline">Build a Pizza</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <h2 className="mb-4">Your Cart 🛒</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>
        {/* Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {items.map((item) => (
            <div key={item.cartId} className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              {item.image && <img src={item.image} alt={item.pizzaName} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />}
              {!item.image && <div style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-md)', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>🍕</div>}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{item.pizzaName}</div>
                {item.type === 'custom' && (
                  <div className="text-muted text-sm">
                    {[item.customPizza?.base, item.customPizza?.sauce, item.customPizza?.cheese, ...(item.customPizza?.veggies || [])].filter(Boolean).join(' · ')}
                  </div>
                )}
                <div style={{ color: 'var(--yellow)', fontWeight: '700', marginTop: '0.25rem' }}>₹{item.price}</div>
              </div>
              <button className="btn btn-danger btn-sm" onClick={() => removeItem(item.cartId)}>Remove</button>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="card" style={{ padding: '1.5rem', position: 'sticky', top: '80px' }}>
          <h3 style={{ marginBottom: '1.25rem' }}>Order Summary</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
            {items.map((item) => (
              <div key={item.cartId} className="flex-between text-sm">
                <span className="text-muted">{item.pizzaName}</span>
                <span>₹{item.price}</span>
              </div>
            ))}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }} className="flex-between">
              <span style={{ fontWeight: '700' }}>Total</span>
              <span style={{ color: 'var(--yellow)', fontFamily: 'Poppins', fontWeight: '700', fontSize: '1.25rem' }}>₹{total}</span>
            </div>
          </div>
          <button className="btn btn-primary btn-full" onClick={() => navigate('/checkout')}>
            Proceed to Checkout →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
