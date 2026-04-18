import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

import Login from "./pages/Login";
import Register from "./pages/Register";
import AddRecipe from "./pages/AddRecipe";
import Recipes from "./pages/Recipes";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [user, setUser] = useState(null);

  // 🔐 Track logged-in user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // 🚪 Logout
  const handleLogout = async () => {
    await signOut(auth);
    alert("Logged out successfully");
  };

  return (
    <BrowserRouter>
      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <h1>SmartChef 🍳</h1>

        {/* Navigation */}
        <nav style={{ marginBottom: "20px" }}>
          {!user && <Link to="/" style={{ margin: "10px" }}>Login</Link>}
          {!user && <Link to="/register" style={{ margin: "10px" }}>Register</Link>}

          {user && <Link to="/add" style={{ margin: "10px" }}>Add Recipe</Link>}
          {user && <Link to="/recipes" style={{ margin: "10px" }}>View Recipes</Link>}

          {user && (
            <button onClick={handleLogout} style={{ marginLeft: "10px" }}>
              Logout
            </button>
          )}
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* 🔐 Protected Routes */}
          <Route
            path="/add"
            element={
              <ProtectedRoute>
                <AddRecipe />
              </ProtectedRoute>
            }
          />

          <Route
            path="/recipes"
            element={
              <ProtectedRoute>
                <Recipes />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;