// Pure SVG line chart — no dependencies
// props: data=[{x, y}], color, label, width, height, yLabel
export default function LineChart({ data, color, label = "", width = 500, height = 160, yLabel = "" }) {
  if (!data || data.length < 2) return (
    <div style={{ width, height, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ color: "#444", fontSize: 11, letterSpacing: 2 }}>NOT ENOUGH DATA</span>
    </div>
  );

  const pad = { top: 16, right: 16, bottom: 32, left: 40 };
  const W = width - pad.left - pad.right;
  const H = height - pad.top - pad.bottom;

  const xs = data.map(d => d.x);
  const ys = data.map(d => d.y);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = 0, maxY = Math.max(...ys, 10);

  const px = x => pad.left + ((x - minX) / Math.max(maxX - minX, 1)) * W;
  const py = y => pad.top + H - ((y - minY) / (maxY - minY)) * H;

  const points = data.map(d => `${px(d.x)},${py(d.y)}`).join(" ");
  const areaPoints = [
    `${px(xs[0])},${py(0)}`,
    ...data.map(d => `${px(d.x)},${py(d.y)}`),
    `${px(xs[xs.length - 1])},${py(0)}`
  ].join(" ");

  // Y axis ticks
  const yTicks = [0, Math.round(maxY * 0.5), maxY];
  // X axis ticks — show ~5 evenly
  const step = Math.max(1, Math.floor((maxX - minX) / 4));
  const xTicks = [];
  for (let x = minX; x <= maxX; x += step) xTicks.push(x);

  const gradId = `grad-${(label || yLabel || "chart").replace(/\s/g, "")}-${color.replace("#", "")}`;

  return (
    <div>
      {label && (
        <p style={{ color: "#555", fontSize: 9, letterSpacing: 4, marginBottom: 8 }}>{label}</p>
      )}
      <svg width={width} height={height} style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {yTicks.map(y => (
          <g key={y}>
            <line x1={pad.left} y1={py(y)} x2={pad.left + W} y2={py(y)}
              stroke="#ffffff08" strokeWidth="1" />
            <text x={pad.left - 6} y={py(y) + 4} textAnchor="end"
              fill="#444" fontSize="9" fontFamily="'Courier New', monospace">
              {y}
            </text>
          </g>
        ))}

        {/* X axis ticks */}
        {xTicks.map(x => (
          <text key={x} x={px(x)} y={pad.top + H + 18} textAnchor="middle"
            fill="#444" fontSize="9" fontFamily="'Courier New', monospace">
            {x}{yLabel === "s" ? "s" : ""}
          </text>
        ))}

        {/* Area fill */}
        <polygon points={areaPoints} fill={`url(#${gradId})`} />

        {/* Line */}
        <polyline points={points} fill="none" stroke={color} strokeWidth="2"
          strokeLinejoin="round" strokeLinecap="round" />

        {/* Dots on data points (only if few points) */}
        {data.length <= 30 && data.map((d, i) => (
          <circle key={i} cx={px(d.x)} cy={py(d.y)} r="3"
            fill={color} opacity="0.8" />
        ))}

        {/* Y axis label */}
        {yLabel && (
          <text x={10} y={pad.top + H / 2} textAnchor="middle"
            fill="#444" fontSize="9" fontFamily="'Courier New', monospace"
            transform={`rotate(-90, 10, ${pad.top + H / 2})`}>
            {yLabel}
          </text>
        )}
      </svg>
    </div>
  );
}
