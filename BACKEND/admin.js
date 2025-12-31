const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminOnly");

router.get("/", auth, adminOnly, (req, res) => {
  res.json({ message: "Welcome Admin" });
});

module.exports = router;
