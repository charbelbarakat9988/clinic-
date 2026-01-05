import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import api from "../api";
import "./Appointments.css";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get("/orders");
        setOrders(data);
      } catch (err) {
        console.error("Fetch orders error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <section className="appointment-section">
      <div className="container">
        <div className="text-center">
          <h2 className="appointment-title">Your Orders</h2>
          <p className="appointment-subtitle">Recent orders and their status.</p>
        </div>

        <div className="row justify-content-center mt-4">
          <div className="col-lg-8 col-md-10">
            <div className="appointment-card p-3">
              {loading ? (
                <div>Loading...</div>
              ) : orders.length === 0 ? (
                <div>No orders found.</div>
              ) : (
                <Table responsive bordered>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Date</th>
                      <th>Total</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr key={o.order_id}>
                        <td>{o.order_id}</td>
                        <td>{new Date(o.created_at).toLocaleString()}</td>
                        <td>${Number(o.total_price).toFixed(2)}</td>
                        <td>{o.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
