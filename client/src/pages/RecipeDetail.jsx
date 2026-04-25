import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../api/axios";
import CookMode from "../components/CookMode";
import CommentsSection from "../components/CommentsSection";
import LanguageTranslator from "../components/LanguageTranslator";

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [translatedRecipe, setTranslatedRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cookMode, setCookMode] = useState(false);

  // Use translated recipe if available, otherwise original
  const display = translatedRecipe || recipe;
  const [voiceLang, setVoiceLang] = useState("en-US");

  useEffect(() => {
    API.get(`/recipes/${id}`)
      .then((res) => setRecipe(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToShoppingList = () => {
    const existing = JSON.parse(
      localStorage.getItem("smartchef_shopping") || "[]"
    );
    const newItems = recipe.ingredients.map((ing) => ({
      name: ing.name,
      quantity: ing.quantity,
      recipeName: recipe.title,
      checked: false,
    }));
    const filtered = existing.filter((item) => item.recipeName !== recipe.title);
    const updated = [...filtered, ...newItems];
    localStorage.setItem("smartchef_shopping", JSON.stringify(updated));
    toast.success(`${recipe.ingredients.length} ingredients added to shopping list! 🛒`);
  };

  if (loading) return <p style={styles.loading}>Loading recipe...</p>;
  if (!recipe) return <p style={styles.loading}>Recipe not found.</p>;

  return (
    <div style={styles.container}>
      {/* Cook Mode Modal */}
      {cookMode && (
  <CookMode
    recipe={display}
    onClose={() => setCookMode(false)}
    language={voiceLang}
  />
)}

      {/* Back Button */}
      <button onClick={() => navigate(-1)} style={styles.back}>
        ← Back
      </button>

      {/* Recipe Image */}
      {recipe.imageURL && (
        <img src={recipe.imageURL} alt={display.title} style={styles.img} />
      )}

      {/* Title & Category */}
      <div style={styles.header}>
        <h1 style={styles.title}>{display.title}</h1>
        <span style={styles.category}>{display.category}</span>
      </div>

      {/* Description */}
      <p style={styles.description}>{display.description}</p>

      {/* Meta Info */}
      <div style={styles.metaRow}>
        <div style={styles.metaBox}>⏱ <strong>{recipe.cookTime}</strong> mins</div>
        <div style={styles.metaBox}>🍽 <strong>{recipe.servings}</strong> servings</div>
        <div style={styles.metaBox}>👤 <strong>{recipe.createdBy?.name || "Unknown"}</strong></div>
        <div style={styles.metaBox}>❤️ <strong>{recipe.likes?.length || 0}</strong> likes</div>
      </div>

      {/* Language Translator */}
     <LanguageTranslator
  recipe={recipe}
  onTranslated={(translated, langCode) => {
    setTranslatedRecipe(translated);
    setVoiceLang(langCode || "en-US");
  }}
/>

      {/* Action Buttons */}
      <div style={styles.actionButtons}>
        <button onClick={() => setCookMode(true)} style={styles.cookBtn}>
          👨‍🍳 Start Cook Mode
        </button>
        <button onClick={handleAddToShoppingList} style={styles.shoppingBtn}>
          🛒 Add to Shopping List
        </button>
      </div>

      {/* Ingredients */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>🛒 Ingredients</h2>
        <div style={styles.ingredientGrid}>
          {display.ingredients?.map((ing, i) => (
            <div key={i} style={styles.ingredientCard}>
              <span style={styles.ingName}>{ing.name}</span>
              <span style={styles.ingQty}>{ing.quantity}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Steps */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>👨‍🍳 Cooking Steps</h2>
        <div style={styles.steps}>
          {display.steps?.map((step, i) => (
            <div key={i} style={styles.step}>
              <div style={styles.stepNumber}>{i + 1}</div>
              <p style={styles.stepText}>{step}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Comments — always in English */}
      <CommentsSection recipeId={id} />
    </div>
  );
}

const styles = {
  container: { padding: "24px", maxWidth: "800px", margin: "0 auto" },
  loading: { padding: "40px", textAlign: "center", color: "#888" },
  back: {
    background: "none", border: "none", color: "#ff6b35",
    fontSize: "1rem", cursor: "pointer", fontWeight: "600",
    marginBottom: "20px", padding: 0,
  },
  img: {
    width: "100%", height: "320px", objectFit: "cover",
    borderRadius: "16px", marginBottom: "24px",
  },
  header: {
    display: "flex", alignItems: "center", gap: "12px",
    marginBottom: "8px", flexWrap: "wrap",
  },
  title: { fontSize: "2rem", margin: 0, color: "#222" },
  category: {
    background: "#fff3ee", color: "#ff6b35", padding: "4px 14px",
    borderRadius: "20px", fontSize: "0.85rem", fontWeight: "600",
  },
  description: { color: "#666", fontSize: "1rem", marginBottom: "20px", lineHeight: 1.6 },
  metaRow: { display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap" },
  metaBox: {
    background: "#f9f9f9", padding: "12px 20px",
    borderRadius: "10px", fontSize: "0.95rem", color: "#444",
  },
  actionButtons: { display: "flex", flexDirection: "column", gap: "12px", marginBottom: "32px" },
  cookBtn: {
    width: "100%", padding: "14px", background: "#ff6b35", color: "#fff",
    border: "none", borderRadius: "12px", fontSize: "1.1rem",
    cursor: "pointer", fontWeight: "bold",
  },
  shoppingBtn: {
    width: "100%", padding: "14px", background: "#fff", color: "#ff6b35",
    border: "2px solid #ff6b35", borderRadius: "12px", fontSize: "1.1rem",
    cursor: "pointer", fontWeight: "bold",
  },
  section: { marginBottom: "36px" },
  sectionTitle: {
    fontSize: "1.4rem", color: "#222", marginBottom: "16px",
    borderBottom: "2px solid #fff3ee", paddingBottom: "8px",
  },
  ingredientGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap: "10px",
  },
  ingredientCard: {
    background: "#fff8f5", border: "1px solid #ffe0d0", borderRadius: "10px",
    padding: "10px 14px", display: "flex",
    justifyContent: "space-between", alignItems: "center",
  },
  ingName: { fontWeight: "600", color: "#333", textTransform: "capitalize" },
  ingQty: { color: "#ff6b35", fontSize: "0.85rem" },
  steps: { display: "flex", flexDirection: "column", gap: "16px" },
  step: { display: "flex", gap: "16px", alignItems: "flex-start" },
  stepNumber: {
    background: "#ff6b35", color: "#fff", width: "32px", height: "32px",
    borderRadius: "50%", display: "flex", alignItems: "center",
    justifyContent: "center", fontWeight: "bold", flexShrink: 0, fontSize: "0.9rem",
  },
  stepText: { margin: 0, color: "#444", lineHeight: 1.7, fontSize: "1rem", paddingTop: "4px" },
};