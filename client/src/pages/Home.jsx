import { useEffect, useState } from "react";
import API from "../api/axios";
import MasonryGrid from "../components/MasonryGrid";

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
        <p style={styles.heroGreeting}>Good day, Chef! 👋</p>
        <h1 style={styles.heroTitle}>Find your perfect recipe</h1>
        {/* Search */}
        <div style={styles.searchBar}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            style={styles.searchInput}
            placeholder="Search by name or ingredient..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch("")} style={styles.clearBtn}>✕</button>
          )}
        </div>
      </div>

      <div style={styles.body}>
        {/* Categories */}
        <div style={styles.categoryScroll}>
          {CATEGORIES.map((cat) => {
            const active = category === cat.label;
            return (
              <button
                key={cat.label}
                onClick={() => setCategory(cat.label)}
                style={{
                  ...styles.catBtn,
                  background: active ? "var(--primary)" : "#fff",
                  color: active ? "#fff" : "var(--text-secondary)",
                  border: active ? "none" : "1px solid var(--border)",
                  boxShadow: active ? "0 4px 12px rgba(255,107,53,0.3)" : "none",
                }}
              >
                <span style={styles.catIcon}>{cat.icon}</span>
                <span style={styles.catLabel}>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Filter + Count */}
        <div style={styles.filterRow}>
          <p style={styles.count}>
            {loading ? "Loading..." : (
              <>
                <span style={styles.countNum}>{filtered.length}</span>
                {" "}recipes found
              </>
            )}
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

        {/* Recipes */}
        {loading ? (
          <div style={styles.skeletonGrid}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="skeleton" style={styles.skeleton} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={styles.empty}>
            <div style={styles.emptyIcon}>🍳</div>
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
          <MasonryGrid recipes={filtered} />
        )}
      </div>
    </div>
  );
}

const styles = {
  hero: {
    background: "linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%)",
    padding: "28px 20px 52px",
  },
  heroGreeting: {
    color: "rgba(255,255,255,0.85)", fontSize: "0.9rem",
    fontWeight: "500", marginBottom: "6px",
  },
  heroTitle: {
    color: "#fff", fontSize: "1.6rem",
    fontWeight: "800", marginBottom: "20px", lineHeight: 1.2,
  },
  searchBar: {
    background: "#fff", borderRadius: "14px",
    display: "flex", alignItems: "center", gap: "8px",
    padding: "6px 14px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
  },
  searchIcon: { fontSize: "1rem", flexShrink: 0 },
  searchInput: {
    flex: 1, border: "none", outline: "none",
    fontSize: "0.95rem", padding: "8px 0",
    background: "transparent", color: "var(--text)",
  },
  clearBtn: {
    background: "#f0f0f0", border: "none",
    borderRadius: "50%", width: "22px", height: "22px",
    cursor: "pointer", color: "#888",
    display: "flex", alignItems: "center",
    justifyContent: "center", fontSize: "0.7rem",
  },
  body: { padding: "0 16px 32px", marginTop: "-24px" },
  categoryScroll: {
    display: "flex", gap: "8px", overflowX: "auto",
    paddingBottom: "4px", marginBottom: "20px",
    scrollbarWidth: "none", msOverflowStyle: "none",
  },
  catBtn: {
    display: "flex", alignItems: "center", gap: "5px",
    padding: "8px 14px", borderRadius: "12px",
    cursor: "pointer", whiteSpace: "nowrap",
    fontSize: "0.82rem", fontWeight: "600",
    transition: "all 0.2s", flexShrink: 0,
  },
  catIcon: { fontSize: "1rem" },
  catLabel: {},
  filterRow: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", marginBottom: "16px",
  },
  count: { fontSize: "0.85rem", color: "var(--text-secondary)" },
  countNum: { fontWeight: "800", color: "var(--text)", fontSize: "1rem" },
  timeSelect: {
    padding: "7px 12px", borderRadius: "10px",
    border: "1px solid var(--border)",
    fontSize: "0.82rem", background: "#fff",
    color: "var(--text)", cursor: "pointer",
  },
  skeletonGrid: {
    display: "grid", gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },
  skeleton: { height: "220px", borderRadius: "16px" },
  empty: {
    textAlign: "center", padding: "60px 20px",
    display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
  },
  emptyIcon: { fontSize: "3.5rem", marginBottom: "8px" },
  emptyTitle: { fontSize: "1.1rem", fontWeight: "700", color: "var(--text)" },
  emptySub: { fontSize: "0.85rem", color: "var(--text-secondary)" },
  resetBtn: {
    marginTop: "12px", padding: "10px 24px",
    background: "var(--primary)", color: "#fff",
    border: "none", borderRadius: "12px",
    cursor: "pointer", fontWeight: "700", fontSize: "0.9rem",
  },
};