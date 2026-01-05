import "./ServiceCard.css";

const DEFAULT_SVG = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400'><rect width='100%25' height='100%25' fill='%23f0f0f0'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23888888' font-family='Arial' font-size='24'>Image%20not%20found</text></svg>";

export default function ServiceCard({ image, title, description, onClick }) {
  const handleImgError = (e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = DEFAULT_SVG;
  };

  return (
    <div className="service-card" onClick={onClick} style={{ cursor: "pointer" }}>
      <div className="service-img-wrapper">
        <img src={image || DEFAULT_SVG} alt={title} className="service-img" onError={handleImgError} />
      </div>

      <div className="service-body">
        <h5 className="service-title">{title}</h5>
        <p className="service-desc">{description}</p>
      </div>
    </div>
  );
}
