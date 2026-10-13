import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const ThemeContext = createContext(null);

function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getInitialTheme() {
  try {
    const savedTheme = localStorage.getItem("theme");

    if (["light", "dark", "system"].includes(savedTheme)) {
      return savedTheme;
    }
  } catch (error) {
    console.error("Unable to read saved theme:", error);
  }

  return "system";
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(getInitialTheme);
  const [systemTheme, setSystemTheme] = useState(getSystemTheme);

  const darkMode =
    theme === "system" ? systemTheme === "dark" : theme === "dark";

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );

    const updateSystemTheme = (event) => {
      setSystemTheme(event.matches ? "dark" : "light");
    };

    setSystemTheme(mediaQuery.matches ? "dark" : "light");
    mediaQuery.addEventListener("change", updateSystemTheme);

    return () => {
      mediaQuery.removeEventListener("change", updateSystemTheme);
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    document.documentElement.style.colorScheme = darkMode
      ? "dark"
      : "light";
  }, [darkMode]);

  const setTheme = (newTheme) => {
    if (!["light", "dark", "system"].includes(newTheme)) {
      return;
    }

    setThemeState(newTheme);

    try {
      localStorage.setItem("theme", newTheme);
    } catch (error) {
      console.error("Unable to save theme:", error);
    }
  };

  // Preserve compatibility with existing components that use toggleTheme.
  const toggleTheme = () => {
    setTheme(darkMode ? "light" : "dark");
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        darkMode,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
}