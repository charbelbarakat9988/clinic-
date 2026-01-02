const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../middleware/authMiddleware");

// ADD TO CART
router.post("/", auth, async (req, res) => {
  const client_id = req.user.client_id;
  const { product_id, quantity } = req.body;
  try {
    const [product] = await db.query("SELECT product_id FROM Product WHERE product_id = ?", [product_id]);
    if (product.length === 0) return res.status(400).json({ message: "Product does not exist" });

    const [existing] = await db.query(
      "SELECT cart_item_id, quantity FROM CartItem WHERE client_id = ? AND product_id = ?",
      [client_id, product_id]
    );

    if (existing.length > 0) {
      await db.query("UPDATE CartItem SET quantity = quantity + ? WHERE cart_item_id = ?", [quantity, existing[0].cart_item_id]);
    } else {
      await db.query("INSERT INTO CartItem (client_id, product_id, quantity) VALUES (?, ?, ?)", [client_id, product_id, quantity]);
    }
    res.json({ message: "Added to cart" });
  } catch (err) {
    res.status(500).json({ message: "Cart error" });
  }
});

// GET CART
router.get("/", auth, async (req, res) => {
  const client_id = req.user.client_id;
  try {
    const [rows] = await db.query(
      `SELECT CartItem.cart_item_id, CartItem.quantity, Product.product_id, Product.name, Product.price 
       FROM CartItem JOIN Product ON CartItem.product_id = Product.product_id WHERE CartItem.client_id = ?`,
      [client_id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Cart fetch error" });
  }
});

// ✅ ADDED: UPDATE QUANTITY
router.put("/update", auth, async (req, res) => {
  const { cart_item_id, quantity } = req.body;
  const client_id = req.user.client_id;
  try {
    const [result] = await db.query(
      "UPDATE CartItem SET quantity = ? WHERE cart_item_id = ? AND client_id = ?",
      [quantity, cart_item_id, client_id]
    );
    if (result.affectedRows === 0) return res.status(400).json({ message: "Update failed" });
    res.json({ message: "Quantity updated" });
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
});

// ✅ ADDED: REMOVE ITEM
router.delete("/:cart_item_id", auth, async (req, res) => {
  const client_id = req.user.client_id;
  try {
    await db.query("DELETE FROM CartItem WHERE cart_item_id = ? AND client_id = ?", [req.params.cart_item_id, client_id]);
    res.json({ message: "Item removed" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = router;