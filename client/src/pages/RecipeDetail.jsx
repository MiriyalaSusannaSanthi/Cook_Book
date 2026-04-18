import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/recipes/${id}`)
      .then((res) => setRecipe(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p style={styles.loading}>Loading recipe...</p>;
  if (!recipe) return <p style={styles.loading}>Recipe not found.</p>;

  return (
    <div style={styles.container}>
      <button onClick={() => navigate(-1)} style={styles.back}>← Back</button>

      {recipe.imageURL && (
        <img src={recipe.imageURL} alt={recipe.title} style={styles.img} />
      )}

      <div style={styles.header}>
        <h1 style={styles.title}>{recipe.title}</h1>
        <span style={styles.category}>{recipe.category}</span>
      </div>

      <p style={styles.description}>{recipe.description}</p>

      <div style={styles.metaRow}>
        <div style={styles.metaBox}>⏱ <strong>{recipe.cookTime}</strong> mins</div>
        <div style={styles.metaBox}>🍽 <strong>{recipe.servings}</strong> servings</div>
        <div style={styles.metaBox}>👤 <strong>{recipe.createdBy?.name || "Unknown"}</strong></div>
      </div>

      {/* Ingredients */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>🛒 Ingredients</h2>
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
        <h2 style={styles.sectionTitle}>👨‍🍳 Cooking Steps</h2>
        <div style={styles.steps}>
          {recipe.steps?.map((step, i) => (
            <div key={i} style={styles.step}>
              <div style={styles.stepNumber}>{i + 1}</div>
              <p style={styles.stepText}>{step}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { padding:"24px", maxWidth:"800px", margin:"0 auto" },
  loading: { padding:"40px", textAlign:"center", color:"#888" },
  back: { background:"none", border:"none", color:"#ff6b35", fontSize:"1rem",
    cursor:"pointer", fontWeight:"600", marginBottom:"20px", padding:0 },
  img: { width:"100%", height:"320px", objectFit:"cover", borderRadius:"16px", marginBottom:"24px" },
  header: { display:"flex", alignItems:"center", gap:"12px", marginBottom:"8px", flexWrap:"wrap" },
  title: { fontSize:"2rem", margin:0, color:"#222" },
  category: { background:"#fff3ee", color:"#ff6b35", padding:"4px 14px",
    borderRadius:"20px", fontSize:"0.85rem", fontWeight:"600" },
  description: { color:"#666", fontSize:"1rem", marginBottom:"20px", lineHeight:1.6 },
  metaRow: { display:"flex", gap:"12px", marginBottom:"32px", flexWrap:"wrap" },
  metaBox: { background:"#f9f9f9", padding:"12px 20px", borderRadius:"10px",
    fontSize:"0.95rem", color:"#444" },
  section: { marginBottom:"36px" },
  sectionTitle: { fontSize:"1.4rem", color:"#222", marginBottom:"16px",
    borderBottom:"2px solid #fff3ee", paddingBottom:"8px" },
  ingredientGrid: { display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(180px,1fr))", gap:"10px" },
  ingredientCard: { background:"#fff8f5", border:"1px solid #ffe0d0", borderRadius:"10px",
    padding:"10px 14px", display:"flex", justifyContent:"space-between", alignItems:"center" },
  ingName: { fontWeight:"600", color:"#333", textTransform:"capitalize" },
  ingQty: { color:"#ff6b35", fontSize:"0.85rem" },
  steps: { display:"flex", flexDirection:"column", gap:"16px" },
  step: { display:"flex", gap:"16px", alignItems:"flex-start" },
  stepNumber: { background:"#ff6b35", color:"#fff", width:"32px", height:"32px",
    borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center",
    fontWeight:"bold", flexShrink:0, fontSize:"0.9rem" },
  stepText: { margin:0, color:"#444", lineHeight:1.7, fontSize:"1rem", paddingTop:"4px" },
};