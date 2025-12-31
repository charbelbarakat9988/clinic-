// AdminAddProduct.jsx (COPY + PASTE FULL FILE)
import { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function AdminAddProduct() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stockQuantity, setStockQuantity] = useState(0);

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSaving(true);

    try {
      const fd = new FormData();
      fd.append("name", name);
      fd.append("description", description);
      fd.append("price", price);
      fd.append("stock_quantity", String(stockQuantity));

      // ✅ MUST match multer field name: upload.single("image")
      if (imageFile) fd.append("image", imageFile);

      await api.post("/admin/products", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess("Product added successfully!");
      setName("");
      setDescription("");
      setPrice("");
      setStockQuantity(0);
      setImageFile(null);
      setPreview("");

      // go back to shop (or admin list)
      navigate("/shop");
    } catch (err) {
      console.error("Add product error:", err);
      setError(err?.response?.data?.message || "Failed to add product.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="container mt-5">
      <h2 className="fw-bold mb-4">Add New Product</h2>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <div className="bg-white p-4 rounded shadow-sm">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Name</Form.Label>
            <Form.Control
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Product name"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Product description"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Price</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Stock Quantity</Form.Label>
            <Form.Control
              type="number"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(Number(e.target.value))}
              min={0}
            />
          </Form.Group>

          {/* ✅ IMAGE UPLOAD */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Product Image</Form.Label>
            <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
            {preview && (
              <div className="mt-3">
                <img
                  src={preview}
                  alt="Preview"
                  style={{
                    width: "220px",
                    height: "220px",
                    objectFit: "cover",
                    borderRadius: "12px",
                    border: "1px solid #ddd",
                  }}
                />
              </div>
            )}
          </Form.Group>

          <Button type="submit" className="w-100" disabled={saving}>
            {saving ? "Saving..." : "Save Product"}
          </Button>
        </Form>
      </div>
    </section>
  );
}
