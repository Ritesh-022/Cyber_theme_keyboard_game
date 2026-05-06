import { Link } from "react-router-dom";

const STACK = [
  { layer: "FRONTEND", items: ["React 18", "React Router v6", "Axios"] },
  { layer: "BACKEND", items: ["Node.js", "Express", "MongoDB", "Mongoose"] },
  { layer: "AUTH", items: ["JWT", "bcrypt"] },
  { layer: "AI", items: ["Ollama", "llama3 (local)"] },
];

const PRINCIPLES = [
  { icon: "⚡", title: "SPEED FIRST", desc: "Every design decision optimizes for typing flow. No distractions, no lag." },
  { icon: "🔐", title: "IDENTITY LAYER", desc: "Your email is for login only. Your CYB-XXXX ID is your game identity." },
  { icon: "🧠", title: "LOCAL AI", desc: "AI coaching runs on your machine via Ollama. No API costs, no data sent out." },
  { icon: "🌗", title: "LIVING UI", desc: "The interface adapts to time of day: Dawn, Day, and Night." },
];

export default function AboutPage({ theme: t }) {
  return (
    <div style={{ ...s.page, background: t.bg, color: t.primary }}>

      {/* Hero */}
      <section style={s.hero}>
        <p style={{ color: t.secondary, fontSize: 10, letterSpacing: 5, marginBottom: 16 }}>ABOUT</p>
        <h1 style={{ color: t.primary, fontSize: "clamp(32px,6vw,64px)", fontWeight: 700,
          letterSpacing: 6, textShadow: `0 0 30px ${t.glow}`, marginBottom: 24 }}>
          TYPO<span style={{ color: t.accent }}>ERROR</span>
        </h1>
        <p style={{ color: t.secondary, fontSize: 15, lineHeight: 1.9, maxWidth: 560, textAlign: "center" }}>
          A cyber-tradition typing game built for speed, identity, and intelligence.
          Inspired by Monkeytype — but with a soul.
        </p>
      </section>

      <Divider t={t} />

      {/* Principles */}
      <section style={s.section}>
        <Label text="CORE PRINCIPLES" t={t} />
        <div style={s.grid}>
          {PRINCIPLES.map(p => (
            <div key={p.title} style={{ ...s.card, borderColor: t.secondary + "33" }}>
              <span style={{ fontSize: 28, display: "block", marginBottom: 12 }}>{p.icon}</span>
              <p style={{ color: t.primary, fontSize: 11, letterSpacing: 3, marginBottom: 8 }}>{p.title}</p>
              <p style={{ color: t.secondary, fontSize: 13, lineHeight: 1.7 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Divider t={t} />

      {/* Stack */}
      <section style={s.section}>
        <Label text="TECH STACK" t={t} />
        <div style={s.stackGrid}>
          {STACK.map(({ layer, items }) => (
            <div key={layer} style={{ ...s.stackCard, borderColor: t.secondary + "33" }}>
              <p style={{ color: t.secondary, fontSize: 9, letterSpacing: 5, marginBottom: 16 }}>{layer}</p>
              {items.map(item => (
                <div key={item} style={{ ...s.stackItem, borderColor: t.secondary + "22" }}>
                  <span style={{ color: t.primary + "44", marginRight: 8 }}>›</span>
                  <span style={{ color: t.accent, fontSize: 13, letterSpacing: 1 }}>{item}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      <Divider t={t} />

      {/* Mission */}
      <section style={{ ...s.section, textAlign: "center", paddingBottom: 80 }}>
        <Label text="MISSION" t={t} />
        <p style={{ color: t.secondary, fontSize: 14, lineHeight: 2, maxWidth: 600, margin: "0 auto 32px" }}>
          Most typing tools are sterile. We built TypoError to feel like a game —
          with identity, rhythm, and intelligence baked in. The goal is simple:
          make you faster, and make the journey worth it.
        </p>
        <Link to="/play" style={{ ...s.btn, background: t.primary, color: t.bg }}>
          START TYPING
        </Link>
      </section>
    </div>
  );
}

function Label({ text, t }) {
  return (
    <p style={{ color: t.secondary, fontSize: 10, letterSpacing: 5, marginBottom: 32, textAlign: "center" }}>
      {text}
    </p>
  );
}

function Divider({ t }) {
  return <div style={{ height: 1, background: `linear-gradient(to right, transparent, ${t.secondary}33, transparent)`, margin: "0 32px" }} />;
}

const s = {
  page: { minHeight: "100vh", fontFamily: "'Courier New', monospace", paddingTop: 60 },
  hero: { display: "flex", flexDirection: "column", alignItems: "center",
    padding: "80px 24px 60px" },
  section: { maxWidth: 860, margin: "0 auto", padding: "60px 32px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 },
  card: { border: "1px solid", borderRadius: 3, padding: "24px 20px" },
  stackGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 },
  stackCard: { border: "1px solid", borderRadius: 3, padding: "20px" },
  stackItem: { borderBottom: "1px solid", padding: "8px 0", display: "flex", alignItems: "center" },
  btn: { padding: "13px 40px", border: "none", borderRadius: 2, cursor: "pointer",
    fontFamily: "'Courier New', monospace", fontSize: 12, letterSpacing: 4, fontWeight: 700,
    textDecoration: "none", display: "inline-block" },
};
