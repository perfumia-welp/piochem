import { useEffect, useRef } from "react";

const pillars = ["Supplier Representation", "Marketing", "Distribution", "Import Support"];

export default function Positioning() {
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
    <section id="about" ref={ref} className="company-section">
      <div className="company-grid">
        {/* Image side */}
        <div className="company-media reveal" style={{
          position: "relative",
          overflow: "hidden",
          backgroundColor: "#092A58",
        }}>
          <img
            src="https://images.unsplash.com/photo-1748281296151-b3209b37e1cb?w=1400&auto=format&fit=crop&q=80"
            alt="Technician in protective gown handling pharmaceutical material at a laboratory bench"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "45% 55%", display: "block", transition: "transform 0.6s ease" }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
          <div style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background: "linear-gradient(160deg, rgba(9,42,88,0.15) 0%, rgba(9,42,88,0.05) 45%, rgba(9,42,88,0.72) 100%)",
          }} />
          <div style={{
            position: "absolute",
            bottom: "32px",
            left: "32px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            pointerEvents: "none",
          }}>
            <div style={{ width: "16px", height: "2px", borderRadius: "2px", background: "#71B72B" }} />
            <span style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "10px",
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.78)",
            }}>Pharmaceutical Ingredient Handling</span>
          </div>
        </div>

        {/* Text side */}
        <div className="company-content" style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          backgroundColor: "#F6F8F6",
        }}>
          <div className="reveal" style={{ marginBottom: "24px" }}>
            <span className="section-label">CM / 02 — POSITIONING</span>
          </div>
          <h2 className="reveal reveal-delay-1" style={{
            fontFamily: "Manrope, sans-serif",
            fontSize: "clamp(32px, 3.3vw, 48px)",
            fontWeight: 800,
            lineHeight: 1.06,
            letterSpacing: "-0.03em",
            color: "#092A58",
            marginBottom: "28px",
          }}>
            More Than Sourcing.<br /><span style={{ color: "#71B72B" }}>A Route to Market.</span>
          </h2>
          <p className="reveal reveal-delay-2" style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "15px",
            lineHeight: 1.7,
            color: "#75808C",
            marginBottom: "32px",
            maxWidth: "440px",
          }}>
            Chemical Maker combines supplier representation, marketing, distribution and import support to connect international ingredient producers with pharmaceutical and healthcare customers in Egypt.
          </p>

          <div className="reveal reveal-delay-3 pc-grid-2-sm" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px", maxWidth: "440px", marginBottom: "40px" }}>
            {pillars.map((p, i) => (
              <div key={p} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 0", borderTop: "1px solid rgba(9,42,88,0.09)" }}>
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: "9px", fontWeight: 700, letterSpacing: "0.14em", color: "#71B72B" }}>0{i + 1}</span>
                <span style={{ fontFamily: "Manrope, sans-serif", fontSize: "13px", fontWeight: 700, color: "#092A58" }}>{p}</span>
              </div>
            ))}
          </div>

          <div className="reveal reveal-delay-4">
            <a href="#partners" style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              fontFamily: "Manrope, sans-serif",
              fontWeight: 700,
              fontSize: "12px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#092A58",
              textDecoration: "none",
              borderBottom: "1.5px solid #092A58",
              paddingBottom: "3px",
              transition: "color 0.2s, border-color 0.2s, gap 0.2s",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#71B72B"; e.currentTarget.style.borderColor = "#71B72B"; e.currentTarget.style.gap = "14px"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "#092A58"; e.currentTarget.style.borderColor = "#092A58"; e.currentTarget.style.gap = "10px"; }}
            >
              Meet Our Partners
              <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                <path d="M9 1l4 4-4 4M1 5h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
