import { useState, useEffect } from "react";
const API_URL = process.env.EXPO_PUBLIC_API_URL;
import { User } from "firebase/auth";
export function useUserData(user: User | null) {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchUserData() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const idToken = await user.getIdToken();
        const response = await fetch(`${API_URL}/api/v1/users/${user.email}`, {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setUserData(data.user);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
        setLoading(false);
      }
    }

    fetchUserData();
  }, [user]);

  return { userData, loading, error };
}
