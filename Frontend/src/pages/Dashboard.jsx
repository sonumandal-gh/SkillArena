import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import statisticsService from "../services/statisticsService";
import leaderboardService from "../services/leaderboardService";
import challengeService from "../services/challengeService";
import submissionService from "../services/submissionService";
import "../styles/Arena.css";
import {
  Zap,
  CheckCircle2,
  Target,
  Trophy,
  Swords,
  ArrowRight,
  Sparkles,
  Code2,
  Clock,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [rank, setRank] = useState(null);
  const [challenges, setChallenges] = useState([]);
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchDashboardData = async () => {
      try {
        const [statsData, rankData, challengesData, submissionsData] =
          await Promise.allSettled([
            statisticsService.getDashboardStats(),
            leaderboardService.getMyRank(),
            challengeService.getAllChallenges(),
            submissionService.getMySubmissions(),
          ]);

        if (isMounted) {
          if (statsData.status === "fulfilled" && statsData.value?.statistics) {
            setStats(statsData.value.statistics);
          }
          if (rankData.status === "fulfilled" && rankData.value?.rank) {
            setRank(rankData.value.rank);
          }
          if (challengesData.status === "fulfilled" && challengesData.value?.challenges) {
            setChallenges(challengesData.value.challenges.slice(0, 4));
          }
          if (submissionsData.status === "fulfilled" && submissionsData.value?.submissions) {
            setRecentSubmissions(submissionsData.value.submissions.slice(0, 5));
          }
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  const totalXP = stats?.xp ?? user?.xp ?? 0;
  const problemsSolved = stats?.problemsSolved ?? user?.problemsSolved ?? 0;
  const accuracy = stats?.accuracy ?? user?.accuracy ?? 0;

  if (loading) {
    return (
      <div className="arena-page" style={{ textAlign: "center", padding: "60px 20px", color: "#94a3b8" }}>
        <div className="auth-spinner" style={{ width: "32px", height: "32px", margin: "0 auto 12px auto" }} />
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="arena-page">
      {/* Welcome Banner */}
      <div
        className="arena-card"
        style={{
          background: "linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(15, 23, 42, 0.85) 100%)",
          border: "1px solid rgba(99, 102, 241, 0.35)",
          marginBottom: "28px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "relative", zIndex: 2 }}>
          <div className="arena-badge badge-coding" style={{ marginBottom: "12px" }}>
            <Sparkles size={13} />
            <span>ARENA DASHBOARD</span>
          </div>
          <h1 style={{ margin: "0 0 8px 0", fontSize: "2rem", fontWeight: 800, color: "#f8fafc" }}>
            Welcome back, <span style={{ color: "#a5b4fc" }}>{user?.name || "Arena Champion"}</span>! ⚔️
          </h1>
          <p style={{ margin: "0 0 20px 0", color: "#94a3b8", fontSize: "1rem", maxWidth: "650px" }}>
            Ready to test your algorithms? Solve new challenges, increase your accuracy, and climb the leaderboard standings.
          </p>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link to="/challenges" className="arena-btn">
              <Swords size={18} />
              <span>Explore Challenges</span>
            </Link>
            <Link to="/leaderboard" className="arena-btn arena-btn-secondary">
              <Trophy size={18} />
              <span>View Leaderboard</span>
            </Link>
            {user?.role === "admin" && (
              <Link
                to="/admin/dashboard"
                className="arena-btn"
                style={{ background: "linear-gradient(135deg, #d946ef 0%, #9333ea 100%)" }}
              >
                <ShieldAlert size={18} />
                <span>Admin Control Center</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="arena-stats-grid">
        <div className="arena-stat-card">
          <div className="stat-icon-wrap stat-icon-amber">
            <Zap size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-val">{totalXP}</div>
            <div className="stat-label">Total XP Earned</div>
          </div>
        </div>

        <div className="arena-stat-card">
          <div className="stat-icon-wrap stat-icon-emerald">
            <CheckCircle2 size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-val">{problemsSolved}</div>
            <div className="stat-label">Problems Solved</div>
          </div>
        </div>

        <div className="arena-stat-card">
          <div className="stat-icon-wrap stat-icon-purple">
            <Target size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-val">{accuracy}%</div>
            <div className="stat-label">Accuracy Rate</div>
          </div>
        </div>

        <div className="arena-stat-card">
          <div className="stat-icon-wrap stat-icon-cyan">
            <Trophy size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-val">{rank ? `#${rank}` : "Ranked"}</div>
            <div className="stat-label">Global Arena Rank</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Featured Challenges & Recent Activity */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "24px" }}>
        
        {/* Recommended Challenges */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h2 style={{ margin: 0, fontSize: "1.3rem", fontWeight: 700, color: "#f8fafc", display: "flex", alignItems: "center", gap: "8px" }}>
              <Code2 size={20} color="#818cf8" />
              <span>Recommended Challenges</span>
            </h2>
            <Link to="/challenges" style={{ color: "#818cf8", fontSize: "0.88rem", textDecoration: "none", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>
              <span>View All</span>
              <ChevronRight size={16} />
            </Link>
          </div>

          {challenges.length === 0 ? (
            <div className="arena-card arena-empty-state">
              <Code2 size={36} className="arena-empty-icon" />
              <h3>No challenges available yet</h3>
              <p>Check back soon or explore the challenge catalog.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {challenges.map((challenge) => (
                <div key={challenge._id} className="arena-card" style={{ padding: "18px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", marginBottom: "8px" }}>
                    <div>
                      <h3 style={{ margin: "0 0 6px 0", fontSize: "1.05rem", fontWeight: 700, color: "#f8fafc" }}>
                        {challenge.title}
                      </h3>
                      <p style={{ margin: 0, fontSize: "0.85rem", color: "#94a3b8", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {challenge.description}
                      </p>
                    </div>
                    <span className={`arena-badge badge-${challenge.difficulty || "easy"}`}>
                      {challenge.difficulty}
                    </span>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "12px", borderTop: "1px solid rgba(255, 255, 255, 0.05)" }}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <span className={`arena-badge ${challenge.type === "mcq" ? "badge-mcq" : "badge-coding"}`}>
                        {challenge.type}
                      </span>
                      <span className="arena-badge badge-xp">
                        +{challenge.points || 10} XP
                      </span>
                    </div>

                    <Link to={`/challenges/${challenge._id}`} className="arena-btn" style={{ padding: "6px 14px", fontSize: "0.84rem" }}>
                      <span>Solve</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Submissions & Activity */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h2 style={{ margin: 0, fontSize: "1.3rem", fontWeight: 700, color: "#f8fafc", display: "flex", alignItems: "center", gap: "8px" }}>
              <Clock size={20} color="#34d399" />
              <span>Recent Activity</span>
            </h2>
            <Link to="/submissions" style={{ color: "#818cf8", fontSize: "0.88rem", textDecoration: "none", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>
              <span>History</span>
              <ChevronRight size={16} />
            </Link>
          </div>

          <div className="arena-card" style={{ padding: "16px" }}>
            {recentSubmissions.length === 0 ? (
              <div className="arena-empty-state" style={{ padding: "30px 10px" }}>
                <Clock size={32} className="arena-empty-icon" />
                <h4 style={{ margin: "0 0 4px 0", color: "#e2e8f0" }}>No submissions yet</h4>
                <p style={{ margin: 0, fontSize: "0.85rem" }}>Solve a challenge to see your activity logs.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {recentSubmissions.map((sub) => (
                  <div
                    key={sub._id}
                    style={{
                      padding: "12px 14px",
                      background: "rgba(15, 23, 42, 0.7)",
                      border: "1px solid rgba(255, 255, 255, 0.05)",
                      borderRadius: "12px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "#f8fafc", marginBottom: "4px" }}>
                        {sub.challenge?.title || "Challenge Solution"}
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "#64748b" }}>
                        {new Date(sub.createdAt).toLocaleDateString()} • {sub.language || sub.type}
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      {sub.isCorrect ? (
                        <span className="arena-badge badge-accepted">
                          +{sub.xpEarned} XP
                        </span>
                      ) : (
                        <span className="arena-badge badge-wrong">
                          Wrong
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
