import RecipeCard from "./RecipeCard";

export default function MasonryGrid({ recipes }) {
  if (!recipes || recipes.length === 0) return null;

  const leftCol = [];
  const rightCol = [];

  recipes.forEach((recipe, index) => {
    if (index % 2 === 0) leftCol.push(recipe);
    else rightCol.push(recipe);
  });

  return (
    <div style={styles.grid}>
      <div style={styles.col}>
        {leftCol.map((recipe) => (
          <div key={recipe._id} style={styles.cardWrap}>
            <RecipeCard recipe={recipe} />
          </div>
        ))}
      </div>
      <div style={{ ...styles.col, paddingTop: "24px" }}>
        {rightCol.map((recipe) => (
          <div key={recipe._id} style={styles.cardWrap}>
            <RecipeCard recipe={recipe} />
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
    alignItems: "start",
  },
  col: { display: "flex", flexDirection: "column", gap: "12px" },
  cardWrap: {},
};