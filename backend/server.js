const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

// ✅ FIXED CORS
app.use(cors({
  origin: "https://cook-book-o4ar.vercel.app",
  credentials: true,
}));

// ✅ FIXED preflight
app.options("*", cors());

app.use(express.json());

// ✅ Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/recipes", require("./routes/recipeRoutes"));
app.use("/api/recipes/:id/comments", require("./routes/commentRoutes"));
app.use("/api/ai", require("./routes/aiRoutes"));

app.get("/", (req, res) => res.send("SmartChef API running ✅"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));