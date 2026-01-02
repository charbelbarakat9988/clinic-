import { useEffect, useState } from "react";
import { Button, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Checkout() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );

  useEffect(() => {
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
      setLoading(true);
      const res = await api.get("/cart");
      setCart(res.data || []);
    } catch (err) {
      console.error("Fetch cart error:", err);
      setError("Could not load cart.");
    } finally {
      setLoading(false);
    }
  };

  const placeOrder = async () => {
    setError(null);

    try {
      if (!cart.length) return setError("Your cart is empty.");

      await api.post("/orders/checkout");

      alert("✅ Order placed successfully!");
      navigate("/orders");
    } catch (err) {
      console.error("Checkout error:", err);
      setError(err?.response?.data?.message || "Checkout failed.");
    }
  };

  if (loading) {
    return (
      <section className="container text-center mt-5">
        <Spinner animation="border" />
      </section>
    );
  }

  return (
    <section className="container mt-5">
      <h2 className="fw-bold mb-4">Checkout</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <div className="row">
        <div className="col-md-6">
          <h5 className="fw-bold mb-3">Customer Info</h5>

          <p className="mb-1"><strong>Name:</strong> {user.name || "—"}</p>
          <p className="mb-1"><strong>Email:</strong> {user.email || "—"}</p>
          <p className="mb-4"><strong>Phone:</strong> {user.phone || "—"}</p>

          <Button variant="success" size="lg" onClick={placeOrder}>
            Confirm & Place Order
          </Button>
        </div>

        <div className="col-md-6">
          <h5 className="fw-bold mb-3">Order Summary</h5>

          {cart.map((item) => (
            <div
              key={item.cart_item_id}
              className="d-flex justify-content-between border-bottom py-2"
            >
              <span>{item.name} x{item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}

          <h4 className="fw-bold mt-3">Total: ${total.toFixed(2)}</h4>
        </div>
      </div>
    </section>
  );
}
