import { useState } from "react";
import API from "../api/axios";
import { toast } from "react-toastify";

const LANGUAGES = [
  { code: "English", label: "English", flag: "🇬🇧", voiceCode: "en-US" },
  { code: "Hindi", label: "हिंदी", flag: "🇮🇳", voiceCode: "hi-IN" },
  { code: "Telugu", label: "తెలుగు", flag: "🏳️", voiceCode: "te-IN" },
];

export default function LanguageTranslator({ recipe, onTranslated }) {
  const [selected, setSelected] = useState("English");
  const [loading, setLoading] = useState(false);

  const handleLanguageChange = async (lang) => {
    if (lang.code === selected) return;

    if (lang.code === "English") {
      setSelected("English");
      onTranslated(null, "en-US");
      toast.success("Showing original recipe 🇬🇧");
      return;
    }

    setSelected(lang.code);
    setLoading(true);

    try {
      const res = await API.post("/ai/translate", {
        recipe,
        language: lang.code,
      });
      // ⭐ Pass both translated recipe AND voice language code
      onTranslated(res.data, lang.voiceCode);
      toast.success(`Translated to ${lang.code}! 🌐`);
    } catch (err) {
      toast.error("Translation failed. Try again.");
      setSelected("English");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <p style={styles.label}>🌐 Language</p>
      <div style={styles.btnGroup}>
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang)}
            disabled={loading}
            style={{
              ...styles.langBtn,
              background: selected === lang.code ? "#ff6b35" : "#f9f9f9",
              color: selected === lang.code ? "#fff" : "#444",
              border: selected === lang.code
                ? "2px solid #ff6b35"
                : "2px solid #f0f0f0",
              opacity: loading && selected !== lang.code ? 0.6 : 1,
            }}
          >
            <span style={styles.flag}>{lang.flag}</span>
            <span>{lang.label}</span>
            {loading && selected === lang.code && (
              <span style={styles.spinner}>⏳</span>
            )}
          </button>
        ))}
      </div>
      {loading && (
        <p style={styles.loadingText}>
          🤖 Translating recipe... this may take a few seconds
        </p>
      )}
    </div>
  );
}

const styles = {
  container: {
    background: "#fff8f5", borderRadius: "12px",
    padding: "16px 20px", marginBottom: "24px",
    border: "1px solid #ffe0d0",
  },
  label: { margin: "0 0 10px", fontWeight: "700", color: "#ff6b35", fontSize: "0.95rem" },
  btnGroup: { display: "flex", gap: "10px", flexWrap: "wrap" },
  langBtn: {
    display: "flex", alignItems: "center", gap: "6px",
    padding: "8px 18px", borderRadius: "10px", cursor: "pointer",
    fontWeight: "600", fontSize: "0.9rem", transition: "all 0.2s",
  },
  flag: { fontSize: "1.1rem" },
  spinner: { marginLeft: "4px" },
  loadingText: { margin: "10px 0 0", fontSize: "0.85rem", color: "#888", fontStyle: "italic" },
};