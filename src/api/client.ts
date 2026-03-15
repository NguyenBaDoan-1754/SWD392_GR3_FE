import axios from "axios";
import { clearAuthRelatedStorage } from "../lib/auth-session";

const API_URL =
  import.meta.env.VITE_API_BASE_URL || "https://swd392-gr3-be.onrender.com/";

/**
 * Axios instance for API requests with auth interceptors
 */
export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

/**
 * Request interceptor - Add authorization token to all requests
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

/**
 * Response interceptor - Handle 401 unauthorized errors
 */
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      const hasToken = localStorage.getItem("authToken");
      if (hasToken) {
        // Token expired or invalid - clear token and redirect to login
        clearAuthRelatedStorage();
        localStorage.removeItem("authToken");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;
