import { useState, useEffect, useMemo } from "react";
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
  Flame,
  Shield,
  Crown,
  Medal,
  Award,
  TrendingUp,
  Calendar,
} from "lucide-react";

const TIERS = [
  { name: "Bronze Gladiator", minXp: 0, maxXp: 300, icon: Shield, color: "#cd7f32" },
  { name: "Silver Codebreaker", minXp: 300, maxXp: 800, icon: Target, color: "#64748b" },
  { name: "Gold Strategist", minXp: 800, maxXp: 1600, icon: Trophy, color: "#d97706" },
  { name: "Platinum Algorithmist", minXp: 1600, maxXp: 3000, icon: Crown, color: "#0284c7" },
  { name: "Diamond Grandmaster", minXp: 3000, maxXp: 10000, icon: Sparkles, color: "#9333ea" },
];

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
            setRecentSubmissions(submissionsData.value.submissions.slice(0, 6));
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

  // Calculate current tier & progress
  const currentTier = useMemo(() => {
    for (let i = TIERS.length - 1; i >= 0; i--) {
      if (totalXP >= TIERS[i].minXp) {
        return TIERS[i];
      }
    }
    return TIERS[0];
  }, [totalXP]);

  const nextTier = useMemo(() => {
    const currentIndex = TIERS.findIndex((t) => t.name === currentTier.name);
    if (currentIndex < TIERS.length - 1) {
      return TIERS[currentIndex + 1];
    }
    return null;
  }, [currentTier]);

  const progressPercent = useMemo(() => {
    if (!nextTier) return 100;
    const range = nextTier.minXp - currentTier.minXp;
    const progress = totalXP - currentTier.minXp;
    return Math.min(100, Math.max(0, Math.round((progress / range) * 100)));
  }, [totalXP, currentTier, nextTier]);

  // Compute Daily Streak
  const streak = useMemo(() => {
    if (!recentSubmissions || recentSubmissions.length === 0) {
      return problemsSolved > 0 ? 1 : 0;
    }
    const daysSet = new Set(
      recentSubmissions.map((s) => new Date(s.createdAt).toDateString())
    );
    return Math.max(1, daysSet.size);
  }, [recentSubmissions, problemsSolved]);

  // Compute Weekly Activity (last 7 days counts)
  const weeklyActivity = useMemo(() => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = new Date();
    const result = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toDateString();
      const count = recentSubmissions.filter(
        (s) => new Date(s.createdAt).toDateString() === dateStr
      ).length;
      result.push({
        day: days[d.getDay()],
        count: count,
        date: d.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      });
    }
    return result;
  }, [recentSubmissions]);

  const maxWeeklyCount = useMemo(() => {
    const max = Math.max(...weeklyActivity.map((w) => w.count));
    return max > 0 ? max : 1;
  }, [weeklyActivity]);

  // Achievements calculation
  const achievements = useMemo(() => {
    return [
      {
        id: "first_blood",
        title: "First Blood",
        desc: "Solved your first challenge",
        icon: Swords,
        color: "#10b981",
        unlocked: problemsSolved >= 1,
      },
      {
        id: "accuracy_ace",
        title: "Precision Coder",
        desc: "Maintained > 70% accuracy",
        icon: Target,
        color: "#8b5cf6",
        unlocked: accuracy >= 70,
      },
      {
        id: "xp_centurion",
        title: "XP Centurion",
        desc: "Earned 100+ Arena XP",
        icon: Zap,
        color: "#f59e0b",
        unlocked: totalXP >= 100,
      },
      {
        id: "streak_master",
        title: "Streak Sentinel",
        desc: "Active coding persistence",
        icon: Flame,
        color: "#f43f5e",
        unlocked: streak >= 1,
      },
    ];
  }, [problemsSolved, accuracy, totalXP, streak]);

  const TierIcon = currentTier.icon;

  if (loading) {
    return (
      <div className="arena-page" style={{ textAlign: "center", padding: "80px 20px", color: "#64748b" }}>
        <div className="auth-spinner" style={{ width: "36px", height: "36px", margin: "0 auto 16px auto" }} />
        <p style={{ fontSize: "1rem", fontWeight: 600 }}>Calibrating arena telemetry...</p>
      </div>
    );
  }

  return (
    <div className="arena-page">
      {/* Welcome Hero Banner with Tier & XP Progress */}
      <div
        className="arena-card"
        style={{
          background: "#ffffff",
          border: "1px solid rgba(226, 232, 240, 0.9)",
          boxShadow: "0 10px 30px -10px rgba(15, 23, 42, 0.08), 0 1px 3px rgba(15, 23, 42, 0.04)",
          marginBottom: "28px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "relative", zIndex: 2 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px", marginBottom: "12px" }}>
            <div className="arena-badge badge-coding">
              <Sparkles size={13} />
              <span>ARENA COMMAND DASHBOARD</span>
            </div>

            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "5px 14px",
                borderRadius: "9999px",
                fontSize: "0.8rem",
                fontWeight: 700,
                border: `1.5px solid ${currentTier.color}`,
                color: currentTier.color,
                background: "rgba(139, 92, 246, 0.06)",
              }}
            >
              <TierIcon size={14} />
              <span>{currentTier.name}</span>
            </span>
          </div>

          <h1 style={{ margin: "0 0 10px 0", fontSize: "2.2rem", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.03em" }}>
            Welcome back, <span style={{ background: "linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{user?.name || "Arena Champion"}</span>! ⚔️
          </h1>

          <p style={{ margin: "0 0 22px 0", color: "#475569", fontSize: "1rem", maxWidth: "700px", lineHeight: 1.6 }}>
            Ready for your next algorithmic victory? Solve challenges, verify edge-case test suites, and climb the leaderboard tier.
          </p>

          {/* Dynamic Tier Progress Bar */}
          <div style={{ maxWidth: "640px", marginBottom: "24px", background: "#f8fafc", padding: "16px 18px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", fontWeight: 700, color: "#334155", marginBottom: "10px" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <TierIcon size={14} color={currentTier.color} />
                <span>Tier Standing: {currentTier.name}</span>
              </span>
              <span>{progressPercent}% ({nextTier ? `${nextTier.minXp - totalXP} XP to ${nextTier.name}` : "Max Tier Conquered"})</span>
            </div>
            <div style={{ width: "100%", height: "9px", background: "#e2e8f0", borderRadius: "9999px", overflow: "hidden" }}>
              <div
                style={{
                  width: `${progressPercent}%`,
                  height: "100%",
                  background: "linear-gradient(90deg, #ec4899 0%, #8b5cf6 50%, #06b6d4 100%)",
                  boxShadow: "0 0 12px rgba(139, 92, 246, 0.4)",
                  transition: "width 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link to="/challenges" className="arena-btn">
              <Swords size={18} />
              <span>Explore Challenges</span>
            </Link>
            <Link to="/leaderboard" className="arena-btn arena-btn-secondary">
              <Trophy size={18} />
              <span>Global Leaderboard</span>
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

      {/* 5 Stats Cards with 3D Depth */}
      <div className="arena-stats-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
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
            <div className="stat-label">Global Rank</div>
          </div>
        </div>

        <div className="arena-stat-card">
          <div className="stat-icon-wrap stat-icon-rose">
            <Flame size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-val">{streak} Day{streak !== 1 ? "s" : ""}</div>
            <div className="stat-label">Coding Streak</div>
          </div>
        </div>
      </div>

      {/* 2-Column Mid Row: Weekly Activity Chart + Achievements Showcase */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "24px", marginBottom: "28px" }}>
        {/* Weekly Coding Activity Chart */}
        <div className="arena-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <div>
              <h3 style={{ margin: "0 0 4px 0", fontSize: "1.2rem", fontWeight: 700, color: "#0f172a", display: "flex", alignItems: "center", gap: "8px" }}>
                <TrendingUp size={20} color="#7c3aed" />
                <span>Weekly Coding Velocity</span>
              </h3>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b" }}>
                Telemetry of submissions verified over the past 7 days
              </p>
            </div>
            <span className="arena-badge badge-coding">
              <Calendar size={12} />
              <span>7-DAY TREND</span>
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", height: "160px", padding: "10px 8px", background: "#f8fafc", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
            {weeklyActivity.map((w, idx) => {
              const heightPercent = Math.max(12, Math.round((w.count / maxWeeklyCount) * 100));
              const isToday = idx === weeklyActivity.length - 1;
              return (
                <div key={idx} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "100%", justifyContent: "flex-end", gap: "6px" }}>
                  <div style={{ fontSize: "0.74rem", fontWeight: 700, color: w.count > 0 ? "#7c3aed" : "#94a3b8" }}>
                    {w.count}
                  </div>
                  <div
                    style={{
                      width: "32px",
                      height: `${heightPercent}%`,
                      background: isToday
                        ? "linear-gradient(180deg, #ec4899 0%, #8b5cf6 100%)"
                        : w.count > 0
                        ? "linear-gradient(180deg, #8b5cf6 0%, #3b82f6 100%)"
                        : "#e2e8f0",
                      borderRadius: "8px 8px 4px 4px",
                      transition: "all 0.3s ease",
                      boxShadow: w.count > 0 ? "0 4px 10px rgba(139, 92, 246, 0.25)" : "none",
                    }}
                    title={`${w.day} (${w.date}): ${w.count} submission(s)`}
                  />
                  <span style={{ fontSize: "0.78rem", fontWeight: isToday ? 800 : 600, color: isToday ? "#7c3aed" : "#64748b" }}>
                    {w.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Verified Achievement Badges */}
        <div className="arena-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div>
              <h3 style={{ margin: "0 0 4px 0", fontSize: "1.2rem", fontWeight: 700, color: "#0f172a", display: "flex", alignItems: "center", gap: "8px" }}>
                <Award size={20} color="#d97706" />
                <span>Verified Badges</span>
              </h3>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b" }}>
                Special honours unlocked by reaching milestones
              </p>
            </div>
            <Link to="/profile" style={{ fontSize: "0.85rem", color: "#7c3aed", fontWeight: 600, textDecoration: "none" }}>
              View All
            </Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            {achievements.map((ach) => {
              const AchIcon = ach.icon;
              return (
                <div
                  key={ach.id}
                  style={{
                    padding: "14px",
                    borderRadius: "14px",
                    background: ach.unlocked ? "#f8fafc" : "#ffffff",
                    border: ach.unlocked ? "1px solid #e2e8f0" : "1px dashed #cbd5e1",
                    opacity: ach.unlocked ? 1 : 0.6,
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    transition: "all 0.2s ease",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div
                      style={{
                        width: "34px",
                        height: "34px",
                        borderRadius: "10px",
                        background: ach.unlocked ? `${ach.color}15` : "#f1f5f9",
                        color: ach.unlocked ? ach.color : "#94a3b8",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: `1px solid ${ach.unlocked ? `${ach.color}40` : "#e2e8f0"}`,
                      }}
                    >
                      <AchIcon size={16} />
                    </div>
                    {ach.unlocked ? (
                      <span className="arena-badge badge-accepted" style={{ fontSize: "0.68rem", padding: "2px 8px" }}>
                        UNLOCKED
                      </span>
                    ) : (
                      <span style={{ fontSize: "0.68rem", color: "#94a3b8", fontWeight: 700 }}>
                        LOCKED
                      </span>
                    )}
                  </div>
                  <div>
                    <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#0f172a" }}>
                      {ach.title}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "2px" }}>
                      {ach.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Grid: Featured Challenges & Recent Activity */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "24px" }}>
        {/* Recommended Challenges */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h2 style={{ margin: 0, fontSize: "1.3rem", fontWeight: 700, color: "#0f172a", display: "flex", alignItems: "center", gap: "8px" }}>
              <Code2 size={20} color="#7c3aed" />
              <span>Recommended Challenges</span>
            </h2>
            <Link to="/challenges" style={{ color: "#7c3aed", fontSize: "0.88rem", textDecoration: "none", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>
              <span>View All</span>
              <ChevronRight size={16} />
            </Link>
          </div>

          {challenges.length === 0 ? (
            <div className="arena-card arena-empty-state">
              <Code2 size={36} className="arena-empty-icon" />
              <h3 style={{ color: "#0f172a" }}>No challenges available yet</h3>
              <p>Check back soon or explore the challenge catalog.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {challenges.map((challenge) => (
                <div key={challenge._id} className="arena-card" style={{ padding: "20px 22px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", marginBottom: "10px" }}>
                    <div>
                      <h3 style={{ margin: "0 0 6px 0", fontSize: "1.1rem", fontWeight: 700, color: "#0f172a" }}>
                        {challenge.title}
                      </h3>
                      <p style={{ margin: 0, fontSize: "0.88rem", color: "#64748b", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {challenge.description}
                      </p>
                    </div>
                    <span className={`arena-badge badge-${challenge.difficulty || "easy"}`}>
                      {challenge.difficulty}
                    </span>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "14px", borderTop: "1px solid #f1f5f9" }}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <span className={`arena-badge ${challenge.type === "mcq" ? "badge-mcq" : "badge-coding"}`}>
                        {challenge.type}
                      </span>
                      <span className="arena-badge badge-xp">
                        +{challenge.points || 10} XP
                      </span>
                    </div>

                    <Link to={`/challenges/${challenge._id}`} className="arena-btn" style={{ padding: "6px 16px", fontSize: "0.85rem" }}>
                      <span>Solve Challenge</span>
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
            <h2 style={{ margin: 0, fontSize: "1.3rem", fontWeight: 700, color: "#0f172a", display: "flex", alignItems: "center", gap: "8px" }}>
              <Clock size={20} color="#059669" />
              <span>Recent Activity</span>
            </h2>
            <Link to="/submissions" style={{ color: "#7c3aed", fontSize: "0.88rem", textDecoration: "none", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>
              <span>Full History</span>
              <ChevronRight size={16} />
            </Link>
          </div>

          <div className="arena-card" style={{ padding: "18px" }}>
            {recentSubmissions.length === 0 ? (
              <div className="arena-empty-state" style={{ padding: "30px 10px" }}>
                <Clock size={32} className="arena-empty-icon" />
                <h4 style={{ margin: "0 0 4px 0", color: "#334155" }}>No submissions yet</h4>
                <p style={{ margin: 0, fontSize: "0.85rem" }}>Solve a challenge to see your activity logs.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {recentSubmissions.map((sub) => (
                  <div
                    key={sub._id}
                    style={{
                      padding: "14px 16px",
                      background: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      borderRadius: "14px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: "0.92rem", fontWeight: 700, color: "#0f172a", marginBottom: "4px" }}>
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
