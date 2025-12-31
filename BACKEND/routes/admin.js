// routes/admin.js
const express = require("express");
const router = express.Router();
const pool = require("../db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const auth = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminOnly");

// ✅ Ensure upload folder exists
const uploadDir = path.join(__dirname, "..", "uploads", "products");
fs.mkdirSync(uploadDir, { recursive: true });

// ================= MULTER CONFIG =================
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const fileFilter = (req, file, cb) => {
  const ok = ["image/jpeg", "image/png", "image/webp"].includes(file.mimetype);
  cb(ok ? null : new Error("Only jpg/png/webp images allowed"), ok);
};

const upload = multer({ storage, fileFilter });

// ================= ADD PRODUCT =================
// POST /api/admin/products
router.post("/products", auth, adminOnly, upload.single("image"), async (req, res) => {
  const { name, description, price, stock_quantity } = req.body;
  const image = req.file ? req.file.filename : null;

  if (!name || !price) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    await pool.query(
      "INSERT INTO Product (name, description, price, stock_quantity, image) VALUES (?, ?, ?, ?, ?)",
      [name, description || "", price, stock_quantity ?? 0, image]
    );

    res.json({
      message: "Product added successfully",
      image,
      image_url: image ? `/uploads/products/${image}` : null,
    });
  } catch (err) {
    console.error("Add product error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= UPDATE PRODUCT (image optional) =================
// PUT /api/admin/products/:id
router.put("/products/:id", auth, adminOnly, upload.single("image"), async (req, res) => {
  const { id } = req.params;
  const { name, description, price, stock_quantity } = req.body;
  const image = req.file ? req.file.filename : null;

  try {
    const fields = [];
    const values = [];

    if (name !== undefined) { fields.push("name=?"); values.push(name); }
    if (description !== undefined) { fields.push("description=?"); values.push(description); }
    if (price !== undefined) { fields.push("price=?"); values.push(price); }
    if (stock_quantity !== undefined) { fields.push("stock_quantity=?"); values.push(stock_quantity); }
    if (image !== null) { fields.push("image=?"); values.push(image); }

    if (fields.length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    values.push(id);

    const [result] = await pool.query(
      `UPDATE Product SET ${fields.join(", ")} WHERE product_id=?`,
      values
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: `Product with ID ${id} not found.` });
    }

    res.json({
      message: "Product updated successfully",
      image,
      image_url: image ? `/uploads/products/${image}` : null,
    });
  } catch (err) {
    console.error("Update product error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= DELETE PRODUCT =================
// DELETE /api/admin/products/:id
router.delete("/products/:id", auth, adminOnly, async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query(
      "DELETE FROM Product WHERE product_id=?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: `Product with ID ${id} not found.` });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Delete product error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
