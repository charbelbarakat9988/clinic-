// components/ProductCard.jsx
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <Card className="h-100 shadow-sm rounded-4 overflow-hidden">
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

        <Card.Body>
          <Card.Title className="fw-bold">{product.name}</Card.Title>
          <div className="text-muted" style={{ fontSize: 14 }}>
            {product.description}
          </div>
          <div className="mt-2 fw-bold">${Number(product.price).toFixed(2)}</div>
        </Card.Body>
      </Link>
    </Card>
  );
}
