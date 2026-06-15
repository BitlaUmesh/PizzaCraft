import { useEffect, useState } from 'react';
import api from '../utils/axiosInstance';
import { useToast } from '../context/ToastContext';

const STATUS_OPTIONS = ['Order Received', 'In Kitchen', 'Sent to Delivery'];

const AdminPanel = () => {
  const [tab, setTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [ordersRes, invRes] = await Promise.all([
          api.get('/orders/admin/all'),
          api.get('/inventory'),
        ]);
        setOrders(ordersRes.data.data);
        setInventory(invRes.data.data);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleStatusChange = async (orderId, status) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status });
      setOrders((prev) => prev.map((o) => o._id === orderId ? { ...o, status } : o));
      showToast(`Status updated to "${status}"`, 'success');
    } catch {
      showToast('Failed to update status', 'error');
    }
  };

  const handleStockUpdate = async (id, qty) => {
    try {
      await api.patch(`/inventory/${id}`, { quantity: Number(qty) });
      setInventory((prev) => prev.map((i) => i._id === id ? { ...i, quantity: Number(qty) } : i));
      showToast('Stock updated!', 'success');
    } catch {
      showToast('Failed to update stock', 'error');
    }
  };

  const pendingOrders = orders.filter((o) => o.status !== 'Sent to Delivery').length;
  const lowStockCount = inventory.filter((i) => i.quantity < i.threshold).length;

  return (
    <div className="page">
      <div className="flex-between mb-4" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>Admin Panel 🛠️</h2>
          <p className="text-muted">Manage orders and inventory</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid-3 mb-4" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {[
          { label: 'Total Orders', value: orders.length, icon: '📦', color: 'var(--blue)' },
          { label: 'Active Orders', value: pendingOrders, icon: '🔄', color: 'var(--amber)' },
          { label: 'Low Stock Items', value: lowStockCount, icon: '⚠️', color: 'var(--red)' },
        ].map(({ label, value, icon, color }) => (
          <div key={label} className="card" style={{ padding: '1.25rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{icon}</div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color, fontFamily: 'Poppins' }}>{value}</div>
            <div className="text-muted text-sm">{label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button className={`tab-btn ${tab === 'orders' ? 'active' : ''}`} onClick={() => setTab('orders')}>📦 Orders</button>
        <button className={`tab-btn ${tab === 'inventory' ? 'active' : ''}`} onClick={() => setTab('inventory')}>📊 Inventory</button>
      </div>

      {loading && <p className="text-muted">Loading...</p>}

      {/* Orders Tab */}
      {!loading && tab === 'orders' && (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Pizza</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Update</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{order._id.slice(-8)}</td>
                  <td>{order.userId?.name || '—'}</td>
                  <td>{order.pizzaName || (order.orderType === 'custom' ? '🍕 Custom Pizza' : '—')}</td>
                  <td style={{ color: 'var(--yellow)', fontWeight: '600' }}>₹{order.totalPrice}</td>
                  <td>
                    <span className={`badge badge-${order.status === 'Order Received' ? 'received' : order.status === 'In Kitchen' ? 'kitchen' : 'delivery'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      style={{ background: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '0.35rem 0.6rem', fontSize: '0.85rem', cursor: 'pointer' }}
                    >
                      {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr><td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No orders yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Inventory Tab */}
      {!loading && tab === 'inventory' && (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Ingredient</th>
                <th>Category</th>
                <th>Current Qty</th>
                <th>Threshold</th>
                <th>Status</th>
                <th>Update Stock</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => {
                const isLow = item.quantity < item.threshold;
                return (
                  <tr key={item._id}>
                    <td style={{ fontWeight: '500' }}>{item.name}</td>
                    <td style={{ textTransform: 'capitalize', color: 'var(--text-muted)' }}>{item.category}</td>
                    <td style={{ color: isLow ? 'var(--red)' : 'var(--green)', fontWeight: '700' }}>{item.quantity}</td>
                    <td className="text-muted">{item.threshold}</td>
                    <td>
                      <span className={`badge ${isLow ? 'badge-nonveg' : 'badge-veg'}`}>
                        {isLow ? '⚠️ Low' : '✅ OK'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <input
                          type="number"
                          defaultValue={item.quantity}
                          min="0"
                          id={`stock-${item._id}`}
                          style={{ background: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '0.35rem 0.6rem', width: '80px', fontSize: '0.85rem' }}
                        />
                        <button className="btn btn-outline btn-sm"
                          onClick={() => handleStockUpdate(item._id, document.getElementById(`stock-${item._id}`).value)}>
                          Save
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
