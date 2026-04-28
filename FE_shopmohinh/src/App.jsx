import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'

import Home from './pages/Home'
import Products from './pages/Products'
import Contact from './pages/Contact'
import UserLayout from './layout/UserLayout'
import Cart from "./pages/Cart"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Wishlist from "./pages/Wishlist"
import Checkout from "./pages/Checkout"
import ProductDetail from "./pages/ProductDetail"

// 🔥 thêm
import Dashboard from "./pages/admin/Dashboard"

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* USER LAYOUT */}
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="contact" element={<Contact />} />
          <Route path="cart" element={<Cart />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="product/:id" element={<ProductDetail />} />
        </Route>

        {/* 🔥 ADMIN */}
        <Route path="/admin/dashboard" element={<Dashboard />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App