import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import OrderList from "./pages/OrderList";

export default function App() {
  return (

    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <ProtectedRoute><Navbar /></ProtectedRoute>
          <Routes>
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
            <Route path="/product/:id" element={<ProtectedRoute><ProductDetail /></ProtectedRoute>} />
            <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="/order/:id" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
            <Route path="/order" element={<ProtectedRoute><OrderList /></ProtectedRoute>} />
            
          </Routes>
        
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>
    
  );
}