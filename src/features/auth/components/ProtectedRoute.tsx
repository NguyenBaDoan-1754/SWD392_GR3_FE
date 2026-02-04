import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../hook/useAuth";
import { getUserProfileApi } from "../../../api/auth.api";

interface ProtectedRouteProps {
  element: React.ReactElement;
  requiredRoles?: string[];
}

/**
 * ProtectedRoute component to handle role-based access control
 * @param element - The component to render if user has access
 * @param requiredRoles - Array of roles that are allowed to access this route
 *                        If undefined, all authenticated users can access
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  element,
  requiredRoles,
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    // Only fetch role if we need to check permissions
    if (!isAuthenticated) {
      setRoleLoading(false);
      return;
    }

    if (!requiredRoles || requiredRoles.length === 0) {
      setRoleLoading(false);
      return;
    }

    const fetchUserRole = async () => {
      try {
        const profile = await getUserProfileApi();
        setUserRole(profile?.role);
      } catch (err) {
        console.error("Failed to fetch user role:", err);
      } finally {
        setRoleLoading(false);
      }
    };

    fetchUserRole();
  }, [isAuthenticated, requiredRoles]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-950">
        <div className="text-slate-400">Loading auth...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If we need to check roles, wait for role data to be fetched
  if (requiredRoles && requiredRoles.length > 0) {
    if (!userRole) {
      return (
        <div className="flex items-center justify-center h-screen bg-slate-950">
          <div className="text-slate-400">Checking permissions...</div>
        </div>
      );
    }
    const userRoles = [userRole];
    const hasRequiredRole = userRoles.some((role) =>
      requiredRoles.some((req) => role.toUpperCase() === req.toUpperCase()),
    );

    if (!hasRequiredRole) {
      return <Navigate to="/404" replace />;
    }
  }

  return element;
};
