import { useEffect, useState } from "react";
import api from "../utils/api";
import { useAuth } from "../hooks/useAuth";
import LineChart from "../components/LineChart";
import { Link } from "react-router-dom";

export default function StatsPage({ theme: t }) {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/user/history")
      .then(r => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!user) return (
    <div style={{ ...s.page, background: t.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <p style={{ color: t.secondary, fontSize: 12, letterSpacing: 3, marginBottom: 16 }}>
          LOGIN TO VIEW STATS
        </p>
        <Link to="/auth" style={{ ...s.btn, background: t.primary, color: t.bg }}>LOGIN</Link>
      </div>
    </div>
  );

  if (loading) return (
    <div style={{ ...s.page, background: t.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ color: t.secondary, fontSize: 11, letterSpacing: 4 }}>LOADING...</span>
    </div>
  );

  const history = data?.history || [];
  const stats = data?.stats || {};

  // Overall MPM over games
  const mpmHistory = history.map((m, i) => ({ x: i + 1, y: m.mpm }));
  // Overall accuracy over games
  const accHistory = history.map((m, i) => ({ x: i + 1, y: m.accuracy }));

  // Last 10 games for recent trend
  const recent = history.slice(-10);
  const recentMpm = recent.map((m, i) => ({ x: i + 1, y: m.mpm }));

  const avgMpm = history.length
    ? Math.round(history.reduce((s, m) => s + m.mpm, 0) / history.length)
    : 0;

  const grade = stats.bestMPM >= 80 ? "ELITE"
    : stats.bestMPM >= 50 ? "SKILLED"
    : stats.bestMPM >= 30 ? "TRAINED" : "INITIATE";

  return (
    <div style={{ ...s.page, background: t.bg, color: t.primary }}>

      {/* Header */}
      <div style={s.header}>
        <div>
          <p style={{ color: t.secondary, fontSize: 10, letterSpacing: 5, marginBottom: 4 }}>STATISTICS</p>
          <h1 style={{ color: t.primary, fontSize: 24, fontWeight: 700, letterSpacing: 4 }}>
            {user.username}
            <span style={{ color: t.secondary, fontSize: 12, fontWeight: 400,
              letterSpacing: 2, marginLeft: 12 }}>
              {user.uniqueId}
            </span>
          </h1>
        </div>
        <span style={{ color: t.primary, fontSize: 11, letterSpacing: 4,
          background: t.primary + "18", padding: "6px 16px", borderRadius: 2, alignSelf: "flex-start" }}>
          {grade}
        </span>
      </div>

      {/* Summary cards */}
      <div style={s.cards}>
        <StatCard label="BEST MPM" value={stats.bestMPM ?? 0} t={t} highlight />
        <StatCard label="AVG MPM" value={avgMpm} t={t} />
        <StatCard label="AVG ACCURACY" value={`${stats.avgAccuracy ?? 0}%`} t={t} />
        <StatCard label="TOTAL GAMES" value={stats.totalGames ?? 0} t={t} />
        <StatCard label="FRIENDS" value={user.friends?.length ?? 0} t={t} />
      </div>

      {history.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <p style={{ color: t.secondary, fontSize: 12, letterSpacing: 3, marginBottom: 20 }}>
            NO GAMES PLAYED YET
          </p>
          <Link to="/play" style={{ ...s.btn, background: t.primary, color: t.bg }}>
            PLAY NOW
          </Link>
        </div>
      ) : (
        <>
          {/* Overall MPM chart */}
          <ChartBlock title="MPM OVER ALL GAMES" t={t}>
            <LineChart
              data={mpmHistory}
              color={t.primary}
              label=""
              width={Math.min(820, window.innerWidth - 80)}
              height={180}
              yLabel="MPM"
            />
          </ChartBlock>

          {/* Overall accuracy chart */}
          <ChartBlock title="ACCURACY OVER ALL GAMES" t={t}>
            <LineChart
              data={accHistory}
              color={t.accent}
              label=""
              width={Math.min(820, window.innerWidth - 80)}
              height={160}
              yLabel="%"
            />
          </ChartBlock>

          {/* Recent 10 games */}
          {recent.length >= 2 && (
            <ChartBlock title="RECENT 10 GAMES — MPM TREND" t={t}>
              <LineChart
                data={recentMpm}
                color={t.secondary}
                label=""
                width={Math.min(820, window.innerWidth - 80)}
                height={140}
                yLabel="MPM"
              />
            </ChartBlock>
          )}

          {/* History table */}
          <div style={{ ...s.block, borderColor: t.secondary + "22" }}>
            <p style={{ color: t.secondary, fontSize: 10, letterSpacing: 5, marginBottom: 20 }}>
              MATCH HISTORY
            </p>
            <div style={s.tableHead}>
              <span>#</span><span>MPM</span><span>ACCURACY</span><span>DATE</span>
            </div>
            {[...history].reverse().slice(0, 20).map((m, i) => (
              <div key={i} style={{ ...s.tableRow, borderColor: t.secondary + "18" }}>
                <span style={{ color: t.secondary }}>{history.length - i}</span>
                <span style={{ color: t.primary, fontWeight: 700 }}>{m.mpm}</span>
                <span style={{ color: m.accuracy >= 90 ? t.accent : m.accuracy >= 75 ? t.primary : "#ff9944" }}>
                  {m.accuracy}%
                </span>
                <span style={{ color: t.secondary + "88", fontSize: 11 }}>
                  {new Date(m.date).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ label, value, t, highlight }) {
  return (
    <div style={{
      flex: 1, minWidth: 120, border: `1px solid ${highlight ? t.primary + "44" : t.secondary + "22"}`,
      borderRadius: 3, padding: "20px 16px", textAlign: "center",
      background: highlight ? t.primary + "08" : "transparent",
      boxShadow: highlight ? `0 0 20px ${t.glow}` : "none"
    }}>
      <p style={{ color: t.secondary, fontSize: 9, letterSpacing: 4, marginBottom: 8 }}>{label}</p>
      <p style={{ color: highlight ? t.primary : t.accent, fontSize: 28, fontWeight: 700, letterSpacing: 1 }}>
        {value}
      </p>
    </div>
  );
}

function ChartBlock({ title, t, children }) {
  return (
    <div style={{ ...s.block, borderColor: t.secondary + "22" }}>
      <p style={{ color: t.secondary, fontSize: 10, letterSpacing: 5, marginBottom: 20 }}>{title}</p>
      <div style={{ overflowX: "auto" }}>{children}</div>
    </div>
  );
}

const s = {
  page: { minHeight: "100vh", fontFamily: "'Courier New', monospace",
    paddingTop: 80, paddingBottom: 60, maxWidth: 900, margin: "0 auto", padding: "80px 32px 60px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start",
    marginBottom: 32 },
  cards: { display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 32 },
  block: { border: "1px solid", borderRadius: 3, padding: "24px", marginBottom: 20 },
  tableHead: { display: "grid", gridTemplateColumns: "40px 1fr 1fr 1fr",
    color: "#444", fontSize: 9, letterSpacing: 3, marginBottom: 8, paddingBottom: 8,
    borderBottom: "1px solid #ffffff08" },
  tableRow: { display: "grid", gridTemplateColumns: "40px 1fr 1fr 1fr",
    fontSize: 13, padding: "10px 0", borderBottom: "1px solid" },
  btn: { padding: "11px 32px", border: "none", borderRadius: 2, cursor: "pointer",
    fontFamily: "'Courier New', monospace", fontSize: 12, letterSpacing: 3, fontWeight: 700,
    textDecoration: "none", display: "inline-block" }
};
