import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Eye, EyeClosed } from "lucide-react";

import getTokenFromCookie from "../components/authhook";

const BASE_URL = import.meta.env.VITE_BASE_URL;

interface FormData {
  email: string;
  password: string;
}

const Login = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getTokenFromCookie();
    if (token) {
      // User is already logged in, redirect to home
      navigate("/home", { replace: true });
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Make API call to your backend login endpoint
      const response = await axios.post(`${BASE_URL}/api/v1/login`, formData, {
        withCredentials: true, // This ensures cookies are sent/received
      });

      // If login successful, navigate to home
      if (response.status === 200) {
        navigate("/home");
      }
    } catch (err: any) {
      // Handle login errors
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center h-screen p-6 cursor-default bg-base">
        <div className="flex flex-col w-full p-0 text-gray-100 rounded-lg bg-base md:bg-secondary md:w-7/12 lg:w-5/12 md:p-6">
          <h1 className="mb-2 text-2xl font-bold">Login</h1>
          <p className="mb-4">Please enter your credentials to log in.</p>
          <hr className="mb-6 border-active" />

          {error && (
            <div className="p-3 mb-4 text-red-400 border border-red-400 rounded bg-red-900/20">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
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
              />
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block mb-2 text-gray-200">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-gray-100 border border-gray-500 rounded bg-active focus:outline-none focus:ring-2 focus:ring-active2 focus:border-transparent"
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

            <div className="mb-4">
              <a href="#" className="text-active2 hover:text-blue-300">
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 mb-4 font-medium text-white rounded bg-active2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-active2 focus:ring-offset-2 focus:ring-offset-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-center text-gray-300">
            Don't have an account?{" "}
            <a href="/signup" className="text-active2 hover:text-blue-300">
              {" "}
              Sign Up Here
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
