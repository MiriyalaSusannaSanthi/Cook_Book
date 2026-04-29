import RecipeCard from "./RecipeCard";

export default function RecipeGrid({ recipes }) {
  if (!recipes || recipes.length === 0) return null;

  return (
    <div style={styles.grid}>
      {recipes.map((recipe) => (
        <RecipeCard key={recipe._id} recipe={recipe} />
      ))}
    </div>
  );
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "10px",
  },
};