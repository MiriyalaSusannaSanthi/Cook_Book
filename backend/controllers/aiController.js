const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ── Generate Recipe ──────────────────────────────────────
const generateRecipe = async (req, res) => {
  const { ingredients, cookTime, servings, cuisine } = req.body;

  if (!ingredients || ingredients.length === 0) {
    return res.status(400).json({ message: "Please provide ingredients" });
  }

  const prompt = `You are a professional chef. Generate a complete recipe using these ingredients: ${ingredients.join(", ")}.
${cookTime ? `The recipe should take at most ${cookTime} minutes to cook.` : ""}
${servings ? `It should serve ${servings} people.` : ""}
${cuisine ? `Make it a ${cuisine} style recipe.` : ""}

Respond ONLY with a valid JSON object in this exact format, no extra text, no markdown, no backticks:
{
  "title": "Recipe Name",
  "description": "Brief appetizing description",
  "cookTime": 30,
  "servings": 2,
  "category": "Lunch",
  "ingredients": [
    { "name": "ingredient name", "quantity": "amount" }
  ],
  "steps": [
    "Step 1 description",
    "Step 2 description"
  ],
  "tips": "Optional cooking tip"
}`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1024,
    });

    const text = completion.choices[0]?.message?.content || "";
    const cleaned = text.replace(/```json/gi, "").replace(/```/g, "").trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      return res.status(500).json({ message: "AI response was not valid" });
    }

    const recipe = JSON.parse(jsonMatch[0]);
    res.status(200).json(recipe);
  } catch (error) {
    console.error("AI error:", error.message);
    res.status(500).json({ message: "Failed to generate recipe" });
  }
};

// ── Translate Recipe ─────────────────────────────────────
const translateRecipe = async (req, res) => {
  const { recipe, language } = req.body;

  if (!recipe || !language) {
    return res.status(400).json({ message: "Recipe and language are required" });
  }

  const prompt = `You are a professional translator. Translate the following recipe content to ${language}.
Translate naturally and keep cooking terms accurate.

Respond ONLY with a valid JSON object in this exact format, no extra text, no markdown, no backticks:
{
  "title": "translated title",
  "description": "translated description",
  "ingredients": [
    { "name": "translated name", "quantity": "translated quantity" }
  ],
  "steps": ["translated step 1", "translated step 2"],
  "category": "translated category"
}

Recipe to translate:
Title: ${recipe.title}
Description: ${recipe.description}
Category: ${recipe.category}
Ingredients: ${JSON.stringify(recipe.ingredients)}
Steps: ${JSON.stringify(recipe.steps)}`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      max_tokens: 2048,
    });

    const text = completion.choices[0]?.message?.content || "";
    const cleaned = text.replace(/```json/gi, "").replace(/```/g, "").trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      return res.status(500).json({ message: "Translation failed" });
    }

    const translated = JSON.parse(jsonMatch[0]);
    res.status(200).json(translated);
  } catch (error) {
    console.error("Translation error:", error.message);
    res.status(500).json({ message: "Failed to translate recipe" });
  }
};

module.exports = { generateRecipe, translateRecipe };