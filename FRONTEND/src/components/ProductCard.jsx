// components/ProductCard.jsx (REPLACE your file with this)
import { Card, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  const addToCart = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first.");
      navigate("/login");
      return;
    }

    try {
      await api.post("/cart", {
        product_id: product.id,
        quantity: 1,
      });

      alert("✅ Item added to cart!");
      navigate("/cart");
    } catch (err) {
      console.error("Add to cart error:", err);
      alert(err?.response?.data?.message || "Could not add item to cart.");
    }
  };

  return (
    <Card className="h-100 shadow-sm rounded-4 overflow-hidden">
      {/* ✅ Only image is clickable */}
      <Link to={`/products/${product.id}`} style={{ textDecoration: "none" }}>
        <div style={{ height: 180, background: "#f5f5f5" }}>
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : null}
        </div>
      </Link>

      <Card.Body className="d-flex flex-column">
        {/* ✅ Title clickable */}
        <Link to={`/products/${product.id}`} style={{ textDecoration: "none", color: "inherit" }}>
          <Card.Title className="fw-bold">{product.name}</Card.Title>
        </Link>

        <div className="text-muted" style={{ fontSize: 14 }}>
          {product.description}
        </div>

        <div className="mt-2 fw-bold">${Number(product.price).toFixed(2)}</div>

        {/* ✅ Button NOT inside Link anymore */}
        <Button className="mt-3 w-100" variant="success" onClick={addToCart}>
          Add to Cart
        </Button>
      </Card.Body>
    </Card>
  );
}
