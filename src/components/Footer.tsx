import BrandLogo from "./BrandLogo";

const columns = [
  { title: "APIs", links: [["API Portfolio", "#apis"], ["Pellets & MUPS", "#apis"], ["Specialty APIs", "#apis"], ["Business Areas", "#business-areas"]] },
  { title: "Dietary Supplements", links: [["Biotin & Vitamins", "#supplements"], ["Omega 3", "#supplements"], ["Collagen & Peptides", "#supplements"], ["Botanical Oils", "#supplements"]] },
  { title: "Partners", links: [["International Partners", "#partners"], ["India", "#partners"], ["China", "#partners"], ["Europe", "#partners"]] },
  { title: "Import Services", links: [["Listed Ingredients", "#import"], ["Non-Listed Ingredients", "#import"], ["Import Process", "#import"], ["Documentation", "#resources"]] },
  { title: "Company", links: [["About Chemical Maker", "#company"], ["How We Operate", "#process"], ["Working With Us", "#company"], ["Contact", "#rfq"]] },
  { title: "Contact", links: [["Request an Inquiry", "#rfq"], ["Request Documents", "#resources"], ["Talk to Our Team", "#rfq"]] },
];

const linkColor = "rgba(255,255,255,0.55)";

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "#092A58", borderTop: "1px solid rgba(255,255,255,0.05)", overflow: "hidden" }}>
      <style>{`
        .pc-footer-grid { display: grid; grid-template-columns: 240px repeat(6, minmax(0, 1fr)); gap: 26px; margin-bottom: 64px; }
        .pc-footer-link { color: ${linkColor}; text-decoration: none; transition: color 0.2s; }
        .pc-footer-link:hover { color: #ffffff; }
        @media (max-width: 1280px) {
          .pc-footer-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
          .pc-footer-brand { grid-column: 1 / -1; }
        }
        @media (max-width: 600px) {
          .pc-footer-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 36px 20px; }
          .pc-footer-bottom { flex-direction: column; align-items: flex-start !important; gap: 14px; }
        }
      `}</style>

      <div className="pc-section" style={{ padding: "88px 60px 0", maxWidth: "1440px", margin: "0 auto" }}>
        {/* Statement wordmark */}
        <div style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", paddingBottom: "56px", marginBottom: "64px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "32px", flexWrap: "wrap" }}>
          <div>
            <p style={{
              fontFamily: "Manrope, sans-serif",
              fontSize: "clamp(34px, 7.4vw, 112px)",
              fontWeight: 800,
              letterSpacing: "-0.055em",
              lineHeight: 0.85,
              color: "#ffffff",
              userSelect: "none",
              marginBottom: "18px",
            }}>
              CHEMICAL MAKER<span style={{ color: "#71B72B" }}>.</span>
            </p>
            <p style={{
              fontFamily: "Manrope, sans-serif",
              fontSize: "clamp(14px, 1.6vw, 22px)",
              fontWeight: 700,
              letterSpacing: "0.22em",
              color: "#71B72B",
              textTransform: "uppercase",
            }}>
              API • Dietary Supplements • International Sourcing
            </p>
          </div>
          <a className="ui-button" href="#rfq" style={{
            fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase",
            color: "#092A58", backgroundColor: "#ffffff", padding: "14px 24px", textDecoration: "none", transition: "background-color 0.2s, color 0.2s",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#71B72B"; e.currentTarget.style.color = "#092A58"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#ffffff"; e.currentTarget.style.color = "#092A58"; }}
          >Request an Inquiry</a>
        </div>

        <div className="pc-footer-grid">
          <div className="pc-footer-brand">
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <BrandLogo size={28} />
              <span style={{ fontFamily: "Manrope, sans-serif", fontWeight: 800, fontSize: "13px", letterSpacing: "0.14em", color: "#ffffff" }}>CHEMICAL MAKER</span>
            </div>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, maxWidth: "260px", marginBottom: "18px" }}>
Smart for Import &amp; Export.<br />
              Pharmaceutical ingredient sourcing, marketing, distribution and import partner. Established 2009.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontFamily: "Inter, sans-serif", fontSize: "13px" }}>
              <a className="pc-footer-link" href="tel:+201205700001">+20 120 570 0001</a>
              <a className="pc-footer-link" href="mailto:info@chemicalmaker.com">info@chemicalmaker.com</a>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#ffffff",
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}><span style={{ width: "10px", height: "2px", borderRadius: "2px", background: "#71B72B" }} />{col.title}</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "11px" }}>
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    <a className="pc-footer-link" href={href} style={{ fontFamily: "Inter, sans-serif", fontSize: "13.5px" }}>{label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pc-footer-bottom" style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: "22px",
          paddingBottom: "36px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.4)", letterSpacing: "0.06em" }}>
            © 2026 CHEMICAL MAKER · SMART FOR IMPORT &amp; EXPORT · ESTABLISHED 2009
          </p>
          <div style={{ display: "flex", gap: "24px" }}>
            {["Privacy", "Terms", "Sitemap"].map((item) => (
              <a key={item} className="pc-footer-link" href="#" style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", letterSpacing: "0.04em" }}>{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
