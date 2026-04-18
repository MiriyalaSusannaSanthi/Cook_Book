import { useEffect, useState } from "react";
import API from "../api/axios";
import RecipeCard from "../components/RecipeCard";
import { toast } from "react-toastify";

export default function MyRecipes() {
  const [recipes, setRecipes] = useState([]);

  const fetchMyRecipes = () => {
    API.get("/recipes/my-recipes").then((res) => setRecipes(res.data));
  };

  useEffect(() => { fetchMyRecipes(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this recipe?")) return;
    try {
      await API.delete(`/recipes/${id}`);
      toast.success("Recipe deleted");
      fetchMyRecipes();
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>👤 My Recipes</h2>
      {recipes.length === 0 ? <p>You haven't added any recipes yet.</p> : (
        <div style={styles.grid}>
          {recipes.map((r) => (
            <div key={r._id}>
              <RecipeCard recipe={r} />
              <button onClick={() => handleDelete(r._id)} style={styles.deleteBtn}>
                🗑 Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding:"24px", maxWidth:"1100px", margin:"0 auto" },
  heading: { fontSize:"1.8rem", marginBottom:"24px" },
  grid: { display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(280px,1fr))", gap:"20px" },
  deleteBtn: { marginTop:"8px", width:"100%", padding:"8px", background:"#ffe5e5",
    color:"#e53e3e", border:"none", borderRadius:"8px", cursor:"pointer", fontWeight:"500" },
};