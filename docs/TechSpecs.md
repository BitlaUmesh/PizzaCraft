# 🍕 Pizza Delivery Application — Technical Specifications

> **Version:** 1.0.0  
> **Date:** June 2026  
> **Status:** Active

---

## 1. Technology Stack Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                             │
│                React + Vite + React Router                  │
│          Axios  |  Context API  |  TailwindCSS             │
└─────────────────────────┬───────────────────────────────────┘
                          │ HTTP / WebSocket
┌─────────────────────────▼───────────────────────────────────┐
│                      API GATEWAY                            │
│               Node.js + Express.js                          │
│      JWT Auth Middleware | Rate Limiting | CORS            │
└──────────┬───────────────────────────────────┬──────────────┘
           │                                   │
┌──────────▼──────────┐             ┌──────────▼──────────────┐
│      MongoDB         │             │    External Services    │
│   (Atlas / Local)    │             │  Razorpay | Nodemailer │
│  Mongoose ODM        │             │  Gmail SMTP / SendGrid  │
└──────────────────────┘             └─────────────────────────┘
```

---

## 2. Frontend (React + Vite)

### 2.1 Project Structure
```
client/
├── public/
│   └── assets/               # Static images, pizza illustrations
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   └── VerifyEmail.jsx
│   │   ├── pizza-builder/
│   │   │   ├── PizzaBuilder.jsx
│   │   │   ├── StepBase.jsx
│   │   │   ├── StepSauce.jsx
│   │   │   ├── StepCheese.jsx
│   │   │   ├── StepVeggies.jsx
│   │   │   └── PizzaSummary.jsx
│   │   ├── dashboard/
│   │   │   ├── UserDashboard.jsx
│   │   │   ├── PizzaCard.jsx
│   │   │   └── OrderStatus.jsx
│   │   ├── cart/
│   │   │   ├── Cart.jsx
│   │   │   └── CartItem.jsx
│   │   ├── checkout/
│   │   │   └── Checkout.jsx
│   │   ├── admin/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── OrderList.jsx
│   │   │   ├── OrderCard.jsx
│   │   │   └── Inventory.jsx
│   │   └── shared/
│   │       ├── Navbar.jsx
│   │       ├── Footer.jsx
│   │       ├── Toast.jsx
│   │       ├── Loader.jsx
│   │       └── ProtectedRoute.jsx
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   ├── CartContext.jsx
│   │   └── OrderContext.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useCart.js
│   │   └── useOrderStatus.js
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Menu.jsx
│   │   ├── BuildPizza.jsx
│   │   ├── CartPage.jsx
│   │   ├── CheckoutPage.jsx
│   │   ├── MyOrders.jsx
│   │   ├── AdminPage.jsx
│   │   └── NotFound.jsx
│   ├── services/
│   │   ├── authService.js
│   │   ├── pizzaService.js
│   │   ├── orderService.js
│   │   └── adminService.js
│   ├── utils/
│   │   ├── axiosInstance.js
│   │   └── helpers.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env
├── package.json
└── vite.config.js
```

### 2.2 Routing Structure
| Route | Component | Access |
|-------|-----------|--------|
| `/` | Home | Public |
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/verify-email/:token` | VerifyEmail | Public |
| `/forgot-password` | ForgotPassword | Public |
| `/menu` | Menu | Protected (User) |
| `/build-pizza` | BuildPizza | Protected (User) |
| `/cart` | CartPage | Protected (User) |
| `/checkout` | CheckoutPage | Protected (User) |
| `/my-orders` | MyOrders | Protected (User) |
| `/admin` | AdminPage | Protected (Admin) |
| `/admin/inventory` | Inventory | Protected (Admin) |

### 2.3 State Management
- **React Context API** for global state (auth, cart, order status)
- **useState / useReducer** for local component state
- **Axios interceptors** to attach JWT and handle 401 redirects

### 2.4 Real-Time Updates
- **Polling Strategy**: `setInterval` polling `/api/orders/:id/status` every 5 seconds on the MyOrders page
- **Optional**: Socket.io upgrade in v1.1

---

## 3. API Gateway (Node.js + Express)

### 3.1 Project Structure
```
server/
├── config/
│   ├── db.js                  # MongoDB connection
│   ├── razorpay.js            # Razorpay instance
│   └── nodemailer.js          # Email transporter
├── controllers/
│   ├── authController.js
│   ├── pizzaController.js
│   ├── orderController.js
│   ├── paymentController.js
│   ├── inventoryController.js
│   └── adminController.js
├── middleware/
│   ├── authMiddleware.js      # JWT verification
│   ├── adminMiddleware.js     # Admin role check
│   ├── rateLimiter.js
│   └── errorHandler.js
├── models/
│   ├── User.js
│   ├── Pizza.js
│   ├── Order.js
│   ├── Inventory.js
│   └── OTP.js
├── routes/
│   ├── auth.routes.js
│   ├── pizza.routes.js
│   ├── order.routes.js
│   ├── payment.routes.js
│   ├── inventory.routes.js
│   └── admin.routes.js
├── services/
│   ├── emailService.js
│   ├── inventoryService.js
│   └── notificationService.js
├── utils/
│   ├── generateToken.js
│   ├── generateOTP.js
│   └── priceCalculator.js
├── .env
├── server.js
└── package.json
```

### 3.2 API Routes

#### Auth Routes (`/api/auth`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/register` | Register new user | None |
| POST | `/login` | User login | None |
| POST | `/admin/login` | Admin login | None |
| GET | `/verify-email/:token` | Verify email via token | None |
| POST | `/forgot-password` | Send reset email | None |
| POST | `/reset-password/:token` | Reset password | None |
| GET | `/me` | Get current user profile | User |
| POST | `/logout` | Logout | User |

#### Pizza Routes (`/api/pizzas`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | Get all pizzas | User |
| GET | `/:id` | Get single pizza | User |
| POST | `/` | Create pizza (admin) | Admin |
| PUT | `/:id` | Update pizza (admin) | Admin |
| DELETE | `/:id` | Delete pizza (admin) | Admin |
| GET | `/builder/options` | Get builder ingredient options | User |

#### Order Routes (`/api/orders`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/` | Place an order | User |
| GET | `/my-orders` | Get user's orders | User |
| GET | `/:id` | Get single order detail | User |
| GET | `/:id/status` | Get order status (polling) | User |
| GET | `/admin/all` | Get all orders | Admin |
| PATCH | `/:id/status` | Update order status | Admin |

#### Payment Routes (`/api/payment`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/create-order` | Create Razorpay order | User |
| POST | `/verify` | Verify payment signature | User |

#### Inventory Routes (`/api/inventory`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | Get all inventory | Admin |
| PATCH | `/:id` | Update stock quantity | Admin |
| POST | `/restock` | Bulk restock | Admin |

### 3.3 Middleware Stack
```javascript
// Order of middleware in server.js
app.use(cors())
app.use(express.json())
app.use(rateLimiter)
app.use('/api/auth', authRoutes)
app.use('/api/pizzas', authenticate, pizzaRoutes)
app.use('/api/orders', authenticate, orderRoutes)
app.use('/api/payment', authenticate, paymentRoutes)
app.use('/api/inventory', authenticate, isAdmin, inventoryRoutes)
app.use('/api/admin', authenticate, isAdmin, adminRoutes)
app.use(errorHandler)
```

---

## 4. Database (MongoDB + Mongoose)

- **Host**: MongoDB Atlas (cloud) or local MongoDB for dev
- **ODM**: Mongoose v7+
- **Connection**: Singleton pattern in `config/db.js`
- **Indexing**: Indexed on `email` (User), `orderId`, `userId` (Order), `category` (Inventory)

---

## 5. Authentication Strategy

| Layer | Technology |
|-------|------------|
| Password Hashing | bcryptjs (salt rounds: 10) |
| Token Generation | jsonwebtoken (JWT) |
| Token Storage | localStorage (client-side) |
| Token Expiry | 7 days (access token) |
| Email Verification | Crypto token (24hr expiry) stored in DB |
| Password Reset | Crypto token (1hr expiry) stored in DB |
| Admin Auth | Separate env-level credentials + role flag |

---

## 6. Payment Integration (Razorpay)

### Flow:
```
Client                     Server                    Razorpay
  │                          │                           │
  │──POST /payment/create──→ │                           │
  │                          │──Create Order──────────→  │
  │                          │ ←──Order ID + Amount──── │
  │ ←──{orderId, amount}─── │                           │
  │                          │                           │
  │ (User completes payment in Razorpay modal)           │
  │                          │                           │
  │──POST /payment/verify──→ │                           │
  │                          │ (Verify HMAC Signature)   │
  │ ←──{success: true}────  │                           │
  │                          │                           │
  │     (Order confirmed, inventory decremented)         │
```

### Environment Variables:
```
RAZORPAY_KEY_ID=rzp_test_xxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxx
```

---

## 7. Email Service (Nodemailer)

### Templates:
| Email Type | Trigger |
|------------|---------|
| Email Verification | On user registration |
| Welcome Email | After email verified |
| Password Reset | On forgot password request |
| Low Stock Alert | When ingredient < threshold |
| Order Confirmation | After successful payment |

### Transport Config:
```javascript
// Gmail SMTP (dev) / SendGrid (prod)
transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS  // App password
  }
})
```

---

## 8. Environment Variables

### Server `.env`
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d

EMAIL_USER=your@gmail.com
EMAIL_PASS=your_app_password
ADMIN_EMAIL=admin@pizzaapp.com

RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxx

CLIENT_URL=http://localhost:5173
STOCK_THRESHOLD=20
```

### Client `.env`
```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxx
```

---

## 9. Third-Party Dependencies

### Server
```json
{
  "express": "^4.18.x",
  "mongoose": "^7.x",
  "bcryptjs": "^2.x",
  "jsonwebtoken": "^9.x",
  "nodemailer": "^6.x",
  "razorpay": "^2.x",
  "cors": "^2.x",
  "dotenv": "^16.x",
  "express-rate-limit": "^7.x",
  "crypto": "built-in"
}
```

### Client
```json
{
  "react": "^18.x",
  "react-dom": "^18.x",
  "react-router-dom": "^6.x",
  "axios": "^1.x",
  "razorpay-checkout": "CDN script tag"
}
```

---

## 10. Deployment Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌────────────────┐
│   Vercel /       │     │   Render /       │     │  MongoDB Atlas │
│   Netlify        │────▶│   Railway        │────▶│  (Cloud DB)    │
│  (React Client)  │     │ (Node.js Server) │     │                │
└─────────────────┘     └─────────────────┘     └────────────────┘
```
