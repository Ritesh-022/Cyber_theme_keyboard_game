import { useEffect, useRef, useState } from "react";
import { useTypingGame } from "../hooks/useTypingGame";
import { useAI } from "../hooks/useAI";
import api from "../utils/api";
import { useAuth } from "../hooks/useAuth";
import LineChart from "../components/LineChart";

const LEVELS = ["easy", "medium", "hard"];

function cleanFeedback(text) {
  return text.replace(/\*\*/g, "").replace(/\*/g, "").trim();
}

function parseTips(text) {
  return cleanFeedback(text)
    .split(/\n+/)
    .map(l => l.trim())
    .filter(l => /^\d\./.test(l));
}

export default function GamePage({ theme }) {
  const [level, setLevel] = useState("medium");
  const [aiWords, setAiWords] = useState(null);
  const [gameKey, setGameKey] = useState(0);
  const { words, input, wordIndex, timeLeft, mpm, accuracy, finished, handleInput, snapshots } =
    useTypingGame(60, aiWords);
  const { user } = useAuth();
  const { generateText, analyze, loading: aiLoading } = useAI();
  const [tips, setTips] = useState([]);
  const [analyzing, setAnalyzing] = useState(false);
  const t = theme;

  useEffect(() => {
    if (!finished) return;
    if (user) api.post("/user/stats", { mpm, accuracy }).catch(() => {});
    if (user) {
      setAnalyzing(true);
      analyze(mpm, accuracy)
        .then(raw => setTips(parseTips(raw)))
        .catch(() => {})
        .finally(() => setAnalyzing(false));
    }
  }, [finished]); // eslint-disable-line

  const loadAIText = async () => {
    const text = await generateText(level);
    const parsed = text.trim().split(/\s+/).filter(w => w.length > 0);
    setAiWords(parsed);
    setGameKey(k => k + 1);
  };

  return (
    <div style={{ ...styles.page, background: t.bg, fontFamily: t.font }}>
      <div style={{ ...styles.topBar, borderBottom: `1px solid ${t.border}`, fontFamily: t.font }}>
        <span style={{ color: t.primary, fontWeight: 700, letterSpacing: 4, fontSize: 14 }}>
          TYPO<span style={{ color: t.accent }}>ERROR</span>
        </span>
        <span style={{ color: t.secondary, fontSize: 10, letterSpacing: 4 }}>{t.label}</span>
        <span style={{ color: t.secondary, fontSize: 11, letterSpacing: 2 }}>
          {user ? `${user.username} · ${user.uniqueId}` : ""}
        </span>
      </div>

      {finished ? (
        <ResultScreen
          mpm={mpm} accuracy={accuracy} tips={tips} analyzing={analyzing}
          user={user} theme={t} snapshots={snapshots}
          onRetry={() => { setAiWords(null); setTips([]); setGameKey(k => k + 1); }}
        />
      ) : (
        <Game
          key={gameKey}
          words={words} input={input} wordIndex={wordIndex}
          timeLeft={timeLeft} mpm={mpm} accuracy={accuracy} handleInput={handleInput}
          level={level} setLevel={setLevel}
          loadAIText={loadAIText} aiLoading={aiLoading} theme={t}
        />
      )}
    </div>
  );
}

function Game({ words, input, wordIndex, timeLeft, mpm, accuracy, handleInput,
  level, setLevel, loadAIText, aiLoading, theme: t }) {
  const inputRef = useRef(null);
  useEffect(() => { inputRef.current?.focus(); }, []);

  return (
    <div style={{ display: "contents" }} onClick={() => inputRef.current?.focus()}>
      <div style={styles.controls}>
        {LEVELS.map(l => (
          <button key={l} onClick={() => setLevel(l)}
            style={{
              ...styles.pill,
              borderRadius: t.radius,
              fontFamily: t.font,
              color: level === l ? t.bg : t.secondary,
              background: level === l ? t.primary : "transparent",
              border: `${t.name === "dawn" ? "2px" : "1px"} solid ${level === l ? t.primary : t.border}`
            }}>
            {l.toUpperCase()}
          </button>
        ))}
        <div style={styles.divider} />
        <button onClick={loadAIText} disabled={aiLoading}
          style={{
            ...styles.pill,
            borderRadius: t.radius,
            fontFamily: t.font,
            color: t.primary,
            border: `1px solid ${t.primary}`,
            background: "transparent",
            opacity: aiLoading ? 0.4 : 1,
            letterSpacing: 3
          }}>
          {aiLoading ? "GENERATING..." : "⚡ AI TEXT"}
        </button>
      </div>

      <div style={styles.statsBar}>
        <Stat label="TIME" value={timeLeft} color={timeLeft <= 10 ? "#ff4444" : t.primary} urgent={timeLeft <= 10} />
        <Stat label="MPM" value={mpm} color={t.primary} />
        <Stat label="ACC" value={`${accuracy}%`} color={accuracy < 80 ? "#ff9944" : t.accent} />
      </div>

      <WordDisplay words={words} wordIndex={wordIndex} input={input} theme={t} />

      <input ref={inputRef} value={input}
        onChange={e => handleInput(e.target.value)}
        style={styles.hiddenInput}
        autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false" />

      <p style={{ color: t.secondary + "88", fontSize: 10, letterSpacing: 3, marginTop: 20 }}>
        CLICK ANYWHERE · START TYPING
      </p>
    </div>
  );
}

function ResultScreen({ mpm, accuracy, tips, analyzing, user, theme: t, snapshots, onRetry }) {
  const grade = mpm >= 80 ? "ELITE" : mpm >= 50 ? "SKILLED" : mpm >= 30 ? "TRAINED" : "INITIATE";

  return (
    <div style={styles.result}>
      <div style={{ ...styles.scoreBlock, borderRadius: t.radius, borderColor: t.primary + "44", boxShadow: `0 0 60px ${t.glow}`, background: t.surface }}>
        <p style={{ color: t.secondary, fontSize: 10, letterSpacing: 5, marginBottom: 8 }}>FINAL SCORE</p>
        <p style={{ color: t.primary, fontSize: 72, fontWeight: 700, letterSpacing: 2, lineHeight: 1 }}>{mpm}</p>
        <p style={{ color: t.secondary, fontSize: 11, letterSpacing: 4, marginTop: 4 }}>MPM</p>
        <div style={styles.scoreMeta}>
          <span style={{ color: accuracy < 80 ? "#ff9944" : t.accent, fontSize: 13, letterSpacing: 2 }}>
            {accuracy}% ACC
          </span>
          <span style={{ color: t.primary, fontSize: 11, letterSpacing: 4,
            background: t.primary + "22", padding: "3px 10px", borderRadius: 2 }}>
            {grade}
          </span>
        </div>
      </div>

      {snapshots.length >= 2 && (
        <div style={{ ...styles.coachBox, borderRadius: t.radius, borderColor: t.secondary + "22", background: t.surface }}>
          <p style={{ color: t.secondary, fontSize: 10, letterSpacing: 5, marginBottom: 16 }}>SESSION MPM</p>
          <LineChart
            data={snapshots.map(s => ({ x: s.second, y: s.mpm }))}
            color={t.primary} width={460} height={130} yLabel="MPM"
          />
        </div>
      )}

      <div style={{ ...styles.coachBox, borderRadius: t.radius, borderColor: t.secondary + "44", background: t.surface }}>
        <p style={{ color: t.primary, fontSize: 10, letterSpacing: 5, marginBottom: 16 }}>⚡ AI COACH</p>
        {!user ? (
          <p style={{ color: t.secondary, fontSize: 12, letterSpacing: 2 }}>LOGIN TO UNLOCK AI COACHING</p>
        ) : analyzing ? (
          <div style={styles.analyzing}>
            <span style={{ color: t.secondary, fontSize: 11, letterSpacing: 3 }}>ANALYZING</span>
            <Dots color={t.primary} />
          </div>
        ) : tips.length > 0 ? (
          <div style={styles.tipsList}>
            {tips.map((tip, i) => (
              <div key={i} style={{ ...styles.tipRow, borderLeft: `2px solid ${t.primary}` }}>
                <span style={{ color: t.primary, fontSize: 11, minWidth: 18 }}>{i + 1}.</span>
                <p style={{ color: t.accent, fontSize: 13, lineHeight: 1.7, margin: 0 }}>
                  {tip.replace(/^\d\.\s*/, "")}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: t.secondary, fontSize: 12 }}>No feedback available</p>
        )}
      </div>

      <button onClick={onRetry} style={{ ...styles.retryBtn, borderRadius: t.radius, fontFamily: t.font, background: t.primary, color: t.bg }}>
        RETRY
      </button>
    </div>
  );
}

function Dots({ color }) {
  return (
    <span style={{ display: "inline-flex", gap: 4, marginLeft: 8 }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{
          width: 4, height: 4, borderRadius: "50%", background: color,
          animation: `pulse 1.2s ${i * 0.2}s infinite`, display: "inline-block"
        }} />
      ))}
      <style>{`@keyframes pulse { 0%,100%{opacity:.2} 50%{opacity:1} }`}</style>
    </span>
  );
}

function WordDisplay({ words, wordIndex, input, theme: t }) {
  const visible = words.slice(Math.max(0, wordIndex - 4), wordIndex + 20);
  const offset = Math.max(0, wordIndex - 4);

  return (
    <div style={styles.wordBox}>
      {visible.map((word, i) => {
        const absIdx = i + offset;
        const isCurrent = absIdx === wordIndex;
        const isDone = absIdx < wordIndex;
        let color = t.secondary + "55";
        if (isDone) color = t.secondary;
        if (isCurrent) color = t.primary;

        return (
          <span key={absIdx} style={{
            ...styles.word, color,
            textShadow: isCurrent ? `0 0 12px ${t.glow}` : "none",
            borderBottom: isCurrent ? `1px solid ${t.primary}66` : "1px solid transparent",
            paddingBottom: 2
          }}>
            {isCurrent
              ? word.split("").map((ch, ci) => (
                  <span key={ci} style={{
                    color: ci < input.length
                      ? (input[ci] === ch ? t.accent : "#ff4444")
                      : t.primary,
                    textShadow: ci < input.length && input[ci] !== ch ? "0 0 8px #ff444488" : "none"
                  }}>
                    {ch}
                  </span>
                ))
              : word}
          </span>
        );
      })}
    </div>
  );
}

function Stat({ label, value, color, urgent }) {
  return (
    <div style={{ textAlign: "center", minWidth: 80 }}>
      <p style={{ color: "#444", fontSize: 9, letterSpacing: 4, marginBottom: 4 }}>{label}</p>
      <p style={{ color, fontSize: 32, fontWeight: 700, letterSpacing: 1,
        transition: "color 0.3s", textShadow: urgent ? `0 0 16px #ff444466` : "none" }}>
        {value}
      </p>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    cursor: "default", padding: "80px 24px 40px" },
  topBar: { position: "fixed", top: 0, left: 0, right: 0,
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "14px 32px", backdropFilter: "blur(12px)", borderBottom: "1px solid #ffffff08" },
  controls: { display: "flex", gap: 6, alignItems: "center", marginBottom: 32 },
  divider: { width: 1, height: 20, background: "#ffffff15", margin: "0 6px" },
  pill: { padding: "6px 16px", cursor: "pointer", fontSize: 10, letterSpacing: 2, transition: "all 0.15s" },
  statsBar: { display: "flex", gap: 56, marginBottom: 48, alignItems: "center" },
  wordBox: { maxWidth: 700, lineHeight: 2.4, textAlign: "center",
    fontSize: 20, letterSpacing: 3, userSelect: "none" },
  word: { margin: "0 5px", display: "inline-block", transition: "color 0.08s" },
  hiddenInput: { position: "absolute", opacity: 0, pointerEvents: "none", width: 1, height: 1 },
  result: { display: "flex", flexDirection: "column", alignItems: "center",
    gap: 20, width: "100%", maxWidth: 520 },
  scoreBlock: { width: "100%", textAlign: "center", padding: "32px 24px", border: "1px solid" },
  scoreMeta: { display: "flex", justifyContent: "center", gap: 20, marginTop: 16, alignItems: "center" },
  coachBox: { width: "100%", padding: "24px", border: "1px solid" },
  analyzing: { display: "flex", alignItems: "center" },
  tipsList: { display: "flex", flexDirection: "column", gap: 12 },
  tipRow: { display: "flex", gap: 12, alignItems: "flex-start", paddingLeft: 12 },
  retryBtn: { padding: "12px 48px", border: "none", cursor: "pointer", fontSize: 12, letterSpacing: 4, fontWeight: 700 }
};
