import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import { THEMES } from "../utils/timeTheme";

const THEME_META = {
  dawn:  { dot: "#f0a500", label: "DAWN" },
  day:   { dot: "#00e5ff", label: "DAY"  },
  night: { dot: "#c8a84b", label: "NITE" },
};

export default function Nav() {
  const { user, logout } = useAuth();
  const { theme: t, themeName, manual, setTheme } = useTheme();
  const { pathname } = useLocation();
  const active = (p) => pathname === p;

  const navBg = t.name === "dawn"  ? "rgba(14,9,0,0.85)"
              : t.name === "night" ? "rgba(0,0,0,0.92)"
              : "rgba(5,13,26,0.85)";

  const L = (to, label, badge = 0) => (
    <Link to={to} style={{
      color: active(to) ? t.primary : t.secondary,
      textDecoration: "none",
      fontSize: t.name === "dawn" ? 12 : 11,
      fontFamily: t.font,
      letterSpacing: t.name === "dawn" ? 2 : 3,
      borderBottom: active(to) ? `${t.name === "dawn" ? "2px" : "1px"} solid ${t.primary}` : `1px solid transparent`,
      paddingBottom: 2, transition: "color 0.15s",
      display: "flex", alignItems: "center", gap: 6
    }}>
      {label}
        {badge > 0 && (
          <span style={{ background: t.primary, color: t.bg, fontSize: 9,
            fontWeight: 700, padding: "1px 5px",
            borderRadius: "2px" }}>
            {badge}
          </span>
        )}
    </Link>
  );

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "12px 28px", fontFamily: t.font,
      backdropFilter: "blur(16px)", background: navBg,
      borderBottom: `${t.name === "dawn" ? "2px" : "1px"} solid ${t.border}`,
      gap: 16
    }}>

      {/* Logo */}
      <Link to="/" style={{ textDecoration: "none", flexShrink: 0 }}>
        <span className="logo" style={{
          color: t.primary, fontWeight: 700,
          letterSpacing: t.name === "dawn" ? 3 : 4,
          fontSize: t.name === "dawn" ? 17 : 15,
          fontFamily: t.font,
        }}>
          TYPO<span style={{ color: t.accent }}>ERROR</span>
        </span>
      </Link>

      {/* Center links */}
      <div style={{ display: "flex", gap: t.name === "dawn" ? 28 : 20, alignItems: "center" }}>
        {L("/", "HOME")}
        {L("/play", "PLAY")}
        {user && L("/stats", "STATS")}
        {user && L("/social", "SOCIAL", user.friendRequests?.length || 0)}
        {L("/about", "ABOUT")}
        {L("/support", "SUPPORT")}
      </div>

      {/* Right */}
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>

        {/* Theme switcher */}
        <div style={{
          display: "flex", gap: 4, alignItems: "center",
          padding: "4px 8px",
          borderRadius: t.radius,
          border: `1px solid ${t.border}`,
          background: t.surface + "88"
        }}>
          <button onClick={() => setTheme("auto")}
            style={{
              background: "transparent", border: `1px solid ${!manual ? t.primary : "transparent"}`,
              borderRadius: t.radius, cursor: "pointer", fontFamily: t.font,
              color: !manual ? t.primary : t.secondary,
              fontSize: 8, padding: "2px 6px", letterSpacing: 2
            }}>
            AUTO
          </button>
          {Object.keys(THEMES).map(name => (
            <button key={name} onClick={() => setTheme(name)}
              title={THEMES[name].label}
              style={{
                width: 10, height: 10, borderRadius: "50%", border: "none",
                cursor: "pointer", padding: 0, transition: "all 0.2s",
                background: THEME_META[name].dot,
                boxShadow: themeName === name ? `0 0 10px ${THEME_META[name].dot}` : "none",
                opacity: themeName === name ? 1 : 0.3,
                transform: themeName === name ? "scale(1.4)" : "scale(1)"
              }} />
          ))}
        </div>

        {user ? (
          <>
            <Link to="/profile" style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "5px 12px", borderRadius: t.radius,
              textDecoration: "none", fontFamily: t.font,
              fontSize: 11, letterSpacing: 1,
              color: t.primary,
              background: t.primary + "15",
              border: `${t.name === "dawn" ? "2px" : "1px"} solid ${active("/profile") ? t.primary : t.primary + "33"}`
            }}>
              <span style={{
                width: 20, height: 20, borderRadius: "50%",
                background: t.primary, color: t.bg,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 10, fontWeight: 700
              }}>
                {user.username[0].toUpperCase()}
              </span>
              <span style={{ fontSize: 10 }}>{user.username}</span>
            </Link>
            <button onClick={logout} style={{
              padding: "5px 12px", borderRadius: t.radius, cursor: "pointer",
              fontFamily: t.font, fontSize: 10, letterSpacing: 2,
              background: "transparent", color: t.secondary,
              border: `1px solid ${t.secondary}33`
            }}>
              LOGOUT
            </button>
          </>
        ) : (
          <Link to="/auth" style={{
            padding: "6px 16px", borderRadius: t.radius,
            color: t.bg, background: t.primary, border: "none",
            textDecoration: "none", fontFamily: t.font,
            fontSize: 11, letterSpacing: 3, fontWeight: 700,
            display: "inline-block"
          }}>
            LOGIN
          </Link>
        )}
      </div>
    </nav>
  );
}
