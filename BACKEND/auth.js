const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
router.post("/register", async (req, res) => {
  const { name, email, password, phone } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query(
      "INSERT INTO Client (name, email, password, phone) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, phone]
    );
    res.json({ message: "Registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Email already exists or error occurred" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const [clientRows] = await db.query(
      "SELECT * FROM Client WHERE email = ?",
      [email]
    );

    if (clientRows.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const client = clientRows[0];
    const correctPassword = await bcrypt.compare(password, client.password);

    if (!correctPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        client_id: client.client_id,
        email: client.email,
        role: client.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ FIXED: Only one response sent
    res.json({
      token,
      client_id: client.client_id,
      name: client.name,
      email: client.email,
      phone: client.phone, // ✅ MUST BE HERE
      role: client.role,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login error" });
  }
});

module.exports = router;