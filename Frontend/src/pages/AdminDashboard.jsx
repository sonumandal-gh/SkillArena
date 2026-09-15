import { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import statisticsService from "../services/statisticsService";
import "../styles/Arena.css";
import {
  ShieldAlert,
  Users,
  Code2,
  ListChecks,
  Shield,
  ArrowRight,
  Zap,
  CheckCircle2,
  Settings,
  Plus,
} from "lucide-react";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [adminStats, setAdminStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (!isAdmin) return;

    let isMounted = true;
    const fetchAdminOverview = async () => {
      setLoading(true);
      try {
        const data = await statisticsService.getAdminStats();
        if (isMounted && data?.stats) {
          setAdminStats(data.stats);
        }
      } catch (err) {
        console.error("Error fetching admin stats:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAdminOverview();

    return () => {
      isMounted = false;
    };
  }, [isAdmin]);

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  const totalUsers = adminStats?.totalUsers ?? 0;
  const totalChallenges = adminStats?.totalChallenges ?? 0;
  const totalSubmissions = adminStats?.totalSubmissions ?? 0;
  const totalAdmins = adminStats?.totalAdmins ?? 0;

  return (
    <div className="arena-page">
      {/* Header Banner */}
      <div
        className="arena-card"
        style={{
          background: "linear-gradient(135deg, rgba(217, 70, 239, 0.2) 0%, rgba(15, 23, 42, 0.95) 100%)",
          border: "1px solid rgba(217, 70, 239, 0.4)",
          marginBottom: "28px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <div className="arena-badge badge-admin" style={{ marginBottom: "10px" }}>
            <ShieldAlert size={14} />
            <span>ADMINISTRATION CONTROL CENTER</span>
          </div>
          <h1 style={{ margin: "0 0 6px 0", fontSize: "1.8rem", fontWeight: 800, color: "#f8fafc" }}>
            Admin Dashboard
          </h1>
          <p style={{ margin: 0, color: "#94a3b8", fontSize: "0.95rem" }}>
            Manage arena users, configure challenges, and monitor platform performance.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <Link to="/admin/challenges" className="arena-btn" style={{ background: "linear-gradient(135deg, #a855f7 0%, #6366f1 100%)" }}>
            <Plus size={16} />
            <span>New Challenge</span>
          </Link>
        </div>
      </div>

      {/* 3 Main Stat Cards */}
      <div className="arena-stats-grid" style={{ marginBottom: "32px" }}>
        <div className="arena-stat-card" style={{ padding: "22px 20px" }}>
          <div className="stat-icon-wrap stat-icon-cyan">
            <Users size={26} />
          </div>
          <div className="stat-info">
            <div className="stat-val" style={{ fontSize: "2rem" }}>
              {loading ? "..." : totalUsers}
            </div>
            <div className="stat-label" style={{ fontSize: "0.9rem", fontWeight: 600 }}>
              Total Users
            </div>
          </div>
        </div>

        <div className="arena-stat-card" style={{ padding: "22px 20px" }}>
          <div className="stat-icon-wrap stat-icon-purple">
            <Code2 size={26} />
          </div>
          <div className="stat-info">
            <div className="stat-val" style={{ fontSize: "2rem" }}>
              {loading ? "..." : totalChallenges}
            </div>
            <div className="stat-label" style={{ fontSize: "0.9rem", fontWeight: 600 }}>
              Total Challenges
            </div>
          </div>
        </div>

        <div className="arena-stat-card" style={{ padding: "22px 20px" }}>
          <div className="stat-icon-wrap stat-icon-emerald">
            <ListChecks size={26} />
          </div>
          <div className="stat-info">
            <div className="stat-val" style={{ fontSize: "2rem" }}>
              {loading ? "..." : totalSubmissions}
            </div>
            <div className="stat-label" style={{ fontSize: "0.9rem", fontWeight: 600 }}>
              Total Submissions
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="arena-card" style={{ marginBottom: "32px", padding: "24px" }}>
        <div style={{ marginBottom: "18px", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", paddingBottom: "12px" }}>
          <h2 style={{ margin: 0, fontSize: "1.3rem", fontWeight: 700, color: "#f8fafc", display: "flex", alignItems: "center", gap: "8px" }}>
            <Zap size={20} color="#f59e0b" />
            <span>Quick Actions</span>
          </h2>
          <p style={{ margin: "4px 0 0 0", color: "#94a3b8", fontSize: "0.88rem" }}>
            Perform immediate administrative management operations.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
          {/* Action 1: Manage Users */}
          <div
            style={{
              padding: "20px",
              background: "rgba(15, 23, 42, 0.7)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "14px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: "16px",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                <div className="stat-icon-wrap stat-icon-cyan" style={{ width: "36px", height: "36px" }}>
                  <Users size={18} />
                </div>
                <h3 style={{ margin: 0, fontSize: "1.1rem", color: "#f8fafc", fontWeight: 700 }}>
                  Manage Users
                </h3>
              </div>
              <p style={{ margin: 0, color: "#94a3b8", fontSize: "0.88rem", lineHeight: 1.5 }}>
                View registered members, promote/demote admin roles, or delete user accounts.
              </p>
            </div>

            <Link
              to="/admin/users"
              className="arena-btn"
              style={{
                justifyContent: "center",
                padding: "10px 18px",
                background: "linear-gradient(135deg, #0284c7 0%, #2563eb 100%)",
              }}
            >
              <span>[ Manage Users ]</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Action 2: Manage Challenges */}
          <div
            style={{
              padding: "20px",
              background: "rgba(15, 23, 42, 0.7)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "14px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: "16px",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                <div className="stat-icon-wrap stat-icon-purple" style={{ width: "36px", height: "36px" }}>
                  <Code2 size={18} />
                </div>
                <h3 style={{ margin: 0, fontSize: "1.1rem", color: "#f8fafc", fontWeight: 700 }}>
                  Manage Challenges
                </h3>
              </div>
              <p style={{ margin: 0, color: "#94a3b8", fontSize: "0.88rem", lineHeight: 1.5 }}>
                Create new coding/MCQ problems, modify existing test cases, or delete challenges.
              </p>
            </div>

            <Link
              to="/admin/challenges"
              className="arena-btn"
              style={{
                justifyContent: "center",
                padding: "10px 18px",
                background: "linear-gradient(135deg, #9333ea 0%, #c084fc 100%)",
              }}
            >
              <span>[ Manage Challenges ]</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* System Status Overview */}
      <div className="arena-card">
        <h3 style={{ margin: "0 0 14px 0", fontSize: "1.1rem", color: "#f8fafc", display: "flex", alignItems: "center", gap: "8px" }}>
          <Settings size={18} color="#94a3b8" />
          <span>System Environment Status</span>
        </h3>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
          <div style={{ padding: "12px 14px", background: "rgba(15, 23, 42, 0.6)", borderRadius: "10px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
            <span style={{ fontSize: "0.78rem", color: "#64748b", display: "block" }}>Database Status</span>
            <span style={{ fontSize: "0.92rem", fontWeight: 600, color: "#10b981", display: "flex", alignItems: "center", gap: "6px" }}>
              <CheckCircle2 size={14} /> MongoDB Atlas Connected
            </span>
          </div>

          <div style={{ padding: "12px 14px", background: "rgba(15, 23, 42, 0.6)", borderRadius: "10px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
            <span style={{ fontSize: "0.78rem", color: "#64748b", display: "block" }}>Judge Engine</span>
            <span style={{ fontSize: "0.92rem", fontWeight: 600, color: "#10b981", display: "flex", alignItems: "center", gap: "6px" }}>
              <CheckCircle2 size={14} /> Active (Judge0 API)
            </span>
          </div>

          <div style={{ padding: "12px 14px", background: "rgba(15, 23, 42, 0.6)", borderRadius: "10px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
            <span style={{ fontSize: "0.78rem", color: "#64748b", display: "block" }}>Active Admin Role</span>
            <span style={{ fontSize: "0.92rem", fontWeight: 600, color: "#f472b6", display: "flex", alignItems: "center", gap: "6px" }}>
              <Shield size={14} /> {user?.name} ({totalAdmins} Total Admins)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
