import { useEffect, useRef, useState } from "react";

const caps = [
  {
    num: "01",
    title: "REPRESENT",
    desc: "International supplier representation and market development.",
    img: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=900&h=700&fit=crop&auto=format",
    imgAlt: "Pharmaceutical laboratory with analytical instrumentation",
    tag: "Supplier Representation",
  },
  {
    num: "02",
    title: "SOURCE",
    desc: "Ingredient sourcing based on customer requirements.",
    img: "https://images.unsplash.com/photo-1758426637739-fcb6eea3f4d8?w=900&h=700&fit=crop&auto=format",
    imgAlt: "Rows of vials holding different raw ingredient powders",
    tag: "Customer-Led Sourcing",
  },
  {
    num: "03",
    title: "IMPORT",
    desc: "Import support through the company's registered importing files.",
    img: "https://images.unsplash.com/photo-1578496479763-c21c718af028?w=900&h=700&fit=crop&auto=format",
    imgAlt: "Analyst reviewing documentation at a laboratory workstation",
    tag: "Registered Import Files",
  },
  {
    num: "04",
    title: "DISTRIBUTE",
    desc: "Commercial distribution and customer supply.",
    img: "https://images.unsplash.com/photo-1766297247072-93fd815afef3?w=900&h=700&fit=crop&auto=format",
    imgAlt: "Shelved laboratory glassware and containers",
    tag: "Commercial Distribution",
  },
  {
    num: "05",
    title: "SUPPORT",
    desc: "Business handling based on customer requirements.",
    img: "https://images.unsplash.com/photo-1614935151651-0bea6508db6b?w=900&h=700&fit=crop&auto=format",
    imgAlt: "Technician preparing samples in a pharmaceutical laboratory",
    tag: "Customer Support",
  },
];

export default function Capabilities() {
  const ref = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

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

  // Scroll-driven active tracking
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const i = rowRefs.current.indexOf(e.target as HTMLDivElement);
            if (i !== -1) setActiveIndex(i);
          }
        });
      },
      { threshold: 0.5, rootMargin: "-20% 0px -20% 0px" }
    );
    rowRefs.current.forEach((r) => { if (r) observer.observe(r); });
    return () => observer.disconnect();
  }, []);

  return (
    <section id="process" ref={ref} style={{ backgroundColor: "#092A58", position: "relative" }}>
      <div style={{ maxWidth: "1440px", margin: "0 auto" }}>
        <div className="pc-section" style={{ padding: "112px 60px 80px" }}>
          <div className="reveal" style={{ marginBottom: "16px" }}>
            <span className="section-label">CM / 08 — HOW WE OPERATE</span>
          </div>
          <div className="pc-split" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px" }}>
            <h2 className="reveal reveal-delay-1" style={{
              fontFamily: "Manrope, sans-serif",
              fontSize: "clamp(34px, 4vw, 52px)",
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              color: "#ffffff",
            }}>
              From Global Supplier<br /><span style={{ color: "#71B72B" }}>to Local Customer.</span>
            </h2>
            <p className="reveal reveal-delay-2" style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "15px",
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.5)",
              alignSelf: "center",
              maxWidth: "480px",
            }}>
              Chemical Maker represents international suppliers, sources to requirement, supports import, distributes commercially and handles the business around each customer.
            </p>
          </div>

          <div className="reveal reveal-delay-3" style={{ marginTop: "48px", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ height: "2px", width: "32px", borderRadius: "2px", backgroundColor: "#71B72B" }} />
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)" }}>
              REPRESENT → SOURCE → IMPORT → DISTRIBUTE → SUPPORT
            </span>
            <div className="pc-hide-mobile" style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, rgba(113,183,43,0.4), transparent)" }} />
          </div>
        </div>

        {/* Sticky layout */}
        <div className="pc-split pc-section-x" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0", padding: "0 60px 112px" }}>
          <div className="pc-hide-mobile" style={{ position: "sticky", top: "88px", height: "calc(100vh - 160px)", display: "flex", alignItems: "center" }}>
            <div style={{ position: "relative", width: "100%", height: "500px", borderRadius: "22px", overflow: "hidden", backgroundColor: "#0B3568" }}>
              {caps.map((cap, i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    inset: 0,
                    transition: "opacity 0.6s ease",
                    opacity: activeIndex === i ? 1 : 0,
                  }}
                >
                  <img
                    src={cap.img}
                    alt={cap.imgAlt}
                    style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.66, filter: "saturate(0.7)" }}
                  />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 40%, rgba(9,42,88,0.88) 100%)" }} />
                  <div style={{
                    position: "absolute",
                    top: "24px",
                    left: "24px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    backgroundColor: "rgba(9,42,88,0.66)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "999px",
                    padding: "7px 14px",
                  }}>
                    <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#71B72B" }} />
                    <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.9)" }}>{cap.tag}</span>
                  </div>
                  <div style={{ position: "absolute", left: "28px", bottom: "26px", fontFamily: "Manrope, sans-serif", fontSize: "64px", fontWeight: 800, letterSpacing: "-0.04em", color: "rgba(255,255,255,0.1)", lineHeight: 1 }}>{cap.num}</div>
                  <div style={{
                    position: "absolute",
                    bottom: "0",
                    left: "0",
                    height: "3px",
                    backgroundColor: "#71B72B",
                    width: `${((i + 1) / caps.length) * 100}%`,
                    transition: "width 0.6s ease",
                  }} />
                </div>
              ))}
            </div>
          </div>

          <div className="pc-pad-0" style={{ paddingLeft: "56px", display: "flex", flexDirection: "column" }}>
            {caps.map((cap, i) => (
              <div
                key={i}
                ref={(el) => { rowRefs.current[i] = el; }}
                style={{
                  padding: "56px 0",
                  borderBottom: i < caps.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                  transition: "opacity 0.4s",
                  opacity: activeIndex === i ? 1 : 0.35,
                }}
              >
                <img className="pc-show-mobile" src={cap.img} alt={cap.imgAlt} style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "16px", marginBottom: "24px", opacity: 0.85 }} />
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: 600, letterSpacing: "0.2em", color: activeIndex === i ? "#71B72B" : "rgba(255,255,255,0.35)", transition: "color 0.4s" }}>{cap.num}</span>
                  <div style={{ width: "24px", height: "1px", backgroundColor: activeIndex === i ? "#71B72B" : "rgba(255,255,255,0.12)", transition: "background-color 0.4s" }} />
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>{cap.tag}</span>
                </div>
                <h3 style={{
                  fontFamily: "Manrope, sans-serif",
                  fontSize: "clamp(28px, 3vw, 36px)",
                  fontWeight: 800,
                  letterSpacing: "0.04em",
                  color: activeIndex === i ? "#ffffff" : "rgba(255,255,255,0.32)",
                  marginBottom: "16px",
                  transition: "color 0.4s",
                }}>{cap.title}</h3>
                <p style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "15px",
                  lineHeight: 1.7,
                  color: activeIndex === i ? "rgba(255,255,255,0.62)" : "rgba(255,255,255,0.22)",
                  maxWidth: "400px",
                  transition: "color 0.4s",
                }}>{cap.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
