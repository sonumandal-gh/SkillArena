import React, { createContext, useContext, useState, useEffect } from "react";

export const THEME_PRESETS = [
  {
    id: "cinematic",
    name: "Cinematic Iris",
    subtitle: "Vibrant Violet, Magenta & Cyan",
    icon: "✨",
    primary: "#8b5cf6",
    accent: "#ec4899",
    secondary: "#3b82f6",
    rose: "#f43f5e",
    amber: "#f59e0b",
    emerald: "#10b981",
    bg: "#f1f5f9",
    surface: "#ffffff",
    cardBg: "#ffffff",
    cardBorder: "rgba(226, 232, 240, 0.9)",
    glow: "rgba(139, 92, 246, 0.25)",
    gradient: "linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #3b82f6 100%)",
    threePrimary: 0xec4899,
    threeAccent: 0x8b5cf6,
    threeSecondary: 0x3b82f6,
    threeParticles: 0xa855f7,
  },
  {
    id: "cyber",
    name: "Cyber Neon",
    subtitle: "Electric Indigo & Violet Glow",
    icon: "⚡",
    primary: "#6366f1",
    accent: "#a855f7",
    secondary: "#06b6d4",
    rose: "#f43f5e",
    amber: "#f59e0b",
    emerald: "#10b981",
    bg: "#f1f5f9",
    surface: "#ffffff",
    cardBg: "#ffffff",
    cardBorder: "rgba(226, 232, 240, 0.9)",
    glow: "rgba(99, 102, 241, 0.25)",
    gradient: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)",
    threePrimary: 0x6366f1,
    threeAccent: 0xa855f7,
    threeSecondary: 0x06b6d4,
    threeParticles: 0xa5b4fc,
  },
  {
    id: "matrix",
    name: "Emerald Matrix",
    subtitle: "Vibrant Terminal Green & Teal",
    icon: "🟢",
    primary: "#10b981",
    accent: "#06b6d4",
    secondary: "#14b8a6",
    rose: "#fb7185",
    amber: "#fbbf24",
    emerald: "#34d399",
    bg: "#f1f5f9",
    surface: "#ffffff",
    cardBg: "#ffffff",
    cardBorder: "rgba(226, 232, 240, 0.9)",
    glow: "rgba(16, 185, 129, 0.25)",
    gradient: "linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)",
    threePrimary: 0x10b981,
    threeAccent: 0x06b6d4,
    threeSecondary: 0x34d399,
    threeParticles: 0x6ee7b7,
  },
  {
    id: "sunset",
    name: "Solar Blaze",
    subtitle: "Fiery Amber & Crimson Flare",
    icon: "🔥",
    primary: "#f59e0b",
    accent: "#f43f5e",
    secondary: "#ea580c",
    rose: "#e11d48",
    amber: "#fbbf24",
    emerald: "#10b981",
    bg: "#f1f5f9",
    surface: "#ffffff",
    cardBg: "#ffffff",
    cardBorder: "rgba(226, 232, 240, 0.9)",
    glow: "rgba(245, 158, 11, 0.25)",
    gradient: "linear-gradient(135deg, #ea580c 0%, #f59e0b 50%, #f43f5e 100%)",
    threePrimary: 0xf59e0b,
    threeAccent: 0xf43f5e,
    threeSecondary: 0xea580c,
    threeParticles: 0xfde68a,
  },
  {
    id: "ocean",
    name: "Abyssal Arctic",
    subtitle: "Electric Cyan & Deep Sapphire",
    icon: "🌊",
    primary: "#06b6d4",
    accent: "#3b82f6",
    secondary: "#818cf8",
    rose: "#f43f5e",
    amber: "#f59e0b",
    emerald: "#10b981",
    bg: "#f1f5f9",
    surface: "#ffffff",
    cardBg: "#ffffff",
    cardBorder: "rgba(226, 232, 240, 0.9)",
    glow: "rgba(6, 182, 212, 0.25)",
    gradient: "linear-gradient(135deg, #0284c7 0%, #06b6d4 50%, #3b82f6 100%)",
    threePrimary: 0x06b6d4,
    threeAccent: 0x3b82f6,
    threeSecondary: 0x67e8f9,
    threeParticles: 0xa5f3fc,
  },
  {
    id: "synthwave",
    name: "Synthwave 80s",
    subtitle: "Cosmic Fuchsia & Neon Purple",
    icon: "✨",
    primary: "#d946ef",
    accent: "#ec4899",
    secondary: "#8b5cf6",
    rose: "#f43f5e",
    amber: "#fbbf24",
    emerald: "#10b981",
    bg: "#f1f5f9",
    surface: "#ffffff",
    cardBg: "#ffffff",
    cardBorder: "rgba(226, 232, 240, 0.9)",
    glow: "rgba(217, 70, 239, 0.25)",
    gradient: "linear-gradient(135deg, #c026d3 0%, #ec4899 50%, #8b5cf6 100%)",
    threePrimary: 0xd946ef,
    threeAccent: 0xec4899,
    threeSecondary: 0x8b5cf6,
    threeParticles: 0xf5d0fe,
  },
  {
    id: "gold",
    name: "Royal Prestige",
    subtitle: "Imperial Gold & Warm Bronze",
    icon: "👑",
    primary: "#eab308",
    accent: "#f97316",
    secondary: "#ca8a04",
    rose: "#f43f5e",
    amber: "#fde047",
    emerald: "#10b981",
    bg: "#f1f5f9",
    surface: "#ffffff",
    cardBg: "#ffffff",
    cardBorder: "rgba(226, 232, 240, 0.9)",
    glow: "rgba(234, 179, 8, 0.25)",
    gradient: "linear-gradient(135deg, #ca8a04 0%, #eab308 50%, #f59e0b 100%)",
    threePrimary: 0xeab308,
    threeAccent: 0xf97316,
    threeSecondary: 0xfde047,
    threeParticles: 0xfef08a,
  },
];

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [themeId, setThemeId] = useState(() => {
    return localStorage.getItem("skillarena_theme_id") || "cinematic";
  });

  const activeTheme =
    THEME_PRESETS.find((t) => t.id === themeId) || THEME_PRESETS[0];

  useEffect(() => {
    localStorage.setItem("skillarena_theme_id", themeId);
    const root = document.documentElement;

    // Set dynamic CSS properties for the theme
    root.style.setProperty("--arena-bg", activeTheme.bg);
    root.style.setProperty("--arena-surface", activeTheme.surface);
    root.style.setProperty("--arena-card-bg", activeTheme.cardBg);
    root.style.setProperty("--arena-card-border", activeTheme.cardBorder);
    root.style.setProperty("--arena-primary", activeTheme.primary);
    root.style.setProperty("--arena-primary-hover", activeTheme.accent);
    root.style.setProperty("--arena-accent", activeTheme.accent);
    root.style.setProperty("--arena-gradient", activeTheme.gradient);
    root.style.setProperty("--arena-glow", `0 0 25px ${activeTheme.glow}`);
    root.style.setProperty("--arena-glow-color", activeTheme.glow);
    root.style.setProperty("--theme-primary", activeTheme.primary);
    root.style.setProperty("--theme-accent", activeTheme.accent);
    root.style.setProperty("--theme-secondary", activeTheme.secondary);

    // Keep body background consistent with the soft-grey cinematic theme
    document.body.style.backgroundColor = activeTheme.bg;
  }, [themeId, activeTheme]);

  const changeTheme = (newId) => {
    if (THEME_PRESETS.some((t) => t.id === newId)) {
      setThemeId(newId);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        themeId,
        activeTheme,
        changeTheme,
        presets: THEME_PRESETS,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export default ThemeContext;
