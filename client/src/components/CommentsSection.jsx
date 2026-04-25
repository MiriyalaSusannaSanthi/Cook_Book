import { useState, useEffect } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const StarRating = ({ value, onChange, readonly }) => {
  const [hovered, setHovered] = useState(0);
  return (
    <div style={{ display: "flex", gap: "4px" }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => !readonly && onChange && onChange(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          style={{
            fontSize: readonly ? "1rem" : "1.5rem",
            cursor: readonly ? "default" : "pointer",
            color: star <= (hovered || value) ? "#f6ad55" : "#ddd",
            transition: "color 0.15s",
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default function CommentsSection({ recipeId }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [avgRating, setAvgRating] = useState(null);
  const [total, setTotal] = useState(0);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = async () => {
    try {
      const res = await API.get(`/recipes/${recipeId}/comments`);
      setComments(res.data.comments);
      setAvgRating(res.data.avgRating);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchComments(); }, [recipeId]);

  const handleSubmit = async () => {
    if (!rating) return toast.error("Please select a star rating");
    if (!comment.trim()) return toast.error("Please write a comment");
    setSubmitting(true);
    try {
      await API.post(`/recipes/${recipeId}/comments`, { comment, rating });
      toast.success("Review added! ⭐");
      setComment("");
      setRating(0);
      fetchComments();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add review");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm("Delete your review?")) return;
    try {
      await API.delete(`/recipes/${recipeId}/comments/${commentId}`);
      toast.success("Review deleted");
      fetchComments();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const alreadyReviewed = comments.some(
    (c) => c.user?._id === user?.id || c.user?.id === user?.id
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>⭐ Reviews</h2>
        {avgRating && (
          <div style={styles.avgBox}>
            <span style={styles.avgNumber}>{avgRating}</span>
            <StarRating value={Math.round(avgRating)} readonly />
            <span style={styles.totalText}>({total} review{total !== 1 ? "s" : ""})</span>
          </div>
        )}
      </div>

      {/* Add Review Form */}
      {!alreadyReviewed ? (
        <div style={styles.form}>
          <p style={styles.formTitle}>Leave a Review</p>
          <StarRating value={rating} onChange={setRating} />
          <textarea
            style={styles.textarea}
            placeholder="Share your experience with this recipe..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
          />
          <button
            onClick={handleSubmit}
            disabled={submitting}
            style={styles.submitBtn}
          >
            {submitting ? "Posting..." : "Post Review ⭐"}
          </button>
        </div>
      ) : (
        <div style={styles.alreadyReviewed}>
          ✅ You have already reviewed this recipe
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <p style={styles.loading}>Loading reviews...</p>
      ) : comments.length === 0 ? (
        <p style={styles.noComments}>No reviews yet. Be the first! 🍳</p>
      ) : (
        <div style={styles.list}>
          {comments.map((c) => (
            <div key={c._id} style={styles.commentCard}>
              <div style={styles.commentHeader}>
                <div style={styles.userInfo}>
                  <div style={styles.avatar}>
                    {c.user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p style={styles.userName}>{c.user?.name}</p>
                    <p style={styles.date}>
                      {new Date(c.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div style={styles.commentRight}>
                  <StarRating value={c.rating} readonly />
                  {(c.user?._id === user?.id || c.user?.id === user?.id) && (
                    <button
                      onClick={() => handleDelete(c._id)}
                      style={styles.deleteBtn}
                    >
                      🗑
                    </button>
                  )}
                </div>
              </div>
              <p style={styles.commentText}>{c.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { marginTop: "40px" },
  header: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    flexWrap: "wrap", gap: "12px", marginBottom: "20px",
    borderBottom: "2px solid #fff3ee", paddingBottom: "12px",
  },
  title: { fontSize: "1.4rem", color: "#222", margin: 0 },
  avgBox: { display: "flex", alignItems: "center", gap: "8px" },
  avgNumber: { fontSize: "2rem", fontWeight: "bold", color: "#ff6b35" },
  totalText: { color: "#888", fontSize: "0.9rem" },
  form: {
    background: "#fff8f5", borderRadius: "12px", padding: "20px",
    marginBottom: "24px", display: "flex", flexDirection: "column", gap: "12px",
  },
  formTitle: { margin: 0, fontWeight: "600", color: "#333" },
  textarea: {
    padding: "12px", borderRadius: "8px", border: "1px solid #ddd",
    fontSize: "0.95rem", resize: "vertical", fontFamily: "inherit",
  },
  submitBtn: {
    padding: "10px 20px", background: "#ff6b35", color: "#fff",
    border: "none", borderRadius: "8px", cursor: "pointer",
    fontWeight: "bold", fontSize: "0.95rem", width: "fit-content",
  },
  alreadyReviewed: {
    background: "#f0fff4", color: "#38a169", padding: "12px 16px",
    borderRadius: "8px", marginBottom: "20px", fontSize: "0.9rem",
  },
  loading: { color: "#888", textAlign: "center", padding: "20px" },
  noComments: { color: "#aaa", textAlign: "center", padding: "30px" },
  list: { display: "flex", flexDirection: "column", gap: "16px" },
  commentCard: {
    background: "#fff", border: "1px solid #f0f0f0",
    borderRadius: "12px", padding: "16px",
  },
  commentHeader: {
    display: "flex", justifyContent: "space-between",
    alignItems: "flex-start", marginBottom: "10px",
  },
  userInfo: { display: "flex", gap: "10px", alignItems: "center" },
  avatar: {
    width: "36px", height: "36px", borderRadius: "50%",
    background: "#ff6b35", color: "#fff", display: "flex",
    alignItems: "center", justifyContent: "center",
    fontWeight: "bold", fontSize: "1rem", flexShrink: 0,
  },
  userName: { margin: 0, fontWeight: "600", color: "#333", fontSize: "0.95rem" },
  date: { margin: 0, color: "#aaa", fontSize: "0.8rem" },
  commentRight: { display: "flex", alignItems: "center", gap: "8px" },
  deleteBtn: {
    background: "none", border: "none", cursor: "pointer",
    fontSize: "1rem", color: "#e53e3e",
  },
  commentText: { margin: 0, color: "#555", lineHeight: 1.6, fontSize: "0.95rem" },
};