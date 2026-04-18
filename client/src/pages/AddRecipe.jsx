import { useState } from "react";
import API from "../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function AddRecipe() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "", description: "", cookTime: "", servings: "",
    category: "", imageURL: "", isPublic: true,
  });
  const [ingredients, setIngredients] = useState([{ name: "", quantity: "" }]);
  const [steps, setSteps] = useState([""]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleIngredientChange = (i, field, value) => {
    const updated = [...ingredients];
    updated[i][field] = value;
    setIngredients(updated);
  };

  const handleStepChange = (i, value) => {
    const updated = [...steps];
    updated[i] = value;
    setSteps(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/recipes", { ...form, ingredients, steps });
      toast.success("Recipe added! 🎉");
      navigate("/my-recipes");
    } catch (err) {
      toast.error("Failed to add recipe");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>➕ Add New Recipe</h2>
      <form onSubmit={handleSubmit} style={styles.form}>

        {["title","description","imageURL","category"].map((field) => (
          <input key={field} name={field} placeholder={field.charAt(0).toUpperCase()+field.slice(1)}
            value={form[field]} onChange={handleChange} style={styles.input} />
        ))}

        <div style={styles.row}>
          <input name="cookTime" type="number" placeholder="Cook Time (mins)"
            value={form.cookTime} onChange={handleChange} style={styles.input} />
          <input name="servings" type="number" placeholder="Servings"
            value={form.servings} onChange={handleChange} style={styles.input} />
        </div>

        <h4>Ingredients</h4>
        {ingredients.map((ing, i) => (
          <div key={i} style={styles.row}>
            <input placeholder="Ingredient name" value={ing.name}
              onChange={(e) => handleIngredientChange(i, "name", e.target.value)} style={styles.input} />
            <input placeholder="Quantity" value={ing.quantity}
              onChange={(e) => handleIngredientChange(i, "quantity", e.target.value)} style={styles.input} />
          </div>
        ))}
        <button type="button" onClick={() => setIngredients([...ingredients, { name:"", quantity:"" }])}
          style={styles.addBtn}>+ Add Ingredient</button>

        <h4>Steps</h4>
        {steps.map((step, i) => (
          <textarea key={i} placeholder={`Step ${i + 1}`} value={step}
            onChange={(e) => handleStepChange(i, e.target.value)} style={styles.textarea} />
        ))}
        <button type="button" onClick={() => setSteps([...steps, ""])}
          style={styles.addBtn}>+ Add Step</button>

        <button type="submit" style={styles.submit}>Save Recipe 🍳</button>
      </form>
    </div>
  );
}

const styles = {
  container: { padding:"24px", maxWidth:"700px", margin:"0 auto" },
  heading: { fontSize:"1.8rem", marginBottom:"24px" },
  form: { display:"flex", flexDirection:"column", gap:"12px" },
  input: { padding:"10px 14px", borderRadius:"8px", border:"1px solid #ddd", fontSize:"1rem" },
  textarea: { padding:"10px 14px", borderRadius:"8px", border:"1px solid #ddd",
    fontSize:"1rem", minHeight:"80px", resize:"vertical" },
  row: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px" },
  addBtn: { background:"#fff3ee", color:"#ff6b35", border:"1px solid #ff6b35",
    padding:"8px 16px", borderRadius:"8px", cursor:"pointer", fontWeight:"500", width:"fit-content" },
  submit: { padding:"12px", background:"#ff6b35", color:"#fff", border:"none",
    borderRadius:"8px", fontSize:"1rem", cursor:"pointer", fontWeight:"bold", marginTop:"8px" },
};