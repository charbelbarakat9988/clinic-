import "./Footer.css";
import { FaWhatsapp, FaInstagram, FaFacebookF, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="footer-premium">
      <div className="container">
        <div className="row gy-4 align-items-start">

          {/* BRAND */}
          <div className="col-md-4 text-center text-md-start">
            <h4 className="footer-title">LeVelty Pet Clinic</h4>
            <p className="footer-desc">
              Premium veterinary care, grooming, and wellness services for your pets.
            </p>
          </div>

          {/* CONTACT */}
          <div className="col-md-4 text-center">
            <h6 className="footer-heading">Contact</h6>

            <p className="footer-text">
              <FaPhoneAlt className="footer-icon" />
              <a href="tel:+96181000000" className="footer-link">
                +961 81 000 000
              </a>
            </p>

            <p className="footer-text">
              <FaEnvelope className="footer-icon" />
              <a href="mailto:info@leveltyclinic.com" className="footer-link">
                info@leveltyclinic.com
              </a>
            </p>

            <p className="footer-text">
              <FaMapMarkerAlt className="footer-icon" />
              <a
                href="https://www.google.com/maps/search/?api=1&query=Tripoli+Lebanon"
                target="_blank"
                rel="noreferrer"
                className="footer-link"
              >
                Tripoli, Lebanon
              </a>
            </p>
          </div>

          {/* SOCIAL */}
          <div className="col-md-4 text-center text-md-end">
            <h6 className="footer-heading">Follow Us</h6>

            <div className="footer-social">
              <a
                href="https://wa.me/96181000000"
                target="_blank"
                rel="noreferrer"
                className="social-link"
              >
                <FaWhatsapp />
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="social-link"
              >
                <FaInstagram />
              </a>

              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="social-link"
              >
                <FaFacebookF />
              </a>
            </div>
          </div>
        </div>

        {/* COPYRIGHT */}
        <div className="footer-bottom">
          <p>© 2025 LeVelty Pet Clinic — All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
}
