# 🍕 Pizza Delivery App — Engineering Rules & Conventions

> **Version:** 1.0.0 | **Date:** June 2026  
> These rules must be followed throughout development to maintain consistency, security, and quality.

---

## 1. Project Structure Rules

### ✅ DO
- Keep server and client as **separate directories** (`server/` and `client/`)
- Follow the predefined folder structure from TechSpecs.md
- Create one file per component, controller, service, and model
- Group related files in their designated folders only

### ❌ DON'T
- Don't put business logic in route files — use controllers
- Don't put DB queries in controllers — use services where complex
- Don't put sensitive credentials in source code — always use `.env`
- Don't mix server and client code

---

## 2. Naming Conventions

### Files
| Type | Convention | Example |
|------|-----------|---------|
| React Component | PascalCase.jsx | `PizzaCard.jsx` |
| Hook | camelCase prefixed with "use" | `useAuth.js` |
| Context | PascalCase + Context | `AuthContext.jsx` |
| Service (client) | camelCase + Service | `authService.js` |
| Controller (server) | camelCase + Controller | `authController.js` |
| Model | PascalCase singular | `User.js` |
| Route file | camelCase + .routes.js | `auth.routes.js` |
| Middleware | camelCase + Middleware | `authMiddleware.js` |
| Utility | camelCase | `generateToken.js` |
| Config | camelCase | `db.js`, `razorpay.js` |

### Variables & Functions
- **camelCase** for all variables and functions
- **PascalCase** for React components and class names
- **UPPER_SNAKE_CASE** for constants
- **Prefix booleans** with `is`, `has`, `can`: `isVerified`, `hasStock`, `canEdit`

### MongoDB Collections
- Lowercase plural (automatic via Mongoose): `users`, `pizzas`, `orders`, `inventories`

---

## 3. Git Workflow

### Branch Naming
```
feature/auth-registration
feature/pizza-builder
feature/razorpay-integration
fix/inventory-decrement-bug
chore/add-nodemon-config
docs/update-readme
```

### Commit Message Format (Conventional Commits)
```
<type>(<scope>): <short description>

Types: feat | fix | chore | docs | style | refactor | test | perf
Scope: auth | pizza | order | payment | inventory | admin | ui

Examples:
feat(auth): add email verification on registration
fix(inventory): correct decrement logic for veggies
chore(deps): upgrade razorpay to v2.9
docs(readme): add setup instructions for .env
style(ui): update pizza card hover animation
```

### Branch Rules
- `main` branch is **always deployable** — no direct commits
- All changes go through feature branches + PRs
- PRs require self-review checklist before merge
- Never force-push to `main`
- Delete feature branches after merge

### PR Self-Review Checklist
```
- [ ] Code is functional and manually tested
- [ ] No console.log() left in production code
- [ ] No hardcoded credentials or secrets
- [ ] All new routes have proper auth middleware
- [ ] Error cases are handled
- [ ] Mobile responsive (if UI change)
```

---

## 4. API Design Rules

### Response Format
All API responses must follow this standard shape:
```javascript
// Success
{
  "success": true,
  "message": "User registered successfully",
  "data": { ... }
}

// Error
{
  "success": false,
  "message": "Email already exists",
  "error": "DUPLICATE_EMAIL"  // optional error code
}
```

### HTTP Status Codes
| Situation | Status Code |
|-----------|-------------|
| Success (GET, PATCH) | 200 |
| Created (POST) | 201 |
| Bad request / Validation | 400 |
| Unauthorized (no token) | 401 |
| Forbidden (wrong role) | 403 |
| Not found | 404 |
| Server error | 500 |

### Route Rules
- Always protect user routes with `authenticate` middleware
- Always protect admin routes with both `authenticate` AND `isAdmin` middleware
- Never return passwords or tokens in responses
- Use consistent plural nouns for resources: `/pizzas`, `/orders`, `/inventory`
- Use `PATCH` for partial updates, `PUT` for full replacements

---

## 5. Security Rules

### Authentication
- **Always** hash passwords with bcrypt (salt rounds: 10) before storing
- **Never** store plain-text passwords
- JWT secret must be at least 32 characters, stored only in `.env`
- Token expiry: 7 days for access tokens
- Verify JWT on every protected route — no exceptions

### Input Validation
- Validate all request body fields on the server before processing
- Use `trim()` on all string fields before DB save
- Check for required fields explicitly and return 400 with clear message
- Sanitize user-provided content before storing

### Environment Variables
- **Never** commit `.env` files — always add to `.gitignore`
- Provide `.env.example` file with all keys (values empty or placeholder)
- Each developer creates their own `.env` from the example

### Razorpay
- Always verify payment signature on the server side before placing order
- Never trust client-side payment success — server must validate HMAC

### Email
- Use Gmail App Password (not account password) for Nodemailer
- Store email credentials in `.env` only

---

## 6. Error Handling Rules

### Server-Side
```javascript
// All controllers use try/catch
export const register = async (req, res) => {
  try {
    // logic here
    res.status(201).json({ success: true, message: '...' });
  } catch (error) {
    console.error('register error:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Global error handler in server.js (last middleware)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Something went wrong'
  });
});
```

### Client-Side
```javascript
// All API calls use try/catch or .catch()
// Axios interceptor handles 401 globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth state + redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

## 7. Code Style Rules

### Async/Await
- Always use `async/await` — never mix with `.then()/.catch()` in the same function
- Always wrap in `try/catch` on the server

### React
- Use **functional components only** — no class components
- Use **hooks** for all state and side effects
- Keep components **small and focused** — if >150 lines, split it
- Extract reusable logic to custom hooks
- Use `useEffect` cleanup to prevent memory leaks (e.g., clear intervals)

### Imports
```javascript
// Order: external → internal → relative
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../hooks/useAuth';
import { getAllPizzas } from '../../services/pizzaService';
import PizzaCard from '../dashboard/PizzaCard';
```

### No Console Logs in Production
- Use `console.error()` only for caught errors in server
- Remove all `console.log()` debug statements before merging to main

---

## 8. CSS / Styling Rules

- All global design tokens defined in `index.css` as CSS variables
- Never use inline styles except for dynamic computed values
- Follow the color palette and typography from `Design.md`
- Use BEM-like class naming: `.pizza-card__image`, `.pizza-card--selected`
- Mobile-first CSS: write base styles for mobile, override for desktop

---

## 9. Performance Rules

- **Never** `await` inside a `for` loop — use `Promise.all()` for parallel async
  ```javascript
  // BAD
  for (const item of items) { await processItem(item); }
  
  // GOOD
  await Promise.all(items.map(item => processItem(item)));
  ```
- Debounce search/filter inputs (300ms)
- Use React.memo() only when there's a proven re-render problem
- Lazy-load routes that aren't immediately needed
- Minimize polling interval — 5 seconds minimum (no shorter)

---

## 10. Testing Rules

- Test every API endpoint with Postman/Thunder Client before writing the frontend for it
- Test happy path AND error cases (missing fields, wrong credentials, expired tokens)
- Test inventory decrement manually after each order type
- Test Razorpay in test mode only — never use real card data
- Test mobile viewport (375px) for all UI pages before marking a phase complete

---

## 11. Documentation Rules

- Keep all 8 docs (`PRD.md`, `TechSpecs.md`, etc.) up to date as decisions change
- Update `Tracker.md` at the end of each work session
- Log all bugs and blockers in the `Tracker.md` Issues table
- Add comments to complex business logic functions (e.g., HMAC verification, price calculator)
- `README.md` must always have working setup instructions

---

## 12. Deployment Rules

- Never deploy with `NODE_ENV=development` in production
- Always set all required environment variables in the hosting platform before deploying
- Run a smoke test on every new deployment before sharing the URL
- Keep local `.env` and production `.env` in sync (except values)
- MongoDB Atlas: never use `0.0.0.0/0` IP whitelist in production — use specific IPs
