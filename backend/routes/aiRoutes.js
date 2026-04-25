const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { generateRecipe, translateRecipe } = require("../controllers/aiController");

router.post("/generate-recipe", protect, generateRecipe);
router.post("/translate", protect, translateRecipe);

module.exports = router;