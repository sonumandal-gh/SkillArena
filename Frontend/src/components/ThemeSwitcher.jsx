import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import confetti from "canvas-confetti";
import { Palette, Check, Sparkles, X } from "lucide-react";
import "../styles/Theme.css";

const ThemeSwitcher = ({ variant = "navbar" }) => {
  const { themeId, activeTheme, changeTheme, presets } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelectTheme = (preset) => {
    changeTheme(preset.id);
    setIsOpen(false);

    // Fire theme-matched celebratory micro-confetti
    try {
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.8 },
        colors: [preset.primary, preset.accent, preset.secondary],
        disableForReducedMotion: true,
      });
    } catch {
      // Confetti fallback
    }
  };

  return (
    <div
      className={`theme-switcher-container ${variant === "floating" ? "floating-wrapper" : ""}`}
      ref={containerRef}
    >
      {variant === "navbar" ? (
        <button
          type="button"
          className="theme-trigger-btn"
          onClick={() => setIsOpen((prev) => !prev)}
          title="Change Color Combination & Theme"
          aria-label="Change Theme"
        >
          <Palette size={15} color={activeTheme.primary} />
          <span className="theme-trigger-label">{activeTheme.name}</span>
          <div className="theme-color-dots">
            <span
              className="theme-color-dot"
              style={{ backgroundColor: activeTheme.primary, color: activeTheme.primary }}
            />
            <span
              className="theme-color-dot"
              style={{ backgroundColor: activeTheme.accent, color: activeTheme.accent }}
            />
            <span
              className="theme-color-dot"
              style={{ backgroundColor: activeTheme.secondary, color: activeTheme.secondary }}
            />
          </div>
        </button>
      ) : (
        <button
          type="button"
          className="theme-floating-fab"
          onClick={() => setIsOpen((prev) => !prev)}
          title="Customize Theme & Color Combos"
          aria-label="Color Palette Switcher"
        >
          <Palette size={22} />
        </button>
      )}

      {isOpen && (
        <div
          className={`theme-dropdown-menu ${
            variant === "floating" ? "floating-position" : ""
          }`}
        >
          <div className="theme-menu-header">
            <div className="theme-menu-title">
              <Sparkles size={16} color={activeTheme.primary} />
              <span>Color Combinations</span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              style={{
                background: "transparent",
                border: "none",
                color: "#94a3b8",
                cursor: "pointer",
                padding: "2px",
                display: "flex",
              }}
            >
              <X size={16} />
            </button>
          </div>

          <div className="theme-options-list">
            {presets.map((preset) => {
              const isSelected = preset.id === themeId;
              return (
                <div
                  key={preset.id}
                  className={`theme-option-card ${isSelected ? "active" : ""}`}
                  onClick={() => handleSelectTheme(preset)}
                >
                  <div className="theme-option-left">
                    <div
                      className="theme-swatch-box"
                      style={{
                        background: preset.gradient,
                        border: `1px solid ${preset.primary}`,
                      }}
                    >
                      <span>{preset.icon}</span>
                    </div>

                    <div className="theme-option-text">
                      <span className="theme-option-name">{preset.name}</span>
                      <span className="theme-option-desc">{preset.subtitle}</span>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div className="theme-palette-preview">
                      <div
                        className="theme-palette-circle"
                        style={{ backgroundColor: preset.primary }}
                      />
                      <div
                        className="theme-palette-circle"
                        style={{ backgroundColor: preset.accent }}
                      />
                      <div
                        className="theme-palette-circle"
                        style={{ backgroundColor: preset.secondary }}
                      />
                    </div>
                    {isSelected && (
                      <Check size={16} className="theme-check-icon" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher;
