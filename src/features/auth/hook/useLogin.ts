import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginApi, getUserProfileApi } from "@/api/auth.api";
import { setToken } from "@/lib/token";
import { toast } from "sonner";

export function useLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Step 1: Authenticate and get token
      const data = await loginApi(email, password);

      // Save token
      if (data.token) {
        setToken(data.token);
      }

      // Step 2: Fetch user profile with role
      let userProfile: any = null;
      try {
        userProfile = await getUserProfileApi();
        // Store user profile in localStorage
        localStorage.setItem("userProfile", JSON.stringify(userProfile));
      } catch (profileErr) {
        // Don't block login if profile fetch fails
      }

      toast.success("Login successful! Redirecting...");

      setTimeout(() => {
        // If user has ADMIN role, go to dashboard, otherwise to chat
        if (userProfile && userProfile.role === "ADMIN") {
          navigate("/dashboard");
        } else {
          navigate("/chat");
        }
      }, 500);

      return data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Login failed";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    error,
    handleSubmit,
  };
}
