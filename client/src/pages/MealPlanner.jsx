import { useState, useEffect } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const MEALS = ["Breakfast", "Lunch", "Dinner"];

const MEAL_ICONS = {
  Breakfast: "🌅",
  Lunch: "☀️",
  Dinner: "🌙",
};

const DAY_ICONS = {
  Monday: "Mon",
  Tuesday: "Tue",
  Wednesday: "Wed",
  Thursday: "Thu",
  Friday: "Fri",
  Saturday: "Sat",
  Sunday: "Sun",
};

export default function MealPlanner() {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [plan, setPlan] = useState(() => {
    const saved = localStorage.getItem("smartchef_mealplan");
    if (saved) return JSON.parse(saved);
    const empty = {};
    DAYS.forEach((day) => {
      empty[day] = {};
      MEALS.forEach((meal) => { empty[day][meal] = null; });
    });
    return empty;
  });

  const [selecting, setSelecting] = useState(null); // { day, meal }
  const [search, setSearch] = useState("");

  useEffect(() => {
    API.get("/recipes").then((res) => setRecipes(res.data)).catch(console.error);
  }, []);

  const savePlan = (updated) => {
    setPlan(updated);
    localStorage.setItem("smartchef_mealplan", JSON.stringify(updated));
  };

  const selectMeal = (day, meal, recipe) => {
    const updated = {
      ...plan,
      [day]: { ...plan[day], [meal]: recipe },
    };
    savePlan(updated);
    setSelecting(null);
    setSearch("");
    toast.success(`${recipe.title} added to ${day} ${meal}! 🍽`);
  };

  const clearMeal = (day, meal) => {
    const updated = {
      ...plan,
      [day]: { ...plan[day], [meal]: null },
    };
    savePlan(updated);
  };

  const clearWeek = () => {
    if (!window.confirm("Clear entire meal plan?")) return;
    const empty = {};
    DAYS.forEach((day) => {
      empty[day] = {};
      MEALS.forEach((meal) => { empty[day][meal] = null; });
    });
    savePlan(empty);
    toast.success("Meal plan cleared! 🗑");
  };

  const generateShoppingList = () => {
    const STORAGE_KEY = `smartchef_shopping_${user?.id || "guest"}`;
    const allIngredients = [];
    DAYS.forEach((day) => {
      MEALS.forEach((meal) => {
        const recipe = plan[day][meal];
        if (recipe?.ingredients) {
          recipe.ingredients.forEach((ing) => {
            allIngredients.push({
              name: ing.name,
              quantity: ing.quantity,
              recipeName: `${recipe.title} (${day} ${meal})`,
              checked: false,
            });
          });
        }
      });
    });

   if (allIngredients.length === 0) return toast.error("No meals planned yet!");
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allIngredients));
  toast.success(`${allIngredients.length} ingredients added! 🛒`);
  navigate("/shopping-list");
};

  const totalMeals = DAYS.reduce((acc, day) =>
    acc + MEALS.filter((meal) => plan[day]?.[meal]).length, 0
  );

  const filteredRecipes = recipes.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.heading}>📅 Weekly Meal Planner</h2>
          <p style={styles.sub}>Plan your meals for the entire week</p>
        </div>
        <div style={styles.headerBtns}>
          <button onClick={generateShoppingList} style={styles.shopBtn}>
            🛒 Generate Shopping List
          </button>
          <button onClick={clearWeek} style={styles.clearBtn}>
            🗑 Clear Week
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={styles.statsRow}>
        <div style={styles.statBox}>
          <span style={styles.statNum}>{totalMeals}</span>
          <span style={styles.statLabel}>Meals Planned</span>
        </div>
        <div style={styles.statBox}>
          <span style={styles.statNum}>{21 - totalMeals}</span>
          <span style={styles.statLabel}>Remaining</span>
        </div>
        <div style={styles.statBox}>
          <span style={styles.statNum}>
            {Math.round((totalMeals / 21) * 100)}%
          </span>
          <span style={styles.statLabel}>Complete</span>
        </div>
      </div>

      {/* Progress */}
      <div style={styles.progressBar}>
        <div style={{
          ...styles.progressFill,
          width: `${(totalMeals / 21) * 100}%`,
        }} />
      </div>

      {/* Planner Grid */}
      <div style={styles.grid}>
        {DAYS.map((day) => (
          <div key={day} style={styles.dayCard}>
            {/* Day Header */}
            <div style={styles.dayHeader}>
              <span style={styles.dayShort}>{DAY_ICONS[day]}</span>
              <span style={styles.dayFull}>{day}</span>
            </div>

            {/* Meals */}
            {MEALS.map((meal) => {
              const recipe = plan[day]?.[meal];
              return (
                <div key={meal} style={styles.mealSlot}>
                  <p style={styles.mealLabel}>
                    {MEAL_ICONS[meal]} {meal}
                  </p>
                  {recipe ? (
                    <div style={styles.recipeChip}>
                      {recipe.imageURL && (
                        <img
                          src={recipe.imageURL}
                          alt={recipe.title}
                          style={styles.chipImg}
                        />
                      )}
                      <span style={styles.chipTitle}>{recipe.title}</span>
                      <button
                        onClick={() => clearMeal(day, meal)}
                        style={styles.chipRemove}
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelecting({ day, meal })}
                      style={styles.addMealBtn}
                    >
                      + Add
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Recipe Selector Modal */}
      {selecting && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>
                {MEAL_ICONS[selecting.meal]} {selecting.day} — {selecting.meal}
              </h3>
              <button
                onClick={() => { setSelecting(null); setSearch(""); }}
                style={styles.closeBtn}
              >
                ✕
              </button>
            </div>

            {/* Search */}
            <input
              style={styles.searchInput}
              placeholder="🔍 Search recipes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />

            {/* Recipe List */}
            <div style={styles.recipeList}>
              {filteredRecipes.length === 0 ? (
                <p style={styles.noRecipes}>No recipes found</p>
              ) : (
                filteredRecipes.map((recipe) => (
                  <div
                    key={recipe._id}
                    style={styles.recipeItem}
                    onClick={() => selectMeal(selecting.day, selecting.meal, recipe)}
                  >
                    {recipe.imageURL ? (
                      <img
                        src={recipe.imageURL}
                        alt={recipe.title}
                        style={styles.recipeItemImg}
                      />
                    ) : (
                      <div style={styles.recipeItemNoImg}>🍳</div>
                    )}
                    <div style={styles.recipeItemInfo}>
                      <p style={styles.recipeItemTitle}>{recipe.title}</p>
                      <p style={styles.recipeItemMeta}>
                        ⏱ {recipe.cookTime} mins • {recipe.category}
                      </p>
                    </div>
                    <span style={styles.recipeItemAdd}>+ Add</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: "24px", maxWidth: "1200px", margin: "0 auto" },
  header: {
    display: "flex", justifyContent: "space-between",
    alignItems: "flex-start", flexWrap: "wrap", gap: "16px", marginBottom: "24px",
  },
  heading: { fontSize: "1.8rem", margin: "0 0 4px", color: "#222" },
  sub: { color: "#888", margin: 0 },
  headerBtns: { display: "flex", gap: "10px", flexWrap: "wrap" },
  shopBtn: {
    padding: "10px 18px", background: "#ff6b35", color: "#fff",
    border: "none", borderRadius: "10px", cursor: "pointer",
    fontWeight: "bold", fontSize: "0.9rem",
  },
  clearBtn: {
    padding: "10px 18px", background: "#fff5f5", color: "#e53e3e",
    border: "1px solid #feb2b2", borderRadius: "10px", cursor: "pointer",
    fontWeight: "500", fontSize: "0.9rem",
  },
  statsRow: { display: "flex", gap: "12px", marginBottom: "12px" },
  statBox: {
    flex: 1, background: "#f9f9f9", borderRadius: "12px",
    padding: "14px", textAlign: "center",
    display: "flex", flexDirection: "column", gap: "4px",
  },
  statNum: { fontSize: "1.8rem", fontWeight: "bold", color: "#ff6b35" },
  statLabel: { fontSize: "0.8rem", color: "#888" },
  progressBar: {
    height: "8px", background: "#f0f0f0",
    borderRadius: "4px", marginBottom: "24px",
  },
  progressFill: {
    height: "100%", background: "#ff6b35",
    borderRadius: "4px", transition: "width 0.4s",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
    gap: "12px",
  },
  dayCard: {
    background: "#fff", borderRadius: "14px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
    overflow: "hidden", border: "1px solid #f0f0f0",
  },
  dayHeader: {
    background: "#ff6b35", padding: "10px 14px",
    display: "flex", alignItems: "center", gap: "8px",
  },
  dayShort: { color: "#fff", fontWeight: "bold", fontSize: "1rem" },
  dayFull: { color: "rgba(255,255,255,0.8)", fontSize: "0.75rem" },
  mealSlot: {
    padding: "10px 12px",
    borderBottom: "1px solid #f9f9f9",
  },
  mealLabel: {
    fontSize: "0.75rem", color: "#888",
    margin: "0 0 6px", fontWeight: "600",
  },
  recipeChip: {
    background: "#fff8f5", borderRadius: "8px",
    padding: "6px 8px", display: "flex",
    alignItems: "center", gap: "6px",
    border: "1px solid #ffe0d0",
  },
  chipImg: {
    width: "24px", height: "24px",
    borderRadius: "4px", objectFit: "cover", flexShrink: 0,
  },
  chipTitle: {
    fontSize: "0.75rem", color: "#333", fontWeight: "500",
    flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
  },
  chipRemove: {
    background: "none", border: "none", cursor: "pointer",
    color: "#aaa", fontSize: "0.7rem", padding: 0, flexShrink: 0,
  },
  addMealBtn: {
    width: "100%", padding: "6px", background: "#f9f9f9",
    border: "1px dashed #ddd", borderRadius: "8px",
    cursor: "pointer", color: "#aaa", fontSize: "0.8rem",
    transition: "all 0.2s",
  },
  overlay: {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
    zIndex: 2000, display: "flex", alignItems: "center",
    justifyContent: "center", padding: "16px",
  },
  modal: {
    background: "#fff", borderRadius: "20px",
    width: "100%", maxWidth: "480px",
    maxHeight: "80vh", display: "flex",
    flexDirection: "column", overflow: "hidden",
  },
  modalHeader: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", padding: "20px 20px 0",
  },
  modalTitle: { margin: 0, fontSize: "1.1rem", color: "#222" },
  closeBtn: {
    background: "none", border: "none",
    cursor: "pointer", fontSize: "1.2rem", color: "#888",
  },
  searchInput: {
    margin: "16px 20px 8px", padding: "10px 14px",
    borderRadius: "10px", border: "1px solid #ddd",
    fontSize: "0.95rem", outline: "none",
  },
  recipeList: { overflowY: "auto", padding: "0 20px 20px" },
  noRecipes: { textAlign: "center", color: "#aaa", padding: "20px" },
  recipeItem: {
    display: "flex", alignItems: "center", gap: "12px",
    padding: "10px", borderRadius: "10px", cursor: "pointer",
    transition: "background 0.2s", marginBottom: "6px",
    border: "1px solid #f0f0f0",
  },
  recipeItemImg: {
    width: "48px", height: "48px",
    borderRadius: "8px", objectFit: "cover", flexShrink: 0,
  },
  recipeItemNoImg: {
    width: "48px", height: "48px", borderRadius: "8px",
    background: "#fff3ee", display: "flex",
    alignItems: "center", justifyContent: "center", fontSize: "1.5rem",
  },
  recipeItemInfo: { flex: 1 },
  recipeItemTitle: { margin: "0 0 4px", fontWeight: "600", color: "#222", fontSize: "0.9rem" },
  recipeItemMeta: { margin: 0, fontSize: "0.8rem", color: "#888" },
  recipeItemAdd: {
    color: "#ff6b35", fontWeight: "bold",
    fontSize: "0.85rem", flexShrink: 0,
  },
};