# 🍕 Pizza Delivery App — Database Schema

> **Database:** MongoDB | **ODM:** Mongoose  
> **Version:** 1.0.0 | **Date:** June 2026

---

## Collection Overview

| Collection | Description |
|------------|-------------|
| `users` | Customer and admin accounts |
| `pizzas` | Standard pizza menu items |
| `orders` | All placed orders |
| `inventory` | Ingredient stock tracking |
| `otptokens` | Email verification & password reset tokens |

---

## 1. User Schema (`users`)

```javascript
// models/User.js
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxLength: 100
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minLength: 6
    // Stored as bcrypt hash
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationExpiry: Date,
  passwordResetToken: String,
  passwordResetExpiry: Date,
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  phone: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Indexes
userSchema.index({ email: 1 });
```

### Field Notes:
| Field | Notes |
|-------|-------|
| `role` | "admin" set manually or via env seed |
| `isEmailVerified` | Must be true before login allowed |
| `emailVerificationToken` | Crypto random hex, 24hr expiry |
| `passwordResetToken` | Crypto random hex, 1hr expiry |

---

## 2. Pizza Schema (`pizzas`)

```javascript
// models/Pizza.js
const pizzaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String, // URL or file path
    required: true
  },
  category: {
    type: String,
    enum: ['veg', 'non-veg'],
    required: true
  },
  basePrice: {
    type: Number,
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  tags: [String] // e.g., ['popular', 'spicy', 'bestseller']
}, { timestamps: true });
```

---

## 3. Order Schema (`orders`)

```javascript
// models/Order.js
const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderType: {
    type: String,
    enum: ['standard', 'custom'],
    required: true
  },

  // For standard pizza orders
  pizzaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pizza'
  },

  // For custom pizza orders
  customPizza: {
    base: {
      type: String,
      enum: ['Thin Crust', 'Thick Crust', 'Cheese Burst', 'Whole Wheat', 'Gluten-Free']
    },
    sauce: {
      type: String,
      enum: ['Tomato', 'Pesto', 'BBQ', 'Alfredo', 'Arrabbiata']
    },
    cheese: {
      type: String,
      enum: ['Mozzarella', 'Cheddar', 'Parmesan', 'Vegan Cheese', 'No Cheese']
    },
    veggies: [{
      type: String,
      enum: ['Capsicum', 'Olives', 'Mushrooms', 'Onions', 'Tomatoes', 
             'Jalapeños', 'Sweet Corn', 'Spinach']
    }]
  },

  quantity: {
    type: Number,
    default: 1,
    min: 1
  },

  totalPrice: {
    type: Number,
    required: true
  },

  deliveryAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true }
  },

  status: {
    type: String,
    enum: ['Order Received', 'In Kitchen', 'Sent to Delivery'],
    default: 'Order Received'
  },

  payment: {
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    isPaid: { type: Boolean, default: false },
    paidAt: Date
  }
}, { timestamps: true });

// Indexes
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
```

### Status State Machine:
```
"Order Received" → "In Kitchen" → "Sent to Delivery"
(Admin-controlled transitions only)
```

---

## 4. Inventory Schema (`inventory`)

```javascript
// models/Inventory.js
const inventorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
    // e.g., "Thin Crust", "Mozzarella", "Tomato Sauce"
  },
  category: {
    type: String,
    enum: ['base', 'sauce', 'cheese', 'veggie', 'meat'],
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 100,
    min: 0
  },
  threshold: {
    type: Number,
    default: 20
    // Alert sent when quantity drops below this
  },
  unit: {
    type: String,
    default: 'units'
    // e.g., 'units', 'grams', 'kg'
  },
  isActive: {
    type: Boolean,
    default: true
    // Set false to hide from builder without deleting
  },
  lastRestockedAt: Date
}, { timestamps: true });

// Indexes
inventorySchema.index({ category: 1 });
inventorySchema.index({ quantity: 1 });
```

### Seed Data:
| Name | Category | Initial Qty | Threshold |
|------|----------|-------------|-----------|
| Thin Crust | base | 100 | 20 |
| Thick Crust | base | 100 | 20 |
| Cheese Burst | base | 100 | 20 |
| Whole Wheat | base | 100 | 20 |
| Gluten-Free | base | 50 | 15 |
| Tomato Sauce | sauce | 100 | 20 |
| Pesto | sauce | 80 | 20 |
| BBQ | sauce | 80 | 20 |
| Alfredo | sauce | 80 | 20 |
| Arrabbiata | sauce | 80 | 20 |
| Mozzarella | cheese | 100 | 20 |
| Cheddar | cheese | 100 | 20 |
| Parmesan | cheese | 80 | 20 |
| Vegan Cheese | cheese | 50 | 15 |
| Capsicum | veggie | 100 | 20 |
| Olives | veggie | 80 | 20 |
| Mushrooms | veggie | 80 | 20 |
| Onions | veggie | 100 | 20 |
| Jalapeños | veggie | 60 | 15 |
| Sweet Corn | veggie | 80 | 20 |
| Spinach | veggie | 60 | 15 |

---

## 5. OTP / Token Schema (`otptokens`)

```javascript
// models/OTPToken.js
// Handles email verification and password reset tokens
const otpTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  token: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['email_verification', 'password_reset'],
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  },
  isUsed: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Auto-delete expired tokens (TTL index)
otpTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
```

---

## 6. Price Calculation Logic

```javascript
// utils/priceCalculator.js

const PRICE_MAP = {
  base: {
    'Thin Crust': 100,
    'Thick Crust': 120,
    'Cheese Burst': 150,
    'Whole Wheat': 130,
    'Gluten-Free': 160
  },
  sauce: {
    'Tomato': 0,      // included
    'Pesto': 30,
    'BBQ': 30,
    'Alfredo': 40,
    'Arrabbiata': 20
  },
  cheese: {
    'Mozzarella': 0,  // included
    'Cheddar': 30,
    'Parmesan': 40,
    'Vegan Cheese': 50,
    'No Cheese': -20
  },
  veggie: {
    'Capsicum': 15,
    'Olives': 20,
    'Mushrooms': 25,
    'Onions': 10,
    'Tomatoes': 15,
    'Jalapeños': 20,
    'Sweet Corn': 15,
    'Spinach': 15
  }
};

function calculateCustomPizzaPrice({ base, sauce, cheese, veggies }) {
  let total = PRICE_MAP.base[base] || 0;
  total += PRICE_MAP.sauce[sauce] || 0;
  total += PRICE_MAP.cheese[cheese] || 0;
  veggies.forEach(v => { total += PRICE_MAP.veggie[v] || 0; });
  return total;
}
```

---

## 7. ER Diagram (Text)

```
User ─────────────────── Order
 1                          N
                            │
               ┌────────────┴──────────┐
               │                       │
            Pizza (ref)          CustomPizza (embedded)
               
Inventory ─── (decremented on order, no FK relationship)
OTPToken ──── User (FK: userId)
```
