import { useState } from "react";
import API from "../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CUISINES = ["Any", "Indian", "Italian", "Chinese", "Mexican", "American", "Mediterranean"];

export default function AIRecipeGenerator() {
  const navigate = useNavigate();
  const [ingredientInput, setIngredientInput] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [cookTime, setCookTime] = useState("");
  const [servings, setServings] = useState("");
  const [cuisine, setCuisine] = useState("Any");
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState(null);
  const [saving, setSaving] = useState(false);

  const addIngredient = () => {
    const trimmed = ingredientInput.trim();
    if (!trimmed) return;
    if (ingredients.includes(trimmed.toLowerCase())) {
      toast.error("Ingredient already added");
      return;
    }
    setIngredients([...ingredients, trimmed.toLowerCase()]);
    setIngredientInput("");
  };

  const removeIngredient = (ing) => {
    setIngredients(ingredients.filter((i) => i !== ing));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addIngredient();
    }
  };

  const generateRecipe = async () => {
    if (ingredients.length === 0) {
      return toast.error("Add at least one ingredient!");
    }
    setLoading(true);
    setRecipe(null);
    try {
      const res = await API.post("/ai/generate-recipe", {
        ingredients,
        cookTime: cookTime || null,
        servings: servings || null,
        cuisine: cuisine === "Any" ? null : cuisine,
      });
      setRecipe(res.data);
      toast.success("Recipe generated! 🤖✨");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to generate recipe");
    } finally {
      setLoading(false);
    }
  };

  const saveRecipe = async () => {
    if (!recipe) return;
    setSaving(true);
    try {
      await API.post("/recipes", {
        ...recipe,
        imageURL: "",
        isPublic: true,
      });
      toast.success("Recipe saved to your collection! 🎉");
      navigate("/my-recipes");
    } catch (err) {
      toast.error("Failed to save recipe");
    } finally {
      setSaving(false);
    }
  };

  const addToShoppingList = () => {
    if (!recipe) return;
    const existing = JSON.parse(
      localStorage.getItem("smartchef_shopping") || "[]"
    );
    const newItems = recipe.ingredients.map((ing) => ({
      name: ing.name,
      quantity: ing.quantity,
      recipeName: recipe.title,
      checked: false,
    }));
    const filtered = existing.filter((i) => i.recipeName !== recipe.title);
    localStorage.setItem(
      "smartchef_shopping",
      JSON.stringify([...filtered, ...newItems])
    );
    toast.success("Added to shopping list! 🛒");
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.heading}>🤖 AI Recipe Generator</h2>
        <p style={styles.sub}>
          Tell me what you have and I'll create a recipe for you!
        </p>
      </div>

      {/* Input Section */}
      <div style={styles.inputCard}>
        {/* Ingredient Input */}
        <div style={styles.field}>
          <label style={styles.label}>
            🥕 What ingredients do you have?
          </label>
          <div style={styles.inputRow}>
            <input
              style={styles.input}
              placeholder="Type ingredient and press Enter (e.g. eggs)"
              value={ingredientInput}
              onChange={(e) => setIngredientInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button onClick={addIngredient} style={styles.addBtn}>
              + Add
            </button>
          </div>

          {/* Ingredient Tags */}
          {ingredients.length > 0 && (
            <div style={styles.tagRow}>
              {ingredients.map((ing) => (
                <span key={ing} style={styles.ingTag}>
                  {ing}
                  <button
                    onClick={() => removeIngredient(ing)}
                    style={styles.removeTag}
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Options Row */}
        <div style={styles.optionsRow}>
          <div style={styles.field}>
            <label style={styles.label}>⏱ Max Cook Time (mins)</label>
            <input
              style={styles.smallInput}
              type="number"
              placeholder="e.g. 30"
              value={cookTime}
              onChange={(e) => setCookTime(e.target.value)}
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>🍽 Servings</label>
            <input
              style={styles.smallInput}
              type="number"
              placeholder="e.g. 2"
              value={servings}
              onChange={(e) => setServings(e.target.value)}
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>🌍 Cuisine Style</label>
            <select
              style={styles.smallInput}
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
            >
              {CUISINES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={generateRecipe}
          disabled={loading}
          style={{
            ...styles.generateBtn,
            opacity: loading ? 0.8 : 1,
          }}
        >
          {loading ? (
            <span>🤖 AI is cooking up a recipe...</span>
          ) : (
            <span>✨ Generate Recipe with AI</span>
          )}
        </button>
      </div>

      {/* Loading Animation */}
      {loading && (
        <div style={styles.loadingBox}>
          <div style={styles.loadingEmojis}>
            {["🥕", "🧅", "🍳", "🤖", "✨"].map((e, i) => (
              <span
                key={i}
                style={{
                  fontSize: "2rem",
                  animation: `bounce 1s ease-in-out ${i * 0.2}s infinite`,
                }}
              >
                {e}
              </span>
            ))}
          </div>
          <p style={styles.loadingText}>
            AI Chef is creating your recipe...
          </p>
          <style>{`
            @keyframes bounce {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-12px); }
            }
          `}</style>
        </div>
      )}

      {/* Generated Recipe */}
      {recipe && !loading && (
        <div style={styles.recipeCard}>
          {/* AI Badge */}
          <div style={styles.aiBadge}>🤖 AI Generated Recipe</div>

          {/* Title */}
          <h2 style={styles.recipeTitle}>{recipe.title}</h2>
          <p style={styles.recipeDesc}>{recipe.description}</p>

          {/* Meta */}
          <div style={styles.metaRow}>
            <span style={styles.metaItem}>⏱ {recipe.cookTime} mins</span>
            <span style={styles.metaItem}>🍽 {recipe.servings} servings</span>
            <span style={styles.metaItem}>🏷 {recipe.category}</span>
          </div>

          {/* Tips */}
          {recipe.tips && (
            <div style={styles.tipsBox}>
              💡 <strong>Chef's Tip:</strong> {recipe.tips}
            </div>
          )}

          {/* Ingredients */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>🛒 Ingredients</h3>
            <div style={styles.ingredientGrid}>
              {recipe.ingredients?.map((ing, i) => (
                <div key={i} style={styles.ingredientCard}>
                  <span style={styles.ingName}>{ing.name}</span>
                  <span style={styles.ingQty}>{ing.quantity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Steps */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>👨‍🍳 Cooking Steps</h3>
            <div style={styles.steps}>
              {recipe.steps?.map((step, i) => (
                <div key={i} style={styles.step}>
                  <div style={styles.stepNum}>{i + 1}</div>
                  <p style={styles.stepText}>{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={styles.actionRow}>
            <button onClick={saveRecipe} disabled={saving} style={styles.saveBtn}>
              {saving ? "Saving..." : "💾 Save to My Recipes"}
            </button>
            <button onClick={addToShoppingList} style={styles.shopBtn}>
              🛒 Add to Shopping List
            </button>
            <button
              onClick={() => { setRecipe(null); setIngredients([]); }}
              style={styles.newBtn}
            >
              🔄 Generate New
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: "24px", maxWidth: "800px", margin: "0 auto" },
  header: { marginBottom: "24px" },
  heading: { fontSize: "1.8rem", margin: "0 0 8px", color: "#222" },
  sub: { color: "#888", margin: 0 },
  inputCard: {
    background: "#fff", borderRadius: "16px", padding: "24px",
    boxShadow: "0 2px 16px rgba(0,0,0,0.08)", marginBottom: "24px",
    border: "1px solid #f0f0f0",
  },
  field: { display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" },
  label: { fontWeight: "600", color: "#333", fontSize: "0.95rem" },
  inputRow: { display: "flex", gap: "10px" },
  input: {
    flex: 1, padding: "10px 14px", borderRadius: "8px",
    border: "1px solid #ddd", fontSize: "1rem", outline: "none",
  },
  addBtn: {
    padding: "10px 18px", background: "#ff6b35", color: "#fff",
    border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold",
  },
  tagRow: { display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "8px" },
  ingTag: {
    background: "#fff3ee", color: "#ff6b35", padding: "6px 12px",
    borderRadius: "20px", fontSize: "0.9rem", display: "flex",
    alignItems: "center", gap: "6px", fontWeight: "500",
  },
  removeTag: {
    background: "none", border: "none", cursor: "pointer",
    color: "#ff6b35", fontSize: "0.8rem", padding: 0, lineHeight: 1,
  },
  optionsRow: {
    display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
    gap: "16px", marginBottom: "20px",
  },
  smallInput: {
    padding: "10px 14px", borderRadius: "8px", border: "1px solid #ddd",
    fontSize: "0.95rem", outline: "none", width: "100%", boxSizing: "border-box",
  },
  generateBtn: {
    width: "100%", padding: "16px", background: "linear-gradient(135deg, #ff6b35, #f7931e)",
    color: "#fff", border: "none", borderRadius: "12px", fontSize: "1.1rem",
    cursor: "pointer", fontWeight: "bold", boxShadow: "0 4px 16px rgba(255,107,53,0.3)",
  },
  loadingBox: {
    textAlign: "center", padding: "40px 20px", background: "#fff8f5",
    borderRadius: "16px", marginBottom: "24px",
  },
  loadingEmojis: { display: "flex", justifyContent: "center", gap: "16px", marginBottom: "16px" },
  loadingText: { color: "#888", fontSize: "1rem", margin: 0 },
  recipeCard: {
    background: "#fff", borderRadius: "16px", padding: "28px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.1)", border: "1px solid #f0f0f0",
  },
  aiBadge: {
    display: "inline-block", background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "#fff", padding: "4px 14px", borderRadius: "20px",
    fontSize: "0.8rem", fontWeight: "600", marginBottom: "16px",
  },
  recipeTitle: { fontSize: "1.8rem", margin: "0 0 8px", color: "#222" },
  recipeDesc: { color: "#666", lineHeight: 1.6, marginBottom: "16px" },
  metaRow: { display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "16px" },
  metaItem: {
    background: "#f9f9f9", padding: "8px 16px",
    borderRadius: "8px", fontSize: "0.9rem", color: "#444",
  },
  tipsBox: {
    background: "#fffbea", border: "1px solid #fef08a", borderRadius: "10px",
    padding: "12px 16px", marginBottom: "20px", color: "#854d0e", fontSize: "0.9rem",
  },
  section: { marginBottom: "24px" },
  sectionTitle: {
    fontSize: "1.2rem", color: "#222", marginBottom: "14px",
    borderBottom: "2px solid #fff3ee", paddingBottom: "8px",
  },
  ingredientGrid: {
    display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "10px",
  },
  ingredientCard: {
    background: "#fff8f5", border: "1px solid #ffe0d0", borderRadius: "10px",
    padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center",
  },
  ingName: { fontWeight: "600", color: "#333", textTransform: "capitalize" },
  ingQty: { color: "#ff6b35", fontSize: "0.85rem" },
  steps: { display: "flex", flexDirection: "column", gap: "14px" },
  step: { display: "flex", gap: "14px", alignItems: "flex-start" },
  stepNum: {
    background: "#ff6b35", color: "#fff", width: "30px", height: "30px",
    borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: "bold", flexShrink: 0, fontSize: "0.9rem",
  },
  stepText: { margin: 0, color: "#444", lineHeight: 1.7, paddingTop: "4px" },
  actionRow: { display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "24px" },
  saveBtn: {
    flex: 1, padding: "12px", background: "#ff6b35", color: "#fff",
    border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "bold", fontSize: "0.95rem",
  },
  shopBtn: {
    flex: 1, padding: "12px", background: "#fff", color: "#ff6b35",
    border: "2px solid #ff6b35", borderRadius: "10px", cursor: "pointer",
    fontWeight: "bold", fontSize: "0.95rem",
  },
  newBtn: {
    flex: 1, padding: "12px", background: "#f9f9f9", color: "#555",
    border: "1px solid #ddd", borderRadius: "10px", cursor: "pointer",
    fontWeight: "bold", fontSize: "0.95rem",
  },
};