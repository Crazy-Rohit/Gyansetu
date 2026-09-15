// client/src/context/themeStore.js
// Shared context object + constants for the theme feature, kept out of the
// .jsx provider file so react-refresh only sees a component export there.

import { createContext } from "react";

export const STORAGE_KEY = "gs_theme";

export const ThemeContext = createContext(null);

export function readStoredTheme() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw === "light" || raw === "dark" ? raw : null;
  } catch {
    return null;
  }
}

export function systemPrefersDark() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-color-scheme: dark)").matches
  );
}
