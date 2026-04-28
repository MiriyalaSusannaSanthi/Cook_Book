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
      {/* Square Image Box */}
      <div style={styles.imgBox}>
        {recipe.imageURL ? (
          <img src={recipe.imageURL} alt={recipe.title} style={styles.img} />
        ) : (
          <div style={styles.noImg}>🍳</div>
        )}
        {/* Overlay on hover */}
        <div style={styles.overlay}>
          <span style={styles.overlayLikes}>❤️ {likes}</span>
        </div>
        {/* Like button */}
        <button onClick={handleLike} style={styles.likeBtn}>
          {liked ? "❤️" : "🤍"}
        </button>
      </div>

      {/* Card Info */}
      <div style={styles.info}>
        <p style={styles.title}>{recipe.title}</p>
        <div style={styles.meta}>
          <span style={styles.metaText}>⏱ {recipe.cookTime}m</span>
          <span style={styles.dot}>·</span>
          <span style={{
            ...styles.categoryTag,
          }}>
            {recipe.category}
          </span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "#fff",
    borderRadius: "14px",
    overflow: "hidden",
    cursor: "pointer",
    border: "1px solid #F0F0F0",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    transition: "transform 0.15s",
  },
  imgBox: {
    position: "relative",
    width: "100%",
    paddingBottom: "100%", // Perfect square
    overflow: "hidden",
    background: "#FFF4F0",
  },
  img: {
    position: "absolute",
    top: 0, left: 0,
    width: "100%", height: "100%",
    objectFit: "cover",
  },
  noImg: {
    position: "absolute",
    top: 0, left: 0,
    width: "100%", height: "100%",
    display: "flex", alignItems: "center",
    justifyContent: "center", fontSize: "2rem",
    background: "#FFF4F0",
  },
  overlay: {
    position: "absolute",
    bottom: 0, left: 0, right: 0,
    background: "linear-gradient(transparent, rgba(0,0,0,0.5))",
    padding: "20px 8px 8px",
    display: "flex", justifyContent: "flex-end",
  },
  overlayLikes: {
    color: "#fff", fontSize: "0.72rem",
    fontWeight: "700",
  },
  likeBtn: {
    position: "absolute", top: "6px", right: "6px",
    background: "rgba(255,255,255,0.9)",
    border: "none", borderRadius: "50%",
    width: "28px", height: "28px",
    display: "flex", alignItems: "center",
    justifyContent: "center", cursor: "pointer",
    fontSize: "0.85rem",
    boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
  },
  info: { padding: "10px 10px 12px" },
  title: {
    fontSize: "0.82rem", fontWeight: "700",
    color: "#1C1C1E", margin: "0 0 5px",
    lineHeight: 1.3,
    overflow: "hidden", display: "-webkit-box",
    WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
  },
  meta: {
    display: "flex", alignItems: "center", gap: "5px",
  },
  metaText: { fontSize: "0.68rem", color: "#9CA3AF" },
  dot: { color: "#D1D5DB", fontSize: "0.7rem" },
  categoryTag: {
    fontSize: "0.65rem", fontWeight: "700",
    color: "#FF6B35", background: "#FFF4F0",
    padding: "2px 7px", borderRadius: "10px",
  },
};