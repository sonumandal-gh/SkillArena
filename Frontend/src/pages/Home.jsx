import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import statisticsService from "../services/statisticsService";
import "../styles/Arena.css";
import {
  Swords,
  Trophy,
  Zap,
  Code2,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Terminal,
  Cpu,
  Globe,
} from "lucide-react";

const Home = () => {
  const { user, isAuthenticated } = useAuth();
  const [platformStats, setPlatformStats] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchPublicStats = async () => {
      try {
        const data = await statisticsService.getPublicStats();
        if (isMounted && data?.stats) {
          setPlatformStats(data.stats);
        }
      } catch (err) {
        console.error("Error fetching public stats:", err);
      }
    };
    fetchPublicStats();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="arena-page" style={{ maxWidth: "1200px", margin: "0 auto" }}>
      {/* Logged in Quick Bar */}
      {isAuthenticated && (
        <div
          className="arena-card"
          style={{
            marginBottom: "24px",
            background: "linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(30, 41, 59, 0.8) 100%)",
            border: "1px solid rgba(99, 102, 241, 0.3)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Sparkles size={20} color="#a5b4fc" />
            <span style={{ color: "#e2e8f0", fontWeight: 600 }}>
              Welcome back, <strong>{user?.name}</strong>! You are currently signed in.
            </span>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <Link to="/dashboard" className="arena-btn" style={{ padding: "6px 14px", fontSize: "0.85rem" }}>
              <span>Go to Dashboard</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section
        style={{
          textAlign: "center",
          padding: "60px 20px 40px 20px",
          position: "relative",
        }}
      >
        <div className="arena-badge badge-coding" style={{ margin: "0 auto 16px auto", display: "inline-flex" }}>
          <Swords size={14} />
          <span>ALGORITHMIC SHOWDOWN PLATFORM</span>
        </div>

        <h1
          style={{
            fontSize: "clamp(2.2rem, 5vw, 3.6rem)",
            fontWeight: 800,
            lineHeight: 1.15,
            color: "#f8fafc",
            marginBottom: "16px",
            letterSpacing: "-0.02em",
          }}
        >
          Master Code. Battle Peers. <br />
          <span
            style={{
              background: "linear-gradient(135deg, #818cf8 0%, #c084fc 50%, #f472b6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Conquer the SkillArena.
          </span>
        </h1>

        <p
          style={{
            fontSize: "1.15rem",
            color: "#94a3b8",
            maxWidth: "700px",
            margin: "0 auto 32px auto",
            lineHeight: 1.6,
          }}
        >
          Compete in live coding battles, solve real algorithmic challenges, earn XP,
          and climb the global developer leaderboard standings.
        </p>

        {/* Hero Actions */}
        <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
          {!isAuthenticated ? (
            <>
              <Link
                to="/register"
                className="arena-btn"
                style={{
                  padding: "12px 28px",
                  fontSize: "1rem",
                  boxShadow: "0 0 24px rgba(99, 102, 241, 0.4)",
                }}
              >
                <Sparkles size={18} />
                <span>Get Started Free</span>
              </Link>
              <Link
                to="/login"
                className="arena-btn arena-btn-secondary"
                style={{ padding: "12px 26px", fontSize: "1rem" }}
              >
                <span>Sign In to Arena</span>
                <ArrowRight size={16} />
              </Link>
            </>
          ) : (
            <Link
              to="/challenges"
              className="arena-btn"
              style={{
                padding: "12px 28px",
                fontSize: "1rem",
                boxShadow: "0 0 24px rgba(99, 102, 241, 0.4)",
              }}
            >
              <Swords size={18} />
              <span>Explore Challenges Catalog</span>
            </Link>
          )}
        </div>
      </section>

      {/* Statistics Counter Banner */}
      <div
        className="arena-stats-grid"
        style={{
          marginTop: "30px",
          marginBottom: "50px",
        }}
      >
        <div className="arena-stat-card" style={{ textAlign: "center", flexDirection: "column", gap: "8px" }}>
          <div className="stat-icon-wrap stat-icon-amber" style={{ margin: "0 auto" }}>
            <Zap size={24} />
          </div>
          <div className="stat-val" style={{ fontSize: "1.8rem" }}>
            {platformStats ? platformStats.totalUsers : 0}
          </div>
          <div className="stat-label">Registered Developers</div>
        </div>

        <div className="arena-stat-card" style={{ textAlign: "center", flexDirection: "column", gap: "8px" }}>
          <div className="stat-icon-wrap stat-icon-purple" style={{ margin: "0 auto" }}>
            <Code2 size={24} />
          </div>
          <div className="stat-val" style={{ fontSize: "1.8rem" }}>
            {platformStats ? platformStats.totalChallenges : 0}
          </div>
          <div className="stat-label">Algorithmic Challenges</div>
        </div>

        <div className="arena-stat-card" style={{ textAlign: "center", flexDirection: "column", gap: "8px" }}>
          <div className="stat-icon-wrap stat-icon-emerald" style={{ margin: "0 auto" }}>
            <CheckCircle2 size={24} />
          </div>
          <div className="stat-val" style={{ fontSize: "1.8rem" }}>
            {platformStats ? platformStats.totalSubmissions : 0}
          </div>
          <div className="stat-label">Submissions Evaluated</div>
        </div>

        <div className="arena-stat-card" style={{ textAlign: "center", flexDirection: "column", gap: "8px" }}>
          <div className="stat-icon-wrap stat-icon-cyan" style={{ margin: "0 auto" }}>
            <Trophy size={24} />
          </div>
          <div className="stat-val" style={{ fontSize: "1.8rem" }}>Ranked</div>
          <div className="stat-label">Global Leaderboard Tier</div>
        </div>
      </div>

      {/* Feature Cards Grid */}
      <section style={{ marginBottom: "50px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h2 style={{ fontSize: "1.8rem", color: "#f8fafc", fontWeight: 700, margin: "0 0 8px 0" }}>
            Why Coders Choose SkillArena
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "0.95rem" }}>
            Everything you need to sharpen your data structure and algorithm skills.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
          <div className="arena-card" style={{ padding: "24px" }}>
            <div className="stat-icon-wrap stat-icon-purple" style={{ marginBottom: "16px" }}>
              <Terminal size={22} />
            </div>
            <h3 style={{ color: "#f8fafc", fontSize: "1.15rem", fontWeight: 700, margin: "0 0 8px 0" }}>
              Live Judge Engine
            </h3>
            <p style={{ color: "#94a3b8", fontSize: "0.9rem", margin: 0, lineHeight: 1.5 }}>
              Instant execution and verification against edge case test suites with automated time and memory limit checks.
            </p>
          </div>

          <div className="arena-card" style={{ padding: "24px" }}>
            <div className="stat-icon-wrap stat-icon-amber" style={{ marginBottom: "16px" }}>
              <Trophy size={22} />
            </div>
            <h3 style={{ color: "#f8fafc", fontSize: "1.15rem", fontWeight: 700, margin: "0 0 8px 0" }}>
              Dynamic Leaderboard
            </h3>
            <p style={{ color: "#94a3b8", fontSize: "0.9rem", margin: 0, lineHeight: 1.5 }}>
              Earn XP for every accepted solution and rank up on global global developer standings in real time.
            </p>
          </div>

          <div className="arena-card" style={{ padding: "24px" }}>
            <div className="stat-icon-wrap stat-icon-emerald" style={{ marginBottom: "16px" }}>
              <Cpu size={22} />
            </div>
            <h3 style={{ color: "#f8fafc", fontSize: "1.15rem", fontWeight: 700, margin: "0 0 8px 0" }}>
              Multi-Language Support
            </h3>
            <p style={{ color: "#94a3b8", fontSize: "0.9rem", margin: 0, lineHeight: 1.5 }}>
              Write solutions in JavaScript, Python, C++, Java, and Go with built-in code editor highlighting.
            </p>
          </div>

          <div className="arena-card" style={{ padding: "24px" }}>
            <div className="stat-icon-wrap stat-icon-cyan" style={{ marginBottom: "16px" }}>
              <Globe size={22} />
            </div>
            <h3 style={{ color: "#f8fafc", fontSize: "1.15rem", fontWeight: 700, margin: "0 0 8px 0" }}>
              Analytics & Insights
            </h3>
            <p style={{ color: "#94a3b8", fontSize: "0.9rem", margin: 0, lineHeight: 1.5 }}>
              Track your accuracy percentage, difficulty breakdown, category strength, and progress overtime.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Footer Card */}
      <div
        className="arena-card"
        style={{
          background: "linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(15, 23, 42, 0.95) 100%)",
          border: "1px solid rgba(99, 102, 241, 0.4)",
          textAlign: "center",
          padding: "40px 20px",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ fontSize: "1.6rem", color: "#f8fafc", fontWeight: 700, margin: "0 0 8px 0" }}>
          Ready to enter the battleground?
        </h2>
        <p style={{ color: "#94a3b8", fontSize: "0.95rem", marginBottom: "20px" }}>
          Join hundreds of developers honing their coding skills on SkillArena today.
        </p>
        <Link to={isAuthenticated ? "/challenges" : "/register"} className="arena-btn" style={{ padding: "10px 24px" }}>
          <span>{isAuthenticated ? "Solve Challenges Now" : "Create Your Account"}</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};

export default Home;
