import { useState } from "react";
import API from "../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function AddRecipe() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "", description: "", cookTime: "", servings: "",
    category: "General", imageURL: "", isPublic: true,
  });
  const [ingredients, setIngredients] = useState([{ name: "", quantity: "" }]);
  const [steps, setSteps] = useState([""]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleIngredientChange = (i, field, value) => {
    const updated = [...ingredients];
    updated[i][field] = value;
    setIngredients(updated);
  };

  const handleStepChange = (i, value) => {
    const updated = [...steps];
    updated[i] = value;
    setSteps(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/recipes", { ...form, ingredients, steps });
      toast.success("Recipe added! 🎉");
      navigate("/my-recipes");
    } catch {
      toast.error("Failed to add recipe");
    } finally {
      setLoading(false);
    }
  };

  const CATEGORIES = ["General", "Breakfast", "Lunch", "Dinner", "Snacks", "Drinks", "Dessert"];

  return (
    <div style={styles.page} className="page">
      {/* Header */}
      <div style={styles.header}>
        <button onClick={() => navigate(-1)} style={styles.back}>←</button>
        <h1 style={styles.heading}>Add Recipe</h1>
        <div />
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Image Preview */}
        {form.imageURL ? (
          <img src={form.imageURL} alt="preview" style={styles.imagePreview} />
        ) : (
          <div style={styles.imagePlaceholder}>
            <p style={styles.imagePlaceholderIcon}>📸</p>
            <p style={styles.imagePlaceholderText}>Add an image URL below</p>
          </div>
        )}

        {/* Basic Info */}
        <div style={styles.section}>
          <p style={styles.sectionTitle}>Basic Info</p>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Recipe Title *</label>
            <input name="title" style={styles.input} placeholder="e.g. Masala Maggi"
              value={form.title} onChange={handleChange} required />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Description</label>
            <textarea name="description" style={styles.textarea}
              placeholder="Describe your recipe..." value={form.description}
              onChange={handleChange} rows={3} />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Image URL</label>
            <input name="imageURL" style={styles.input}
              placeholder="https://..." value={form.imageURL} onChange={handleChange} />
          </div>
        </div>

        {/* Details */}
        <div style={styles.section}>
          <p style={styles.sectionTitle}>Details</p>
          <div style={styles.row}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Cook Time (mins)</label>
              <input name="cookTime" type="number" style={styles.input}
                placeholder="30" value={form.cookTime} onChange={handleChange} />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Servings</label>
              <input name="servings" type="number" style={styles.input}
                placeholder="2" value={form.servings} onChange={handleChange} />
            </div>
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Category</label>
            <select name="category" style={styles.input}
              value={form.category} onChange={handleChange}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Ingredients */}
        <div style={styles.section}>
          <p style={styles.sectionTitle}>Ingredients</p>
          {ingredients.map((ing, i) => (
            <div key={i} style={styles.ingredientRow}>
              <input placeholder="Ingredient" value={ing.name}
                onChange={(e) => handleIngredientChange(i, "name", e.target.value)}
                style={{ ...styles.input, flex: 2 }} />
              <input placeholder="Qty" value={ing.quantity}
                onChange={(e) => handleIngredientChange(i, "quantity", e.target.value)}
                style={{ ...styles.input, flex: 1 }} />
              {ingredients.length > 1 && (
                <button type="button"
                  onClick={() => setIngredients(ingredients.filter((_, idx) => idx !== i))}
                  style={styles.removeBtn}>✕</button>
              )}
            </div>
          ))}
          <button type="button"
            onClick={() => setIngredients([...ingredients, { name: "", quantity: "" }])}
            style={styles.addBtn}>
            + Add Ingredient
          </button>
        </div>

        {/* Steps */}
        <div style={styles.section}>
          <p style={styles.sectionTitle}>Cooking Steps</p>
          {steps.map((step, i) => (
            <div key={i} style={styles.stepRow}>
              <div style={styles.stepNum}>{i + 1}</div>
              <textarea
                placeholder={`Step ${i + 1}...`}
                value={step}
                onChange={(e) => handleStepChange(i, e.target.value)}
                style={{ ...styles.textarea, flex: 1 }}
                rows={2}
              />
              {steps.length > 1 && (
                <button type="button"
                  onClick={() => setSteps(steps.filter((_, idx) => idx !== i))}
                  style={styles.removeBtn}>✕</button>
              )}
            </div>
          ))}
          <button type="button"
            onClick={() => setSteps([...steps, ""])}
            style={styles.addBtn}>
            + Add Step
          </button>
        </div>

        {/* Submit */}
        <button type="submit" disabled={loading} style={styles.submitBtn}>
          {loading ? "Saving..." : "🍳 Save Recipe"}
        </button>
      </form>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "var(--bg)", paddingBottom: "100px" },
  header: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "16px 20px", background: "#fff", borderBottom: "1px solid var(--border)",
    position: "sticky", top: 0, zIndex: 10,
  },
  back: {
    background: "var(--bg)", border: "none", cursor: "pointer",
    fontSize: "1.2rem", padding: "8px 12px", borderRadius: "10px", fontWeight: "700",
  },
  heading: { fontSize: "1.1rem", fontWeight: "800", color: "var(--text)" },
  form: { padding: "20px 16px", display: "flex", flexDirection: "column", gap: "8px" },
  imagePreview: {
    width: "100%", height: "200px", objectFit: "cover",
    borderRadius: "var(--radius-lg)", marginBottom: "8px",
  },
  imagePlaceholder: {
    height: "160px", background: "var(--primary-light)",
    borderRadius: "var(--radius-lg)", display: "flex",
    flexDirection: "column", alignItems: "center", justifyContent: "center",
    marginBottom: "8px", border: "2px dashed var(--primary)",
  },
  imagePlaceholderIcon: { fontSize: "2.5rem", margin: "0 0 8px" },
  imagePlaceholderText: { color: "var(--primary)", fontWeight: "600", fontSize: "0.9rem" },
  section: {
    background: "#fff", borderRadius: "var(--radius-lg)",
    padding: "18px", display: "flex", flexDirection: "column", gap: "14px",
  },
  sectionTitle: { fontWeight: "800", fontSize: "1rem", color: "var(--text)", margin: 0 },
  inputGroup: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "0.82rem", fontWeight: "600", color: "var(--text-secondary)" },
  input: {
    padding: "12px 14px", borderRadius: "var(--radius-sm)",
    border: "1.5px solid var(--border)", fontSize: "0.95rem",
    outline: "none", background: "var(--bg)", color: "var(--text)",
  },
  textarea: {
    padding: "12px 14px", borderRadius: "var(--radius-sm)",
    border: "1.5px solid var(--border)", fontSize: "0.95rem",
    outline: "none", resize: "vertical", background: "var(--bg)",
    color: "var(--text)", fontFamily: "inherit",
  },
  row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" },
  ingredientRow: { display: "flex", gap: "8px", alignItems: "center" },
  stepRow: { display: "flex", gap: "10px", alignItems: "flex-start" },
  stepNum: {
    width: "28px", height: "28px", borderRadius: "50%",
    background: "var(--primary)", color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: "700", fontSize: "0.85rem", flexShrink: 0, marginTop: "10px",
  },
  addBtn: {
    padding: "10px", background: "var(--primary-light)", color: "var(--primary)",
    border: "1.5px dashed var(--primary)", borderRadius: "var(--radius-sm)",
    cursor: "pointer", fontWeight: "700", fontSize: "0.9rem",
  },
  removeBtn: {
    background: "#FFF5F5", border: "none", color: "#FC8181",
    borderRadius: "8px", cursor: "pointer", padding: "8px 10px",
    fontWeight: "700", flexShrink: 0,
  },
  submitBtn: {
    padding: "16px", background: "var(--primary)", color: "#fff",
    border: "none", borderRadius: "var(--radius-md)", fontSize: "1rem",
    cursor: "pointer", fontWeight: "800", marginTop: "8px",
  },
};