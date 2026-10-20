/* ═══════════════════════════════════════════════════════════════════════
   CHEMICAL MAKER — BRAND LOGO
   ───────────────────────────────────────────────────────────────────────
   ►► INSERT THE REAL CLIENT LOGO HERE ◄◄

   The supplied Chemical Maker logo asset has NOT been imported into this
   project yet. Until it is, this renders a temporary typographic mark
   built from the real brand colours (navy / green / blue / orange).

   TO SWAP IN THE REAL LOGO:
     1. Drop the file into  src/assets/  (e.g. chemical-maker-logo.svg)
     2. Uncomment the import below and set LOGO_ASSET to it.
   Nothing else needs to change — every usage across the site reads
   from this one component.
   ═══════════════════════════════════════════════════════════════════════ */

// import logoAsset from "../assets/chemical-maker-logo.svg";
const LOGO_ASSET: string | null = null;

/** The glyph only — used beside the wordmark in the navbar / footer. */
export default function BrandLogo({ size = 30 }: { size?: number }) {
  if (LOGO_ASSET) {
    return (
      <img
        src={LOGO_ASSET}
        alt="Chemical Maker"
        style={{ height: size, width: "auto", display: "block", flexShrink: 0 }}
      />
    );
  }

  // Temporary mark: a navy rounded square holding a "CM" monogram, with the
  // green and blue of the real identity as a flask-like arc and one small
  // orange accent dot.
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" style={{ flexShrink: 0, display: "block" }}>
      <rect x="0.5" y="0.5" width="31" height="31" rx="8" fill="#092A58" />
      <path d="M8 21.5a8 8 0 0 1 16 0" fill="none" stroke="#71B72B" strokeWidth="2" strokeLinecap="round" />
      <path d="M11 12.5a5 5 0 0 1 10 0" fill="none" stroke="#2F5FA8" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="24.5" cy="8.5" r="2" fill="#F2A51A" />
      <text
        x="16"
        y="19.6"
        textAnchor="middle"
        fontFamily="Manrope, sans-serif"
        fontSize="9.5"
        fontWeight="800"
        letterSpacing="0.5"
        fill="#ffffff"
      >
        CM
      </text>
    </svg>
  );
}

/** Mark + "CHEMICAL MAKER" wordmark lock-up. */
export function BrandLock({
  size = 30,
  color = "#ffffff",
  wordSize = 15,
}: {
  size?: number;
  color?: string;
  wordSize?: number;
}) {
  return (
    <>
      <BrandLogo size={size} />
      <span
        style={{
          fontFamily: "Manrope, sans-serif",
          fontSize: `${wordSize}px`,
          fontWeight: 800,
          letterSpacing: "0.14em",
          color,
          whiteSpace: "nowrap",
        }}
      >
        CHEMICAL MAKER
      </span>
    </>
  );
}
