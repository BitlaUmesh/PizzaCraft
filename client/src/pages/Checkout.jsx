import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axiosInstance';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const Checkout = () => {
  const { items, total, clearCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [address, setAddress] = useState({ street: '', city: '', pincode: '' });
  const [loading, setLoading] = useState(false);

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleAddressChange = (e) => setAddress({ ...address, [e.target.name]: e.target.value });

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Create Razorpay order on server
      const { data: orderData } = await api.post('/payment/create-order', { amount: total });
      const rpOrder = orderData.data;

      // 2. Open Razorpay modal
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: rpOrder.amount,
        currency: rpOrder.currency,
        order_id: rpOrder.id,
        name: 'PizzaCraft 🍕',
        description: `Order for ${items.length} item(s)`,
        theme: { color: '#FF6B35' },
        handler: async (response) => {
          try {
            // 3. Verify payment and place order for each cart item
            for (const item of items) {
              await api.post('/payment/verify', {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                orderData: {
                  orderType: item.type,
                  pizzaId: item.pizzaId,
                  pizzaName: item.pizzaName,
                  customPizza: item.customPizza,
                  quantity: item.quantity || 1,
                  totalPrice: item.price,
                  deliveryAddress: address,
                },
              });
            }
            clearCart();
            showToast('Order placed successfully! 🎉', 'success');
            navigate('/my-orders');
          } catch (err) {
            showToast('Payment verified but order creation failed. Please contact support.', 'error');
          }
        },
        modal: { ondismiss: () => { showToast('Payment cancelled', 'warning'); setLoading(false); } },
      };

      if (!window.Razorpay) {
        showToast('Razorpay not loaded. Check your internet connection.', 'error');
        setLoading(false);
        return;
      }
      new window.Razorpay(options).open();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to initiate payment', 'error');
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h2 className="mb-4">Checkout 💳</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>
        {/* Address Form */}
        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Delivery Address</h3>
          <form onSubmit={handlePayment} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Street Address</label>
              <input className="form-input" name="street" placeholder="123 Main Street" value={address.street} onChange={handleAddressChange} required />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">City</label>
                <input className="form-input" name="city" placeholder="Bangalore" value={address.city} onChange={handleAddressChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Pincode</label>
                <input className="form-input" name="pincode" placeholder="560001" value={address.pincode} onChange={handleAddressChange} required pattern="[0-9]{6}" />
              </div>
            </div>
            <button className="btn btn-primary btn-full" type="submit" disabled={loading} style={{ marginTop: '0.5rem' }}>
              {loading ? 'Processing...' : `Pay ₹${total} with Razorpay 🔒`}
            </button>
          </form>
          <p className="text-muted text-sm text-center mt-2">🔒 Secured by Razorpay. Test mode active.</p>
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
        </div>
      </div>
    </div>
  );
};

export default Checkout;
