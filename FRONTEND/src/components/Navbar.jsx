import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import logo from "../assets/images/le_velty_logo.jpg";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

export default function NavbarComponent() {
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ✅ Detect login EVERY time page changes
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");

    setIsLoggedIn(!!token);
    setRole(storedRole);
  }, [location.pathname]); // ✅ key line

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("client_id");
    localStorage.removeItem("user");

    alert("Logged out successfully!");
    navigate("/login");
  };

  return (
    <Navbar
      expand="lg"
      fixed="top"
      className={`navbar-upgrade ${scrolled ? "navbar-scrolled" : ""}`}
    >
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand className="d-flex align-items-center brand-area">
            <img
              src={logo}
              height={scrolled ? "34" : "50"}
              className="logo-img"
              alt="LeVelty Logo"
            />
            <span className={`brand-title ${scrolled ? "shrink-text" : ""}`}>
              LeVelty Pet Clinic
            </span>
          </Navbar.Brand>
        </LinkContainer>

        <Navbar.Toggle aria-controls="navbar-nav" />

        <Navbar.Collapse id="navbar-nav" className="justify-content-end">
          <Nav className="nav-links align-items-lg-center">
            <LinkContainer to="/">
              <Nav.Link className="nav-item-link">Home</Nav.Link>
            </LinkContainer>

            <LinkContainer to="/services">
              <Nav.Link className="nav-item-link">Services</Nav.Link>
            </LinkContainer>

            <LinkContainer to="/shop">
              <Nav.Link className="nav-item-link">Shop</Nav.Link>
            </LinkContainer>

            <LinkContainer to="/appointments">
              <Nav.Link className="nav-item-link">Appointments</Nav.Link>
            </LinkContainer>

            <LinkContainer to="/cart">
              <Nav.Link className="nav-item-link">Cart</Nav.Link>
            </LinkContainer>

            {/* ✅ Show Orders only if logged in */}
            {isLoggedIn && (
              <LinkContainer to="/orders">
                <Nav.Link className="nav-item-link">Orders</Nav.Link>
              </LinkContainer>
            )}

            {/* ✅ Admin link only if admin */}
            {isLoggedIn && role === "admin" && (
              <LinkContainer to="/admin">
                <Nav.Link className="nav-item-link">Admin</Nav.Link>
              </LinkContainer>
            )}

            {/* ✅ If NOT logged in → show Login/Register */}
            {!isLoggedIn && (
              <>
                <LinkContainer to="/login">
                  <Nav.Link className="nav-item-link">Login</Nav.Link>
                </LinkContainer>

                <LinkContainer to="/register">
                  <Nav.Link className="nav-item-link">Register</Nav.Link>
                </LinkContainer>
              </>
            )}

            {/* ✅ If logged in → show Logout */}
            {isLoggedIn && (
              <Button
                variant="outline-danger"
                className="ms-lg-3 mt-3 mt-lg-0"
                onClick={handleLogout}
              >
                Logout
              </Button>
            )}

            <LinkContainer to="/appointments">
              <Button className="nav-cta-btn ms-lg-3 mt-3 mt-lg-0">
                Book Now
              </Button>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
