const express = require("express");
const pool = require("../db");

const router = express.Router();

// Get all products
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM Product");

    // Add image_url for frontend
    const mapped = rows.map((p) => ({
      ...p,
      image_url: p.image ? `/uploads/products/${p.image}` : null,
    }));

    res.json(mapped);
  } catch (err) {
    console.error("Products get error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get one product
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query(
      "SELECT * FROM Product WHERE product_id = ?",
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Product not found" });
    }

    const p = rows[0];

    res.json({
      ...p,
      image_url: p.image ? `/uploads/products/${p.image}` : null,
    });
  } catch (err) {
    console.error("Product get error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
