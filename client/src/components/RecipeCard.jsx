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
      <div style={styles.imgWrap}>
        {recipe.imageURL ? (
          <img src={recipe.imageURL} alt={recipe.title} style={styles.img} />
        ) : (
          <div style={styles.noImg}>🍳</div>
        )}
        {/* Gradient overlay */}
        <div style={styles.gradient} />
        {/* Like button */}
        <button
          onClick={handleLike}
          style={{
            ...styles.likeBtn,
            background: liked ? "#FF6B35" : "rgba(255,255,255,0.95)",
          }}
        >
          <span style={{ fontSize: "11px" }}>{liked ? "❤️" : "🤍"}</span>
        </button>
        {/* Cook time badge */}
        <div style={styles.timeBadge}>
          <span style={styles.timeText}>⏱ {recipe.cookTime}m</span>
        </div>
      </div>

      {/* Content */}
      <div style={styles.content}>
        <p style={styles.category}>{recipe.category?.toUpperCase()}</p>
        <h3 style={styles.title}>{recipe.title}</h3>
        <div style={styles.footer}>
          <div style={styles.authorRow}>
            <div style={styles.authorDot}>
              {recipe.createdBy?.name?.charAt(0)?.toUpperCase() || "C"}
            </div>
            <span style={styles.authorName}>
              {recipe.createdBy?.name?.split(" ")[0] || "Chef"}
            </span>
          </div>
          <span style={styles.likesText}>❤️ {likes}</span>
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
    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
    transition: "transform 0.15s, box-shadow 0.15s",
  },
  imgWrap: {
    position: "relative",
    width: "100%",
    paddingBottom: "72%",
    overflow: "hidden",
    background: "#FFF4F0",
  },
  img: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.3s",
  },
  noImg: {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "2rem",
    background: "#FFF4F0",
  },
  gradient: {
    position: "absolute",
    bottom: 0, left: 0, right: 0,
    height: "50%",
    background: "linear-gradient(transparent, rgba(0,0,0,0.3))",
  },
  likeBtn: {
    position: "absolute",
    top: "8px", right: "8px",
    border: "none", borderRadius: "50%",
    width: "28px", height: "28px",
    display: "flex", alignItems: "center",
    justifyContent: "center", cursor: "pointer",
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
    transition: "all 0.2s",
  },
  timeBadge: {
    position: "absolute",
    bottom: "8px", right: "8px",
    background: "rgba(0,0,0,0.55)",
    borderRadius: "8px",
    padding: "3px 7px",
  },
  timeText: {
    color: "#fff",
    fontSize: "10px",
    fontWeight: "700",
  },
  content: {
    padding: "10px 12px 12px",
  },
  category: {
    fontSize: "9px",
    fontWeight: "700",
    color: "#FF6B35",
    letterSpacing: "0.8px",
    margin: "0 0 4px",
  },
  title: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#1C1C1E",
    margin: "0 0 8px",
    lineHeight: 1.3,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  footer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  authorRow: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  authorDot: {
    width: "18px", height: "18px",
    borderRadius: "50%",
    background: "#FF6B35",
    color: "#fff",
    display: "flex", alignItems: "center",
    justifyContent: "center",
    fontSize: "9px", fontWeight: "700",
  },
  authorName: {
    fontSize: "11px",
    color: "#9CA3AF",
    fontWeight: "500",
  },
  likesText: {
    fontSize: "11px",
    color: "#9CA3AF",
    fontWeight: "600",
  },
};