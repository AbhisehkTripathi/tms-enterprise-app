import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "@/libs/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Wraps protected routes; redirects to login when not authenticated.
 */
export function ProtectedRoute({ children }: ProtectedRouteProps): React.ReactElement {
  const location = useLocation();
  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
}
