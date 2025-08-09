import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const checkAuth = async (): Promise<boolean> => {
  try {
    console.log("Checking auth with BASE_URL:", BASE_URL);

    const response = await axios.get(`${BASE_URL}/api/v1/check-auth`, {
      withCredentials: true,
      timeout: 10000, // 10 second timeout
    });

    console.log("Auth check response:", response.data);
    return response.data.authenticated || false;
  } catch (error: any) {
    console.error("Auth check failed:", error.response?.data || error.message);

    // If it's a network error or server error, return false but don't retry
    if (error.code === "NETWORK_ERROR" || error.response?.status >= 500) {
      console.error("Network/Server error during auth check");
    }

    return false;
  }
};

export default checkAuth;
