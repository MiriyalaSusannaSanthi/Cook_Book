import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

export default function VoiceAssistant({ onIngredientsDetected }) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript.toLowerCase();
      setTranscript(text);
      handleCommand(text);
    };

    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);

    recognitionRef.current = recognition;
  }, []);

  const speak = (text) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
    setResponse(text);
  };

  // Extract ingredients from natural speech
  const extractIngredients = (text) => {
    return text
      .replace(/i have|i've got|i got|cook with|search for|search|find recipes with|what can i make with|what can i cook with|using|use/gi, "")
      .replace(/\band\b/gi, ",")
      .replace(/\s+/g, " ")
      .trim();
  };

  const handleCommand = (text) => {
    // Navigation commands
    if (text.includes("go home") || text.includes("explore recipes")) {
      speak("Opening explore page");
      navigate("/");
      return;
    }
    if (text.includes("add recipe") || text.includes("new recipe")) {
      speak("Opening add recipe page");
      navigate("/add-recipe");
      return;
    }
    if (text.includes("my recipes")) {
      speak("Opening your recipes");
      navigate("/my-recipes");
      return;
    }

    // Help command
    if (text.includes("help") || text.includes("what can you do")) {
      speak(
        "I can navigate pages and find recipes. Try saying: I have eggs and tomato, or search potatoes and cheese"
      );
      return;
    }

    // ⭐ Ingredient detection — catches anything that sounds like ingredients
    const ingredientTriggers = [
      "i have", "i've got", "i got", "cook with", "search",
      "find recipes", "what can i make", "what can i cook",
      "using", "potatoes", "eggs", "tomato", "chicken",
      "rice", "cheese", "onion", "garlic", "pasta",
    ];

    const isIngredientQuery = ingredientTriggers.some((trigger) =>
      text.includes(trigger)
    );

    if (isIngredientQuery) {
      const ingredients = extractIngredients(text);
      if (ingredients.length > 1) {
        speak(`Searching recipes with ${ingredients}`);
        // ⭐ Navigate with ingredients in URL — WhatCanICook will auto search
        navigate(`/what-can-i-cook?ingredients=${encodeURIComponent(ingredients)}`);
        return;
      }
    }

    // If nothing matched, treat entire speech as ingredient search
    const cleaned = extractIngredients(text);
    if (cleaned.length > 1) {
      speak(`Let me find recipes with ${cleaned}`);
      navigate(`/what-can-i-cook?ingredients=${encodeURIComponent(cleaned)}`);
      return;
    }

    speak(`I heard ${text}. Try saying: I have potatoes and eggs`);
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

  if (!supported) return null;

  return (
    <div style={styles.wrapper}>
      <button
        onClick={toggleListening}
        style={{
          ...styles.micBtn,
          background: listening ? "#e53e3e" : "#ff6b35",
          transform: listening ? "scale(1.15)" : "scale(1)",
          boxShadow: listening
            ? "0 0 0 8px rgba(229,62,62,0.2)"
            : "0 4px 16px rgba(0,0,0,0.2)",
        }}
        title="Voice Assistant"
      >
        {listening ? "🔴" : "🎤"}
      </button>

      {(listening || transcript || response) && (
        <div style={styles.popup}>
          <p style={styles.popupTitle}>
            {listening ? "🎙 Listening..." : "🍳 SmartChef"}
          </p>
          {transcript && (
            <p style={styles.transcript}>
              <strong>You:</strong> {transcript}
            </p>
          )}
          {response && (
            <p style={styles.responseText}>
              <strong>Chef:</strong> {response}
            </p>
          )}
          {listening && (
            <div style={styles.wave}>
              {[1, 2, 3, 4, 5].map((i) => (
                <span
                  key={i}
                  style={{
                    display: "inline-block",
                    width: "4px",
                    background: "#ff6b35",
                    borderRadius: "2px",
                    animation: `wave 0.8s ease-in-out ${i * 0.1}s infinite`,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

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
    display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "12px",
  },
  micBtn: {
    width: "56px", height: "56px", borderRadius: "50%", border: "none",
    fontSize: "1.5rem", cursor: "pointer",
    transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center",
  },
  popup: {
    background: "#fff", borderRadius: "16px", padding: "16px 20px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.15)", maxWidth: "280px",
    border: "1px solid #ffe0d0",
  },
  popupTitle: { margin: "0 0 8px", fontWeight: "bold", color: "#ff6b35", fontSize: "0.95rem" },
  transcript: { margin: "0 0 6px", fontSize: "0.85rem", color: "#444" },
  responseText: { margin: 0, fontSize: "0.85rem", color: "#222" },
  wave: { display: "flex", alignItems: "center", gap: "4px", marginTop: "10px", height: "24px" },
};