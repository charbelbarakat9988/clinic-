import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // If not logged in OR not admin → block
  if (!token || role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}
