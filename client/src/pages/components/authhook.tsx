import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const checkAuth = async (): Promise<boolean> => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/check-auth`, {
      withCredentials: true,
    });

    return response.data.authenticated;
  } catch (error) {
    return false;
  }
};

export default checkAuth;
