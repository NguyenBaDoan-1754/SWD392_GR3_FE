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

/**
 * Get current user profile from /api/users/me
 */
export const getUserProfileApi = async () => {
  const response = await apiClient.get("/api/users/me");
  return response.data.result;
};

/**
 * Get list of all users with pagination
 */
export const getUsersApi = async (
  page: number = 0,
  size: number = 10,
  sort: string = "asc",
) => {
  const response = await apiClient.get("/api/users", {
    params: {
      page,
      size,
      sort,
    },
  });
  return response.data;
};
