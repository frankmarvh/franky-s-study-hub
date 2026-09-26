import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type Theme =
  | "light"
  | "dark";

interface ThemeContextValue {
  theme: Theme;

  setTheme: (
    theme: Theme,
  ) => void;

  toggleTheme: () => void;
}

const ThemeContext =
  createContext<
    ThemeContextValue | undefined
  >(undefined);

export function ThemeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [
    theme,
    setThemeState,
  ] =
    useState<Theme>(
      () => {
        const saved =
          localStorage.getItem(
            "frankys-theme",
          );

        if (
          saved === "light" ||
          saved === "dark"
        ) {
          return saved;
        }

        return window.matchMedia(
          "(prefers-color-scheme: dark)",
        ).matches
          ? "dark"
          : "light";
      },
    );

  useEffect(() => {
    const root =
      document.documentElement;

    if (
      theme === "dark"
    ) {
      root.classList.add(
        "dark",
      );
    } else {
      root.classList.remove(
        "dark",
      );
    }

    localStorage.setItem(
      "frankys-theme",
      theme,
    );
  }, [
    theme,
  ]);

  const setTheme = (
    nextTheme: Theme,
  ) => {
    setThemeState(
      nextTheme,
    );
  };

  const toggleTheme =
    () => {
      setThemeState(
        (current) =>
          current === "dark"
            ? "light"
            : "dark",
      );
    };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context =
    useContext(
      ThemeContext,
    );

  if (!context) {
    throw new Error(
      "useTheme must be used inside ThemeProvider.",
    );
  }

  return context;
}
