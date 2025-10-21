import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { type ReactNode } from "react";
import MainLoading from "../components/MainLoading";


interface ProtectedRoutesProps {
  children: ReactNode;
}

function ProtectedRoutes({ children }: ProtectedRoutesProps) {
  const { accessToken, mainLoading } = useAuth();

  if (mainLoading) {
    return (
      <MainLoading></MainLoading>
    );
  }

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoutes;