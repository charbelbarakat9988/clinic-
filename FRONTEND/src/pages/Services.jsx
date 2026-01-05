import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ServiceCard from "../components/ServiceCard";
import api from "../api";
import "./Services.css";

// Import local images to attach to fetched services
import service1 from "../assets/images/service1.jpeg";
import service2 from "../assets/images/service2.jpeg";
import service3 from "../assets/images/service3.jpeg";
import service4 from "../assets/images/service4.jpeg";
import service5 from "../assets/images/service5.jpeg";
import service6 from "../assets/images/service6.jpeg";

const images = [service1, service2, service3, service4, service5, service6];

export default function Services() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get("/services");
        // Map backend fields to frontend shape and attach local images by id
        const mapped = data.map((s) => ({
          id: s.service_id,
          title: s.name,
          description: s.description,
          price: s.price,
          image: images[s.service_id - 1] || null,
        }));
        setServices(mapped);
      } catch (err) {
        console.error("Fetch services error:", err);
      }
    };
    fetch();
  }, []);

  const handleServiceClick = (service) => {
    const isLoggedIn = localStorage.getItem("token");

    if (!isLoggedIn) {
      alert("Login first");
      navigate("/login");
    } else {
      navigate("/appointments", {
        state: { service },
      });
    }
  };

  return (
    <section className="services-section">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="fw-bold">Our Professional Services</h2>
          <p className="lead text-secondary">
            Medical care, grooming, and wellness — all under one roof.
          </p>
        </div>

        <div className="row">
          {services.map((service) => (
            <div className="col-md-4 mb-4" key={service.id}>
              <ServiceCard
                {...service}
                onClick={() => handleServiceClick(service)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
