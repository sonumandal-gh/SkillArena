import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import authService from "../services/authService";
import "../styles/Auth.css";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  Swords,
  Trophy,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const from = location.state?.from?.pathname || "/dashboard";

  const params = new URLSearchParams(location.search);
  const errParam = params.get("error");
  const queryErrorMessage = errParam
    ? errParam === "google_auth_failed"
      ? "Google Authentication failed or was cancelled. Please try again."
      : `Authentication error: ${errParam}`
    : "";

  const activeErrorMessage = errorMessage || queryErrorMessage;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errorMessage) setErrorMessage("");
  };

  const handleFillDemo = () => {
    setFormData({
      email: "demo@skillarena.com",
      password: "password123",
    });
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!formData.email.trim()) {
      setErrorMessage("Please enter your email address.");
      return;
    }

    if (!formData.password) {
      setErrorMessage("Please enter your password.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await login(formData.email.trim(), formData.password);

      if (result.success) {
        setSuccessMessage("Login successful! Entering the Arena...");
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 800);
      } else {
        setErrorMessage(result.error || "Invalid email or password.");
      }
    } catch (err) {
      setErrorMessage(err.message || "An unexpected error occurred during login.");
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
              <span>SkillArena Battles</span>
            </div>

            <h2 className="auth-hero-title">
              Welcome back to the <span>Arena</span>.
            </h2>

            <p className="auth-hero-desc">
              Log in to resume your coding streak, tackle fresh algorithmic challenges, and climb to the top of the global developer leaderboard.
            </p>

            <div className="auth-features-list">
              <div className="auth-feature-item">
                <div className="auth-feature-icon">
                  <Swords size={18} />
                </div>
                <div>
                  <div className="auth-feature-title">Live Coding Battles</div>
                  <div className="auth-feature-text">Compete in algorithmic showdowns against global peers.</div>
                </div>
              </div>

              <div className="auth-feature-item">
                <div className="auth-feature-icon">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <div className="auth-feature-title">Secure & Reliable</div>
                  <div className="auth-feature-text">Session verification with JWT token refresh & OAuth.</div>
                </div>
              </div>

              <div className="auth-feature-item">
                <div className="auth-feature-icon">
                  <Trophy size={18} />
                </div>
                <div>
                  <div className="auth-feature-title">XP & Achievements</div>
                  <div className="auth-feature-text">Level up your coder profile with every accepted solution.</div>
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
              <span style={{ fontSize: "0.75rem", color: "#64748b" }}>Status: READY</span>
            </div>
            <p className="auth-preview-code">
              <span style={{ color: "#ec4899" }}>import</span> &#123; Arena &#125; <span style={{ color: "#ec4899" }}>from</span> <span style={{ color: "#a5b4fc" }}>&quot;@skillarena/core&quot;</span>;<br />
              <span style={{ color: "#38bdf8" }}>Arena</span>.authenticate(&#123; mode: <span style={{ color: "#22c55e" }}>&quot;TURBO&quot;</span> &#125;);
            </p>
          </div>
        </div>

        {/* Right Form Section */}
        <div className="auth-form-section">
          <div className="auth-header">
            <h1>Sign In</h1>
            <p>Enter your credentials to access your arena account</p>
          </div>

          {/* Google Sign-in Button */}
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
            <span>Continue with Google</span>
          </button>

          <div className="auth-divider">
            <span>or sign in with email</span>
          </div>

          {/* Feedback Alerts */}
          {activeErrorMessage && (
            <div className="auth-alert auth-alert-error" style={{ marginBottom: "16px" }}>
              <AlertCircle size={18} style={{ flexShrink: 0, marginTop: "2px" }} />
              <span>{activeErrorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="auth-alert auth-alert-success" style={{ marginBottom: "16px" }}>
              <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: "2px" }} />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form className="auth-form" onSubmit={handleSubmit}>
            
            {/* Email Address */}
            <div className="auth-input-group">
              <label className="auth-input-label" htmlFor="login-email">
                Email Address
              </label>
              <div className="auth-input-wrapper">
                <span className="auth-input-icon">
                  <Mail size={18} />
                </span>
                <input
                  id="login-email"
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
              <div className="auth-input-label">
                <label htmlFor="login-password">Password</label>
              </div>
              <div className="auth-input-wrapper">
                <span className="auth-input-icon">
                  <Lock size={18} />
                </span>
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="auth-input"
                  placeholder="Enter your password"
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
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Arena</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Pre-fill for testing */}
          <div className="auth-demo-box">
            <div className="auth-demo-text">
              <strong>Need a test account?</strong>
              <div style={{ color: "#94a3b8", fontSize: "0.75rem" }}>Auto-fill demo test credentials</div>
            </div>
            <button
              type="button"
              className="auth-demo-btn"
              onClick={handleFillDemo}
            >
              Auto Fill
            </button>
          </div>

          {/* Footer Link */}
          <div className="auth-footer-link">
            Don&apos;t have an account?
            <Link to="/register">Create Account</Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
