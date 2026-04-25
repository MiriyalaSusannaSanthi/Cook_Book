import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const ALLOWED_PATHS = ["/", "/my-recipes", "/ai-generator", "/meal-planner", "/what-can-i-cook"];

const LANGUAGE_CONFIG = {
  English: {
    code: "en-US",
    flag: "🇬🇧",
    label: "EN",
    hints: [
      '"Go to Meal Planner"',
      '"Open AI Chef"',
      '"My Recipes"',
      '"I have eggs and tomato"',
    ],
    listening: "🎙 Listening...",
    youLabel: "You:",
    chefLabel: "Chef:",
    notUnderstood: "Sorry, I didn't understand. Say help to know what I can do.",
    helpText: "I can navigate to Explore, My Recipes, AI Chef, Meal Planner, or search by ingredients.",
  },
  Hindi: {
    code: "hi-IN",
    flag: "🇮🇳",
    label: "हिं",
    hints: [
      '"मील प्लानर खोलो"',
      '"एआई शेफ खोलो"',
      '"मेरी रेसिपी"',
      '"मेरे पास अंडे हैं"',
    ],
    listening: "🎙 सुन रहा हूं...",
    youLabel: "आप:",
    chefLabel: "शेफ:",
    notUnderstood: "माफ करें, समझ नहीं आया। मदद के लिए help कहें।",
    helpText: "मैं Explore, My Recipes, AI Chef, Meal Planner पर जा सकता हूं या ingredients से रेसिपी खोज सकता हूं।",
  },
  Telugu: {
    code: "te-IN",
    flag: "🏳️",
    label: "తె",
    hints: [
      '"మీల్ ప్లానర్ తెరువు"',
      '"AI చెఫ్ తెరువు"',
      '"నా రెసిపీలు"',
      '"నాకు గుడ్లు ఉన్నాయి"',
    ],
    listening: "🎙 వింటున్నాను...",
    youLabel: "మీరు:",
    chefLabel: "చెఫ్:",
    notUnderstood: "క్షమించండి, అర్థం కాలేదు. సహాయం కోసం help చెప్పండి.",
    helpText: "నేను Explore, My Recipes, AI Chef, Meal Planner కి నావిగేట్ చేయగలను లేదా ingredients తో రెసిపీలు వెతకగలను.",
  },
};

export default function VoiceAssistant() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [supported, setSupported] = useState(true);
  const [language, setLanguage] = useState("English");
  const [showLangPicker, setShowLangPicker] = useState(false);
  const recognitionRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const isAllowed = ALLOWED_PATHS.includes(location.pathname);
  const config = LANGUAGE_CONFIG[language];

  useEffect(() => {
    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }
    setupRecognition(language);
  }, [language]);

  const setupRecognition = (lang) => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = LANGUAGE_CONFIG[lang].code;

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript.toLowerCase();
      setTranscript(text);
      handleCommand(text, lang);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognitionRef.current = recognition;
  };

  const speak = (text, lang) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = LANGUAGE_CONFIG[lang].code;
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
    setResponse(text);
    setTimeout(() => { setTranscript(""); setResponse(""); }, 4000);
  };

  const extractIngredients = (text) => {
    return text
      .replace(/i have|i've got|i got|cook with|search for|search|find recipes with|what can i make with|what can i cook with|using|use/gi, "")
      .replace(/mere paas|मेरे पास|నాకు ఉన్నాయి|తో వంట చేయి/gi, "")
      .replace(/\band\b|और|మరియు/gi, ",")
      .replace(/\s+/g, " ")
      .trim();
  };

  const handleCommand = (text, lang) => {
    // ── Navigation ───────────────────────────────────────
    if (
      text.includes("explore") || text.includes("go home") || text.includes("home") ||
      text.includes("होम") || text.includes("ఎక్స్‌ప్లోర్")
    ) {
      speak("Opening Explore page", lang);
      navigate("/");
      return;
    }

    if (
      text.includes("my recipes") || text.includes("my recipe") ||
      text.includes("मेरी रेसिपी") || text.includes("నా రెసిపీలు")
    ) {
      speak("Opening My Recipes", lang);
      navigate("/my-recipes");
      return;
    }

    if (
      text.includes("ai chef") || text.includes("ai recipe") ||
      text.includes("generate recipe") || text.includes("artificial intelligence") ||
      text.includes("एआई शेफ") || text.includes("ai చెఫ్")
    ) {
      speak("Opening AI Recipe Generator", lang);
      navigate("/ai-generator");
      return;
    }

    if (
      text.includes("meal plan") || text.includes("meal planner") ||
      text.includes("मील प्लान") || text.includes("మీల్ ప్లానర్")
    ) {
      speak("Opening Meal Planner", lang);
      navigate("/meal-planner");
      return;
    }

    if (
      text.includes("what can i cook") || text.includes("what can i make") ||
      text.includes("ingredient") || text.includes("सामग्री") || text.includes("పదార్థాలు")
    ) {
      speak("Opening What Can I Cook", lang);
      navigate("/what-can-i-cook");
      return;
    }

    // ── Help ─────────────────────────────────────────────
    if (text.includes("help") || text.includes("मदद") || text.includes("సహాయం")) {
      speak(LANGUAGE_CONFIG[lang].helpText, lang);
      return;
    }

    // ── Ingredient Search ────────────────────────────────
    const ingredientTriggers = [
      "i have", "i've got", "cook with", "search", "find recipes",
      "mere paas", "मेरे पास", "నాకు", "తో వంట",
    ];

    const isIngredientQuery = ingredientTriggers.some((t) => text.includes(t));
    if (isIngredientQuery) {
      const ingredients = extractIngredients(text);
      if (ingredients.length > 1) {
        speak(`Searching recipes with ${ingredients}`, lang);
        navigate(`/what-can-i-cook?ingredients=${encodeURIComponent(ingredients)}`);
        return;
      }
    }

    // ── Fallback ─────────────────────────────────────────
    const cleaned = extractIngredients(text);
    if (cleaned.length > 1) {
      speak(`Searching recipes with ${cleaned}`, lang);
      navigate(`/what-can-i-cook?ingredients=${encodeURIComponent(cleaned)}`);
      return;
    }

    speak(LANGUAGE_CONFIG[lang].notUnderstood, lang);
  };

  const toggleListening = () => {
    if (!supported) return;
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      setTranscript("");
      setResponse("");
      recognitionRef.current.start();
      setListening(true);
    }
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
    setShowLangPicker(false);
    setListening(false);
    setTranscript("");
    setResponse("");
  };

  if (!supported || !isAllowed) return null;

  return (
    <div style={styles.wrapper}>
      {/* Popup */}
      {(listening || transcript || response) && (
        <div style={styles.popup}>
          <p style={styles.popupTitle}>
            {listening ? config.listening : "🍳 SmartChef"}
          </p>
          {transcript && (
            <p style={styles.transcript}>
              <strong>{config.youLabel}</strong> {transcript}
            </p>
          )}
          {response && (
            <p style={styles.responseText}>
              <strong>{config.chefLabel}</strong> {response}
            </p>
          )}
          {listening && (
            <>
              <div style={styles.wave}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <span key={i} style={{
                    display: "inline-block", width: "4px",
                    background: "#ff6b35", borderRadius: "2px",
                    animation: `wave 0.8s ease-in-out ${i * 0.1}s infinite`,
                  }} />
                ))}
              </div>
              <div style={styles.hints}>
                <p style={styles.hintTitle}>Try saying:</p>
                {config.hints.map((hint, i) => (
                  <p key={i} style={styles.hint}>{hint}</p>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Language Picker */}
      {showLangPicker && (
        <div style={styles.langPicker}>
          {Object.entries(LANGUAGE_CONFIG).map(([key, val]) => (
            <button
              key={key}
              onClick={() => changeLanguage(key)}
              style={{
                ...styles.langOption,
                background: language === key ? "#ff6b35" : "#f9f9f9",
                color: language === key ? "#fff" : "#333",
              }}
            >
              {val.flag} {key}
            </button>
          ))}
        </div>
      )}

      {/* Buttons Row */}
      <div style={styles.btnRow}>
        {/* Language Toggle */}
        <button
          onClick={() => setShowLangPicker(!showLangPicker)}
          style={styles.langBtn}
          title="Change language"
        >
          {config.flag} {config.label}
        </button>

        {/* Mic Button */}
        <button
          onClick={toggleListening}
          style={{
            ...styles.micBtn,
            background: listening
              ? "linear-gradient(135deg, #e53e3e, #c53030)"
              : "linear-gradient(135deg, #ff6b35, #f7931e)",
            transform: listening ? "scale(1.15)" : "scale(1)",
            boxShadow: listening
              ? "0 0 0 8px rgba(229,62,62,0.2), 0 4px 16px rgba(229,62,62,0.4)"
              : "0 4px 16px rgba(255,107,53,0.4)",
          }}
          title={listening ? "Stop" : "Speak"}
        >
          {listening ? "🔴" : "🎤"}
        </button>
      </div>

      <style>{`
        @keyframes wave {
          0%, 100% { height: 6px; }
          50% { height: 22px; }
        }
      `}</style>
    </div>
  );
}

const styles = {
  wrapper: {
    position: "fixed", bottom: "24px", right: "24px", zIndex: 1000,
    display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "10px",
  },
  popup: {
    background: "#fff", borderRadius: "16px", padding: "16px 20px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.15)", maxWidth: "260px",
    border: "1px solid #ffe0d0",
  },
  popupTitle: { margin: "0 0 8px", fontWeight: "bold", color: "#ff6b35", fontSize: "0.95rem" },
  transcript: { margin: "0 0 6px", fontSize: "0.85rem", color: "#444" },
  responseText: { margin: 0, fontSize: "0.85rem", color: "#222" },
  wave: { display: "flex", alignItems: "center", gap: "4px", marginTop: "10px", height: "24px" },
  hints: { marginTop: "12px", paddingTop: "10px", borderTop: "1px solid #f0f0f0" },
  hintTitle: { margin: "0 0 6px", fontSize: "0.75rem", color: "#aaa", fontWeight: "600" },
  hint: { margin: "0 0 3px", fontSize: "0.8rem", color: "#ff6b35", fontStyle: "italic" },
  langPicker: {
    background: "#fff", borderRadius: "12px", padding: "8px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.12)", display: "flex",
    flexDirection: "column", gap: "6px", border: "1px solid #f0f0f0",
  },
  langOption: {
    padding: "8px 16px", borderRadius: "8px", border: "none",
    cursor: "pointer", fontWeight: "500", fontSize: "0.9rem",
    textAlign: "left", transition: "all 0.2s",
  },
  btnRow: { display: "flex", gap: "8px", alignItems: "center" },
  langBtn: {
    padding: "8px 12px", background: "#fff", border: "1px solid #ffe0d0",
    borderRadius: "10px", cursor: "pointer", fontWeight: "600",
    fontSize: "0.85rem", color: "#ff6b35", boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
  micBtn: {
    width: "60px", height: "60px", borderRadius: "50%", border: "none",
    fontSize: "1.6rem", cursor: "pointer", transition: "all 0.2s",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
};