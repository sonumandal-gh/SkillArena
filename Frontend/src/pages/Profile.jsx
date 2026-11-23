import { useState, useMemo } from "react";
import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import userService from "../services/userService";
import "../styles/Arena.css";
import "../styles/Profile.css";
import {
  Mail,
  Shield,
  Zap,
  CheckCircle2,
  Target,
  LogOut,
  KeyRound,
  Edit3,
  AlertCircle,
  ShieldAlert,
  Palette,
  User,
  Calendar,
  Lock,
  Eye,
  EyeOff,
  Trophy,
  Crown,
  Check,
  Sparkles,
} from "lucide-react";

const TIERS = [
  { name: "Bronze Gladiator", minXp: 0, maxXp: 300, icon: Shield, color: "#cd7f32" },
  { name: "Silver Codebreaker", minXp: 300, maxXp: 800, icon: Target, color: "#94a3b8" },
  { name: "Gold Strategist", minXp: 800, maxXp: 1600, icon: Trophy, color: "#f59e0b" },
  { name: "Platinum Algorithmist", minXp: 1600, maxXp: 3000, icon: Crown, color: "#06b6d4" },
  { name: "Diamond Grandmaster", minXp: 3000, maxXp: 10000, icon: Sparkles, color: "#a855f7" },
];

const Profile = () => {
  const { user, logout, refreshUser } = useAuth();
  const { themeId, changeTheme, presets, activeTheme } = useTheme();
  const navigate = useNavigate();

  // Active Tab: 'account' | 'security' | 'appearance'
  const [activeTab, setActiveTab] = useState("account");

  // Edit Name State
  const [nameInput, setNameInput] = useState(user?.name || "");
  const [nameLoading, setNameLoading] = useState(false);
  const [nameSuccess, setNameSuccess] = useState("");
  const [nameError, setNameError] = useState("");

  // Change Password State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Tier & XP calculations
  const currentTier = useMemo(() => {
    const xp = user?.xp || 0;
    for (let i = TIERS.length - 1; i >= 0; i--) {
      if (xp >= TIERS[i].minXp) {
        return TIERS[i];
      }
    }
    return TIERS[0];
  }, [user?.xp]);

  const nextTier = useMemo(() => {
    const currentIndex = TIERS.findIndex((t) => t.name === currentTier.name);
    if (currentIndex < TIERS.length - 1) {
      return TIERS[currentIndex + 1];
    }
    return null;
  }, [currentTier]);

  const progressPercent = useMemo(() => {
    const xp = user?.xp || 0;
    if (!nextTier) return 100;
    const range = nextTier.minXp - currentTier.minXp;
    const progress = xp - currentTier.minXp;
    return Math.min(100, Math.max(0, Math.round((progress / range) * 100)));
  }, [user?.xp, currentTier, nextTier]);

  // Password strength calculation
  const passwordStrength = useMemo(() => {
    if (!newPassword) return { score: 0, label: "None", class: "" };
    let score = 0;
    if (newPassword.length >= 6) score += 1;
    if (newPassword.length >= 10) score += 1;
    if (/[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword)) score += 1;
    if (/[0-9]/.test(newPassword) && /[^A-Za-z0-9]/.test(newPassword)) score += 1;

    switch (score) {
      case 1:
        return { score: 1, label: "Weak", class: "weak" };
      case 2:
        return { score: 2, label: "Fair", class: "fair" };
      case 3:
        return { score: 3, label: "Good", class: "good" };
      case 4:
      default:
        return { score: 4, label: "Strong", class: "strong" };
    }
  }, [newPassword]);

  const handleUpdateName = async (e) => {
    e.preventDefault();
    setNameError("");
    setNameSuccess("");

    if (!nameInput.trim()) {
      setNameError("Full name cannot be left blank.");
      return;
    }

    setNameLoading(true);
    try {
      await userService.updateProfile({ name: nameInput.trim() });
      await refreshUser();
      setNameSuccess("Profile name updated successfully!");
      setTimeout(() => setNameSuccess(""), 4000);
    } catch (err) {
      setNameError(err?.response?.data?.message || "Failed to update profile name.");
    } finally {
      setNameLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    setPasswordLoading(true);
    try {
      if (currentPassword) {
        await userService.changePassword({ currentPassword, newPassword });
      } else {
        await userService.setPassword({ newPassword });
      }

      setPasswordSuccess("Security credentials updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setTimeout(() => setPasswordSuccess(""), 4000);
    } catch (err) {
      setPasswordError(err?.response?.data?.message || "Failed to change password.");
    } finally {
      setPasswordLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="profile-page-wrapper" style={{ textAlign: "center", padding: "80px 20px" }}>
        <p style={{ color: "#94a3b8", fontSize: "1.1rem" }}>No active profile session found.</p>
      </div>
    );
  }

  const isAdmin = user.role === "admin";
  const TierIcon = currentTier.icon;

  return (
    <div className="profile-page-wrapper">
      {/* Hero Header Card */}
      <div className="profile-hero-card">
        <div className="profile-hero-inner">
          <div className="profile-hero-user-info">
            <div className="profile-avatar-squircle">
              <span>{getInitials(user.name)}</span>
              <div className="profile-online-badge" title="Online & Active" />
            </div>

            <div className="profile-details-wrap">
              <div className="profile-user-headline">
                <h1 className="profile-display-name">{user.name}</h1>
                <span className={`arena-badge ${isAdmin ? "badge-admin" : "badge-coding"}`}>
                  <Shield size={12} />
                  <span>{user.role ? user.role.toUpperCase() : "CODER"}</span>
                </span>
                <span className="profile-rank-badge" style={{ borderColor: currentTier.color, color: currentTier.color }}>
                  <TierIcon size={12} />
                  <span>{currentTier.name}</span>
                </span>
              </div>

              <div className="profile-meta-pills">
                <div className="profile-meta-pill-item">
                  <Mail size={14} color="#818cf8" />
                  <span>{user.email}</span>
                </div>
                <div className="profile-meta-pill-item">
                  <Calendar size={14} color="#34d399" />
                  <span>Active Competitor</span>
                </div>
              </div>
            </div>
          </div>

          <div className="profile-hero-actions">
            {isAdmin && (
              <Link
                to="/admin/users"
                className="arena-btn"
                style={{ background: "linear-gradient(135deg, #d946ef 0%, #9333ea 100%)" }}
              >
                <ShieldAlert size={16} />
                <span>Admin Center</span>
              </Link>
            )}

            <button
              type="button"
              className="arena-btn arena-btn-danger"
              onClick={handleLogout}
              title="Sign Out of Session"
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main 2-Column Content Layout */}
      <div className="profile-content-grid">
        {/* Left Column: Player Level & Quick Stats */}
        <div className="profile-sidebar-stack">
          {/* Rank & Tier Progress Card */}
          <div className="profile-rank-card">
            <div className="profile-rank-header">
              <div className="profile-rank-badge" style={{ borderColor: currentTier.color, color: currentTier.color }}>
                <TierIcon size={13} />
                <span>Tier Standing</span>
              </div>
              <span style={{ fontSize: "0.8rem", color: "#94a3b8", fontWeight: 600 }}>
                {user.xp || 0} XP
              </span>
            </div>

            <h3 className="profile-tier-title">
              <span>{currentTier.name}</span>
            </h3>
            <p className="profile-tier-subtitle">
              {nextTier
                ? `Earn ${nextTier.minXp - (user.xp || 0)} more XP to advance to ${nextTier.name}.`
                : "You have conquered the highest competitive arena tier!"}
            </p>

            <div className="profile-xp-meter-box">
              <div className="profile-xp-meter-labels">
                <span>Progress to Next Tier</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="profile-xp-meter-bar-bg">
                <div className="profile-xp-meter-bar-fill" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>

            {/* Quick Stats Mini Grid */}
            <div className="profile-stats-mini-grid">
              <div className="profile-stat-mini-card">
                <div className="profile-stat-mini-left">
                  <div className="profile-stat-icon-squircle stat-icon-amber">
                    <Zap size={18} />
                  </div>
                  <div>
                    <div className="profile-stat-mini-label">Experience Points</div>
                    <div className="profile-stat-mini-val">{user.xp || 0} XP</div>
                  </div>
                </div>
              </div>

              <div className="profile-stat-mini-card">
                <div className="profile-stat-mini-left">
                  <div className="profile-stat-icon-squircle stat-icon-emerald">
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <div className="profile-stat-mini-label">Problems Conquered</div>
                    <div className="profile-stat-mini-val">{user.problemsSolved || 0} Solved</div>
                  </div>
                </div>
              </div>

              <div className="profile-stat-mini-card">
                <div className="profile-stat-mini-left">
                  <div className="profile-stat-icon-squircle stat-icon-cyan">
                    <Target size={18} />
                  </div>
                  <div>
                    <div className="profile-stat-mini-label">Accuracy Rate</div>
                    <div className="profile-stat-mini-val">{user.accuracy || 0}%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Settings Tabs & Panels */}
        <div className="profile-main-panel">
          {/* Tab Navigation Buttons */}
          <div className="profile-tabs-header">
            <button
              type="button"
              className={`profile-tab-button ${activeTab === "account" ? "active" : ""}`}
              onClick={() => setActiveTab("account")}
            >
              <User size={16} />
              <span>Account Details</span>
            </button>

            <button
              type="button"
              className={`profile-tab-button ${activeTab === "security" ? "active" : ""}`}
              onClick={() => setActiveTab("security")}
            >
              <KeyRound size={16} />
              <span>Security & Password</span>
            </button>

            <button
              type="button"
              className={`profile-tab-button ${activeTab === "appearance" ? "active" : ""}`}
              onClick={() => setActiveTab("appearance")}
            >
              <Palette size={16} />
              <span>Color Themes</span>
            </button>
          </div>

          {/* Tab 1: Account Details */}
          {activeTab === "account" && (
            <div className="profile-tab-content-card">
              <div className="profile-card-title-row">
                <div>
                  <h2 className="profile-card-heading">
                    <Edit3 size={20} color="#818cf8" />
                    <span>Personal Information</span>
                  </h2>
                  <p className="profile-card-subheading">
                    Update your public screen name and review your account credentials.
                  </p>
                </div>
              </div>

              {nameSuccess && (
                <div className="profile-alert-box profile-alert-success">
                  <CheckCircle2 size={18} />
                  <span>{nameSuccess}</span>
                </div>
              )}

              {nameError && (
                <div className="profile-alert-box profile-alert-error">
                  <AlertCircle size={18} />
                  <span>{nameError}</span>
                </div>
              )}

              <form onSubmit={handleUpdateName}>
                <div className="profile-form-group">
                  <label className="profile-label">
                    <span>Full Display Name</span>
                    <span style={{ color: "#94a3b8", fontSize: "0.78rem" }}>Visible to competitors</span>
                  </label>
                  <div className="profile-input-wrapper">
                    <span className="profile-input-icon">
                      <User size={18} />
                    </span>
                    <input
                      type="text"
                      className="profile-input"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                </div>

                <div className="profile-form-group">
                  <label className="profile-label">
                    <span>Email Address</span>
                    <span style={{ color: "#10b981", fontSize: "0.78rem", display: "flex", alignItems: "center", gap: "4px" }}>
                      <Check size={12} />
                      Verified
                    </span>
                  </label>
                  <div className="profile-input-wrapper">
                    <span className="profile-input-icon">
                      <Mail size={18} />
                    </span>
                    <input
                      type="email"
                      className="profile-input disabled"
                      value={user.email}
                      disabled
                    />
                    <span style={{ position: "absolute", right: "14px", color: "#64748b" }}>
                      <Lock size={16} />
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "24px" }}>
                  <button
                    type="submit"
                    className="arena-btn"
                    disabled={nameLoading}
                  >
                    <CheckCircle2 size={16} />
                    <span>{nameLoading ? "Saving Changes..." : "Save Name"}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Tab 2: Security & Password */}
          {activeTab === "security" && (
            <div className="profile-tab-content-card">
              <div className="profile-card-title-row">
                <div>
                  <h2 className="profile-card-heading">
                    <KeyRound size={20} color="#f59e0b" />
                    <span>Security & Password Management</span>
                  </h2>
                  <p className="profile-card-subheading">
                    Ensure your account is protected with a strong, multi-character password.
                  </p>
                </div>
              </div>

              {passwordSuccess && (
                <div className="profile-alert-box profile-alert-success">
                  <CheckCircle2 size={18} />
                  <span>{passwordSuccess}</span>
                </div>
              )}

              {passwordError && (
                <div className="profile-alert-box profile-alert-error">
                  <AlertCircle size={18} />
                  <span>{passwordError}</span>
                </div>
              )}

              <form onSubmit={handleChangePassword}>
                <div className="profile-form-group">
                  <label className="profile-label">
                    <span>Current Password</span>
                    <span style={{ color: "#94a3b8", fontSize: "0.78rem" }}>Optional for Google sign-in</span>
                  </label>
                  <div className="profile-input-wrapper">
                    <span className="profile-input-icon">
                      <Lock size={18} />
                    </span>
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      className="profile-input"
                      placeholder="Enter current password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="profile-password-toggle-btn"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="profile-form-group">
                  <label className="profile-label">
                    <span>New Password</span>
                    <span style={{ color: "#94a3b8", fontSize: "0.78rem" }}>Minimum 6 characters</span>
                  </label>
                  <div className="profile-input-wrapper">
                    <span className="profile-input-icon">
                      <KeyRound size={18} />
                    </span>
                    <input
                      type={showNewPassword ? "text" : "password"}
                      className="profile-input"
                      placeholder="Create a strong password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="profile-password-toggle-btn"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  {newPassword && (
                    <div className="profile-strength-bar-wrap">
                      <div className="profile-strength-labels">
                        <span>Strength:</span>
                        <span style={{ fontWeight: 700 }}>{passwordStrength.label}</span>
                      </div>
                      <div className="profile-strength-segments">
                        <div className={`profile-strength-seg ${passwordStrength.score >= 1 ? passwordStrength.class : ""}`} />
                        <div className={`profile-strength-seg ${passwordStrength.score >= 2 ? passwordStrength.class : ""}`} />
                        <div className={`profile-strength-seg ${passwordStrength.score >= 3 ? passwordStrength.class : ""}`} />
                        <div className={`profile-strength-seg ${passwordStrength.score >= 4 ? passwordStrength.class : ""}`} />
                      </div>
                    </div>
                  )}
                </div>

                <div className="profile-form-group">
                  <label className="profile-label">
                    <span>Confirm New Password</span>
                    {confirmNewPassword && (
                      <span style={{
                        fontSize: "0.78rem",
                        color: newPassword === confirmNewPassword ? "#10b981" : "#f43f5e",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px"
                      }}>
                        {newPassword === confirmNewPassword ? "Passwords match" : "Does not match"}
                      </span>
                    )}
                  </label>
                  <div className="profile-input-wrapper">
                    <span className="profile-input-icon">
                      <Lock size={18} />
                    </span>
                    <input
                      type={showNewPassword ? "text" : "password"}
                      className="profile-input"
                      placeholder="Repeat new password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "24px" }}>
                  <button
                    type="submit"
                    className="arena-btn arena-btn-secondary"
                    disabled={passwordLoading}
                  >
                    <CheckCircle2 size={16} />
                    <span>{passwordLoading ? "Updating..." : "Update Password"}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Tab 3: Themes & Appearance */}
          {activeTab === "appearance" && (
            <div className="profile-tab-content-card">
              <div className="profile-card-title-row">
                <div>
                  <h2 className="profile-card-heading">
                    <Palette size={20} color={activeTheme.primary} />
                    <span>Visual Aesthetic & Theme Presets</span>
                  </h2>
                  <p className="profile-card-subheading">
                    Select your favorite theme preset. Accents, glows, and buttons update across the entire arena in real time.
                  </p>
                </div>
              </div>

              <div className="profile-themes-grid">
                {presets.map((preset) => {
                  const isSelected = preset.id === themeId;
                  return (
                    <div
                      key={preset.id}
                      className={`profile-theme-preset-card ${isSelected ? "selected" : ""}`}
                      onClick={() => changeTheme(preset.id)}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div
                          className="profile-theme-icon-badge"
                          style={{ background: preset.gradient }}
                        >
                          {preset.icon}
                        </div>
                        <div>
                          <div style={{ color: "#f8fafc", fontWeight: 700, fontSize: "0.92rem", display: "flex", alignItems: "center", gap: "6px" }}>
                            <span>{preset.name}</span>
                            {isSelected && <Check size={14} color={preset.primary} />}
                          </div>
                          <div style={{ color: "#94a3b8", fontSize: "0.76rem" }}>
                            {preset.subtitle}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: "4px" }}>
                        <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: preset.primary }} />
                        <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: preset.accent }} />
                        <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: preset.secondary }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
