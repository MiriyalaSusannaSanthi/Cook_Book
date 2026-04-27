const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  generateRecipe,
  translateRecipe,
  getNutrition,
} = require("../controllers/aiController");

router.post("/generate-recipe", protect, generateRecipe);
router.post("/translate", protect, translateRecipe);
router.post("/nutrition", protect, getNutrition);

module.exports = router;