import { useState } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  Swords,
  LogOut,
  Zap,
  LogIn,
  UserPlus,
  ShieldAlert,
  Menu,
  X,
  Home,
  LayoutDashboard,
  Trophy,
  ListChecks,
  BarChart3,
  User,
  Shield,
  Code2,
  Sparkles,
} from "lucide-react";
import "../styles/Navbar.css";

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
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

  const isAdmin = user?.role === "admin";

  return (
    <>
      <nav className="navbar">
        <div className="navbar-logo">
          <Link to={isAuthenticated ? "/dashboard" : "/"} onClick={() => setMobileMenuOpen(false)}>
            <div className="logo-icon-wrap">
              <Swords size={20} />
            </div>
            <h2>SkillArena</h2>
          </Link>
        </div>

        <div className="navbar-links">
          <NavLink to="/" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Home
          </NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Dashboard
          </NavLink>
          <NavLink to="/challenges" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Challenges
          </NavLink>
          <NavLink to="/leaderboard" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Leaderboard
          </NavLink>
          <NavLink to="/statistics" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Statistics
          </NavLink>

          {isAdmin && (
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) => (isActive ? "nav-link active admin-nav-link" : "nav-link admin-nav-link")}
              style={{ color: "#d946ef", fontWeight: 700 }}
            >
              Admin Panel
            </NavLink>
          )}
        </div>

        <div className="navbar-user">

          {isAuthenticated && user ? (
            <>
              {isAdmin && (
                <Link
                  to="/admin/dashboard"
                  className="arena-badge badge-admin"
                  style={{ textDecoration: "none", padding: "4px 8px", fontSize: "0.75rem" }}
                  title="Admin Control Center"
                >
                  <ShieldAlert size={12} />
                  <span>ADMIN</span>
                </Link>
              )}

              <div className="user-xp-badge" title="Total Experience Points">
                <Zap size={14} color="#d97706" />
                <span>{user.xp || 0} XP</span>
              </div>

              <Link to="/profile" className="user-profile-chip" title="View Profile">
                <div className="user-avatar">{getInitials(user.name)}</div>
                <span className="user-name">{user.name || "Coder"}</span>
              </Link>

              <button
                type="button"
                className="navbar-logout-btn"
                onClick={handleLogout}
                title="Sign Out"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <div className="navbar-auth-actions">
              <Link to="/login" className="navbar-signin-link">
                <LogIn size={16} />
                <span>Sign In</span>
              </Link>
              <Link to="/register" className="navbar-signup-btn">
                <UserPlus size={16} />
                <span>Get Started</span>
              </Link>
            </div>
          )}

          {/* Mobile Menu Hamburger Toggle */}
          <button
            type="button"
            className="navbar-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-backdrop" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-drawer-content" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-drawer-header">
              <div className="navbar-logo">
                <div className="logo-icon-wrap" style={{ width: "32px", height: "32px" }}>
                  <Swords size={18} />
                </div>
                <h3 style={{ margin: 0, fontSize: "1.15rem", color: "#0f172a", fontWeight: 800 }}>SkillArena</h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="mobile-drawer-links">
              <NavLink to="/" onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => `mobile-drawer-link ${isActive ? "active" : ""}`}>
                <Home size={18} />
                <span>Home</span>
              </NavLink>

              <NavLink to="/dashboard" onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => `mobile-drawer-link ${isActive ? "active" : ""}`}>
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </NavLink>

              <NavLink to="/challenges" onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => `mobile-drawer-link ${isActive ? "active" : ""}`}>
                <Swords size={18} />
                <span>Challenges</span>
              </NavLink>

              <NavLink to="/leaderboard" onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => `mobile-drawer-link ${isActive ? "active" : ""}`}>
                <Trophy size={18} />
                <span>Leaderboard</span>
              </NavLink>

              <NavLink to="/submissions" onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => `mobile-drawer-link ${isActive ? "active" : ""}`}>
                <ListChecks size={18} />
                <span>My Submissions</span>
              </NavLink>

              <NavLink to="/statistics" onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => `mobile-drawer-link ${isActive ? "active" : ""}`}>
                <BarChart3 size={18} />
                <span>Statistics</span>
              </NavLink>

              <NavLink to="/profile" onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => `mobile-drawer-link ${isActive ? "active" : ""}`}>
                <User size={18} />
                <span>Profile Settings</span>
              </NavLink>

              {isAdmin && (
                <>
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", padding: "12px 14px 4px" }}>
                    Admin Controls
                  </div>
                  <NavLink to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => `mobile-drawer-link ${isActive ? "active" : ""}`}>
                    <ShieldAlert size={18} color="#d946ef" />
                    <span>Admin Dashboard</span>
                  </NavLink>
                  <NavLink to="/admin/users" onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => `mobile-drawer-link ${isActive ? "active" : ""}`}>
                    <Shield size={18} color="#d946ef" />
                    <span>Manage Users</span>
                  </NavLink>
                  <NavLink to="/admin/challenges" onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => `mobile-drawer-link ${isActive ? "active" : ""}`}>
                    <Code2 size={18} color="#d946ef" />
                    <span>Manage Challenges</span>
                  </NavLink>
                </>
              )}
            </div>

            <div className="mobile-drawer-footer">
              {isAuthenticated && user ? (
                <button
                  type="button"
                  className="arena-btn arena-btn-danger"
                  style={{ width: "100%", justifyContent: "center" }}
                  onClick={handleLogout}
                >
                  <LogOut size={16} />
                  <span>Logout of Session</span>
                </button>
              ) : (
                <div style={{ display: "flex", gap: "10px", width: "100%" }}>
                  <Link
                    to="/login"
                    className="arena-btn arena-btn-secondary"
                    style={{ flex: 1, justifyContent: "center" }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="arena-btn"
                    style={{ flex: 1, justifyContent: "center" }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
