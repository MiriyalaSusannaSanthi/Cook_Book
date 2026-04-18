const Recipe = require("../models/Recipe");

// Add a new recipe
const addRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.create({ ...req.body, createdBy: req.user.id });
    res.status(201).json(recipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all public recipes
const getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ isPublic: true })
      .populate("createdBy", "name photoURL")
      .sort({ createdAt: -1 });
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single recipe
const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate(
      "createdBy",
      "name photoURL"
    );
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    res.status(200).json(recipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get logged-in user's recipes
const getMyRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ createdBy: req.user.id }).sort({
      createdAt: -1,
    });
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ⭐ What can I cook? — match by ingredients + optional time filter
const whatCanICook = async (req, res) => {
  try {
    const { ingredients, maxTime } = req.query;

    if (!ingredients) {
      return res.status(400).json({ message: "Provide ingredients" });
    }

    const ingredientList = ingredients
      .split(",")
      .map((i) => i.trim().toLowerCase());

    let query = {
      isPublic: true,
      "ingredients.name": {
        $in: ingredientList.map((i) => new RegExp(i, "i")),
      },
    };

    if (maxTime) {
      query.cookTime = { $lte: parseInt(maxTime) };
    }

    const recipes = await Recipe.find(query).populate(
      "createdBy",
      "name photoURL"
    );
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete recipe
const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    if (recipe.createdBy.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });
    await recipe.deleteOne();
    res.status(200).json({ message: "Recipe deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addRecipe,
  getAllRecipes,
  getRecipeById,
  getMyRecipes,
  whatCanICook,
  deleteRecipe,
};