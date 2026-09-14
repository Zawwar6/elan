import { Routes, Route } from 'react-router-dom'
import { ToastProvider } from './context/ToastContext'
import { ProductProvider } from './context/ProductContext'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import { AuthProvider } from './context/AuthContext'
import { AdminAuthProvider } from './context/AdminAuthContext'

import Layout from './components/layout/Layout'
import AdminLayout from './components/layout/AdminLayout'
import ProtectedRoute from './routes/ProtectedRoute'
import AdminProtectedRoute from './routes/AdminProtectedRoute'

// Public pages
import Home from './pages/public/Home'
import About from './pages/public/About'
import Contact from './pages/public/Contact'
import FAQ from './pages/public/FAQ'
import Privacy from './pages/public/Privacy'
import Terms from './pages/public/Terms'
import NotFound from './pages/public/NotFound'

// Shop pages
import Shop from './pages/shop/Shop'
import Category from './pages/shop/Category'
import ProductDetails from './pages/shop/ProductDetails'
import SearchResults from './pages/shop/SearchResults'

// Cart / checkout
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderConfirmation from './pages/OrderConfirmation'
import Wishlist from './pages/Wishlist'

// Account pages
import Login from './pages/account/Login'
import Register from './pages/account/Register'
import Account from './pages/account/Account'
import OrderHistory from './pages/account/OrderHistory'

// Admin pages
import AdminLogin from './pages/admin/AdminLogin'
import Dashboard from './pages/admin/Dashboard'
import AdminProducts from './pages/admin/AdminProducts'
import ProductNew from './pages/admin/ProductNew'
import ProductEdit from './pages/admin/ProductEdit'
import AdminOrders from './pages/admin/AdminOrders'
import AdminCustomers from './pages/admin/AdminCustomers'
import AdminInventory from './pages/admin/AdminInventory'
import AdminCategories from './pages/admin/AdminCategories'
import AdminCoupons from './pages/admin/AdminCoupons'
import AdminReviews from './pages/admin/AdminReviews'
import AdminHomepage from './pages/admin/AdminHomepage'
import AdminSettings from './pages/admin/AdminSettings'

export default function App() {
  return (
    <ToastProvider>
      <ProductProvider>
        <CartProvider>
          <WishlistProvider>
            <AuthProvider>
              <AdminAuthProvider>
                <Routes>
                  {/* Admin login (unprotected) */}
                  <Route path="/admin/login" element={<AdminLogin />} />

                  {/* Protected admin area */}
                  <Route
                    path="/admin"
                    element={
                      <AdminProtectedRoute>
                        <AdminLayout />
                      </AdminProtectedRoute>
                    }
                  >
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="products" element={<AdminProducts />} />
                    <Route path="products/new" element={<ProductNew />} />
                    <Route path="products/edit/:id" element={<ProductEdit />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="customers" element={<AdminCustomers />} />
                    <Route path="inventory" element={<AdminInventory />} />
                    <Route path="categories" element={<AdminCategories />} />
                    <Route path="coupons" element={<AdminCoupons />} />
                    <Route path="reviews" element={<AdminReviews />} />
                    <Route path="homepage" element={<AdminHomepage />} />
                    <Route path="settings" element={<AdminSettings />} />
                  </Route>

                  {/* Public / customer site */}
                  <Route element={<Layout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/category/:slug" element={<Category />} />
                    <Route path="/product/:id" element={<ProductDetails />} />
                    <Route path="/search" element={<SearchResults />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                      path="/account"
                      element={
                        <ProtectedRoute>
                          <Account />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/account/orders"
                      element={
                        <ProtectedRoute>
                          <OrderHistory />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="*" element={<NotFound />} />
                  </Route>
                </Routes>
              </AdminAuthProvider>
            </AuthProvider>
          </WishlistProvider>
        </CartProvider>
      </ProductProvider>
    </ToastProvider>
  )
}
