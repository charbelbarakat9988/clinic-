// pages/ProductDetails.jsx
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Spinner, Alert } from "react-bootstrap";
import api from "../api";
import importAll from "../utils/importImages";

export default function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const SERVER =
    (api.defaults.baseURL || "").replace(/\/api\/?$/, "").replace(/\/$/, "") ||
    import.meta.env.VITE_SERVER_URL ||
    "http://localhost:5000";

  const images = useMemo(() => {
    try {
      return importAll(
        require.context("../assets/images", false, /\.(png|jpe?g|svg|webp)$/)
      );
    } catch {
      return [];
    }
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await api.get(`/products/${id}`);
        const found = res.data;

        const imageFromServer = found?.image_url ? `${SERVER}${found.image_url}` : null;
        const fallbackLocal =
          images.length && found?.product_id
            ? images[(Number(found.product_id) - 1) % images.length]
            : null;

        setProduct({
          ...found,
          price: Number(found.price || 0),
          image: imageFromServer || fallbackLocal,
        });
      } catch (err) {
        console.error("Load product error:", err);
        if (err.response?.status === 404) setError(`Product with ID ${id} not found.`);
        else setError(err?.response?.data?.message || "Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id, images, SERVER]);

  const addToCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Please login first.");

      await api.post("/cart", {
        product_id: product.product_id,
        quantity: 1,
      });

      alert("Item added to cart!");
    } catch (err) {
      console.error("Add to cart error:", err);
      alert(err?.response?.data?.message || "Could not add item to cart.");
    }
  };

  if (loading) {
    return (
      <section className="container text-center mt-5">
        <Spinner animation="border" />
      </section>
    );
  }

  if (error) {
    return (
      <section className="container mt-5">
        <Alert variant="danger">{error}</Alert>
      </section>
    );
  }

  if (!product) return null;

  return (
    <section className="container mt-5">
      <div className="row align-items-center">
        <div className="col-md-6">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="img-fluid rounded shadow"
            />
          ) : (
            <div style={{ height: 300 }} className="bg-light rounded" />
          )}
        </div>

        <div className="col-md-6">
          <h2 className="fw-bold">{product.name}</h2>
          <p className="lead">{product.description}</p>

          <p className="fs-4 fw-bold text-green">
            ${Number(product.price).toFixed(2)}
          </p>

          <p className="text-muted">In Stock: {product.stock_quantity}</p>

          <Button onClick={addToCart} size="lg" className="mt-3">
            Add to Cart
          </Button>
        </div>
      </div>
    </section>
  );
}
