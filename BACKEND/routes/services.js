const express = require("express");
const pool = require("../db");

const router = express.Router();

// Read-only list of services
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT service_id, name, description, price FROM Service ORDER BY service_id ASC`
    );
    res.json(rows);
  } catch (err) {
    console.error("Get services error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get single service by id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT service_id, name, description, price FROM Service WHERE service_id = ? LIMIT 1`,
      [id]
    );
    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("Get service detail error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
