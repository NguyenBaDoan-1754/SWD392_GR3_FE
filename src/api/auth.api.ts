import apiClient from "./client";

export const loginApi = async (email: string, password: string) => {
  const response = await apiClient.post(`/api/auth/authenticate`, {
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
  const response = await apiClient.post(`/api/auth/register`, {
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
