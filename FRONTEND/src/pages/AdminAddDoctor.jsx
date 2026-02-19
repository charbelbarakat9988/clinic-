import { useState, useEffect } from "react";
import { Form, Button, Alert, Table } from "react-bootstrap";
import api from "../api";

export default function AdminAddDoctor() {
  const [name, setName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [bio, setBio] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [saving, setSaving] = useState(false);
  const [doctors, setDoctors] = useState([]);

  // Fetch all doctors
  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await api.get("/doctors");
      setDoctors(response.data);
    } catch (err) {
      console.error("Error fetching doctors:", err);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSaving(true);

    try {
      if (!name.trim() || !specialty.trim()) {
        setError("Name and Specialty are required");
        setSaving(false);
        return;
      }

      const fd = new FormData();
      fd.append("name", name.trim());
      fd.append("specialty", specialty.trim());
      fd.append("bio", bio.trim());
      if (imageFile) fd.append("image", imageFile);

      await api.post("/doctors", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess("Doctor added successfully!");
      setName("");
      setSpecialty("");
      setBio("");
      setImageFile(null);
      setPreview("");
      
      // Refresh doctors list
      await fetchDoctors();
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Error adding doctor");
      console.error("Error:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section style={{ minHeight: "80vh", padding: "60px 20px" }}>
      <div className="container">
        <h2 className="fw-bold text-center mb-4">Add Doctor</h2>

        <div className="row">
          <div className="col-md-6 mx-auto">
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold" htmlFor="doctorName">Doctor Name *</Form.Label>
                <Form.Control
                  id="doctorName"
                  type="text"
                  placeholder="Enter doctor name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-bold" htmlFor="specialty">Specialization/Specialty *</Form.Label>
                <Form.Control
                  id="specialty"
                  type="text"
                  placeholder="e.g., Cardiology, Orthopedics, Surgery, etc."
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-bold" htmlFor="bio">Bio/Description</Form.Label>
                <Form.Control
                  id="bio"
                  as="textarea"
                  rows={4}
                  placeholder="Enter doctor bio or information (optional)"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-bold" htmlFor="doctorImage">Doctor Photo</Form.Label>
                <Form.Control
                  id="doctorImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {preview && (
                  <div className="mt-3">
                    <img 
                      src={preview} 
                      alt="Doctor preview" 
                      style={{ maxWidth: "200px", maxHeight: "200px", borderRadius: "8px" }} 
                    />
                  </div>
                )}
              </Form.Group>

              <Button 
                variant="success" 
                type="submit" 
                disabled={saving}
                className="w-100"
              >
                {saving ? "Adding..." : "Add Doctor"}
              </Button>
            </form>
          </div>
        </div>

        {/* Doctors List */}
        <div className="row mt-5">
          <div className="col-12">
            <h3 className="fw-bold mb-3">All Doctors</h3>
            {doctors.length === 0 ? (
              <Alert variant="info">No doctors added yet</Alert>
            ) : (
              <div className="table-responsive">
                <Table striped bordered hover>
                  <thead className="table-dark">
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Specialty</th>
                      <th>Bio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doctors.map((doctor) => (
                      <tr key={doctor.doctor_id}>
                        <td>{doctor.doctor_id}</td>
                        <td>{doctor.name}</td>
                        <td>{doctor.specialization || doctor.specialty}</td>
                        <td>{doctor.bio || "N/A"}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
