import "./ServiceCard.css";

export default function ServiceCard({ image, title, description, onClick }) {
  return (
    <div className="service-card" onClick={onClick} style={{ cursor: "pointer" }}>
      <div className="service-img-wrapper">
        <img src={image} alt={title} className="service-img" />
      </div>

      <div className="service-body">
        <h5 className="service-title">{title}</h5>
        <p className="service-desc">{description}</p>
      </div>
    </div>
  );
}
