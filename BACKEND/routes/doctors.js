const express = require("express");
const router = express.Router();
const pool = require("../db");
const auth = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminOnly");

// GET ALL DOCTORS
router.get("/", async (req, res) => {
  try {
    const [doctors] = await pool.query("SELECT * FROM Doctor");
    res.json(doctors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ADD DOCTOR (ADMIN)
router.post("/", auth, adminOnly, async (req, res) => {
  const { name, specialty, bio, image } = req.body;

  if (!name || !specialty) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    await pool.query(
      "INSERT INTO Doctor (name, specialization, specialty, bio, image) VALUES (?, ?, ?, ?, ?)",
      [name, specialty, specialty, bio || "", image || ""]
    );

    res.json({ message: "Doctor added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
