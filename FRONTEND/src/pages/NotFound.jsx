export default function NotFound() {
  return (
    <section className="text-center">
      <div className="container">
        <h2 className="fw-bold">404 - Page Not Found</h2>
        <p className="mt-3">The page you are looking for does not exist.</p>
        <a href="/" className="btn btn-primary mt-2">
          Back to Home
        </a>
      </div>
    </section>
  );
}
