# ÉLAN — Frontend-Only Fashion E-Commerce

A complete, production-quality e-commerce storefront and admin panel built entirely
in React + Tailwind CSS, with **no backend**. All data — products, orders, users,
categories, coupons, reviews — lives in the browser's `localStorage`, behind an
async-shaped data layer so it can be swapped for a real API later without
rewriting the app.

---

## 1. Project Overview

ÉLAN is a demo/prototype-grade fashion e-commerce site: a full customer-facing
storefront (browse, filter, cart, checkout, accounts, orders, wishlist, reviews)
plus a full admin panel (products, categories, orders, customers, inventory,
coupons, reviews, dashboard). It's meant to be handed to a backend developer
later, or used as-is for a client demo / small static deployment.

## 2. Technologies Used

- **React 18** (functional components, hooks, Context API)
- **React Router v6** (routing, protected routes)
- **Tailwind CSS** (utility-first styling, custom design tokens)
- **Recharts** (admin dashboard charts)
- **lucide-react** (icons)
- **Vite** (dev server / build tool)
- No backend framework, no database, no ORM — intentionally.

## 3. Installation

```bash
npm install
```

## 4. Running the Project

```bash
npm run dev       # start local dev server
npm run build      # production build to /dist
npm run preview    # preview the production build locally
```

The app seeds demo data into `localStorage` automatically on first run — nothing
else to configure to see a fully populated store.

## 5. Folder Structure

```
src/
├── assets/            static assets (if any)
├── components/
│   ├── common/         ImageWithFallback, Rating, Badge, EmptyState, Loader, ConfirmDialog
│   ├── layout/          Layout (storefront), AdminLayout
│   ├── navbar/          Navbar, MobileDrawer, SearchOverlay
│   ├── footer/          Footer
│   ├── product/         ProductCard, ProductGrid, FilterSidebar, SortDropdown, QuickView
│   ├── cart/            CartItem, CartSummary
│   └── admin/           AdminSidebar, StatCard, ProductForm
├── pages/
│   ├── public/           Home, About, Contact, FAQ, Privacy, Terms, NotFound
│   ├── shop/             Shop, Category, ProductDetails, SearchResults, ProductListing (shared)
│   ├── account/          Login, Register, Account, OrderHistory
│   └── admin/            AdminLogin, Dashboard, AdminProducts, ProductNew, ProductEdit,
│                          AdminOrders, AdminCustomers, AdminInventory, AdminCategories,
│                          AdminCoupons, AdminReviews, AdminHomepage, AdminSettings
├── context/             AuthContext, AdminAuthContext, CartContext, WishlistContext,
│                        ProductContext, ToastContext
├── hooks/               (reserved for future shared hooks)
├── utils/               storage.js, helpers.js, validation.js
├── data/                products.js, categories.js, coupons.js (seed data only)
├── routes/               ProtectedRoute, AdminProtectedRoute
├── config/               siteConfig.js, adminConfig.js
├── App.jsx
├── main.jsx
└── index.css
```

## 6. React Concepts Used

Functional components throughout; `useState`/`useEffect` for local + lifecycle
state; `useContext` for global state (auth, cart, wishlist, products, toasts);
`useMemo`/`useCallback` to avoid unnecessary recalculation and re-renders
(e.g. filtered product lists, context action functions); custom hooks
(`useAuth()`, `useCart()`, etc.) as the public interface to each context.

## 7. Tailwind Concepts Used

Custom design tokens in `tailwind.config.js` (colors, fonts, animations);
`@layer components` in `index.css` for reusable classes (`.btn-primary`,
`.input-field`, etc.) instead of repeating utility strings everywhere;
responsive variants (`sm:`, `lg:`) throughout for the 320–1440px range.

## 8. Routing

React Router v6, with a single `<Routes>` tree in `App.jsx`. Public pages sit
under a shared `<Layout>` (navbar + footer). Admin pages sit under a separate
`<AdminLayout>` (sidebar), mounted at `/admin/*` and gated by
`AdminProtectedRoute`. Customer-only pages (`/account`, `/account/orders`) are
gated by `ProtectedRoute`.

## 9. Context API

Six contexts, each with a single responsibility:
- **ProductContext** — products, categories, coupons, reviews; shared by both
  the storefront and the admin panel, so an admin edit re-renders the
  storefront instantly (same React tree, same state).
- **CartContext**, **WishlistContext** — persisted client state.
- **AuthContext** — customer accounts.
- **AdminAuthContext** — admin session, checked against `adminConfig.js`.
- **ToastContext** — global notification system.

## 10. Authentication

Two **completely separate** auth systems:
- **Customer auth** (`AuthContext`): register/login against a `users` list in
  `localStorage`. Passwords are stored in plain text — fine for a demo, not for
  production (see Limitations).
- **Admin auth** (`AdminAuthContext`): checked against the single email/password
  pair in `src/config/adminConfig.js`, with a timed session
  (`ADMIN_SESSION_DURATION`, default 8 hours).

There is no shared code path between the two — logging in as a customer never
grants admin access and vice versa.

## 11. Admin Panel

Reachable at `/admin/login`. Every other `/admin/*` route is wrapped in
`AdminProtectedRoute` and redirects unauthenticated visitors back to
`/admin/login`. Sidebar covers Dashboard, Products, Categories, Orders,
Customers, Inventory, Coupons, Reviews, Homepage (featured/new/best-seller
curation), and Settings.

## 12. localStorage Architecture

**Nothing outside `src/utils/storage.js` touches `localStorage` directly.**
Every read/write goes through a function in that file
(`getProducts()`, `saveOrders()`, etc.), and every one of those functions
returns a `Promise` — even though the underlying operation is synchronous —
so the calling code already looks like it's talking to a real API
(`const products = await getProducts()`). When a real backend exists, only
`storage.js` needs to change.

The file also solves the two things that break naive localStorage usage:
1. **Corrupt/missing data** — every read is wrapped in try/catch with a safe
   fallback.
2. **Same-tab reactivity** — writing to `localStorage` doesn't re-render
   anything by itself, and the native `storage` event only fires in *other*
   tabs. `storage.js` dispatches a matching custom event after every write, so
   in-app listeners (`subscribeToKey`) react immediately, in this tab or
   another.

## 13. Product Management

Full CRUD in `ProductContext` (`addProduct`, `updateProduct`, `deleteProduct`),
exposed through the Admin Products page (search/filter/sort + table + confirm
dialogs) and `ProductForm` (shared between "New" and "Edit"). Because product
state lives in the same context the storefront reads from, changes are visible
on the customer site immediately — no refresh needed.

## 14. Cart

`CartContext` snapshots price/name/image at add-time (so the cart still renders
correctly if a product is later edited), but always clamps quantity against the
product's *current* stock. Persisted to `localStorage`, survives refresh.

## 15. Wishlist

`WishlistContext` stores an array of product IDs, persisted to `localStorage`.
Products are looked up live from `ProductContext`, so a wishlist always shows
current price/stock/images.

## 16. Checkout

Customer info, shipping address, and three payment options (Cash on Delivery,
Card — UI mockup only, Bank Transfer). **No real payment is processed** —
there is no payment gateway. On submit: generates an order ID, saves the order,
decrements stock for each purchased line, redeems any applied coupon, clears
the cart, and redirects to the order confirmation page.

## 17. Orders

Stored as a flat array in `localStorage`. Customers see their own orders
(matched by user ID or email) in Order History; admins see and can update the
status of every order in Admin > Orders. Status changes are reflected on the
customer side immediately via the same `subscribeToKey` mechanism used
elsewhere.

## 18. Inventory

Admin > Inventory shows stock, SKU, and computed status (In Stock / Low Stock
≤5 / Out of Stock) for every product, with inline stock editing. The storefront
prevents adding more to cart than is in stock at every entry point (product
page, quick view, cart quantity stepper).

## 19. Coupons

Admin > Coupons supports create/edit/delete/activate/deactivate, with code,
discount %, minimum order, expiry date, and usage limit. `ProductContext`
exposes `validateCoupon(code, subtotal)` (checks active/expiry/limit/minimum)
and `redeemCoupon(id)` (increments usage count), used identically in the Cart
page (preview) and Checkout (final application).

## 20. Limitations of Frontend-Only Architecture

**This is not secure authentication for a system that handles real customer or
payment data.** Because there is no backend:
- Admin credentials and the customer user list are readable/editable by anyone
  with browser devtools access.
- Passwords are stored in plain text, not hashed.
- Anyone can clear their browser's `localStorage` to wipe all orders, users,
  and admin sessions.
- There's no server-side validation — all checks (stock, coupon rules, form
  validation) are client-side and can be bypassed by a determined user.

This architecture is appropriate for: a client-managed content prototype, a
small static/demo deployment, a portfolio piece, or a starting point that a
backend developer will connect to real infrastructure. It is **not**
appropriate for a live store processing real payments or real customer PII
as-is.

## 21. How to Change Admin Credentials

Edit `src/config/adminConfig.js`:
```js
export const ADMIN_CONFIG = {
  email: 'you@yourstore.com',
  password: 'a-strong-password',
}
```

## 22. How to Add Products

Either use Admin > Products > Add Product in the running app, or add an entry
to `src/data/products.js` (only used to seed a fresh browser — after first
run, the admin panel is the source of truth).

## 23. How to Customize Brand Name

Edit `src/config/siteConfig.js` — `brandName` propagates to the navbar, footer,
page title, and admin sidebar automatically.

## 24. How to Change Colors

Edit the `colors` block in `tailwind.config.js` (`ivory`, `stone`, `ink`,
`accent`, `sale`). The whole UI is built from those tokens, not one-off hex
values, so changing them there recolors the site consistently.

## 25. How to Replace Images

Product images are remote URLs (there's no file storage without a backend).
Replace them via Admin > Products > Edit > Images, by pasting a new image URL —
or edit `src/data/products.js` directly before first run. See the note on the
Admin Products form for the same limitation stated in-app.

## 26. How to Deploy

This is a static site after `npm run build` (output in `/dist`). Deploy the
`/dist` folder to Netlify, Vercel, GitHub Pages, Cloudflare Pages, or any static
host. No server-side runtime is required.

## 27. How to Migrate to a Backend Later

1. Stand up real endpoints for products, categories, coupons, reviews, cart,
   wishlist, orders, users, and auth.
2. Rewrite the function bodies in `src/utils/storage.js` to call `fetch(...)`
   instead of `localStorage` — the function signatures and return shapes
   (`Promise`-returning) already match what real API calls look like, so no
   other file needs to change.
3. Replace the plain-text password checks in `AuthContext` / `AdminAuthContext`
   with real server-side authentication (hashed passwords, sessions/JWTs).
4. Replace the image-URL-only flow in Admin > Products with real file uploads
   to object storage (S3, Cloudinary, etc.), then set the returned URL the same
   way the form already expects.

---

Built as a complete, working project — not a mockup. Every button either
performs its intended action or is clearly disabled/labeled.
