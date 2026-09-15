import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../hooks/useAuth";
import leaderboardService from "../services/leaderboardService";
import "../styles/Arena.css";
import {
  Trophy,
  Search,
  Zap,
  ChevronLeft,
  ChevronRight,
  Crown,
} from "lucide-react";

const Leaderboard = () => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [myRank, setMyRank] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchRankings = useCallback(async () => {
    setLoading(true);
    try {
      if (searchTerm.trim()) {
        const searchRes = await leaderboardService.searchLeaderboard(searchTerm.trim());
        if (searchRes?.leaderboard) {
          setLeaderboard(searchRes.leaderboard);
          setTotalPages(1);
        }
      } else {
        const [pageRes, rankRes] = await Promise.allSettled([
          leaderboardService.getLeaderboardPagination(page, 10),
          leaderboardService.getMyRank(),
        ]);

        if (pageRes.status === "fulfilled" && pageRes.value?.leaderboard) {
          setLeaderboard(pageRes.value.leaderboard);
          setTotalPages(pageRes.value.totalPages || 1);
          setTotalUsers(pageRes.value.totalUsers || 0);
        }

        if (rankRes.status === "fulfilled" && rankRes.value?.rank) {
          setMyRank(rankRes.value);
        }
      }
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchRankings();
    }, 250);
    return () => clearTimeout(debounce);
  }, [fetchRankings]);

  const topThree = leaderboard.slice(0, 3);

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="arena-page">
      {/* Header */}
      <div className="arena-header-banner">
        <div className="arena-title-wrap">
          <h1>
            <Trophy size={28} color="#fbbf24" />
            <span>Global Arena Leaderboard</span>
          </h1>
          <p>The top competitive coders ranked by XP, accuracy, and algorithmic prowess.</p>
        </div>

        {/* Search input */}
        <div className="arena-search-box" style={{ maxWidth: "320px" }}>
          <Search size={18} className="arena-search-icon" />
          <input
            type="text"
            className="arena-search-input"
            placeholder="Search coder by name..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      {/* My Rank Highlight Bar */}
      {myRank && (
        <div
          className="arena-card"
          style={{
            background: "linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(17, 24, 39, 0.8) 100%)",
            border: "1px solid rgba(99, 102, 241, 0.3)",
            padding: "16px 24px",
            marginBottom: "28px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "14px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: 800,
                fontSize: "1.1rem",
              }}
            >
              #{myRank.rank}
            </div>
            <div>
              <div style={{ color: "#f8fafc", fontWeight: 700, fontSize: "1.05rem" }}>
                Your Standing: #{myRank.rank} {myRank.name}
              </div>
              <div style={{ color: "#94a3b8", fontSize: "0.85rem" }}>
                Keep solving challenges to surpass fellow arena coders!
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "20px" }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "0.78rem", color: "#64748b", fontWeight: 600 }}>CURRENT XP</div>
              <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#fbbf24" }}>{myRank.xp} XP</div>
            </div>
          </div>
        </div>
      )}

      {/* Top 3 Podium (Visible on First Page without search) */}
      {!searchTerm && page === 1 && topThree.length >= 3 && (
        <div className="podium-container">
          {/* Rank 2 (Silver) */}
          <div className="podium-card podium-card-2">
            <div className="podium-medal" style={{ background: "rgba(203, 213, 225, 0.2)", color: "#cbd5e1" }}>
              🥈
            </div>
            <div className="user-avatar" style={{ width: "48px", height: "48px", fontSize: "16px", marginBottom: "10px" }}>
              {getInitials(topThree[1].name)}
            </div>
            <div className="podium-name">{topThree[1].name}</div>
            <div className="podium-xp">{topThree[1].xp} XP</div>
            <span className="arena-badge badge-coding">Rank #2</span>
          </div>

          {/* Rank 1 (Gold) */}
          <div className="podium-card podium-card-1">
            <Crown size={24} color="#fbbf24" style={{ marginBottom: "4px" }} />
            <div className="podium-medal" style={{ background: "rgba(251, 191, 36, 0.2)", color: "#fbbf24" }}>
              🥇
            </div>
            <div
              className="user-avatar"
              style={{
                width: "56px",
                height: "56px",
                fontSize: "18px",
                marginBottom: "10px",
                boxShadow: "0 0 20px rgba(251, 191, 36, 0.5)",
                border: "2px solid #fbbf24",
              }}
            >
              {getInitials(topThree[0].name)}
            </div>
            <div className="podium-name" style={{ fontSize: "1.15rem" }}>{topThree[0].name}</div>
            <div className="podium-xp" style={{ fontSize: "1.45rem" }}>{topThree[0].xp} XP</div>
            <span className="arena-badge badge-xp">Arena Champion</span>
          </div>

          {/* Rank 3 (Bronze) */}
          <div className="podium-card podium-card-3">
            <div className="podium-medal" style={{ background: "rgba(251, 146, 60, 0.2)", color: "#fb923c" }}>
              🥉
            </div>
            <div className="user-avatar" style={{ width: "44px", height: "44px", fontSize: "15px", marginBottom: "10px" }}>
              {getInitials(topThree[2].name)}
            </div>
            <div className="podium-name">{topThree[2].name}</div>
            <div className="podium-xp">{topThree[2].xp} XP</div>
            <span className="arena-badge badge-coding">Rank #3</span>
          </div>
        </div>
      )}

      {/* Leaderboard Table */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#94a3b8" }}>
          <div className="auth-spinner" style={{ width: "32px", height: "32px", margin: "0 auto 12px auto" }} />
          <p>Loading rankings...</p>
        </div>
      ) : leaderboard.length === 0 ? (
        <div className="arena-card arena-empty-state">
          <Trophy size={48} className="arena-empty-icon" />
          <h2>No rankings found</h2>
          <p>No players matched your search criteria.</p>
        </div>
      ) : (
        <div className="arena-table-wrap">
          <table className="arena-table">
            <thead>
              <tr>
                <th style={{ width: "80px" }}>Rank</th>
                <th>Player</th>
                <th>Experience</th>
                <th>Solved</th>
                <th>Accuracy</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((player) => {
                const isMe = user?.name === player.name;
                return (
                  <tr
                    key={player.rank}
                    style={{
                      background: isMe ? "rgba(99, 102, 241, 0.12)" : "transparent",
                    }}
                  >
                    <td className="table-rank-cell">
                      {player.rank === 1 ? (
                        <span className="rank-gold">🥇 #1</span>
                      ) : player.rank === 2 ? (
                        <span className="rank-silver">🥈 #2</span>
                      ) : player.rank === 3 ? (
                        <span className="rank-bronze">🥉 #3</span>
                      ) : (
                        <span style={{ color: "#94a3b8" }}>#{player.rank}</span>
                      )}
                    </td>

                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div className="user-avatar" style={{ width: "32px", height: "32px", fontSize: "12px" }}>
                          {getInitials(player.name)}
                        </div>
                        <div>
                          <span style={{ fontWeight: 600, color: isMe ? "#a5b4fc" : "#f8fafc" }}>
                            {player.name}
                          </span>
                          {isMe && (
                            <span className="arena-badge badge-coding" style={{ marginLeft: "8px", fontSize: "0.65rem", padding: "2px 6px" }}>
                              YOU
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="arena-badge badge-xp">
                        <Zap size={12} color="#fbbf24" />
                        <span>{player.xp} XP</span>
                      </span>
                    </td>

                    <td style={{ color: "#e2e8f0", fontWeight: 600 }}>
                      {player.problemsSolved || 0}
                    </td>

                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{ width: "100px", height: "6px", background: "rgba(255,255,255,0.08)", borderRadius: "4px", overflow: "hidden" }}>
                          <div
                            style={{
                              width: `${player.accuracy || 0}%`,
                              height: "100%",
                              background:
                                (player.accuracy || 0) >= 70
                                  ? "#10b981"
                                  : (player.accuracy || 0) >= 40
                                  ? "#f59e0b"
                                  : "#f43f5e",
                              borderRadius: "4px",
                            }}
                          />
                        </div>
                        <span style={{ fontSize: "0.85rem", color: "#94a3b8", fontWeight: 600 }}>
                          {player.accuracy || 0}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      {!searchTerm && totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "24px" }}>
          <div style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
            Showing page {page} of {totalPages} ({totalUsers} total players)
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <button
              type="button"
              className="arena-btn arena-btn-secondary"
              style={{ padding: "8px 14px" }}
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft size={16} />
              <span>Previous</span>
            </button>

            <button
              type="button"
              className="arena-btn arena-btn-secondary"
              style={{ padding: "8px 14px" }}
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              <span>Next</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
