import { useEffect, useState } from "react";
import API from "../api/axios";
import RecipeCard from "../components/RecipeCard";

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/recipes")
      .then((res) => setRecipes(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>🍽 Explore Recipes</h2>
      {loading ? <p>Loading...</p> : recipes.length === 0 ? (
        <p style={styles.empty}>No recipes yet. Be the first to add one! 🍳</p>
      ) : (
        <div style={styles.grid}>
          {recipes.map((r) => <RecipeCard key={r._id} recipe={r} />)}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding:"24px", maxWidth:"1100px", margin:"0 auto" },
  heading: { fontSize:"1.8rem", marginBottom:"24px", color:"#222" },
  grid: { display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(280px,1fr))", gap:"20px" },
  empty: { color:"#888", fontSize:"1.1rem" },
};