import { useEffect, useRef, useState } from "react";

// Hub-and-spoke diagram: Chemical Maker at the centre, sourcing regions around it.
const nodes = [
  { angle: -90, length: 132, label: "INDIA" },
  { angle: 0, length: 132, label: "EUROPE" },
  { angle: 90, length: 132, label: "EGYPT" },
  { angle: 180, length: 132, label: "CHINA" },
];
const minor = [
  { angle: -45, length: 96 },
  { angle: 45, length: 96 },
  { angle: 135, length: 96 },
  { angle: 225, length: 96 },
];

const partners = [
  { name: "MACCSEN LABORATORIES", region: "INDIA" },
  { name: "CUREQUEST LIFESCIENCE", region: "INDIA" },
  { name: "ZHONGMEI HUADONG JIANGDONG", region: "CHINA" },
  { name: "TIANJING JININ", region: "CHINA" },
  { name: "EXTROVIS", region: null },
  { name: "5N PLUS", region: "GERMANY" },
  { name: "THERALLEN PHARMA", region: null },
  { name: "ENVEE DRUGS", region: null },
];

export default function Partners() {
  const ref = useRef<HTMLDivElement>(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.querySelectorAll(".reveal").forEach((el) => el.classList.add("visible"));
            setAnimated(true);
          }
        });
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const cx = 200;
  const cy = 200;
  const pt = (angle: number, length: number) => {
    const rad = (angle * Math.PI) / 180;
    return { x: cx + Math.cos(rad) * length, y: cy + Math.sin(rad) * length };
  };

  return (
    <section id="partners" ref={ref} className="pc-section" style={{ backgroundColor: "#F6F8F6", padding: "112px 60px" }}>
      <div style={{ maxWidth: "1440px", margin: "0 auto" }}>
        <div className="pc-split" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px", alignItems: "center" }}>

          <div>
            <div className="reveal" style={{ marginBottom: "16px" }}>
              <span className="section-label">CM / 06 — INTERNATIONAL PARTNERS</span>
            </div>
            <h2 className="reveal reveal-delay-1" style={{
              fontFamily: "Manrope, sans-serif",
              fontSize: "clamp(34px, 4vw, 52px)",
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              color: "#092A58",
              marginBottom: "24px",
            }}>
              A Network Built Across<br />India, China &amp; Europe.
            </h2>
            <p className="reveal reveal-delay-2" style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "15px",
              lineHeight: 1.7,
              color: "#75808C",
              marginBottom: "32px",
              maxWidth: "480px",
            }}>
              Chemical Maker represents selected international pharmaceutical and ingredient suppliers, connecting their portfolios with customers in Egypt.
            </p>

            <div className="reveal reveal-delay-3 pc-grid-2-sm" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "28px" }}>
              {partners.map((partner) => (
                <div
                  key={partner.name}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: "10px",
                    minHeight: "92px",
                    padding: "18px 20px",
                    borderRadius: "14px",
                    backgroundColor: "#ffffff",
                    border: "1px solid rgba(9,42,88,0.07)",
                    transition: "border-color 0.2s, box-shadow 0.2s, transform 0.2s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(113,183,43,0.45)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(9,42,88,0.07)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(9,42,88,0.07)"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  <span style={{ fontFamily: "Manrope, sans-serif", fontSize: "14px", fontWeight: 800, lineHeight: 1.25, letterSpacing: "-0.005em", color: "#092A58" }}>
                    {partner.name}
                  </span>
                  {partner.region && (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "7px", fontFamily: "Inter, sans-serif", fontSize: "9px", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#2F5FA8" }}>
                      <span style={{ width: "5px", height: "5px", borderRadius: "50%", backgroundColor: "#71B72B", flexShrink: 0 }} />
                      {partner.region}
                    </span>
                  )}
                </div>
              ))}
            </div>

            <p className="reveal reveal-delay-3" style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", lineHeight: 1.6, color: "#75808C", marginBottom: "32px", maxWidth: "480px" }}>
              Partner names are shown as clean typography. Supplied logo files can replace these cards once provided.
            </p>

            <div className="reveal reveal-delay-4">
              <a className="ui-button" href="#rfq" style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                fontFamily: "Manrope, sans-serif",
                fontWeight: 700,
                fontSize: "12px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#ffffff",
                backgroundColor: "#092A58",
                padding: "14px 24px",
                textDecoration: "none",
                transition: "background-color 0.2s, transform 0.2s",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#71B72B"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#092A58"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                Discuss a Partnership
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                  <path d="M8 1l3 3-3 3M1 4h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Network visual */}
          <div className="reveal reveal-delay-2" style={{ position: "relative" }}>
            <div style={{ borderRadius: "24px", overflow: "hidden", position: "relative", backgroundColor: "#092A58", height: "clamp(420px, 44vw, 560px)" }}>
              <img
                src="https://images.unsplash.com/photo-1602052577122-f73b9710adba?w=1000&h=900&fit=crop&auto=format"
alt="Clean pharmaceutical analytical laboratory"
                style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.22, display: "block", filter: "grayscale(0.4)" }}
              />
              <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, rgba(9,42,88,0.3) 0%, rgba(9,42,88,0.85) 100%)" }} />

              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: "12px" }}>
                <svg viewBox="0 0 400 400" style={{ width: "100%", maxWidth: "440px", height: "auto", overflow: "visible" }}>
                  {[60, 96, 132, 172].map((r) => (
                    <circle key={r} cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                  ))}
                  {minor.map((m, i) => {
                    const p = pt(m.angle, m.length);
                    return (
                      <g key={`m-${i}`}>
                        <line x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="2 4" />
                        <circle cx={p.x} cy={p.y} r="2.5" fill="rgba(255,255,255,0.3)" style={{ opacity: animated ? 1 : 0, transition: `opacity 0.4s ease ${0.6 + 0.1 * i}s` }} />
                      </g>
                    );
                  })}
                  {nodes.map((n, i) => {
                    const p = pt(n.angle, n.length);
                    const labelY = n.angle === -90 ? p.y - 16 : n.angle === 90 ? p.y + 24 : p.y + 24;
                    return (
                      <g key={n.label}>
                        <line x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="rgba(113,183,43,0.18)" strokeWidth="1" />
                        <line
                          x1={cx} y1={cy} x2={p.x} y2={p.y}
                          stroke="#71B72B"
                          strokeWidth="1.4"
                          strokeDasharray={n.length}
                          strokeDashoffset={animated ? 0 : n.length}
                          style={{ transition: `stroke-dashoffset 1.2s ease ${0.2 * i}s` }}
                        />
                        <circle cx={p.x} cy={p.y} r="6" fill="#092A58" stroke="#71B72B" strokeWidth="1.5"
                          style={{ opacity: animated ? 1 : 0, transition: `opacity 0.4s ease ${0.9 + 0.15 * i}s` }}
                        />
                        <text x={p.x} y={labelY} textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="9" fontWeight="600" letterSpacing="1.6" fill="rgba(255,255,255,0.72)"
                          style={{ opacity: animated ? 1 : 0, transition: `opacity 0.4s ease ${1 + 0.15 * i}s` }}
                        >{n.label}</text>
                      </g>
                    );
                  })}
                  <polygon points="200,176 220.8,188 220.8,212 200,224 179.2,212 179.2,188" fill="#092A58" stroke="#71B72B" strokeWidth="1.6" />
                  <circle cx={cx} cy={cy} r="30" fill="none" stroke="rgba(113,183,43,0.3)" strokeWidth="1">
                    <animate attributeName="r" values="26;42;26" dur="3s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.5;0;0.5" dur="3s" repeatCount="indefinite" />
                  </circle>
                  <text x={cx} y={cy + 4} textAnchor="middle" fontFamily="Manrope, sans-serif" fontSize="11" fontWeight="800" fill="#ffffff">CM</text>
                </svg>
              </div>

              <div style={{ position: "absolute", top: "24px", left: "24px", fontFamily: "Manrope, sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)" }}>
                CHEMICAL MAKER <span style={{ color: "#71B72B" }}>·</span> EGYPT
              </div>
              <div style={{ position: "absolute", bottom: "24px", left: 0, right: 0, display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap", padding: "0 16px" }}>
                {["REPRESENT", "SOURCE", "DISTRIBUTE"].map((t) => (
                  <span key={t} style={{ fontFamily: "Inter, sans-serif", fontSize: "9px", fontWeight: 500, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
