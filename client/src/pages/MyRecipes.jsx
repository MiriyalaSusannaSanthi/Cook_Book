import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import RecipeCard from "../components/RecipeCard";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

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

  const handleDelete = async (id) => {
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
    <div style={styles.page} className="page">
      {/* Profile Header */}
      <div style={styles.profileHeader}>
        <div style={styles.avatar}>
          {user?.photoURL ? (
            <img src={user.photoURL} alt="avatar" style={styles.avatarImg} />
          ) : (
            <div style={styles.avatarFallback}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <h2 style={styles.userName}>{user?.name}</h2>
        <p style={styles.userEmail}>{user?.email}</p>
        <div style={styles.statsRow}>
          <div style={styles.statBox}>
            <span style={styles.statNum}>{recipes.length}</span>
            <span style={styles.statLabel}>Recipes</span>
          </div>
          <div style={styles.statBox}>
            <span style={styles.statNum}>
              {recipes.reduce((acc, r) => acc + (r.likes?.length || 0), 0)}
            </span>
            <span style={styles.statLabel}>Total Likes</span>
          </div>
        </div>
      </div>

      {/* Recipes */}
      <div style={styles.content}>
        <div style={styles.sectionHeader}>
          <h3 style={styles.sectionTitle}>My Recipes</h3>
          <button onClick={() => navigate("/add-recipe")} style={styles.addBtn}>
            + New
          </button>
        </div>

        {loading ? (
          <div style={styles.grid}>
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton" style={styles.skeletonCard} />
            ))}
          </div>
        ) : recipes.length === 0 ? (
          <div style={styles.empty}>
            <p style={styles.emptyIcon}>👨‍🍳</p>
            <p style={styles.emptyTitle}>No recipes yet</p>
            <p style={styles.emptySub}>Share your first recipe with the world!</p>
            <button onClick={() => navigate("/add-recipe")} style={styles.emptyBtn}>
              + Add Recipe
            </button>
          </div>
        ) : (
          <div style={styles.grid}>
            {recipes.map((r) => (
              <div key={r._id} style={styles.recipeWrapper}>
                <RecipeCard recipe={r} />
                <button onClick={() => handleDelete(r._id)} style={styles.deleteBtn}>
                  🗑 Delete
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
  profileHeader: {
    background: "linear-gradient(135deg, #FF6B35, #F7931E)",
    padding: "32px 20px 28px", textAlign: "center",
  },
  avatar: { marginBottom: "12px" },
  avatarImg: { width: "72px", height: "72px", borderRadius: "50%", border: "3px solid #fff" },
  avatarFallback: {
    width: "72px", height: "72px", borderRadius: "50%",
    background: "rgba(255,255,255,0.3)", color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "2rem", fontWeight: "800", margin: "0 auto",
    border: "3px solid rgba(255,255,255,0.5)",
  },
  userName: { color: "#fff", fontSize: "1.3rem", fontWeight: "800", margin: "0 0 4px" },
  userEmail: { color: "rgba(255,255,255,0.8)", fontSize: "0.85rem", margin: "0 0 16px" },
  statsRow: { display: "flex", gap: "12px", justifyContent: "center" },
  statBox: {
    background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)",
    borderRadius: "12px", padding: "10px 24px",
    display: "flex", flexDirection: "column", alignItems: "center",
  },
  statNum: { color: "#fff", fontSize: "1.5rem", fontWeight: "800" },
  statLabel: { color: "rgba(255,255,255,0.8)", fontSize: "0.75rem" },
  content: { padding: "20px 16px" },
  sectionHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" },
  sectionTitle: { fontSize: "1.1rem", fontWeight: "800", color: "var(--text)" },
  addBtn: {
    padding: "8px 16px", background: "var(--primary)", color: "#fff",
    border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "700", fontSize: "0.85rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
    gap: "14px",
  },
  skeletonCard: { height: "260px", borderRadius: "var(--radius-lg)" },
  recipeWrapper: { display: "flex", flexDirection: "column", gap: "6px" },
  deleteBtn: {
    padding: "8px", background: "#FFF5F5", color: "#FC8181",
    border: "none", borderRadius: "10px", cursor: "pointer",
    fontWeight: "600", fontSize: "0.85rem",
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