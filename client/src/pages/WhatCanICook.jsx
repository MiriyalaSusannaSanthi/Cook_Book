import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../api/axios";
import RecipeCard from "../components/RecipeCard";

export default function WhatCanICook() {
  const [searchParams] = useSearchParams();
  const [ingredients, setIngredients] = useState("");
  const [maxTime, setMaxTime] = useState("");
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  // ⭐ Auto search when voice assistant passes ingredients via URL
  useEffect(() => {
    const voiceIngredients = searchParams.get("ingredients");
    if (voiceIngredients) {
      setIngredients(voiceIngredients);
      triggerSearch(voiceIngredients);
    }
  }, [searchParams]);

  const triggerSearch = async (ing, time) => {
    const searchIng = ing || ingredients;
    if (!searchIng.trim()) return;
    setLoading(true);
    try {
      const res = await API.get("/recipes/what-can-i-cook", {
        params: {
          ingredients: searchIng,
          maxTime: time || maxTime || undefined,
        },
      });
      setResults(res.data);
      setSearched(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => triggerSearch(ingredients, maxTime);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>🤔 What Can I Cook?</h2>
      <p style={styles.sub}>
        Type or use 🎤 voice — say <em>"I have potatoes and eggs"</em>
      </p>

      <div style={styles.searchBox}>
        <input
          style={styles.input}
          placeholder="e.g. potatoes, eggs, cheese (comma separated)"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <input
          style={{ ...styles.input, maxWidth: "180px" }}
          type="number"
          placeholder="Max time (mins)"
          value={maxTime}
          onChange={(e) => setMaxTime(e.target.value)}
        />
        <button onClick={handleSearch} style={styles.btn}>
          {loading ? "Searching..." : "🔍 Find Recipes"}
        </button>
      </div>

      {searched && (
        results.length === 0 ? (
          <div style={styles.emptyBox}>
            <p style={styles.emptyIcon}>🥲</p>
            <p style={styles.emptyText}>
              No recipes found with <strong>{ingredients}</strong>
            </p>
            <p style={styles.emptyHint}>
              Try adding more recipes with these ingredients!
            </p>
          </div>
        ) : (
          <>
            <p style={styles.count}>
              ✅ Found <strong>{results.length}</strong> recipe(s) with{" "}
              <strong>{ingredients}</strong>
            </p>
            <div style={styles.grid}>
              {results.map((r) => (
                <RecipeCard key={r._id} recipe={r} />
              ))}
            </div>
          </>
        )
      )}
    </div>
  );
}

const styles = {
  container: { padding: "24px", maxWidth: "1100px", margin: "0 auto" },
  heading: { fontSize: "1.8rem", marginBottom: "8px" },
  sub: { color: "#888", marginBottom: "24px" },
  searchBox: { display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "24px" },
  input: { padding: "10px 14px", borderRadius: "8px", border: "1px solid #ddd",
    fontSize: "1rem", flex: 1, minWidth: "200px" },
  btn: { padding: "10px 24px", background: "#ff6b35", color: "#fff", border: "none",
    borderRadius: "8px", fontSize: "1rem", cursor: "pointer", fontWeight: "bold" },
  emptyBox: { textAlign: "center", padding: "40px" },
  emptyIcon: { fontSize: "3rem", margin: "0 0 8px" },
  emptyText: { fontSize: "1.1rem", color: "#444", margin: "0 0 8px" },
  emptyHint: { color: "#aaa", fontSize: "0.9rem" },
  count: { color: "#444", marginBottom: "16px", fontSize: "1rem" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))", gap: "20px" },
};