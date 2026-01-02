import { useEffect, useState } from "react";
import { Alert, Spinner, Card, Badge, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      alert("Please login first.");
      navigate("/login");
      return;
    }
    fetchOrders();
    // eslint-disable-next-line
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await api.get("/orders");
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch orders error:", err);
      setError(err?.response?.data?.message || "Could not load orders.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const s = (status || "").toLowerCase();
    if (s.includes("pending")) return <Badge bg="warning">Pending</Badge>;
    if (s.includes("completed")) return <Badge bg="success">Completed</Badge>;
    if (s.includes("cancel")) return <Badge bg="danger">Cancelled</Badge>;
    return <Badge bg="secondary">{status || "Unknown"}</Badge>;
  };

  if (loading) {
    return (
      <section className="container text-center mt-5">
        <Spinner animation="border" />
        <p className="mt-2">Loading your orders...</p>
      </section>
    );
  }

  return (
    <section className="container mt-5" style={{ minHeight: "80vh" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">My Orders</h2>
        <Button variant="outline-primary" onClick={fetchOrders}>
          Refresh
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {orders.length === 0 ? (
        <Alert variant="info">
          You don’t have any orders yet.
          <div className="mt-3">
            <Button onClick={() => navigate("/shop")} variant="success">
              Go to Shop
            </Button>
          </div>
        </Alert>
      ) : (
        <div className="row">
          {orders.map((order) => (
            <div key={order.order_id} className="col-md-6 col-lg-4 mb-4">
              <Card className="shadow-sm rounded-4">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="fw-bold mb-0">Order #{order.order_id}</h5>
                    {getStatusBadge(order.status)}
                  </div>

                  <p className="mb-1 text-muted">
                    <strong>Total:</strong> ${Number(order.total_price).toFixed(2)}
                  </p>

                  <p className="mb-0 text-muted">
                    <strong>Date:</strong>{" "}
                    {order.created_at
                      ? new Date(order.created_at).toLocaleString()
                      : "—"}
                  </p>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
