import { useAuth } from "../context/authContext";
import { Navigate } from "react-router-dom";
import { type ReactNode } from "react";


interface GuestRouteProps {
  children: ReactNode;
}

function GuestRoute({ children }: GuestRouteProps) {
  const { accessToken, mainLoading } = useAuth();

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

  if (accessToken) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default GuestRoute;