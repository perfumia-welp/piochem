import { useEffect, useRef } from "react";

const shortcuts = [
  { title: "API", desc: "Active pharmaceutical ingredients", href: "#apis" },
  { title: "Dietary Supplements", desc: "Vitamins, omega 3, collagen, oils", href: "#supplements" },
  { title: "Import Services", desc: "Listed & non-listed ingredients", href: "#import" },
  { title: "Partner Portfolio", desc: "India, China & Europe", href: "#partners" },
];

export default function FinalCTA() {
  const ref = useRef<HTMLDivElement>(null);

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
    <section ref={ref} className="requirement-section pc-section" style={{ padding: "112px 80px" }}>
      <div style={{ maxWidth: "1440px", margin: "0 auto" }}>
        <div className="pc-split" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>
          <div>
            <div className="reveal" style={{ marginBottom: "16px" }}>
              <span className="section-label">CM / 12 — START AN INQUIRY</span>
            </div>
            <h2 className="reveal reveal-delay-1" style={{
              fontFamily: "Manrope, sans-serif",
              fontSize: "clamp(36px, 4.2vw, 58px)",
              fontWeight: 800,
              lineHeight: 1.03,
              letterSpacing: "-0.035em",
              color: "#092A58",
              marginBottom: "24px",
            }}>
              Looking for an API<br /><span style={{ color: "#71B72B" }}>or Supplement Ingredient?</span>
            </h2>
            <p className="reveal reveal-delay-2" style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "15px",
              lineHeight: 1.7,
              color: "#75808C",
              marginBottom: "40px",
              maxWidth: "480px",
            }}>
              Send us the chemical, required grade, specification and quantity. Our team can review your requirement and help identify the appropriate product.
            </p>
            <div className="reveal reveal-delay-3" style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <a className="ui-button" href="#rfq" style={{
                fontFamily: "Manrope, sans-serif",
                fontWeight: 700,
                fontSize: "13px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#092A58",
                backgroundColor: "#71B72B",
                padding: "15px 28px",
                textDecoration: "none",
                transition: "background-color 0.2s, transform 0.2s",
                display: "inline-block",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#5F9E22"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#71B72B"; e.currentTarget.style.transform = ""; }}
              >
                Send Your Requirement
              </a>
              <a className="ui-button" href="#rfq" style={{
                fontFamily: "Manrope, sans-serif",
                fontWeight: 600,
                fontSize: "13px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#092A58",
                border: "1px solid rgba(9,42,88,0.16)",
                padding: "14px 28px",
                textDecoration: "none",
                transition: "border-color 0.2s",
                display: "inline-block",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#092A58"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(9,42,88,0.16)"; }}
              >
                Talk to Our Team
              </a>
            </div>
          </div>

          {/* Example requirement */}
          <div className="reveal reveal-delay-2">
            <div className="pc-card-pad" style={{
              backgroundColor: "#092A58",
              padding: "36px",
              borderRadius: "22px",
              position: "relative",
              overflow: "hidden",
            }}>
              <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "3px", background: "linear-gradient(90deg, #71B72B, rgba(113,183,43,0))" }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", paddingBottom: "18px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: "9px", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>Example Inquiry</span>
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: "9px", fontWeight: 700, letterSpacing: "0.16em", color: "#71B72B" }}>INQUIRY</span>
              </div>
              {[
                { label: "INGREDIENT", value: "Esomeprazole Pellets" },
                { label: "TYPE", value: "API / Supplement" },
                { label: "SPECIFICATION", value: "Your required grade" },
                { label: "QUANTITY", value: "Your required quantity" },
                { label: "APPLICATION", value: "Intended application" },
              ].map(({ label, value }) => (
                <div key={label} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "16px",
                  padding: "12px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                }}>
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.42)" }}>{label}</span>
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.85)", textAlign: "right" }}>{value}</span>
                </div>
              ))}
              <div style={{ marginTop: "26px" }}>
                <a className="ui-button" href="#rfq" style={{
                  display: "block",
                  textAlign: "center",
                  fontFamily: "Manrope, sans-serif",
                  fontWeight: 700,
                  fontSize: "12px",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#092A58",
                  backgroundColor: "#ffffff",
                  padding: "14px",
                  textDecoration: "none",
                  transition: "background-color 0.2s, color 0.2s",
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#71B72B"; e.currentTarget.style.color = "#092A58"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#ffffff"; e.currentTarget.style.color = "#092A58"; }}
                >
                  Start Inquiry →
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Resource shortcuts */}
        <div className="reveal reveal-delay-3 pc-grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "12px", marginTop: "64px" }}>
          {shortcuts.map((s) => (
            <a key={s.title} href={s.href} style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
              padding: "22px 24px",
              borderRadius: "16px",
              backgroundColor: "#F6F8F6",
              border: "1px solid rgba(9,42,88,0.05)",
              textDecoration: "none",
              transition: "background-color 0.2s, border-color 0.2s, transform 0.2s",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#F1F7EA"; e.currentTarget.style.borderColor = "rgba(113,183,43,0.2)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#F6F8F6"; e.currentTarget.style.borderColor = "rgba(9,42,88,0.05)"; e.currentTarget.style.transform = ""; }}
            >
              <span>
                <span style={{ display: "block", fontFamily: "Manrope, sans-serif", fontSize: "15px", fontWeight: 700, color: "#092A58", marginBottom: "3px" }}>{s.title}</span>
                <span style={{ display: "block", fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#75808C" }}>{s.desc}</span>
              </span>
              <span style={{ width: "34px", height: "34px", borderRadius: "10px", backgroundColor: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 8L8 2M8 2H3M8 2V7" stroke="#71B72B" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
