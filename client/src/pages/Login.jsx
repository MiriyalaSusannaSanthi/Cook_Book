import { signInWithPopup, signInWithEmailAndPassword,
  createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
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

  const handleEmailAuth = async (e) => {
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
    <div style={styles.container}>
      {/* Hero Section */}
      <div style={styles.hero}>
        <div style={styles.heroContent}>
          <div style={styles.heroIcon}>🍳</div>
          <h1 style={styles.heroTitle}>SmartChef</h1>
          <p style={styles.heroSub}>Your AI-powered personal kitchen assistant</p>
          <div style={styles.heroFeatures}>
            {["🤖 AI Recipe Generator", "🎤 Voice Assistant", "📅 Meal Planner", "🌐 Multi-language"].map((f) => (
              <span key={f} style={styles.heroFeature}>{f}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Auth Card */}
      <div style={styles.card}>
        <div style={styles.tabs}>
          <button
            onClick={() => setIsRegister(false)}
            style={{ ...styles.tab, ...(isRegister ? {} : styles.tabActive) }}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsRegister(true)}
            style={{ ...styles.tab, ...(isRegister ? styles.tabActive : {}) }}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleEmailAuth} style={styles.form}>
          {isRegister && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Full Name</label>
              <input
                style={styles.input}
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}
          <div style={styles.inputGroup}>
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
          <div style={styles.inputGroup}>
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
          <button type="submit" disabled={loading} style={styles.btnPrimary}>
            {loading ? "Please wait..." : isRegister ? "Create Account 🎉" : "Sign In →"}
          </button>
        </form>

        <div style={styles.divider}>
          <div style={styles.dividerLine} />
          <span style={styles.dividerText}>or</span>
          <div style={styles.dividerLine} />
        </div>

        <button onClick={handleGoogle} style={styles.btnGoogle}>
          <img src="https://www.google.com/favicon.ico" alt="G" style={{ width: 18, height: 18 }} />
          Continue with Google
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh", background: "var(--bg)",
    display: "flex", flexDirection: "column",
  },
  hero: {
    background: "linear-gradient(135deg, #FF6B35 0%, #F7931E 50%, #FFB347 100%)",
    padding: "48px 24px 40px", textAlign: "center",
  },
  heroContent: { maxWidth: "400px", margin: "0 auto" },
  heroIcon: { fontSize: "3.5rem", marginBottom: "12px" },
  heroTitle: { fontSize: "2.2rem", fontWeight: "800", color: "#fff", margin: "0 0 8px", letterSpacing: "-1px" },
  heroSub: { color: "rgba(255,255,255,0.85)", fontSize: "1rem", margin: "0 0 20px" },
  heroFeatures: { display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center" },
  heroFeature: {
    background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)",
    color: "#fff", padding: "4px 12px", borderRadius: "20px",
    fontSize: "0.78rem", fontWeight: "600",
  },
  card: {
    background: "#fff", borderRadius: "24px 24px 0 0",
    padding: "28px 24px", flex: 1,
    boxShadow: "0 -4px 32px rgba(0,0,0,0.08)",
    marginTop: "-16px",
  },
  tabs: {
    display: "flex", background: "var(--bg)", borderRadius: "12px",
    padding: "4px", marginBottom: "24px",
  },
  tab: {
    flex: 1, padding: "10px", border: "none", background: "none",
    borderRadius: "10px", cursor: "pointer", fontWeight: "600",
    fontSize: "0.95rem", color: "var(--text-secondary)", transition: "all 0.2s",
  },
  tabActive: { background: "#fff", color: "var(--primary)", boxShadow: "var(--shadow-sm)" },
  form: { display: "flex", flexDirection: "column", gap: "16px", marginBottom: "20px" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "0.85rem", fontWeight: "600", color: "var(--text-secondary)" },
  input: {
    padding: "14px 16px", borderRadius: "var(--radius-md)",
    border: "1.5px solid var(--border)", fontSize: "1rem",
    outline: "none", transition: "border 0.2s",
    background: "var(--bg)",
  },
  btnPrimary: {
    padding: "15px", background: "var(--primary)", color: "#fff",
    border: "none", borderRadius: "var(--radius-md)", fontSize: "1rem",
    cursor: "pointer", fontWeight: "700", marginTop: "4px",
  },
  divider: { display: "flex", alignItems: "center", gap: "12px", margin: "20px 0" },
  dividerLine: { flex: 1, height: "1px", background: "var(--border)" },
  dividerText: { fontSize: "0.85rem", color: "var(--text-secondary)" },
  btnGoogle: {
    width: "100%", padding: "14px", background: "#fff",
    border: "1.5px solid var(--border)", borderRadius: "var(--radius-md)",
    fontSize: "0.95rem", cursor: "pointer", fontWeight: "600",
    display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
    color: "var(--text)",
  },
};