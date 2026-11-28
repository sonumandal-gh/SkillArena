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
  X,
  RotateCcw,
} from "lucide-react";

// Curated pool of high-yield DSA & programming interview MCQs
const MCQ_QUESTIONS = [
  {
    id: 1,
    topic: "Tree Structures",
    question: "What is the average time complexity of searching in a Balanced Binary Search Tree (AVL / Red-Black Tree)?",
    options: [
      { id: "A", text: "O(1) Constant Time" },
      { id: "B", text: "O(log N) Logarithmic Time" },
      { id: "C", text: "O(N) Linear Time" },
      { id: "D", text: "O(N log N) Linearithmic Time" },
    ],
    correctAnswer: "B",
    explanation: "Because the tree maintains self-balancing invariants (height ≤ log N), each comparison halves the remaining search space, yielding guaranteed O(log N) runtime.",
  },
  {
    id: 2,
    topic: "System Design & Caching",
    question: "Which combination of data structures is optimal for implementing an LRU (Least Recently Used) Cache with O(1) get and put operations?",
    options: [
      { id: "A", text: "Binary Heap + Array" },
      { id: "B", text: "Hash Map + Doubly Linked List" },
      { id: "C", text: "Singly Linked List + Stack" },
      { id: "D", text: "Trie + Red-Black Tree" },
    ],
    correctAnswer: "B",
    explanation: "A Hash Map provides O(1) key-to-node lookups, while a Doubly Linked List allows O(1) node removal and insertion at the head/tail to track access recency.",
  },
  {
    id: 3,
    topic: "Graph Algorithms",
    question: "What is the standard time complexity of Dijkstra's Algorithm using a Min-Priority Queue (Binary Heap) on a graph with V vertices and E edges?",
    options: [
      { id: "A", text: "O(V + E)" },
      { id: "B", text: "O(V²)" },
      { id: "C", text: "O((V + E) log V)" },
      { id: "D", text: "O(V · E)" },
    ],
    correctAnswer: "C",
    explanation: "Each vertex is extracted from the min-heap once (V · log V) and each edge relaxation may update the heap priority (E · log V), yielding total O((V + E) log V).",
  },
  {
    id: 4,
    topic: "Dynamic Programming",
    question: "Which core property distinguishes Dynamic Programming problems from ordinary Divide-and-Conquer problems?",
    options: [
      { id: "A", text: "Overlapping Subproblems & Optimal Substructure" },
      { id: "B", text: "Greedy choice at every recursive step" },
      { id: "C", text: "Independent subproblems with zero overlap" },
      { id: "D", text: "Monotonic binary search space" },
    ],
    correctAnswer: "A",
    explanation: "Dynamic programming caches answers because the same subproblems are encountered repeatedly (overlapping subproblems), built upon subproblem optimal solutions (optimal substructure).",
  },
  {
    id: 5,
    topic: "Bit Manipulation",
    question: "What does the condition (n > 0) && ((n & (n - 1)) === 0) compute in constant time?",
    options: [
      { id: "A", text: "Checks if n is an odd prime number" },
      { id: "B", text: "Checks if n is an exact power of 2" },
      { id: "C", text: "Reverses the bit sequence of n" },
      { id: "D", text: "Computes the parity bit of integer n" },
    ],
    correctAnswer: "B",
    explanation: "An exact power of 2 has only a single bit set (e.g. 8 is 1000₂). Subtracting 1 flips all bits up to that bit (7 is 0111₂). Bitwise AND clears that bit, producing 0.",
  },
  {
    id: 6,
    topic: "Sorting Algorithms",
    question: "What is the worst-case time complexity of QuickSort when using a naive pivot selection on an already sorted array?",
    options: [
      { id: "A", text: "O(N log N)" },
      { id: "B", text: "O(N)" },
      { id: "C", text: "O(N²)" },
      { id: "D", text: "O(log N)" },
    ],
    correctAnswer: "C",
    explanation: "Picking the first or last element as pivot on an already sorted array creates highly unbalanced partitions of size 1 and N-1 at every step, degrading runtime to O(N²).",
  },
];

const Home = () => {
  const { user, isAuthenticated } = useAuth();
  const [platformStats, setPlatformStats] = useState(null);

  // Interactive Code Workspace State in Hero Showcase
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionOutput, setExecutionOutput] = useState(null);

  // Interactive MCQ Practice State
  const [currentMcqIndex, setCurrentMcqIndex] = useState(0);
  const [selectedMcqOption, setSelectedMcqOption] = useState(null);
  const [mcqAnswered, setMcqAnswered] = useState(false);
  const [mcqScore, setMcqScore] = useState(0);
  const [mcqStreak, setMcqStreak] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const currentMcq = MCQ_QUESTIONS[currentMcqIndex] || MCQ_QUESTIONS[0];

  const handleMcqSelect = (optId) => {
    if (mcqAnswered) return;
    setSelectedMcqOption(optId);
    setMcqAnswered(true);

    const isCorrect = optId === currentMcq.correctAnswer;
    if (isCorrect) {
      setMcqScore((prev) => prev + 1);
      setMcqStreak((prev) => prev + 1);
      try {
        confetti({
          particleCount: 35,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch (e) {}
    } else {
      setMcqStreak(0);
    }
  };

  const handleNextMcq = () => {
    if (currentMcqIndex + 1 < MCQ_QUESTIONS.length) {
      setCurrentMcqIndex((prev) => prev + 1);
      setSelectedMcqOption(null);
      setMcqAnswered(false);
    } else {
      setQuizCompleted(true);
      try {
        confetti({
          particleCount: 90,
          spread: 100,
          origin: { y: 0.6 },
        });
      } catch (e) {}
    }
  };

  const handleRestartQuiz = () => {
    setCurrentMcqIndex(0);
    setSelectedMcqOption(null);
    setMcqAnswered(false);
    setMcqScore(0);
    setMcqStreak(0);
    setQuizCompleted(false);
  };

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

  // Default Code snippets for the interactive workspace mockup
  const DEFAULT_CODE_SNIPPETS = {
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

// Modify code above or test here!
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

# Modify code above or test here!
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

  const [editorCode, setEditorCode] = useState(DEFAULT_CODE_SNIPPETS);

  const handleRunCode = () => {
    setIsExecuting(true);
    setExecutionOutput(null);

    setTimeout(() => {
      setIsExecuting(false);
      const currentCode = editorCode[selectedLanguage] || "";

      if (selectedLanguage === "javascript") {
        try {
          const testSuite = [
            { nums: [2, 7, 11, 15], target: 9, expected: [0, 1] },
            { nums: [3, 2, 4], target: 6, expected: [1, 2] },
            { nums: [3, 3], target: 6, expected: [0, 1] },
          ];

          const runner = new Function(`
            ${currentCode};
            if (typeof twoSum !== 'function') {
              throw new Error("Function 'twoSum' is not defined. Ensure you declare 'function twoSum(nums, target) { ... }'");
            }
            return [
              twoSum([2, 7, 11, 15], 9),
              twoSum([3, 2, 4], 6),
              twoSum([3, 3], 6)
            ];
          `);

          const results = runner();
          let allPassed = true;
          const evaluatedTestCases = testSuite.map((ts, idx) => {
            const res = results[idx];
            const isMatch =
              Array.isArray(res) &&
              ((res[0] === ts.expected[0] && res[1] === ts.expected[1]) ||
                (res[0] === ts.expected[1] && res[1] === ts.expected[0]));
            if (!isMatch) allPassed = false;
            return {
              input: `nums = [${ts.nums.join(",")}], target = ${ts.target}`,
              expected: `[${ts.expected.join(", ")}]`,
              output: Array.isArray(res) ? `[${res.join(", ")}]` : String(res),
              passed: isMatch,
            };
          });

          if (allPassed) {
            setExecutionOutput({
              status: "Accepted",
              isAccepted: true,
              runtime: `${Math.floor(Math.random() * 3) + 2} ms (Beats 98.4%)`,
              memory: "41.8 MB (Beats 92.1%)",
              testCases: evaluatedTestCases,
            });
            try {
              confetti({
                particleCount: 35,
                spread: 60,
                origin: { y: 0.7 },
                colors: ["#ec4899", "#8b5cf6", "#06b6d4"],
              });
            } catch {}
          } else {
            setExecutionOutput({
              status: "Wrong Answer",
              isAccepted: false,
              runtime: "4 ms",
              memory: "42.0 MB",
              testCases: evaluatedTestCases,
            });
          }
        } catch (err) {
          setExecutionOutput({
            status: "Runtime / Syntax Error",
            isAccepted: false,
            errorMessage: err.message || "Failed to execute script.",
            testCases: [],
          });
        }
      } else {
        // Python or C++ simulated runner
        const hasLogic =
          currentCode.includes("two") &&
          (currentCode.includes("return") || currentCode.includes("map"));
        if (hasLogic) {
          setExecutionOutput({
            status: "Accepted",
            isAccepted: true,
            runtime: `${selectedLanguage === "cpp" ? "1 ms (Beats 99.2%)" : "28 ms (Beats 91.5%)"}`,
            memory: `${selectedLanguage === "cpp" ? "10.4 MB" : "17.6 MB"}`,
            testCases: [
              { input: "nums = [2,7,11,15], target = 9", expected: "[0, 1]", output: "[0, 1]", passed: true },
              { input: "nums = [3,2,4], target = 6", expected: "[1, 2]", output: "[1, 2]", passed: true },
              { input: "nums = [3,3], target = 6", expected: "[0, 1]", output: "[0, 1]", passed: true },
            ],
          });
          try {
            confetti({
              particleCount: 35,
              spread: 60,
              origin: { y: 0.7 },
              colors: ["#ec4899", "#8b5cf6", "#06b6d4"],
            });
          } catch {}
        } else {
          setExecutionOutput({
            status: "Compilation / Test Error",
            isAccepted: false,
            errorMessage: "Incomplete function definition or missing return statement.",
            testCases: [
              { input: "nums = [2,7,11,15], target = 9", expected: "[0, 1]", output: "None / Empty", passed: false },
            ],
          });
        }
      }
    }, 600);
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

                    <button
                      type="button"
                      className="cinematic-tab-reset-btn"
                      onClick={() => {
                        setEditorCode((prev) => ({
                          ...prev,
                          [selectedLanguage]: DEFAULT_CODE_SNIPPETS[selectedLanguage],
                        }));
                      }}
                      title="Reset code to default Two Sum template"
                    >
                      <RotateCcw size={11} />
                      <span>Reset</span>
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

                {/* Workspace Body: Interactive Editable Code Editor + Test Console Output */}
                <div className="cinematic-workspace-body">
                  <div className="cinematic-editor-pane">
                    <div className="cinematic-line-numbers-col">
                      {(editorCode[selectedLanguage] || "").split("\n").map((_, idx) => (
                        <div key={idx}>{idx + 1}</div>
                      ))}
                    </div>
                    <textarea
                      className="cinematic-code-textarea"
                      value={editorCode[selectedLanguage] || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEditorCode((prev) => ({ ...prev, [selectedLanguage]: val }));
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Tab") {
                          e.preventDefault();
                          const start = e.target.selectionStart;
                          const end = e.target.selectionEnd;
                          const val = e.target.value;
                          const updated = val.substring(0, start) + "  " + val.substring(end);
                          setEditorCode((prev) => ({ ...prev, [selectedLanguage]: updated }));
                          setTimeout(() => {
                            e.target.selectionStart = e.target.selectionEnd = start + 2;
                          }, 0);
                        }
                      }}
                      spellCheck="false"
                      autoCapitalize="off"
                      autoComplete="off"
                      placeholder="Write or edit code here..."
                    />
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
                          <div
                            className="cinematic-test-status-box"
                            style={{
                              background: executionOutput.isAccepted
                                ? "rgba(16, 185, 129, 0.12)"
                                : "rgba(239, 68, 68, 0.12)",
                              borderColor: executionOutput.isAccepted
                                ? "rgba(16, 185, 129, 0.3)"
                                : "rgba(239, 68, 68, 0.3)",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                color: executionOutput.isAccepted ? "#34d399" : "#ef4444",
                                fontWeight: 800,
                                fontSize: "0.95rem",
                              }}
                            >
                              {executionOutput.isAccepted ? <CheckCircle2 size={18} /> : <X size={18} />}
                              <span>{executionOutput.status}</span>
                            </div>
                            {executionOutput.runtime && (
                              <div style={{ fontSize: "0.78rem", color: "#94a3b8", marginTop: "4px" }}>
                                Runtime: {executionOutput.runtime} • Memory: {executionOutput.memory}
                              </div>
                            )}
                          </div>

                          {executionOutput.errorMessage && (
                            <div
                              style={{
                                background: "rgba(239, 68, 68, 0.08)",
                                border: "1px solid rgba(239, 68, 68, 0.2)",
                                borderRadius: "8px",
                                padding: "8px 12px",
                                marginBottom: "12px",
                                fontSize: "0.75rem",
                                color: "#f87171",
                                fontFamily: "monospace",
                              }}
                            >
                              {executionOutput.errorMessage}
                            </div>
                          )}

                          {executionOutput.testCases.map((tc, i) => (
                            <div
                              key={i}
                              style={{
                                background: tc.passed ? "rgba(255, 255, 255, 0.04)" : "rgba(239, 68, 68, 0.06)",
                                border: tc.passed ? "1px solid transparent" : "1px solid rgba(239, 68, 68, 0.2)",
                                borderRadius: "8px",
                                padding: "8px 12px",
                                marginBottom: "8px",
                                fontSize: "0.75rem",
                                color: "#cbd5e1",
                              }}
                            >
                              <div style={{ color: tc.passed ? "#34d399" : "#f87171", fontWeight: 700, display: "flex", alignItems: "center", gap: "6px" }}>
                                {tc.passed ? <Check size={13} /> : <X size={13} />}
                                <span>Test Case #{i + 1} {tc.passed ? "Passed" : "Failed"}</span>
                              </div>
                              <div style={{ color: "#94a3b8", marginTop: "2px" }}>Input: {tc.input}</div>
                              {!tc.passed && (
                                <div style={{ color: "#f87171", marginTop: "2px" }}>
                                  Expected: {tc.expected} | Got: {tc.output}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div style={{ color: "#64748b", fontSize: "0.85rem", textAlign: "center", padding: "60px 20px" }}>
                          <Terminal size={32} style={{ margin: "0 auto 12px", opacity: 0.5 }} />
                          <p style={{ margin: 0 }}>Edit code and click <strong>"Run Code"</strong> to execute live test cases.</p>
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
                {quizCompleted ? (
                  /* Quiz Completed Screen */
                  <div style={{ textAlign: "center", padding: "20px 10px" }}>
                    <div
                      style={{
                        width: "64px",
                        height: "64px",
                        margin: "0 auto 16px",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 10px 25px rgba(139, 92, 246, 0.3)",
                      }}
                    >
                      <Trophy size={32} color="#ffffff" />
                    </div>

                    <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#8b5cf6", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      Quiz Set Completed!
                    </span>
                    <h3 style={{ margin: "8px 0 12px", fontSize: "1.6rem", fontWeight: 800, color: "#0f172a" }}>
                      You scored {mcqScore} out of {MCQ_QUESTIONS.length}
                    </h3>
                    <p style={{ margin: "0 auto 24px", maxWidth: "480px", color: "#64748b", fontSize: "0.95rem" }}>
                      {mcqScore === MCQ_QUESTIONS.length
                        ? "Flawless score! You have supreme mastery over core DSA fundamentals."
                        : mcqScore >= MCQ_QUESTIONS.length / 2
                        ? "Great work! Solid conceptual intuition across data structures and algorithms."
                        : "Good effort! Practice more questions to level up your technical interview edge."}
                    </p>

                    <div style={{ display: "inline-flex", gap: "20px", marginBottom: "28px", padding: "12px 24px", background: "#f8fafc", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
                      <div>
                        <div style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>Accuracy</div>
                        <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0f172a" }}>
                          {Math.round((mcqScore / MCQ_QUESTIONS.length) * 100)}%
                        </div>
                      </div>
                      <div style={{ width: "1px", background: "#e2e8f0" }} />
                      <div>
                        <div style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>XP Earned</div>
                        <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#ec4899" }}>
                          +{mcqScore * 15} XP
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
                      <button
                        type="button"
                        className="arena-btn arena-btn-secondary"
                        onClick={handleRestartQuiz}
                        style={{ padding: "12px 24px" }}
                      >
                        <RotateCcw size={16} />
                        <span>Retake Quiz</span>
                      </button>
                      <Link
                        to="/challenges"
                        className="arena-btn"
                        style={{ padding: "12px 24px", textDecoration: "none" }}
                      >
                        <span>Explore All Challenges</span>
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                ) : (
                  /* Active Question Screen */
                  <>
                    <div className="cinematic-mcq-header">
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                        <div className="cinematic-mcq-badge">
                          <HelpCircle size={15} />
                          <span>Interactive MCQ Arena</span>
                        </div>
                        <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#8b5cf6", background: "rgba(139, 92, 246, 0.08)", padding: "4px 10px", borderRadius: "999px" }}>
                          {currentMcq.topic}
                        </span>
                        <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#64748b" }}>
                          Question {currentMcqIndex + 1} of {MCQ_QUESTIONS.length}
                        </span>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                        {mcqStreak > 0 && (
                          <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.85rem", fontWeight: 700, color: "#f59e0b" }}>
                            <Flame size={16} />
                            <span>Streak {mcqStreak}</span>
                          </div>
                        )}
                        <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#059669", background: "rgba(16, 185, 129, 0.1)", padding: "4px 10px", borderRadius: "999px" }}>
                          Score: {mcqScore}/{currentMcqIndex + (mcqAnswered ? 1 : 0)}
                        </div>
                      </div>
                    </div>

                    {/* Progress track */}
                    <div className="cinematic-mcq-track">
                      <div
                        className="cinematic-mcq-fill"
                        style={{ width: `${((currentMcqIndex + 1) / MCQ_QUESTIONS.length) * 100}%` }}
                      />
                    </div>

                    {/* Question Title */}
                    <h3 style={{ margin: "0 0 20px", fontSize: "1.22rem", fontWeight: 700, color: "#0f172a", lineHeight: 1.45 }}>
                      {currentMcq.question}
                    </h3>

                    {/* 2x2 Options Grid */}
                    <div className="cinematic-mcq-grid">
                      {currentMcq.options.map((opt) => {
                        const isSelected = selectedMcqOption === opt.id;
                        const isCorrectAnswer = opt.id === currentMcq.correctAnswer;
                        const isUserWrongChoice = mcqAnswered && isSelected && !isCorrectAnswer;
                        const showCorrectHighlight = mcqAnswered && isCorrectAnswer;
                        const isDimmed = mcqAnswered && !isSelected && !isCorrectAnswer;

                        return (
                          <div
                            key={opt.id}
                            className={`cinematic-mcq-option ${
                              showCorrectHighlight ? "correct" : isUserWrongChoice ? "wrong" : ""
                            } ${isDimmed ? "dimmed" : ""} ${mcqAnswered ? "disabled" : ""}`}
                            onClick={() => handleMcqSelect(opt.id)}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                              <span
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  width: "26px",
                                  height: "26px",
                                  borderRadius: "8px",
                                  fontWeight: 800,
                                  fontSize: "0.85rem",
                                  background: showCorrectHighlight
                                    ? "#10b981"
                                    : isUserWrongChoice
                                    ? "#ef4444"
                                    : "#e2e8f0",
                                  color: showCorrectHighlight || isUserWrongChoice ? "#ffffff" : "#475569",
                                }}
                              >
                                {opt.id}
                              </span>
                              <span>{opt.text}</span>
                            </div>

                            {showCorrectHighlight && <Check size={18} color="#10b981" />}
                            {isUserWrongChoice && <X size={18} color="#ef4444" />}
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation & Next Step Section */}
                    {mcqAnswered ? (
                      <div
                        className={`cinematic-mcq-explanation ${
                          selectedMcqOption === currentMcq.correctAnswer ? "is-correct" : "is-wrong"
                        }`}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                          {selectedMcqOption === currentMcq.correctAnswer ? (
                            <>
                              <CheckCircle2 size={18} color="#10b981" />
                              <strong style={{ fontSize: "0.95rem" }}>Brilliant! Correct Answer (+15 XP)</strong>
                            </>
                          ) : (
                            <>
                              <X size={18} color="#ef4444" />
                              <strong style={{ fontSize: "0.95rem" }}>
                                Incorrect — The correct answer is Option {currentMcq.correctAnswer}
                              </strong>
                            </>
                          )}
                        </div>

                        <p style={{ margin: 0, fontSize: "0.88rem", lineHeight: 1.55 }}>
                          <strong>Explanation:</strong> {currentMcq.explanation}
                        </p>

                        <div className="cinematic-mcq-actions">
                          {selectedMcqOption !== currentMcq.correctAnswer ? (
                            <button
                              type="button"
                              className="arena-btn arena-btn-secondary"
                              onClick={() => {
                                setSelectedMcqOption(null);
                                setMcqAnswered(false);
                              }}
                              style={{ padding: "8px 16px", fontSize: "0.84rem" }}
                            >
                              <RotateCcw size={14} />
                              <span>Re-attempt</span>
                            </button>
                          ) : (
                            <div style={{ fontSize: "0.82rem", color: "#065f46", fontWeight: 600 }}>
                              ✓ Concept verified
                            </div>
                          )}

                          <button
                            type="button"
                            className="arena-btn"
                            onClick={handleNextMcq}
                            style={{
                              padding: "10px 22px",
                              marginLeft: "auto",
                              background: "linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)",
                            }}
                          >
                            <span>
                              {currentMcqIndex + 1 < MCQ_QUESTIONS.length
                                ? "Next Question"
                                : "Finish Quiz"}
                            </span>
                            <ArrowRight size={16} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Not answered yet - quick skip option */
                      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "12px" }}>
                        <button
                          type="button"
                          onClick={handleNextMcq}
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "#64748b",
                            fontSize: "0.82rem",
                            fontWeight: 600,
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            padding: "4px 8px",
                          }}
                        >
                          <span>Skip Question</span>
                          <ArrowRight size={13} />
                        </button>
                      </div>
                    )}
                  </>
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
