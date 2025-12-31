import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import api from "../api";
import { useNavigate } from "react-router-dom";
import "../index.css";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const navigate = useNavigate();

  const change = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", form);
      alert("Account created successfully!");
      navigate("/login");
    } catch (err) {
      alert("Registration failed. Email may be in use.");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">

        <h2 className="auth-title">Create Your Account</h2>

        <Form onSubmit={submit}>
          
          {/* Name */}
          <Form.Group className="mb-3 position-relative">
            <span className="input-icon">👤</span>
            <Form.Control
              className="auth-input"
              placeholder="Full Name"
              name="name"
              value={form.name}
              onChange={change}
              required
            />
          </Form.Group>

          {/* Email */}
          <Form.Group className="mb-3 position-relative">
            <span className="input-icon">📧</span>
            <Form.Control
              className="auth-input"
              type="email"
              placeholder="Email Address"
              name="email"
              value={form.email}
              onChange={change}
              required
            />
          </Form.Group>

          {/* Password */}
          <Form.Group className="mb-3 position-relative">
            <span className="input-icon">🔒</span>
            <Form.Control
              className="auth-input"
              type="password"
              placeholder="Create Password"
              name="password"
              value={form.password}
              onChange={change}
              required
            />
          </Form.Group>

          {/* Phone */}
          <Form.Group className="mb-3 position-relative">
            <span className="input-icon">📱</span>
            <Form.Control
              className="auth-input"
              placeholder="Phone Number"
              name="phone"
              value={form.phone}
              onChange={change}
              required
            />
          </Form.Group>

          <Button type="submit" className="auth-btn w-100">
            Create Account
          </Button>

          <div className="auth-text-link">
            Already have an account?
            <br />
            <a href="/login">Login Here</a>
          </div>
        </Form>
      </div>
    </div>
  );
}
