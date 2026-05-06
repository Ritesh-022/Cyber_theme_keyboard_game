import { useState } from "react";
import { Link } from "react-router-dom";

const FAQS = [
  { q: "Do I need an account to play?", a: "No. You can play as a guest at /play. An account unlocks AI coaching, stats tracking, and the social system." },
  { q: "What is a Unique ID (CYB-XXXX)?", a: "It is your in-game identity, separate from your email. Use it to add friends without sharing personal info." },
  { q: "How does AI coaching work?", a: "After each game, your MPM and accuracy are sent to local Ollama. It returns 3 specific improvement tips." },
  { q: "Why does the UI look different at different times?", a: "TypoError has 3 time-based themes: Dawn (5-8am), Day (9am-6pm), Night (6pm-5am)." },
  { q: "What does MPM mean?", a: "Metered Per Minute: the number of correct words typed per minute." },
  { q: "Is my data stored securely?", a: "Passwords are hashed with bcrypt. JWTs are used for sessions. Plain-text credentials are never stored." }
];

export default function SupportPage({ theme: t }) {
  const [open, setOpen] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const toggle = (i) => setOpen(open === i ? null : i);

  const submit = (e) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div style={{ ...s.page, background: t.bg, color: t.primary }}>
      <section style={s.hero}>
        <p style={{ color: t.secondary, fontSize: 10, letterSpacing: 5, marginBottom: 16 }}>SUPPORT</p>
        <h1 style={{ color: t.primary, fontSize: "clamp(28px,5vw,52px)", fontWeight: 700, letterSpacing: 6, textShadow: `0 0 24px ${t.glow}`, marginBottom: 16 }}>
          HOW CAN WE HELP?
        </h1>
        <p style={{ color: t.secondary, fontSize: 13, letterSpacing: 1 }}>
          Browse the FAQ or send us a message.
        </p>
      </section>

      <div className="support-layout" style={s.layout}>
        <div style={s.col}>
          <p style={{ color: t.secondary, fontSize: 10, letterSpacing: 5, marginBottom: 24 }}>
            FREQUENTLY ASKED
          </p>
          {FAQS.map((faq, i) => (
            <div key={i} style={{ ...s.faqItem, borderColor: open === i ? t.primary + "66" : t.secondary + "33" }}>
              <button onClick={() => toggle(i)} style={{ ...s.faqQ, color: open === i ? t.primary : t.accent }}>
                <span>{faq.q}</span>
                <span style={{ color: t.secondary, fontSize: 16, transition: "transform 0.2s", display: "inline-block", transform: open === i ? "rotate(45deg)" : "rotate(0)" }}>
                  +
                </span>
              </button>
              {open === i && (
                <p style={{ color: t.secondary, fontSize: 13, lineHeight: 1.8, padding: "12px 0 4px", borderTop: `1px solid ${t.secondary}22`, marginTop: 8 }}>
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>

        <div style={s.col}>
          <p style={{ color: t.secondary, fontSize: 10, letterSpacing: 5, marginBottom: 24 }}>
            CONTACT US
          </p>

          {sent ? (
            <div style={{ ...s.successBox, borderColor: t.primary + "44", background: t.primary + "08" }}>
              <p style={{ color: t.primary, fontSize: 13, letterSpacing: 2 }}>MESSAGE SENT</p>
              <p style={{ color: t.secondary, fontSize: 12, marginTop: 8 }}>
                We will get back to you soon.
              </p>
              <button onClick={() => setSent(false)} style={{ ...s.btnOutline, color: t.secondary, borderColor: t.secondary + "44", marginTop: 16 }}>
                SEND ANOTHER
              </button>
            </div>
          ) : (
            <form onSubmit={submit} style={s.form}>
              <input style={{ ...s.input, borderColor: t.secondary + "44", color: t.accent }} placeholder="Your name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              <input style={{ ...s.input, borderColor: t.secondary + "44", color: t.accent }} placeholder="Email address" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
              <textarea style={{ ...s.input, ...s.textarea, borderColor: t.secondary + "44", color: t.accent }} placeholder="Describe your issue or question..." value={form.message} rows={5} onChange={e => setForm({ ...form, message: e.target.value })} required />
              <button type="submit" style={{ ...s.btnPrimary, background: t.primary, color: t.bg }}>
                SEND MESSAGE
              </button>
            </form>
          )}

          <div style={{ ...s.quickLinks, borderColor: t.secondary + "22" }}>
            <p style={{ color: t.secondary, fontSize: 9, letterSpacing: 4, marginBottom: 12 }}>QUICK LINKS</p>
            {[
              { label: "Play the game", to: "/play" },
              { label: "About CyberType", to: "/about" },
              { label: "Create account", to: "/auth" }
            ].map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                style={{ color: t.secondary, fontSize: 12, letterSpacing: 1, display: "block", padding: "6px 0", textDecoration: "none", borderBottom: `1px solid ${t.secondary}11` }}
                onMouseEnter={e => { e.currentTarget.style.color = t.primary; }}
                onMouseLeave={e => { e.currentTarget.style.color = t.secondary; }}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: "100vh", fontFamily: "'Courier New', monospace", paddingTop: 60 },
  hero: { textAlign: "center", padding: "60px 24px 40px" },
  layout: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, maxWidth: 960, margin: "0 auto", padding: "20px 32px 80px" },
  col: { display: "flex", flexDirection: "column" },
  faqItem: { border: "1px solid", borderRadius: 3, padding: "16px", marginBottom: 10, transition: "border-color 0.2s" },
  faqQ: { width: "100%", background: "none", border: "none", cursor: "pointer", fontFamily: "'Courier New', monospace", fontSize: 13, letterSpacing: 1, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, textAlign: "left" },
  form: { display: "flex", flexDirection: "column", gap: 12 },
  input: { padding: "11px 14px", background: "transparent", border: "1px solid", borderRadius: 2, fontSize: 13, outline: "none", fontFamily: "'Courier New', monospace", letterSpacing: 1, resize: "none" },
  textarea: { lineHeight: 1.7 },
  btnPrimary: { padding: "12px", border: "none", borderRadius: 2, cursor: "pointer", fontFamily: "'Courier New', monospace", fontSize: 12, letterSpacing: 3, fontWeight: 700 },
  btnOutline: { padding: "10px 20px", background: "transparent", border: "1px solid", borderRadius: 2, cursor: "pointer", fontFamily: "'Courier New', monospace", fontSize: 11, letterSpacing: 2 },
  successBox: { border: "1px solid", borderRadius: 3, padding: "32px 24px", textAlign: "center" },
  quickLinks: { marginTop: 32, borderTop: "1px solid", paddingTop: 20 }
};
