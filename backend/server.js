const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

// ⭐ Allow all Vercel deployments
const corsOptions = {
  origin: function (origin, callback) {
    if (
      !origin ||
      origin === "http://localhost:5173" ||
      origin === "http://localhost:3000" ||
      origin.endsWith(".vercel.app")
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/recipes", require("./routes/recipeRoutes"));
app.use("/api/recipes/:id/comments", require("./routes/commentRoutes"));
app.use("/api/ai", require("./routes/aiRoutes"));

app.get("/", (req, res) => res.send("SmartChef API running ✅"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));