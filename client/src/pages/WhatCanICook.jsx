import { useState } from "react";
import API from "../api/axios";
import RecipeCard from "../components/RecipeCard";

export default function WhatCanICook() {
  const [ingredients, setIngredients] = useState("");
  const [maxTime, setMaxTime] = useState("");
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!ingredients.trim()) return;
    setLoading(true);
    try {
      const res = await API.get("/recipes/what-can-i-cook", {
        params: { ingredients, maxTime: maxTime || undefined },
      });
      setResults(res.data);
      setSearched(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>🤔 What Can I Cook?</h2>
      <p style={styles.sub}>Enter ingredients you have and we'll find matching recipes!</p>

      <div style={styles.searchBox}>
        <input style={styles.input} placeholder="e.g. eggs, tomato, cheese (comma separated)"
          value={ingredients} onChange={(e) => setIngredients(e.target.value)} />
        <input style={{ ...styles.input, maxWidth:"180px" }} type="number"
          placeholder="Max cook time (mins)" value={maxTime}
          onChange={(e) => setMaxTime(e.target.value)} />
        <button onClick={handleSearch} style={styles.btn}>
          {loading ? "Searching..." : "🔍 Find Recipes"}
        </button>
      </div>

      {searched && (
        results.length === 0 ? (
          <p style={styles.empty}>No recipes found with those ingredients. Try adding more! 🥲</p>
        ) : (
          <>
            <p style={styles.count}>Found {results.length} recipe(s) ✅</p>
            <div style={styles.grid}>
              {results.map((r) => <RecipeCard key={r._id} recipe={r} />)}
            </div>
          </>
        )
      )}
    </div>
  );
}

const styles = {
  container: { padding:"24px", maxWidth:"1100px", margin:"0 auto" },
  heading: { fontSize:"1.8rem", marginBottom:"8px" },
  sub: { color:"#888", marginBottom:"24px" },
  searchBox: { display:"flex", gap:"12px", flexWrap:"wrap", marginBottom:"24px" },
  input: { padding:"10px 14px", borderRadius:"8px", border:"1px solid #ddd",
    fontSize:"1rem", flex:1, minWidth:"200px" },
  btn: { padding:"10px 24px", background:"#ff6b35", color:"#fff", border:"none",
    borderRadius:"8px", fontSize:"1rem", cursor:"pointer", fontWeight:"bold" },
  empty: { color:"#888", fontSize:"1.1rem" },
  count: { color:"#ff6b35", fontWeight:"bold", marginBottom:"16px" },
  grid: { display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(280px,1fr))", gap:"20px" },
};