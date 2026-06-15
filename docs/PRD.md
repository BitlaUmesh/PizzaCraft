# 🍕 Pizza Delivery Application — Product Requirements Document (PRD)

> **Version:** 1.0.0  
> **Date:** June 2026  
> **Status:** Active  
> **Owner:** Product Team

---

## 1. Problem Statement

Local and mid-size pizzerias lack a modern, customizable online ordering platform that gives customers the joy of building their own pizza while giving admins full operational visibility — from inventory to delivery. Existing solutions are either too generic (no customization), too expensive (enterprise platforms), or too fragmented (separate tools for ordering, inventory, and notifications).

**Core Pain Points:**
- Customers cannot customize their pizzas with real-time ingredient choices
- Admins have no centralized visibility into stock, orders, and delivery status
- No automatic alerts when ingredients run low, causing surprise stockouts
- Customers have no real-time visibility into where their order is in the pipeline

---

## 2. Target Users

### 2.1 End Customers (Primary Users)
| Attribute | Description |
|-----------|-------------|
| Age Range | 18–45 years |
| Behavior | Tech-savvy, food enthusiasts who prefer online ordering |
| Device | Mobile-first, desktop secondary |
| Expectation | Seamless ordering, real-time tracking, custom pizza options |

### 2.2 Pizza Shop Admin (Secondary Users)
| Attribute | Description |
|-----------|-------------|
| Role | Shop manager / kitchen staff |
| Behavior | Needs operational control over orders and stock |
| Device | Desktop primary |
| Expectation | Quick order updates, low-stock alerts, inventory management |

---

## 3. Core Features

### 3.1 Authentication & Authorization

#### User Auth
- [ ] User Registration with email verification
- [ ] User Login / Logout (JWT-based)
- [ ] Forgot Password (email OTP / reset link)
- [ ] Role-based access: `user` and `admin`

#### Admin Auth
- [ ] Dedicated Admin Login (separate credentials)
- [ ] Protected admin routes / middleware

---

### 3.2 User-Facing Features

#### 3.2.1 Dashboard
- [ ] Display all available standard pizza varieties
- [ ] Each pizza card shows: name, image, price, description
- [ ] Filter/sort by category (veg/non-veg, price)

#### 3.2.2 Custom Pizza Builder
A step-by-step wizard with the following steps:

| Step | Category | Options |
|------|----------|---------|
| 1 | **Pizza Base** | Thin Crust, Thick Crust, Cheese Burst, Whole Wheat, Gluten-Free |
| 2 | **Sauce** | Tomato, Pesto, BBQ, Alfredo, Spicy Arrabbiata |
| 3 | **Cheese** | Mozzarella, Cheddar, Parmesan, Vegan Cheese, No Cheese |
| 4 | **Veggies** | Capsicum, Olives, Mushrooms, Onions, Tomatoes, Jalapeños, Sweet Corn, Spinach |

- [ ] Live price calculation as user selects ingredients
- [ ] Summary/preview panel before checkout

#### 3.2.3 Checkout & Payment
- [ ] Cart review page
- [ ] Razorpay integration (Test Mode)
- [ ] On payment success → Order is placed and confirmed
- [ ] On payment failure → Show appropriate error, allow retry

#### 3.2.4 Order Tracking
- [ ] User dashboard shows live order status
- [ ] Statuses: `Order Received` → `In Kitchen` → `Sent to Delivery`
- [ ] Real-time updates (polling or WebSockets)
- [ ] Notification/toast when status changes

---

### 3.3 Admin-Facing Features

#### 3.3.1 Order Management
- [ ] View all incoming orders in a list
- [ ] See order details: customer info, pizza config, price
- [ ] Change order status: `Order Received` → `In Kitchen` → `Sent to Delivery`

#### 3.3.2 Inventory Management
| Ingredient Category | Tracked Items |
|--------------------|--------------------|
| Pizza Base | Thin, Thick, Cheese Burst, Whole Wheat, Gluten-Free |
| Sauce | Tomato, Pesto, BBQ, Alfredo, Arrabbiata |
| Cheese | Mozzarella, Cheddar, Parmesan, Vegan, None |
| Veggies | All veggie options |
| Meat | Chicken, Pepperoni, Salami, etc. |

- [ ] Real-time stock count displayed in admin dashboard
- [ ] Stock auto-decrements when an order is placed
- [ ] Manual stock update / top-up by admin

#### 3.3.3 Low-Stock Email Notifications
- [ ] Threshold value defined per ingredient (e.g., < 20 units)
- [ ] Automated email sent to admin when any stock drops below threshold
- [ ] Email includes: ingredient name, current quantity, threshold

---

## 4. Success Criteria

### 4.1 Functional KPIs
| Metric | Target |
|--------|--------|
| Successful pizza orders placed end-to-end | 100% completion rate in testing |
| Payment success in Razorpay test mode | Must process without errors |
| Order status updates visible to user | < 2 second latency |
| Low-stock email trigger accuracy | Fires within 1 order of crossing threshold |
| Email verification flow | 100% deliverability in test environment |

### 4.2 Performance Benchmarks
| Area | Target |
|------|--------|
| Page Load Time (Dashboard) | < 2.5 seconds |
| API Response Time | < 500ms for 95th percentile |
| Mobile Responsiveness | Works on screens >= 375px |

### 4.3 Quality Gates
- [ ] All auth flows tested (register, login, forgot password, email verify)
- [ ] Custom pizza builder flow is error-free end-to-end
- [ ] Inventory correctly decrements on each order
- [ ] Admin can update all 3 order statuses
- [ ] User sees updated status without page refresh

---

## 5. Out of Scope (v1.0)

- Live GPS delivery tracking
- Multi-restaurant support
- Loyalty/rewards program
- Mobile native app (iOS/Android)
- Customer reviews and ratings
- Third-party delivery integration (Zomato/Swiggy)

---

## 6. Assumptions & Constraints

- Razorpay is used in **test mode only** — no real money flows
- Email notifications use a transactional email service (e.g., Nodemailer + Gmail SMTP or SendGrid)
- Single-store deployment (one pizza shop, one admin)
- MongoDB Atlas as hosted DB
- Deployment target: Render / Railway / VPS
