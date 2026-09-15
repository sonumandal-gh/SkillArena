import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import userService from "../services/userService";
import "../styles/Arena.css";
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
} from "lucide-react";

const Profile = () => {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();

  // Edit Name State
  const [nameInput, setNameInput] = useState(user?.name || "");
  const [nameLoading, setNameLoading] = useState(false);
  const [nameSuccess, setNameSuccess] = useState("");
  const [nameError, setNameError] = useState("");

  // Change Password State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
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

  const handleUpdateName = async (e) => {
    e.preventDefault();
    setNameError("");
    setNameSuccess("");

    if (!nameInput.trim()) {
      setNameError("Name cannot be blank.");
      return;
    }

    setNameLoading(true);
    try {
      await userService.updateProfile({ name: nameInput.trim() });
      await refreshUser();
      setNameSuccess("Profile name updated successfully!");
    } catch (err) {
      setNameError(err?.response?.data?.message || "Failed to update profile.");
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
      // If current password provided, call changePassword, otherwise setPassword (for OAuth users)
      if (currentPassword) {
        await userService.changePassword({ currentPassword, newPassword });
      } else {
        await userService.setPassword({ newPassword });
      }

      setPasswordSuccess("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err) {
      setPasswordError(err?.response?.data?.message || "Failed to change password.");
    } finally {
      setPasswordLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="arena-page" style={{ textAlign: "center", padding: "60px 20px" }}>
        <p style={{ color: "#94a3b8" }}>No profile session loaded.</p>
      </div>
    );
  }

  const isAdmin = user.role === "admin";

  return (
    <div className="arena-page" style={{ maxWidth: "880px" }}>
      {/* Header Profile Card */}
      <div
        className="arena-card"
        style={{
          background: "linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.95) 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "20px",
          marginBottom: "24px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "26px",
              fontWeight: "800",
              boxShadow: "0 0 24px rgba(99, 102, 241, 0.4)",
            }}
          >
            {getInitials(user.name)}
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
              <h1 style={{ margin: 0, fontSize: "1.7rem", color: "#f8fafc", fontWeight: 700 }}>
                {user.name}
              </h1>
              <span className={`arena-badge ${isAdmin ? "badge-admin" : "badge-coding"}`}>
                <Shield size={12} />
                <span>{user.role || "user"}</span>
              </span>
            </div>

            <div style={{ color: "#94a3b8", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "6px" }}>
              <Mail size={15} />
              <span>{user.email}</span>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {isAdmin && (
            <Link to="/admin/users" className="arena-btn" style={{ background: "linear-gradient(135deg, #d946ef 0%, #9333ea 100%)" }}>
              <ShieldAlert size={16} />
              <span>Admin Center</span>
            </Link>
          )}

          <button
            type="button"
            className="arena-btn arena-btn-danger"
            onClick={handleLogout}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Stats Summary Grid */}
      <div className="arena-stats-grid" style={{ marginBottom: "28px" }}>
        <div className="arena-stat-card">
          <div className="stat-icon-wrap stat-icon-amber">
            <Zap size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-val">{user.xp || 0}</div>
            <div className="stat-label">Experience Points</div>
          </div>
        </div>

        <div className="arena-stat-card">
          <div className="stat-icon-wrap stat-icon-emerald">
            <CheckCircle2 size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-val">{user.problemsSolved || 0}</div>
            <div className="stat-label">Problems Solved</div>
          </div>
        </div>

        <div className="arena-stat-card">
          <div className="stat-icon-wrap stat-icon-purple">
            <Target size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-val">{user.accuracy || 0}%</div>
            <div className="stat-label">Accuracy Rate</div>
          </div>
        </div>
      </div>

      {/* Profile Settings (Name & Password) */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        
        {/* Edit Name Card */}
        <div className="arena-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h2 style={{ margin: 0, fontSize: "1.2rem", color: "#f8fafc", display: "flex", alignItems: "center", gap: "8px" }}>
              <Edit3 size={18} color="#818cf8" />
              <span>Account Details</span>
            </h2>
          </div>

          {nameSuccess && (
            <div className="auth-alert auth-alert-success" style={{ marginBottom: "14px" }}>
              <CheckCircle2 size={16} />
              <span>{nameSuccess}</span>
            </div>
          )}

          {nameError && (
            <div className="auth-alert auth-alert-error" style={{ marginBottom: "14px" }}>
              <AlertCircle size={16} />
              <span>{nameError}</span>
            </div>
          )}

          <form onSubmit={handleUpdateName} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div>
              <label className="auth-input-label">Full Name</label>
              <input
                type="text"
                className="auth-input"
                style={{ paddingLeft: "14px" }}
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="auth-input-label">Email Address (Read-only)</label>
              <input
                type="email"
                className="auth-input"
                style={{ paddingLeft: "14px", opacity: 0.65, cursor: "not-allowed" }}
                value={user.email}
                disabled
              />
            </div>

            <button
              type="submit"
              className="arena-btn"
              style={{ marginTop: "6px" }}
              disabled={nameLoading}
            >
              {nameLoading ? "Saving Changes..." : "Save Account Name"}
            </button>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="arena-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h2 style={{ margin: 0, fontSize: "1.2rem", color: "#f8fafc", display: "flex", alignItems: "center", gap: "8px" }}>
              <KeyRound size={18} color="#f59e0b" />
              <span>Security & Password</span>
            </h2>
          </div>

          {passwordSuccess && (
            <div className="auth-alert auth-alert-success" style={{ marginBottom: "14px" }}>
              <CheckCircle2 size={16} />
              <span>{passwordSuccess}</span>
            </div>
          )}

          {passwordError && (
            <div className="auth-alert auth-alert-error" style={{ marginBottom: "14px" }}>
              <AlertCircle size={16} />
              <span>{passwordError}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div>
              <label className="auth-input-label">Current Password (optional for OAuth)</label>
              <input
                type="password"
                className="auth-input"
                style={{ paddingLeft: "14px" }}
                placeholder="Leave blank if setting first password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>

            <div>
              <label className="auth-input-label">New Password</label>
              <input
                type="password"
                className="auth-input"
                style={{ paddingLeft: "14px" }}
                placeholder="At least 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="auth-input-label">Confirm New Password</label>
              <input
                type="password"
                className="auth-input"
                style={{ paddingLeft: "14px" }}
                placeholder="Repeat new password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="arena-btn arena-btn-secondary"
              style={{ marginTop: "6px" }}
              disabled={passwordLoading}
            >
              {passwordLoading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Profile;
