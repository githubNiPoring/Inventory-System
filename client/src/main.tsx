import { createRoot } from "react-dom/client";
import "./index.css";

import Login from "./pages/login/login.tsx";
import Signup from "./pages/signup/signup.tsx";
import Verification from "./pages/verification/verification.tsx";
import App from "./App.tsx";

import ProtectedRoute from "./pages/components/protectedRoutes.tsx";
import Pagenotfound from "./pages/components/404/page-not-found.tsx";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      {/* Login */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Homepage */}
      <Route path="/" element={<Navigate to="/home" />} />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <App />
          </ProtectedRoute>
        }
      />

      {/* Verification */}
      <Route path="/:id/verify/:token" element={<Verification />} />

      {/* page not found */}
      <Route path="*" element={<Navigate to="/404" />} />
      <Route path="/404" element={<Pagenotfound />} />
    </Routes>
  </BrowserRouter>
);
