const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const Recipe = require("./models/Recipe");
const User = require("./models/User");

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected ✅");

  const user = await User.findOne();
  if (!user) {
    console.log("No user found. Login first, then run this script.");
    process.exit();
  }

  // Clear old seeded recipes
  await Recipe.deleteMany({
    title: {
      $in: [
        "Classic Omelette",
        "Tomato Rice",
        "Banana Smoothie",
        "Masala Maggi",
        "Paneer Butter Masala",
        "Veg Fried Rice",
        "Chocolate Mug Cake",
        "Masala Chai",
      ],
    },
  });
  console.log("Old seeds cleared 🧹");

  const recipes = [
    {
      title: "Masala Maggi",
      description:
        "Quick and spicy Indian style Maggi noodles with vegetables and masala",
      ingredients: [
        { name: "Maggi noodles", quantity: "2 packets" },
        { name: "water", quantity: "1.5 cups" },
        { name: "onion", quantity: "1 medium chopped" },
        { name: "tomato", quantity: "1 medium chopped" },
        { name: "green chilli", quantity: "2 chopped" },
        { name: "butter", quantity: "1 tbsp" },
        { name: "Maggi masala", quantity: "2 sachets" },
        { name: "salt", quantity: "to taste" },
      ],
      steps: [
        "Heat butter in a pan over medium flame",
        "Add chopped onions and green chilli, saute for 2 minutes until golden",
        "Add chopped tomatoes and cook for 2 minutes until soft",
        "Add 1.5 cups of water and bring to a boil",
        "Add Maggi noodles and Maggi masala sachets",
        "Cook for 2 minutes stirring occasionally until water is absorbed",
        "Serve hot immediately",
      ],
      cookTime: 10,
      servings: 2,
      category: "Snacks",
      imageURL:
        "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=800",
      createdBy: user._id,
      isPublic: true,
    },
    {
      title: "Classic Omelette",
      description: "Fluffy 3-egg omelette with cheese and herbs",
      ingredients: [
        { name: "eggs", quantity: "3" },
        { name: "butter", quantity: "1 tbsp" },
        { name: "cheese", quantity: "2 tbsp" },
        { name: "salt", quantity: "to taste" },
        { name: "pepper", quantity: "to taste" },
      ],
      steps: [
        "Crack eggs into a bowl and whisk well with salt and pepper",
        "Heat butter in a non-stick pan over medium heat",
        "Pour in eggs and let it set slightly at the edges",
        "Add cheese in the center and fold the omelette",
        "Slide onto a plate and serve hot",
      ],
      cookTime: 10,
      servings: 1,
      category: "Breakfast",
      imageURL:
        "https://images.unsplash.com/photo-1510693206972-df098062cb71?w=800",
      createdBy: user._id,
      isPublic: true,
    },
    {
      title: "Tomato Rice",
      description:
        "Simple and flavourful South Indian style tomato rice",
      ingredients: [
        { name: "rice", quantity: "1 cup" },
        { name: "tomato", quantity: "2 large" },
        { name: "onion", quantity: "1 medium" },
        { name: "mustard seeds", quantity: "1 tsp" },
        { name: "curry leaves", quantity: "a few" },
        { name: "turmeric", quantity: "0.5 tsp" },
        { name: "oil", quantity: "2 tbsp" },
        { name: "salt", quantity: "to taste" },
      ],
      steps: [
        "Cook rice and keep aside",
        "Heat oil, add mustard seeds and let them splutter",
        "Add curry leaves and chopped onions, saute till golden",
        "Add chopped tomatoes, turmeric and salt, cook till mushy",
        "Mix in the cooked rice and stir well",
        "Serve hot with papad or curd",
      ],
      cookTime: 25,
      servings: 2,
      category: "Lunch",
      imageURL:
        "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800",
      createdBy: user._id,
      isPublic: true,
    },
    {
      title: "Banana Smoothie",
      description: "Creamy and quick banana smoothie for breakfast",
      ingredients: [
        { name: "banana", quantity: "2 ripe" },
        { name: "milk", quantity: "1 cup" },
        { name: "honey", quantity: "1 tbsp" },
        { name: "ice cubes", quantity: "4-5" },
      ],
      steps: [
        "Peel and slice the bananas",
        "Add all ingredients to a blender",
        "Blend until smooth and creamy",
        "Pour into glasses and serve immediately",
      ],
      cookTime: 5,
      servings: 2,
      category: "Drinks",
      imageURL:
        "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=800",
      createdBy: user._id,
      isPublic: true,
    },
    {
      title: "Paneer Butter Masala",
      description:
        "Rich and creamy North Indian paneer curry, perfect with naan or rice",
      ingredients: [
        { name: "paneer", quantity: "250g cubed" },
        { name: "butter", quantity: "2 tbsp" },
        { name: "onion", quantity: "2 medium" },
        { name: "tomato", quantity: "3 large" },
        { name: "cream", quantity: "4 tbsp" },
        { name: "ginger garlic paste", quantity: "1 tbsp" },
        { name: "kashmiri red chilli", quantity: "1 tsp" },
        { name: "garam masala", quantity: "1 tsp" },
        { name: "salt", quantity: "to taste" },
      ],
      steps: [
        "Heat butter and saute onions till golden brown",
        "Add ginger garlic paste and cook for 1 minute",
        "Add tomatoes and cook till mushy, then blend to a smooth paste",
        "Return paste to pan, add kashmiri chilli and garam masala",
        "Add paneer cubes and simmer for 5 minutes",
        "Stir in cream and cook for 2 more minutes",
        "Serve hot garnished with cream and butter",
      ],
      cookTime: 35,
      servings: 3,
      category: "Dinner",
      imageURL:
        "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800",
      createdBy: user._id,
      isPublic: true,
    },
    {
      title: "Veg Fried Rice",
      description:
        "Indo-Chinese style vegetable fried rice, quick and delicious",
      ingredients: [
        { name: "cooked rice", quantity: "2 cups" },
        { name: "carrot", quantity: "1 small diced" },
        { name: "beans", quantity: "6-8 chopped" },
        { name: "capsicum", quantity: "1 small diced" },
        { name: "spring onion", quantity: "2 stalks" },
        { name: "soy sauce", quantity: "2 tbsp" },
        { name: "pepper", quantity: "1 tsp" },
        { name: "oil", quantity: "2 tbsp" },
        { name: "garlic", quantity: "4 cloves minced" },
        { name: "salt", quantity: "to taste" },
      ],
      steps: [
        "Heat oil in a wok on high flame",
        "Add garlic and saute for 30 seconds",
        "Add all vegetables and stir fry for 3-4 minutes on high heat",
        "Add cooked rice and mix well",
        "Add soy sauce, pepper and salt, toss everything together",
        "Garnish with spring onion greens and serve hot",
      ],
      cookTime: 20,
      servings: 3,
      category: "Lunch",
      imageURL:
        "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800",
      createdBy: user._id,
      isPublic: true,
    },
    {
      title: "Chocolate Mug Cake",
      description:
        "3-minute microwave chocolate cake in a mug — perfect late night treat",
      ingredients: [
        { name: "all purpose flour", quantity: "4 tbsp" },
        { name: "cocoa powder", quantity: "2 tbsp" },
        { name: "sugar", quantity: "4 tbsp" },
        { name: "egg", quantity: "1" },
        { name: "milk", quantity: "3 tbsp" },
        { name: "oil", quantity: "3 tbsp" },
        { name: "vanilla essence", quantity: "a few drops" },
        { name: "chocolate chips", quantity: "1 tbsp" },
      ],
      steps: [
        "Add flour, cocoa powder and sugar to a large mug and mix",
        "Add egg and mix well",
        "Pour in milk, oil and vanilla essence, stir until smooth",
        "Add chocolate chips and fold in",
        "Microwave on high for 90 seconds",
        "Let it cool for 30 seconds and enjoy directly from the mug",
      ],
      cookTime: 5,
      servings: 1,
      category: "Dessert",
      imageURL:
        "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800",
      createdBy: user._id,
      isPublic: true,
    },
    {
      title: "Masala Chai",
      description:
        "Authentic Indian spiced tea with ginger, cardamom and cinnamon",
      ingredients: [
        { name: "water", quantity: "1 cup" },
        { name: "milk", quantity: "1 cup" },
        { name: "tea leaves", quantity: "2 tsp" },
        { name: "sugar", quantity: "2 tsp" },
        { name: "ginger", quantity: "1 inch piece" },
        { name: "cardamom", quantity: "2 pods crushed" },
        { name: "cinnamon", quantity: "small stick" },
        { name: "black pepper", quantity: "2-3 corns" },
      ],
      steps: [
        "Crush ginger, cardamom, cinnamon and pepper coarsely",
        "Boil water with crushed spices for 2 minutes",
        "Add tea leaves and boil for 1 more minute",
        "Add milk and sugar, bring to a boil",
        "Simmer for 2 minutes until colour deepens",
        "Strain into cups and serve hot",
      ],
      cookTime: 8,
      servings: 2,
      category: "Drinks",
      imageURL:
        "https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?w=800",
      createdBy: user._id,
      isPublic: true,
    },
  ];

  await Recipe.insertMany(recipes);
  console.log(`✅ ${recipes.length} recipes seeded successfully!`);
  process.exit();
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});