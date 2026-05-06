import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../hooks/useAuth";
import LineChart from "../components/LineChart";

export default function ProfilePage({ theme: t }) {
  const { user, login } = useAuth();
  const [data, setData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [saveMsg, setSaveMsg] = useState("");

  useEffect(() => {
    api.get("/user/history").then(r => setData(r.data)).catch(() => {});
  }, []);

  if (!user) return (
    <div style={{ ...s.page, background: t.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Link to="/auth" style={{ ...s.btn, background: t.primary, color: t.bg }}>LOGIN</Link>
    </div>
  );

  const stats = data?.stats || user.stats || {};
  const history = data?.history || [];
  const mpmData = history.map((m, i) => ({ x: i + 1, y: m.mpm }));
  const accData = history.map((m, i) => ({ x: i + 1, y: m.accuracy }));
  const grade = stats.bestMPM >= 80 ? "ELITE" : stats.bestMPM >= 50 ? "SKILLED" : stats.bestMPM >= 30 ? "TRAINED" : "INITIATE";
  const avgMpm = history.length ? Math.round(history.reduce((s, m) => s + m.mpm, 0) / history.length) : 0;

  const saveUsername = async () => {
    if (!username.trim()) return;
    try {
      await api.patch("/user/me", { username: username.trim() });
      const { data: fresh } = await api.get("/user/me");
      login(localStorage.getItem("token"), fresh);
      setSaveMsg("Saved!");
      setEditing(false);
    } catch (e) {
      setSaveMsg(e.response?.data?.error || "Error");
    }
  };

  return (
    <div style={{ ...s.page, background: t.bg, color: t.primary }}>

      {/* Profile card */}
      <div style={{ ...s.card, borderColor: t.primary + "44", boxShadow: `0 0 40px ${t.glow}` }}>
        <div style={s.avatar}>
          <span style={{ color: t.bg, fontSize: 28, fontWeight: 700 }}>
            {user.username[0].toUpperCase()}
          </span>
        </div>
        <div style={{ flex: 1 }}>
          {editing ? (
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input value={username} onChange={e => setUsername(e.target.value)}
                style={{ ...s.input, borderColor: t.secondary, color: t.accent, width: 180 }}
                placeholder="New username" autoFocus
                onKeyDown={e => e.key === "Enter" && saveUsername()} />
              <button onClick={saveUsername} style={{ ...s.btn, background: t.primary, color: t.bg, padding: "6px 14px" }}>SAVE</button>
              <button onClick={() => setEditing(false)} style={{ ...s.btn, background: "transparent", color: t.secondary, border: `1px solid ${t.secondary}44`, padding: "6px 14px" }}>CANCEL</button>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <h2 style={{ color: t.primary, fontSize: 22, fontWeight: 700, letterSpacing: 3 }}>{user.username}</h2>
              <button onClick={() => { setUsername(user.username); setEditing(true); setSaveMsg(""); }}
                style={{ ...s.btn, background: "transparent", color: t.secondary, border: `1px solid ${t.secondary}33`, padding: "4px 10px", fontSize: 10 }}>
                EDIT
              </button>
            </div>
          )}
          {saveMsg && <p style={{ color: saveMsg === "Saved!" ? t.accent : "#ff4444", fontSize: 11, marginTop: 4 }}>{saveMsg}</p>}
          <p style={{ color: t.secondary, fontSize: 12, letterSpacing: 2, marginTop: 4 }}>{user.email}</p>
          <div style={{ display: "flex", gap: 12, marginTop: 8, alignItems: "center" }}>
            <span style={{ color: t.secondary, fontSize: 10, letterSpacing: 2, background: t.primary + "12", padding: "3px 10px", borderRadius: 2 }}>{user.uniqueId}</span>
            <span style={{ color: t.primary, fontSize: 10, letterSpacing: 3, background: t.primary + "18", padding: "3px 10px", borderRadius: 2 }}>{grade}</span>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div style={s.statRow}>
        {[
          { label: "BEST MPM", value: stats.bestMPM ?? 0, hi: true },
          { label: "AVG MPM", value: avgMpm },
          { label: "AVG ACC", value: `${stats.avgAccuracy ?? 0}%` },
          { label: "GAMES", value: stats.totalGames ?? 0 },
          { label: "FRIENDS", value: user.friends?.length ?? 0 },
        ].map(({ label, value, hi }) => (
          <div key={label} style={{ ...s.statCard, borderColor: hi ? t.primary + "44" : t.secondary + "22", background: hi ? t.primary + "08" : "transparent" }}>
            <p style={{ color: t.secondary, fontSize: 9, letterSpacing: 4, marginBottom: 6 }}>{label}</p>
            <p style={{ color: hi ? t.primary : t.accent, fontSize: 26, fontWeight: 700 }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      {history.length >= 2 ? (
        <>
          <div style={{ ...s.block, borderColor: t.secondary + "22" }}>
            <p style={{ color: t.secondary, fontSize: 9, letterSpacing: 5, marginBottom: 16 }}>MPM HISTORY</p>
            <LineChart data={mpmData} color={t.primary} width={Math.min(800, window.innerWidth - 80)} height={160} yLabel="MPM" />
          </div>
          <div style={{ ...s.block, borderColor: t.secondary + "22" }}>
            <p style={{ color: t.secondary, fontSize: 9, letterSpacing: 5, marginBottom: 16 }}>ACCURACY HISTORY</p>
            <LineChart data={accData} color={t.accent} width={Math.min(800, window.innerWidth - 80)} height={140} yLabel="%" />
          </div>
        </>
      ) : (
        <div style={{ ...s.block, borderColor: t.secondary + "22", textAlign: "center", padding: "40px" }}>
          <p style={{ color: t.secondary, fontSize: 12, letterSpacing: 3, marginBottom: 16 }}>PLAY SOME GAMES TO SEE YOUR CHARTS</p>
          <Link to="/play" style={{ ...s.btn, background: t.primary, color: t.bg }}>PLAY NOW</Link>
        </div>
      )}

      {/* Recent matches */}
      {history.length > 0 && (
        <div style={{ ...s.block, borderColor: t.secondary + "22" }}>
          <p style={{ color: t.secondary, fontSize: 9, letterSpacing: 5, marginBottom: 16 }}>RECENT MATCHES</p>
          <div style={s.tableHead}><span>#</span><span>MPM</span><span>ACCURACY</span><span>DATE</span></div>
          {[...history].reverse().slice(0, 15).map((m, i) => (
            <div key={i} style={{ ...s.tableRow, borderColor: t.secondary + "18" }}>
              <span style={{ color: t.secondary }}>{history.length - i}</span>
              <span style={{ color: t.primary, fontWeight: 700 }}>{m.mpm}</span>
              <span style={{ color: m.accuracy >= 90 ? t.accent : m.accuracy >= 75 ? t.primary : "#ff9944" }}>{m.accuracy}%</span>
              <span style={{ color: t.secondary + "88", fontSize: 11 }}>{new Date(m.date).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const s = {
  page: { minHeight: "100vh", fontFamily: "'Courier New', monospace", maxWidth: 860, margin: "0 auto", padding: "90px 32px 60px" },
  card: { display: "flex", gap: 24, alignItems: "flex-start", border: "1px solid", borderRadius: 3, padding: "28px 24px", marginBottom: 24 },
  avatar: { width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg, #b06aff, #00e5ff)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  statRow: { display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 },
  statCard: { flex: 1, minWidth: 110, border: "1px solid", borderRadius: 3, padding: "16px", textAlign: "center" },
  block: { border: "1px solid", borderRadius: 3, padding: "24px", marginBottom: 16, overflowX: "auto" },
  tableHead: { display: "grid", gridTemplateColumns: "40px 1fr 1fr 1fr", color: "#444", fontSize: 9, letterSpacing: 3, marginBottom: 8, paddingBottom: 8, borderBottom: "1px solid #ffffff08" },
  tableRow: { display: "grid", gridTemplateColumns: "40px 1fr 1fr 1fr", fontSize: 13, padding: "10px 0", borderBottom: "1px solid" },
  input: { padding: "8px 12px", background: "transparent", border: "1px solid", borderRadius: 2, fontSize: 14, outline: "none", fontFamily: "'Courier New', monospace" },
  btn: { padding: "10px 24px", border: "none", borderRadius: 2, cursor: "pointer", fontFamily: "'Courier New', monospace", fontSize: 11, letterSpacing: 3, fontWeight: 700, textDecoration: "none", display: "inline-block" },
};
