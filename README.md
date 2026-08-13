# XO — Luxury Gothic Streetwear Platform

**XO** is a production-ready MERN-stack e-commerce and merchandise-management platform for an exclusive, limited-drop luxury gothic streetwear fashion house.

---

## 🎨 BRAND & DESIGN SYSTEM

- **Color Palette**: Near-black background (`#0a0a0a` / `#0d0d0d`), blood-red / crimson accent (`#8b0000` to `#c9184a`), off-white text (`#e8e8e8`), muted secondary grey (`#8a8a8a`).
- **Typography**: **Orbitron** (display headings, brand logo, badges) & **Rajdhani** (body text, inputs, buttons) via Google Fonts.
- **Edge-Lit UI**: Thin crimson borders & glows on hover (`0 0 15px rgba(201, 24, 74, 0.4)`), sharp 2px radii, noise texture backdrop, SVG duotone gothic filter for product photography.
- **Tokens File**: Centralized in `frontend/src/styles/design-tokens.css`.

---

## 🚀 TECH STACK

| Layer | Technology |
|---|---|
| **Database** | MongoDB Atlas / Local MongoDB (with `mongodb-memory-server` zero-setup fallback) |
| **ODM** | Mongoose 8.x |
| **Backend** | Node.js + Express.js (REST API) |
| **Auth** | JWT (access token 15m + refresh token 7d rotation), bcryptjs password hashing |
| **Frontend** | React 18 (Vite), React Router DOM v6, Context API (`AuthContext`, `CartContext`) |
| **Styling** | Bootstrap 5 + custom CSS design tokens (`design-tokens.css`) |
| **Charts** | Chart.js + react-chartjs-2 for Admin Analytics |
| **Storage** | Cloudinary integration + local `/uploads` multer disk storage fallback |
| **Payments** | Stripe & Razorpay test-mode stub |

---

## 🔑 DEMO CREDENTIALS

### Admin Access
- **Email**: `admin@xo.com`
- **Password**: `admin123`
- **Permissions**: Full product CRUD, inventory stock matrix, order status updates, analytics KPIs.

### Customer Access
- **Email**: `kaelen@xo-vault.com`
- **Password**: `customer123`
- **Permissions**: Browsing, filtering, cart drawer, promo codes (`XO10`, `NOCTURNE20`), checkout, order history.

---

## 🛠️ LOCAL SETUP & SEED INSTRUCTIONS

### 1. Clone & Install Dependencies
```bash
cd xo-platform

# Install root, backend, and frontend dependencies
npm run install:all
```

### 2. Seed Database
Run the automated seed script to populate **1 Admin, 10 Customers, 6 Categories, 30+ Streetwear Products, and 20+ Sample Orders**:
```bash
npm run seed
```

### 3. Run Development Servers
```bash
# Start backend (Port 5000) and frontend (Port 5173) concurrently
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 📡 API SURFACE REFERENCE

### Auth (`/api/auth`)
- `POST /register` — Register customer account
- `POST /login` — Login user & generate JWT
- `POST /refresh` — Refresh access token
- `POST /logout` — Clear refresh cookie
- `GET /me` — Get profile & wishlist

### Products (`/api/products`)
- `GET /` — Multi-criteria filtering (category, size, price, search, limited edition, sorting, pagination)
- `GET /:slug` — Get product by slug or ID
- `POST /` — Create product (Admin only)
- `PUT /:id` — Update product (Admin only)
- `DELETE /:id` — Delete product (Admin only)

### Cart (`/api/cart`)
- `GET /` — Get user cart
- `POST /add` — Add item with size selection
- `PUT /update` — Update item quantity
- `DELETE /remove/:itemId` — Remove item
- `DELETE /clear` — Clear cart

### Orders (`/api/orders`)
- `POST /` — Place order with transactional inventory reduction
- `GET /my-orders` — Get current customer orders
- `GET /all` — Get all orders (Admin only)
- `PUT /:id/status` — Update order status (Admin only)

### Admin (`/api/admin`)
- `GET /dashboard` — Revenue KPIs, low stock warnings, category sales aggregation
- `GET /customers` — Registered client directory

---

## 🌐 DEPLOYMENT GUIDE

1. **Database**: Provision a MongoDB Atlas cluster, obtain connection string, set `MONGO_URI`.
2. **Backend**: Deploy `backend/` to Render or Railway as a Web Service. Set environment variables (`MONGO_URI`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `CLIENT_URL`).
3. **Frontend**: Deploy `frontend/` to Vercel or Netlify. Set `VITE_API_URL` to your deployed Express URL.
