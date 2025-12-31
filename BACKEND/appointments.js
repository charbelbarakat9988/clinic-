const express = require("express");
const router = express.Router();
const db = require("../db");

// CREATE APPOINTMENT
router.post("/", async (req, res) => {
  const { client_id, pet_id, doctor_id, service_id, appointment_date } =
    req.body;

  try {
    await db.query(
      "INSERT INTO Appointment (client_id, pet_id, doctor_id, service_id, appointment_date, status) VALUES (?, ?, ?, ?, ?, 'scheduled')",
      [client_id, pet_id, doctor_id, service_id, appointment_date]
    );

    res.json({ message: "Appointment created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Appointment error" });
  }
});

module.exports = router;
