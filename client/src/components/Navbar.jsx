import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>🍳 SmartChef</Link>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Explore</Link>
        <Link to="/what-can-i-cook" style={styles.link}>What Can I Cook?</Link>
        <Link to="/add-recipe" style={styles.link}>Add Recipe</Link>
        <Link to="/my-recipes" style={styles.link}>My Recipes</Link>
        <span style={styles.user}>👤 {user?.name?.split(" ")[0]}</span>
        <button onClick={logout} style={styles.btn}>Logout</button>
      </div>
    </nav>
  );
}

const styles = {
  nav: { display:"flex", justifyContent:"space-between", alignItems:"center",
    padding:"12px 24px", background:"#ff6b35", color:"#fff" },
  brand: { color:"#fff", fontWeight:"bold", fontSize:"1.3rem", textDecoration:"none" },
  links: { display:"flex", gap:"16px", alignItems:"center" },
  link: { color:"#fff", textDecoration:"none", fontWeight:"500" },
  user: { color:"#ffe8d6" },
  btn: { background:"#fff", color:"#ff6b35", border:"none", padding:"6px 14px",
    borderRadius:"6px", cursor:"pointer", fontWeight:"bold" },
};