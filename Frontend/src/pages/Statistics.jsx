import { useState, useEffect } from "react";
import statisticsService from "../services/statisticsService";
import "../styles/Arena.css";
import {
  BarChart3,
  Zap,
  Target,
  CheckCircle2,
  XCircle,
  FolderCode,
} from "lucide-react";

const Statistics = () => {
  const [progress, setProgress] = useState(null);
  const [difficultyStats, setDifficultyStats] = useState(null);
  const [categoryStats, setCategoryStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchAllStats = async () => {
      setLoading(true);
      try {
        const [progRes, diffRes, catRes] = await Promise.allSettled([
          statisticsService.getUserProgress(),
          statisticsService.getDifficultyStats(),
          statisticsService.getCategoryStats(),
        ]);

        if (isMounted) {
          if (progRes.status === "fulfilled" && progRes.value?.progress) {
            setProgress(progRes.value.progress);
          }
          if (diffRes.status === "fulfilled" && diffRes.value?.statistics) {
            setDifficultyStats(diffRes.value.statistics);
          }
          if (catRes.status === "fulfilled" && catRes.value?.statistics) {
            setCategoryStats(catRes.value.statistics);
          }
        }
      } catch (err) {
        console.error("Error fetching statistics:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAllStats();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="arena-page" style={{ textAlign: "center", padding: "80px 20px" }}>
        <div className="auth-spinner" style={{ width: "36px", height: "36px", margin: "0 auto 16px auto" }} />
        <p style={{ color: "#94a3b8" }}>Aggregating your arena statistics...</p>
      </div>
    );
  }

  const submissions = progress?.submissions || { total: 0, correct: 0, wrong: 0 };
  const easy = difficultyStats?.easy || { total: 0, correct: 0, wrong: 0 };
  const medium = difficultyStats?.medium || { total: 0, correct: 0, wrong: 0 };
  const hard = difficultyStats?.hard || { total: 0, correct: 0, wrong: 0 };

  const categories = categoryStats ? Object.entries(categoryStats) : [];

  return (
    <div className="arena-page">
      {/* Header */}
      <div className="arena-header-banner">
        <div className="arena-title-wrap">
          <h1>
            <BarChart3 size={28} color="#818cf8" />
            <span>Developer Analytics & Performance</span>
          </h1>
          <p>Deep dive into your accuracy metrics, difficulty distribution, and category mastery.</p>
        </div>
      </div>

      {/* Top Stats Overview */}
      <div className="arena-stats-grid">
        <div className="arena-stat-card">
          <div className="stat-icon-wrap stat-icon-amber">
            <Zap size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-val">{progress?.xp || 0}</div>
            <div className="stat-label">Total XP Points</div>
          </div>
        </div>

        <div className="arena-stat-card">
          <div className="stat-icon-wrap stat-icon-emerald">
            <CheckCircle2 size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-val">{progress?.problemsSolved || 0}</div>
            <div className="stat-label">Problems Solved</div>
          </div>
        </div>

        <div className="arena-stat-card">
          <div className="stat-icon-wrap stat-icon-purple">
            <Target size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-val">{progress?.accuracy || 0}%</div>
            <div className="stat-label">Global Accuracy</div>
          </div>
        </div>

        <div className="arena-stat-card">
          <div className="stat-icon-wrap stat-icon-cyan">
            <BarChart3 size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-val">{submissions.total}</div>
            <div className="stat-label">Total Submissions</div>
          </div>
        </div>
      </div>

      {/* Submissions Breakdown & Difficulty Distribution */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: "24px", marginBottom: "28px" }}>
        
        {/* Correct vs Wrong Distribution */}
        <div className="arena-card">
          <h2 style={{ margin: "0 0 16px 0", fontSize: "1.2rem", color: "#f8fafc" }}>
            Submissions Breakdown
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", marginBottom: "6px" }}>
                <span style={{ color: "#34d399", display: "flex", alignItems: "center", gap: "6px" }}>
                  <CheckCircle2 size={16} /> Accepted Solutions
                </span>
                <span style={{ color: "#f8fafc", fontWeight: 700 }}>
                  {submissions.correct} ({submissions.total > 0 ? Math.round((submissions.correct / submissions.total) * 100) : 0}%)
                </span>
              </div>
              <div style={{ height: "8px", background: "rgba(255,255,255,0.08)", borderRadius: "6px", overflow: "hidden" }}>
                <div
                  style={{
                    width: `${submissions.total > 0 ? (submissions.correct / submissions.total) * 100 : 0}%`,
                    height: "100%",
                    background: "#10b981",
                  }}
                />
              </div>
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", marginBottom: "6px" }}>
                <span style={{ color: "#fb7185", display: "flex", alignItems: "center", gap: "6px" }}>
                  <XCircle size={16} /> Wrong Attempts
                </span>
                <span style={{ color: "#f8fafc", fontWeight: 700 }}>
                  {submissions.wrong} ({submissions.total > 0 ? Math.round((submissions.wrong / submissions.total) * 100) : 0}%)
                </span>
              </div>
              <div style={{ height: "8px", background: "rgba(255,255,255,0.08)", borderRadius: "6px", overflow: "hidden" }}>
                <div
                  style={{
                    width: `${submissions.total > 0 ? (submissions.wrong / submissions.total) * 100 : 0}%`,
                    height: "100%",
                    background: "#f43f5e",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Difficulty Breakdown */}
        <div className="arena-card">
          <h2 style={{ margin: "0 0 16px 0", fontSize: "1.2rem", color: "#f8fafc" }}>
            Difficulty Breakdown
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px" }}>
            
            {/* Easy */}
            <div style={{ background: "rgba(16, 185, 129, 0.08)", border: "1px solid rgba(16, 185, 129, 0.25)", borderRadius: "14px", padding: "16px", textAlign: "center" }}>
              <span className="arena-badge badge-easy" style={{ marginBottom: "10px" }}>Easy</span>
              <div style={{ fontSize: "1.45rem", fontWeight: 800, color: "#34d399", margin: "6px 0" }}>
                {easy.correct} <span style={{ fontSize: "0.85rem", color: "#64748b" }}>/ {easy.total}</span>
              </div>
              <div style={{ fontSize: "0.78rem", color: "#94a3b8" }}>
                {easy.total > 0 ? `${Math.round((easy.correct / easy.total) * 100)}% Pass` : "No attempts"}
              </div>
            </div>

            {/* Medium */}
            <div style={{ background: "rgba(245, 158, 11, 0.08)", border: "1px solid rgba(245, 158, 11, 0.25)", borderRadius: "14px", padding: "16px", textAlign: "center" }}>
              <span className="arena-badge badge-medium" style={{ marginBottom: "10px" }}>Medium</span>
              <div style={{ fontSize: "1.45rem", fontWeight: 800, color: "#fbbf24", margin: "6px 0" }}>
                {medium.correct} <span style={{ fontSize: "0.85rem", color: "#64748b" }}>/ {medium.total}</span>
              </div>
              <div style={{ fontSize: "0.78rem", color: "#94a3b8" }}>
                {medium.total > 0 ? `${Math.round((medium.correct / medium.total) * 100)}% Pass` : "No attempts"}
              </div>
            </div>

            {/* Hard */}
            <div style={{ background: "rgba(244, 63, 94, 0.08)", border: "1px solid rgba(244, 63, 94, 0.25)", borderRadius: "14px", padding: "16px", textAlign: "center" }}>
              <span className="arena-badge badge-hard" style={{ marginBottom: "10px" }}>Hard</span>
              <div style={{ fontSize: "1.45rem", fontWeight: 800, color: "#fb7185", margin: "6px 0" }}>
                {hard.correct} <span style={{ fontSize: "0.85rem", color: "#64748b" }}>/ {hard.total}</span>
              </div>
              <div style={{ fontSize: "0.78rem", color: "#94a3b8" }}>
                {hard.total > 0 ? `${Math.round((hard.correct / hard.total) * 100)}% Pass` : "No attempts"}
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Category Mastery */}
      <div className="arena-card">
        <h2 style={{ margin: "0 0 18px 0", fontSize: "1.2rem", color: "#f8fafc", display: "flex", alignItems: "center", gap: "8px" }}>
          <FolderCode size={20} color="#818cf8" />
          <span>Category Mastery Distribution</span>
        </h2>

        {categories.length === 0 ? (
          <div className="arena-empty-state" style={{ padding: "20px" }}>
            <p>Solve challenges from different categories to build your category mastery profile.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
            {categories.map(([categoryName, data]) => {
              const passRate = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
              return (
                <div
                  key={categoryName}
                  style={{
                    background: "rgba(15, 23, 42, 0.7)",
                    border: "1px solid rgba(255, 255, 255, 0.06)",
                    borderRadius: "14px",
                    padding: "16px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <span style={{ fontWeight: 700, color: "#f8fafc", fontSize: "0.95rem" }}>
                      {categoryName}
                    </span>
                    <span className="arena-badge badge-coding">
                      {passRate}%
                    </span>
                  </div>

                  <div style={{ fontSize: "0.82rem", color: "#94a3b8", marginBottom: "8px" }}>
                    {data.correct} correct of {data.total} attempts
                  </div>

                  <div style={{ height: "6px", background: "rgba(255,255,255,0.08)", borderRadius: "4px", overflow: "hidden" }}>
                    <div
                      style={{
                        width: `${passRate}%`,
                        height: "100%",
                        background: "linear-gradient(90deg, #6366f1, #38bdf8)",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Statistics;
