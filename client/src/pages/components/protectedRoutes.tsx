import { type ReactNode, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import checkAuth from "./authhook";

interface ProtectedRoutesProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRoutesProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    const verifyAuth = async () => {
      try {
        const authenticated = await checkAuth();

        if (isMounted) {
          setIsAuthenticated(authenticated);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Auth verification failed:", error);
        if (isMounted) {
          setIsAuthenticated(false);
          setIsLoading(false);
        }
      }
    };

    verifyAuth();

    // Cleanup function to prevent state updates if component unmounts
    return () => {
      isMounted = false;
    };
  }, []);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-100">Verifying authentication...</div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the protected component
  return <>{children}</>;
};

export default ProtectedRoute;
