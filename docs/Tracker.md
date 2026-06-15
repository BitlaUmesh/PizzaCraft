# 🍕 Pizza Delivery App — Progress Tracker (Tonight's Edition)

> **Timeline:** Tonight (approx. 6 hours)  
> **Legend:** `[ ]` Not Started | `[/]` In Progress | `[x]` Done

---

## 📊 Phase Summary

| Phase | Description | Status | Target Duration |
|-------|-------------|--------|-----------------|
| Phase 1 | Project Setup & Scaffold | [ ] | 30 mins |
| Phase 2 | Simplified Auth & Sessions | [ ] | 60 mins |
| Phase 3 | Menu & Custom Pizza Builder | [ ] | 90 mins |
| Phase 4 | Cart & Razorpay Checkout | [ ] | 60 mins |
| Phase 5 | Tracking & Admin Dashboard | [ ] | 60 mins |
| Phase 6 | End-to-End Verification | [ ] | 30 mins |

---

## Phase 1: Project Setup & Scaffold (30 mins)

### Tasks
- [ ] Initialize Express server + install essential dependencies (`express`, `mongoose`, `bcryptjs`, `jsonwebtoken`, `nodemailer`, `razorpay`, `cors`, `dotenv`)
- [ ] Create `server.js` with basic setup + Mongoose connection
- [ ] Initialize React frontend via Vite + install frontend dependencies (`axios`, `react-router-dom`)
- [ ] Configure client API proxy
- [ ] Create quick DB seeding script for standard pizzas & initial inventory

---

## Phase 2: Simplified Auth & Sessions (60 mins)

### Tasks
- [ ] Create Mongoose models: `User` and `Token`
- [ ] Build backend auth router with endpoints: `/register`, `/verify-email/:token`, `/login`, `/forgot-password`, `/reset-password/:token`
- [ ] Implement backend mock email fallback (log reset/verify links directly to console if SMTP is not configured)
- [ ] Build React forms: Login, Register, Forgot Password, Reset Password
- [ ] Create React `AuthContext` to store JWT in `localStorage` & handle protected routes

---

## Phase 3: Menu & Custom Pizza Builder (90 mins)

### Tasks
- [ ] Build standard menu view fetching from `/api/pizzas`
- [ ] Build 4-step wizard interface (Base → Sauce → Cheese → Veggies) as a single stateful React component
- [ ] Add live price calculation on the frontend wizard
- [ ] Add "Add to Cart" button (storing selections in React CartContext)

---

## Phase 4: Cart & Razorpay Checkout (60 mins)

### Tasks
- [ ] Render Cart layout (list items, quantities, total, address inputs)
- [ ] Integrate Razorpay script CDN
- [ ] Build backend route `POST /api/payment/create-order`
- [ ] Build backend verification route `POST /api/payment/verify`
- [ ] Implement order creation & inventory decrement logic on verification success

---

## Phase 5: Tracking & Admin Dashboard (60 mins)

### Tasks
- [ ] Implement user order status page with 5-second polling check to `/api/orders/:id/status`
- [ ] Build Admin page `/admin` with:
  - [ ] **Orders Tab**: View all active orders and status update dropdowns
  - [ ] **Inventory Tab**: View current stock and update quantities manually
- [ ] Connect order status updates to reflect instantly on status change (polling)

---

## Phase 6: End-to-End Verification (30 mins)

### Tasks
- [ ] Perform full manual user walk: Register → Verify email (link in console) → Login → Build Pizza → Checkout → Pay (Razorpay Test Mode) → Track order status
- [ ] Perform admin action: Change order status in admin panel → check user dashboard updates
- [ ] Verify low stock email triggers when inventory count falls below 20
