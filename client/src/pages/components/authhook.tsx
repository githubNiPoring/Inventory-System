import axios from "axios";
// import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const checkAuth = async (): Promise<boolean> => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const response = await axios.get(`${BASE_URL}/api/v1/check-auth`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 10000,
    });

    console.log("this is the response: " + response.data);

    return response.data.authenticated || false;
  } catch (error) {
    console.error("Auth check failed:", error);
    return false;
  }
};

export default checkAuth;
