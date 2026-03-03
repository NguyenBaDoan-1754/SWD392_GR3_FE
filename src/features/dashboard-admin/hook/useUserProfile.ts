import { useEffect, useState } from "react";
import { getUserProfileApi } from "../../../api/auth.api";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface UseUserProfileReturn {
  userProfile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
}

export const useUserProfile = (): UseUserProfileReturn => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);

        // Try to load from localStorage first (cached from login)
        const cachedProfile = localStorage.getItem("userProfile");
        if (cachedProfile) {
          try {
            const profile = JSON.parse(cachedProfile);
            setUserProfile(profile);
          } catch (parseErr) {
            // Failed to parse cached profile
          }
        }

        // Fetch fresh user profile from API
        const profile = await getUserProfileApi();
        setUserProfile(profile);
        localStorage.setItem("userProfile", JSON.stringify(profile));
        setError(null);
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError("Failed to load user profile");
        setUserProfile(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  return { userProfile, isLoading, error };
};
