import { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import api from "../api";
import "./Appointments.css";

export default function Appointments() {
  const location = useLocation();
  const selectedService = location.state?.service;

  // 👨‍⚕️ DOCTORS LIST
  const doctors = [
    { id: 1, name: "Dr. Sarah Khalil", specialty: "Veterinary Surgeon" },
    { id: 2, name: "Dr. Mark Haddad", specialty: "Pet Nutrition Specialist" },
    { id: 3, name: "Dr. Lina Saad", specialty: "General Veterinarian" },
  ];

  const [form, setForm] = useState({
    pet_id: "",
    doctor_id: "",
    service_id: selectedService?.id || "",
    appointment_date: "",
  });

  const [pets, setPets] = useState([]);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const { data } = await api.get("/pets");
        setPets(data);
        if (data.length) setForm((f) => ({ ...f, pet_id: data[0].pet_id }));
      } catch (err) {
        console.error("Fetch pets error:", err);
      }
    };
    fetchPets();
  }, []);

  const change = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/appointments", form);
      alert("✅ Appointment booked successfully!");
      setForm({
        pet_id: "",
        doctor_id: "",
        service_id: selectedService?.id || "",
        appointment_date: "",
      });
    } catch (err) {
      console.error(err);
      alert("❌ Error booking appointment");
    }
  };

  return (
    <section className="appointment-section">
      <div className="container">
        <div className="text-center">
          <h2 className="appointment-title">Book an Appointment</h2>
          <p className="appointment-subtitle">
            Schedule your pet’s visit in just a few steps.
          </p>
        </div>

        <div className="row justify-content-center mt-5">
          <div className="col-lg-6 col-md-8">
            <Form onSubmit={submit} className="appointment-card">
              
              {/* SELECTED SERVICE */}
              <Form.Group className="mb-3">
                <Form.Label className="appointment-label">
                  Selected Service
                </Form.Label>
                {/* show label to user */}
                <Form.Control
                  name="service_label"
                  value={selectedService?.title || "-- Select a service --"}
                  readOnly
                  className="appointment-input"
                />
                {/* keep numeric id hidden for submission */}
                <input type="hidden" name="service_id" value={form.service_id} />
                {selectedService?.price != null && (
                  <div className="mt-2">
                    <strong>Price: </strong>
                    <span>${Number(selectedService.price).toFixed(2)}</span>
                  </div>
                )}
              </Form.Group>

              {/* PET SELECT */}
              <Form.Group className="mb-3">
                <Form.Label className="appointment-label">Pet</Form.Label>
                <Form.Select
                  name="pet_id"
                  value={form.pet_id}
                  onChange={change}
                  required
                  className="appointment-input"
                >
                  <option value="">-- Choose a Pet --</option>
                  {pets.map((p) => (
                    <option key={p.pet_id} value={p.pet_id}>
                      {p.pet_name} {p.species ? `(${p.species})` : ""}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              {/* DOCTOR SELECT */}
              <Form.Group className="mb-3">
                <Form.Label className="appointment-label">
                  Select Doctor
                </Form.Label>
                <Form.Select
                  name="doctor_id"
                  value={form.doctor_id}
                  onChange={change}
                  required
                  className="appointment-input"
                >
                  <option value="">-- Choose a Doctor --</option>
                  {doctors.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name} ({doc.specialty})
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              {/* DATE & TIME */}
              <Form.Group className="mb-4">
                <Form.Label className="appointment-label">
                  Date & Time
                </Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="appointment_date"
                  value={form.appointment_date}
                  onChange={change}
                  required
                  className="appointment-input"
                />
              </Form.Group>

              <Button type="submit" className="appointment-btn w-100">
                Book Appointment
              </Button>

            </Form>
          </div>
        </div>
      </div>
    </section>
  );
}
