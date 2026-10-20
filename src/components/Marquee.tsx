const items = [
  "ACTIVE PHARMACEUTICAL INGREDIENTS",
  "DIETARY SUPPLEMENTS",
  "PHARMA RAW MATERIALS",
  "BIOTIN & VITAMINS",
  "OMEGA 3",
  "COLLAGEN & PEPTIDES",
  "BOTANICAL OILS",
  "SPECIALTY APIs",
  "PELLETS & MUPS",
];

const Sep = () => (
  <span className="marquee-sep" aria-hidden="true">
    ✦
  </span>
);

export default function Marquee() {
  // Separator after every item (including the last) keeps the seam of the loop seamless.
  const track = [...items, ...items];

  return (
    <div className="marquee-stripe">
      <style>{`
        @keyframes marqueeScroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        .marquee-stripe {
          background-color: #F6F8F6;
          border-top: 1px solid rgba(9,42,88,0.06);
          border-bottom: 1px solid rgba(9,42,88,0.06);
          overflow: hidden;
          display: flex;
          align-items: center;
          min-height: 96px;
          padding: 30px 0;
        }

        .marquee-track {
          display: inline-flex;
          align-items: center;
          white-space: nowrap;
          animation: marqueeScroll 52s linear infinite;
          will-change: transform;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }

        .marquee-item {
          display: inline-flex;
          align-items: center;
        }

        .marquee-item-text {
          font-family: Manrope, sans-serif;
          font-size: 20px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(9,42,88,0.78);
          white-space: nowrap;
        }

        .marquee-sep {
          display: inline-flex;
          align-items: center;
          margin: 0 40px;
          color: #71B72B;
          font-size: 14px;
        }

        @media (max-width: 1024px) {
          .marquee-stripe { min-height: 80px; padding: 24px 0; }
          .marquee-item-text { font-size: 17px; }
          .marquee-sep { margin: 0 30px; font-size: 12px; }
        }

        @media (max-width: 640px) {
          .marquee-stripe { min-height: 68px; padding: 18px 0; }
          .marquee-item-text { font-size: 15px; letter-spacing: 0.06em; }
          .marquee-sep { margin: 0 20px; font-size: 11px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .marquee-track { animation-duration: 160s; }
        }
      `}</style>
      <div className="marquee-track">
        {track.map((item, i) => (
          <span key={`${item}-${i}`} className="marquee-item">
            <span className="marquee-item-text">{item}</span>
            <Sep />
          </span>
        ))}
      </div>
    </div>
  );
}
