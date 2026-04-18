import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        alert("Please login first ❌");
        navigate("/");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <h2>Checking authentication...</h2>;

  return children;
}

export default ProtectedRoute;