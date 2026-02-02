import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

console.log("API_URL:", API_URL); // Debug

const authClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Cho phép gửi cookies
});

// Request interceptor - log & add token
authClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log("API Request:", config.method?.toUpperCase(), config.url);
  return config;
});

// Response interceptor - handle errors
authClient.interceptors.response.use(
  (response) => {
    console.log("API Response:", response.data);
    return response;
  },
  (error) => {
    console.error("API Error:", error);
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export const loginApi = async (email: string, password: string) => {
  const response = await authClient.post(`/api/auth/authenticate`, {
    email,
    password,
  });

  // Save token
  if (response.data.token) {
    localStorage.setItem("authToken", response.data.token);
  }

  return response.data;
};

export const signupApi = async (
  name: string,
  email: string,
  password: string,
) => {
  const response = await authClient.post(`/api/auth/register`, {
    name,
    email,
    password,
  });

  // Save token if provided
  if (response.data.token) {
    localStorage.setItem("authToken", response.data.token);
  }

  return response.data;
};
