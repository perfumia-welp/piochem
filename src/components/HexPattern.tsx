// Honeycomb line pattern used as a subtle molecular texture over dark imagery.
export default function HexPattern({ id, color = "#ffffff", opacity = 0.05 }: { id: string; color?: string; opacity?: number }) {
  return (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity, pointerEvents: "none" }} aria-hidden>
      <defs>
        <pattern id={id} width="41.57" height="72" patternUnits="userSpaceOnUse">
          <path d="M20.78 0 L41.57 12 L41.57 36 L20.78 48 L0 36 L0 12 Z M20.78 48 L20.78 72" fill="none" stroke={color} strokeWidth="0.6" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
