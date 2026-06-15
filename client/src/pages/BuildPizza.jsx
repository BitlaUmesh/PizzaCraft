import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axiosInstance';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const PRICE_MAP = {
  base: { 'Thin Crust': 100, 'Thick Crust': 120, 'Cheese Burst': 150, 'Whole Wheat': 130, 'Gluten-Free': 160 },
  sauce: { Tomato: 0, Pesto: 30, BBQ: 30, Alfredo: 40, Arrabbiata: 20 },
  cheese: { Mozzarella: 0, Cheddar: 30, Parmesan: 40, 'Vegan Cheese': 50, 'No Cheese': -20 },
  veggie: { Capsicum: 15, Olives: 20, Mushrooms: 25, Onions: 10, Tomatoes: 15, Jalapeños: 20, 'Sweet Corn': 15, Spinach: 15 },
};

const STEPS = ['Base', 'Sauce', 'Cheese', 'Veggies'];
const STEP_ICONS = { 'Thin Crust': '🫓', 'Thick Crust': '🍞', 'Cheese Burst': '🧀', 'Whole Wheat': '🌾', 'Gluten-Free': '🌿', Tomato: '🍅', Pesto: '🌿', BBQ: '🔥', Alfredo: '🤍', Arrabbiata: '🌶️', Mozzarella: '🧀', Cheddar: '🧈', Parmesan: '⭐', 'Vegan Cheese': '🌱', 'No Cheese': '🚫', Capsicum: '🫑', Olives: '🫒', Mushrooms: '🍄', Onions: '🧅', Tomatoes: '🍅', Jalapeños: '🌶️', 'Sweet Corn': '🌽', Spinach: '🥬' };

const BuildPizza = () => {
  const [step, setStep] = useState(0);
  const [options, setOptions] = useState({});
  const [selections, setSelections] = useState({ base: '', sauce: '', cheese: '', veggies: [] });
  const { addItem } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/pizzas/builder/options').then(({ data }) => setOptions(data.data));
  }, []);

  const getPrice = () => {
    let p = PRICE_MAP.base[selections.base] || 0;
    p += PRICE_MAP.sauce[selections.sauce] || 0;
    p += PRICE_MAP.cheese[selections.cheese] || 0;
    selections.veggies.forEach((v) => { p += PRICE_MAP.veggie[v] || 0; });
    return p;
  };

  const toggleVeggie = (v) => {
    setSelections((prev) => ({
      ...prev,
      veggies: prev.veggies.includes(v) ? prev.veggies.filter((x) => x !== v) : [...prev.veggies, v],
    }));
  };

  const canNext = () => {
    if (step === 0) return !!selections.base;
    if (step === 1) return !!selections.sauce;
    if (step === 2) return !!selections.cheese;
    return true;
  };

  const handleAddToCart = () => {
    addItem({ type: 'custom', pizzaName: 'Custom Pizza', customPizza: { base: selections.base, sauce: selections.sauce, cheese: selections.cheese, veggies: selections.veggies }, price: getPrice(), quantity: 1 });
    showToast('Custom pizza added to cart! 🍕', 'success');
    navigate('/cart');
  };

  const categoryKey = ['base', 'sauce', 'cheese', 'veggie'][step];
  const categoryOptions = options[categoryKey] || [];

  return (
    <div className="page">
      <div className="builder-container">
        <div className="section-header">
          <h2>🍕 Build Your Pizza</h2>
          <p>Customize every layer to your taste</p>
        </div>

        {/* Progress Bar */}
        <div className="builder-progress">
          {STEPS.map((s, i) => (
            <div key={s} className={`step-dot ${i <= step ? 'active' : ''}`} title={s} />
          ))}
        </div>

        <h3 style={{ marginBottom: '0.5rem' }}>Step {step + 1}: Choose your {STEPS[step]}</h3>
        <p className="text-muted text-sm mb-2">
          {step === 3 ? 'Pick as many as you like' : 'Select one option'}
        </p>

        <div className="option-grid">
          {categoryOptions.map(({ name, inStock }) => {
            const isSelected = step === 3 ? selections.veggies.includes(name) : selections[categoryKey] === name;
            return (
              <div key={name}
                className={`option-card ${isSelected ? 'selected' : ''} ${!inStock ? 'disabled' : ''}`}
                style={{ opacity: inStock ? 1 : 0.4, cursor: inStock ? 'pointer' : 'not-allowed' }}
                onClick={() => {
                  if (!inStock) return;
                  if (step === 3) toggleVeggie(name);
                  else setSelections({ ...selections, [categoryKey]: name });
                }}
              >
                <div className="option-icon">{STEP_ICONS[name] || '🍕'}</div>
                <div>{name}</div>
                {!inStock && <div style={{ fontSize: '0.7rem', color: 'var(--red)', marginTop: '2px' }}>Out of stock</div>}
              </div>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="flex-between mt-4">
          <button className="btn btn-ghost" onClick={() => setStep(step - 1)} disabled={step === 0}>← Back</button>
          {step < 3 ? (
            <button className="btn btn-primary" onClick={() => setStep(step + 1)} disabled={!canNext()}>Next →</button>
          ) : (
            <button className="btn btn-primary" onClick={handleAddToCart}>Add to Cart 🛒</button>
          )}
        </div>

        {/* Sticky price bar */}
        <div className="price-bar" style={{ marginTop: '2rem', borderRadius: 'var(--radius-md)' }}>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Current Price</div>
            <div className="price-total">₹{getPrice()}</div>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'right' }}>
            {selections.base && <div>Base: {selections.base}</div>}
            {selections.sauce && <div>Sauce: {selections.sauce}</div>}
            {selections.cheese && <div>Cheese: {selections.cheese}</div>}
            {selections.veggies.length > 0 && <div>Veggies: {selections.veggies.join(', ')}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuildPizza;
