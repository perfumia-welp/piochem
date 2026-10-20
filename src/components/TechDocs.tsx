import { useEffect, useRef, useState } from "react";

const docTabs = [
  { code: "COA", title: "Certificate of Analysis", meta: "Batch-specific · subject to availability", field: "Ingredient name", placeholder: "Enter ingredient name" },
  { code: "SDS", title: "Safety Data Sheet", meta: "Product-specific · subject to availability", field: "Ingredient name", placeholder: "Enter ingredient name" },
  { code: "SPEC", title: "Product Specification", meta: "Product-specific · subject to availability", field: "Ingredient name", placeholder: "Enter ingredient name" },
];

const documentTypes = [
  { code: "COA", title: "Certificate of Analysis" },
  { code: "SDS", title: "Safety Data Sheet" },
  { code: "SPEC", title: "Product Specification" },
  { code: "DMF", title: "Drug Master File" },
  { code: "GMP", title: "GMP Documentation" },
  { code: "REG", title: "Regulatory Documentation" },
];

const DocIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M9 13h6M9 17h4" /></svg>
);
const DownloadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v12m0 0-4-4m4 4 4-4M4 21h16" /></svg>
);

export default function TechDocs() {
  const ref = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState(0);
  const [hoveredCert, setHoveredCert] = useState<string | null>(null);

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

  const doc = docTabs[tab];

  return (
    <section id="resources" ref={ref} style={{ backgroundColor: "#F6F8F6" }}>
      <div className="pc-split" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "620px", gap: 0 }}>
        {/* Editorial side */}
        <div className="pc-section" style={{ padding: "96px 60px 96px max(60px, calc((100vw - 1440px) / 2 + 60px))", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div className="reveal" style={{ marginBottom: "16px" }}>
            <span className="section-label">CM / 10 — DOCUMENTATION</span>
          </div>
          <h2 className="reveal reveal-delay-1" style={{
            fontFamily: "Manrope, sans-serif",
            fontSize: "clamp(38px, 4.4vw, 64px)",
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: "-0.04em",
            color: "#092A58",
            marginBottom: "24px",
          }}>
            Documentation Matters<br /><span style={{ color: "#71B72B" }}>as Much as the Ingredient.</span>
          </h2>
          <p className="reveal reveal-delay-2" style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "16px",
            lineHeight: 1.7,
            color: "#75808C",
            marginBottom: "36px",
            maxWidth: "430px",
          }}>
            Documentation availability depends on product and supplier. Tell us the ingredient and we will confirm what can be provided.
          </p>
          <div className="reveal reveal-delay-3" style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
            <a className="ui-button" href="#rfq" onClick={() => setTab(0)} style={{
              display: "inline-flex", alignItems: "center", gap: "10px",
              fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase",
              color: "#092A58", backgroundColor: "#71B72B", padding: "14px 24px", textDecoration: "none",
              transition: "background-color 0.2s, transform 0.2s",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#5F9E22"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#71B72B"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              Request Product Documents
            </a>
            <a className="ui-button" href="#resources" onClick={() => setTab(1)} style={{
              display: "inline-flex", alignItems: "center",
              fontFamily: "Manrope, sans-serif", fontWeight: 600, fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase",
              color: "#092A58", border: "1px solid rgba(9,42,88,0.16)", padding: "13px 22px", textDecoration: "none",
              transition: "border-color 0.2s, color 0.2s",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#092A58"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(9,42,88,0.16)"; }}
            >
              SDS
            </a>
            <a href="#rfq" style={{
              display: "inline-flex", alignItems: "center", gap: "8px", marginLeft: "8px",
              fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase",
              color: "#092A58", textDecoration: "none", borderBottom: "1.5px solid #71B72B", paddingBottom: "2px",
            }}>
              Talk to Our Team
            </a>
          </div>
        </div>

        {/* Document center interface */}
        <div className="reveal reveal-delay-1 pc-section" style={{
          backgroundColor: "#092A58",
          padding: "64px max(60px, calc((100vw - 1440px) / 2 + 60px)) 64px 56px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{ position: "absolute", right: "-120px", top: "-120px", width: "360px", height: "360px", borderRadius: "50%", background: "rgba(113,183,43,0.12)", filter: "blur(80px)", pointerEvents: "none" }} />

          <div style={{ position: "relative", maxWidth: "560px", width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", gap: "12px" }}>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "9px", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)" }}>Document Request — Demo Interface</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontFamily: "Inter, sans-serif", fontSize: "9px", fontWeight: 600, letterSpacing: "0.16em", color: "rgba(255,255,255,0.6)" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#71B72B" }} />ONLINE
              </span>
            </div>

            {/* Tabs */}
            <div role="tablist" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "4px", padding: "4px", borderRadius: "14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)", marginBottom: "18px" }}>
              {docTabs.map((d, i) => (
                <button key={d.code} role="tab" aria-selected={tab === i} onClick={() => setTab(i)} style={{
                  padding: "11px 8px",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontFamily: "Manrope, sans-serif",
                  fontSize: "13px",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  color: tab === i ? "#092A58" : "rgba(255,255,255,0.6)",
                  background: tab === i ? "#ffffff" : "transparent",
                  transition: "background-color 0.2s, color 0.2s",
                }}>{d.code === "SPEC" ? "Specification" : d.code}</button>
              ))}
            </div>

            {/* Search row */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "18px", flexWrap: "wrap" }}>
              <label style={{ flex: "1 1 220px", display: "flex", flexDirection: "column", gap: "6px", padding: "11px 16px", borderRadius: "12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: "9px", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>{doc.field}</span>
                <input placeholder={doc.placeholder} style={{ background: "transparent", border: "none", outline: "none", color: "#ffffff", fontFamily: "Inter, sans-serif", fontSize: "14px", width: "100%" }} />
              </label>
              <button className="ui-button" style={{
                flex: "0 0 auto", padding: "0 22px", minHeight: "56px", border: "none", cursor: "pointer",
                background: "#71B72B", color: "#ffffff", fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase",
              }}>Search</button>
            </div>

            {/* Result card */}
            <div key={doc.code} style={{ borderRadius: "16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", animation: "fadeUp 0.45s ease both" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "14px", padding: "18px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(113,183,43,0.14)", color: "#71B72B", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><DocIcon /></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "Manrope, sans-serif", fontSize: "15px", fontWeight: 700, color: "#ffffff", marginBottom: "3px" }}>{doc.title}</div>
                  <div style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.45)" }}>{doc.meta}</div>
                </div>
                <span style={{ width: "36px", height: "36px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.14)", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><DownloadIcon /></span>
              </div>
              <div className="pc-grid-2-sm" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: "rgba(255,255,255,0.05)" }}>
                {[
                  { label: "Example Ingredient", value: "Esomeprazole Pellets" },
                  { label: "Category", value: "Pellets & MUPS" },
                  { label: "Availability", value: "Depends on product & supplier" },
                  { label: "Document", value: doc.code === "SPEC" ? "Specification" : doc.code },
                ].map(({ label, value }) => (
                  <div key={label} style={{ background: "#092A58", padding: "14px 20px" }}>
                    <div style={{ fontFamily: "Inter, sans-serif", fontSize: "9px", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.38)", marginBottom: "4px" }}>{label}</div>
                    <div style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.82)" }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "18px" }}>
              {["COA", "SDS", "Specification", "Regulatory"].map((d) => (
                <span key={d} style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontFamily: "Inter, sans-serif", fontSize: "11px", fontWeight: 500, color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.1)", padding: "6px 12px", borderRadius: "999px" }}>
                  <span style={{ color: "#71B72B" }}>·</span>{d}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Certifications strip */}
      <div className="techdocs-document-strip pc-section" style={{ padding: "64px 60px" }}>
        <div style={{ maxWidth: "1440px", margin: "0 auto" }}>
          <div className="reveal" style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "22px" }}>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#75808C" }}>Document Types · Availability depends on product and supplier</span>
            <div style={{ flex: 1, height: "1px", background: "rgba(9,42,88,0.1)" }} />
          </div>
          <div className="reveal reveal-delay-1 pc-grid-6" style={{ display: "grid", gridTemplateColumns: "repeat(6, minmax(0, 1fr))", gap: "12px" }}>
            {documentTypes.map((d) => {
              const on = hoveredCert === d.code;
              return (
                <div
                  key={d.code}
                  onMouseEnter={() => setHoveredCert(d.code)}
                  onMouseLeave={() => setHoveredCert(null)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                    padding: "24px 22px",
                    backgroundColor: on ? "#092A58" : "#ffffff",
                    borderRadius: "18px",
                    border: `1px solid ${on ? "#092A58" : "rgba(9,42,88,0.07)"}`,
                    transition: "background-color 0.25s, border-color 0.25s",
                  }}
                >
                  <div style={{
                    width: "52px", height: "52px", flexShrink: 0, borderRadius: "14px",
                    border: `1.5px solid ${on ? "#71B72B" : "rgba(113,183,43,0.35)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "border-color 0.25s",
                  }}>
                    <span style={{ fontFamily: "Manrope, sans-serif", fontSize: "13px", fontWeight: 800, letterSpacing: "0.04em", color: on ? "#ffffff" : "#092A58", transition: "color 0.25s" }}>{d.code}</span>
                  </div>
                  <div style={{ fontFamily: "Inter, sans-serif", fontSize: "12.5px", lineHeight: 1.45, color: on ? "rgba(255,255,255,0.72)" : "#75808C", transition: "color 0.25s" }}>{d.title}</div>
                </div>
              );
            })}
          </div>
          <p className="reveal reveal-delay-2" style={{ fontFamily: "Inter, sans-serif", fontSize: "12.5px", lineHeight: 1.6, color: "#75808C", marginTop: "20px", maxWidth: "620px" }}>
            Documentation availability depends on product and supplier.
          </p>
        </div>
      </div>
    </section>
  );
}
