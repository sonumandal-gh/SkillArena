import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Swords, LogOut, Zap, LogIn, UserPlus, ShieldAlert } from "lucide-react";
import "../styles/Navbar.css";

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

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

  const isAdmin = user?.role === "admin";

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to={isAuthenticated ? "/dashboard" : "/"}>
          <div className="logo-icon-wrap">
            <Swords size={20} />
          </div>
          <h2>SkillArena</h2>
        </Link>
      </div>

      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/challenges">Challenges</Link>
        <Link to="/leaderboard">Leaderboard</Link>
        <Link to="/statistics">Statistics</Link>
        {isAdmin && (
          <Link to="/admin/dashboard" style={{ color: "#d946ef", fontWeight: 700 }}>
            Admin Panel
          </Link>
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
              <Zap size={14} color="#f59e0b" />
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
      </div>
    </nav>
  );
}

export default Navbar;