import { useEffect, useState, useRef } from "react";
import { Carousel, Button, Accordion } from "react-bootstrap";
import "./Home.css";

import slide1 from "../assets/images/slide1.jpeg";
import slide2 from "../assets/images/slide2.jpeg";
import slide3 from "../assets/images/slide3.jpeg";
import slide4 from "../assets/images/slide4.jpeg";
import slide5 from "../assets/images/slide5.jpeg";
import slide6 from "../assets/images/slide6.jpeg";

import doctor1 from "../assets/images/doctor1.jpeg";
import doctor2 from "../assets/images/doctor2.jpeg";
import doctor3 from "../assets/images/doctor3.jpeg";

const sliderImages = [slide1, slide2, slide3, slide4, slide5, slide6];

function CountUp({ end, duration = 2000, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let startTime = null;
          const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

export default function Home() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const elements = document.querySelectorAll(".fade-up");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("show");
        });
      },
      { threshold: 0.15 }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <>
      {/* HERO SECTION */}
      <section className="hero-section">
        <Carousel fade controls={false} indicators interval={150}>
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

      {/* STATS COUNTER SECTION */}
      <section className="stats-section fade-up">
        <div className="container">
          <div className="row text-center g-4">
            {[
              { label: "Pets Treated", end: 1500, suffix: "+" },
              { label: "Years of Experience", end: 12, suffix: "+" },
              { label: "Expert Doctors", end: 20, suffix: "+" },
              { label: "Happy Clients", end: 900, suffix: "+" },
            ].map((stat, i) => (
              <div className="col-6 col-md-3" key={i}>
                <div className="stat-card">
                  <h3 className="stat-number">
                    <CountUp end={stat.end} suffix={stat.suffix} />
                  </h3>
                  <p className="stat-label">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
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
                  <p className="fst-italic">"{t.text}"</p>
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
            Experienced veterinarians dedicated to your pet's health and
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

      {/* FAQ SECTION */}
      <section className="faq-section py-5 fade-up">
        <div className="container">
          <h2 className="fw-bold text-center mb-4">Frequently Asked Questions</h2>
          <Accordion defaultActiveKey="0" className="faq-accordion">
            {[
              {
                q: "How do I book an appointment?",
                a: "You can book directly through our Appointments page. Simply choose your preferred date, time, and doctor.",
              },
              {
                q: "What pets do you treat?",
                a: "We treat dogs, cats, birds, rabbits, and other small animals. Contact us if you have a specific pet type.",
              },
              {
                q: "Do you offer emergency services?",
                a: "Yes! We provide 24/7 emergency care. Call us immediately at +961 81 000 000 in case of an emergency.",
              },
              {
                q: "Can I buy pet products online?",
                a: "Absolutely! Visit our Shop to browse and order premium pet food, accessories, and health products.",
              },
            ].map((item, i) => (
              <Accordion.Item eventKey={String(i)} key={i}>
                <Accordion.Header>{item.q}</Accordion.Header>
                <Accordion.Body>{item.a}</Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </div>
      </section>

      {/* INTRODUCTION SECTION */}
      <section className="intro-section bg-white text-center py-5">
        <div className="container">
          <h2 className="fw-bold fade-up">Welcome to LeVetly Pet Clinic</h2>
          <p className="lead mt-3 fade-up">
            Where medical excellence meets compassionate care.
            <br />
            Your pet deserves the highest standards of wellness.
          </p>
        </div>
      </section>

      {/* BACK TO TOP */}
      <button
        className={`back-to-top ${showTop ? "visible" : ""}`}
        onClick={scrollToTop}
        aria-label="Back to top"
      >
        ↑
      </button>
    </>
  );
}
