// App.jsx (frontend)
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import NavbarComponent from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Services from "./pages/Services";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Appointments from "./pages/Appointments";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import Cart from "./pages/Cart";

import AdminRoute from "./routes/AdminRoute";
import AdminAddProduct from "./pages/AdminAddProduct";

function App() {
  useEffect(() => {
    const elements = document.querySelectorAll(
      ".fade-up, .fade-in, .slide-left, .slide-right"
    );

    function reveal() {
      elements.forEach((el) => {
        const top = el.getBoundingClientRect().top;
        if (top < window.innerHeight - 100) {
          el.classList.add("show");
        }
      });
    }

    window.addEventListener("scroll", reveal);
    reveal();

    return () => window.removeEventListener("scroll", reveal);
  }, []);

  return (
    <BrowserRouter>
      <NavbarComponent />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/shop" element={<Shop />} />

        {/* ✅ FIXED: must match ProductCard link `/products/${id}` */}
        <Route path="/products/:id" element={<ProductDetails />} />

        <Route path="/appointments" element={<Appointments />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/products/add"
          element={
            <AdminRoute>
              <AdminAddProduct />
            </AdminRoute>
          }
        />

        <Route path="/cart" element={<Cart />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
