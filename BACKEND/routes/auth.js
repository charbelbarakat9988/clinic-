const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");
require("dotenv").config();

const router = express.Router();

// ================= REGISTER =================
router.post("/register", async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  try {
    const [existing] = await pool.query(
      "SELECT * FROM Client WHERE email = ?",
      [email]
    );
    if (existing.length) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashed = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO Client (name, email, password, phone, role) VALUES (?, ?, ?, ?, 'user')",
      [name || "", email, hashed, phone || ""]
    );

    res.json({ message: "Registered successfully" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= LOGIN =================
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await pool.query(
      "SELECT * FROM Client WHERE email = ?",
      [email]
    );

    if (!rows.length) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const client = rows[0];
    const match = await bcrypt.compare(password, client.password);

    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 🔥 INCLUDE ROLE IN TOKEN
    const token = jwt.sign(
      {
        client_id: client.client_id,
        email: client.email,
        role: client.role, // ✅ CRITICAL
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 🔥 SEND ROLE TO FRONTEND
    res.json({
      token,
      client_id: client.client_id,
      name: client.name,
      email: client.email,
      role: client.role, // ✅ CRITICAL
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
