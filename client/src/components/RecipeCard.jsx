import { useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function RecipeCard({ recipe }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [likes, setLikes] = useState(recipe.likes?.length || 0);
  const [liked, setLiked] = useState(recipe.likes?.includes(user?.id));

  const handleLike = async (e) => {
    e.stopPropagation(); // prevent navigating to detail page
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
      {recipe.imageURL && (
        <img src={recipe.imageURL} alt={recipe.title} style={styles.img} />
      )}
      <div style={styles.body}>
        <h3 style={styles.title}>{recipe.title}</h3>
        <p style={styles.meta}>
          ⏱ {recipe.cookTime} mins &nbsp;|&nbsp; 🍽 {recipe.servings} servings
        </p>
        <p style={styles.desc}>{recipe.description}</p>
        <div style={styles.tags}>
          {recipe.ingredients?.slice(0, 4).map((ing, i) => (
            <span key={i} style={styles.tag}>{ing.name}</span>
          ))}
          {recipe.ingredients?.length > 4 && (
            <span style={styles.tag}>+{recipe.ingredients.length - 4} more</span>
          )}
        </div>
        <div style={styles.footer}>
          <p style={styles.author}>👤 {recipe.createdBy?.name || "Unknown"}</p>
          <button onClick={handleLike} style={{
            ...styles.likeBtn,
            color: liked ? "#e53e3e" : "#aaa",
          }}>
            {liked ? "❤️" : "🤍"} {likes}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "#fff", borderRadius: "12px", overflow: "hidden",
    boxShadow: "0 2px 12px rgba(0,0,0,0.1)", transition: "transform 0.2s",
    cursor: "pointer",
  },
  img: { width: "100%", height: "180px", objectFit: "cover" },
  body: { padding: "16px" },
  title: { margin: "0 0 6px", fontSize: "1.1rem", color: "#222" },
  meta: { fontSize: "0.85rem", color: "#888", margin: "0 0 8px" },
  desc: { fontSize: "0.9rem", color: "#555", margin: "0 0 10px" },
  tags: { display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "10px" },
  tag: {
    background: "#fff3ee", color: "#ff6b35", padding: "3px 10px",
    borderRadius: "20px", fontSize: "0.8rem",
  },
  footer: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  author: { fontSize: "0.8rem", color: "#aaa", margin: 0 },
  likeBtn: {
    background: "none", border: "none", cursor: "pointer",
    fontSize: "0.95rem", fontWeight: "600", padding: "4px 8px",
    borderRadius: "8px", transition: "all 0.2s",
  },
};