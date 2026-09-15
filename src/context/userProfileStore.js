// client/src/context/userProfileStore.js
// Shared context object + constants for the user profile feature, kept out
// of the .jsx provider file so react-refresh only sees a component export
// there (see UserProfileContext.jsx / hooks/useUserProfile.js).

import { createContext } from "react";

export const STORAGE_KEY = "gs_user_profile";

export const AVATARS = ["🦁", "🐱", "🐶", "🦊", "🐼", "🐧", "🦉", "🐢"];

// What content the student sees on Courses/search. "both" is the default —
// picking a specific class narrows the site down for them, it never locks
// anyone out of anything (they can always switch back from the same modal).
export const CLASS_PREFS = [
  { id: "class-9", label: "Class 9 Content", icon: "looks_one" },
  { id: "class-10", label: "Class 10 Content", icon: "looks_two" },
  { id: "both", label: "Full Access", icon: "all_inclusive" },
];
export const DEFAULT_CLASS_PREF = "both";

export const UserProfileContext = createContext(null);

export function readProfile() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.name || !parsed.avatar) return null;
    // Profiles saved before the class-preference feature existed simply
    // don't have this field yet — default them to "both" rather than
    // treating them as needing to re-onboard.
    const classPref = CLASS_PREFS.some((c) => c.id === parsed.classPref)
      ? parsed.classPref
      : DEFAULT_CLASS_PREF;
    return { ...parsed, classPref };
  } catch {
    return null;
  }
}
