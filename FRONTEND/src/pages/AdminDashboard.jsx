import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <section style={{ minHeight: "80vh", padding: "60px 0" }}>
      <div className="container">
        <h2 className="fw-bold text-center mb-4">Admin Dashboard</h2>

        <div className="row justify-content-center">
          <div className="col-md-4 mb-3">
            <div className="card p-4 text-center shadow-sm">
              <h5 className="fw-bold">Manage Products</h5>
              <p>Add, edit or delete shop products</p>
              <Link to="/shop" className="btn btn-primary">
                Go to Shop Admin
              </Link>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="card p-4 text-center shadow-sm">
              <h5 className="fw-bold">Manage Doctors</h5>
              <p>Add new doctors to the clinic</p>
              <Link to="/admin/doctors" className="btn btn-success">
                Add Doctors
              </Link>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="card p-4 text-center shadow-sm">
              <h5 className="fw-bold">Appointments</h5>
              <p>View all booked appointments</p>
              <button className="btn btn-secondary" disabled>
                Coming Soon
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
