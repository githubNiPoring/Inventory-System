import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRoutesProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRoutesProps) => {
  const getTokenFromCookie = () => {
    const cookies = document.cookie.split(";");

    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split("=");
      if (name === "token") {
        return value;
      }
    }

    return null;
  };

  const token = getTokenFromCookie();

  // If no token exists, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If token exists, render the protected component
  return <>{children}</>;
};

export default ProtectedRoute;
