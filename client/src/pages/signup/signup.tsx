import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

import { Eye, EyeClosed } from "lucide-react";

import getTokenFromCookie from "../components/authhook";

interface FormData {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  cpassword: string;
}

interface ResponseMessage {
  text: string;
  isSuccess: boolean;
}

interface ResponseMessage {
  text: string;
  isSuccess: boolean;
}

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    cpassword: "",
  });
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [passwordError, setPasswordError] = useState<string>("");
  const [responseMessage, setResponseMessage] =
    useState<ResponseMessage | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  useEffect(() => {
    const token = getTokenFromCookie();
    if (token) {
      // User is already logged in, redirect to home
      navigate("/home", { replace: true });
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // Clear password error when user starts typing
    if (name === "password" || name === "cpassword") {
      setPasswordError("");
    }
  };

  const validatePasswords = () => {
    if (formData.password !== formData.cpassword) {
      setPasswordError("Passwords do not match");
      return false;
    }
    if (formData.password.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (!validatePasswords()) {
      return;
    }

    // Clear any existing response message
    setResponseMessage(null);

    try {
      const response = await axios.post(`${BASE_URL}/api/v1/signup`, formData, {
        withCredentials: true,
      });

      // Handle success response
      if (response.data.success) {
        setResponseMessage({
          text: response.data.message,
          isSuccess: true,
        });
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "An error occurred during signup";
      setResponseMessage({
        text: errorMessage,
        isSuccess: false,
      });
      console.log(error);
    } finally {
      setIsLoading(false);
    }
    // Optionally clear the form on success
    setFormData({
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      cpassword: "",
    });
  };

  const isFormValid = () => {
    return (
      formData.firstname.trim() !== "" &&
      formData.lastname.trim() !== "" &&
      formData.email.trim() !== "" &&
      formData.password !== "" &&
      formData.cpassword !== "" &&
      formData.password === formData.cpassword &&
      formData.password.length >= 8
    );
  };

  return (
    <>
      <div className="flex items-center justify-center h-screen p-6 cursor-default bg-base">
        <div className="flex flex-col w-full p-0 text-gray-100 rounded-lg bg-base md:bg-secondary md:w-8/12 lg:w-7/12 md:p-6">
          <h1 className="mb-2 text-2xl font-bold">Create Account</h1>
          <p className="mb-4">
            Please enter your credentials to Create an account.
          </p>
          <hr className="mb-6 border-active" />

          {/* Response message display */}
          {responseMessage && (
            <div
              className={`mb-4 p-3 border rounded ${
                responseMessage.isSuccess
                  ? "text-green-300 bg-green-900/30 border-green-500"
                  : "text-red-300 bg-red-900/30 border-red-500"
              }`}
            >
              {responseMessage.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-3">
              <div className="mb-4">
                <label htmlFor="firstname" className="block mb-2 text-gray-200">
                  First Name
                </label>
                <input
                  type="firstname"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-gray-100 border border-gray-500 rounded bg-active focus:outline-none focus:ring-2 focus:ring-active2 focus:border-transparent"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="lastname" className="block mb-2 text-gray-200">
                  Last Name
                </label>
                <input
                  type="lastname"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-gray-100 border border-gray-500 rounded bg-active focus:outline-none focus:ring-2 focus:ring-active2 focus:border-transparent"
                  required
                />
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block mb-2 text-gray-200">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 text-gray-100 border border-gray-500 rounded bg-active focus:outline-none focus:ring-2 focus:ring-active2 focus:border-transparent"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block mb-2 text-gray-200">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 text-gray-100 border border-gray-500 rounded bg-active focus:outline-none focus:ring-2 focus:ring-active2 focus:border-transparent"
                required
                minLength={8}
              />
            </div>
            <div className="mb-10">
              <label htmlFor="cpassword" className="block mb-2 text-gray-200">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="cpassword"
                  value={formData.cpassword}
                  onChange={handleChange}
                  className="w-full px-3 py-2 pr-12 text-gray-100 border border-gray-500 rounded bg-active focus:outline-none focus:ring-2 focus:ring-active2 focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 flex items-center text-gray-400 transition-colors duration-200 right-3 hover:text-gray-200 focus:outline-none"
                >
                  <div className="relative w-5 h-5">
                    <Eye
                      size={20}
                      className={`absolute inset-0 transition-opacity duration-300 ${
                        showPassword
                          ? "opacity-0 scale-75 rotate-12"
                          : "opacity-100 scale-100 rotate-0"
                      }`}
                    />
                    <EyeClosed
                      size={20}
                      className={`absolute inset-0 transition-opacity duration-300 ${
                        showPassword
                          ? "opacity-100 scale-100 rotate-0"
                          : "opacity-0 scale-75 -rotate-12"
                      }`}
                    />
                  </div>
                </button>
              </div>
            </div>

            {/* Error message display */}
            {passwordError && (
              <div className="p-3 mb-4 text-red-300 border border-red-500 rounded bg-red-900/30">
                {passwordError}
              </div>
            )}

            <div className="mb-10">
              <button
                type="submit"
                disabled={!isFormValid() || isLoading}
                className={`w-full px-4 py-2 mb-4 font-medium text-white rounded focus:outline-none focus:ring-2 focus:ring-active2 focus:ring-offset-2 focus:ring-offset-gray-700 transition-colors ${
                  isFormValid() && !isLoading
                    ? "bg-active2 hover:bg-blue-700"
                    : "bg-gray-600 cursor-not-allowed opacity-50"
                }`}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </button>
            </div>
          </form>

          <p className="text-center text-gray-300">
            Have an account?{" "}
            <a href="/login" className="text-active2 hover:text-blue-300">
              {" "}
              Continue to login
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Signup;
