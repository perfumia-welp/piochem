import { useEffect, useRef, useState } from "react";

const steps = [
  {
    num: "01",
    title: "Share the Requirement",
    items: ["Ingredient name", "Specification & quantity", "Intended application"],
  },
  {
    num: "02",
    title: "Review & Sourcing",
    items: ["Checked against our portfolio", "Represented supplier options", "Wider sourcing network"],
  },
  {
    num: "03",
    title: "Offer & Documentation",
    items: ["Commercial offer prepared", "Available documents confirmed", "Import route reviewed"],
  },
  {
    num: "04",
    title: "Supply & Support",
    items: ["Import and delivery handled", "Customer supply", "Ongoing business support"],
  },
];

const DEFAULT_ACTIVE = steps.length - 1;
const EASE = "0.45s cubic-bezier(0.22, 1, 0.36, 1)";

export default function BuyerProcess() {
  const ref = useRef<HTMLDivElement>(null);
  // The hovered card borrows the active style; with no hover it falls back to the final step.
  const [hovered, setHovered] = useState<number | null>(null);
  const activeIndex = hovered ?? DEFAULT_ACTIVE;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.querySelectorAll(".reveal").forEach((el) => el.classList.add("visible"));
        });
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="pc-section" style={{ backgroundColor: "#ffffff", padding: "112px 80px" }}>
      <div style={{ maxWidth: "1440px", margin: "0 auto" }}>
        <div className="reveal" style={{ marginBottom: "16px" }}>
          <span className="section-label">CM / 11 — WORKING WITH US</span>
        </div>
        <div className="pc-split" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "start", marginBottom: "64px" }}>
          <h2 className="reveal reveal-delay-1" style={{
            fontFamily: "Manrope, sans-serif",
            fontSize: "clamp(34px, 4vw, 52px)",
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            color: "#092A58",
          }}>
            From Requirement<br />to Supply.
          </h2>
          <p className="reveal reveal-delay-2" style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "15px",
            lineHeight: 1.7,
            color: "#75808C",
            alignSelf: "center",
          }}>
            A clear path from the first enquiry to supply, built around how each customer requirement is actually handled.
          </p>
        </div>

        <div
          className="pc-grid-4"
          style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "12px" }}
          onMouseLeave={() => setHovered(null)}
        >
          {steps.map((step, i) => {
            const dark = i === activeIndex;
            return (
              // Reveal lives on the wrapper so the card's own colour transitions don't override it.
              <div className={`reveal reveal-delay-${i + 1}`} key={step.num} onMouseEnter={() => setHovered(i)}>
                <div className="pc-card-pad" style={{
                  padding: "40px 32px",
                  height: "100%",
                  backgroundColor: dark ? "#092A58" : "#F6F8F6",
                  borderRadius: "20px",
                  position: "relative",
                  overflow: "hidden",
                  transition: `background-color ${EASE}`,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
                    <div style={{
                      fontFamily: "Manrope, sans-serif",
                      fontSize: "56px",
                      fontWeight: 800,
                      letterSpacing: "-0.04em",
                      color: dark ? "rgba(113,183,43,0.9)" : "rgba(9,42,88,0.1)",
                      lineHeight: 1,
                      transition: `color ${EASE}`,
                    }}>{step.num}</div>
                    {i < steps.length - 1 && (
                      <svg width="20" height="12" viewBox="0 0 20 12" fill="none" style={{ marginTop: "12px" }} aria-hidden>
                        <path d="M14 1l5 5-5 5M1 6h18" stroke="#71B72B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>

                  <div style={{ width: "32px", height: "2px", borderRadius: "2px", backgroundColor: "#71B72B", marginBottom: "18px" }} />

                  <h3 style={{
                    fontFamily: "Manrope, sans-serif",
                    fontSize: "19px",
                    fontWeight: 700,
                    letterSpacing: "-0.01em",
                    color: dark ? "#ffffff" : "#092A58",
                    marginBottom: "20px",
                    lineHeight: 1.25,
                    textTransform: "uppercase",
                    transition: `color ${EASE}`,
                  }}>{step.title}</h3>

                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {step.items.map((item) => (
                      <li key={item} style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        fontFamily: "Inter, sans-serif",
                        fontSize: "14px",
                        color: dark ? "rgba(255,255,255,0.62)" : "#75808C",
                        padding: "9px 0",
                        borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.07)" : "rgba(9,42,88,0.07)"}`,
                        transition: `color ${EASE}, border-color ${EASE}`,
                      }}>
                        <div style={{ width: "4px", height: "4px", backgroundColor: "#71B72B", borderRadius: "50%", flexShrink: 0 }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                  {i === steps.length - 1 && (
                    <a className="ui-button" href="#rfq" style={{
                      marginTop: "24px", display: "inline-flex", alignItems: "center", gap: "8px",
                      fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase",
                      color: "#092A58", backgroundColor: "#71B72B", padding: "11px 18px", textDecoration: "none",
                    }}>Send Your Requirement</a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
