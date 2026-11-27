import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import submissionService from "../services/submissionService";
import "../styles/Arena.css";
import {
  ListChecks,
  CheckCircle2,
  XCircle,
  Code2,
  HelpCircle,
  Eye,
  X,
  Zap,
  Search,
  Check,
  TrendingUp,
} from "lucide-react";

const Submissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all"); // 'all' | 'accepted' | 'wrong'
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchSubmissions = async () => {
      setLoading(true);
      try {
        const data = await submissionService.getMySubmissions();
        if (isMounted && data?.submissions) {
          setSubmissions(data.submissions);
        }
      } catch (err) {
        console.error("Error fetching submissions:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchSubmissions();

    return () => {
      isMounted = false;
    };
  }, []);

  // Summary Metrics
  const totalCount = submissions.length;
  const acceptedCount = useMemo(() => submissions.filter((s) => s.isCorrect).length, [submissions]);
  const rejectedCount = totalCount - acceptedCount;
  const successRate = totalCount > 0 ? Math.round((acceptedCount / totalCount) * 100) : 0;

  const filtered = useMemo(() => {
    return submissions.filter((sub) => {
      if (filterStatus === "accepted" && !sub.isCorrect) return false;
      if (filterStatus === "wrong" && sub.isCorrect) return false;
      if (searchTerm.trim()) {
        const title = sub.challenge?.title || "";
        if (!title.toLowerCase().includes(searchTerm.toLowerCase().trim())) {
          return false;
        }
      }
      return true;
    });
  }, [submissions, filterStatus, searchTerm]);

  return (
    <div className="arena-page">
      {/* Header */}
      <div className="arena-header-banner">
        <div className="arena-title-wrap">
          <h1>
            <ListChecks size={28} color="#059669" />
            <span>My Submission History</span>
          </h1>
          <p>Review all your previous code runs, quiz attempts, and earned XP telemetry.</p>
        </div>

        {/* Search & Filter Group */}
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
          <div className="arena-search-box" style={{ maxWidth: "260px" }}>
            <Search size={16} className="arena-search-icon" />
            <input
              type="text"
              className="arena-search-input"
              placeholder="Search by problem..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="arena-pill-group">
            <button
              type="button"
              className={`arena-pill-btn ${filterStatus === "all" ? "active" : ""}`}
              onClick={() => setFilterStatus("all")}
            >
              All ({totalCount})
            </button>
            <button
              type="button"
              className={`arena-pill-btn ${filterStatus === "accepted" ? "active" : ""}`}
              onClick={() => setFilterStatus("accepted")}
            >
              Accepted ({acceptedCount})
            </button>
            <button
              type="button"
              className={`arena-pill-btn ${filterStatus === "wrong" ? "active" : ""}`}
              onClick={() => setFilterStatus("wrong")}
            >
              Wrong ({rejectedCount})
            </button>
          </div>
        </div>
      </div>

      {/* 4 Telemetry Stat Cards */}
      <div className="arena-stats-grid" style={{ marginBottom: "28px" }}>
        <div className="arena-stat-card">
          <div className="stat-icon-wrap stat-icon-cyan">
            <ListChecks size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-val">{totalCount}</div>
            <div className="stat-label">Total Submissions</div>
          </div>
        </div>

        <div className="arena-stat-card">
          <div className="stat-icon-wrap stat-icon-emerald">
            <CheckCircle2 size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-val">{acceptedCount}</div>
            <div className="stat-label">Accepted Solutions</div>
          </div>
        </div>

        <div className="arena-stat-card">
          <div className="stat-icon-wrap stat-icon-rose">
            <XCircle size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-val">{rejectedCount}</div>
            <div className="stat-label">Rejected Attempts</div>
          </div>
        </div>

        <div className="arena-stat-card">
          <div className="stat-icon-wrap stat-icon-purple">
            <TrendingUp size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-val">{successRate}%</div>
            <div className="stat-label">Success Rate</div>
          </div>
        </div>
      </div>

      {/* Submissions Table */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#64748b" }}>
          <div className="auth-spinner" style={{ width: "32px", height: "32px", margin: "0 auto 12px auto" }} />
          <p>Loading your submission history...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="arena-card arena-empty-state">
          <ListChecks size={48} className="arena-empty-icon" />
          <h2 style={{ color: "#0f172a" }}>No Submissions Found</h2>
          <p>You haven&apos;t made any submissions matching this filter yet.</p>
          <Link to="/challenges" className="arena-btn" style={{ marginTop: "16px" }}>
            <span>Browse Challenges</span>
          </Link>
        </div>
      ) : (
        <div className="arena-table-wrap">
          <table className="arena-table">
            <thead>
              <tr>
                <th>Challenge</th>
                <th>Type</th>
                <th>Language</th>
                <th>Status</th>
                <th>XP Earned</th>
                <th>Submitted At</th>
                <th style={{ textAlign: "right" }}>Inspect</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((sub) => (
                <tr key={sub._id}>
                  <td>
                    {sub.challenge ? (
                      <Link
                        to={`/challenges/${sub.challenge._id}`}
                        style={{ color: "#0f172a", fontWeight: 700, textDecoration: "none" }}
                      >
                        {sub.challenge.title}
                      </Link>
                    ) : (
                      <span style={{ color: "#64748b" }}>Challenge Unavailable</span>
                    )}
                  </td>
                  <td>
                    <span className={`arena-badge ${sub.type === "mcq" ? "badge-mcq" : "badge-coding"}`}>
                      {sub.type === "mcq" ? <HelpCircle size={12} /> : <Code2 size={12} />}
                      <span>{sub.type}</span>
                    </span>
                  </td>
                  <td>
                    <span style={{ color: "#6366f1", fontSize: "0.85rem", textTransform: "capitalize", fontWeight: 600 }}>
                      {sub.language || "mcq"}
                    </span>
                  </td>
                  <td>
                    {sub.isCorrect ? (
                      <span className="arena-badge badge-accepted">
                        <CheckCircle2 size={12} />
                        <span>Accepted</span>
                      </span>
                    ) : (
                      <span className="arena-badge badge-wrong">
                        <XCircle size={12} />
                        <span>Wrong Answer</span>
                      </span>
                    )}
                  </td>
                  <td>
                    <span className="arena-badge badge-xp">
                      <Zap size={12} color="#d97706" />
                      <span>+{sub.xpEarned || 0} XP</span>
                    </span>
                  </td>
                  <td style={{ color: "#64748b", fontSize: "0.85rem" }}>
                    {new Date(sub.createdAt).toLocaleString()}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <button
                      type="button"
                      className="arena-btn arena-btn-secondary"
                      style={{ padding: "6px 14px", fontSize: "0.82rem" }}
                      onClick={() => setSelectedSubmission(sub)}
                    >
                      <Eye size={14} />
                      <span>View Code</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Inspect Code Modal */}
      {selectedSubmission && (
        <div className="arena-modal-backdrop" onClick={() => setSelectedSubmission(null)}>
          <div className="arena-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "720px" }}>
            <div className="modal-header">
              <div>
                <h2>{selectedSubmission.challenge?.title || "Submission Details"}</h2>
                <div style={{ fontSize: "0.82rem", color: "#64748b", marginTop: "4px" }}>
                  Submitted on {new Date(selectedSubmission.createdAt).toLocaleString()}
                </div>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setSelectedSubmission(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: "flex", gap: "10px", marginBottom: "16px", flexWrap: "wrap" }}>
              <span className={`arena-badge ${selectedSubmission.isCorrect ? "badge-accepted" : "badge-wrong"}`}>
                {selectedSubmission.isCorrect ? "Accepted" : "Wrong Answer"}
              </span>
              <span className="arena-badge badge-xp">
                +{selectedSubmission.xpEarned || 0} XP
              </span>
              <span className="arena-badge badge-coding">
                {selectedSubmission.language || selectedSubmission.type}
              </span>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#0f172a", marginBottom: "8px" }}>
                {selectedSubmission.type === "coding" ? "Submitted Source Code:" : "Submitted Quiz Answer:"}
              </label>
              <pre
                style={{
                  background: "#090d16",
                  padding: "18px",
                  borderRadius: "14px",
                  border: "1px solid rgba(226, 232, 240, 0.4)",
                  color: "#f1f5f9",
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                  fontSize: "13.5px",
                  lineHeight: 1.6,
                  maxHeight: "360px",
                  overflowY: "auto",
                  whiteSpace: "pre-wrap",
                  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.25)",
                }}
              >
                {selectedSubmission.code || selectedSubmission.answer || "No code recorded"}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Submissions;
