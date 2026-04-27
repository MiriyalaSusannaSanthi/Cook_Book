import { useState } from "react";
import API from "../api/axios";
import { toast } from "react-toastify";

const NUTRIENTS = [
  { key: "calories", label: "Calories", unit: "kcal", max: 800, color: "#FF6B35", icon: "🔥" },
  { key: "protein", label: "Protein", unit: "g", max: 50, color: "#48BB78", icon: "💪" },
  { key: "carbs", label: "Carbs", unit: "g", max: 100, color: "#F6AD55", icon: "🌾" },
  { key: "fat", label: "Fat", unit: "g", max: 50, color: "#FC8181", icon: "🧈" },
  { key: "fiber", label: "Fiber", unit: "g", max: 30, color: "#68D391", icon: "🥦" },
  { key: "sugar", label: "Sugar", unit: "g", max: 50, color: "#F687B3", icon: "🍯" },
  { key: "sodium", label: "Sodium", unit: "mg", max: 1000, color: "#76E4F7", icon: "🧂" },
];

const HEALTH_COLORS = {
  "Very Healthy": "#48BB78",
  "Healthy": "#68D391",
  "Balanced Meal": "#F6AD55",
  "Moderate": "#FC8181",
  "Indulgent": "#E53E3E",
};

export default function NutritionInfo({ recipe }) {
  const [nutrition, setNutrition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const fetchNutrition = async () => {
    if (nutrition) {
      setExpanded(!expanded);
      return;
    }
    setLoading(true);
    try {
      const res = await API.post("/ai/nutrition", {
        ingredients: recipe.ingredients,
        servings: recipe.servings,
      });
      setNutrition(res.data);
      setExpanded(true);
      toast.success("Nutrition info calculated! 📊");
    } catch (err) {
      toast.error("Failed to calculate nutrition");
    } finally {
      setLoading(false);
    }
  };

  const healthColor = nutrition
    ? HEALTH_COLORS[nutrition.healthLabel] || "#F6AD55"
    : "var(--primary)";

  return (
    <div style={styles.container}>
      {/* Toggle Button */}
      <button onClick={fetchNutrition} style={styles.toggleBtn} disabled={loading}>
        <span style={styles.toggleIcon}>📊</span>
        <div style={styles.toggleText}>
          <span style={styles.toggleTitle}>Nutrition Info</span>
          <span style={styles.toggleSub}>
            {loading ? "Calculating with AI..." :
             nutrition ? "Per serving • tap to toggle" :
             "Tap to calculate with AI"}
          </span>
        </div>
        {loading ? (
          <span style={styles.spinner}>⏳</span>
        ) : (
          <span style={styles.arrow}>{expanded ? "▲" : "▼"}</span>
        )}
      </button>

      {/* Nutrition Details */}
      {expanded && nutrition && (
        <div style={styles.details}>

          {/* Health Score */}
          <div style={styles.healthRow}>
            <div style={{
              ...styles.healthBadge,
              background: healthColor,
            }}>
              <span style={styles.healthScore}>{nutrition.healthScore}/10</span>
              <span style={styles.healthLabel}>{nutrition.healthLabel}</span>
            </div>
            <div style={styles.servingInfo}>
              <p style={styles.servingTitle}>Per Serving</p>
              <p style={styles.servingSize}>{nutrition.servingSize}</p>
            </div>
          </div>

          {/* Calories — Big Display */}
          <div style={styles.caloriesBox}>
            <span style={styles.caloriesIcon}>🔥</span>
            <div>
              <span style={styles.caloriesNum}>{nutrition.calories}</span>
              <span style={styles.caloriesUnit}> kcal</span>
            </div>
            <span style={styles.caloriesLabel}>per serving</span>
          </div>

          {/* Macro Bars */}
          <div style={styles.nutrientGrid}>
            {NUTRIENTS.filter((n) => n.key !== "calories").map((nutrient) => {
              const value = nutrition[nutrient.key] || 0;
              const percent = Math.min((value / nutrient.max) * 100, 100);
              return (
                <div key={nutrient.key} style={styles.nutrientRow}>
                  <div style={styles.nutrientHeader}>
                    <span style={styles.nutrientIcon}>{nutrient.icon}</span>
                    <span style={styles.nutrientLabel}>{nutrient.label}</span>
                    <span style={styles.nutrientValue}>
                      {value}{nutrient.unit}
                    </span>
                  </div>
                  <div style={styles.barBg}>
                    <div style={{
                      ...styles.barFill,
                      width: `${percent}%`,
                      background: nutrient.color,
                    }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Highlights */}
          {nutrition.highlights?.length > 0 && (
            <div style={styles.section}>
              <p style={styles.sectionTitle}>✅ Highlights</p>
              <div style={styles.tagRow}>
                {nutrition.highlights.map((h, i) => (
                  <span key={i} style={styles.highlightTag}>{h}</span>
                ))}
              </div>
            </div>
          )}

          {/* Warnings */}
          {nutrition.warnings?.length > 0 && (
            <div style={styles.section}>
              <p style={styles.sectionTitle}>⚠️ Watch Out</p>
              <div style={styles.tagRow}>
                {nutrition.warnings.map((w, i) => (
                  <span key={i} style={styles.warningTag}>{w}</span>
                ))}
              </div>
            </div>
          )}

          <p style={styles.disclaimer}>
            * Approximate values calculated by AI. Actual nutrition may vary.
          </p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    background: "#fff", borderRadius: "16px",
    overflow: "hidden", marginBottom: "24px",
    border: "1px solid var(--border)",
    boxShadow: "var(--shadow-sm)",
  },
  toggleBtn: {
    width: "100%", padding: "16px 20px",
    background: "none", border: "none", cursor: "pointer",
    display: "flex", alignItems: "center", gap: "14px",
    textAlign: "left",
  },
  toggleIcon: { fontSize: "1.6rem" },
  toggleText: { flex: 1, display: "flex", flexDirection: "column", gap: "2px" },
  toggleTitle: { fontWeight: "700", fontSize: "1rem", color: "var(--text)" },
  toggleSub: { fontSize: "0.8rem", color: "var(--text-secondary)" },
  spinner: { fontSize: "1.2rem" },
  arrow: { fontSize: "0.8rem", color: "var(--text-secondary)" },
  details: { padding: "0 20px 20px", borderTop: "1px solid var(--border)" },
  healthRow: {
    display: "flex", gap: "12px", alignItems: "center",
    marginBottom: "16px", marginTop: "16px",
  },
  healthBadge: {
    borderRadius: "14px", padding: "12px 20px",
    display: "flex", flexDirection: "column", alignItems: "center",
    gap: "2px", minWidth: "90px",
  },
  healthScore: { fontSize: "1.4rem", fontWeight: "800", color: "#fff" },
  healthLabel: { fontSize: "0.72rem", color: "rgba(255,255,255,0.9)", fontWeight: "600", textAlign: "center" },
  servingInfo: { flex: 1 },
  servingTitle: { fontWeight: "700", color: "var(--text)", margin: "0 0 4px", fontSize: "0.9rem" },
  servingSize: { color: "var(--text-secondary)", fontSize: "0.82rem", margin: 0 },
  caloriesBox: {
    background: "var(--primary-light)", borderRadius: "14px",
    padding: "16px 20px", display: "flex", alignItems: "center",
    gap: "12px", marginBottom: "20px",
  },
  caloriesIcon: { fontSize: "2rem" },
  caloriesNum: { fontSize: "2.2rem", fontWeight: "800", color: "var(--primary)" },
  caloriesUnit: { fontSize: "1rem", color: "var(--primary)", fontWeight: "600" },
  caloriesLabel: { fontSize: "0.82rem", color: "var(--text-secondary)", marginLeft: "auto" },
  nutrientGrid: { display: "flex", flexDirection: "column", gap: "12px", marginBottom: "16px" },
  nutrientRow: { display: "flex", flexDirection: "column", gap: "6px" },
  nutrientHeader: { display: "flex", alignItems: "center", gap: "8px" },
  nutrientIcon: { fontSize: "1rem" },
  nutrientLabel: { flex: 1, fontSize: "0.85rem", fontWeight: "600", color: "var(--text)" },
  nutrientValue: { fontSize: "0.85rem", fontWeight: "700", color: "var(--text-secondary)" },
  barBg: { height: "8px", background: "var(--bg)", borderRadius: "4px", overflow: "hidden" },
  barFill: { height: "100%", borderRadius: "4px", transition: "width 0.8s ease" },
  section: { marginBottom: "14px" },
  sectionTitle: { fontWeight: "700", fontSize: "0.85rem", color: "var(--text)", margin: "0 0 8px" },
  tagRow: { display: "flex", flexWrap: "wrap", gap: "6px" },
  highlightTag: {
    background: "#F0FFF4", color: "#276749", padding: "4px 12px",
    borderRadius: "20px", fontSize: "0.78rem", fontWeight: "600",
    border: "1px solid #9AE6B4",
  },
  warningTag: {
    background: "#FFFBEB", color: "#92400E", padding: "4px 12px",
    borderRadius: "20px", fontSize: "0.78rem", fontWeight: "600",
    border: "1px solid #FCD34D",
  },
  disclaimer: {
    fontSize: "0.72rem", color: "#A0AEC0",
    margin: "12px 0 0", fontStyle: "italic",
  },
};