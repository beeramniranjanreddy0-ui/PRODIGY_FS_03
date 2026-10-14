# 🎂 The Baker's Corner — Boutique Artisanal Bakery

> A modern, full-stack artisanal bakery & confectionery e-commerce application. Featuring bespoke custom cake designer, weight and flavor customizations, scheduled doorstep delivery (standard, express, midnight), live order tracking, and a comprehensive admin management portal.

---

## ✨ Features

### 🛒 Customer Storefront & Catalogue
- **Curated Collections**: Browse cakes across curated categories—Birthday Cakes, Anniversary, Belgian Chocolate, Artisanal Pâtisserie, Cheesecakes, and Vegan / 100% Eggless creations.
- **Detailed Customization**: Choose cake weight (0.5 kg, 1 kg, 1.5 kg, 2 kg+), flavor base, custom message piped on cake, and eggless preferences.
- **Interactive Product Modal**: Zoomable gallery, flavor notes, ingredient transparency, allergen badges, customer reviews, and immediate add-to-bag.
- **Cart & Slide-over Drawer**: Real-time quantity adjustments, free delivery threshold meter, custom instructions, and one-click coupon redemption (`SWEET10` for 10% off).
- **Wishlist & Favorites**: Save creations for upcoming celebrations with persistent state.

### 🎨 Bespoke Cake Designer ("The Lab")
- **Interactive Cake Customizer**: Real-time visual feedback for custom tiers, base sponges, frosting styles, drip finishes, and cake toppers.
- **Dietary & Flavor Choices**: Eggless / Vegan toggles, Callebaut chocolate ganache, Madagascar vanilla bean, red velvet, and exotic fruit compotes.
- **Special Instructions**: Upload references or add delicate piping instructions directly to the order.

### 🚚 Doorstep Delivery & Scheduling
- **Flexible Delivery Slots**: Standard, Express Delivery, and Signature Midnight Surprise deliveries.
- **Pin Code Verification**: Real-time delivery availability check for fast doorstep dispatch.
- **Live Order Tracker**: Real-time timeline from *Order Received* ➔ *Baking in Oven* ➔ *Hand-decorated* ➔ *Out with Courier* ➔ *Delivered*.

### 🔐 Secure Admin Management Portal
- **Dashboard Overview**: Revenue analytics, live active order queue, popular bestsellers, and stock levels.
- **Order Management**: Update status in real-time, view buyer delivery addresses, custom cake messages, and dispatch details.
- **Menu & Product Management**: Add new bakery creations, update prices, toggle availability, and edit descriptions.
- **Clean Security**: Secure credentials authentication with instant form reset and password visibility toggle.

---

## 🎨 Design System

Crafted with an architectural luxury dark aesthetic:
- **Display Typography**: `Syne` (Bold, sculptural headers & brand statements)
- **Technical & Micro-labels**: `JetBrains Mono` (Vouchers, item codes, prices, order statuses)
- **Body Typography**: `Inter` (Legible, crisp product details and navigation)
- **Palette**:
  - Background: Deep Charcoal (`#111113`)
  - Surface Card: Slate Onyx (`#1a1a1c` & `#232326`)
  - Accent: Terracotta Rose / Warm Ganache (`#d48b7a`)
  - Borders: Crisp Faint Contrast (`rgba(240, 240, 240, 0.08)`)

---

## 🛠️ Tech Stack

- **Frontend**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/), [Motion](https://motion.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Backend / API**: [Express](https://expressjs.com/), [Node.js](https://nodejs.org/), `tsx` runner
- **Persistence**: RESTful API server with seeded in-memory state and localStorage client synchronisation.

---

## 📂 Project Structure

```text
├── backend/
├── src/
│   ├── components/
│   │   ├── AboutContactModals.tsx   # Brand story, FAQ, and contact modal
│   │   ├── AdminDashboard.tsx       # Live orders & inventory management
│   │   ├── AdminPortalPage.tsx      # Admin authentication & dashboard portal
│   │   ├── AuthModal.tsx            # Customer sign-in & register modal
│   │   ├── CakeFallbackImage.tsx    # Resilient image loader with aesthetic fallbacks
│   │   ├── CartDrawer.tsx           # Slide-out shopping bag with coupon validation
│   │   ├── CategoryGrid.tsx         # Category exploration cards
│   │   ├── CheckoutModal.tsx        # Multi-step checkout & delivery scheduler
│   │   ├── CustomCakeModal.tsx      # Bespoke cake design workshop
│   │   ├── Footer.tsx               # Trust badges, FSSAI info, and footer links
│   │   ├── Hero.tsx                 # Viewport hero banner with quick ordering
│   │   ├── Navbar.tsx               # Header with brand identity, search, bag counter
│   │   ├── OrdersTrackerModal.tsx   # Live order tracking modal
│   │   ├── ProductCard.tsx          # Card with quick add, weight toggle, & wishlist
│   │   ├── ProductDetailModal.tsx   # Deep product overview with reviews
│   │   └── WishlistDrawer.tsx       # Saved items drawer
│   ├── types/
│   │   └── bakery.ts                # TypeScript domain models & interfaces
│   ├── App.tsx                      # Root container & modal coordinator
│   ├── index.css                    # Global design tokens and fonts
│   └── main.tsx                     # React root DOM mount
├── index.html                       # HTML entry point with web fonts
├── metadata.json                    # Application metadata & capabilities
├── package.json                     # Scripts & dependencies
├── server.ts                        # Express API & Vite dev middleware server
├── tsconfig.json                    # TypeScript compiler configuration
└── vite.config.ts                   # Vite build & plugin configuration
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **npm** or **bun** / **yarn**

### 1. Clone the repository
```bash
git clone https://github.com/your-username/the-bakers-corner.git
cd the-bakers-corner
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start development server
```bash
npm run dev
```
The application will launch with full-stack Express API and Vite live reloading at `http://localhost:3000`.

### 4. Build for production
```bash
npm run build
```

To preview or run the production server:
```bash
npm start
```

---

## 📡 API Overview

The Express backend provides clean REST endpoints under `/api`:

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/products` | Fetch all cakes with filter & category support |
| `GET` | `/api/categories` | Retrieve bakery categories & meta |
| `POST` | `/api/orders` | Place a customer or custom cake order |
| `GET` | `/api/orders/:id` | Track order status by Order ID |
| `POST` | `/api/coupons/validate` | Validate discount coupon (e.g., `SWEET10`) |
| `GET` | `/api/admin/orders` | Admin route to retrieve all incoming orders |
| `PUT` | `/api/admin/orders/:id` | Update preparation & delivery status |

---

## 🎟️ Demo Promo Codes

- **`SWEET10`**: Applies a **10% discount** across your entire cart at checkout.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
