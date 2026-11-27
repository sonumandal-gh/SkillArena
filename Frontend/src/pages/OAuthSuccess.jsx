import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { CheckCircle2, AlertCircle } from "lucide-react";

const OAuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const [status, setStatus] = useState("processing"); // processing, success, error
  const [errorMessage, setErrorMessage] = useState("");
  const processedRef = useRef(false);

  useEffect(() => {
    const token = searchParams.get("token");
    const refreshToken = searchParams.get("refreshToken");

    if (processedRef.current) return;
    processedRef.current = true;

    let timerId;

    const processOAuth = async () => {
      if (!token) {
        setStatus("error");
        setErrorMessage("Authentication token missing in callback.");
        timerId = setTimeout(() => navigate("/login"), 2500);
        return;
      }

      try {
        const result = await setSession(token, refreshToken);

        if (result.success) {
          setStatus("success");
          timerId = setTimeout(() => {
            navigate("/dashboard", { replace: true });
          }, 1000);
        } else {
          setStatus("error");
          setErrorMessage(result.error || "Failed to finalize authentication.");
          timerId = setTimeout(() => navigate("/login"), 2500);
        }
      } catch (err) {
        setStatus("error");
        setErrorMessage(err.message || "An unexpected OAuth error occurred.");
        timerId = setTimeout(() => navigate("/login"), 2500);
      }
    };

    processOAuth();

    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [searchParams, setSession, navigate]);

  return (
    <div style={{
      minHeight: "75vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      color: "#0f172a",
      textAlign: "center",
      padding: "20px"
    }}>
      <div style={{
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "16px",
        padding: "40px",
        maxWidth: "420px",
        width: "100%",
        boxShadow: "0 14px 35px -5px rgba(15, 23, 42, 0.08)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "16px"
      }}>
        {status === "processing" && (
          <>
            <div style={{
              width: "48px",
              height: "48px",
              border: "3px solid #e2e8f0",
              borderTopColor: "#8b5cf6",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite"
            }} />
            <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700, color: "#0f172a" }}>
              Connecting with Google...
            </h3>
            <p style={{ margin: 0, color: "#64748b", fontSize: "0.9rem" }}>
              Please wait while we establish your SkillArena session.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle2 size={48} color="#10b981" />
            <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700, color: "#059669" }}>
              Authentication Successful!
            </h3>
            <p style={{ margin: 0, color: "#64748b", fontSize: "0.9rem" }}>
              Redirecting to your dashboard...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <AlertCircle size={48} color="#ef4444" />
            <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700, color: "#e11d48" }}>
              Authentication Failed
            </h3>
            <p style={{ margin: 0, color: "#64748b", fontSize: "0.9rem" }}>
              {errorMessage}
            </p>
          </>
        )}
      </div>
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default OAuthSuccess;
