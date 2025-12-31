import { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import api, { setAuthToken } from "../api";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  const navigate = useNavigate();

  const change = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", form);

      // ✅ SAVE TOKEN FOR API
      setAuthToken(res.data.token);

      // ✅ SAVE USER INFO
      localStorage.setItem("client_id", res.data.client_id);
      localStorage.setItem("role", res.data.role);

      // ✅ REDIRECT BASED ON ROLE
      if (res.data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Login to manage your pet’s care ✨</p>

        {/* ✅ Error Alert */}
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={submit}>
          {/* EMAIL */}
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

          {/* PASSWORD */}
          <Form.Group className="mb-3 position-relative">
            <span className="input-icon">🔒</span>
            <Form.Control
              className="auth-input"
              type={showPass ? "text" : "password"}
              placeholder="Your Password"
              name="password"
              value={form.password}
              onChange={change}
              required
            />

            {/* ✅ Show/Hide password */}
            <span
              className="toggle-pass"
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? "🙈" : "👁️"}
            </span>
          </Form.Group>

          <Button type="submit" className="auth-btn w-100">
            Login
          </Button>

          <div className="auth-text-link">
            Don’t have an account? <Link to="/register">Create Account</Link>
          </div>
        </Form>
      </div>
    </div>
  );
}
