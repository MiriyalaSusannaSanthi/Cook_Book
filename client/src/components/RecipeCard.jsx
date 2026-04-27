import { useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function RecipeCard({ recipe }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [likes, setLikes] = useState(recipe?.likes?.length || 0);
  const [liked, setLiked] = useState(
    recipe?.likes?.some((id) => id === user?.id) || false
  );

  if (!recipe) return null;

  const handleLike = async (e) => {
    e.stopPropagation();
    try {
      const res = await API.put(`/recipes/${recipe._id}/like`);
      setLikes(res.data.likes);
      setLiked(res.data.liked);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={styles.card} onClick={() => navigate(`/recipe/${recipe._id}`)}>
      {/* Image */}
      <div style={styles.imgBox}>
        {recipe.imageURL ? (
          <img src={recipe.imageURL} alt={recipe.title} style={styles.img} />
        ) : (
          <div style={styles.noImg}>🍳</div>
        )}
        {/* Badges */}
        <span style={styles.categoryBadge}>{recipe.category}</span>
        <button onClick={handleLike} style={styles.likeBtn}>
          {liked ? "❤️" : "🤍"}
          <span style={styles.likeCount}>{likes}</span>
        </button>
      </div>

      {/* Info */}
      <div style={styles.info}>
        <h3 style={styles.title}>{recipe.title}</h3>
        {recipe.description && (
          <p style={styles.desc}>{recipe.description}</p>
        )}
        <div style={styles.metaRow}>
          <span style={styles.metaChip}>⏱ {recipe.cookTime}m</span>
          <span style={styles.metaChip}>🍽 {recipe.servings} serv</span>
        </div>
        <div style={styles.author}>
          <div style={styles.authorDot}>
            {recipe.createdBy?.name?.charAt(0)?.toUpperCase()}
          </div>
          <span style={styles.authorName}>
            {recipe.createdBy?.name?.split(" ")[0] || "Chef"}
          </span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "#fff", borderRadius: "16px",
    overflow: "hidden", cursor: "pointer",
    border: "1px solid var(--border)",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    transition: "transform 0.15s, box-shadow 0.15s",
  },
  imgBox: { position: "relative", height: "160px", overflow: "hidden" },
  img: { width: "100%", height: "100%", objectFit: "cover" },
  noImg: {
    width: "100%", height: "100%",
    background: "var(--primary-light)",
    display: "flex", alignItems: "center",
    justifyContent: "center", fontSize: "2.5rem",
  },
  categoryBadge: {
    position: "absolute", top: "10px", left: "10px",
    background: "rgba(255,255,255,0.95)",
    color: "var(--primary)", padding: "4px 10px",
    borderRadius: "20px", fontSize: "0.7rem",
    fontWeight: "700", letterSpacing: "0.3px",
  },
  likeBtn: {
    position: "absolute", top: "10px", right: "10px",
    background: "rgba(0,0,0,0.4)",
    border: "none", borderRadius: "20px",
    cursor: "pointer", display: "flex",
    alignItems: "center", gap: "4px",
    padding: "4px 10px", fontSize: "0.85rem",
  },
  likeCount: { color: "#fff", fontSize: "0.75rem", fontWeight: "600" },
  info: { padding: "14px" },
  title: {
    fontSize: "0.95rem", fontWeight: "700",
    color: "var(--text)", margin: "0 0 5px",
    lineHeight: 1.35,
  },
  desc: {
    fontSize: "0.78rem", color: "var(--text-secondary)",
    margin: "0 0 10px", lineHeight: 1.5,
    display: "-webkit-box", WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical", overflow: "hidden",
  },
  metaRow: { display: "flex", gap: "6px", marginBottom: "10px" },
  metaChip: {
    background: "var(--primary-light)", color: "var(--primary)",
    padding: "3px 9px", borderRadius: "20px",
    fontSize: "0.72rem", fontWeight: "600",
  },
  author: { display: "flex", alignItems: "center", gap: "6px" },
  authorDot: {
    width: "22px", height: "22px", borderRadius: "50%",
    background: "var(--primary)", color: "#fff",
    display: "flex", alignItems: "center",
    justifyContent: "center", fontSize: "0.7rem", fontWeight: "700",
  },
  authorName: { fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: "500" },
};