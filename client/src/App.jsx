import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AddRecipe from "./pages/AddRecipe";
import MyRecipes from "./pages/MyRecipes";
import WhatCanICook from "./pages/WhatCanICook";
import RecipeDetail from "./pages/RecipeDetail";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

function App() {
  const { user } = useAuth();
  return (
    <>
      {user && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/add-recipe" element={<ProtectedRoute><AddRecipe /></ProtectedRoute>} />
        <Route path="/my-recipes" element={<ProtectedRoute><MyRecipes /></ProtectedRoute>} />
        <Route path="/what-can-i-cook" element={<ProtectedRoute><WhatCanICook /></ProtectedRoute>} />
        <Route path="/recipe/:id" element={<ProtectedRoute><RecipeDetail /></ProtectedRoute>} />
      </Routes>
    </>
  );
}

export default App;