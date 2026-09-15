import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  Home,
  LayoutDashboard,
  Swords,
  Trophy,
  ListChecks,
  BarChart3,
  User,
  Shield,
  ShieldAlert,
  Code2,
  Sparkles,
} from "lucide-react";
import "../styles/Sidebar.css";

function Sidebar() {
  const { user, isAuthenticated } = useAuth();
  const isAdmin = user?.role === "admin";

  return (
    <aside className="sidebar">
      <div className="sidebar-section-title">Navigation</div>
      <div className="sidebar-menu">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          <Home size={18} />
          <span>Home</span>
        </NavLink>

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/challenges"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          <Swords size={18} />
          <span>Challenges</span>
        </NavLink>

        <NavLink
          to="/leaderboard"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          <Trophy size={18} />
          <span>Leaderboard</span>
        </NavLink>

        <NavLink
          to="/submissions"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          <ListChecks size={18} />
          <span>My Submissions</span>
        </NavLink>

        <NavLink
          to="/statistics"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          <BarChart3 size={18} />
          <span>Statistics</span>
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          <User size={18} />
          <span>Profile</span>
        </NavLink>

        {isAdmin && (
          <>
            <div className="sidebar-section-title" style={{ marginTop: "20px" }}>
              Admin Zone
            </div>
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) =>
                isActive ? "sidebar-link active admin-link" : "sidebar-link admin-link"
              }
            >
              <ShieldAlert size={18} />
              <span>Admin Dashboard</span>
            </NavLink>

            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                isActive ? "sidebar-link active admin-link" : "sidebar-link admin-link"
              }
            >
              <Shield size={18} />
              <span>Manage Users</span>
            </NavLink>

            <NavLink
              to="/admin/challenges"
              className={({ isActive }) =>
                isActive ? "sidebar-link active admin-link" : "sidebar-link admin-link"
              }
            >
              <Code2 size={18} />
              <span>Manage Challenges</span>
            </NavLink>
          </>
        )}
      </div>

      {isAuthenticated && user && (
        <div className="sidebar-arena-pro">
          <div className="pro-badge">
            <Sparkles size={13} />
            <span>ARENA PASS</span>
          </div>
          <div className="pro-text">Ranked Tier Active</div>
          <div className="pro-xp">{user.xp || 0} Total XP</div>
        </div>
      )}
    </aside>
  );
}

export default Sidebar;