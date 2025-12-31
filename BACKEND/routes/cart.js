// routes/cart.js (REPLACE your cart route file with this)
// Mount is already: app.use("/api/cart", cartRoutes);

const express = require("express");
const router = express.Router();
const pool = require("../db");
const auth = require("../middleware/authMiddleware");

// ✅ GET CART (returns image_url too)
router.get("/", auth, async (req, res) => {
  try {
    // If you have client_id in req.user, use it; otherwise remove WHERE filter.
    const client_id = req.user?.client_id || req.user?.id;

    const sql = client_id
      ? `SELECT ci.cart_item_id, ci.quantity, p.product_id, p.name, p.price, p.image
         FROM CartItem ci
         JOIN Product p ON p.product_id = ci.product_id
         WHERE ci.client_id = ?`
      : `SELECT ci.cart_item_id, ci.quantity, p.product_id, p.name, p.price, p.image
         FROM CartItem ci
         JOIN Product p ON p.product_id = ci.product_id`;

    const params = client_id ? [client_id] : [];
    const [rows] = await pool.query(sql, params);

    const mapped = rows.map((r) => ({
      ...r,
      image_url: r.image ? `/uploads/products/${r.image}` : null,
    }));

    res.json(mapped);
  } catch (err) {
    console.error("Cart get error:", err);
    res.status(500).json({ message: "Could not load cart." });
  }
});

// ✅ UPDATE QTY (matches your frontend primary call)
// PUT /api/cart/update  body: { cart_item_id, quantity }
router.put("/update", auth, async (req, res) => {
  const { cart_item_id, quantity } = req.body;

  if (!cart_item_id || !quantity || Number(quantity) < 1) {
    return res.status(400).json({ message: "Invalid quantity." });
  }

  try {
    const [result] = await pool.query(
      "UPDATE CartItem SET quantity = ? WHERE cart_item_id = ?",
      [quantity, cart_item_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: `Cart item ${cart_item_id} not found.` });
    }

    res.json({ message: "Quantity updated." });
  } catch (err) {
    console.error("Cart update error:", err);
    res.status(500).json({ message: "Could not update quantity." });
  }
});

// ✅ FALLBACK UPDATE (matches frontend fallback)
// PUT /api/cart/:id  body: { quantity }
router.put("/:id", auth, async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  if (!quantity || Number(quantity) < 1) {
    return res.status(400).json({ message: "Invalid quantity." });
  }

  try {
    const [result] = await pool.query(
      "UPDATE CartItem SET quantity = ? WHERE cart_item_id = ?",
      [quantity, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: `Cart item ${id} not found.` });
    }

    res.json({ message: "Quantity updated." });
  } catch (err) {
    console.error("Cart update error:", err);
    res.status(500).json({ message: "Could not update quantity." });
  }
});

// ✅ REMOVE ITEM
// DELETE /api/cart/:id
router.delete("/:id", auth, async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query(
      "DELETE FROM CartItem WHERE cart_item_id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: `Cart item ${id} not found.` });
    }

    res.json({ message: "Item removed." });
  } catch (err) {
    console.error("Cart delete error:", err);
    res.status(500).json({ message: "Could not remove item." });
  }
});

module.exports = router;
