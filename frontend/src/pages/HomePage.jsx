import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const FEATURES = [
  { icon: "⚡", title: "REAL-TIME MPM", desc: "Live metered-per-minute tracking with accuracy scoring as you type." },
  { icon: "🧠", title: "AI COACH", desc: "Ollama-powered analysis gives you personalized tips after every session." },
  { icon: "🌗", title: "TIME THEMES", desc: "UI shifts between Dawn, Day, and Night automatically." },
  { icon: "🤝", title: "SOCIAL LAYER", desc: "Unique IDs (CYB-XXXX), friend requests, and player search." },
  { icon: "🎯", title: "ADAPTIVE DIFFICULTY", desc: "Easy, Medium, Hard — or let AI generate a custom passage for you." },
  { icon: "🏆", title: "PERSONAL STATS", desc: "Track your best MPM and average accuracy across all sessions." },
];

const DEMO_WORDS = ["cyber", "node", "sync", "flux", "grid", "data", "core", "link", "byte", "code"];

export default function HomePage({ theme: t }) {
  const { user } = useAuth();

  return (
    <div style={{ ...s.page, background: t.bg, color: t.primary }}>

      {/* ── HERO ── */}
      <section style={s.hero}>
        <div style={{ ...s.heroBadge, color: t.secondary, borderColor: t.secondary + "44" }}>
          {t.label} · CYBER-TRADITION TYPING
        </div>

        <h1 style={{ ...s.heroTitle, color: t.primary, textShadow: `0 0 40px ${t.glow}` }}>
          TYPO<span style={{ color: t.accent }}>ERROR</span>
        </h1>

        <p style={{ ...s.heroSub, color: t.secondary }}>
          A high-intensity typing game where speed meets identity.<br />
          Train faster. Think sharper. Type like a machine.
        </p>

        {/* Animated demo strip */}
        <div style={{ ...s.demoStrip, borderColor: t.secondary + "33" }}>
          {DEMO_WORDS.map((w, i) => (
            <span key={w} style={{
              color: i === 3 ? t.primary : i < 3 ? t.accent : t.secondary + "55",
              fontSize: 18, letterSpacing: 3, fontWeight: i === 3 ? 700 : 400,
              borderBottom: i === 3 ? `1px solid ${t.primary}` : "1px solid transparent",
              textShadow: i === 3 ? `0 0 10px ${t.glow}` : "none",
              transition: "all 0.2s"
            }}>
              {w}
            </span>
          ))}
        </div>

        <div style={s.heroCta}>
          {user ? (
            <>
              <Link to="/play" style={{ ...s.btnPrimary, background: t.primary, color: t.bg }}>
                CONTINUE PLAYING
              </Link>
              <Link to="/social" style={{ ...s.btnOutline, color: t.primary, borderColor: t.primary }}>
                FIND FRIENDS
              </Link>
            </>
          ) : (
            <>
              <Link to="/auth" style={{ ...s.btnPrimary, background: t.primary, color: t.bg }}>
                START FOR FREE
              </Link>
              <Link to="/play" style={{ ...s.btnOutline, color: t.primary, borderColor: t.primary }}>
                PLAY AS GUEST
              </Link>
            </>
          )}
        </div>
      </section>

      {/* ── LOGGED-IN DASHBOARD STRIP ── */}
      {user && (
        <section style={{ ...s.dashStrip, borderColor: t.secondary + "33", background: t.primary + "08" }}>
          <DashStat label="BEST MPM" value={user.stats?.bestMPM ?? 0} t={t} />
          <div style={{ width: 1, background: t.secondary + "33", alignSelf: "stretch" }} />
          <DashStat label="AVG ACCURACY" value={`${user.stats?.avgAccuracy ?? 0}%`} t={t} />
          <div style={{ width: 1, background: t.secondary + "33", alignSelf: "stretch" }} />
          <DashStat label="FRIENDS" value={user.friends?.length ?? 0} t={t} />
          <div style={{ width: 1, background: t.secondary + "33", alignSelf: "stretch" }} />
          <DashStat label="YOUR ID" value={user.uniqueId} t={t} small />
        </section>
      )}

      {/* ── FEATURES GRID ── */}
      <section style={s.section}>
        <SectionLabel label="FEATURES" t={t} />
        <div style={s.grid}>
          {FEATURES.map(f => (
            <div key={f.title} style={{ ...s.card, borderColor: t.secondary + "33",
              background: t.primary + "05" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = t.primary + "66"}
              onMouseLeave={e => e.currentTarget.style.borderColor = t.secondary + "33"}>
              <span style={{ fontSize: 28, marginBottom: 12, display: "block" }}>{f.icon}</span>
              <p style={{ color: t.primary, fontSize: 12, letterSpacing: 3, marginBottom: 8 }}>{f.title}</p>
              <p style={{ color: t.secondary, fontSize: 13, lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={s.section}>
        <SectionLabel label="HOW IT WORKS" t={t} />
        <div style={s.steps}>
          {[
            { n: "01", title: "CREATE ACCOUNT", desc: "Sign up with email. Get your unique TYP-XXXX identity." },
            { n: "02", title: "CHOOSE MODE", desc: "Pick difficulty or generate an AI passage tuned to your level." },
            { n: "03", title: "TYPE & IMPROVE", desc: "Race the clock. Get AI coaching. Beat your personal best." },
          ].map((step, i) => (
            <div key={i} style={s.step}>
              <span style={{ color: t.primary + "33", fontSize: 48, fontWeight: 700, lineHeight: 1 }}>{step.n}</span>
              <p style={{ color: t.primary, fontSize: 12, letterSpacing: 3, margin: "8px 0 6px" }}>{step.title}</p>
              <p style={{ color: t.secondary, fontSize: 13, lineHeight: 1.7 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── THEME SHOWCASE ── */}
      <section style={s.section}>
        <SectionLabel label="TIME-BASED THEMES" t={t} />
        <div style={s.themeRow}>
          {[
            { label: "DAWN", color: "#f0a500", bg: "#0e0900", time: "5 AM - 9 AM" },
            { label: "DAY", color: "#00e5ff", bg: "#050d1a", time: "9 AM - 6 PM" },
            { label: "NIGHT", color: "#c8a84b", bg: "#0a0800", time: "6 PM - 5 AM" },
          ].map(th => (
            <div key={th.label} style={{ ...s.themeCard, background: th.bg,
              borderColor: th.label === t.label.split(" ")[0] ? th.color : th.color + "33",
              boxShadow: th.label === t.label.split(" ")[0] ? `0 0 20px ${th.color}44` : "none" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: th.color,
                boxShadow: `0 0 8px ${th.color}`, marginBottom: 10 }} />
              <p style={{ color: th.color, fontSize: 11, letterSpacing: 3 }}>{th.label}</p>
              <p style={{ color: th.color + "88", fontSize: 10, letterSpacing: 1, marginTop: 4 }}>{th.time}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BOTTOM ── */}
      {!user && (
        <section style={{ ...s.section, textAlign: "center", paddingBottom: 80 }}>
          <p style={{ color: t.secondary, fontSize: 11, letterSpacing: 5, marginBottom: 16 }}>
            READY TO BEGIN?
          </p>
          <h2 style={{ color: t.primary, fontSize: 32, fontWeight: 700, letterSpacing: 4,
            textShadow: `0 0 30px ${t.glow}`, marginBottom: 32 }}>
            JOIN THE GRID
          </h2>
          <Link to="/auth" style={{ ...s.btnPrimary, background: t.primary, color: t.bg, fontSize: 13, letterSpacing: 4 }}>
            CREATE ACCOUNT
          </Link>
        </section>
      )}

      <Footer t={t} />
    </div>
  );
}

function DashStat({ label, value, t, small }) {
  return (
    <div style={{ textAlign: "center", flex: 1 }}>
      <p style={{ color: t.secondary, fontSize: 9, letterSpacing: 4, marginBottom: 6 }}>{label}</p>
      <p style={{ color: t.primary, fontSize: small ? 14 : 24, fontWeight: 700, letterSpacing: small ? 2 : 1 }}>
        {value}
      </p>
    </div>
  );
}

function SectionLabel({ label, t }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 40 }}>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, transparent, ${t.secondary}44)` }} />
      <span style={{ color: t.secondary, fontSize: 10, letterSpacing: 5 }}>{label}</span>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(to left, transparent, ${t.secondary}44)` }} />
    </div>
  );
}

function Footer({ t }) {
  return (
    <footer style={{ borderTop: `1px solid ${t.secondary}22`, padding: "24px 32px",
      display: "flex", justifyContent: "space-between", alignItems: "center",
      color: t.secondary, fontSize: 11, letterSpacing: 2, width: "100%" }}>
      <span>TYPΟERROR · {new Date().getFullYear()}</span>
      <div style={{ display: "flex", gap: 24 }}>
        <Link to="/about" style={{ color: t.secondary, textDecoration: "none" }}>ABOUT</Link>
        <Link to="/support" style={{ color: t.secondary, textDecoration: "none" }}>SUPPORT</Link>
      </div>
    </footer>
  );
}

const s = {
  page: { minHeight: "100vh", fontFamily: "'Courier New', monospace", paddingTop: 60 },
  hero: { display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
    padding: "80px 24px 60px", maxWidth: 800, margin: "0 auto" },
  heroBadge: { fontSize: 10, letterSpacing: 5, border: "1px solid", padding: "5px 16px",
    borderRadius: 2, marginBottom: 32 },
  heroTitle: { fontSize: "clamp(48px, 10vw, 96px)", fontWeight: 700, letterSpacing: 8,
    lineHeight: 1, marginBottom: 24 },
  heroSub: { fontSize: 15, lineHeight: 1.9, letterSpacing: 1, marginBottom: 40, maxWidth: 480 },
  demoStrip: { display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center",
    border: "1px solid", borderRadius: 3, padding: "16px 24px", marginBottom: 40,
    background: "rgba(255,255,255,0.02)" },
  heroCta: { display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" },
  btnPrimary: { padding: "13px 32px", border: "none", borderRadius: 2, cursor: "pointer",
    fontFamily: "'Courier New', monospace", fontSize: 12, letterSpacing: 3, fontWeight: 700,
    textDecoration: "none", display: "inline-block" },
  btnOutline: { padding: "12px 32px", border: "1px solid", borderRadius: 2, cursor: "pointer",
    fontFamily: "'Courier New', monospace", fontSize: 12, letterSpacing: 3, fontWeight: 700,
    textDecoration: "none", display: "inline-block", background: "transparent" },
  dashStrip: { display: "flex", alignItems: "center", gap: 0, border: "1px solid",
    borderRadius: 3, margin: "0 32px 60px", padding: "20px 32px" },
  section: { maxWidth: 900, margin: "0 auto", padding: "40px 32px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 },
  card: { border: "1px solid", borderRadius: 3, padding: "24px 20px",
    transition: "border-color 0.2s", cursor: "default" },
  steps: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 24 },
  step: { padding: "24px 0" },
  themeRow: { display: "flex", gap: 12, flexWrap: "wrap" },
  themeCard: { flex: 1, minWidth: 120, border: "1px solid", borderRadius: 3,
    padding: "20px 16px", display: "flex", flexDirection: "column", alignItems: "center",
    transition: "box-shadow 0.3s" },
};

