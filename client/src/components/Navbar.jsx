import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
  { path: "/", label: "Explore", icon: "🍽" },
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
      {/* Top Bar */}
      <header style={styles.header}>
        <Link to="/" style={styles.brand}>
          <span style={styles.brandIcon}>🍳</span>
          <span style={styles.brandText}>SmartChef</span>
        </Link>

        <div style={styles.headerRight}>
          <Link to="/shopping-list" style={styles.iconBtn} title="Shopping List">
            🛒
          </Link>
          <Link to="/add-recipe" style={styles.addBtn}>
            + Add
          </Link>
          <button onClick={() => setMenuOpen(!menuOpen)} style={styles.avatarBtn}>
            {user?.photoURL ? (
              <img src={user.photoURL} alt="avatar" style={styles.avatarImg} />
            ) : (
              <div style={styles.avatarFallback}>
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            )}
          </button>
        </div>

        {/* Dropdown Menu */}
        {menuOpen && (
          <div style={styles.dropdown}>
            <div style={styles.dropdownUser}>
              <p style={styles.dropdownName}>{user?.name}</p>
              <p style={styles.dropdownEmail}>{user?.email}</p>
            </div>
            <div style={styles.dropdownDivider} />
            <button
              onClick={() => { navigate("/my-recipes"); setMenuOpen(false); }}
              style={styles.dropdownItem}
            >
              👤 My Recipes
            </button>
            <button
              onClick={() => { navigate("/shopping-list"); setMenuOpen(false); }}
              style={styles.dropdownItem}
            >
              🛒 Shopping List
            </button>
            <div style={styles.dropdownDivider} />
            <button onClick={logout} style={{ ...styles.dropdownItem, color: "#FC8181" }}>
              🚪 Logout
            </button>
          </div>
        )}
      </header>

      {/* Bottom Tab Bar — Mobile Style */}
      <nav style={styles.tabBar}>
        {NAV_ITEMS.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path} style={styles.tabItem}>
              <span style={{
                ...styles.tabIcon,
                background: active ? "var(--primary-light)" : "transparent",
                transform: active ? "scale(1.1)" : "scale(1)",
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

      {/* Spacer for fixed bottom nav */}
      <div style={{ height: "80px" }} />
    </>
  );
}

const styles = {
  header: {
    position: "sticky", top: 0, zIndex: 100,
    background: "rgba(255,255,255,0.95)",
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid var(--border)",
    padding: "12px 20px",
    display: "flex", alignItems: "center",
    justifyContent: "space-between",
  },
  brand: {
    display: "flex", alignItems: "center", gap: "8px",
    textDecoration: "none",
  },
  brandIcon: { fontSize: "1.5rem" },
  brandText: {
    fontSize: "1.2rem", fontWeight: "800",
    color: "var(--primary)", letterSpacing: "-0.5px",
  },
  headerRight: { display: "flex", alignItems: "center", gap: "8px" },
  iconBtn: {
    fontSize: "1.3rem", textDecoration: "none",
    padding: "6px", borderRadius: "10px",
    background: "var(--primary-light)",
  },
  addBtn: {
    padding: "8px 16px", background: "var(--primary)",
    color: "#fff", borderRadius: "10px", textDecoration: "none",
    fontWeight: "700", fontSize: "0.85rem",
  },
  avatarBtn: {
    background: "none", border: "none", cursor: "pointer",
    padding: 0, borderRadius: "50%",
  },
  avatarImg: { width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover" },
  avatarFallback: {
    width: "36px", height: "36px", borderRadius: "50%",
    background: "var(--primary)", color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: "700", fontSize: "1rem",
  },
  dropdown: {
    position: "absolute", top: "64px", right: "16px",
    background: "#fff", borderRadius: "var(--radius-lg)",
    boxShadow: "var(--shadow-lg)", border: "1px solid var(--border)",
    minWidth: "220px", overflow: "hidden", zIndex: 200,
  },
  dropdownUser: { padding: "16px" },
  dropdownName: { fontWeight: "700", color: "var(--text)", margin: "0 0 2px" },
  dropdownEmail: { fontSize: "0.8rem", color: "var(--text-secondary)", margin: 0 },
  dropdownDivider: { height: "1px", background: "var(--border)" },
  dropdownItem: {
    width: "100%", padding: "12px 16px", background: "none",
    border: "none", cursor: "pointer", textAlign: "left",
    fontSize: "0.95rem", color: "var(--text)", fontWeight: "500",
    display: "block",
  },
  tabBar: {
    position: "fixed", bottom: 0, left: 0, right: 0,
    background: "rgba(255,255,255,0.97)",
    backdropFilter: "blur(12px)",
    borderTop: "1px solid var(--border)",
    display: "flex", zIndex: 100,
    paddingBottom: "env(safe-area-inset-bottom)",
  },
  tabItem: {
    flex: 1, display: "flex", flexDirection: "column",
    alignItems: "center", padding: "8px 4px",
    textDecoration: "none", gap: "2px",
  },
  tabIcon: {
    fontSize: "1.3rem", padding: "6px 12px",
    borderRadius: "12px", transition: "all 0.2s",
  },
  tabLabel: { fontSize: "0.7rem", transition: "all 0.2s" },
};