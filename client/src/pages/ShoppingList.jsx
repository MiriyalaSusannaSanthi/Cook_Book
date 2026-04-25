import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function ShoppingList() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("smartchef_shopping");
    if (saved) setItems(JSON.parse(saved));
  }, []);

  const save = (updated) => {
    setItems(updated);
    localStorage.setItem("smartchef_shopping", JSON.stringify(updated));
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

  // Group by recipe
  const grouped = items.reduce((acc, item, index) => {
    const key = item.recipeName || "Other";
    if (!acc[key]) acc[key] = [];
    acc[key].push({ ...item, originalIndex: index });
    return acc;
  }, {});

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={() => navigate(-1)} style={styles.back}>← Back</button>
        <h2 style={styles.heading}>🛒 Shopping List</h2>
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
        <>
          {/* Stats */}
          <div style={styles.statsRow}>
            <div style={styles.statBox}>
              <span style={styles.statNum}>{items.length}</span>
              <span style={styles.statLabel}>Total Items</span>
            </div>
            <div style={styles.statBox}>
              <span style={{ ...styles.statNum, color: "#38a169" }}>{checkedCount}</span>
              <span style={styles.statLabel}>Got It</span>
            </div>
            <div style={styles.statBox}>
              <span style={{ ...styles.statNum, color: "#ff6b35" }}>{uncheckedCount}</span>
              <span style={styles.statLabel}>Remaining</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div style={styles.progressBar}>
            <div style={{
              ...styles.progressFill,
              width: items.length > 0 ? `${(checkedCount / items.length) * 100}%` : "0%"
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

          {/* Grouped by Recipe */}
          {Object.entries(grouped).map(([recipeName, recipeItems]) => (
            <div key={recipeName} style={styles.group}>
              <p style={styles.groupTitle}>📖 {recipeName}</p>
              <div style={styles.itemList}>
                {recipeItems.map((item) => (
                  <div
                    key={item.originalIndex}
                    style={{
                      ...styles.item,
                      background: item.checked ? "#f0fff4" : "#fff",
                      borderColor: item.checked ? "#9ae6b4" : "#f0f0f0",
                    }}
                  >
                    <div style={styles.itemLeft} onClick={() => toggleItem(item.originalIndex)}>
                      <div style={{
                        ...styles.checkbox,
                        background: item.checked ? "#38a169" : "#fff",
                        borderColor: item.checked ? "#38a169" : "#ddd",
                      }}>
                        {item.checked && <span style={styles.checkmark}>✓</span>}
                      </div>
                      <div>
                        <p style={{
                          ...styles.itemName,
                          textDecoration: item.checked ? "line-through" : "none",
                          color: item.checked ? "#aaa" : "#333",
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
        </>
      )}
    </div>
  );
}

const styles = {
  container: { padding: "24px", maxWidth: "700px", margin: "0 auto" },
  header: { display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" },
  back: { background: "none", border: "none", color: "#ff6b35", fontSize: "1rem",
    cursor: "pointer", fontWeight: "600", padding: 0 },
  heading: { fontSize: "1.8rem", margin: 0, color: "#222" },
  emptyBox: { textAlign: "center", padding: "60px 20px" },
  emptyIcon: { fontSize: "4rem", margin: "0 0 12px" },
  emptyText: { fontSize: "1.2rem", color: "#444", margin: "0 0 8px", fontWeight: "600" },
  emptyHint: { color: "#aaa", marginBottom: "24px" },
  exploreBtn: { padding: "12px 28px", background: "#ff6b35", color: "#fff",
    border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "bold", fontSize: "1rem" },
  statsRow: { display: "flex", gap: "12px", marginBottom: "16px" },
  statBox: { flex: 1, background: "#f9f9f9", borderRadius: "12px", padding: "14px",
    textAlign: "center", display: "flex", flexDirection: "column", gap: "4px" },
  statNum: { fontSize: "1.8rem", fontWeight: "bold", color: "#222" },
  statLabel: { fontSize: "0.8rem", color: "#888" },
  progressBar: { height: "8px", background: "#f0f0f0", borderRadius: "4px", marginBottom: "8px" },
  progressFill: { height: "100%", background: "#38a169", borderRadius: "4px", transition: "width 0.4s" },
  doneText: { color: "#38a169", fontWeight: "600", textAlign: "center", marginBottom: "12px" },
  actionRow: { display: "flex", gap: "10px", marginBottom: "24px", flexWrap: "wrap" },
  clearCheckedBtn: { padding: "8px 16px", background: "#f0fff4", color: "#38a169",
    border: "1px solid #9ae6b4", borderRadius: "8px", cursor: "pointer", fontWeight: "500" },
  clearAllBtn: { padding: "8px 16px", background: "#fff5f5", color: "#e53e3e",
    border: "1px solid #feb2b2", borderRadius: "8px", cursor: "pointer", fontWeight: "500" },
  group: { marginBottom: "24px" },
  groupTitle: { fontWeight: "700", color: "#ff6b35", marginBottom: "10px",
    fontSize: "0.95rem", textTransform: "uppercase", letterSpacing: "0.5px" },
  itemList: { display: "flex", flexDirection: "column", gap: "8px" },
  item: { display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "12px 16px", borderRadius: "10px", border: "1px solid",
    transition: "all 0.2s", cursor: "pointer" },
  itemLeft: { display: "flex", alignItems: "center", gap: "12px", flex: 1 },
  checkbox: { width: "22px", height: "22px", borderRadius: "6px", border: "2px solid",
    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
    transition: "all 0.2s" },
  checkmark: { color: "#fff", fontSize: "0.8rem", fontWeight: "bold" },
  itemName: { margin: 0, fontWeight: "500", fontSize: "0.95rem", transition: "all 0.2s" },
  itemQty: { margin: 0, fontSize: "0.8rem", color: "#ff6b35" },
  removeBtn: { background: "none", border: "none", cursor: "pointer",
    color: "#ccc", fontSize: "0.9rem", padding: "4px 8px",
    borderRadius: "6px", transition: "color 0.2s" },
};