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
import Profile from "./pages/Profile"
// 🔥 thêm
import Dashboard from "./pages/admin/Dashboard"
import Users from "./pages/admin/User"
import Orders from "./pages/admin/Orders"
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
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* 🔥 ADMIN */}
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/users" element={<Users />} />
        <Route path="/admin/orders" element={<Orders />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
