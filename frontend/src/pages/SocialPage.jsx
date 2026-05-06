import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../hooks/useAuth";

const TABS = ["FRIENDS", "REQUESTS", "SEARCH"];

export default function SocialPage({ theme: t }) {
  const { user, login } = useAuth();
  const [tab, setTab] = useState("FRIENDS");
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState(user?.friendRequests || []);
  const [sentRequests, setSentRequests] = useState([]);
  const [friendIds, setFriendIds] = useState(user?.friends || []);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [msg, setMsg] = useState({ text: "", ok: true });
  const [loading, setLoading] = useState(false);

  const loadFriends = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/user/friends");
      setFriends(data);
      setFriendIds(data.map(f => f.uniqueId));
    } catch {}
    setLoading(false);
  }, []);

  const refreshMe = useCallback(async () => {
    try {
      const { data } = await api.get("/user/me");
      const token = localStorage.getItem("token");
      login(token, data);
      setRequests(data.friendRequests || []);
    } catch {}
  }, [login]);

  useEffect(() => {
    if (tab === "FRIENDS") loadFriends();
    if (tab === "REQUESTS") refreshMe();
  }, [tab]); // eslint-disable-line

  const search = async () => {
    if (!query.trim()) return;
    try {
      const { data } = await api.get(`/user/search?q=${encodeURIComponent(query)}`);
      setResults(data);
    } catch {}
  };

  const sendRequest = async (targetId) => {
    try {
      await api.post("/user/friend-request", { targetId });
      setMsg({ text: `Request sent to ${targetId}`, ok: true });
      setSentRequests(s => [...s, targetId]);
    } catch (e) {
      setMsg({ text: e.response?.data?.error || "Error", ok: false });
    }
  };

  const acceptRequest = async (requesterId) => {
    try {
      await api.post("/user/friend-accept", { requesterId });
      setMsg({ text: `${requesterId} added as friend`, ok: true });
      setRequests(r => r.filter(id => id !== requesterId));
      loadFriends();
    } catch (e) {
      setMsg({ text: e.response?.data?.error || "Error", ok: false });
    }
  };

  const grade = (mpm) =>
    mpm >= 80 ? "ELITE" : mpm >= 50 ? "SKILLED" : mpm >= 30 ? "TRAINED" : "INITIATE";

  return (
    <div style={{ ...s.page, background: t.bg, color: t.primary }}>

      {/* Header */}
      <div style={s.header}>
        <p style={{ color: t.secondary, fontSize: 10, letterSpacing: 5, marginBottom: 4 }}>SOCIAL</p>
        <h1 style={{ color: t.primary, fontSize: 22, fontWeight: 700, letterSpacing: 4 }}>
          {user?.username}
          <span style={{ color: t.secondary, fontSize: 11, fontWeight: 400, letterSpacing: 2, marginLeft: 12 }}>
            {user?.uniqueId}
          </span>
        </h1>
      </div>

      {/* Tabs */}
      <div style={{ ...s.tabs, borderBottom: `1px solid ${t.secondary}22` }}>
        {TABS.map(tb => (
          <button key={tb} onClick={() => { setTab(tb); setMsg({ text: "", ok: true }); }}
            style={{
              ...s.tab,
              color: tab === tb ? t.primary : t.secondary,
              borderBottom: tab === tb ? `2px solid ${t.primary}` : "2px solid transparent"
            }}>
            {tb}
            {tb === "REQUESTS" && requests.length > 0 && (
              <span style={{ ...s.badge, background: t.primary, color: t.bg }}>
                {requests.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {msg.text && (
        <p style={{ color: msg.ok ? t.accent : "#ff4444", fontSize: 12,
          letterSpacing: 1, margin: "16px 0 0" }}>
          {msg.ok ? "✓" : "⚠"} {msg.text}
        </p>
      )}

      {/* ── FRIENDS TAB ── */}
      {tab === "FRIENDS" && (
        <div style={s.section}>
          {loading ? (
            <p style={{ color: t.secondary, fontSize: 11, letterSpacing: 3 }}>LOADING...</p>
          ) : friends.length === 0 ? (
            <div style={s.empty}>
              <p style={{ color: t.secondary, fontSize: 13, marginBottom: 8 }}>No friends yet.</p>
              <p style={{ color: t.secondary + "88", fontSize: 11 }}>
                Use the SEARCH tab to find and add players.
              </p>
            </div>
          ) : (
            <>
              <p style={{ color: t.secondary, fontSize: 9, letterSpacing: 4, marginBottom: 16 }}>
                {friends.length} FRIEND{friends.length !== 1 ? "S" : ""}
              </p>
              {/* Leaderboard header */}
              <div style={{ ...s.tableHead, borderBottom: `1px solid ${t.secondary}22` }}>
                <span>#</span>
                <span>PLAYER</span>
                <span>BEST MPM</span>
                <span>AVG ACC</span>
                <span>GAMES</span>
                <span>RANK</span>
              </div>
              {[...friends]
                .sort((a, b) => b.stats.bestMPM - a.stats.bestMPM)
                .map((f, i) => (
                  <Link key={f.uniqueId} to={`/social/${f.uniqueId}`}
                    style={{ textDecoration: "none" }}>
                  <div
                    style={{ ...s.friendRow, borderColor: t.secondary + "18",
                      background: i === 0 ? t.primary + "06" : "transparent",
                      cursor: "pointer" }}
                    onMouseEnter={e => e.currentTarget.style.background = t.primary + "0a"}
                    onMouseLeave={e => e.currentTarget.style.background = i === 0 ? t.primary + "06" : "transparent"}>
                    <span style={{ color: i === 0 ? t.primary : t.secondary, fontWeight: i === 0 ? 700 : 400 }}>
                      {i + 1}
                    </span>
                    <div>
                      <p style={{ color: t.primary, fontSize: 13, letterSpacing: 1 }}>{f.username}</p>
                      <p style={{ color: t.secondary, fontSize: 10, letterSpacing: 1 }}>{f.uniqueId}</p>
                    </div>
                    <span style={{ color: t.primary, fontWeight: 700, fontSize: 16 }}>
                      {f.stats.bestMPM}
                    </span>
                    <span style={{ color: f.stats.avgAccuracy >= 90 ? t.accent
                      : f.stats.avgAccuracy >= 75 ? t.primary : "#ff9944" }}>
                      {f.stats.avgAccuracy}%
                    </span>
                    <span style={{ color: t.secondary }}>{f.stats.totalGames ?? 0}</span>
                    <span style={{ color: t.primary, fontSize: 10, letterSpacing: 2,
                      background: t.primary + "18", padding: "2px 8px", borderRadius: 2 }}>
                      {grade(f.stats.bestMPM)}
                    </span>
                  </div>
                  </Link>
                ))}
            </>
          )}
        </div>
      )}

      {/* ── REQUESTS TAB ── */}
      {tab === "REQUESTS" && (
        <div style={s.section}>
          {requests.length === 0 ? (
            <div style={s.empty}>
              <p style={{ color: t.secondary, fontSize: 13 }}>No pending requests.</p>
            </div>
          ) : (
            <>
              <p style={{ color: t.secondary, fontSize: 9, letterSpacing: 4, marginBottom: 16 }}>
                {requests.length} PENDING
              </p>
              {requests.map(id => (
                <div key={id} style={{ ...s.card, borderColor: t.secondary + "33" }}>
                  <div>
                    <p style={{ color: t.primary, fontSize: 13, letterSpacing: 2 }}>{id}</p>
                    <p style={{ color: t.secondary, fontSize: 11 }}>wants to be your friend</p>
                  </div>
                  <button onClick={() => acceptRequest(id)}
                    style={{ ...s.btn, background: t.primary, color: t.bg }}>
                    ACCEPT
                  </button>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {/* ── SEARCH TAB ── */}
      {tab === "SEARCH" && (
        <div style={s.section}>
          <div style={s.searchRow}>
            <input value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === "Enter" && search()}
              placeholder="Search by username or ID (e.g. NEO-XXXX)..."
              style={{ ...s.input, borderColor: t.secondary + "44", color: t.accent }} />
            <button onClick={search}
              style={{ ...s.btn, background: t.primary, color: t.bg }}>
              SEARCH
            </button>
          </div>

          {results.length > 0 && (
            <>
              <p style={{ color: t.secondary, fontSize: 9, letterSpacing: 4, marginBottom: 16 }}>
                {results.length} RESULT{results.length !== 1 ? "S" : ""}
              </p>
              {results.map(u => (
                <div key={u.uniqueId} style={{ ...s.card, borderColor: t.secondary + "33" }}>
                  <div>
                    <p style={{ color: t.primary, fontSize: 13, letterSpacing: 2 }}>{u.username}</p>
                    <p style={{ color: t.secondary, fontSize: 11, letterSpacing: 1 }}>{u.uniqueId}</p>
                    <div style={{ display: "flex", gap: 16, marginTop: 6 }}>
                      <span style={{ color: t.accent, fontSize: 11 }}>
                        ⚡ {u.stats.bestMPM} MPM
                      </span>
                      <span style={{ color: t.secondary, fontSize: 11 }}>
                        {u.stats.avgAccuracy}% ACC
                      </span>
                      <span style={{ color: t.primary + "88", fontSize: 10, letterSpacing: 2 }}>
                        {grade(u.stats.bestMPM)}
                      </span>
                    </div>
                  </div>
                  {u.uniqueId !== user?.uniqueId && (() => {
                    if (friendIds.includes(u.uniqueId))
                      return <span style={{ color: t.accent, fontSize: 10, letterSpacing: 2 }}>✓ FRIENDS</span>;
                    if (sentRequests.includes(u.uniqueId))
                      return <span style={{ color: t.secondary, fontSize: 10, letterSpacing: 2 }}>SENT</span>;
                    return (
                      <button onClick={() => sendRequest(u.uniqueId)}
                        style={{ ...s.btn, background: "transparent",
                          color: t.primary, border: `1px solid ${t.primary}` }}>
                        + ADD
                      </button>
                    );
                  })()}
                  {u.uniqueId === user?.uniqueId && (
                    <span style={{ color: t.secondary, fontSize: 10, letterSpacing: 2 }}>YOU</span>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

const s = {
  page: { minHeight: "100vh", fontFamily: "'Courier New', monospace",
    maxWidth: 720, margin: "0 auto", padding: "90px 32px 60px" },
  header: { marginBottom: 28 },
  tabs: { display: "flex", gap: 0, marginBottom: 24 },
  tab: { background: "none", border: "none", borderBottom: "2px solid transparent",
    cursor: "pointer", fontFamily: "'Courier New', monospace", fontSize: 11,
    letterSpacing: 3, padding: "10px 20px 10px 0", marginRight: 24,
    display: "flex", alignItems: "center", gap: 8 },
  badge: { fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 10 },
  section: { paddingTop: 8 },
  empty: { padding: "48px 0", textAlign: "center" },
  tableHead: { display: "grid", gridTemplateColumns: "32px 1fr 100px 80px 70px 90px",
    color: "#444", fontSize: 9, letterSpacing: 3, paddingBottom: 10, marginBottom: 4 },
  friendRow: { display: "grid", gridTemplateColumns: "32px 1fr 100px 80px 70px 90px",
    alignItems: "center", padding: "14px 0", borderBottom: "1px solid",
    transition: "background 0.15s" },
  card: { display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "16px", border: "1px solid", borderRadius: 3, marginBottom: 10 },
  searchRow: { display: "flex", gap: 8, marginBottom: 24 },
  input: { flex: 1, padding: "10px 14px", background: "transparent", border: "1px solid",
    borderRadius: 2, fontSize: 13, outline: "none", fontFamily: "'Courier New', monospace" },
  btn: { padding: "10px 20px", border: "none", borderRadius: 2, cursor: "pointer",
    fontFamily: "'Courier New', monospace", fontSize: 11, letterSpacing: 2, fontWeight: 700,
    whiteSpace: "nowrap" },
};
