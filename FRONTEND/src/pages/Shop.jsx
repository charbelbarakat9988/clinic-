// pages/Shop.jsx
import { useEffect, useMemo, useState, useCallback } from "react";
import { Alert, Spinner, Button, Form } from "react-bootstrap";
import api from "../api";
import ProductCard from "../components/ProductCard";
import { Link } from "react-router-dom";

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

  if (name.includes("dog") && (name.includes("food") || name.includes("kibble"))) return dogFoodImg;
  if (name.includes("royal") || name.includes("canin") || name.includes("hill")) return dogFoodImg;

  if (name.includes("cat") && (name.includes("food") || name.includes("kibble"))) return catFoodImg;
  if (name.includes("whiskas") || name.includes("purina") || name.includes("me-o")) return catFoodImg;

  if (
    name.includes("toy") || name.includes("ball") || name.includes("chew") ||
    name.includes("rope") || name.includes("laser") || name.includes("feather")
  ) return toyImg;

  if (
    name.includes("shampoo") || name.includes("soap") || name.includes("spray") ||
    name.includes("tick") || name.includes("flea") || name.includes("brush")
  ) return shampooImg;

  if (
    name.includes("vitamin") || name.includes("omega") ||
    name.includes("calcium") || name.includes("supplement")
  ) return supplementImg;

  if (
    name.includes("collar") || name.includes("leash") || name.includes("bed") ||
    name.includes("bottle") || name.includes("bowl") || name.includes("carrier")
  ) return accessoryImg;

  return placeholderImg;
}

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const role = localStorage.getItem("role");

  const SERVER =
    (api.defaults.baseURL || "").replace(/\/api\/?$/, "").replace(/\/$/, "") ||
    import.meta.env.VITE_SERVER_URL ||
    "http://localhost:5000";

  // ✅ useCallback fixes Netlify ESLint error
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.get("/products");
      const list = Array.isArray(res.data) ? res.data : [];

      const mapped = list.map((p) => ({
        id: p.product_id,
        name: p.name,
        description: p.description,
        price: Number(p.price || 0),
        stock_quantity: p.stock_quantity,
        image: p.image_url ? `${SERVER}${p.image_url}` : getProductImage(p.name),
      }));

      setProducts(mapped);
    } catch (err) {
      console.error("Load products error:", err);
      setError(err?.response?.data?.message || "Failed to load products.");
    } finally {
      setLoading(false);
    }
  }, [SERVER]);

  // ✅ Proper dependency
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) =>
      (p.name || "").toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search]);

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await api.delete(`/admin/products/${id}`);
      fetchProducts(); // re-fetch safely
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete product");
    }
  };

  return (
    <section style={{ padding: "60px 0", minHeight: "100vh" }}>
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">Pet Store</h2>

          {role === "admin" && (
            <Link to="/admin/products/add" className="btn btn-success">
              ➕ Add Product
            </Link>
          )}
        </div>

        <div className="mb-4">
          <Form.Control
            type="text"
            placeholder="Search product by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ padding: "14px", borderRadius: "12px", fontSize: "16px" }}
          />
        </div>

        {loading && (
          <div className="text-center py-4">
            <Spinner animation="border" />
            <p className="mt-2">Loading products...</p>
          </div>
        )}

        {error && <Alert variant="danger">{error}</Alert>}

        <div className="row">
          {filteredProducts.map((product) => (
            <div key={product.id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
              <div className="h-100 d-flex flex-column">
                <div style={{ transform: "scale(0.95)" }}>
                  <ProductCard product={product} />
                </div>

                {role === "admin" && (
                  <div className="mt-3">
                    <Button
                      variant="danger"
                      className="w-100"
                      onClick={() => deleteProduct(product.id)}
                    >
                      🗑 Delete Product
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {!loading && filteredProducts.length === 0 && (
          <p className="text-center text-muted mt-4">
            No products found for "<b>{search}</b>"
          </p>
        )}
      </div>
    </section>
  );
}
