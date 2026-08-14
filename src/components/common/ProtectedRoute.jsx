import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const homeForRole = (role) => {
  if (role === "admin") return "/admin";
  if (role === "landlord") return "/landlord";
  return "/";
};

export default function ProtectedRoute({ children, allowedRoles }) {
  const { currentUser, profile } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(profile?.role)) {
    return <Navigate to={homeForRole(profile?.role)} replace />;
  }

  return children;
}
