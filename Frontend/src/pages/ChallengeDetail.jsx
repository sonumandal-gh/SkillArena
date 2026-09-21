import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import challengeService from "../services/challengeService";
import submissionService from "../services/submissionService";
import "../styles/Arena.css";
import {
  ArrowLeft,
  Zap,
  Play,
  CheckCircle2,
  AlertCircle,
  Code2,
  HelpCircle,
  RotateCcw,
  Sparkles,
  XCircle,
} from "lucide-react";

const ChallengeDetail = () => {
  const { id } = useParams();
  const { refreshUser } = useAuth();

  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // MCQ state
  const [selectedOption, setSelectedOption] = useState("");
  const [mcqSubmitting, setMcqSubmitting] = useState(false);
  const [mcqResult, setMcqResult] = useState(null);

  // Coding state
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [codeRunning, setCodeRunning] = useState(false);
  const [codeSubmitting, setCodeSubmitting] = useState(false);
  const [codeResult, setCodeResult] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchChallenge = async () => {
      setLoading(true);
      try {
        const data = await challengeService.getChallengeById(id);
        if (isMounted && data?.challenge) {
          setChallenge(data.challenge);
          if (data.challenge.type === "coding") {
            setCode(data.challenge.starterCode || "// Write your code here");
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err?.response?.data?.message || "Failed to load challenge details.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchChallenge();

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Handle MCQ Answer Submission
  const handleMcqSubmit = async () => {
    if (!selectedOption) return;
    setMcqSubmitting(true);
    setMcqResult(null);

    try {
      const res = await submissionService.submitAnswer({
        challengeId: id,
        answer: selectedOption,
      });

      setMcqResult(res);
      refreshUser();
    } catch (err) {
      setMcqResult({
        error: true,
        message: err?.response?.data?.message || "Failed to submit answer.",
      });
    } finally {
      setMcqSubmitting(false);
    }
  };

  // 1. Run Code (Dry Run Test Cases)
  const handleRunCode = async () => {
    if (!code.trim()) return;
    setCodeRunning(true);
    setCodeResult(null);

    try {
      const res = await submissionService.runCode({
        challengeId: id,
        code,
        language,
      });

      setCodeResult({ ...res, isRunOnly: true });
    } catch (err) {
      setCodeResult({
        error: true,
        isRunOnly: true,
        message: err?.response?.data?.message || "Dry run execution failed.",
      });
    } finally {
      setCodeRunning(false);
    }
  };

  // 2. Submit Code Solution (Records Submission & Awards XP)
  const handleCodeSubmit = async () => {
    if (!code.trim()) return;
    setCodeSubmitting(true);
    setCodeResult(null);

    try {
      const res = await submissionService.submitAnswer({
        challengeId: id,
        code,
        language,
      });

      setCodeResult({ ...res, isRunOnly: false });
      refreshUser();
    } catch (err) {
      setCodeResult({
        error: true,
        isRunOnly: false,
        message: err?.response?.data?.message || "Submission failed. Please try again.",
      });
    } finally {
      setCodeSubmitting(false);
    }
  };

  const handleResetCode = () => {
    if (challenge?.starterCode) {
      setCode(challenge.starterCode);
    }
  };

  // Smart Editor Keyboard Handler (Tab, Auto-close brackets/quotes, Auto-indentation)
  const handleKeyDown = (e) => {
    const textarea = e.target;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const val = code;

    const pairs = {
      "{": "}",
      "(": ")",
      "[": "]",
      '"': '"',
      "'": "'",
      "`": "`",
    };

    // Auto-close brackets/quotes
    if (pairs[e.key] && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      const openChar = e.key;
      const closeChar = pairs[e.key];
      const selectedText = val.substring(start, end);
      const updated = val.substring(0, start) + openChar + selectedText + closeChar + val.substring(end);
      setCode(updated);

      setTimeout(() => {
        if (textarea) {
          textarea.selectionStart = start + 1;
          textarea.selectionEnd = start + 1 + selectedText.length;
        }
      }, 0);
      return;
    }

    // Tab key -> Insert 2 spaces
    if (e.key === "Tab") {
      e.preventDefault();
      const updatedCode = val.substring(0, start) + "  " + val.substring(end);
      setCode(updatedCode);
      setTimeout(() => {
        if (textarea) {
          textarea.selectionStart = textarea.selectionEnd = start + 2;
        }
      }, 0);
      return;
    }

    // Enter key -> Smart Auto-Indentation
    if (e.key === "Enter") {
      const lineStart = val.lastIndexOf("\n", start - 1) + 1;
      const currentLine = val.substring(lineStart, start);
      const indentMatch = currentLine.match(/^\s*/);
      let indent = indentMatch ? indentMatch[0] : "";

      const lastChar = val.substring(start - 1, start);
      const nextChar = val.substring(start, start + 1);

      if (lastChar === "{" || lastChar === "(" || lastChar === "[") {
        e.preventDefault();
        const extraIndent = "  ";
        if (pairs[lastChar] === nextChar) {
          const inserted = "\n" + indent + extraIndent + "\n" + indent;
          const updated = val.substring(0, start) + inserted + val.substring(end);
          setCode(updated);
          setTimeout(() => {
            if (textarea) {
              textarea.selectionStart = textarea.selectionEnd = start + 1 + indent.length + extraIndent.length;
            }
          }, 0);
        } else {
          const inserted = "\n" + indent + extraIndent;
          const updated = val.substring(0, start) + inserted + val.substring(end);
          setCode(updated);
          setTimeout(() => {
            if (textarea) {
              textarea.selectionStart = textarea.selectionEnd = start + inserted.length;
            }
          }, 0);
        }
      } else if (indent) {
        e.preventDefault();
        const inserted = "\n" + indent;
        const updated = val.substring(0, start) + inserted + val.substring(end);
        setCode(updated);
        setTimeout(() => {
          if (textarea) {
            textarea.selectionStart = textarea.selectionEnd = start + inserted.length;
          }
        }, 0);
      }
      return;
    }

    // Shortcuts: Ctrl+Enter (Run Code), Ctrl+Shift+Enter (Submit Solution)
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      if (e.shiftKey) {
        handleCodeSubmit();
      } else {
        handleRunCode();
      }
    }
  };

  if (loading) {
    return (
      <div className="arena-page" style={{ textAlign: "center", padding: "80px 20px" }}>
        <div className="auth-spinner" style={{ width: "36px", height: "36px", margin: "0 auto 16px auto" }} />
        <p style={{ color: "#94a3b8" }}>Loading arena workspace...</p>
      </div>
    );
  }

  if (error || !challenge) {
    return (
      <div className="arena-page">
        <div className="arena-card arena-empty-state">
          <AlertCircle size={48} color="#f43f5e" style={{ margin: "0 auto 12px auto" }} />
          <h2>Challenge Not Found</h2>
          <p>{error || "Could not find the requested challenge."}</p>
          <Link to="/challenges" className="arena-btn" style={{ marginTop: "16px" }}>
            <ArrowLeft size={16} />
            <span>Back to Challenges</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="arena-page">
      {/* Top Breadcrumb & Actions */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <Link to="/challenges" style={{ color: "#94a3b8", textDecoration: "none", display: "flex", alignItems: "center", gap: "6px", fontSize: "0.9rem", fontWeight: 500 }}>
          <ArrowLeft size={16} />
          <span>Back to Challenges</span>
        </Link>

        <div style={{ display: "flex", gap: "10px" }}>
          <span className={`arena-badge ${challenge.type === "mcq" ? "badge-mcq" : "badge-coding"}`}>
            {challenge.type === "mcq" ? <HelpCircle size={12} /> : <Code2 size={12} />}
            <span>{challenge.type}</span>
          </span>
          <span className={`arena-badge badge-${challenge.difficulty || "easy"}`}>
            {challenge.difficulty}
          </span>
          <span className="arena-badge badge-xp">
            <Zap size={12} color="#fbbf24" />
            <span>+{challenge.points || 10} XP</span>
          </span>
        </div>
      </div>

      {/* MCQ CHALLENGE WORKSPACE */}
      {challenge.type === "mcq" ? (
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div className="arena-card">
            <div style={{ marginBottom: "20px" }}>
              <div style={{ fontSize: "0.82rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", marginBottom: "6px" }}>
                {challenge.category} • MULTIPLE CHOICE QUIZ
              </div>
              <h1 style={{ margin: "0 0 14px 0", fontSize: "1.65rem", color: "#f8fafc", fontWeight: 800 }}>
                {challenge.title}
              </h1>
              <p style={{ margin: 0, color: "#cbd5e1", fontSize: "1.05rem", lineHeight: 1.6 }}>
                {challenge.description}
              </p>
            </div>

            {/* Options List */}
            <div className="mcq-options-list">
              {challenge.options?.map((option, index) => {
                const optionKey = String.fromCharCode(65 + index);
                const isSelected = selectedOption === option;

                let cardClass = "";
                if (mcqResult?.submission) {
                  const isCorrectAnswer =
                    challenge.correctAnswer &&
                    option.trim().toLowerCase() === challenge.correctAnswer.trim().toLowerCase();

                  if (isSelected) {
                    cardClass = mcqResult.submission.isCorrect ? "correct" : "wrong";
                  } else if (!mcqResult.submission.isCorrect && isCorrectAnswer) {
                    cardClass = "correct";
                  }
                } else if (isSelected) {
                  cardClass = "selected";
                }

                return (
                  <button
                    key={index}
                    type="button"
                    className={`mcq-option-card ${cardClass}`}
                    onClick={() => {
                      if (!mcqResult?.submission?.isCorrect) {
                        setSelectedOption(option);
                        if (mcqResult && !mcqResult.submission?.isCorrect) {
                          setMcqResult(null);
                        }
                      }
                    }}
                    disabled={mcqSubmitting || (mcqResult?.submission?.isCorrect)}
                  >
                    <div className="mcq-option-key">{optionKey}</div>
                    <span style={{ flex: 1 }}>{option}</span>
                    {cardClass === "correct" && <CheckCircle2 size={20} color="#34d399" />}
                    {cardClass === "wrong" && <XCircle size={20} color="#fb7185" />}
                  </button>
                );
              })}
            </div>

            {/* Feedback Alert */}
            {mcqResult && (
              <div
                className={`auth-alert ${
                  mcqResult.submission?.isCorrect
                    ? "auth-alert-success"
                    : "auth-alert-error"
                }`}
                style={{ marginBottom: "20px" }}
              >
                {mcqResult.submission?.isCorrect ? (
                  <CheckCircle2 size={22} color="#34d399" />
                ) : (
                  <AlertCircle size={22} color="#fb7185" />
                )}
                <div>
                  <strong style={{ fontSize: "1rem" }}>
                    {mcqResult.submission?.isCorrect ? "Correct Answer! 🎉" : "Wrong Answer"}
                  </strong>
                  <div style={{ fontSize: "0.88rem", marginTop: "2px", opacity: 0.9 }}>
                    {mcqResult.submission?.isCorrect
                      ? mcqResult.submission?.xpEarned > 0
                        ? `Congratulations! You earned +${mcqResult.submission.xpEarned} XP!`
                        : "You have completed this quiz!"
                      : "That option was incorrect. Pick another option and try again!"}
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {mcqResult?.submission?.isCorrect ? (
              <div style={{ display: "flex", gap: "12px", width: "100%" }}>
                <Link
                  to="/challenges"
                  className="arena-btn"
                  style={{ flex: 1, padding: "14px", justifyContent: "center" }}
                >
                  <ArrowLeft size={18} />
                  <span>Back to Challenges</span>
                </Link>
                <button
                  type="button"
                  className="arena-btn arena-btn-secondary"
                  style={{ padding: "14px 20px" }}
                  onClick={() => {
                    setMcqResult(null);
                    setSelectedOption("");
                  }}
                >
                  <RotateCcw size={16} />
                  <span>Reset Quiz</span>
                </button>
              </div>
            ) : mcqResult && !mcqResult.submission?.isCorrect ? (
              <div style={{ display: "flex", gap: "12px", width: "100%" }}>
                <button
                  type="button"
                  className="arena-btn"
                  style={{ flex: 1, padding: "14px", justifyContent: "center" }}
                  onClick={() => {
                    setMcqResult(null);
                  }}
                >
                  <RotateCcw size={18} />
                  <span>Try Again</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="arena-btn"
                style={{ width: "100%", padding: "14px" }}
                onClick={handleMcqSubmit}
                disabled={!selectedOption || mcqSubmitting}
              >
                {mcqSubmitting ? (
                  <>
                    <div className="auth-spinner" />
                    <span>Checking Answer...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    <span>Submit Quiz Answer</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      ) : (
        /* CODING CHALLENGE WORKSPACE (SPLIT LAYOUT) */
        <div className="workspace-container">
          
          {/* Left Problem Description & Test Case Specs */}
          <div className="workspace-left">
            <div className="arena-card">
              <div style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", marginBottom: "6px" }}>
                {challenge.category} • CODING CHALLENGE
              </div>
              <h1 style={{ margin: "0 0 12px 0", fontSize: "1.5rem", color: "#f8fafc", fontWeight: 800 }}>
                {challenge.title}
              </h1>
              <p style={{ margin: "0 0 20px 0", color: "#cbd5e1", fontSize: "0.95rem", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                {challenge.description}
              </p>

              {/* Function Spec */}
              {challenge.functionName && (
                <div style={{ background: "rgba(15, 23, 42, 0.7)", padding: "12px 14px", borderRadius: "10px", border: "1px solid rgba(255, 255, 255, 0.06)", marginBottom: "18px" }}>
                  <div style={{ fontSize: "0.78rem", color: "#64748b", fontWeight: 600 }}>TARGET FUNCTION</div>
                  <code style={{ color: "#a5b4fc", fontSize: "0.9rem", fontWeight: 600 }}>
                    {challenge.functionName}(...)
                  </code>
                </div>
              )}

              {/* Example Test Cases */}
              <div style={{ marginTop: "16px" }}>
                <h3 style={{ margin: "0 0 12px 0", fontSize: "1rem", color: "#f8fafc" }}>
                  Example Test Cases
                </h3>
                {challenge.testCases?.map((tc, idx) => (
                  <div key={idx} className="test-case-item">
                    <div style={{ fontSize: "0.8rem", color: "#94a3b8", marginBottom: "6px" }}>
                      Example {idx + 1}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "0.85rem" }}>
                      <div>
                        <span style={{ color: "#64748b" }}>Input: </span>
                        <span className="code-snippet">{JSON.stringify(tc.input)}</span>
                      </div>
                      <div>
                        <span style={{ color: "#64748b" }}>Expected Output: </span>
                        <span className="code-snippet" style={{ color: "#34d399" }}>
                          {JSON.stringify(tc.expectedOutput)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Code Editor & Execution Results */}
          <div className="workspace-right">
            
            {/* Editor Box */}
            <div className="code-editor-box">
              <div className="editor-toolbar">
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <select
                    className="auth-input"
                    style={{ padding: "6px 12px", fontSize: "0.85rem", width: "auto" }}
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                  >
                    <option value="javascript">JavaScript (Node.js)</option>
                    <option value="python">Python 3</option>
                    <option value="cpp">C++ (GCC)</option>
                  </select>

                  <button
                    type="button"
                    className="arena-btn arena-btn-secondary"
                    style={{ padding: "6px 12px", fontSize: "0.8rem" }}
                    onClick={handleResetCode}
                    title="Reset to Starter Code"
                  >
                    <RotateCcw size={13} />
                    <span>Reset</span>
                  </button>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                  {/* Button 1: Run Code (Dry Run) */}
                  <button
                    type="button"
                    className="arena-btn"
                    style={{
                      padding: "8px 16px",
                      background: "rgba(6, 182, 212, 0.15)",
                      border: "1px solid rgba(6, 182, 212, 0.35)",
                      color: "#67e8f9",
                      boxShadow: "none"
                    }}
                    onClick={handleRunCode}
                    disabled={codeRunning || codeSubmitting}
                    title="Dry run test cases without submitting (Ctrl+Enter)"
                  >
                    {codeRunning ? (
                      <>
                        <div className="auth-spinner" style={{ width: "14px", height: "14px" }} />
                        <span>Running...</span>
                      </>
                    ) : (
                      <>
                        <Play size={15} />
                        <span>Run Code</span>
                      </>
                    )}
                  </button>

                  {/* Button 2: Submit Solution */}
                  <button
                    type="button"
                    className="arena-btn"
                    style={{
                      padding: "8px 18px",
                      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                      color: "white",
                      boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)"
                    }}
                    onClick={handleCodeSubmit}
                    disabled={codeRunning || codeSubmitting}
                    title="Submit solution to record attempt & earn XP (Ctrl+Shift+Enter)"
                  >
                    {codeSubmitting ? (
                      <>
                        <div className="auth-spinner" style={{ width: "14px", height: "14px" }} />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={15} />
                        <span>Submit Solution</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Code TextArea */}
              <textarea
                className="code-textarea"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="// Write your code solution here...\n// Press Tab to indent, Ctrl+Enter to Run, Ctrl+Shift+Enter to Submit"
                spellCheck="false"
              />
              <div style={{ padding: "6px 16px", background: "#0b0f19", borderTop: "1px solid rgba(255, 255, 255, 0.05)", fontSize: "0.75rem", color: "#64748b", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
                <span>Tab to indent • Ctrl+Enter (Run) • Ctrl+Shift+Enter (Submit)</span>
                <span>Language: {language}</span>
              </div>
            </div>

            {/* Test Case Output & Results Panel */}
            {codeResult && (
              <div className="results-panel">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", flexWrap: "wrap", gap: "8px" }}>
                  <h3 style={{ margin: 0, fontSize: "1.1rem", color: "#f8fafc", display: "flex", alignItems: "center", gap: "8px" }}>
                    <span>{codeResult.isRunOnly ? "Test Run Verdict:" : "Submission Verdict:"}</span>
                    <span
                      className={`arena-badge ${
                        codeResult.isRunOnly
                          ? codeResult.allPassed
                            ? "badge-accepted"
                            : "badge-wrong"
                          : codeResult.submission?.isCorrect
                          ? "badge-accepted"
                          : "badge-wrong"
                      }`}
                    >
                      {codeResult.isRunOnly ? (
                        codeResult.allPassed ? (
                          <>
                            <CheckCircle2 size={13} />
                            <span>All Test Cases Passed (Dry Run)</span>
                          </>
                        ) : (
                          <>
                            <XCircle size={13} />
                            <span>Some Test Cases Failed</span>
                          </>
                        )
                      ) : codeResult.submission?.isCorrect ? (
                        <>
                          <CheckCircle2 size={13} />
                          <span>Accepted (+{codeResult.submission?.xpEarned || 0} XP)</span>
                        </>
                      ) : (
                        <>
                          <XCircle size={13} />
                          <span>Wrong Answer</span>
                        </>
                      )}
                    </span>
                  </h3>
                </div>

                <div style={{ color: "#94a3b8", fontSize: "0.9rem", marginBottom: "12px" }}>
                  {codeResult.message}
                </div>

                {/* Individual Test Case Results */}
                {codeResult.results && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {codeResult.results.map((res, i) => (
                      <div
                        key={i}
                        className="test-case-item"
                        style={{
                          borderColor: res.passed
                            ? "rgba(16, 185, 129, 0.3)"
                            : "rgba(244, 63, 94, 0.3)",
                        }}
                      >
                        <div className="test-case-header">
                          <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#f8fafc" }}>
                            Test Case #{i + 1}
                          </span>
                          <span
                            className={`arena-badge ${
                              res.passed ? "badge-accepted" : "badge-wrong"
                            }`}
                          >
                            {res.passed ? "PASSED" : "FAILED"}
                          </span>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", fontSize: "0.82rem" }}>
                          <div>
                            <div style={{ color: "#64748b" }}>Input</div>
                            <div className="code-snippet">{JSON.stringify(res.input)}</div>
                          </div>
                          <div>
                            <div style={{ color: "#64748b" }}>Expected</div>
                            <div className="code-snippet" style={{ color: "#34d399" }}>
                              {res.expectedOutput}
                            </div>
                          </div>
                          <div>
                            <div style={{ color: "#64748b" }}>Actual Output</div>
                            <div
                              className="code-snippet"
                              style={{ color: res.passed ? "#34d399" : "#fb7185" }}
                            >
                              {res.actualOutput || res.status || "None"}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>

        </div>
      )}
    </div>
  );
};

export default ChallengeDetail;
