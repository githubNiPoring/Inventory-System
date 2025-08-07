import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const verification = () => {
  const { id, token } = useParams();
  const [verificationStatus, setVerificationStatus] =
    useState<string>("loading"); // 'loading', 'success', 'error'
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Use the userId and token from URL parameters in your API call
        const response = await axios.get(
          `${BASE_URL}/api/v1/${id}/verify/${token}`
        );

        console.log(id, token);
        console.log(response);

        // Handle successful verification
        if (response.status === 200) {
          setVerificationStatus("success");
          setMessage(response.data?.message || "Email verified successfully!");
        }
      } catch (error: any) {
        setVerificationStatus("error");
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "An error occurred during verification";
        setMessage(errorMessage);
      }
    };

    // Only verify if we have both userId and token
    if (id && token) {
      verifyEmail();
    } else {
      setVerificationStatus("error");
      setMessage("Invalid verification link");
    }
  }, [id, token]);

  // Render different content based on verification status
  const renderContent = () => {
    switch (verificationStatus) {
      case "loading":
        return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-base">
            <div className="w-12 h-12 mb-4 border-b-2 border-blue-500 rounded-full animate-spin"></div>
            <h1 className="text-2xl font-bold text-gray-700">
              Verifying your email...
            </h1>
            <p className="mt-2 text-gray-500">
              Please wait while we verify your account.
            </p>
          </div>
        );

      case "success":
        return (
          <div className="flex flex-col items-center justify-center min-h-screen text-center bg-base">
            <div className="p-4 mb-4 bg-green-100 rounded-full">
              <svg
                className="w-12 h-12 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="mb-2 text-2xl font-bold text-green-600">
              Email Verified Successfully!
            </h1>
            <p className="mb-4 text-gray-600">{message}</p>
            <button
              className="px-6 py-2 text-white transition-colors bg-blue-500 rounded hover:bg-blue-600"
              onClick={() => (window.location.href = "/login")} // or use React Router navigate
            >
              Continue to Login
            </button>
          </div>
        );

      case "error":
        return (
          <div className="flex flex-col items-center justify-center min-h-screen text-center bg-base">
            <div className="p-4 mb-4 bg-red-100 rounded-full">
              <svg
                className="w-12 h-12 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h1 className="mb-2 text-2xl font-bold text-red-600">
              Verification Failed
            </h1>
            <p className="mb-4 text-gray-600">{message}</p>
            <div className="space-x-4">
              <button
                className="px-6 py-2 text-white transition-colors bg-blue-500 rounded hover:bg-blue-600"
                onClick={() => (window.location.href = "/home")} // or use React Router navigate
              >
                Back to homepage
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return <div className="min-h-screen bg-gray-50">{renderContent()}</div>;
};

export default verification;
