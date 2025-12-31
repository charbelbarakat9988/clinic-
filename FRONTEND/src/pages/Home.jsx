import { useEffect } from "react";
import { Carousel, Button } from "react-bootstrap";
import "./Home.css";

// ✅ Import your slides
import slide1 from "../assets/images/slide1.jpeg";
import slide2 from "../assets/images/slide2.jpeg";
import slide3 from "../assets/images/slide3.jpeg";
import slide4 from "../assets/images/slide4.jpeg";
import slide5 from "../assets/images/slide5.jpeg";
import slide6 from "../assets/images/slide6.jpeg";

// ✅ Import doctor images (make sure these exist)
import doctor1 from "../assets/images/doctor1.jpeg";
import doctor2 from "../assets/images/doctor2.jpeg";
import doctor3 from "../assets/images/doctor3.jpeg";

// ✅ Put slides in an array
const sliderImages = [slide1, slide2, slide3, slide4, slide5, slide6];

export default function Home() {
  // ✅ Scroll reveal animation for .fade-up
  useEffect(() => {
    const elements = document.querySelectorAll(".fade-up");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      { threshold: 0.15 }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* HERO SECTION */}
      <section className="hero-section">
        <Carousel fade controls={false} indicators interval={4500}>
          {sliderImages.map((img, idx) => (
            <Carousel.Item key={idx}>
              <div className="hero-image-container">
                <img
                  src={img}
                  className="hero-image"
                  alt={`Slide ${idx + 1}`}
                />
                <div className="hero-overlay"></div>
              </div>

              <Carousel.Caption className="hero-caption">
                <h1 className="hero-title">Premium Veterinary Care</h1>
                <p className="hero-subtitle">
                  Modern, compassionate, and professional pet healthcare.
                </p>

                <Button href="/services" className="hero-btn" size="lg">
                  Explore Services
                </Button>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>
      </section>

      {/* PARALLAX SECTION */}
      <section className="parallax-section">
        <div className="overlay"></div>
        <div className="container text-center">
          <h2 className="fw-bold fade-up">Caring For Your Pet Like Family</h2>
          <p
            className="fade-up"
            style={{ maxWidth: "600px", margin: "0 auto" }}
          >
            Trusted veterinarians & modern facilities ensuring your pet receives
            the best care.
          </p>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-white fade-up py-5">
        <div className="container text-center">
          <h2 className="fw-bold">What Our Clients Say</h2>
          <div className="row mt-4">
            {[
              { text: "Amazing service and friendly doctors!", name: "Sarah M." },
              { text: "My dog loves this clinic!", name: "Anthony R." },
              { text: "Clean, professional, and caring.", name: "Layal K." },
            ].map((t, i) => (
              <div className="col-md-4" key={i}>
                <div className="card p-4 shadow-sm h-100">
                  <p className="fst-italic">“{t.text}”</p>
                  <h6 className="mt-3 text-green fw-bold">— {t.name}</h6>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DOCTORS SECTION */}
      <section className="bg-light py-5 fade-up">
        <div className="container text-center">
          <h2 className="fw-bold mb-4">Meet Our Doctors</h2>
          <p className="text-secondary mb-5">
            Experienced veterinarians dedicated to your pet’s health and
            happiness.
          </p>

          <div className="row">
            {[
              {
                name: "Dr. Sarah Khalil",
                specialty: "Veterinary Surgeon",
                bio: "10+ years of experience in advanced surgical procedures and emergency care.",
                image: doctor1,
              },
              {
                name: "Dr. Mark Haddad",
                specialty: "Pet Nutrition Specialist",
                bio: "Expert in dietary planning and long-term pet wellness programs.",
                image: doctor2,
              },
              {
                name: "Dr. Lina Saad",
                specialty: "General Veterinarian",
                bio: "Compassionate care focused on preventive medicine and diagnostics.",
                image: doctor3,
              },
            ].map((doc, index) => (
              <div className="col-md-4 mb-4" key={index}>
                <div className="card shadow-sm h-100 doctor-card">
                  <img
                    src={doc.image}
                    alt={doc.name}
                    className="card-img-top doctor-img"
                  />
                  <div className="card-body">
                    <h5 className="fw-bold">{doc.name}</h5>
                    <p className="text-green fw-semibold">{doc.specialty}</p>
                    <p className="text-muted">{doc.bio}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INTRODUCTION SECTION */}
      <section className="intro-section bg-white text-center py-5">
        <div className="container">
          <h2 className="fw-bold fade-up">Welcome to LeVelty Pet Clinic</h2>
          <p className="lead mt-3 fade-up">
            Where medical excellence meets compassionate care.
            <br />
            Your pet deserves the highest standards of wellness.
          </p>
        </div>
      </section>
    </>
  );
}
