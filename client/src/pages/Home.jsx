import { useEffect, useState } from "react";
import API from "../api/axios";
import RecipeCard from "../components/RecipeCard";

const CATEGORIES = ["All", "Breakfast", "Lunch", "Dinner", "Snacks", "Drinks", "Dessert"];
const TIME_FILTERS = [
  { label: "Any Time", value: "" },
  { label: "Under 15 mins", value: 15 },
  { label: "Under 30 mins", value: 30 },
  { label: "Under 60 mins", value: 60 },
];

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [maxTime, setMaxTime] = useState("");

  useEffect(() => {
    API.get("/recipes")
      .then((res) => setRecipes(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Live filter — no backend call needed
  const filtered = recipes.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description?.toLowerCase().includes(search.toLowerCase()) ||
      r.ingredients?.some((i) =>
        i.name.toLowerCase().includes(search.toLowerCase())
      );
    const matchesCategory = category === "All" || r.category === category;
    const matchesTime = !maxTime || r.cookTime <= parseInt(maxTime);
    return matchesSearch && matchesCategory && matchesTime;
  });

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>🍽 Explore Recipes</h2>

      {/* Search Bar */}
      <div style={styles.searchRow}>
        <input
          style={styles.searchInput}
          placeholder="🔍 Search by name, ingredient..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button onClick={() => setSearch("")} style={styles.clearBtn}>✕</button>
        )}
      </div>

      {/* Filters Row */}
      <div style={styles.filtersRow}>
        {/* Category Pills */}
        <div style={styles.pills}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                ...styles.pill,
                background: category === cat ? "#ff6b35" : "#f0f0f0",
                color: category === cat ? "#fff" : "#555",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Time Filter */}
        <select
          value={maxTime}
          onChange={(e) => setMaxTime(e.target.value)}
          style={styles.select}
        >
          {TIME_FILTERS.map((t) => (
            <option key={t.label} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      {/* Results count */}
      {!loading && (
        <p style={styles.resultCount}>
          {filtered.length === 0
            ? "No recipes found"
            : `Showing ${filtered.length} recipe${filtered.length > 1 ? "s" : ""}
              ${search ? ` for "${search}"` : ""}
              ${category !== "All" ? ` in ${category}` : ""}`}
        </p>
      )}

      {/* Recipe Grid */}
      {loading ? (
        <div style={styles.loadingGrid}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} style={styles.skeleton} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div style={styles.emptyBox}>
          <p style={styles.emptyIcon}>🍳</p>
          <p style={styles.emptyText}>No recipes found</p>
          <p style={styles.emptyHint}>
            Try a different search or{" "}
            <span
              onClick={() => { setSearch(""); setCategory("All"); setMaxTime(""); }}
              style={styles.resetLink}
            >
              reset filters
            </span>
          </p>
        </div>
      ) : (
        <div style={styles.grid}>
          {filtered.map((r) => <RecipeCard key={r._id} recipe={r} />)}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: "24px", maxWidth: "1100px", margin: "0 auto" },
  heading: { fontSize: "1.8rem", marginBottom: "20px", color: "#222" },
  searchRow: { position: "relative", marginBottom: "16px" },
  searchInput: {
    width: "100%", padding: "12px 44px 12px 16px", borderRadius: "12px",
    border: "1px solid #ddd", fontSize: "1rem", outline: "none",
    boxSizing: "border-box", background: "#fafafa",
  },
  clearBtn: {
    position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
    background: "none", border: "none", cursor: "pointer", color: "#aaa", fontSize: "1rem",
  },
  filtersRow: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    flexWrap: "wrap", gap: "12px", marginBottom: "16px",
  },
  pills: { display: "flex", gap: "8px", flexWrap: "wrap" },
  pill: {
    padding: "6px 16px", borderRadius: "20px", border: "none",
    cursor: "pointer", fontWeight: "500", fontSize: "0.85rem", transition: "all 0.2s",
  },
  select: {
    padding: "8px 14px", borderRadius: "10px", border: "1px solid #ddd",
    fontSize: "0.9rem", cursor: "pointer", background: "#fff", color: "#555",
  },
  resultCount: { color: "#888", fontSize: "0.9rem", marginBottom: "16px" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "20px",
  },
  loadingGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "20px",
  },
  skeleton: {
    height: "300px", borderRadius: "12px",
    background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s infinite",
  },
  emptyBox: { textAlign: "center", padding: "60px 20px" },
  emptyIcon: { fontSize: "3rem", margin: "0 0 8px" },
  emptyText: { fontSize: "1.2rem", color: "#444", margin: "0 0 8px" },
  emptyHint: { color: "#aaa", fontSize: "0.9rem" },
  resetLink: { color: "#ff6b35", cursor: "pointer", fontWeight: "600" },
};