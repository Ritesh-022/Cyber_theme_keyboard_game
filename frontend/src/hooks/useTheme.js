import { createContext, useContext, useState, useEffect } from "react";
import { THEMES, getAutoTheme } from "../utils/timeTheme";

const ThemeContext = createContext(null);
const STORAGE_KEY = "typoerror_theme";

export function ThemeProvider({ children }) {
  const [manual, setManual] = useState(() => localStorage.getItem(STORAGE_KEY) || null);
  const [auto, setAuto] = useState(() => getAutoTheme().name);

  // Update auto theme every minute
  useEffect(() => {
    const tick = () => setAuto(getAutoTheme().name);
    const id = setInterval(tick, 60 * 1000);
    return () => clearInterval(id);
  }, []);

  const themeName = manual || auto;
  const theme = THEMES[themeName] || getAutoTheme();

  const setTheme = (name) => {
    if (name === "auto") {
      localStorage.removeItem(STORAGE_KEY);
      setManual(null);
    } else {
      localStorage.setItem(STORAGE_KEY, name);
      setManual(name);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, themeName, manual, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
