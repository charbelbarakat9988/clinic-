const express = require('express');
const pool = require('../db');

const router = express.Router();

// Simple seed route to populate Service table if empty (protect this in production)
router.get('/seed', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT COUNT(*) as cnt FROM Service');
    if (rows[0].cnt > 0) return res.json({ message: 'Services already seeded' });

    const services = [
      ['General Veterinary Checkup', 'Full health evaluation & early disease detection.', 50.0],
      ['Pet Grooming & Hygiene', 'Bathing, grooming, nail trimming, and fur styling.', 30.0],
      ['Vaccinations', 'All certified vaccines to keep your pet protected.', 40.0],
      ['Surgery & Emergency Care', 'Modern surgical tools & 24/7 emergency support.', 200.0],
      ['Dental Cleaning', 'Professional scaling, polishing & oral treatments.', 80.0],
      ['Nutritional Guidance', 'Pet diet plans approved by veterinary experts.', 35.0],
      ['Microchipping', 'Safe and permanent identification microchipping.', 25.0],
      ['Behavioral Consultation', 'Address behavioral problems and training advice.', 45.0],
      ['Dermatology Consultation', 'Skin and allergy diagnostics and treatment.', 60.0],
      ['Senior Pet Care', 'Geriatric wellness exams and care plans for senior pets.', 65.0],
      ['Laboratory Testing', 'Bloodwork, urinalysis and diagnostic testing.', 55.0],
      ['Spay/Neuter', 'Routine spay or neuter surgical procedure.', 120.0]
    ];

    for (const s of services) {
      await pool.query('INSERT INTO Service (name, description, price) VALUES (?, ?, ?)', s);
    }

    res.json({ message: 'Seeded services' });
  } catch (err) {
    console.error('Seed services error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
