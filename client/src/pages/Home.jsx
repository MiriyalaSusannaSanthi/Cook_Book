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

  const filtered = recipes.filter((r) => {
    const matchSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description?.toLowerCase().includes(search.toLowerCase()) ||
      r.ingredients?.some((i) => i.name.toLowerCase().includes(search.toLowerCase()));
    const matchCat = category === "All" || r.category === category;
    const matchTime = !maxTime || r.cookTime <= parseInt(maxTime);
    return matchSearch && matchCat && matchTime;
  });

  return (
    <div style={styles.page} className="page">
      {/* Hero Search */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>What are you <span style={styles.heroAccent}>cooking</span> today?</h1>
        <div style={styles.searchBox}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            style={styles.searchInput}
            placeholder="Search recipes, ingredients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch("")} style={styles.clearBtn}>✕</button>
          )}
        </div>
      </div>

      <div style={styles.content}>
        {/* Category Pills */}
        <div style={styles.pillsRow}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                ...styles.pill,
                background: category === cat ? "var(--primary)" : "var(--card)",
                color: category === cat ? "#fff" : "var(--text-secondary)",
                border: category === cat ? "none" : "1px solid var(--border)",
                fontWeight: category === cat ? "700" : "500",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Time Filter + Results Count */}
        <div style={styles.filterRow}>
          <p style={styles.resultCount}>
            {loading ? "Loading..." : `${filtered.length} recipe${filtered.length !== 1 ? "s" : ""}`}
          </p>
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

        {/* Grid */}
        {loading ? (
          <div style={styles.grid}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="skeleton" style={styles.skeletonCard} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={styles.empty}>
            <p style={styles.emptyIcon}>🍳</p>
            <p style={styles.emptyTitle}>No recipes found</p>
            <p style={styles.emptySub}>Try different filters</p>
            <button
              onClick={() => { setSearch(""); setCategory("All"); setMaxTime(""); }}
              style={styles.resetBtn}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div style={styles.grid}>
            {filtered.map((r) => <RecipeCard key={r._id} recipe={r} />)}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh" },
  hero: {
    background: "linear-gradient(135deg, #FF6B35, #F7931E)",
    padding: "28px 20px 48px",
  },
  heroTitle: { fontSize: "1.5rem", fontWeight: "800", color: "#fff", marginBottom: "16px", lineHeight: 1.3 },
  heroAccent: { color: "#FFE0B2" },
  searchBox: {
    background: "#fff", borderRadius: "var(--radius-lg)",
    display: "flex", alignItems: "center", gap: "10px",
    padding: "4px 16px", boxShadow: "var(--shadow-lg)",
  },
  searchIcon: { fontSize: "1rem" },
  searchInput: {
    flex: 1, padding: "12px 0", border: "none",
    fontSize: "1rem", outline: "none", background: "transparent",
  },
  clearBtn: {
    background: "none", border: "none", cursor: "pointer",
    color: "var(--text-secondary)", fontSize: "1rem",
  },
  content: { padding: "0 16px 24px", marginTop: "-20px" },
  pillsRow: {
    display: "flex", gap: "8px", overflowX: "auto",
    paddingBottom: "4px", marginBottom: "16px",
    scrollbarWidth: "none",
  },
  pill: {
    padding: "8px 16px", borderRadius: "20px", cursor: "pointer",
    fontSize: "0.85rem", whiteSpace: "nowrap", transition: "all 0.2s",
    boxShadow: "var(--shadow-sm)",
  },
  filterRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" },
  resultCount: { fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: "600" },
  select: {
    padding: "6px 12px", borderRadius: "10px",
    border: "1px solid var(--border)", fontSize: "0.85rem",
    background: "var(--card)", color: "var(--text)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
    gap: "14px",
  },
  skeletonCard: { height: "260px", borderRadius: "var(--radius-lg)" },
  empty: { textAlign: "center", padding: "60px 20px" },
  emptyIcon: { fontSize: "3rem", marginBottom: "12px" },
  emptyTitle: { fontWeight: "700", fontSize: "1.1rem", marginBottom: "6px" },
  emptySub: { color: "var(--text-secondary)", marginBottom: "20px" },
  resetBtn: {
    padding: "10px 24px", background: "var(--primary)", color: "#fff",
    border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: "700",
  },
};