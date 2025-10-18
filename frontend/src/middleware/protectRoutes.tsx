import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { type ReactNode } from "react";

interface ProtectedRoutesProps {
  children: ReactNode;
}

function ProtectedRoutes({ children }: ProtectedRoutesProps) {
  const { accessToken, mainLoading } = useAuth();

  // Show loading state while checking authentication
  if (mainLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  // Return children if authenticated
  return <>{children}</>;
}

export default ProtectedRoutes;