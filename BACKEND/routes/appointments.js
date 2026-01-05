const express = require("express");
const pool = require("../db");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// Book appointment
router.post("/", auth, async (req, res) => {
  const { pet_id, doctor_id, service_id, appointment_date } = req.body;

  if (!pet_id || !doctor_id || !service_id || !appointment_date) {
    return res.status(400).json({
      message: "pet_id, doctor_id, service_id, appointment_date are required",
    });
  }

  try {
    // Validate referenced foreign keys exist
    const [[serviceRow]] = await pool.query(`SELECT service_id FROM Service WHERE service_id = ?`, [service_id]);
    if (!serviceRow) return res.status(400).json({ message: "Invalid service_id" });

    const [[doctorRow]] = await pool.query(`SELECT doctor_id FROM Doctor WHERE doctor_id = ?`, [doctor_id]);
    if (!doctorRow) return res.status(400).json({ message: "Invalid doctor_id" });

    const [[petRow]] = await pool.query(`SELECT pet_id FROM Pet WHERE pet_id = ? AND client_id = ?`, [pet_id, req.user.client_id]);
    if (!petRow) return res.status(400).json({ message: "Invalid pet_id for this client" });

    await pool.query(
      `INSERT INTO Appointment
       (client_id, pet_id, doctor_id, service_id, appointment_date, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [req.user.client_id, pet_id, doctor_id, service_id, appointment_date, "Pending"]
    );

    res.json({ message: "Appointment booked" });
  } catch (err) {
    console.error("Book appointment error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get appointments for logged user
router.get("/", auth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT a.*, 
              d.name AS doctor_name,
              s.name AS service_name,
              p.pet_name
       FROM Appointment a
       JOIN Doctor d ON a.doctor_id = d.doctor_id
       JOIN Service s ON a.service_id = s.service_id
       JOIN Pet p ON a.pet_id = p.pet_id
       WHERE a.client_id = ?
       ORDER BY a.appointment_date DESC`,
      [req.user.client_id]
    );

    res.json(rows);
  } catch (err) {
    console.error("Get appointments error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
