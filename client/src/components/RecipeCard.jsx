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
      <div style={styles.imgWrapper}>
        {recipe.imageURL ? (
          <img src={recipe.imageURL} alt={recipe.title} style={styles.img} />
        ) : (
          <div style={styles.noImg}>🍳</div>
        )}
        {/* Category Badge */}
        <span style={styles.badge}>{recipe.category}</span>
        {/* Like Button */}
        <button onClick={handleLike} style={styles.likeBtn}>
          <span style={{ color: liked ? "#FC8181" : "#fff", fontSize: "1.1rem" }}>
            {liked ? "❤️" : "🤍"}
          </span>
          <span style={styles.likeCount}>{likes}</span>
        </button>
      </div>

      {/* Content */}
      <div style={styles.content}>
        <h3 style={styles.title}>{recipe.title}</h3>
        {recipe.description && (
          <p style={styles.desc}>{recipe.description}</p>
        )}

        {/* Meta */}
        <div style={styles.meta}>
          <span style={styles.metaItem}>⏱ {recipe.cookTime}m</span>
          <span style={styles.metaDot}>·</span>
          <span style={styles.metaItem}>🍽 {recipe.servings} servings</span>
          <span style={styles.metaDot}>·</span>
          <span style={styles.metaItem}>👤 {recipe.createdBy?.name?.split(" ")[0] || "Chef"}</span>
        </div>

        {/* Ingredient Tags */}
        <div style={styles.tags}>
          {recipe.ingredients?.slice(0, 3).map((ing, i) => (
            <span key={i} style={styles.tag}>{ing.name}</span>
          ))}
          {recipe.ingredients?.length > 3 && (
            <span style={{ ...styles.tag, background: "var(--border)", color: "var(--text-secondary)" }}>
              +{recipe.ingredients.length - 3}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "var(--card)", borderRadius: "var(--radius-lg)",
    overflow: "hidden", cursor: "pointer",
    boxShadow: "var(--shadow-sm)",
    border: "1px solid var(--border)",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  imgWrapper: { position: "relative" },
  img: { width: "100%", height: "180px", objectFit: "cover", display: "block" },
  noImg: {
    width: "100%", height: "180px", background: "var(--primary-light)",
    display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3rem",
  },
  badge: {
    position: "absolute", top: "10px", left: "10px",
    background: "rgba(255,255,255,0.92)", backdropFilter: "blur(8px)",
    color: "var(--primary)", padding: "4px 10px", borderRadius: "20px",
    fontSize: "0.72rem", fontWeight: "700",
  },
  likeBtn: {
    position: "absolute", top: "10px", right: "10px",
    background: "rgba(0,0,0,0.35)", backdropFilter: "blur(8px)",
    border: "none", borderRadius: "20px", cursor: "pointer",
    display: "flex", alignItems: "center", gap: "4px",
    padding: "4px 10px",
  },
  likeCount: { color: "#fff", fontSize: "0.8rem", fontWeight: "600" },
  content: { padding: "14px" },
  title: { fontSize: "1rem", fontWeight: "700", color: "var(--text)", margin: "0 0 4px" },
  desc: {
    fontSize: "0.82rem", color: "var(--text-secondary)",
    margin: "0 0 10px", lineHeight: 1.5,
    overflow: "hidden", display: "-webkit-box",
    WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
  },
  meta: { display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" },
  metaItem: { fontSize: "0.78rem", color: "var(--text-secondary)" },
  metaDot: { color: "var(--border)", fontSize: "0.8rem" },
  tags: { display: "flex", flexWrap: "wrap", gap: "5px" },
  tag: {
    background: "var(--primary-light)", color: "var(--primary)",
    padding: "3px 8px", borderRadius: "20px", fontSize: "0.72rem", fontWeight: "600",
  },
};