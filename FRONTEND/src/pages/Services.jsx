import { useNavigate } from "react-router-dom";
import ServiceCard from "../components/ServiceCard";
import "./Services.css";

// ✅ Import your service images (use your real names)
import service1 from "../assets/images/service1.jpeg";
import service2 from "../assets/images/service2.jpeg";
import service3 from "../assets/images/service3.jpeg";
import service4 from "../assets/images/service4.jpeg";
import service5 from "../assets/images/service5.jpeg";
import service6 from "../assets/images/service6.jpeg";

export default function Services() {
  const navigate = useNavigate();

  const services = [
    {
      id: 1,
      title: "General Veterinary Checkup",
      description: "Full health evaluation & early disease detection.",
      image: service1,
    },
    {
      id: 2,
      title: "Pet Grooming & Hygiene",
      description: "Bathing, grooming, nail trimming, and fur styling.",
      image: service2,
    },
    {
      id: 3,
      title: "Vaccinations",
      description: "All certified vaccines to keep your pet protected.",
      image: service3,
    },
    {
      id: 4,
      title: "Surgery & Emergency Care",
      description: "Modern surgical tools & 24/7 emergency support.",
      image: service4,
    },
    {
      id: 5,
      title: "Dental Cleaning",
      description: "Professional scaling, polishing & oral treatments.",
      image: service5,
    },
    {
      id: 6,
      title: "Nutritional Guidance",
      description: "Pet diet plans approved by veterinary experts.",
      image: service6,
    },
  ];

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
