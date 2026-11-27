import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import statisticsService from "../services/statisticsService";
import ThreeRibbonCanvas from "../components/ThreeRibbonCanvas";
import confetti from "canvas-confetti";
import "../styles/CinematicHome.css";
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
  Play,
  Flame,
  Check,
  ChevronRight,
  Layers,
  Award,
  BookOpen,
  Send,
  HelpCircle,
} from "lucide-react";

const Home = () => {
  const { user, isAuthenticated } = useAuth();
  const [platformStats, setPlatformStats] = useState(null);

  // Interactive Code Workspace State in Hero Showcase
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionOutput, setExecutionOutput] = useState(null);

  // Interactive MCQ Practice State
  const [selectedMcqOption, setSelectedMcqOption] = useState(null);
  const [mcqAnswered, setMcqAnswered] = useState(false);

  // Challenge Category Filter
  const [activeDifficulty, setActiveDifficulty] = useState("all");

  useEffect(() => {
    let isMounted = true;
    const fetchStats = async () => {
      try {
        const data = await statisticsService.getPublicStats();
        if (isMounted && data?.stats) {
          setPlatformStats(data.stats);
        }
      } catch (err) {
        console.warn("Public stats load:", err);
      }
    };
    fetchStats();
    return () => {
      isMounted = false;
    };
  }, []);

  // Code snippets for the interactive workspace mockup
  const CODE_SNIPPETS = {
    javascript: `// Two Sum: Find two numbers that sum up to target
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}

// Running Test Cases...
console.log(twoSum([2, 7, 11, 15], 9));`,
    python: `# Two Sum: Find two numbers that sum up to target
def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            return [seen[diff], i]
        seen[num] = i
    return []

# Running Test Cases...
print(two_sum([2, 7, 11, 15], 9))`,
    cpp: `// Two Sum: O(N) Hash Map approach in C++
#include <vector>
#include <unordered_map>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> map;
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        if (map.count(complement)) {
            return {map[complement], i};
        }
        map[nums[i]] = i;
    }
    return {};
}`,
  };

  const handleRunCode = () => {
    setIsExecuting(true);
    setExecutionOutput(null);

    setTimeout(() => {
      setIsExecuting(false);
      setExecutionOutput({
        status: "Accepted",
        runtime: "4 ms (Beats 96.4%)",
        memory: "42.1 MB (Beats 88.2%)",
        testCases: [
          { input: "nums = [2,7,11,15], target = 9", output: "[0, 1]", passed: true },
          { input: "nums = [3,2,4], target = 6", output: "[1, 2]", passed: true },
          { input: "nums = [3,3], target = 6", output: "[0, 1]", passed: true },
        ],
      });

      try {
        confetti({
          particleCount: 30,
          spread: 60,
          origin: { y: 0.7 },
          colors: ["#ec4899", "#8b5cf6", "#06b6d4"],
        });
      } catch {
        // Confetti fallback
      }
    }, 700);
  };

  // Sample Challenges Data
  const SAMPLE_CHALLENGES = [
    {
      id: "two-sum",
      title: "Two Sum",
      category: "Arrays & Hash Table",
      difficulty: "easy",
      acceptance: "49.8%",
      points: 50,
    },
    {
      id: "lru-cache",
      title: "LRU Cache Architecture",
      category: "Doubly Linked List & Hash",
      difficulty: "hard",
      acceptance: "41.2%",
      points: 150,
    },
    {
      id: "longest-substring",
      title: "Longest Substring Without Repeating",
      category: "Sliding Window",
      difficulty: "medium",
      acceptance: "34.5%",
      points: 100,
    },
    {
      id: "trapping-rain-water",
      title: "Trapping Rain Water",
      category: "Two Pointers & DP",
      difficulty: "hard",
      acceptance: "58.9%",
      points: 180,
    },
    {
      id: "valid-parentheses",
      title: "Valid Parentheses",
      category: "Stack & Strings",
      difficulty: "easy",
      acceptance: "40.3%",
      points: 50,
    },
    {
      id: "course-schedule",
      title: "Course Schedule & Topological Sort",
      category: "Graph Theory",
      difficulty: "medium",
      acceptance: "46.1%",
      points: 120,
    },
  ];

  const filteredChallenges = SAMPLE_CHALLENGES.filter((c) =>
    activeDifficulty === "all" ? true : c.difficulty === activeDifficulty
  );

  return (
    <div className="cinematic-outer-canvas">
      {/* White Website Presentation Frame */}
      <div className="cinematic-presentation-frame">
        {/* Subtle Dotted Grid Texture */}
        <div className="cinematic-dotted-grid" />

        <div className="cinematic-frame-content">
          {/* Top Session Pill (If Authenticated) */}
          {isAuthenticated && (
            <div
              style={{
                background: "rgba(15, 23, 42, 0.04)",
                borderBottom: "1px solid rgba(226, 232, 240, 0.8)",
                padding: "10px 24px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "0.88rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Sparkles size={16} color="#8b5cf6" />
                <span>
                  Welcome back, <strong>{user?.name}</strong>! Ready for your next coding victory?
                </span>
              </div>
              <Link
                to="/dashboard"
                style={{
                  color: "#8b5cf6",
                  fontWeight: 700,
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <span>Open Dashboard</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          )}

          {/* ==========================================================================
              1. HERO SECTION – CINEMATIC HEADLINE & 3D FOLDED RIBBON
              ========================================================================== */}
          <section className="cinematic-hero-section">
            <div className="cinematic-hero-pill">
              <span className="cinematic-hero-pill-dot" />
              <span>THE CINEMATIC CODING PLATFORM • DSA & ALGORITHMS</span>
            </div>

            <h1 className="cinematic-hero-headline">
              MASTER CODE. <br />
              <span className="cinematic-gradient-text">CONQUER LOGIC.</span>
            </h1>

            <p className="cinematic-hero-subtext">
              Practice DSA, solve real-world coding challenges, compete with developers and level up your programming skills.
            </p>

            <div className="cinematic-hero-cta-row">
              <Link to={isAuthenticated ? "/challenges" : "/register"} className="cinematic-btn-primary">
                <Sparkles size={18} />
                <span>{isAuthenticated ? "Enter Arena" : "Get Started Free"}</span>
                <ArrowRight size={16} />
              </Link>

              <Link to="/challenges" className="cinematic-btn-secondary">
                <Swords size={18} color="#8b5cf6" />
                <span>Explore Challenges</span>
              </Link>
            </div>

            {/* 3D Folded Ribbon Animation Stage with Floating Elements */}
            <div className="cinematic-ribbon-stage">
              {/* Central Three.js 3D Folded Ribbon Wave */}
              <ThreeRibbonCanvas height="100%" />

              {/* Floating Element 1: Code Snippet Card */}
              <div className="cinematic-float-card float-card-code">
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#ef4444" }} />
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#f59e0b" }} />
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981" }} />
                  <span style={{ fontSize: "0.72rem", color: "#64748b", marginLeft: "4px", fontWeight: 600 }}>twoSum.js</span>
                </div>
                <div style={{ fontFamily: "monospace", fontSize: "0.76rem", color: "#0f172a", lineHeight: 1.5 }}>
                  <span style={{ color: "#d946ef" }}>const</span> solve = (nums) =&gt; &#123;<br />
                  &nbsp;&nbsp;<span style={{ color: "#8b5cf6" }}>return</span> nums.filter(x =&gt; x &gt; 0);<br />
                  &#125;;
                </div>
                <div style={{ marginTop: "6px", fontSize: "0.7rem", color: "#10b981", fontWeight: 700 }}>
                  ✓ O(1) Auxiliary Space
                </div>
              </div>

              {/* Floating Element 2: XP Victory Badge */}
              <div className="cinematic-float-card float-card-xp">
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "10px", background: "rgba(245, 158, 11, 0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Zap size={18} color="#f59e0b" />
                  </div>
                  <div>
                    <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "#0f172a" }}>+150 XP Earned</div>
                    <div style={{ fontSize: "0.72rem", color: "#10b981", fontWeight: 600 }}>Verdict: Accepted (4ms)</div>
                  </div>
                </div>
              </div>

              {/* Floating Element 3: Problem Card */}
              <div className="cinematic-float-card float-card-problem">
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "10px", background: "rgba(236, 72, 153, 0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Code2 size={18} color="#ec4899" />
                  </div>
                  <div>
                    <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#0f172a" }}>LRU Cache</div>
                    <div style={{ fontSize: "0.7rem", color: "#64748b" }}>Hard • 89.4% Acceptance</div>
                  </div>
                </div>
              </div>

              {/* Floating Element 4: Streak Indicator */}
              <div className="cinematic-float-card float-card-streak">
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "10px", background: "rgba(239, 68, 68, 0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Flame size={18} color="#ef4444" />
                  </div>
                  <div>
                    <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "#0f172a" }}>14 Days Active</div>
                    <div style={{ fontSize: "0.7rem", color: "#8b5cf6", fontWeight: 600 }}>Gold Tier Active</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ==========================================================================
              2. 3D PRODUCT SHOWCASE – ISOMETRIC CODING WORKSPACE
              ========================================================================== */}
          <section className="cinematic-showcase-section">
            <div className="cinematic-section-header">
              <span className="cinematic-section-tag">Interactive Architecture</span>
              <h2 className="cinematic-section-title">The Pro Developer Workspace</h2>
              <p className="cinematic-section-desc">
                Experience sub-millisecond cloud code compilation, multi-language support, automated edge-case test suites, and dynamic XP distribution.
              </p>
            </div>

            {/* 3D Perspective Browser Frame */}
            <div className="cinematic-perspective-wrapper">
              <div className="cinematic-browser-frame">
                {/* Browser Top Chrome */}
                <div className="cinematic-browser-chrome">
                  <div className="cinematic-window-controls">
                    <span className="cinematic-window-dot dot-red" />
                    <span className="cinematic-window-dot dot-yellow" />
                    <span className="cinematic-window-dot dot-green" />
                  </div>

                  <div className="cinematic-browser-tabs">
                    <button
                      type="button"
                      className={`cinematic-tab-pill ${selectedLanguage === "javascript" ? "active" : ""}`}
                      onClick={() => setSelectedLanguage("javascript")}
                    >
                      <span>JavaScript</span>
                    </button>
                    <button
                      type="button"
                      className={`cinematic-tab-pill ${selectedLanguage === "python" ? "active" : ""}`}
                      onClick={() => setSelectedLanguage("python")}
                    >
                      <span>Python 3</span>
                    </button>
                    <button
                      type="button"
                      className={`cinematic-tab-pill ${selectedLanguage === "cpp" ? "active" : ""}`}
                      onClick={() => setSelectedLanguage("cpp")}
                    >
                      <span>C++ (17)</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleRunCode}
                    disabled={isExecuting}
                    style={{
                      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                      color: "#ffffff",
                      border: "none",
                      padding: "6px 16px",
                      borderRadius: "8px",
                      fontSize: "0.82rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      boxShadow: "0 0 16px rgba(16, 185, 129, 0.4)",
                    }}
                  >
                    <Play size={13} fill="#ffffff" />
                    <span>{isExecuting ? "Executing..." : "Run Code"}</span>
                  </button>
                </div>

                {/* Workspace Body: Code Editor + Test Console Output */}
                <div className="cinematic-workspace-body">
                  <div className="cinematic-editor-pane">
                    {CODE_SNIPPETS[selectedLanguage].split("\n").map((line, idx) => (
                      <div key={idx} className="cinematic-code-line">
                        <span className="cinematic-line-number">{idx + 1}</span>
                        <span>{line}</span>
                      </div>
                    ))}
                  </div>

                  <div className="cinematic-output-pane">
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                        <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                          Test Suite Console
                        </span>
                        <span style={{ fontSize: "0.75rem", color: "#34d399", fontWeight: 700 }}>
                          Live Sandboxed
                        </span>
                      </div>

                      {executionOutput ? (
                        <div>
                          <div className="cinematic-test-status-box">
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#34d399", fontWeight: 800, fontSize: "0.95rem" }}>
                              <CheckCircle2 size={18} />
                              <span>{executionOutput.status}</span>
                            </div>
                            <div style={{ fontSize: "0.78rem", color: "#94a3b8", marginTop: "4px" }}>
                              Runtime: {executionOutput.runtime}
                            </div>
                          </div>

                          {executionOutput.testCases.map((tc, i) => (
                            <div
                              key={i}
                              style={{
                                background: "rgba(255, 255, 255, 0.04)",
                                borderRadius: "8px",
                                padding: "8px 12px",
                                marginBottom: "8px",
                                fontSize: "0.75rem",
                                color: "#cbd5e1",
                              }}
                            >
                              <div style={{ color: "#34d399", fontWeight: 600 }}>Test Case #{i + 1} Passed</div>
                              <div style={{ color: "#94a3b8", marginTop: "2px" }}>Input: {tc.input}</div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div style={{ color: "#64748b", fontSize: "0.85rem", textAlign: "center", padding: "60px 20px" }}>
                          <Terminal size={32} style={{ margin: "0 auto 12px", opacity: 0.5 }} />
                          <p style={{ margin: 0 }}>Click <strong>"Run Code"</strong> above to execute tests against automated edge-cases.</p>
                        </div>
                      )}
                    </div>

                    <Link
                      to="/challenges"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                        padding: "10px",
                        background: "rgba(255, 255, 255, 0.06)",
                        borderRadius: "10px",
                        color: "#ffffff",
                        textDecoration: "none",
                        fontSize: "0.82rem",
                        fontWeight: 600,
                      }}
                    >
                      <span>Explore 150+ Ranked Challenges</span>
                      <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* ==========================================================================
                3. DSA CHALLENGES SHOWCASE
                ========================================================================== */}
            <div style={{ maxWidth: "1080px", margin: "0 auto 80px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", marginBottom: "24px" }}>
                <div>
                  <h3 style={{ margin: "0 0 4px", fontSize: "1.45rem", fontWeight: 800, color: "#0f172a" }}>
                    Algorithmic Catalog
                  </h3>
                  <p style={{ margin: 0, color: "#64748b", fontSize: "0.9rem" }}>
                    From fundamental two-pointer problems to advanced graph theory.
                  </p>
                </div>

                <div style={{ display: "flex", gap: "8px", background: "#ffffff", padding: "4px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                  {["all", "easy", "medium", "hard"].map((diff) => (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => setActiveDifficulty(diff)}
                      style={{
                        padding: "6px 14px",
                        borderRadius: "8px",
                        border: "none",
                        background: activeDifficulty === diff ? "#0f172a" : "transparent",
                        color: activeDifficulty === diff ? "#ffffff" : "#64748b",
                        fontSize: "0.82rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        textTransform: "capitalize",
                      }}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "18px" }}>
                {filteredChallenges.map((ch) => (
                  <div
                    key={ch.id}
                    style={{
                      background: "#ffffff",
                      borderRadius: "16px",
                      padding: "20px",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 4px 14px rgba(15, 23, 42, 0.03)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                        <span
                          style={{
                            padding: "3px 10px",
                            borderRadius: "9999px",
                            fontSize: "0.72rem",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            background:
                              ch.difficulty === "easy"
                                ? "rgba(16, 185, 129, 0.12)"
                                : ch.difficulty === "medium"
                                ? "rgba(245, 158, 11, 0.12)"
                                : "rgba(244, 63, 94, 0.12)",
                            color:
                              ch.difficulty === "easy"
                                ? "#059669"
                                : ch.difficulty === "medium"
                                ? "#d97706"
                                : "#e11d48",
                          }}
                        >
                          {ch.difficulty}
                        </span>
                        <span style={{ fontSize: "0.78rem", color: "#64748b", fontWeight: 600 }}>
                          +{ch.points} XP
                        </span>
                      </div>

                      <h4 style={{ margin: "0 0 6px", fontSize: "1.05rem", fontWeight: 700, color: "#0f172a" }}>
                        {ch.title}
                      </h4>
                      <p style={{ margin: "0 0 16px", fontSize: "0.82rem", color: "#64748b" }}>
                        {ch.category}
                      </p>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "12px", borderTop: "1px solid #f1f5f9" }}>
                      <span style={{ fontSize: "0.78rem", color: "#94a3b8" }}>
                        Acceptance: {ch.acceptance}
                      </span>
                      <Link
                        to="/challenges"
                        style={{
                          fontSize: "0.82rem",
                          fontWeight: 700,
                          color: "#8b5cf6",
                          textDecoration: "none",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <span>Solve</span>
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ==========================================================================
                4. MCQ PRACTICE ARENA SHOWCASE
                ========================================================================== */}
            <div style={{ maxWidth: "1080px", margin: "0 auto 80px" }}>
              <div className="cinematic-mcq-box">
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                  <HelpCircle size={18} color="#ec4899" />
                  <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#ec4899", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    Interactive MCQ Practice Arena
                  </span>
                </div>

                <h3 style={{ margin: "0 0 16px", fontSize: "1.2rem", fontWeight: 700, color: "#0f172a" }}>
                  What is the average time complexity of searching in a Balanced Binary Search Tree (AVL / Red-Black Tree)?
                </h3>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                  {[
                    { id: "A", text: "O(1) Constant Time", correct: false },
                    { id: "B", text: "O(log N) Logarithmic Time", correct: true },
                    { id: "C", text: "O(N) Linear Time", correct: false },
                    { id: "D", text: "O(N log N) Linearithmic Time", correct: false },
                  ].map((opt) => {
                    const isSelected = selectedMcqOption === opt.id;
                    const showCorrect = mcqAnswered && opt.correct;
                    const showWrong = mcqAnswered && isSelected && !opt.correct;

                    return (
                      <div
                        key={opt.id}
                        className={`cinematic-mcq-option ${showCorrect ? "correct" : ""}`}
                        style={{
                          borderColor: showWrong ? "#ef4444" : showCorrect ? "#10b981" : isSelected ? "#8b5cf6" : "#e2e8f0",
                          background: showWrong ? "rgba(239, 68, 68, 0.08)" : showCorrect ? "rgba(16, 185, 129, 0.1)" : "#f8fafc",
                        }}
                        onClick={() => {
                          setSelectedMcqOption(opt.id);
                          setMcqAnswered(true);
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <span style={{ fontWeight: 800, color: "#64748b" }}>{opt.id}.</span>
                          <span>{opt.text}</span>
                        </div>
                        {showCorrect && <Check size={16} color="#10b981" />}
                      </div>
                    );
                  })}
                </div>

                {mcqAnswered && (
                  <div style={{ padding: "12px 16px", borderRadius: "12px", background: "rgba(16, 185, 129, 0.08)", border: "1px solid rgba(16, 185, 129, 0.2)", fontSize: "0.85rem", color: "#065f46" }}>
                    <strong>Explanation:</strong> Because the tree maintains self-balancing invariants (height ≤ log N), each comparison halves the search space, yielding O(log N) runtime.
                  </div>
                )}
              </div>
            </div>

            {/* ==========================================================================
                5. LIVE PLATFORM STATISTICS STRIP
                ========================================================================== */}
            <div className="cinematic-stats-strip" style={{ maxWidth: "1080px", margin: "0 auto 80px" }}>
              <div className="cinematic-stat-block">
                <div className="cinematic-stat-number">
                  {platformStats ? platformStats.totalUsers : "2,400+"}
                </div>
                <div className="cinematic-stat-caption">Registered Coders</div>
              </div>

              <div className="cinematic-stat-block">
                <div className="cinematic-stat-number">
                  {platformStats ? platformStats.totalChallenges : "180+"}
                </div>
                <div className="cinematic-stat-caption">DSA Challenges</div>
              </div>

              <div className="cinematic-stat-block">
                <div className="cinematic-stat-number">
                  {platformStats ? platformStats.totalSubmissions : "48,200+"}
                </div>
                <div className="cinematic-stat-caption">Submissions Tested</div>
              </div>

              <div className="cinematic-stat-block">
                <div className="cinematic-stat-number" style={{ color: "#8b5cf6" }}>
                  99.8%
                </div>
                <div className="cinematic-stat-caption">Judge Engine Uptime</div>
              </div>
            </div>

            {/* ==========================================================================
                6. WHY CODERS CHOOSE SKILLARENA
                ========================================================================== */}
            <div className="cinematic-features-grid" style={{ maxWidth: "1080px", margin: "0 auto 80px" }}>
              <div className="cinematic-feature-card">
                <div>
                  <div className="cinematic-card-icon-wrap icon-wrap-purple">
                    <Terminal size={24} />
                  </div>
                  <h3 className="cinematic-card-title">Real-Time Judge Engine</h3>
                  <p className="cinematic-card-desc">
                    Isolated sandbox execution supporting JavaScript, Python, C++, and Go with precision memory and timeout guards.
                  </p>
                </div>
                <Link to="/challenges" style={{ fontSize: "0.85rem", color: "#8b5cf6", fontWeight: 700, textDecoration: "none" }}>
                  Try Execution Engine &rarr;
                </Link>
              </div>

              <div className="cinematic-feature-card">
                <div>
                  <div className="cinematic-card-icon-wrap icon-wrap-pink">
                    <Trophy size={24} />
                  </div>
                  <h3 className="cinematic-card-title">Ranked Leaderboard</h3>
                  <p className="cinematic-card-desc">
                    Climb global standings, earn XP multipliers on first-attempt solves, and track weekly progress among peers.
                  </p>
                </div>
                <Link to="/leaderboard" style={{ fontSize: "0.85rem", color: "#ec4899", fontWeight: 700, textDecoration: "none" }}>
                  View Rankings &rarr;
                </Link>
              </div>

              <div className="cinematic-feature-card">
                <div>
                  <div className="cinematic-card-icon-wrap icon-wrap-cyan">
                    <Globe size={24} />
                  </div>
                  <h3 className="cinematic-card-title">Comprehensive Analytics</h3>
                  <p className="cinematic-card-desc">
                    In-depth breakdown of topic strengths, speed percentiles, difficulty progression, and personal consistency streaks.
                  </p>
                </div>
                <Link to="/statistics" style={{ fontSize: "0.85rem", color: "#06b6d4", fontWeight: 700, textDecoration: "none" }}>
                  Inspect Analytics &rarr;
                </Link>
              </div>
            </div>

            {/* ==========================================================================
                7. FINAL CINEMATIC CALL TO ACTION
                ========================================================================== */}
            <div
              style={{
                maxWidth: "1080px",
                margin: "0 auto",
                borderRadius: "28px",
                background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                padding: "60px 32px",
                textAlign: "center",
                color: "#ffffff",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 25px 60px -15px rgba(15, 23, 42, 0.4)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "-50px",
                  right: "-50px",
                  width: "250px",
                  height: "250px",
                  background: "radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, transparent 70%)",
                  filter: "blur(40px)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: "-50px",
                  left: "-50px",
                  width: "250px",
                  height: "250px",
                  background: "radial-gradient(circle, rgba(6, 182, 212, 0.3) 0%, transparent 70%)",
                  filter: "blur(40px)",
                }}
              />

              <h2 style={{ fontSize: "clamp(2rem, 3.5vw, 2.8rem)", fontWeight: 800, margin: "0 0 14px", letterSpacing: "-0.02em" }}>
                Ready to Conquer the Arena?
              </h2>
              <p style={{ color: "#94a3b8", maxWidth: "560px", margin: "0 auto 32px", fontSize: "1.05rem", lineHeight: 1.6 }}>
                Join thousands of developers leveling up their DSA, competing in real-time battles, and cracking technical interviews.
              </p>

              <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
                <Link
                  to={isAuthenticated ? "/challenges" : "/register"}
                  style={{
                    background: "#ffffff",
                    color: "#0f172a",
                    padding: "14px 32px",
                    borderRadius: "9999px",
                    fontWeight: 700,
                    textDecoration: "none",
                    boxShadow: "0 10px 25px rgba(255, 255, 255, 0.2)",
                  }}
                >
                  {isAuthenticated ? "Enter Challenge Arena" : "Create Free Account"}
                </Link>

                <Link
                  to="/challenges"
                  style={{
                    background: "rgba(255, 255, 255, 0.1)",
                    color: "#ffffff",
                    padding: "14px 28px",
                    borderRadius: "9999px",
                    fontWeight: 600,
                    textDecoration: "none",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                  }}
                >
                  Browse Challenges
                </Link>
              </div>
            </div>
          </section>

          {/* ==========================================================================
              8. PREMIUM EDITORIAL FOOTER
              ========================================================================== */}
          <footer className="cinematic-footer">
            <div className="cinematic-footer-brand">
              <h3>SkillArena</h3>
              <p>The cinematic creative platform for algorithmic excellence & technical interviews.</p>
            </div>

            <div className="cinematic-footer-links">
              <Link to="/challenges" className="cinematic-footer-link">Challenges</Link>
              <Link to="/leaderboard" className="cinematic-footer-link">Leaderboard</Link>
              <Link to="/statistics" className="cinematic-footer-link">Statistics</Link>
              <Link to="/profile" className="cinematic-footer-link">Profile</Link>
            </div>

            <div style={{ fontSize: "0.82rem", color: "#94a3b8", display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981", boxShadow: "0 0 8px #10b981" }} />
              <span>All Systems Operational</span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Home;
