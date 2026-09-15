import { useState, useEffect, useCallback } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import challengeService from "../services/challengeService";
import "../styles/Arena.css";
import {
  Code2,
  Search,
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Zap,
  HelpCircle,
} from "lucide-react";

const CATEGORIES = [
  "Arrays",
  "Strings",
  "Algorithms",
  "Data Structures",
  "Dynamic Programming",
  "Math",
  "Recursion",
];

const AdminChallenges = () => {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [actionSuccess, setActionSuccess] = useState("");
  const [actionError, setActionError] = useState("");

  const [newChallenge, setNewChallenge] = useState({
    title: "",
    description: "",
    difficulty: "easy",
    type: "coding",
    category: "Arrays",
    points: 10,
    mcqOptions: ["", "", "", ""],
    correctMcqAnswer: 0,
    starterCode: "// Write your solution here\nfunction solution() {\n  \n}",
    functionName: "solution",
    testCasesJson: '[\n  {\n    "input": [1, 2],\n    "expectedOutput": 3\n  }\n]',
  });

  const isAdmin = user?.role === "admin";

  const fetchChallenges = useCallback(async () => {
    setLoading(true);
    try {
      const data = await challengeService.getAllChallenges({
        search: searchTerm,
        category: categoryFilter,
        difficulty: difficultyFilter,
      });
      if (data?.challenges) {
        setChallenges(data.challenges);
      }
    } catch (err) {
      console.error("Error fetching challenges:", err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, categoryFilter, difficultyFilter]);

  useEffect(() => {
    if (!isAdmin) return;
    const debounce = setTimeout(() => {
      fetchChallenges();
    }, 250);
    return () => clearTimeout(debounce);
  }, [fetchChallenges, isAdmin]);

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleDelete = async (challenge) => {
    if (!window.confirm(`Are you sure you want to delete challenge "${challenge.title}"?`)) {
      return;
    }
    setActionSuccess("");
    setActionError("");
    try {
      await challengeService.deleteChallenge(challenge._id);
      setActionSuccess(`Deleted challenge "${challenge.title}" successfully.`);
      fetchChallenges();
    } catch (err) {
      setActionError(err?.response?.data?.message || "Failed to delete challenge.");
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setActionSuccess("");
    setActionError("");

    if (!newChallenge.title.trim() || !newChallenge.description.trim()) {
      setActionError("Title and description are required.");
      return;
    }

    setFormSubmitting(true);
    try {
      const payload = {
        title: newChallenge.title.trim(),
        description: newChallenge.description.trim(),
        difficulty: newChallenge.difficulty,
        type: newChallenge.type,
        category: newChallenge.category,
        points: Number(newChallenge.points),
      };

      if (newChallenge.type === "mcq") {
        payload.options = newChallenge.mcqOptions;
        payload.correctAnswer = newChallenge.mcqOptions[newChallenge.correctMcqAnswer];
      } else {
        payload.starterCode = newChallenge.starterCode;
        payload.functionName = newChallenge.functionName || "solution";
        try {
          payload.testCases = JSON.parse(newChallenge.testCasesJson);
        } catch {
          setActionError("Test cases must be a valid JSON array.");
          setFormSubmitting(false);
          return;
        }
      }

      await challengeService.createChallenge(payload);
      setActionSuccess(`Challenge "${newChallenge.title}" created successfully!`);
      setShowCreateModal(false);
      setNewChallenge({
        title: "",
        description: "",
        difficulty: "easy",
        type: "coding",
        category: "Arrays",
        points: 10,
        mcqOptions: ["", "", "", ""],
        correctMcqAnswer: 0,
        starterCode: "// Write your solution here\nfunction solution() {\n  \n}",
        functionName: "solution",
        testCasesJson: '[\n  {\n    "input": [1, 2],\n    "expectedOutput": 3\n  }\n]',
      });
      fetchChallenges();
    } catch (err) {
      setActionError(err?.response?.data?.message || "Failed to create challenge.");
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleOpenEditModal = (challenge) => {
    let mcqOpts = ["", "", "", ""];
    let correctIdx = 0;

    if (challenge.type === "mcq" && Array.isArray(challenge.options)) {
      mcqOpts = [...challenge.options];
      const foundIdx = mcqOpts.findIndex((opt) => opt === challenge.correctAnswer);
      if (foundIdx !== -1) correctIdx = foundIdx;
    }

    let tcJson = "[]";
    if (Array.isArray(challenge.testCases) && challenge.testCases.length > 0) {
      tcJson = JSON.stringify(challenge.testCases, null, 2);
    }

    setEditingChallenge({
      _id: challenge._id,
      title: challenge.title || "",
      description: challenge.description || "",
      difficulty: challenge.difficulty || "easy",
      type: challenge.type || "coding",
      category: challenge.category || "Arrays",
      points: challenge.points || 10,
      mcqOptions: mcqOpts,
      correctMcqAnswer: correctIdx,
      starterCode: challenge.starterCode || "// Write your solution here\nfunction solution() {\n  \n}",
      functionName: challenge.functionName || "solution",
      testCasesJson: tcJson,
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingChallenge) return;
    setActionSuccess("");
    setActionError("");

    setFormSubmitting(true);
    try {
      const payload = {
        title: editingChallenge.title.trim(),
        description: editingChallenge.description.trim(),
        difficulty: editingChallenge.difficulty,
        type: editingChallenge.type,
        category: editingChallenge.category,
        points: Number(editingChallenge.points),
      };

      if (editingChallenge.type === "mcq") {
        payload.options = editingChallenge.mcqOptions;
        payload.correctAnswer = editingChallenge.mcqOptions[editingChallenge.correctMcqAnswer];
      } else {
        payload.starterCode = editingChallenge.starterCode;
        payload.functionName = editingChallenge.functionName || "solution";
        try {
          payload.testCases = JSON.parse(editingChallenge.testCasesJson || "[]");
        } catch {
          setActionError("Test cases JSON format is invalid.");
          setFormSubmitting(false);
          return;
        }
      }

      await challengeService.updateChallenge(editingChallenge._id, payload);
      setActionSuccess(`Challenge "${editingChallenge.title}" updated successfully!`);
      setEditingChallenge(null);
      fetchChallenges();
    } catch (err) {
      setActionError(err?.response?.data?.message || "Failed to update challenge.");
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <div className="arena-page">
      {/* Header Banner */}
      <div className="arena-header-banner">
        <div className="arena-title-wrap">
          <h1>
            <Code2 size={28} color="#a855f7" />
            <span>Manage Challenges</span>
          </h1>
          <p>Create new algorithmic problems, edit test definitions, or manage problem sets.</p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            type="button"
            className="arena-btn"
            style={{ background: "linear-gradient(135deg, #a855f7 0%, #6366f1 100%)" }}
            onClick={() => setShowCreateModal(true)}
          >
            <Plus size={18} />
            <span>Create Challenge</span>
          </button>
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

      {/* Filter Controls Bar */}
      <div className="arena-card" style={{ marginBottom: "20px", padding: "16px" }}>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <div className="arena-search-box" style={{ flex: "1", minWidth: "220px" }}>
            <Search size={18} className="arena-search-icon" />
            <input
              type="text"
              className="arena-search-input"
              placeholder="Search challenges by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="auth-input"
            style={{ width: "160px", padding: "8px 12px", background: "rgba(15, 23, 42, 0.8)" }}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            className="auth-input"
            style={{ width: "140px", padding: "8px 12px", background: "rgba(15, 23, 42, 0.8)" }}
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
          >
            <option value="">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>

      {/* Challenges List Table */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#94a3b8" }}>
          <div className="auth-spinner" style={{ width: "32px", height: "32px", margin: "0 auto 12px auto" }} />
          <p>Loading challenges catalog...</p>
        </div>
      ) : challenges.length === 0 ? (
        <div className="arena-card arena-empty-state">
          <Code2 size={48} className="arena-empty-icon" />
          <h2>No challenges found</h2>
          <p>Try refining your search filter or click "Create Challenge" to add one.</p>
        </div>
      ) : (
        <div className="arena-table-wrap">
          <table className="arena-table">
            <thead>
              <tr>
                <th>Title & Description</th>
                <th>Type</th>
                <th>Category</th>
                <th>Difficulty</th>
                <th>Points</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {challenges.map((item) => (
                <tr key={item._id}>
                  <td>
                    <div style={{ fontWeight: 600, color: "#f8fafc", marginBottom: "4px" }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: "0.82rem", color: "#94a3b8", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {item.description}
                    </div>
                  </td>

                  <td>
                    <span className={`arena-badge ${item.type === "mcq" ? "badge-mcq" : "badge-coding"}`}>
                      {item.type === "mcq" ? <HelpCircle size={11} /> : <Code2 size={11} />}
                      <span>{item.type}</span>
                    </span>
                  </td>

                  <td style={{ color: "#e2e8f0" }}>{item.category || "General"}</td>

                  <td>
                    <span className={`arena-badge badge-${item.difficulty || "easy"}`}>
                      {item.difficulty}
                    </span>
                  </td>

                  <td>
                    <span className="arena-badge badge-xp">
                      <Zap size={11} color="#fbbf24" />
                      <span>+{item.points || 10} XP</span>
                    </span>
                  </td>

                  <td style={{ textAlign: "right" }}>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                      <Link
                        to={`/challenges/${item._id}`}
                        className="arena-btn arena-btn-secondary"
                        style={{ padding: "5px 10px", fontSize: "0.78rem" }}
                      >
                        View
                      </Link>
                      <button
                        type="button"
                        className="arena-btn"
                        style={{ padding: "5px 10px", fontSize: "0.78rem", background: "linear-gradient(135deg, #a855f7 0%, #6366f1 100%)" }}
                        onClick={() => handleOpenEditModal(item)}
                        title="Edit Challenge"
                      >
                        <Edit3 size={13} />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        className="arena-btn arena-btn-danger"
                        style={{ padding: "5px 10px" }}
                        onClick={() => handleDelete(item)}
                        title="Delete Challenge"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal: Create New Challenge */}
      {showCreateModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background: "rgba(15, 23, 42, 0.85)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            className="arena-card"
            style={{
              maxWidth: "600px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              position: "relative",
              padding: "28px",
            }}
          >
            <button
              type="button"
              style={{
                position: "absolute",
                top: "18px",
                right: "18px",
                background: "transparent",
                border: "none",
                color: "#94a3b8",
                cursor: "pointer",
              }}
              onClick={() => setShowCreateModal(false)}
            >
              <X size={20} />
            </button>

            <h2 style={{ margin: "0 0 18px 0", color: "#f8fafc", fontSize: "1.3rem", fontWeight: 700 }}>
              Create New Arena Challenge
            </h2>

            <form onSubmit={handleCreateSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label className="auth-input-label">Challenge Title</label>
                <input
                  type="text"
                  className="auth-input"
                  style={{ paddingLeft: "14px" }}
                  placeholder="e.g. Reverse a Linked List"
                  value={newChallenge.title}
                  onChange={(e) => setNewChallenge({ ...newChallenge, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="auth-input-label">Description</label>
                <textarea
                  className="auth-input"
                  style={{ paddingLeft: "14px", height: "80px", fontFamily: "inherit" }}
                  placeholder="Explain the problem requirements..."
                  value={newChallenge.description}
                  onChange={(e) => setNewChallenge({ ...newChallenge, description: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                <div>
                  <label className="auth-input-label">Type</label>
                  <select
                    className="auth-input"
                    style={{ paddingLeft: "10px" }}
                    value={newChallenge.type}
                    onChange={(e) => setNewChallenge({ ...newChallenge, type: e.target.value })}
                  >
                    <option value="coding">Coding</option>
                    <option value="mcq">MCQ</option>
                  </select>
                </div>

                <div>
                  <label className="auth-input-label">Difficulty</label>
                  <select
                    className="auth-input"
                    style={{ paddingLeft: "10px" }}
                    value={newChallenge.difficulty}
                    onChange={(e) => setNewChallenge({ ...newChallenge, difficulty: e.target.value })}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="auth-input-label">Points (XP)</label>
                  <input
                    type="number"
                    className="auth-input"
                    style={{ paddingLeft: "10px" }}
                    value={newChallenge.points}
                    onChange={(e) => setNewChallenge({ ...newChallenge, points: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="auth-input-label">Category</label>
                <select
                  className="auth-input"
                  style={{ paddingLeft: "10px" }}
                  value={newChallenge.category}
                  onChange={(e) => setNewChallenge({ ...newChallenge, category: e.target.value })}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {newChallenge.type === "mcq" ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label className="auth-input-label">MCQ Options & Correct Answer</label>
                  {newChallenge.mcqOptions.map((opt, idx) => (
                    <div key={idx} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <input
                        type="radio"
                        name="correctAnswer"
                        checked={newChallenge.correctMcqAnswer === idx}
                        onChange={() => setNewChallenge({ ...newChallenge, correctMcqAnswer: idx })}
                      />
                      <input
                        type="text"
                        className="auth-input"
                        style={{ paddingLeft: "10px" }}
                        placeholder={`Option ${idx + 1}`}
                        value={opt}
                        onChange={(e) => {
                          const updated = [...newChallenge.mcqOptions];
                          updated[idx] = e.target.value;
                          setNewChallenge({ ...newChallenge, mcqOptions: updated });
                        }}
                        required
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div>
                    <label className="auth-input-label">Function Name</label>
                    <input
                      type="text"
                      className="auth-input"
                      style={{ paddingLeft: "14px" }}
                      placeholder="e.g. solution"
                      value={newChallenge.functionName}
                      onChange={(e) => setNewChallenge({ ...newChallenge, functionName: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="auth-input-label">Starter Code</label>
                    <textarea
                      className="auth-input"
                      style={{ paddingLeft: "14px", height: "90px", fontFamily: "monospace", fontSize: "0.85rem" }}
                      value={newChallenge.starterCode}
                      onChange={(e) => setNewChallenge({ ...newChallenge, starterCode: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="auth-input-label">Test Cases (JSON format)</label>
                    <textarea
                      className="auth-input"
                      style={{ paddingLeft: "14px", height: "100px", fontFamily: "monospace", fontSize: "0.82rem" }}
                      placeholder='[{"input": [1, 2], "expectedOutput": 3}]'
                      value={newChallenge.testCasesJson}
                      onChange={(e) => setNewChallenge({ ...newChallenge, testCasesJson: e.target.value })}
                      required
                    />
                  </div>
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
                <button
                  type="button"
                  className="arena-btn arena-btn-secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="arena-btn"
                  disabled={formSubmitting}
                >
                  {formSubmitting ? "Creating..." : "Save Challenge"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Challenge */}
      {editingChallenge && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background: "rgba(15, 23, 42, 0.85)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            className="arena-card"
            style={{
              maxWidth: "600px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              position: "relative",
              padding: "28px",
            }}
          >
            <button
              type="button"
              style={{
                position: "absolute",
                top: "18px",
                right: "18px",
                background: "transparent",
                border: "none",
                color: "#94a3b8",
                cursor: "pointer",
              }}
              onClick={() => setEditingChallenge(null)}
            >
              <X size={20} />
            </button>

            <h2 style={{ margin: "0 0 18px 0", color: "#f8fafc", fontSize: "1.3rem", fontWeight: 700 }}>
              Edit Challenge: {editingChallenge.title}
            </h2>

            <form onSubmit={handleEditSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label className="auth-input-label">Challenge Title</label>
                <input
                  type="text"
                  className="auth-input"
                  style={{ paddingLeft: "14px" }}
                  value={editingChallenge.title}
                  onChange={(e) => setEditingChallenge({ ...editingChallenge, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="auth-input-label">Description</label>
                <textarea
                  className="auth-input"
                  style={{ paddingLeft: "14px", height: "80px", fontFamily: "inherit" }}
                  value={editingChallenge.description}
                  onChange={(e) => setEditingChallenge({ ...editingChallenge, description: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                <div>
                  <label className="auth-input-label">Type</label>
                  <select
                    className="auth-input"
                    style={{ paddingLeft: "10px" }}
                    value={editingChallenge.type}
                    onChange={(e) => setEditingChallenge({ ...editingChallenge, type: e.target.value })}
                  >
                    <option value="coding">Coding</option>
                    <option value="mcq">MCQ</option>
                  </select>
                </div>

                <div>
                  <label className="auth-input-label">Difficulty</label>
                  <select
                    className="auth-input"
                    style={{ paddingLeft: "10px" }}
                    value={editingChallenge.difficulty}
                    onChange={(e) => setEditingChallenge({ ...editingChallenge, difficulty: e.target.value })}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="auth-input-label">Points (XP)</label>
                  <input
                    type="number"
                    className="auth-input"
                    style={{ paddingLeft: "10px" }}
                    value={editingChallenge.points}
                    onChange={(e) => setEditingChallenge({ ...editingChallenge, points: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="auth-input-label">Category</label>
                <select
                  className="auth-input"
                  style={{ paddingLeft: "10px" }}
                  value={editingChallenge.category}
                  onChange={(e) => setEditingChallenge({ ...editingChallenge, category: e.target.value })}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {editingChallenge.type === "mcq" ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label className="auth-input-label">MCQ Options & Correct Answer</label>
                  {editingChallenge.mcqOptions.map((opt, idx) => (
                    <div key={idx} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <input
                        type="radio"
                        name="editCorrectAnswer"
                        checked={editingChallenge.correctMcqAnswer === idx}
                        onChange={() => setEditingChallenge({ ...editingChallenge, correctMcqAnswer: idx })}
                      />
                      <input
                        type="text"
                        className="auth-input"
                        style={{ paddingLeft: "10px" }}
                        placeholder={`Option ${idx + 1}`}
                        value={opt}
                        onChange={(e) => {
                          const updated = [...editingChallenge.mcqOptions];
                          updated[idx] = e.target.value;
                          setEditingChallenge({ ...editingChallenge, mcqOptions: updated });
                        }}
                        required
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div>
                    <label className="auth-input-label">Function Name</label>
                    <input
                      type="text"
                      className="auth-input"
                      style={{ paddingLeft: "14px" }}
                      placeholder="e.g. solution"
                      value={editingChallenge.functionName}
                      onChange={(e) => setEditingChallenge({ ...editingChallenge, functionName: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="auth-input-label">Starter Code</label>
                    <textarea
                      className="auth-input"
                      style={{ paddingLeft: "14px", height: "90px", fontFamily: "monospace", fontSize: "0.85rem" }}
                      value={editingChallenge.starterCode}
                      onChange={(e) => setEditingChallenge({ ...editingChallenge, starterCode: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="auth-input-label">Test Cases (JSON format)</label>
                    <textarea
                      className="auth-input"
                      style={{ paddingLeft: "14px", height: "100px", fontFamily: "monospace", fontSize: "0.82rem" }}
                      placeholder='[{"input": [1, 2], "expectedOutput": 3}]'
                      value={editingChallenge.testCasesJson}
                      onChange={(e) => setEditingChallenge({ ...editingChallenge, testCasesJson: e.target.value })}
                      required
                    />
                  </div>
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
                <button
                  type="button"
                  className="arena-btn arena-btn-secondary"
                  onClick={() => setEditingChallenge(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="arena-btn"
                  disabled={formSubmitting}
                >
                  {formSubmitting ? "Updating..." : "Update Challenge"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminChallenges;
