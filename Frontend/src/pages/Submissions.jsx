import { useState, useEffect } from "react";
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
} from "lucide-react";

const Submissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all"); // 'all' | 'accepted' | 'wrong'
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

  const filtered = submissions.filter((sub) => {
    if (filterStatus === "accepted") return sub.isCorrect;
    if (filterStatus === "wrong") return !sub.isCorrect;
    return true;
  });

  return (
    <div className="arena-page">
      {/* Header */}
      <div className="arena-header-banner">
        <div className="arena-title-wrap">
          <h1>
            <ListChecks size={28} color="#34d399" />
            <span>My Submission History</span>
          </h1>
          <p>Review all your previous code runs, quiz attempts, and earned XP.</p>
        </div>

        {/* Filter Pills */}
        <div className="arena-pill-group">
          <button
            type="button"
            className={`arena-pill-btn ${filterStatus === "all" ? "active" : ""}`}
            onClick={() => setFilterStatus("all")}
          >
            All ({submissions.length})
          </button>
          <button
            type="button"
            className={`arena-pill-btn ${filterStatus === "accepted" ? "active" : ""}`}
            onClick={() => setFilterStatus("accepted")}
          >
            Accepted ({submissions.filter((s) => s.isCorrect).length})
          </button>
          <button
            type="button"
            className={`arena-pill-btn ${filterStatus === "wrong" ? "active" : ""}`}
            onClick={() => setFilterStatus("wrong")}
          >
            Wrong ({submissions.filter((s) => !s.isCorrect).length})
          </button>
        </div>
      </div>

      {/* Submissions Table */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#94a3b8" }}>
          <div className="auth-spinner" style={{ width: "32px", height: "32px", margin: "0 auto 12px auto" }} />
          <p>Loading your submission history...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="arena-card arena-empty-state">
          <ListChecks size={48} className="arena-empty-icon" />
          <h2>No Submissions Found</h2>
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
                <th style={{ textAlign: "right" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((sub) => (
                <tr key={sub._id}>
                  <td>
                    {sub.challenge ? (
                      <Link
                        to={`/challenges/${sub.challenge._id}`}
                        style={{ color: "#f8fafc", fontWeight: 600, textDecoration: "none" }}
                      >
                        {sub.challenge.title}
                      </Link>
                    ) : (
                      <span style={{ color: "#94a3b8" }}>Challenge Unavailable</span>
                    )}
                  </td>
                  <td>
                    <span className={`arena-badge ${sub.type === "mcq" ? "badge-mcq" : "badge-coding"}`}>
                      {sub.type === "mcq" ? <HelpCircle size={12} /> : <Code2 size={12} />}
                      <span>{sub.type}</span>
                    </span>
                  </td>
                  <td>
                    <span style={{ color: "#a5b4fc", fontSize: "0.85rem", textTransform: "capitalize" }}>
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
                      <Zap size={12} color="#fbbf24" />
                      <span>+{sub.xpEarned || 0} XP</span>
                    </span>
                  </td>
                  <td style={{ color: "#94a3b8", fontSize: "0.85rem" }}>
                    {new Date(sub.createdAt).toLocaleString()}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <button
                      type="button"
                      className="arena-btn arena-btn-secondary"
                      style={{ padding: "6px 12px", fontSize: "0.8rem" }}
                      onClick={() => setSelectedSubmission(sub)}
                    >
                      <Eye size={14} />
                      <span>Inspect</span>
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
                <div style={{ fontSize: "0.82rem", color: "#94a3b8", marginTop: "4px" }}>
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

            <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
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
              <label className="auth-input-label" style={{ marginBottom: "8px" }}>
                {selectedSubmission.type === "coding" ? "Submitted Source Code:" : "Submitted Answer:"}
              </label>
              <pre
                style={{
                  background: "#090d16",
                  padding: "16px",
                  borderRadius: "12px",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  color: "#e2e8f0",
                  fontFamily: "monospace",
                  fontSize: "13.5px",
                  lineHeight: 1.6,
                  maxHeight: "360px",
                  overflowY: "auto",
                  whiteSpace: "pre-wrap",
                }}
              >
                {selectedSubmission.code || selectedSubmission.answer || "No code provided"}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Submissions;
