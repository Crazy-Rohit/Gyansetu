// client/src/context/ThemeContext.jsx
// Real light/dark theme toggle (Stitch's exported mockups only had a
// decorative, non-functional button for this). Explicit choice persists to
// localStorage; otherwise theme.css falls back to prefers-color-scheme.

import { useCallback, useEffect, useState } from "react";
import { STORAGE_KEY, ThemeContext, readStoredTheme, systemPrefersDark } from "./themeStore";

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(
    () => readStoredTheme() || (systemPrefersDark() ? "dark" : "light")
  );
  const [isExplicit, setIsExplicit] = useState(() => readStoredTheme() !== null);

  useEffect(() => {
    if (isExplicit) {
      document.documentElement.setAttribute("data-theme", theme);
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }, [theme, isExplicit]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      localStorage.setItem(STORAGE_KEY, next);
      setIsExplicit(true);
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
