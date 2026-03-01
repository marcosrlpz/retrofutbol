import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Layout from "./components/layout/Layout";
import { useAuth } from "./context/AuthContext";
import { WishlistProvider } from "./context/WishlistContext";
import ScrollToTop from "./components/ui/ScrollToTop";
import PageTransition from "./components/ui/PageTransition";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import TeamPage from "./pages/TeamPage";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Privacidad from "./pages/Privacidad";
import ShippingPage from "./pages/ShippingPage";
import Wishlist from "./pages/Wishlist";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/admin/Dashboard";
import ManageProducts from "./pages/admin/ManageProducts";
import ManageOrders from "./pages/admin/ManageOrders";
import ManageUsers from "./pages/admin/ManageUsers";
import Loader from "./components/ui/Loader";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <Loader />;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  if (loading) return <Loader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return isAdmin ? children : <Navigate to="/" replace />;
};

const App = () => (
  <WishlistProvider>
    <ScrollToTop />
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: "#fff",
          color: "#111827",
          border: "1px solid #e5e7eb",
          boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
          fontFamily: "Inter, sans-serif",
        },
      }}
    />
    <Layout>
      <PageTransition>
        <Routes>
          <Route path="/"                    element={<Home />} />
          <Route path="/products"            element={<Products />} />
          <Route path="/products/:id"        element={<ProductDetail />} />
          <Route path="/team/:brand"         element={<TeamPage />} />
          <Route path="/cart"                element={<Cart />} />
          <Route path="/contact"             element={<Contact />} />
          <Route path="/faq"                 element={<FAQ />} />
          <Route path="/privacidad"          element={<Privacidad />} />
          <Route path="/shipping"            element={<ShippingPage />} />
          <Route path="/wishlist"            element={<Wishlist />} />
          <Route path="/login"               element={<Login />} />
          <Route path="/register"            element={<Register />} />
          <Route path="/forgot-password"     element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/checkout"            element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/profile"             element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/admin"               element={<AdminRoute><Dashboard /></AdminRoute>} />
          <Route path="/admin/products"      element={<AdminRoute><ManageProducts /></AdminRoute>} />
          <Route path="/admin/orders"        element={<AdminRoute><ManageOrders /></AdminRoute>} />
          <Route path="/admin/users"         element={<AdminRoute><ManageUsers /></AdminRoute>} />
          <Route path="*"                    element={<NotFound />} />
        </Routes>
      </PageTransition>
    </Layout>
  </WishlistProvider>
);

export default App;