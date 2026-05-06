import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../hooks/useAuth";
import LineChart from "../components/LineChart";

export default function FriendProfilePage({ theme: t }) {
  const { uniqueId } = useParams();
  const { user } = useAuth();
  const [friend, setFriend] = useState(null);
  const [myData, setMyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      api.get(`/user/profile/${uniqueId}`),
      api.get("/user/history")
    ]).then(([fr, me]) => {
      setFriend(fr.data);
      setMyData(me.data);
    }).catch(e => {
      setError(e.response?.data?.error || "Failed to load profile");
    }).finally(() => setLoading(false));
  }, [uniqueId]);

  if (loading) return <Centered t={t}><span style={{ color: t.secondary, letterSpacing: 4, fontSize: 11 }}>LOADING...</span></Centered>;
  if (error) return <Centered t={t}><span style={{ color: "#ff4444", fontSize: 13 }}>{error}</span></Centered>;

  const fs = friend.stats;
  const ms = myData?.stats || user?.stats || {};
  const fHistory = friend.history || [];
  const mHistory = myData?.history || [];

  const grade = (mpm) => mpm >= 80 ? "ELITE" : mpm >= 50 ? "SKILLED" : mpm >= 30 ? "TRAINED" : "INITIATE";
  const fAvgMpm = fHistory.length ? Math.round(fHistory.reduce((s, m) => s + m.mpm, 0) / fHistory.length) : 0;
  const mAvgMpm = mHistory.length ? Math.round(mHistory.reduce((s, m) => s + m.mpm, 0) / mHistory.length) : 0;

  // Overlay chart data — both on same x scale (game number)
  const fMpmData = fHistory.map((m, i) => ({ x: i + 1, y: m.mpm }));
  const mMpmData = mHistory.map((m, i) => ({ x: i + 1, y: m.mpm }));

  const CMP = ({ label, mine, theirs, higherBetter = true }) => {
    const iWin = higherBetter ? mine >= theirs : mine <= theirs;
    return (
      <div style={s.cmpRow}>
        <span style={{ color: iWin ? t.primary : t.secondary, fontWeight: iWin ? 700 : 400, fontSize: 16, minWidth: 80, textAlign: "right" }}>{mine}</span>
        <span style={{ color: t.secondary, fontSize: 9, letterSpacing: 3, flex: 1, textAlign: "center" }}>{label}</span>
        <span style={{ color: !iWin ? t.primary : t.secondary, fontWeight: !iWin ? 700 : 400, fontSize: 16, minWidth: 80 }}>{theirs}</span>
      </div>
    );
  };

  return (
    <div style={{ ...s.page, background: t.bg, color: t.primary }}>

      {/* Back */}
      <Link to="/social" style={{ color: t.secondary, fontSize: 11, letterSpacing: 3, textDecoration: "none", display: "inline-block", marginBottom: 24 }}>
        ← BACK TO SOCIAL
      </Link>

      {/* Friend header */}
      <div style={{ ...s.card, borderColor: t.primary + "33" }}>
        <div style={{ ...s.avatar, background: "linear-gradient(135deg, #39ff14, #b06aff)" }}>
          <span style={{ color: "#000", fontSize: 28, fontWeight: 700 }}>{friend.username[0].toUpperCase()}</span>
        </div>
        <div>
          <h2 style={{ color: t.primary, fontSize: 22, fontWeight: 700, letterSpacing: 3 }}>{friend.username}</h2>
          <div style={{ display: "flex", gap: 10, marginTop: 6, alignItems: "center" }}>
            <span style={{ color: t.secondary, fontSize: 10, letterSpacing: 2, background: t.primary + "12", padding: "3px 10px", borderRadius: 2 }}>{friend.uniqueId}</span>
            <span style={{ color: t.primary, fontSize: 10, letterSpacing: 3, background: t.primary + "18", padding: "3px 10px", borderRadius: 2 }}>{grade(fs.bestMPM)}</span>
          </div>
        </div>
      </div>

      {/* Comparison */}
      <div style={{ ...s.block, borderColor: t.secondary + "22" }}>
        <p style={{ color: t.secondary, fontSize: 9, letterSpacing: 5, marginBottom: 20 }}>HEAD TO HEAD</p>

        {/* Labels */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: t.primary }} />
            <span style={{ color: t.primary, fontSize: 11, letterSpacing: 2 }}>{user?.username} (YOU)</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: t.accent, fontSize: 11, letterSpacing: 2 }}>{friend.username}</span>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: t.accent }} />
          </div>
        </div>

        <CMP label="BEST MPM" mine={ms.bestMPM ?? 0} theirs={fs.bestMPM ?? 0} />
        <CMP label="AVG MPM" mine={mAvgMpm} theirs={fAvgMpm} />
        <CMP label="AVG ACCURACY" mine={ms.avgAccuracy ?? 0} theirs={fs.avgAccuracy ?? 0} />
        <CMP label="TOTAL GAMES" mine={ms.totalGames ?? 0} theirs={fs.totalGames ?? 0} />
      </div>

      {/* Friend's MPM chart */}
      {fMpmData.length >= 2 && (
        <div style={{ ...s.block, borderColor: t.secondary + "22" }}>
          <p style={{ color: t.secondary, fontSize: 9, letterSpacing: 5, marginBottom: 16 }}>{friend.username.toUpperCase()} — MPM HISTORY</p>
          <LineChart data={fMpmData} color={t.accent} width={Math.min(800, window.innerWidth - 80)} height={150} yLabel="MPM" />
        </div>
      )}

      {/* Your MPM chart for comparison */}
      {mMpmData.length >= 2 && (
        <div style={{ ...s.block, borderColor: t.secondary + "22" }}>
          <p style={{ color: t.secondary, fontSize: 9, letterSpacing: 5, marginBottom: 16 }}>YOUR MPM HISTORY</p>
          <LineChart data={mMpmData} color={t.primary} width={Math.min(800, window.innerWidth - 80)} height={150} yLabel="MPM" />
        </div>
      )}

      {/* Friend's recent matches */}
      {fHistory.length > 0 && (
        <div style={{ ...s.block, borderColor: t.secondary + "22" }}>
          <p style={{ color: t.secondary, fontSize: 9, letterSpacing: 5, marginBottom: 16 }}>{friend.username.toUpperCase()} — RECENT MATCHES</p>
          <div style={s.tableHead}><span>#</span><span>MPM</span><span>ACCURACY</span><span>DATE</span></div>
          {[...fHistory].reverse().slice(0, 10).map((m, i) => (
            <div key={i} style={{ ...s.tableRow, borderColor: t.secondary + "18" }}>
              <span style={{ color: t.secondary }}>{fHistory.length - i}</span>
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

function Centered({ t, children }) {
  return (
    <div style={{ minHeight: "100vh", background: t.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace" }}>
      {children}
    </div>
  );
}

const s = {
  page: { minHeight: "100vh", fontFamily: "'Courier New', monospace", maxWidth: 860, margin: "0 auto", padding: "90px 32px 60px" },
  card: { display: "flex", gap: 20, alignItems: "center", border: "1px solid", borderRadius: 3, padding: "24px", marginBottom: 20 },
  avatar: { width: 60, height: 60, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  block: { border: "1px solid", borderRadius: 3, padding: "24px", marginBottom: 16, overflowX: "auto" },
  cmpRow: { display: "flex", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #ffffff08" },
  tableHead: { display: "grid", gridTemplateColumns: "40px 1fr 1fr 1fr", color: "#444", fontSize: 9, letterSpacing: 3, marginBottom: 8, paddingBottom: 8, borderBottom: "1px solid #ffffff08" },
  tableRow: { display: "grid", gridTemplateColumns: "40px 1fr 1fr 1fr", fontSize: 13, padding: "10px 0", borderBottom: "1px solid" },
};
