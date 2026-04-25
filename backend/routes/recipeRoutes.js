const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  addRecipe,
  getAllRecipes,
  getRecipeById,
  getMyRecipes,
  whatCanICook,
  deleteRecipe,
} = require("../controllers/recipeController");

router.get("/", getAllRecipes);
router.get("/what-can-i-cook", whatCanICook);
router.get("/my-recipes", protect, getMyRecipes);
router.get("/:id", getRecipeById);
router.post("/", protect, addRecipe);
router.delete("/:id", protect, deleteRecipe);
router.put("/:id/like", protect, require("../controllers/recipeController").toggleLike);

module.exports = router;