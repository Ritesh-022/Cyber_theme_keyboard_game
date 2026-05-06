export const THEMES = {
  day: {
    name: "day",
    label: "DAY CYCLE",
    bg: "#050d1a",
    surface: "#0a1628",
    border: "#00e5ff22",
    primary: "#00e5ff",
    secondary: "#0077aa",
    accent: "#80f0ff",
    muted: "#1a3a4a",
    error: "#ff4466",
    glow: "rgba(0,229,255,0.3)",
    font: "'Courier New', monospace",
    radius: "2px",
    cardStyle: "border: 1px solid #00e5ff22; background: #0a162888;",
    btnStyle: "border-radius: 2px; letter-spacing: 3px; text-transform: uppercase;",
    scanline: true
  },
  dawn: {
    name: "dawn",
    label: "DAWN PROTOCOL",
    bg: "#0e0900",
    surface: "#1a1000",
    border: "#e8a87c44",
    primary: "#f0a500",
    secondary: "#8a5a00",
    accent: "#ffd166",
    muted: "#2a1a00",
    error: "#ff6b35",
    glow: "rgba(240,165,0,0.4)",
    font: "Georgia, 'Times New Roman', serif",
    radius: "0px",
    cardStyle: "border: 2px solid #f0a50044; background: #1a100088;",
    btnStyle: "border-radius: 0px; letter-spacing: 4px; text-transform: uppercase; border-width: 2px;",
    scanline: false
  },
  night: {
    name: "night",
    label: "NIGHT MODE",
    bg: "#0a0800",
    surface: "#110f00",
    border: "#c8a84b33",
    primary: "#c8a84b",
    secondary: "#6b5a1e",
    accent: "#e8cc7a",
    muted: "#1a1500",
    error: "#ff4422",
    glow: "rgba(200,168,75,0.35)",
    font: "'Courier New', monospace",
    radius: "0px",
    cardStyle: "border: 1px solid #c8a84b33; background: #110f0088;",
    btnStyle: "border-radius: 0px; letter-spacing: 4px;",
    scanline: true
  }
};

export function getAutoTheme() {
  const h = new Date().getHours();
  if (h >= 5 && h < 9) return THEMES.dawn;
  if (h >= 9 && h < 18) return THEMES.day;
  return THEMES.night;
}

export const getTimeTheme = getAutoTheme;
