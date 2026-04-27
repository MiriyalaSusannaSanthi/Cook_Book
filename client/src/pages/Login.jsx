import {
  signInWithPopup, signInWithEmailAndPassword,
  createUserWithEmailAndPassword, updateProfile,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase/firebase";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/");
    } catch {
      toast.error("Google sign-in failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isRegister) {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(cred.user, { displayName: name });
        await cred.user.getIdToken(true);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate("/");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Top Section */}
      <div style={styles.top}>
        <div style={styles.logoBox}>
          <span style={styles.logoEmoji}>🍳</span>
        </div>
        <h1 style={styles.appName}>SmartChef</h1>
        <p style={styles.tagline}>Your AI-powered kitchen assistant</p>
        <div style={styles.featureRow}>
          {["🤖 AI Recipes", "🎤 Voice", "📅 Meal Plan", "🌐 Multilingual"].map((f) => (
            <span key={f} style={styles.featureChip}>{f}</span>
          ))}
        </div>
      </div>

      {/* Bottom Sheet */}
      <div style={styles.sheet}>
        {/* Tab Toggle */}
        <div style={styles.tabRow}>
          <button
            onClick={() => setIsRegister(false)}
            style={{
              ...styles.tab,
              color: !isRegister ? "var(--primary)" : "var(--text-secondary)",
              borderBottom: !isRegister ? "2px solid var(--primary)" : "2px solid transparent",
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsRegister(true)}
            style={{
              ...styles.tab,
              color: isRegister ? "var(--primary)" : "var(--text-secondary)",
              borderBottom: isRegister ? "2px solid var(--primary)" : "2px solid transparent",
            }}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {isRegister && (
            <div style={styles.field}>
              <label style={styles.label}>Full Name</label>
              <input
                style={styles.input}
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading} style={styles.primaryBtn}>
            {loading ? "Please wait..." : isRegister ? "Create Account" : "Sign In"}
          </button>
        </form>

        <div style={styles.orRow}>
          <div style={styles.orLine} />
          <span style={styles.orText}>or continue with</span>
          <div style={styles.orLine} />
        </div>

        <button onClick={handleGoogle} style={styles.googleBtn}>
          <img
            src="https://www.google.com/favicon.ico"
            alt="G" style={{ width: 18, height: 18 }}
          />
          Google
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh", display: "flex",
    flexDirection: "column", background: "var(--primary)",
  },
  top: {
    flex: 1, display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    padding: "48px 24px 32px", textAlign: "center",
  },
  logoBox: {
    width: "80px", height: "80px", borderRadius: "24px",
    background: "rgba(255,255,255,0.2)",
    display: "flex", alignItems: "center",
    justifyContent: "center", marginBottom: "16px",
    backdropFilter: "blur(8px)",
  },
  logoEmoji: { fontSize: "2.5rem" },
  appName: {
    color: "#fff", fontSize: "2.2rem",
    fontWeight: "800", margin: "0 0 8px",
  },
  tagline: { color: "rgba(255,255,255,0.8)", fontSize: "1rem", margin: "0 0 20px" },
  featureRow: { display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center" },
  featureChip: {
    background: "rgba(255,255,255,0.18)",
    color: "#fff", padding: "5px 12px",
    borderRadius: "20px", fontSize: "0.78rem", fontWeight: "600",
  },
  sheet: {
    background: "#fff", borderRadius: "28px 28px 0 0",
    padding: "28px 24px 40px",
    boxShadow: "0 -8px 40px rgba(0,0,0,0.12)",
  },
  tabRow: {
    display: "flex", marginBottom: "24px",
    borderBottom: "1px solid var(--border)",
  },
  tab: {
    flex: 1, padding: "12px", background: "none",
    border: "none", cursor: "pointer",
    fontWeight: "700", fontSize: "1rem",
    transition: "all 0.2s",
  },
  form: { display: "flex", flexDirection: "column", gap: "16px" },
  field: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "0.82rem", fontWeight: "600", color: "var(--text-secondary)" },
  input: {
    padding: "14px 16px", borderRadius: "12px",
    border: "1.5px solid var(--border)",
    fontSize: "1rem", outline: "none",
    background: "var(--bg)", color: "var(--text)",
    transition: "border 0.2s",
  },
  primaryBtn: {
    padding: "15px", background: "var(--primary)",
    color: "#fff", border: "none", borderRadius: "12px",
    fontSize: "1rem", cursor: "pointer", fontWeight: "700",
    marginTop: "4px", boxShadow: "0 4px 16px rgba(255,107,53,0.3)",
  },
  orRow: {
    display: "flex", alignItems: "center",
    gap: "12px", margin: "20px 0",
  },
  orLine: { flex: 1, height: "1px", background: "var(--border)" },
  orText: { fontSize: "0.82rem", color: "var(--text-secondary)", whiteSpace: "nowrap" },
  googleBtn: {
    width: "100%", padding: "14px", background: "#fff",
    border: "1.5px solid var(--border)", borderRadius: "12px",
    fontSize: "0.95rem", cursor: "pointer", fontWeight: "600",
    display: "flex", alignItems: "center",
    justifyContent: "center", gap: "10px", color: "var(--text)",
  },
};