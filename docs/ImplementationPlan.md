# 🍕 Pizza Delivery App — Implementation Plan (Tonight's Hackathon Edition)

> **Version:** 1.1.0 (Condensed)  
> **Target Timeline:** Tonight (~5-6 hours total)  
> **Goal:** Complete a functional end-to-end demo before morning.

---

## ⚡ Compressed Timeline & Scope

```
[Phase 1: Setup] ──▶ [Phase 2: Auth] ──▶ [Phase 3: Pizza Builder] ──▶ [Phase 4: Razorpay] ──▶ [Phase 5: Admin & Alerts]
    (30 mins)          (60 mins)              (90 mins)              (60 mins)               (60 mins)
```

---

## Phase 1: Setup & Project Scaffold (Target: 30 Mins)

### Objectives
Get the server running, database connected, and client proxying requests.

### Steps
1. **Backend Initialize**: 
   - Create `server/` directory, run `npm init -y`.
   - Install essential deps only: `express mongoose bcryptjs jsonwebtoken nodemailer razorpay cors dotenv`.
   - Create single `server.js` containing base setup + DB connection (MongoDB Atlas or local).
2. **Frontend Initialize**:
   - Create `client/` directory via Vite react template.
   - Install `axios` and `react-router-dom`.
   - Set up API client proxy.
3. **Database Hookup**:
   - Establish connection string in `.env`.
   - Create one quick seeding script for standard pizzas and initial inventory items.

---

## Phase 2: Simplified Auth & Session Management (Target: 60 Mins)

### Objectives
Complete login, registration, password reset, and email verification.

### Strategy for Speed
- Use simple **crypto tokens** stored in DB for verification & resets.
- Provide a **Mock Email logger** in console as a fallback if SMTP credentials aren't ready, so development is never blocked.
- Single route file `routes/auth.js` and controller `controllers/auth.js` to avoid file hopping.

### Steps
1. Create `User` schema + `Token` schema in backend.
2. Implement auth endpoints: `/register`, `/verify-email/:token`, `/login`, `/forgot-password`, `/reset-password/:token`.
3. Build responsive React forms: Login, Register, Forgot Password, Reset Password page.
4. Implement simple `AuthContext` to store JWT in `localStorage` and handle page redirects.

---

## Phase 3: Dashboard & Pizza Builder (Target: 90 Mins)

### Objectives
Standard menu browse & the 4-step custom pizza builder wizard.

### Strategy for Speed
- Bundle the step-by-step pizza builder into a single tabbed component wizard (`Step 1` to `Step 4`) using simple local React state.
- Live price calculated dynamically in frontend from a hardcoded mapping.

### Steps
1. Fetch and render standard pizzas from `/api/pizzas`.
2. Build Custom Pizza Wizard UI:
   - **Step 1**: Base (Radio buttons)
   - **Step 2**: Sauce (Radio buttons)
   - **Step 3**: Cheese (Radio buttons)
   - **Step 4**: Veggies (Checkboxes)
3. Add item (Standard or Custom config) to Cart (React Context).

---

## Phase 4: Cart & Razorpay Checkout Integration (Target: 60 Mins)

### Objectives
Review cart, pay with Razorpay (Test Mode), and decrement stock on success.

### Strategy for Speed
- Keep checkout simple: Address inputs & pay button on the same page as the cart summary.
- Verify payment signature on backend, decrement inventory, and save order in a single transaction/service call.

### Steps
1. Render Cart items, total price, and simple address input form.
2. Integrate Razorpay CDN checkout script.
3. Backend Razorpay Order Creation `/api/payment/create-order`.
4. Payment confirmation `/api/payment/verify` which:
   - Verifies Razorpay signature.
   - Decrements quantities of selected bases/sauces/cheeses/veggies in the DB.
   - Sends Order Confirmation email to user + Low Stock alert to admin if stock falls below 20.
   - Saves Order Document as paid.

---

## Phase 5: Tracking & Admin Dashboard (Target: 60 Mins)

### Objectives
Real-time tracking for the user, status updates + inventory control for the admin.

### Strategy for Speed
- Polling (5-second intervals) on the user order tracking page.
- Simple, single-view Admin Dashboard containing:
  1. Active Orders list with a status dropdown.
  2. Inventory table showing remaining quantities of bases/sauces/cheeses/veggies with an inline update button.

### Steps
1. Create `/api/orders/my-orders` and `/api/admin/orders` routes.
2. Implement 5s polling on user dashboard (`OrderStatus.jsx`).
3. Build Admin route `/admin` with tabs for **Orders** (update status dropdown) and **Inventory** (restock field).
4. Connect status change endpoints so user dashboard reflects status changes instantly.

---

## Phase 6: Quick Verification & Launch (Target: 30 Mins)

1. Perform end-to-end manual walk: Register → Click console verify link → Login → Build Pizza → checkout → test payment → see "Received" status → change in Admin to "Kitchen" then "Sent to Delivery" → verify real-time status update.
2. Trigger low-stock threshold manually by making consecutive orders or modifying quantity to confirm email notifications work.
