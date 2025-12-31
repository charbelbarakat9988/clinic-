const express = require("express");
const pool = require("../db");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// Checkout - create order from cart
router.post("/checkout", auth, async (req, res) => {
  const client_id = req.user.client_id;
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    const [cartItems] = await conn.query(
      `SELECT ci.*, p.price 
       FROM CartItem ci
       JOIN Product p ON ci.product_id = p.product_id
       WHERE ci.client_id = ?`,
      [client_id]
    );

    if (!cartItems.length) {
      await conn.rollback();
      return res.status(400).json({ message: "Cart is empty" });
    }

    const total = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const [orderResult] = await conn.query(
      "INSERT INTO `Order` (client_id, total_price, status, created_at) VALUES (?, ?, ?, NOW())",
      [client_id, total, "Pending"]
    );

    const order_id = orderResult.insertId;

    for (const item of cartItems) {
      await conn.query(
        "INSERT INTO OrderItem (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
        [order_id, item.product_id, item.quantity, item.price]
      );
    }

    await conn.query("DELETE FROM CartItem WHERE client_id = ?", [client_id]);

    await conn.commit();

    res.json({ message: "Order created", order_id });
  } catch (err) {
    await conn.rollback();
    console.error("Checkout error:", err);
    res.status(500).json({ message: "Server error" });
  } finally {
    conn.release();
  }
});

// Get orders of logged user
router.get("/", auth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM `Order` WHERE client_id = ? ORDER BY created_at DESC",
      [req.user.client_id]
    );
    res.json(rows);
  } catch (err) {
    console.error("Get orders error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
