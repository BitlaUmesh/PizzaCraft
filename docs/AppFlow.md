# 🍕 Pizza Delivery App — Application Flow

> **Version:** 1.0.0 | **Date:** June 2026

---

## 1. User Registration & Email Verification
```
[Register Form: Name, Email, Password]
      ↓
POST /api/auth/register
      ↓
Email already exists? → Error toast
      ↓
Hash password → Save user (unverified) → Generate crypto token
      ↓
Send Verification Email → "Check your inbox!"
      ↓
User clicks link → GET /api/auth/verify-email/:token
      ↓
Token valid? → Mark user verified → Redirect to Login
Token expired? → "Link expired" error page
```

## 2. User Login
```
[Login Form: Email, Password]
      ↓
POST /api/auth/login
      ↓
Invalid credentials? → Error toast
Email not verified? → "Please verify email" error
      ↓
Generate JWT → Store in localStorage
      ↓
Role = "user"  → User Dashboard (/menu)
Role = "admin" → Admin Dashboard (/admin)
```

## 3. Forgot Password
```
[Enter Email]
      ↓
POST /api/auth/forgot-password
      ↓
Generate reset token (1hr expiry) → Send reset email
      ↓
User clicks link → Reset Password Form
      ↓
POST /api/auth/reset-password/:token
      ↓
Validate token → Update password → Redirect to Login
```

## 4. Browse Menu & Pizza Builder

### 4.1 Browse Menu
```
[User Dashboard]
      ↓
GET /api/pizzas → Display pizza cards (name, image, price)
      ↓
"Add to Cart" → Cart updated in Context
"Build Your Own" → Pizza Builder Wizard
```

### 4.2 Custom Pizza Builder Wizard (4 Steps)
```
STEP 1 — Base (pick 1):
  Thin Crust | Thick Crust | Cheese Burst | Whole Wheat | Gluten-Free
      ↓
STEP 2 — Sauce (pick 1):
  Tomato | Pesto | BBQ | Alfredo | Arrabbiata
      ↓
STEP 3 — Cheese (pick 1):
  Mozzarella | Cheddar | Parmesan | Vegan Cheese | No Cheese
      ↓
STEP 4 — Veggies (pick multiple):
  Capsicum | Olives | Mushrooms | Onions | Tomatoes | Jalapeños | Corn | Spinach
      ↓
[Live price shown throughout → ADD TO CART]
```

## 5. Cart & Checkout
```
[Cart Page: Items, Qty controls, Grand Total]
      ↓
[Checkout Page: Address, Order Summary]
      ↓
[PAY WITH RAZORPAY]
      ↓
POST /api/payment/create-order → Razorpay order created
      ↓
Razorpay Modal Opens (Test Mode)
      ↓
SUCCESS → POST /api/payment/verify → Verify HMAC signature
         → POST /api/orders → Decrement inventory
         → Send confirmation email → Redirect /my-orders
FAILURE → Error toast → Stay on checkout
```

## 6. Order Status Tracking (User)
```
[My Orders Page]
GET /api/orders/my-orders → List all orders with status

For active orders: Poll GET /api/orders/:id/status every 5 seconds

Status progression:
🔵 Order Received → 🟡 In Kitchen → 🟢 Sent to Delivery

Toast notification fires on each status change
```

## 7. Admin — Order Management
```
[Admin Dashboard — Orders Tab]
GET /api/admin/orders/all → List all orders

Admin clicks [Update Status] dropdown:
  1. Order Received
  2. In Kitchen
  3. Sent to Delivery

PATCH /api/orders/:id/status → DB updated → User dashboard reflects on next poll
```

## 8. Admin — Inventory Management
```
[Admin Dashboard — Inventory Tab]
GET /api/inventory → Table of all ingredients with qty + threshold

Admin edits qty → PATCH /api/inventory/:id → DB updated
```

## 9. Low-Stock Email Alert (Automated)
```
Order placed → inventoryService.decrementStock(ingredients)
      ↓
After decrement: check each ingredient
IF qty < threshold (default: 20)
      ↓
notificationService.sendLowStockAlert()
      ↓
Nodemailer email to ADMIN_EMAIL:
  Subject: "⚠️ Low Stock Alert: [Ingredient Name]"
  Body: Current qty, threshold, restock request
```

## 10. Complete Happy Path
```
Register → Verify Email → Login → Browse Menu
→ Build Custom Pizza → Add to Cart → Checkout
→ Pay via Razorpay → Payment Verified → Order Created
→ Inventory Decremented → [Email alert if stock < threshold]
→ User: "Order Received" → Admin updates: "In Kitchen"
→ User sees update → Admin updates: "Sent to Delivery"
→ User sees final status 🎉
```
