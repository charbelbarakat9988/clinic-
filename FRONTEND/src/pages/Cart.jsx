import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./Cart.css";

// fallback images
import dogFoodImg from "../assets/images/img-food.jpeg";
import catFoodImg from "../assets/images/img-catfood.jpeg";
import toyImg from "../assets/images/img-toy.jpeg";
import shampooImg from "../assets/images/img-shampoo.jpeg";
import supplementImg from "../assets/images/img-supplement.jpeg";
import accessoryImg from "../assets/images/img-accessory.jpeg";
import placeholderImg from "../assets/images/product-placeholder.jpeg";

function getProductImage(productName) {
  const name = (productName || "").toLowerCase();

  if (name.includes("royal") || name.includes("canin") || name.includes("dog"))
    return dogFoodImg;
  if (name.includes("cat") || name.includes("whiskas") || name.includes("purina"))
    return catFoodImg;

  if (
    name.includes("toy") ||
    name.includes("ball") ||
    name.includes("rope") ||
    name.includes("chew") ||
    name.includes("laser") ||
    name.includes("feather")
  )
    return toyImg;

  if (
    name.includes("shampoo") ||
    name.includes("spray") ||
    name.includes("flea") ||
    name.includes("tick") ||
    name.includes("brush")
  )
    return shampooImg;

  if (
    name.includes("vitamin") ||
    name.includes("omega") ||
    name.includes("calcium") ||
    name.includes("supplement")
  )
    return supplementImg;

  if (
    name.includes("collar") ||
    name.includes("leash") ||
    name.includes("bed") ||
    name.includes("bottle") ||
    name.includes("bowl") ||
    name.includes("carrier")
  )
    return accessoryImg;

  return placeholderImg;
}

export default function Cart() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  const SERVER =
    (api.defaults.baseURL || "").replace(/\/api\/?$/, "").replace(/\/$/, "") ||
    import.meta.env.VITE_SERVER_URL ||
    "http://localhost:5000";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first.");
      navigate("/login");
      return;
    }
    fetchCart();
    // eslint-disable-next-line
  }, []);

  const fetchCart = async () => {
    try {
      const res = await api.get("/cart");

      const withImages = (res.data || []).map((item) => ({
        ...item,
        image: item.image_url ? `${SERVER}${item.image_url}` : getProductImage(item.name),
      }));

      setItems(withImages);
    } catch (err) {
      console.error("Fetch cart error:", err);
      alert(err?.response?.data?.message || "Could not load cart.");
    }
  };

  const updateQuantity = async (id, qty) => {
    if (qty < 1) return;

    try {
      await api.put("/cart/update", { cart_item_id: id, quantity: qty });
      fetchCart();
    } catch (err) {
      console.error("Update qty error:", err);
      alert(err?.response?.data?.message || "Could not update quantity.");
    }
  };

  const removeItem = async (id) => {
    try {
      await api.delete(`/cart/${id}`);
      fetchCart();
    } catch (err) {
      console.error("Remove item error:", err);
      alert(err?.response?.data?.message || "Could not remove item.");
    }
  };

  const total = items.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );

  const handleCheckout = () => {
    if (!items.length) return alert("Your cart is empty.");
    navigate("/checkout");
  };

  return (
    <section className="cart-section">
      <div className="container">
        <h2 className="fw-bold text-center mb-5 cart-title">Your Cart</h2>

        {items.length === 0 ? (
          <div className="empty-cart-box">
            <h4 className="fw-bold">Your cart is empty 🛒</h4>
            <p className="text-muted">
              Browse our shop and add premium products for your pet.
            </p>
            <Button href="/shop" className="cart-btn">
              Go to Shop
            </Button>
          </div>
        ) : (
          <div className="cart-grid">
            <div className="cart-items">
              {items.map((item) => (
                <div className="cart-item-card" key={item.cart_item_id}>
                  <img src={item.image} alt={item.name} className="cart-item-img" />

                  <div className="cart-item-info">
                    <h5 className="fw-bold mb-1">{item.name}</h5>
                    <p className="text-muted mb-2">${Number(item.price).toFixed(2)}</p>

                    <div className="quantity-controls">
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item.cart_item_id, item.quantity - 1)}
                      >
                        −
                      </button>

                      <span className="qty">{item.quantity}</span>

                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item.cart_item_id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>

                    <button className="remove-btn" onClick={() => removeItem(item.cart_item_id)}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h4 className="fw-bold mb-3">Order Summary</h4>

              <div className="summary-line">
                <span>Total Items</span>
                <span>{items.length}</span>
              </div>

              <div className="summary-line total-line">
                <span>Total</span>
                <span className="total-price">${total.toFixed(2)}</span>
              </div>

              <Button className="cart-btn w-100 mt-3" onClick={handleCheckout}>
                Proceed to Checkout
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
