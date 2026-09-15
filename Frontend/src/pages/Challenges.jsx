import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import challengeService from "../services/challengeService";
import submissionService from "../services/submissionService";
import "../styles/Arena.css";
import {
  Swords,
  Search,
  Plus,
  Zap,
  Code2,
  HelpCircle,
  X,
  CheckCircle2,
  AlertCircle,
  Trash2,
} from "lucide-react";

const CATEGORIES = [
  "All",
  "Arrays",
  "Strings",
  "Algorithms",
  "Data Structures",
  "Dynamic Programming",
  "Math",
  "Recursion",
];

const DIFFICULTIES = ["All", "Easy", "Medium", "Hard"];
const TYPES = ["All", "Coding", "MCQ"];
const STATUSES = ["All", "Solved", "Unsolved"];

const Challenges = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [challenges, setChallenges] = useState([]);
  const [solvedIds, setSolvedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Admin Create Challenge Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState("");
  const [modalSuccess, setModalSuccess] = useState("");

  const [newChallenge, setNewChallenge] = useState({
    title: "",
    description: "",
    type: "coding", // 'coding' | 'mcq'
    category: "Arrays",
    difficulty: "easy",
    points: 20,
    // MCQ fields
    options: ["Option A", "Option B", "Option C", "Option D"],
    correctAnswer: "Option A",
    // Coding fields
    starterCode: `function solution(arr) {\n  // Write your code here\n  return arr;\n}`,
    functionName: "solution",
    testCases: [
      { input: "[1, 2, 3]", expectedOutput: "[1, 2, 3]" },
      { input: "[4, 5]", expectedOutput: "[4, 5]" },
    ],
  });

  // Fetch user solved submissions
  useEffect(() => {
    const fetchSolvedSubmissions = async () => {
      try {
        const res = await submissionService.getMySubmissions();
        if (res?.submissions) {
          const solvedSet = new Set(
            res.submissions
              .filter((sub) => sub.isCorrect)
              .map((sub) => (typeof sub.challenge === "object" ? sub.challenge?._id : sub.challenge))
          );
          setSolvedIds(solvedSet);
        }
      } catch (err) {
        console.warn("Could not fetch user submissions for solved status:", err);
      }
    };

    if (user) {
      fetchSolvedSubmissions();
    }
  }, [user]);

  const fetchChallenges = useCallback(async () => {
    setLoading(true);
    try {
      const data = await challengeService.getAllChallenges({
        search: searchTerm.trim(),
        category: selectedCategory === "All" ? "" : selectedCategory,
        difficulty: selectedDifficulty === "All" ? "" : selectedDifficulty.toLowerCase(),
      });
      if (data?.challenges) {
        let list = data.challenges;
        if (selectedType !== "All") {
          list = list.filter((c) => c.type?.toLowerCase() === selectedType.toLowerCase());
        }
        if (selectedStatus === "Solved") {
          list = list.filter((c) => solvedIds.has(c._id));
        } else if (selectedStatus === "Unsolved") {
          list = list.filter((c) => !solvedIds.has(c._id));
        }
        setChallenges(list);
      }
    } catch (err) {
      console.error("Error fetching challenges:", err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedCategory, selectedDifficulty, selectedType, selectedStatus, solvedIds]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchChallenges();
    }, 250);
    return () => clearTimeout(debounce);
  }, [fetchChallenges]);

  const handleCreateChallenge = async (e) => {
    e.preventDefault();
    setModalError("");
    setModalSuccess("");

    if (!newChallenge.title || !newChallenge.description) {
      setModalError("Title and description are required.");
      return;
    }

    setIsSubmitting(true);
    try {
      let payload = {
        title: newChallenge.title,
        description: newChallenge.description,
        type: newChallenge.type,
        category: newChallenge.category,
        difficulty: newChallenge.difficulty,
        points: Number(newChallenge.points) || 10,
      };

      if (newChallenge.type === "mcq") {
        payload.options = newChallenge.options.filter((opt) => opt.trim() !== "");
        payload.correctAnswer = newChallenge.correctAnswer;
      } else {
        payload.starterCode = newChallenge.starterCode;
        payload.functionName = newChallenge.functionName;
        payload.testCases = newChallenge.testCases.map((tc) => {
          let parsedInput = tc.input;
          let parsedExpected = tc.expectedOutput;
          try { parsedInput = JSON.parse(tc.input); } catch { /* keep string */ }
          try { parsedExpected = JSON.parse(tc.expectedOutput); } catch { /* keep string */ }
          return { input: parsedInput, expectedOutput: parsedExpected };
        });
      }

      const res = await challengeService.createChallenge(payload);
      if (res?.challenge) {
        setModalSuccess("Challenge created successfully!");
        setTimeout(() => {
          setIsModalOpen(false);
          setModalSuccess("");
          fetchChallenges();
        }, 1000);
      }
    } catch (err) {
      setModalError(err?.response?.data?.message || err.message || "Failed to create challenge.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteChallenge = async (e, challengeId) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this challenge?")) return;

    try {
      await challengeService.deleteChallenge(challengeId);
      fetchChallenges();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete challenge.");
    }
  };

  return (
    <div className="arena-page">
      {/* Header Banner */}
      <div className="arena-header-banner">
        <div className="arena-title-wrap">
          <h1>
            <Swords size={28} color="#818cf8" />
            <span>Coding Arena Challenges</span>
          </h1>
          <p>Sharpen your skills across data structures, algorithms, and technical trivia.</p>
        </div>

        {isAdmin && (
          <button
            type="button"
            className="arena-btn"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={18} />
            <span>Create Challenge</span>
          </button>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="arena-filter-bar">
        <div className="arena-search-box">
          <Search size={18} className="arena-search-icon" />
          <input
            type="text"
            className="arena-search-input"
            placeholder="Search challenges by title or keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Category Pills */}
        <div className="arena-pill-group">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`arena-pill-btn ${selectedCategory === cat ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Secondary Filter Row (Difficulty, Type, Status) */}
      <div style={{ display: "flex", gap: "18px", flexWrap: "wrap", marginBottom: "24px", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "0.82rem", color: "#64748b", fontWeight: 600 }}>DIFFICULTY:</span>
          {DIFFICULTIES.map((diff) => (
            <button
              key={diff}
              type="button"
              className={`arena-pill-btn ${selectedDifficulty === diff ? "active" : ""}`}
              onClick={() => setSelectedDifficulty(diff)}
            >
              {diff}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "0.82rem", color: "#64748b", fontWeight: 600 }}>TYPE:</span>
          {TYPES.map((type) => (
            <button
              key={type}
              type="button"
              className={`arena-pill-btn ${selectedType === type ? "active" : ""}`}
              onClick={() => setSelectedType(type)}
            >
              {type}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "0.82rem", color: "#64748b", fontWeight: 600 }}>STATUS:</span>
          {STATUSES.map((st) => (
            <button
              key={st}
              type="button"
              className={`arena-pill-btn ${selectedStatus === st ? "active" : ""}`}
              onClick={() => setSelectedStatus(st)}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Challenges Grid */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#94a3b8" }}>
          <div className="auth-spinner" style={{ width: "32px", height: "32px", margin: "0 auto 12px auto" }} />
          <p>Loading arena challenges...</p>
        </div>
      ) : challenges.length === 0 ? (
        <div className="arena-card arena-empty-state">
          <Swords size={48} className="arena-empty-icon" />
          <h2>No challenges found</h2>
          <p>Try adjusting your search query or filters.</p>
        </div>
      ) : (
        <div className="challenges-grid">
          {challenges.map((challenge) => {
            const isSolved = solvedIds.has(challenge._id);

            return (
              <div
                key={challenge._id}
                className="challenge-card"
                style={{
                  border: isSolved ? "1px solid rgba(16, 185, 129, 0.3)" : undefined,
                }}
              >
                <div>
                  <div className="challenge-card-top">
                    <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                      <span className={`arena-badge ${challenge.type === "mcq" ? "badge-mcq" : "badge-coding"}`}>
                        {challenge.type === "mcq" ? <HelpCircle size={12} /> : <Code2 size={12} />}
                        <span>{challenge.type}</span>
                      </span>

                      <span className={`arena-badge badge-${challenge.difficulty || "easy"}`}>
                        {challenge.difficulty}
                      </span>
                    </div>

                    {isSolved && (
                      <span
                        className="arena-badge badge-accepted"
                        style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "4px 8px" }}
                      >
                        <CheckCircle2 size={12} />
                        <span>SOLVED</span>
                      </span>
                    )}
                  </div>

                  <h3 className="challenge-card-title">{challenge.title}</h3>
                  <p className="challenge-card-desc">{challenge.description}</p>
                </div>

                <div className="challenge-card-footer">
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span className="arena-badge badge-xp">
                      <Zap size={12} color="#fbbf24" />
                      <span>+{challenge.points || 10} XP</span>
                    </span>
                    <span style={{ fontSize: "0.78rem", color: "#64748b" }}>
                      {challenge.category}
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    {isAdmin && (
                      <button
                        type="button"
                        className="arena-btn arena-btn-danger"
                        style={{ padding: "6px 10px" }}
                        onClick={(e) => handleDeleteChallenge(e, challenge._id)}
                        title="Delete Challenge"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}

                    <Link
                      to={`/challenges/${challenge._id}`}
                      className="arena-btn"
                      style={
                        isSolved
                          ? {
                              padding: "7px 16px",
                              fontSize: "0.85rem",
                              background: "rgba(16, 185, 129, 0.15)",
                              border: "1px solid rgba(16, 185, 129, 0.35)",
                              color: "#6ee7b7",
                              boxShadow: "none",
                            }
                          : { padding: "7px 16px", fontSize: "0.85rem" }
                      }
                    >
                      {isSolved
                        ? "Solve Again"
                        : challenge.type === "mcq"
                        ? "Take Quiz"
                        : "Solve Code"}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Admin Create Challenge Modal */}
      {isModalOpen && (
        <div className="arena-modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="arena-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Arena Challenge</h2>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            {modalError && (
              <div className="auth-alert auth-alert-error" style={{ marginBottom: "16px" }}>
                <AlertCircle size={18} />
                <span>{modalError}</span>
              </div>
            )}

            {modalSuccess && (
              <div className="auth-alert auth-alert-success" style={{ marginBottom: "16px" }}>
                <CheckCircle2 size={18} />
                <span>{modalSuccess}</span>
              </div>
            )}

            <form onSubmit={handleCreateChallenge} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label className="auth-input-label">Challenge Title</label>
                <input
                  type="text"
                  className="auth-input"
                  style={{ paddingLeft: "14px" }}
                  placeholder="e.g. Reverse an Array"
                  value={newChallenge.title}
                  onChange={(e) => setNewChallenge({ ...newChallenge, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="auth-input-label">Description / Problem Statement</label>
                <textarea
                  className="auth-input"
                  style={{ minHeight: "90px", paddingLeft: "14px", resize: "vertical" }}
                  placeholder="Explain the problem requirements, constraints, and example cases..."
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
                    style={{ paddingLeft: "14px" }}
                    value={newChallenge.type}
                    onChange={(e) => setNewChallenge({ ...newChallenge, type: e.target.value })}
                  >
                    <option value="coding">Coding Challenge</option>
                    <option value="mcq">MCQ Quiz</option>
                  </select>
                </div>

                <div>
                  <label className="auth-input-label">Difficulty</label>
                  <select
                    className="auth-input"
                    style={{ paddingLeft: "14px" }}
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
                    style={{ paddingLeft: "14px" }}
                    value={newChallenge.points}
                    onChange={(e) => setNewChallenge({ ...newChallenge, points: e.target.value })}
                    min="5"
                    max="500"
                    required
                  />
                </div>
              </div>

              {/* MCQ Specific Fields */}
              {newChallenge.type === "mcq" ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <label className="auth-input-label">Options (at least 2)</label>
                  {newChallenge.options.map((opt, idx) => (
                    <input
                      key={idx}
                      type="text"
                      className="auth-input"
                      style={{ paddingLeft: "14px" }}
                      placeholder={`Option ${idx + 1}`}
                      value={opt}
                      onChange={(e) => {
                        const updated = [...newChallenge.options];
                        updated[idx] = e.target.value;
                        setNewChallenge({ ...newChallenge, options: updated });
                      }}
                      required
                    />
                  ))}
                  <div>
                    <label className="auth-input-label">Correct Answer</label>
                    <select
                      className="auth-input"
                      style={{ paddingLeft: "14px" }}
                      value={newChallenge.correctAnswer}
                      onChange={(e) => setNewChallenge({ ...newChallenge, correctAnswer: e.target.value })}
                    >
                      {newChallenge.options.map((opt, idx) => (
                        <option key={idx} value={opt}>
                          {opt || `Option ${idx + 1}`}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : (
                /* Coding Specific Fields */
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
                      style={{ minHeight: "100px", paddingLeft: "14px", fontFamily: "monospace", fontSize: "13px" }}
                      value={newChallenge.starterCode}
                      onChange={(e) => setNewChallenge({ ...newChallenge, starterCode: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="auth-input-label">Test Case 1 (Input & Expected Output in JSON format)</label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                      <input
                        type="text"
                        className="auth-input"
                        style={{ paddingLeft: "14px" }}
                        placeholder='Input: [1, 2, 3]'
                        value={newChallenge.testCases[0]?.input || ""}
                        onChange={(e) => {
                          const updated = [...newChallenge.testCases];
                          updated[0] = { ...updated[0], input: e.target.value };
                          setNewChallenge({ ...newChallenge, testCases: updated });
                        }}
                        required
                      />
                      <input
                        type="text"
                        className="auth-input"
                        style={{ paddingLeft: "14px" }}
                        placeholder='Expected: [1, 2, 3]'
                        value={newChallenge.testCases[0]?.expectedOutput || ""}
                        onChange={(e) => {
                          const updated = [...newChallenge.testCases];
                          updated[0] = { ...updated[0], expectedOutput: e.target.value };
                          setNewChallenge({ ...newChallenge, testCases: updated });
                        }}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="arena-btn"
                style={{ marginTop: "12px", width: "100%" }}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating Challenge..." : "Publish Challenge to Arena"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Challenges;
