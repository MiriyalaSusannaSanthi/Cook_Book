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
  const navigate = useNavigate();

  const handleGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/");
    } catch (err) {
      toast.error("Google sign-in failed");
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        // Create account
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Set display name in Firebase immediately
        await updateProfile(userCredential.user, { displayName: name });
        // Force token refresh so backend gets updated name
        await userCredential.user.getIdToken(true);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate("/");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.logo}>🍳 SmartChef</h1>
        <p style={styles.sub}>Your personal recipe assistant</p>

        <form onSubmit={handleEmailAuth} style={styles.form}>
          {isRegister && (
            <input
              style={styles.input}
              type="text"
              placeholder="Your Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}
          <input style={styles.input} type="email" placeholder="Email"
            value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input style={styles.input} type="password" placeholder="Password"
            value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" style={styles.btnPrimary}>
            {isRegister ? "Create Account" : "Sign In"}
          </button>
        </form>

        <p style={styles.toggle}>
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <span style={styles.toggleLink} onClick={() => { setIsRegister(!isRegister); setName(""); }}>
            {isRegister ? "Sign In" : "Register"}
          </span>
        </p>

        <div style={styles.divider}><span>or</span></div>

        <button onClick={handleGoogle} style={styles.btnGoogle}>
          🔵 Continue with Google
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight:"100vh", display:"flex", alignItems:"center",
    justifyContent:"center", background:"#fff8f5" },
  card: { background:"#fff", padding:"40px", borderRadius:"16px",
    boxShadow:"0 4px 24px rgba(0,0,0,0.1)", width:"100%", maxWidth:"400px", textAlign:"center" },
  logo: { fontSize:"2rem", margin:"0 0 8px" },
  sub: { color:"#888", marginBottom:"24px" },
  form: { display:"flex", flexDirection:"column", gap:"12px" },
  input: { padding:"12px", borderRadius:"8px", border:"1px solid #ddd",
    fontSize:"1rem", outline:"none" },
  btnPrimary: { padding:"12px", background:"#ff6b35", color:"#fff",
    border:"none", borderRadius:"8px", fontSize:"1rem", cursor:"pointer", fontWeight:"bold" },
  toggle: { margin:"16px 0 0", fontSize:"0.9rem", color:"#666" },
  toggleLink: { color:"#ff6b35", cursor:"pointer", fontWeight:"bold" },
  divider: { margin:"20px 0", color:"#ccc" },
  btnGoogle: { width:"100%", padding:"12px", background:"#fff", border:"1px solid #ddd",
    borderRadius:"8px", fontSize:"1rem", cursor:"pointer", fontWeight:"500" },
};