// client/src/hooks/useUserProfile.js
import { useContext } from "react";
import { UserProfileContext } from "../context/userProfileStore";

export function useUserProfile() {
  const ctx = useContext(UserProfileContext);
  if (!ctx) {
    throw new Error("useUserProfile must be used within a UserProfileProvider");
  }
  return ctx;
}
