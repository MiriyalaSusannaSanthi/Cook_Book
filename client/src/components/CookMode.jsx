import { useState, useEffect } from "react";

export default function CookMode({ recipe, onClose }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [timer, setTimer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  const steps = recipe.steps || [];
  const totalSteps = steps.length;

  // Auto read step when it changes
  useEffect(() => {
    speak(`Step ${currentStep + 1}. ${steps[currentStep]}`);
  }, [currentStep]);

  // Timer countdown
  useEffect(() => {
    let interval;
    if (timerRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0 && timerRunning) {
      setTimerRunning(false);
      speak("Timer done! Check your food.");
    }
    return () => clearInterval(interval);
  }, [timerRunning, timeLeft]);

  const speak = (text) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const next = () => {
    if (currentStep < totalSteps - 1) setCurrentStep((s) => s + 1);
    else speak("You have completed all steps. Enjoy your meal!");
  };

  const prev = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

  const repeat = () => speak(`Step ${currentStep + 1}. ${steps[currentStep]}`);

  const startTimer = (minutes) => {
    setTimeLeft(minutes * 60);
    setTimerRunning(true);
    speak(`Timer set for ${minutes} minutes`);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {/* Header */}
        <div style={styles.header}>
          <h2 style={styles.title}>👨‍🍳 {recipe.title}</h2>
          <button onClick={() => { window.speechSynthesis.cancel(); onClose(); }}
            style={styles.closeBtn}>✕</button>
        </div>

        {/* Progress */}
        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill,
            width: `${((currentStep + 1) / totalSteps) * 100}%` }} />
        </div>
        <p style={styles.stepCount}>Step {currentStep + 1} of {totalSteps}</p>

        {/* Current Step */}
        <div style={styles.stepBox}>
          <div style={styles.stepNumber}>{currentStep + 1}</div>
          <p style={styles.stepText}>{steps[currentStep]}</p>
        </div>

        {/* Timer */}
        <div style={styles.timerSection}>
          <p style={styles.timerLabel}>⏱ Set a timer:</p>
          <div style={styles.timerBtns}>
            {[1, 2, 5, 10, 15].map((m) => (
              <button key={m} onClick={() => startTimer(m)} style={styles.timerBtn}>
                {m}m
              </button>
            ))}
          </div>
          {timeLeft > 0 && (
            <div style={styles.countdown}>
              <span style={styles.countdownText}>{formatTime(timeLeft)}</span>
              <button onClick={() => { setTimerRunning(false); setTimeLeft(0); }}
                style={styles.cancelTimer}>Cancel</button>
            </div>
          )}
        </div>

        {/* Controls */}
        <div style={styles.controls}>
          <button onClick={prev} disabled={currentStep === 0} style={styles.navBtn}>
            ← Prev
          </button>
          <button onClick={repeat} style={styles.repeatBtn}>
            🔊 Repeat
          </button>
          <button onClick={next} style={styles.navBtn}>
            {currentStep === totalSteps - 1 ? "✅ Done" : "Next →"}
          </button>
        </div>

        {/* All steps preview */}
        <div style={styles.allSteps}>
          {steps.map((step, i) => (
            <div key={i} onClick={() => setCurrentStep(i)}
              style={{ ...styles.stepPreview,
                background: i === currentStep ? "#fff3ee" : "#f9f9f9",
                borderLeft: i === currentStep ? "3px solid #ff6b35" : "3px solid transparent",
                opacity: i < currentStep ? 0.5 : 1,
              }}>
              <span style={styles.previewNum}>{i + 1}</span>
              <span style={styles.previewText}>{step}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: { position:"fixed", inset:0, background:"rgba(0,0,0,0.7)",
    zIndex:2000, display:"flex", alignItems:"center", justifyContent:"center", padding:"16px" },
  modal: { background:"#fff", borderRadius:"20px", width:"100%", maxWidth:"560px",
    maxHeight:"90vh", overflowY:"auto", padding:"24px" },
  header: { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"16px" },
  title: { margin:0, fontSize:"1.3rem", color:"#222" },
  closeBtn: { background:"none", border:"none", fontSize:"1.3rem", cursor:"pointer", color:"#888" },
  progressBar: { height:"6px", background:"#f0f0f0", borderRadius:"3px", marginBottom:"6px" },
  progressFill: { height:"100%", background:"#ff6b35", borderRadius:"3px", transition:"width 0.3s" },
  stepCount: { fontSize:"0.85rem", color:"#888", marginBottom:"20px" },
  stepBox: { display:"flex", gap:"16px", alignItems:"flex-start", background:"#fff8f5",
    borderRadius:"16px", padding:"20px", marginBottom:"20px" },
  stepNumber: { background:"#ff6b35", color:"#fff", width:"36px", height:"36px",
    borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center",
    fontWeight:"bold", flexShrink:0, fontSize:"1rem" },
  stepText: { margin:0, fontSize:"1.1rem", color:"#222", lineHeight:1.7 },
  timerSection: { marginBottom:"20px" },
  timerLabel: { fontSize:"0.9rem", color:"#666", marginBottom:"8px" },
  timerBtns: { display:"flex", gap:"8px", flexWrap:"wrap" },
  timerBtn: { padding:"6px 14px", background:"#f0f0f0", border:"none",
    borderRadius:"8px", cursor:"pointer", fontWeight:"500", fontSize:"0.9rem" },
  countdown: { display:"flex", alignItems:"center", gap:"12px", marginTop:"10px" },
  countdownText: { fontSize:"2rem", fontWeight:"bold", color:"#ff6b35" },
  cancelTimer: { background:"none", border:"1px solid #ccc", padding:"4px 10px",
    borderRadius:"6px", cursor:"pointer", color:"#888" },
  controls: { display:"flex", gap:"12px", marginBottom:"20px" },
  navBtn: { flex:1, padding:"12px", background:"#ff6b35", color:"#fff",
    border:"none", borderRadius:"10px", cursor:"pointer", fontWeight:"bold", fontSize:"1rem" },
  repeatBtn: { flex:1, padding:"12px", background:"#fff3ee", color:"#ff6b35",
    border:"1px solid #ff6b35", borderRadius:"10px", cursor:"pointer", fontWeight:"bold", fontSize:"1rem" },
  allSteps: { display:"flex", flexDirection:"column", gap:"8px" },
  stepPreview: { display:"flex", gap:"10px", padding:"10px 14px",
    borderRadius:"8px", cursor:"pointer", transition:"all 0.2s" },
  previewNum: { fontWeight:"bold", color:"#ff6b35", flexShrink:0 },
  previewText: { fontSize:"0.85rem", color:"#444" },
};