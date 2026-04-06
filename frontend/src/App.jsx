import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import { CartProvider } from "./contexts/CartContext";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Marketplace from "./pages/Marketplace";
import AddItem from "./pages/AddItem";
import EditItem from "./pages/EditItem";
import ItemDetails from "./pages/ItemDetails";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import ProductList from "./pages/ProductList";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import HelpCenter from "./pages/HelpCenter";
import SafetyTips from "./pages/SafetyTips";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";
import About from "./pages/About";
import Careers from "./pages/Careers";
import Press from "./pages/Press";
import Blog from "./pages/Blog";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";

function UserLayout() {
  return (
    <>
      <Navbar />
      <main className="app-main-content">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Admin routes - NO Navbar/Footer */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route element={<AdminProtectedRoute />}>
              <Route element={<AdminDashboard />}>
                <Route path="/admin/dashboard" element={<ProductList />} />
                <Route path="/admin/product/add" element={<AddProduct />} />
                <Route path="/admin/product/edit/:id" element={<EditProduct />} />
              </Route>
            </Route>

            {/* User routes - WITH Navbar/Footer */}
            <Route element={<UserLayout />}>
              <Route path="/" element={<Marketplace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/add-item" element={<ProtectedRoute adminOnly={true}><AddItem /></ProtectedRoute>} />
              <Route path="/edit-item/:id" element={<ProtectedRoute adminOnly={true}><EditItem /></ProtectedRoute>} />
              <Route path="/item/:id" element={<ItemDetails />} />
              <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/help-center" element={<HelpCenter />} />
              <Route path="/safety-tips" element={<SafetyTips />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/about" element={<About />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/press" element={<Press />} />
              <Route path="/blog" element={<Blog />} />
            </Route>
          </Routes>
        </BrowserRouter>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}

export default App;
