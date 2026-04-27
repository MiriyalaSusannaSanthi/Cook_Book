import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
  { path: "/", label: "Explore", icon: "🍽️" },
  { path: "/what-can-i-cook", label: "Cook", icon: "🤔" },
  { path: "/ai-generator", label: "AI Chef", icon: "🤖" },
  { path: "/meal-planner", label: "Planner", icon: "📅" },
  { path: "/my-recipes", label: "Mine", icon: "👤" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Top Header */}
      <header style={styles.header}>
        <Link to="/" style={styles.brand}>
          <span style={styles.brandLogo}>🍳</span>
          <span style={styles.brandName}>SmartChef</span>
        </Link>
        <div style={styles.headerActions}>
          <Link to="/shopping-list" style={styles.iconLink}>🛒</Link>
          <Link to="/add-recipe" style={styles.addRecipeBtn}>+ Add Recipe</Link>
          <div style={styles.avatarWrapper}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={styles.avatarBtn}
            >
              {user?.photoURL ? (
                <img src={user.photoURL} alt="avatar" style={styles.avatarImg} />
              ) : (
                <div style={styles.avatarFallback}>
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>
              )}
            </button>
            {menuOpen && (
              <div style={styles.dropdown}>
                <div style={styles.dropdownHeader}>
                  <p style={styles.dropdownName}>{user?.name}</p>
                  <p style={styles.dropdownEmail}>{user?.email}</p>
                </div>
                <div style={styles.dropdownDivider} />
                <button onClick={() => { navigate("/my-recipes"); setMenuOpen(false); }}
                  style={styles.dropdownItem}>👤 My Recipes</button>
                <button onClick={() => { navigate("/shopping-list"); setMenuOpen(false); }}
                  style={styles.dropdownItem}>🛒 Shopping List</button>
                <button onClick={() => { navigate("/add-recipe"); setMenuOpen(false); }}
                  style={styles.dropdownItem}>➕ Add Recipe</button>
                <div style={styles.dropdownDivider} />
                <button onClick={logout}
                  style={{ ...styles.dropdownItem, color: "#EF4444" }}>
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Bottom Tab Bar */}
      <nav style={styles.tabBar}>
        {NAV_ITEMS.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path} style={styles.tabItem}>
              <span style={{
                ...styles.tabIcon,
                background: active ? "var(--primary-light)" : "transparent",
              }}>
                {item.icon}
              </span>
              <span style={{
                ...styles.tabLabel,
                color: active ? "var(--primary)" : "var(--text-secondary)",
                fontWeight: active ? "700" : "500",
              }}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
      <div style={{ height: "72px" }} />
    </>
  );
}

const styles = {
  header: {
    position: "sticky", top: 0, zIndex: 100,
    background: "#fff", borderBottom: "1px solid var(--border)",
    padding: "12px 20px",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  },
  brand: { display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" },
  brandLogo: { fontSize: "1.6rem" },
  brandName: { fontSize: "1.2rem", fontWeight: "800", color: "var(--primary)" },
  headerActions: { display: "flex", alignItems: "center", gap: "10px" },
  iconLink: {
    fontSize: "1.3rem", textDecoration: "none",
    background: "var(--primary-light)", padding: "7px 10px",
    borderRadius: "10px",
  },
  addRecipeBtn: {
    padding: "8px 16px", background: "var(--primary)", color: "#fff",
    borderRadius: "10px", textDecoration: "none",
    fontWeight: "700", fontSize: "0.85rem",
  },
  avatarWrapper: { position: "relative" },
  avatarBtn: {
    background: "none", border: "none",
    cursor: "pointer", padding: 0, borderRadius: "50%",
  },
  avatarImg: {
    width: "36px", height: "36px",
    borderRadius: "50%", objectFit: "cover",
    border: "2px solid var(--primary-light)",
  },
  avatarFallback: {
    width: "36px", height: "36px", borderRadius: "50%",
    background: "var(--primary)", color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: "700", fontSize: "1rem",
  },
  dropdown: {
    position: "absolute", top: "44px", right: 0,
    background: "#fff", borderRadius: "14px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
    border: "1px solid var(--border)",
    minWidth: "200px", overflow: "hidden", zIndex: 200,
  },
  dropdownHeader: { padding: "14px 16px" },
  dropdownName: { fontWeight: "700", color: "var(--text)", margin: "0 0 2px", fontSize: "0.95rem" },
  dropdownEmail: { fontSize: "0.78rem", color: "var(--text-secondary)", margin: 0 },
  dropdownDivider: { height: "1px", background: "var(--border)" },
  dropdownItem: {
    width: "100%", padding: "11px 16px", background: "none",
    border: "none", cursor: "pointer", textAlign: "left",
    fontSize: "0.9rem", color: "var(--text)", fontWeight: "500",
    display: "block", transition: "background 0.15s",
  },
  tabBar: {
    position: "fixed", bottom: 0, left: 0, right: 0,
    background: "#fff", borderTop: "1px solid var(--border)",
    display: "flex", zIndex: 100, height: "64px",
    boxShadow: "0 -2px 12px rgba(0,0,0,0.06)",
  },
  tabItem: {
    flex: 1, display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    textDecoration: "none", gap: "3px", padding: "8px 4px",
  },
  tabIcon: {
    fontSize: "1.3rem", padding: "4px 10px",
    borderRadius: "10px", transition: "background 0.2s",
  },
  tabLabel: { fontSize: "0.65rem", transition: "all 0.2s" },
};