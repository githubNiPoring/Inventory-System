import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

// Cache the auth result for a short time to prevent rapid repeated calls
let authCache: { result: boolean; timestamp: number } | null = null;
const CACHE_DURATION = 5000; // 5 seconds

const checkAuth = async (): Promise<boolean> => {
  try {
    // Return cached result if it's still valid
    if (authCache && Date.now() - authCache.timestamp < CACHE_DURATION) {
      return authCache.result;
    }

    const response = await axios.get(`${BASE_URL}/api/v1/check-auth`, {
      withCredentials: true,
      timeout: 10000, // 10 second timeout
    });

    const isAuthenticated = response.data.authenticated || false;

    // Cache the result
    authCache = {
      result: isAuthenticated,
      timestamp: Date.now(),
    };

    return isAuthenticated;
  } catch (error: any) {
    console.error("Auth check failed:", error.response?.data || error.message);

    // If it's a network error or server error, return false but don't cache
    if (error.code === "NETWORK_ERROR" || error.response?.status >= 500) {
      console.error("Network/Server error during auth check");
      return false;
    }

    // Cache the failed result for a shorter time
    authCache = {
      result: false,
      timestamp: Date.now(),
    };

    return false;
  }
};

// Export a function to clear the cache (useful after login/logout)
export const clearAuthCache = () => {
  authCache = null;
};

export default checkAuth;
