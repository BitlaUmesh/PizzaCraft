import { useEffect, useState, useRef } from 'react';
import api from '../utils/axiosInstance';
import { useToast } from '../context/ToastContext';

const STATUS_CONFIG = {
  'Order Received': { step: 0, icon: '📋', class: 'badge-received' },
  'In Kitchen': { step: 1, icon: '👨‍🍳', class: 'badge-kitchen' },
  'Sent to Delivery': { step: 2, icon: '🚴', class: 'badge-delivery' },
};

const OrderCard = ({ order }) => {
  const [status, setStatus] = useState(order.status);
  const [updatedAt, setUpdatedAt] = useState(order.updatedAt);
  const prevStatusRef = useRef(order.status);
  const { showToast } = useToast();

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const { data } = await api.get(`/orders/${order._id}/status`);
        if (data.data.status !== prevStatusRef.current) {
          prevStatusRef.current = data.data.status;
          setStatus(data.data.status);
          setUpdatedAt(data.data.updatedAt);
          showToast(`Order update: "${data.data.status}" 🍕`, 'info');
        }
      } catch { /* silently fail */ }
    }, 5000);
    return () => clearInterval(interval);
  }, [order._id]);

  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG['Order Received'];
  const steps = ['Order Received', 'In Kitchen', 'Sent to Delivery'];

  return (
    <div className="card" style={{ padding: '1.5rem', marginBottom: '1rem' }}>
      <div className="flex-between mb-2" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <div className="text-muted text-sm">Order ID</div>
          <div style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{order._id}</div>
        </div>
        <span className={`badge ${cfg.class}`}>{cfg.icon} {status}</span>
      </div>

      <div className="flex-between text-sm mb-2" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
        <span className="text-muted">{order.pizzaName || (order.orderType === 'custom' ? 'Custom Pizza' : 'Pizza')}</span>
        <span style={{ color: 'var(--yellow)', fontWeight: '700' }}>₹{order.totalPrice}</span>
      </div>

      {/* Status timeline */}
      <div className="order-timeline" style={{ marginTop: '1rem' }}>
        {steps.map((s, i) => {
          const done = cfg.step > i;
          const active = cfg.step === i;
          return (
            <>
              <div key={s} className="timeline-step">
                <div className={`timeline-dot ${done ? 'done' : active ? 'active' : ''}`}>
                  {done ? '✓' : STATUS_CONFIG[s]?.icon}
                </div>
                <div className="timeline-label">{s.replace(' to ', '\nto ')}</div>
              </div>
              {i < steps.length - 1 && <div className={`timeline-line ${done ? 'done' : ''}`} />}
            </>
          );
        })}
      </div>

      <div className="text-muted text-sm mt-2" style={{ textAlign: 'right' }}>
        Updated: {new Date(updatedAt).toLocaleTimeString()}
      </div>
    </div>
  );
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/my-orders').then(({ data }) => {
      setOrders(data.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="page">
      <div className="section-header">
        <h2>My Orders 📦</h2>
        <p>Track your active orders in real-time (auto-refreshes every 5 seconds)</p>
      </div>

      {loading && <p className="text-muted">Loading your orders...</p>}
      {!loading && orders.length === 0 && (
        <div style={{ textAlign: 'center', paddingTop: '3rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
          <h3 style={{ marginBottom: '0.5rem' }}>No orders yet</h3>
          <p className="text-muted">Place your first order!</p>
        </div>
      )}
      {orders.map((order) => <OrderCard key={order._id} order={order} />)}
    </div>
  );
};

export default MyOrders;
