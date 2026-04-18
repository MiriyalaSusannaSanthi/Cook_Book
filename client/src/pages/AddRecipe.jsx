import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

function AddRecipe() {
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [time, setTime] = useState("");

  const handleAdd = async () => {
    try {
      await addDoc(collection(db, "recipes"), {
        title,
        ingredients: ingredients.split(","), // convert to array
        time,
        createdAt: new Date()
      });

      alert("Recipe Added ✅");
      setTitle("");
      setIngredients("");
      setTime("");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <h2>Add Recipe</h2>

      <input
        placeholder="Recipe Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />

      <input
        placeholder="Ingredients (comma separated)"
        value={ingredients}
        onChange={e => setIngredients(e.target.value)}
      />

      <input
        placeholder="Time (minutes)"
        value={time}
        onChange={e => setTime(e.target.value)}
      />

      <button onClick={handleAdd}>Add Recipe</button>
    </div>
  );
}

export default AddRecipe;