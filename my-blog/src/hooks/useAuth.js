import { useState, useEffect } from "react";
import { getCurrentUser } from "../services/AuthService";

export const useAuth = () => {
  // Initialize currentUser as null (it will be an object when logged in)
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await getCurrentUser();
        // Only set the user if we got a valid object back
        if (user && typeof user === "object") {
          setCurrentUser(user);
        } else {
          setCurrentUser(null);
        }
      } catch (error) {
        console.error("Error loading user:", error);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  return { currentUser, setCurrentUser, loading };
};
