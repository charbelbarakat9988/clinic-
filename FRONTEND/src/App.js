import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import NavbarComponent from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Appointments from "./pages/Appointments";
import ManagePets from "./pages/ManagePets";
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
// import Orders from "./pages/Orders"; // Commented out until file is created

import AdminRoute from "./routes/AdminRoute";
import AdminAddProduct from "./pages/AdminAddProduct";

function App() {
  // ... (keep your existing useEffect logic)

  return (
    <BrowserRouter>
      <NavbarComponent />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/manage-pets" element={<ManagePets />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/products/add" element={<AdminRoute><AdminAddProduct /></AdminRoute>} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        {/* <Route path="/orders" element={<Orders />} /> */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
export default App;