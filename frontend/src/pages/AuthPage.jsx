import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../hooks/useAuth";

export default function AuthPage({ theme }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const t = theme;

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const endpoint = mode === "login" ? "/auth/login" : "/auth/signup";
      const payload = mode === "login"
        ? { email: form.email, password: form.password }
        : form;
      const { data } = await api.post(endpoint, payload);
      login(data.token, data.user);
      navigate("/");
    } catch (err) {
      if (err.response) {
        setError(err.response.data?.error || "Server error");
      } else if (err.request) {
        setError("Cannot reach server — is the backend running?");
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (m) => {
    setMode(m);
    setError("");
    setForm({ username: "", email: "", password: "" });
  };

  return (
    <div style={{ ...styles.page, background: t.bg }}>
      <div style={{ ...styles.card, borderColor: t.primary, boxShadow: `0 0 30px ${t.glow}` }}>
        <p style={{ ...styles.label, color: t.secondary }}>{t.label}</p>
        <h1 style={{ ...styles.title, color: t.primary }}>
          TYPO<span style={{ color: t.accent }}>ERROR</span>
        </h1>

        <div style={styles.tabs}>
          {["login", "signup"].map(m => (
            <button key={m} onClick={() => switchMode(m)}
              style={{ ...styles.tab, color: mode === m ? t.primary : t.secondary,
                borderBottom: mode === m ? `2px solid ${t.primary}` : "2px solid transparent" }}>
              {m.toUpperCase()}
            </button>
          ))}
        </div>

        <form onSubmit={submit} style={styles.form}>
          {mode === "signup" && (
            <input
              style={{ ...styles.input, borderColor: t.secondary, color: t.accent, background: "transparent" }}
              placeholder="Username" value={form.username} required
              onChange={e => setForm({ ...form, username: e.target.value })} />
          )}
          <input
            style={{ ...styles.input, borderColor: t.secondary, color: t.accent, background: "transparent" }}
            placeholder="Email" type="email" value={form.email} required
            onChange={e => setForm({ ...form, email: e.target.value })} />
          <input
            style={{ ...styles.input, borderColor: t.secondary, color: t.accent, background: "transparent" }}
            placeholder="Password" type="password" value={form.password} required minLength={6}
            onChange={e => setForm({ ...form, password: e.target.value })} />

          {error && (
            <p style={{ color: "#ff4444", fontSize: 12, letterSpacing: 1, lineHeight: 1.5 }}>
              ⚠ {error}
            </p>
          )}

          <button type="submit" disabled={loading}
            style={{ ...styles.btn, background: t.primary, color: t.bg, opacity: loading ? 0.6 : 1 }}>
            {loading ? "..." : mode === "login" ? "ENTER" : "CREATE"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", display: "flex", alignItems: "center",
    justifyContent: "center", fontFamily: "'Courier New', monospace" },
  card: { width: 360, padding: "40px 32px", border: "1px solid", borderRadius: 4 },
  label: { fontSize: 11, letterSpacing: 4, marginBottom: 4 },
  title: { fontSize: 32, fontWeight: 700, letterSpacing: 6, marginBottom: 24 },
  tabs: { display: "flex", gap: 24, marginBottom: 24 },
  tab: { background: "none", border: "none", cursor: "pointer", fontSize: 13,
    letterSpacing: 2, paddingBottom: 6, fontFamily: "'Courier New', monospace" },
  form: { display: "flex", flexDirection: "column", gap: 12 },
  input: { padding: "10px 12px", border: "1px solid", borderRadius: 2,
    fontSize: 14, outline: "none", letterSpacing: 1, fontFamily: "'Courier New', monospace" },
  btn: { padding: "12px", border: "none", borderRadius: 2, cursor: "pointer",
    fontFamily: "'Courier New', monospace", fontSize: 13, letterSpacing: 3,
    fontWeight: 700, marginTop: 4 }
};
