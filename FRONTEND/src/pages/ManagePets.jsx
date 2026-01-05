import { useEffect, useState } from "react";
import { Form, Button, Table } from "react-bootstrap";
import api from "../api";
import "./Appointments.css";

export default function ManagePets() {
  const [pets, setPets] = useState([]);
  const [form, setForm] = useState({ pet_name: "", species: "", breed: "", age: "" });
  const [loading, setLoading] = useState(false);

  const fetchPets = async () => {
    try {
      const { data } = await api.get("/pets");
      setPets(data);
    } catch (err) {
      console.error("Fetch pets error:", err);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.pet_name) return alert("Pet name is required");
    try {
      setLoading(true);
      const { data } = await api.post("/pets", {
        pet_name: form.pet_name,
        species: form.species,
        breed: form.breed,
        age: form.age ? Number(form.age) : null,
      });
      setPets((p) => [data, ...p]);
      setForm({ pet_name: "", species: "", breed: "", age: "" });
      alert("Pet added successfully");
    } catch (err) {
      console.error("Add pet error:", err);
      alert("Error adding pet");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="appointment-section">
      <div className="container">
        <div className="text-center">
          <h2 className="appointment-title">Manage Pets</h2>
          <p className="appointment-subtitle">Add and view your pets.</p>
        </div>

        <div className="row justify-content-center mt-4">
          <div className="col-lg-6 col-md-8">
            <Form onSubmit={submit} className="appointment-card mb-4">
              <Form.Group className="mb-3">
                <Form.Label className="appointment-label">Pet Name</Form.Label>
                <Form.Control name="pet_name" value={form.pet_name} onChange={change} required className="appointment-input" />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="appointment-label">Species</Form.Label>
                <Form.Control name="species" value={form.species} onChange={change} className="appointment-input" />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="appointment-label">Breed</Form.Label>
                <Form.Control name="breed" value={form.breed} onChange={change} className="appointment-input" />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="appointment-label">Age</Form.Label>
                <Form.Control type="number" min="0" name="age" value={form.age} onChange={change} className="appointment-input" />
              </Form.Group>

              <Button type="submit" disabled={loading} className="appointment-btn w-100">
                {loading ? "Adding..." : "Add Pet"}
              </Button>
            </Form>

            <div className="appointment-card p-3">
              <h5>Your Pets</h5>
              <Table responsive bordered className="mt-3">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Species</th>
                    <th>Breed</th>
                    <th>Age</th>
                  </tr>
                </thead>
                <tbody>
                  {pets.length === 0 && (
                    <tr><td colSpan={4} className="text-center">No pets found.</td></tr>
                  )}
                  {pets.map((p) => (
                    <tr key={p.pet_id}>
                      <td>{p.pet_name}</td>
                      <td>{p.species || "-"}</td>
                      <td>{p.breed || "-"}</td>
                      <td>{p.age ?? "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
