import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axiosInstance';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const PRICE_MAP = {
  base: { 'Thin Crust': 100, 'Thick Crust': 120, 'Cheese Burst': 150, 'Whole Wheat': 130, 'Gluten-Free': 160 },
  sauce: { Tomato: 0, Pesto: 30, BBQ: 30, Alfredo: 40, Arrabbiata: 20 },
  cheese: { Mozzarella: 0, Cheddar: 30, Parmesan: 40, 'Vegan Cheese': 50, 'No Cheese': -20 },
  veggie: { Capsicum: 15, Olives: 20, Mushrooms: 25, Onions: 10, Tomatoes: 15, Jalapeños: 20, 'Sweet Corn': 15, Spinach: 15 },
};

const PizzaCard = ({ pizza }) => {
  const { addItem } = useCart();
  const { showToast } = useToast();

  const handleAdd = () => {
    addItem({ type: 'standard', pizzaId: pizza._id, pizzaName: pizza.name, image: pizza.image, price: pizza.basePrice, quantity: 1 });
    showToast(`${pizza.name} added to cart! 🍕`, 'success');
  };

  return (
    <div className="pizza-card">
      <img className="pizza-card__image" src={pizza.image} alt={pizza.name} />
      <div className="pizza-card__body">
        <div className="flex-between mb-2" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
          <h3 className="pizza-card__name">{pizza.name}</h3>
          <span className={`badge badge-${pizza.category === 'veg' ? 'veg' : 'nonveg'}`}>
            {pizza.category === 'veg' ? '🟢 Veg' : '🔴 Non-Veg'}
          </span>
        </div>
        <p className="pizza-card__desc">{pizza.description}</p>
        <div className="pizza-card__footer">
          <span className="pizza-card__price">₹{pizza.basePrice}</span>
          <button className="btn btn-primary btn-sm" onClick={handleAdd}>Add to Cart</button>
        </div>
      </div>
    </div>
  );
};

const Menu = () => {
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/pizzas').then(({ data }) => {
      setPizzas(data.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="page">
      <div className="section-header">
        <h2>Our Menu 🍕</h2>
        <p>Choose from our premium pizzas or <Link to="/build-pizza">build your own</Link></p>
      </div>

      {loading ? (
        <div className="grid-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card">
              <div className="skeleton" style={{ height: '200px' }}></div>
              <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div className="skeleton" style={{ height: '20px', width: '70%' }}></div>
                <div className="skeleton" style={{ height: '14px' }}></div>
                <div className="skeleton" style={{ height: '14px', width: '80%' }}></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid-3">
          {pizzas.map((p) => <PizzaCard key={p._id} pizza={p} />)}
        </div>
      )}

      <div style={{ marginTop: '3rem', textAlign: 'center', padding: '2.5rem', background: 'var(--gradient-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🍕</div>
        <h3 style={{ marginBottom: '0.5rem' }}>Can't find what you want?</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Build your perfect custom pizza from scratch!</p>
        <Link to="/build-pizza" className="btn btn-primary">Build My Pizza</Link>
      </div>
    </div>
  );
};

export default Menu;
