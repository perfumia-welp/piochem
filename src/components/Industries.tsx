import { useEffect, useRef, useState } from "react";

const industries = [
  { num: "01", tag: "API", name: "Active Pharmaceutical Ingredients", desc: "Active pharmaceutical ingredients sourced through our represented and partner supplier network.", img: "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=1000&h=700&fit=crop&auto=format", imgAlt: "Molecular structure model on a dark background", size: "large" },
  { num: "02", tag: "Supplement Ingredient", name: "Dietary Supplements", desc: "Supplement ingredients supplied to nutraceutical and healthcare customers.", img: "https://images.pexels.com/photos/13779103/pexels-photo-13779103.jpeg?auto=compress&cs=tinysrgb&w=1000&h=700&fit=crop", imgAlt: "Unbranded white ingredient container beside loose powder and a scoop", size: "large" },
  { num: "03", tag: "Pellets", name: "Pellets & MUPS", desc: "Pellet and MUPS ingredient formats for multi-unit pellet system applications.", img: "https://images.pexels.com/photos/6086301/pexels-photo-6086301.jpeg?auto=compress&cs=tinysrgb&w=700&h=500&fit=crop", imgAlt: "Macro texture of fine white pharmaceutical granules", size: "medium" },
  { num: "04", tag: "Vitamins", name: "Vitamins & Nutraceuticals", desc: "Biotin, folic acid, methyl folate and related vitamin and nutraceutical ingredients.", img: "https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=700&h=500&fit=crop&auto=format", imgAlt: "Vitamin tablets and capsules beside an open supplement container", size: "medium" },
  { num: "05", tag: "Collagen", name: "Collagen & Peptides", desc: "Collagen types, biopeptides and elastin for supplement and healthcare formulations.", img: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=900&h=900&fit=crop&auto=format", imgAlt: "Fine white powder ingredient with a measuring scoop", size: "medium" },
  { num: "06", tag: "Omega-3", name: "Omega-3 & Oils", desc: "DHA-rich and EPA-rich omega 3 formulations supplied as supplement ingredients.", img: "https://images.pexels.com/photos/16776311/pexels-photo-16776311.jpeg?auto=compress&cs=tinysrgb&w=700&h=500&fit=crop", imgAlt: "Golden omega 3 softgel capsules on a plain surface", size: "medium" },
  { num: "07", tag: "Botanical Oil", name: "Botanical & Specialty Oils", desc: "Botanical and specialty oils supplied as dietary supplement ingredients.", img: "https://images.pexels.com/photos/6694191/pexels-photo-6694191.jpeg?auto=compress&cs=tinysrgb&w=700&h=500&fit=crop", imgAlt: "Amber botanical oil bottles surrounded by dried herbs", size: "medium" },
];

function IndustryCard({ ind, delay }: { ind: typeof industries[0]; delay: number }) {
  const [hovered, setHovered] = useState(false);
  const isLarge = ind.size === "large";

  return (
    <div
      className={`reveal reveal-delay-${delay}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
        backgroundColor: "#092A58",
        borderRadius: isLarge ? "22px" : "18px",
        minHeight: "100%",
        height: "100%",
      }}
    >
      <img
        src={ind.img}
        alt={ind.imgAlt}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          position: "absolute",
          inset: 0,
          filter: hovered ? "saturate(0.95)" : "saturate(0.72)",
          transition: "transform 0.65s cubic-bezier(0.25,0.46,0.45,0.94), filter 0.5s ease",
          transform: hovered ? "scale(1.05)" : "scale(1)",
        }}
      />
      <div style={{
        position: "absolute",
        inset: 0,
        background: hovered
          ? "linear-gradient(180deg, rgba(9,42,88,0.25) 0%, rgba(9,42,88,0.93) 100%)"
          : "linear-gradient(180deg, rgba(9,42,88,0.05) 0%, rgba(9,42,88,0.76) 100%)",
        borderRadius: "inherit",
        transition: "background 0.4s ease",
      }} />
      {/* Green hairline grows on hover */}
      <div style={{
        position: "absolute",
        left: 0,
        bottom: 0,
        height: "3px",
        width: hovered ? "100%" : "0%",
        backgroundColor: "#71B72B",
        transition: "width 0.5s cubic-bezier(0.25,0.46,0.45,0.94)",
      }} />

      <div style={{ position: "absolute", inset: 0, padding: isLarge ? "28px" : "22px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div style={{
          alignSelf: "flex-end",
          fontFamily: "Inter, sans-serif",
          fontSize: "9px",
          fontWeight: 600,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.85)",
          backgroundColor: "rgba(9,42,88,0.5)",
          border: "1px solid rgba(255,255,255,0.1)",
          padding: "6px 11px",
          borderRadius: "999px",
          backdropFilter: "blur(8px)",
        }}><span style={{ color: "#71B72B" }}>{ind.num}</span> / {ind.tag}</div>

        <div>
          <h3 style={{
            fontFamily: "Manrope, sans-serif",
            fontSize: isLarge ? "24px" : "18px",
            fontWeight: 700,
            color: "#ffffff",
            marginBottom: "6px",
            letterSpacing: "-0.01em",
          }}>{ind.name}</h3>
          <p style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "13px",
            color: "rgba(255,255,255,0.66)",
            lineHeight: 1.5,
            maxWidth: "320px",
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 0.35s ease, transform 0.35s ease",
          }}>{ind.desc}</p>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginTop: hovered ? "12px" : "0",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.3s ease 0.05s, margin-top 0.35s ease",
          }}>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#ffffff" }}>View Category</span>
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none" style={{ transition: "transform 0.2s", transform: hovered ? "translateX(3px)" : "translateX(0)" }}>
              <path d="M8 1l3 3-3 3M1 4h10" stroke="#71B72B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Industries() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.querySelectorAll(".reveal").forEach((el) => el.classList.add("visible"));
        });
      },
      { threshold: 0.08 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const delays = [1, 2, 1, 2, 3, 2, 3];

  return (
    <section id="business-areas" ref={ref} className="pc-section" style={{ backgroundColor: "#092A58", padding: "112px 60px" }}>
      <div style={{ maxWidth: "1440px", margin: "0 auto" }}>
        <div className="pc-split" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "end", marginBottom: "56px" }}>
          <div>
            <div className="reveal" style={{ marginBottom: "18px" }}>
              <span className="section-label">CM / 03 — BUSINESS AREAS</span>
            </div>
            <h2 className="reveal reveal-delay-1" style={{
              fontFamily: "Manrope, sans-serif",
              fontSize: "clamp(34px, 4vw, 52px)",
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              color: "#ffffff",
            }}>
              Our Business<br />Areas.
            </h2>
          </div>
          <div className="pc-align-start" style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "18px" }}>
            <p className="reveal reveal-delay-2 pc-align-start" style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "15px",
              lineHeight: 1.65,
              color: "rgba(255,255,255,0.5)",
              textAlign: "right",
              maxWidth: "400px",
            }}>
              Pharmaceutical and nutraceutical ingredient categories handled through sourcing, supplier representation and import support.
            </p>
            <a className="ui-button reveal reveal-delay-3" href="#apis" style={{
              fontFamily: "Manrope, sans-serif",
              fontWeight: 600,
              fontSize: "12px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#ffffff",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "11px 18px",
              border: "1px solid rgba(255,255,255,0.16)",
              transition: "border-color 0.2s, gap 0.2s, background-color 0.2s",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#71B72B"; e.currentTarget.style.backgroundColor = "rgba(113,183,43,0.1)"; e.currentTarget.style.gap = "12px"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.16)"; e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.gap = "8px"; }}
            >
              Explore the Portfolio
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                <path d="M8 1l3 3-3 3M1 4h10" stroke="#71B72B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Asymmetric mosaic — one slot per application */}
        <div className="industries-grid">
          {industries.map((ind, i) => (
            <div key={ind.num} className={`industry-slot-0${i + 1}`}>
              <IndustryCard ind={ind} delay={delays[i]} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
