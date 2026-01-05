const express = require("express");
const pool = require("../db");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// Get pets for logged-in client
router.get("/", auth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT pet_id, pet_name, species, breed, age FROM Pet WHERE client_id = ?`,
      [req.user.client_id]
    );
    res.json(rows);
  } catch (err) {
    console.error("Get pets error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Create a new pet for the logged-in client
router.post("/", auth, async (req, res) => {
  const { pet_name, species, breed, age } = req.body;

  if (!pet_name) {
    return res.status(400).json({ message: "pet_name is required" });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO Pet (client_id, pet_name, species, breed, age) VALUES (?, ?, ?, ?, ?)`,
      [req.user.client_id, pet_name, species || null, breed || null, age || null]
    );

    const insertedId = result.insertId;
    const [rows] = await pool.query(
      `SELECT pet_id, pet_name, species, breed, age FROM Pet WHERE pet_id = ?`,
      [insertedId]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("Create pet error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
