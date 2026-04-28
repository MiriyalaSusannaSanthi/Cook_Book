import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import RecipeCard from "../components/RecipeCard";

export default function MyRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchMyRecipes = () => {
    API.get("/recipes/my-recipes")
      .then((res) => setRecipes(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchMyRecipes(); }, []);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this recipe?")) return;
    try {
      await API.delete(`/recipes/${id}`);
      toast.success("Recipe deleted");
      fetchMyRecipes();
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="page" style={styles.page}>
      {/* Profile Header */}
      <div style={styles.header}>
        <div style={styles.avatarWrap}>
          {user?.photoURL ? (
            <img src={user.photoURL} alt="avatar" style={styles.avatarImg} />
          ) : (
            <div style={styles.avatarFallback}>
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
          )}
        </div>
        <h2 style={styles.name}>{user?.name}</h2>
        <p style={styles.email}>{user?.email}</p>
        <div style={styles.statsRow}>
          <div style={styles.stat}>
            <span style={styles.statNum}>{recipes.length}</span>
            <span style={styles.statLabel}>Recipes</span>
          </div>
          <div style={styles.statDivider} />
          <div style={styles.stat}>
            <span style={styles.statNum}>
              {recipes.reduce((a, r) => a + (r.likes?.length || 0), 0)}
            </span>
            <span style={styles.statLabel}>Likes</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={styles.body}>
        <div style={styles.topRow}>
          <h3 style={styles.sectionTitle}>My Recipes</h3>
          <button onClick={() => navigate("/add-recipe")} style={styles.addBtn}>
            + New Recipe
          </button>
        </div>

        {loading ? (
  <div style={styles.grid}>
    {Array(6).fill(0).map((_, i) => (
      <div key={i} className="skeleton" style={styles.skeleton} />
    ))}
  </div>
) : recipes.length === 0 ? (
  <div style={styles.empty}>
    <p style={styles.emptyIcon}>👨‍🍳</p>
    <p style={styles.emptyTitle}>No recipes yet</p>
    <p style={styles.emptySub}>Share your first recipe!</p>
    <button onClick={() => navigate("/add-recipe")} style={styles.emptyBtn}>
      + Add Recipe
    </button>
  </div>
) : (
  <div style={styles.grid}>
    {recipes.map((r) => (
      <div key={r._id} style={{ position: "relative" }}>
        <RecipeCard recipe={r} />
        <button
          onClick={(e) => handleDelete(r._id, e)}
          style={styles.deleteBtn}
        >
          🗑
        </button>
      </div>
    ))}
  </div>
)}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "var(--bg)", paddingBottom: "100px" },
  header: {
    background: "linear-gradient(135deg, #FF6B35, #FF8C42)",
    padding: "36px 20px 28px", textAlign: "center",
  },
  avatarWrap: { marginBottom: "12px" },
  avatarImg: {
    width: "80px", height: "80px", borderRadius: "50%",
    border: "3px solid rgba(255,255,255,0.6)", objectFit: "cover",
  },
  avatarFallback: {
    width: "80px", height: "80px", borderRadius: "50%",
    background: "rgba(255,255,255,0.25)", color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "2.2rem", fontWeight: "800", margin: "0 auto",
    border: "3px solid rgba(255,255,255,0.4)",
  },
  name: { color: "#fff", fontSize: "1.3rem", fontWeight: "800", margin: "0 0 4px" },
  email: { color: "rgba(255,255,255,0.75)", fontSize: "0.85rem", margin: "0 0 20px" },
  statsRow: {
    display: "inline-flex", alignItems: "center",
    background: "rgba(255,255,255,0.2)", backdropFilter: "blur(10px)",
    borderRadius: "14px", padding: "12px 28px", gap: "24px",
  },
  stat: { display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" },
  statNum: { color: "#fff", fontSize: "1.5rem", fontWeight: "800" },
  statLabel: { color: "rgba(255,255,255,0.8)", fontSize: "0.72rem" },
  statDivider: { width: "1px", height: "32px", background: "rgba(255,255,255,0.3)" },
  body: { padding: "20px 16px" },
  topRow: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", marginBottom: "16px",
  },
  sectionTitle: { fontSize: "1.1rem", fontWeight: "800", color: "var(--text)" },
  addBtn: {
    padding: "8px 16px", background: "var(--primary)", color: "#fff",
    border: "none", borderRadius: "10px", cursor: "pointer",
    fontWeight: "700", fontSize: "0.85rem",
  },
  grid: {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "8px",
},
skeleton: {
  borderRadius: "14px",
  paddingBottom: "100%",
},
deleteBtn: {
  position: "absolute", top: "6px", left: "6px",
  background: "rgba(239,68,68,0.85)",
  border: "none", borderRadius: "50%",
  width: "26px", height: "26px",
  display: "flex", alignItems: "center",
  justifyContent: "center", cursor: "pointer",
  fontSize: "0.75rem", color: "#fff",
  boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
},
  empty: { textAlign: "center", padding: "60px 20px" },
  emptyIcon: { fontSize: "3.5rem", marginBottom: "12px" },
  emptyTitle: { fontWeight: "700", fontSize: "1.1rem", marginBottom: "6px" },
  emptySub: { color: "var(--text-secondary)", marginBottom: "20px", fontSize: "0.9rem" },
  emptyBtn: {
    padding: "12px 28px", background: "var(--primary)", color: "#fff",
    border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: "700",
  },
};