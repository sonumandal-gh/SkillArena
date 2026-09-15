import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";
import userService from "../services/userService";
import "../styles/Arena.css";
import {
  ShieldAlert,
  Search,
  User,
  Shield,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Zap,
} from "lucide-react";

const AdminUsers = () => {
  const { user } = useAuth();
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");
  const [actionError, setActionError] = useState("");

  const isAdmin = user?.role === "admin";

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await userService.getAllUsers(searchTerm.trim());
      if (data?.users) {
        setUsersList(data.users);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    if (!isAdmin) return;
    const debounce = setTimeout(() => {
      fetchUsers();
    }, 250);
    return () => clearTimeout(debounce);
  }, [fetchUsers, isAdmin]);

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleRoleToggle = async (targetUser) => {
    const newRole = targetUser.role === "admin" ? "user" : "admin";
    if (
      !window.confirm(
        `Are you sure you want to change ${targetUser.name}'s role to ${newRole.toUpperCase()}?`
      )
    )
      return;

    setActionError("");
    setActionSuccess("");

    try {
      await userService.updateUserRole(targetUser._id, newRole);
      setActionSuccess(`Updated ${targetUser.name}'s role to ${newRole}.`);
      fetchUsers();
    } catch (err) {
      setActionError(err?.response?.data?.message || "Failed to update role.");
    }
  };

  const handleDeleteUser = async (targetUser) => {
    if (
      !window.confirm(
        `Are you sure you want to permanently delete user ${targetUser.name} (${targetUser.email})?`
      )
    )
      return;

    setActionError("");
    setActionSuccess("");

    try {
      await userService.deleteUser(targetUser._id);
      setActionSuccess(`Deleted user ${targetUser.name}.`);
      fetchUsers();
    } catch (err) {
      setActionError(err?.response?.data?.message || "Failed to delete user.");
    }
  };

  return (
    <div className="arena-page">
      {/* Header Banner */}
      <div className="arena-header-banner">
        <div className="arena-title-wrap">
          <h1>
            <ShieldAlert size={28} color="#d946ef" />
            <span>Admin User Management</span>
          </h1>
          <p>Search, manage roles, and administrate arena registered members.</p>
        </div>

        {/* Search */}
        <div className="arena-search-box" style={{ maxWidth: "320px" }}>
          <Search size={18} className="arena-search-icon" />
          <input
            type="text"
            className="arena-search-input"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {actionSuccess && (
        <div className="auth-alert auth-alert-success" style={{ marginBottom: "16px" }}>
          <CheckCircle2 size={18} />
          <span>{actionSuccess}</span>
        </div>
      )}

      {actionError && (
        <div className="auth-alert auth-alert-error" style={{ marginBottom: "16px" }}>
          <AlertCircle size={18} />
          <span>{actionError}</span>
        </div>
      )}

      {/* Users Table */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#94a3b8" }}>
          <div className="auth-spinner" style={{ width: "32px", height: "32px", margin: "0 auto 12px auto" }} />
          <p>Loading users...</p>
        </div>
      ) : usersList.length === 0 ? (
        <div className="arena-card arena-empty-state">
          <User size={48} className="arena-empty-icon" />
          <h2>No users found</h2>
          <p>No user accounts matched your search criteria.</p>
        </div>
      ) : (
        <div className="arena-table-wrap">
          <table className="arena-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>XP</th>
                <th>Solved</th>
                <th>Accuracy</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {usersList.map((u) => {
                const isCurrentSelf = u._id === user?.id || u._id === user?._id;
                return (
                  <tr key={u._id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ fontWeight: 600, color: "#f8fafc" }}>
                          {u.name}
                        </span>
                        {isCurrentSelf && (
                          <span className="arena-badge badge-coding" style={{ fontSize: "0.65rem", padding: "2px 6px" }}>
                            YOU
                          </span>
                        )}
                      </div>
                    </td>

                    <td style={{ color: "#94a3b8", fontSize: "0.88rem" }}>
                      {u.email}
                    </td>

                    <td>
                      <span className={`arena-badge ${u.role === "admin" ? "badge-admin" : "badge-coding"}`}>
                        <Shield size={11} />
                        <span>{u.role || "user"}</span>
                      </span>
                    </td>

                    <td>
                      <span className="arena-badge badge-xp">
                        <Zap size={11} color="#fbbf24" />
                        <span>{u.xp || 0} XP</span>
                      </span>
                    </td>

                    <td style={{ color: "#e2e8f0", fontWeight: 600 }}>
                      {u.problemsSolved || 0}
                    </td>

                    <td style={{ color: "#94a3b8" }}>
                      {u.accuracy || 0}%
                    </td>

                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                        <button
                          type="button"
                          className="arena-btn arena-btn-secondary"
                          style={{ padding: "5px 12px", fontSize: "0.78rem" }}
                          onClick={() => handleRoleToggle(u)}
                          disabled={isCurrentSelf}
                          title="Toggle Admin / User role"
                        >
                          {u.role === "admin" ? "Demote to User" : "Make Admin"}
                        </button>

                        <button
                          type="button"
                          className="arena-btn arena-btn-danger"
                          style={{ padding: "5px 10px" }}
                          onClick={() => handleDeleteUser(u)}
                          disabled={isCurrentSelf}
                          title="Delete User"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
