import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import authService from "../services/authService";
import "../styles/Auth.css";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  Swords,
  Trophy,
  Zap,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const { register, login } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errorMessage) setErrorMessage("");
  };

  // Password strength calculation
  const calculatePasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: "Empty", class: "weak" };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 1, label: "Weak", class: "weak" };
    if (score <= 3) return { score: 2, label: "Medium", class: "medium" };
    return { score: 3, label: "Strong", class: "strong" };
  };

  const strength = calculatePasswordStrength(formData.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // Client-side validations
    if (!formData.name.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    if (!formData.email.trim()) {
      setErrorMessage("Please enter your email address.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (!formData.password) {
      setErrorMessage("Please enter a password.");
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await register(
        formData.name.trim(),
        formData.email.trim(),
        formData.password
      );

      if (result.success) {
        setSuccessMessage("Account created successfully! Logging you in...");
        
        // Auto-login user after registration
        const loginRes = await login(formData.email.trim(), formData.password);
        if (loginRes.success) {
          setTimeout(() => {
            navigate("/dashboard");
          }, 1200);
        } else {
          setTimeout(() => {
            navigate("/login");
          }, 1500);
        }
      } else {
        setErrorMessage(result.error || "Registration failed. Please try again.");
      }
    } catch (err) {
      setErrorMessage(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleAuth = () => {
    window.location.href = authService.getGoogleAuthUrl();
  };

  return (
    <div className="auth-page-container">
      <div className="auth-layout-wrapper">
        
        {/* Left Hero Section */}
        <div className="auth-hero-section">
          <div>
            <div className="auth-hero-badge">
              <Sparkles size={14} />
              <span>SkillArena Platform</span>
            </div>

            <h2 className="auth-hero-title">
              Start your journey to <span>mastery</span>.
            </h2>

            <p className="auth-hero-desc">
              Create your account to unlock competitive coding challenges, track your algorithmic growth, and battle fellow developers globally.
            </p>

            <div className="auth-features-list">
              <div className="auth-feature-item">
                <div className="auth-feature-icon">
                  <Swords size={18} />
                </div>
                <div>
                  <div className="auth-feature-title">Competitive Battles</div>
                  <div className="auth-feature-text">Solve real-time coding problems against the clock.</div>
                </div>
              </div>

              <div className="auth-feature-item">
                <div className="auth-feature-icon">
                  <Zap size={18} />
                </div>
                <div>
                  <div className="auth-feature-title">Instant Code Execution</div>
                  <div className="auth-feature-text">Run test cases and verify performance instantly.</div>
                </div>
              </div>

              <div className="auth-feature-item">
                <div className="auth-feature-icon">
                  <Trophy size={18} />
                </div>
                <div>
                  <div className="auth-feature-title">Ranked Leaderboard</div>
                  <div className="auth-feature-text">Earn XP, unlock arena ranks, and reach the top tier.</div>
                </div>
              </div>
            </div>
          </div>

          <div className="auth-hero-preview-card">
            <div className="auth-preview-header">
              <div className="auth-preview-dots">
                <span />
                <span />
                <span />
              </div>
              <span style={{ fontSize: "0.75rem", color: "#64748b" }}>SkillArena Terminal</span>
            </div>
            <p className="auth-preview-code">
              <span style={{ color: "#ec4899" }}>const</span> coder = <span style={{ color: "#38bdf8" }}>new</span> ArenaPlayer(&quot;Champion&quot;);<br />
              <span style={{ color: "#22c55e" }}>await</span> coder.joinBattle(&#123; difficulty: &quot;HARD&quot; &#125;);
            </p>
          </div>
        </div>

        {/* Right Form Section */}
        <div className="auth-form-section">
          <div className="auth-header">
            <h1>Create Account</h1>
            <p>Join the SkillArena coding community today</p>
          </div>

          {/* Google Sign-up Button */}
          <button
            type="button"
            className="auth-google-btn"
            onClick={handleGoogleAuth}
          >
            <svg className="auth-google-icon" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24Z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15Z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"
              />
            </svg>
            <span>Sign up with Google</span>
          </button>

          <div className="auth-divider">
            <span>or continue with email</span>
          </div>

          {/* Feedback Alerts */}
          {errorMessage && (
            <div className="auth-alert auth-alert-error" style={{ marginBottom: "16px" }}>
              <AlertCircle size={18} style={{ flexShrink: 0, marginTop: "2px" }} />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="auth-alert auth-alert-success" style={{ marginBottom: "16px" }}>
              <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: "2px" }} />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Registration Form */}
          <form className="auth-form" onSubmit={handleSubmit}>
            
            {/* Full Name */}
            <div className="auth-input-group">
              <label className="auth-input-label" htmlFor="register-name">
                Full Name
              </label>
              <div className="auth-input-wrapper">
                <span className="auth-input-icon">
                  <User size={18} />
                </span>
                <input
                  id="register-name"
                  type="text"
                  name="name"
                  className="auth-input"
                  placeholder="e.g. Alex Rivera"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="auth-input-group">
              <label className="auth-input-label" htmlFor="register-email">
                Email Address
              </label>
              <div className="auth-input-wrapper">
                <span className="auth-input-icon">
                  <Mail size={18} />
                </span>
                <input
                  id="register-email"
                  type="email"
                  name="email"
                  className="auth-input"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="auth-input-group">
              <label className="auth-input-label" htmlFor="register-password">
                Password
              </label>
              <div className="auth-input-wrapper">
                <span className="auth-input-icon">
                  <Lock size={18} />
                </span>
                <input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="auth-input"
                  placeholder="At least 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="auth-toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Live Strength Meter */}
              {formData.password && (
                <div className="auth-password-strength">
                  <div className="strength-bar-track">
                    <div
                      className="strength-bar-fill"
                      style={{
                        backgroundColor:
                          strength.score >= 1
                            ? strength.class === "weak"
                              ? "#f43f5e"
                              : strength.class === "medium"
                              ? "#f59e0b"
                              : "#10b981"
                            : "transparent",
                      }}
                    />
                    <div
                      className="strength-bar-fill"
                      style={{
                        backgroundColor:
                          strength.score >= 2
                            ? strength.class === "medium"
                              ? "#f59e0b"
                              : "#10b981"
                            : "transparent",
                      }}
                    />
                    <div
                      className="strength-bar-fill"
                      style={{
                        backgroundColor:
                          strength.score >= 3 ? "#10b981" : "transparent",
                      }}
                    />
                  </div>
                  <div className="strength-label-text">
                    <span>Password Strength:</span>
                    <span className={strength.class}>{strength.label}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="auth-input-group">
              <label className="auth-input-label" htmlFor="register-confirm-password">
                Confirm Password
              </label>
              <div className="auth-input-wrapper">
                <span className="auth-input-icon">
                  <Lock size={18} />
                </span>
                <input
                  id="register-confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  className={`auth-input ${
                    formData.confirmPassword &&
                    formData.confirmPassword !== formData.password
                      ? "has-error"
                      : ""
                  }`}
                  placeholder="Repeat your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="auth-toggle-password"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="auth-submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="auth-spinner" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Arena Account</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="auth-footer-link">
            Already have an account?
            <Link to="/login">Sign In</Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Register;
