import { useEffect, useState } from "react";
import API from "../api/axios";
import RecipeGrid from "../components/MasonryGrid";

const CATEGORIES = [
  { label: "All", icon: "🍽️" },
  { label: "Breakfast", icon: "🌅" },
  { label: "Lunch", icon: "☀️" },
  { label: "Dinner", icon: "🌙" },
  { label: "Snacks", icon: "🍿" },
  { label: "Drinks", icon: "🥤" },
  { label: "Dessert", icon: "🍰" },
];

const TIME_FILTERS = [
  { label: "Any Time", value: "" },
  { label: "≤ 15 mins", value: 15 },
  { label: "≤ 30 mins", value: 30 },
  { label: "≤ 60 mins", value: 60 },
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
      r.ingredients?.some((i) =>
        i.name.toLowerCase().includes(search.toLowerCase())
      );
    const matchCat = category === "All" || r.category === category;
    const matchTime = !maxTime || r.cookTime <= parseInt(maxTime);
    return matchSearch && matchCat && matchTime;
  });

  return (
    <div className="page">
      {/* Hero */}
      <div style={styles.hero}>
        <p style={styles.greeting}>Good day, Chef! 👋</p>
        <h1 style={styles.heroTitle}>Find your perfect<br />recipe today</h1>
        <div style={styles.searchBar}>
          <span>🔍</span>
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

      <div style={styles.body}>
        {/* Category Scroll */}
        <div style={styles.catScroll}>
          {CATEGORIES.map((cat) => {
            const active = category === cat.label;
            return (
              <button
                key={cat.label}
                onClick={() => setCategory(cat.label)}
                style={{
                  ...styles.catBtn,
                  background: active ? "#FF6B35" : "#fff",
                  color: active ? "#fff" : "#6B7280",
                  border: active ? "none" : "1px solid #E5E7EB",
                  boxShadow: active
                    ? "0 4px 14px rgba(255,107,53,0.35)"
                    : "0 1px 4px rgba(0,0,0,0.05)",
                }}
              >
                <span>{cat.icon}</span>
                <span style={styles.catLabel}>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Top Row */}
        <div style={styles.topRow}>
          <p style={styles.countText}>
            <strong>{filtered.length}</strong> recipes
          </p>
          <select
            value={maxTime}
            onChange={(e) => setMaxTime(e.target.value)}
            style={styles.timeSelect}
          >
            {TIME_FILTERS.map((t) => (
              <option key={t.label} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        {/* Grid */}
        {loading ? (
          <div style={styles.skeletonGrid}>
            {Array(9).fill(0).map((_, i) => (
              <div key={i} className="skeleton" style={styles.skeletonCard} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={styles.empty}>
            <p style={{ fontSize: "3rem" }}>🍳</p>
            <p style={styles.emptyTitle}>No recipes found</p>
            <p style={styles.emptySub}>Try a different search or category</p>
            <button
              style={styles.resetBtn}
              onClick={() => { setSearch(""); setCategory("All"); setMaxTime(""); }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <RecipeGrid recipes={filtered} />
        )}
      </div>
    </div>
  );
}

const styles = {
  hero: {
    background: "linear-gradient(135deg, #FF6B35, #FF8C42)",
    padding: "24px 20px 52px",
  },
  greeting: {
    color: "rgba(255,255,255,0.85)",
    fontSize: "0.9rem", fontWeight: "500", marginBottom: "6px",
  },
  heroTitle: {
    color: "#fff", fontSize: "1.7rem",
    fontWeight: "800", marginBottom: "20px", lineHeight: 1.25,
  },
  searchBar: {
    background: "#fff", borderRadius: "14px",
    display: "flex", alignItems: "center", gap: "10px",
    padding: "6px 16px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
  },
  searchInput: {
    flex: 1, border: "none", outline: "none",
    fontSize: "0.95rem", padding: "10px 0",
    background: "transparent", color: "#1C1C1E",
  },
  clearBtn: {
    background: "#F3F4F6", border: "none",
    borderRadius: "50%", width: "24px", height: "24px",
    cursor: "pointer", color: "#9CA3AF",
    display: "flex", alignItems: "center",
    justifyContent: "center", fontSize: "0.72rem", flexShrink: 0,
  },
  body: { padding: "0 12px 32px", marginTop: "-24px" },
  catScroll: {
    display: "flex", gap: "8px",
    overflowX: "auto", paddingBottom: "4px",
    marginBottom: "18px", scrollbarWidth: "none",
  },
  catBtn: {
    display: "flex", alignItems: "center", gap: "5px",
    padding: "8px 14px", borderRadius: "12px",
    cursor: "pointer", whiteSpace: "nowrap",
    fontSize: "0.82rem", fontWeight: "600",
    transition: "all 0.2s", flexShrink: 0,
  },
  catLabel: { fontSize: "0.82rem" },
  topRow: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", marginBottom: "14px",
  },
  countText: { fontSize: "0.85rem", color: "#6B7280" },
  timeSelect: {
    padding: "7px 12px", borderRadius: "10px",
    border: "1px solid #E5E7EB", fontSize: "0.82rem",
    background: "#fff", color: "#1C1C1E", cursor: "pointer",
  },
  skeletonGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "8px",
  },
  skeletonCard: {
    borderRadius: "14px",
    paddingBottom: "100%",
  },
  empty: {
    textAlign: "center", padding: "60px 20px",
    display: "flex", flexDirection: "column",
    alignItems: "center", gap: "8px",
  },
  emptyTitle: { fontSize: "1.1rem", fontWeight: "700", color: "#1C1C1E" },
  emptySub: { fontSize: "0.85rem", color: "#6B7280" },
  resetBtn: {
    marginTop: "12px", padding: "10px 24px",
    background: "#FF6B35", color: "#fff",
    border: "none", borderRadius: "12px",
    cursor: "pointer", fontWeight: "700", fontSize: "0.9rem",
  },
};