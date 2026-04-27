import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function ShoppingList() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  // ⭐ Re-read localStorage every time page is visited
  useEffect(() => {
    loadItems();

    // Also listen for storage changes from other tabs
    window.addEventListener("storage", loadItems);
    return () => window.removeEventListener("storage", loadItems);
  }, []);

  const loadItems = () => {
    try {
      const saved = localStorage.getItem("smartchef_shopping");
      if (saved) {
        const parsed = JSON.parse(saved);
        setItems(Array.isArray(parsed) ? parsed : []);
      } else {
        setItems([]);
      }
    } catch (err) {
      console.error("Failed to load shopping list:", err);
      setItems([]);
    }
  };

  const save = (updated) => {
    try {
      localStorage.setItem("smartchef_shopping", JSON.stringify(updated));
      setItems(updated);
    } catch (err) {
      console.error("Failed to save:", err);
      toast.error("Failed to save changes");
    }
  };

  const toggleItem = (index) => {
    const updated = items.map((item, i) =>
      i === index ? { ...item, checked: !item.checked } : item
    );
    save(updated);
  };

  const removeItem = (index) => {
    const updated = items.filter((_, i) => i !== index);
    save(updated);
    toast.success("Item removed");
  };

  const clearAll = () => {
    if (!window.confirm("Clear entire shopping list?")) return;
    save([]);
    toast.success("Shopping list cleared 🗑");
  };

  const clearChecked = () => {
    const updated = items.filter((item) => !item.checked);
    save(updated);
    toast.success("Checked items removed ✅");
  };

  const checkedCount = items.filter((i) => i.checked).length;
  const uncheckedCount = items.length - checkedCount;

  const grouped = items.reduce((acc, item, index) => {
    const key = item.recipeName || "Other";
    if (!acc[key]) acc[key] = [];
    acc[key].push({ ...item, originalIndex: index });
    return acc;
  }, {});

  return (
    <div style={styles.container} className="page">
      {/* Header */}
      <div style={styles.header}>
        <button onClick={() => navigate(-1)} style={styles.back}>←</button>
        <h2 style={styles.heading}>🛒 Shopping List</h2>
        <div />
      </div>

      {items.length === 0 ? (
        <div style={styles.emptyBox}>
          <p style={styles.emptyIcon}>🛒</p>
          <p style={styles.emptyText}>Your shopping list is empty</p>
          <p style={styles.emptyHint}>
            Open any recipe and click "Add to Shopping List"
          </p>
          <button onClick={() => navigate("/")} style={styles.exploreBtn}>
            Explore Recipes
          </button>
        </div>
      ) : (
        <div style={styles.content}>
          {/* Stats */}
          <div style={styles.statsRow}>
            <div style={styles.statBox}>
              <span style={styles.statNum}>{items.length}</span>
              <span style={styles.statLabel}>Total</span>
            </div>
            <div style={styles.statBox}>
              <span style={{ ...styles.statNum, color: "#48BB78" }}>{checkedCount}</span>
              <span style={styles.statLabel}>Got It</span>
            </div>
            <div style={styles.statBox}>
              <span style={{ ...styles.statNum, color: "var(--primary)" }}>{uncheckedCount}</span>
              <span style={styles.statLabel}>Remaining</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div style={styles.progressBar}>
            <div style={{
              ...styles.progressFill,
              width: items.length > 0
                ? `${(checkedCount / items.length) * 100}%`
                : "0%",
            }} />
          </div>

          {checkedCount === items.length && items.length > 0 && (
            <p style={styles.doneText}>🎉 All items collected! Ready to cook!</p>
          )}

          {/* Action Buttons */}
          <div style={styles.actionRow}>
            {checkedCount > 0 && (
              <button onClick={clearChecked} style={styles.clearCheckedBtn}>
                ✅ Remove Checked ({checkedCount})
              </button>
            )}
            <button onClick={clearAll} style={styles.clearAllBtn}>
              🗑 Clear All
            </button>
          </div>

          {/* Grouped Items */}
          {Object.entries(grouped).map(([recipeName, recipeItems]) => (
            <div key={recipeName} style={styles.group}>
              <p style={styles.groupTitle}>📖 {recipeName}</p>
              <div style={styles.itemList}>
                {recipeItems.map((item) => (
                  <div
                    key={item.originalIndex}
                    style={{
                      ...styles.item,
                      background: item.checked ? "#F0FFF4" : "#fff",
                      borderColor: item.checked ? "#9AE6B4" : "var(--border)",
                    }}
                  >
                    <div
                      style={styles.itemLeft}
                      onClick={() => toggleItem(item.originalIndex)}
                    >
                      <div style={{
                        ...styles.checkbox,
                        background: item.checked ? "#48BB78" : "#fff",
                        borderColor: item.checked ? "#48BB78" : "var(--border)",
                      }}>
                        {item.checked && <span style={styles.checkmark}>✓</span>}
                      </div>
                      <div>
                        <p style={{
                          ...styles.itemName,
                          textDecoration: item.checked ? "line-through" : "none",
                          color: item.checked ? "#A0AEC0" : "var(--text)",
                        }}>
                          {item.name}
                        </p>
                        {item.quantity && (
                          <p style={styles.itemQty}>{item.quantity}</p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(item.originalIndex)}
                      style={styles.removeBtn}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", background: "var(--bg)", paddingBottom: "100px" },
  header: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "16px 20px", background: "#fff",
    borderBottom: "1px solid var(--border)",
    position: "sticky", top: 0, zIndex: 10,
  },
  back: {
    background: "var(--bg)", border: "none", cursor: "pointer",
    fontSize: "1.2rem", padding: "8px 12px", borderRadius: "10px", fontWeight: "700",
  },
  heading: { fontSize: "1.1rem", fontWeight: "800", color: "var(--text)" },
  emptyBox: { textAlign: "center", padding: "80px 24px" },
  emptyIcon: { fontSize: "4rem", margin: "0 0 16px" },
  emptyText: { fontSize: "1.2rem", fontWeight: "700", color: "var(--text)", margin: "0 0 8px" },
  emptyHint: { color: "var(--text-secondary)", marginBottom: "28px", fontSize: "0.9rem" },
  exploreBtn: {
    padding: "12px 28px", background: "var(--primary)", color: "#fff",
    border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: "700",
  },
  content: { padding: "20px 16px" },
  statsRow: { display: "flex", gap: "12px", marginBottom: "16px" },
  statBox: {
    flex: 1, background: "#fff", borderRadius: "var(--radius-md)",
    padding: "14px", textAlign: "center",
    display: "flex", flexDirection: "column", gap: "4px",
    boxShadow: "var(--shadow-sm)", border: "1px solid var(--border)",
  },
  statNum: { fontSize: "1.8rem", fontWeight: "800", color: "var(--text)" },
  statLabel: { fontSize: "0.75rem", color: "var(--text-secondary)" },
  progressBar: {
    height: "8px", background: "var(--border)",
    borderRadius: "4px", marginBottom: "8px",
  },
  progressFill: {
    height: "100%", background: "#48BB78",
    borderRadius: "4px", transition: "width 0.4s",
  },
  doneText: {
    color: "#48BB78", fontWeight: "700",
    textAlign: "center", marginBottom: "16px",
  },
  actionRow: { display: "flex", gap: "10px", marginBottom: "24px", flexWrap: "wrap" },
  clearCheckedBtn: {
    padding: "10px 16px", background: "#F0FFF4", color: "#48BB78",
    border: "1px solid #9AE6B4", borderRadius: "10px",
    cursor: "pointer", fontWeight: "600", fontSize: "0.85rem",
  },
  clearAllBtn: {
    padding: "10px 16px", background: "#FFF5F5", color: "#FC8181",
    border: "1px solid #FEB2B2", borderRadius: "10px",
    cursor: "pointer", fontWeight: "600", fontSize: "0.85rem",
  },
  group: { marginBottom: "24px" },
  groupTitle: {
    fontWeight: "700", color: "var(--primary)", marginBottom: "10px",
    fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.5px",
  },
  itemList: { display: "flex", flexDirection: "column", gap: "8px" },
  item: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "14px 16px", borderRadius: "var(--radius-md)",
    border: "1px solid", transition: "all 0.2s",
    boxShadow: "var(--shadow-sm)",
  },
  itemLeft: {
    display: "flex", alignItems: "center",
    gap: "12px", flex: 1, cursor: "pointer",
  },
  checkbox: {
    width: "24px", height: "24px", borderRadius: "8px",
    border: "2px solid", display: "flex", alignItems: "center",
    justifyContent: "center", flexShrink: 0, transition: "all 0.2s",
  },
  checkmark: { color: "#fff", fontSize: "0.85rem", fontWeight: "800" },
  itemName: { margin: 0, fontWeight: "600", fontSize: "0.95rem", transition: "all 0.2s" },
  itemQty: { margin: 0, fontSize: "0.8rem", color: "var(--primary)", fontWeight: "500" },
  removeBtn: {
    background: "none", border: "none", cursor: "pointer",
    color: "#CBD5E0", fontSize: "0.9rem", padding: "4px 8px",
    borderRadius: "6px",
  },
};