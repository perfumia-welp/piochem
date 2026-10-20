import { useEffect, useRef, useState } from "react";

type Product = {
  code: string;
  label: string;
  name: string;
  offering: string;
  format?: string;
  img: string;
  imgAlt: string;
  related: string[];
};

// Product names are taken from the client's supplied brochure.
// No formula, CAS or purity figures are shown — the client data does not
// cover them, and documentation availability varies by product and supplier.
const products: Product[] = [
  {
    code: "API",
    label: "APIs",
    name: "Semaglutide",
    offering: "Active pharmaceutical ingredient",
    img: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=900&h=800&fit=crop&auto=format",
    imgAlt: "Fine white pharmaceutical raw material with a measuring scoop",
    related: [
      "Levomefolate Calcium",
      "Silver Sulfadiazine",
      "Selenium Sulfide",
      "Minoxidil",
      "Allopurinol",
      "Solifenacin",
      "Vildagliptin",
      "Nebivolol",
      "Nifedipine",
      "Clopidogrel Bisulphate",
      "Fluconazole",
      "Mupirocin Base",
      "Mupirocin HCL",
      "Daptomycin",
      "Liraglutide",
      "Hydrocortisone Base",
      "Hydrocortisone Acetate",
      "Spironolactone",
      "Prednisolone Base",
      "Sugammadex Sodium",
      "Tolvaptan",
      "Bismuth Salts",
    ],
  },
  {
    code: "DS",
    label: "Dietary Supplements",
    name: "Omega 3",
    offering: "Dietary supplement ingredient",
    format: "DHA-rich and EPA-rich formulations",
    img: "https://images.pexels.com/photos/16776311/pexels-photo-16776311.jpeg?auto=compress&cs=tinysrgb&w=900&h=800&fit=crop",
    imgAlt: "Golden omega 3 softgel capsules on a plain surface",
    related: [
      "DHA-rich formulations",
      "EPA-rich formulations",
      "Biotin",
      "Folic Acid",
      "Methyl Folate / Active Folic Acid",
      "Yucca Plus",
    ],
  },
  {
    code: "PEL",
    label: "Pellets & MUPS",
    name: "Esomeprazole MUPS",
    offering: "Pharmaceutical pellet ingredient",
    format: "Multi-unit pellet system",
    img: "https://images.pexels.com/photos/6086301/pexels-photo-6086301.jpeg?auto=compress&cs=tinysrgb&w=900&h=800&fit=crop",
    imgAlt: "Macro texture of fine pharmaceutical granules",
    related: [
      "Dexlansoprazole Pellets",
      "Esomeprazole Pellets",
      "Linaclotide Pellets",
    ],
  },
  {
    code: "VIT",
    label: "Vitamins",
    name: "Biotin",
    offering: "Vitamin & nutraceutical ingredient",
    img: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=900&h=800&fit=crop&auto=format",
    imgAlt: "Assorted vitamin tablets and capsules",
    related: [
      "Folic Acid",
      "Methyl Folate / Active Folic Acid",
    ],
  },
  {
    code: "COL",
    label: "Collagen & Peptides",
    name: "Caviar Collagen Type II",
    offering: "Collagen & peptide ingredient",
    img: "https://images.pexels.com/photos/13779103/pexels-photo-13779103.jpeg?auto=compress&cs=tinysrgb&w=900&h=800&fit=crop",
    imgAlt: "Unbranded white ingredient container beside loose powder and a scoop",
    related: [
      "Hydrolyzed Chicken Collagen Type II",
      "UC Collagen Type II",
      "Biopeptides",
      "Elastin",
    ],
  },
  {
    code: "OIL",
    label: "Botanical & Specialty Oils",
    name: "Black Seed Oil",
    offering: "Botanical oil ingredient",
    img: "https://images.pexels.com/photos/6694191/pexels-photo-6694191.jpeg?auto=compress&cs=tinysrgb&w=900&h=800&fit=crop",
    imgAlt: "Amber botanical oil bottles surrounded by dried herbs",
    related: [
      "Coconut Oil",
      "Jojoba Oil",
      "Sesame Oil",
      "Flaxseed Oil",
      "Olive Oil",
      "Almond Oil",
      "Pumpkin Seed Oil",
      "Peanut Oil",
    ],
  },
];

const Arrow = ({ color = "currentColor" }: { color?: string }) => (
  <svg width="12" height="8" viewBox="0 0 12 8" fill="none"><path d="M8 1l3 3-3 3M1 4h10" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

export default function Products() {
  const [active, setActive] = useState(0);
  const [displayed, setDisplayed] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const switchCategory = (idx: number) => {
    if (idx === active) return;
    setActive(idx);
    setTransitioning(true);
    setTimeout(() => {
      setDisplayed(idx);
      setTransitioning(false);
    }, 260);
  };

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

  const product = products[displayed];
  const specs = [
    { label: "Category", value: product.label },
    { label: "Offering", value: product.offering },
    { label: "Format", value: product.format },
    { label: "Sourcing", value: "Represented & partner suppliers" },
    { label: "Documentation", value: "Availability depends on product and supplier" },
  ].filter((s): s is { label: string; value: string } => Boolean(s.value));

  return (
    <section id="apis" ref={ref} className="pc-section" style={{ backgroundColor: "#F6F8F6", padding: "112px 60px" }}>
      <div style={{ maxWidth: "1440px", margin: "0 auto" }}>
        <div className="pc-split" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "end", marginBottom: "56px" }}>
          <div>
            <div className="reveal" style={{ marginBottom: "14px" }}>
              <span className="section-label">CM / 05 — PORTFOLIO</span>
            </div>
            <h2 className="reveal reveal-delay-1" style={{
              fontFamily: "Manrope, sans-serif",
              fontSize: "clamp(34px, 4vw, 52px)",
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              color: "#092A58",
            }}>
              Explore Our<br />Ingredient Portfolio.
            </h2>
          </div>
          <p className="reveal reveal-delay-2 pc-justify-start" style={{ fontFamily: "Inter, sans-serif", fontSize: "15px", lineHeight: 1.7, color: "#75808C", maxWidth: "420px", justifySelf: "end" }}>
            Representative ingredients across our API, dietary supplement, pellet, vitamin, collagen and botanical oil categories.
          </p>
        </div>

        <div className="reveal reveal-delay-2 pc-split" style={{ display: "grid", gridTemplateColumns: "236px 1fr", gap: "40px", alignItems: "start" }}>
          {/* Category nav */}
          <div className="product-cats" role="tablist" aria-label="Ingredient categories">
            {products.map((p, i) => {
              const on = active === i;
              return (
                <button
                  key={p.code}
                  role="tab"
                  aria-selected={on}
                  onClick={() => switchCategory(i)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "13px",
                    fontWeight: on ? 600 : 500,
                    padding: "12px 16px",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    color: on ? "#092A58" : "rgba(9,42,88,0.5)",
                    borderLeft: `2px solid ${on ? "#71B72B" : "rgba(9,42,88,0.08)"}`,
                    borderRadius: "0 12px 12px 0",
                    backgroundColor: on ? "#ffffff" : "transparent",
                    boxShadow: on ? "0 4px 16px rgba(9,42,88,0.05)" : "none",
                    transition: "all 0.2s",
                  }}
                >
                  <span style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.12em", color: on ? "#71B72B" : "rgba(9,42,88,0.3)", minWidth: "26px" }}>{p.code}</span>
                  {p.label}
                </button>
              );
            })}
          </div>

          {/* Technical showcase */}
          <div style={{
            minWidth: 0,
            opacity: transitioning ? 0 : 1,
            transform: transitioning ? "translateY(10px)" : "translateY(0)",
            transition: "opacity 0.26s ease, transform 0.26s ease",
          }}>
            <div className="product-feature">
              <div className="product-media">
                <img
                  src={product.img}
                  alt={product.imgAlt}
                  style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0, opacity: 0.62, filter: "saturate(0.75)" }}
                />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(150deg, rgba(9,42,88,0.55) 0%, rgba(9,42,88,0.15) 60%, rgba(9,42,88,0.6) 100%)" }} />

                {/* Periodic-style family tile */}
                <div style={{
                  position: "absolute",
                  top: "24px",
                  left: "24px",
                  width: "112px",
                  height: "124px",
                  borderRadius: "14px",
                  backgroundColor: "rgba(255,255,255,0.94)",
                  padding: "12px 14px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: "0 12px 30px rgba(9,42,88,0.25)",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "Inter, sans-serif", fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em", color: "#75808C" }}>
                    <span>0{displayed + 1}</span><span style={{ color: "#71B72B" }}>●</span>
                  </div>
                  <div style={{ fontFamily: "Manrope, sans-serif", fontSize: "34px", fontWeight: 800, letterSpacing: "-0.04em", color: "#092A58", lineHeight: 1 }}>{product.code}</div>
                  <div style={{ fontFamily: "Inter, sans-serif", fontSize: "8.5px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#75808C", lineHeight: 1.2 }}>{product.label}</div>
                </div>

                <div style={{ position: "absolute", bottom: "24px", left: "24px", display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: "rgba(9,42,88,0.66)", backdropFilter: "blur(8px)", borderRadius: "999px", padding: "7px 14px", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#71B72B" }} />
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.88)" }}>{product.related.length + 1} ingredients listed</span>
                </div>
              </div>

              {/* Spec sheet */}
              <div className="pc-card-pad" style={{ padding: "40px 40px 36px", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "28px" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", marginBottom: "14px" }}>
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "#71B72B" }}>{product.label}</p>
                    <span style={{ fontFamily: "Inter, sans-serif", fontSize: "9px", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "#75808C" }}>Ingredient</span>
                  </div>
                  <h3 style={{ fontFamily: "Manrope, sans-serif", fontSize: "clamp(24px, 2.2vw, 30px)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.15, color: "#092A58", marginBottom: "24px" }}>{product.name}</h3>

                  <dl style={{ margin: 0, borderTop: "1px solid rgba(9,42,88,0.1)" }}>
                    {specs.map((s) => (
                      <div key={s.label} style={{ display: "grid", gridTemplateColumns: "110px 1fr", gap: "16px", padding: "13px 0", borderBottom: "1px solid rgba(9,42,88,0.07)", alignItems: "baseline" }}>
                        <dt style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#75808C" }}>{s.label}</dt>
                        <dd style={{ margin: 0, fontFamily: "Inter, sans-serif", fontSize: "14px", fontWeight: 500, color: "#092A58", fontVariantNumeric: "tabular-nums" }}>{s.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <a className="ui-button" href="#rfq" style={{
                    fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: "12px", letterSpacing: "0.08em", textTransform: "uppercase",
                    color: "#092A58", backgroundColor: "#71B72B", padding: "13px 22px", textDecoration: "none",
                    display: "inline-flex", alignItems: "center", gap: "8px", transition: "background-color 0.2s, transform 0.2s",
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#5F9E22"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#71B72B"; e.currentTarget.style.transform = "translateY(0)"; }}
                  >
                    Request Details
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 8L8 2M8 2H3M8 2V7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </a>
                  <a className="ui-button" href="#resources" style={{
                    fontFamily: "Manrope, sans-serif", fontWeight: 600, fontSize: "12px", letterSpacing: "0.08em", textTransform: "uppercase",
                    color: "#092A58", border: "1px solid rgba(9,42,88,0.16)", padding: "12px 22px", textDecoration: "none",
                    display: "inline-flex", alignItems: "center", gap: "8px", transition: "border-color 0.2s, color 0.2s",
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#71B72B"; e.currentTarget.style.color = "#71B72B"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(9,42,88,0.16)"; e.currentTarget.style.color = "#092A58"; }}
                  >
                    Request Documents
                  </a>
                </div>
              </div>
            </div>

            {/* Related products */}
            <div className="pc-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "12px" }}>
              {product.related.map((name) => (
                <a key={name} href="#rfq" style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "12px",
                  padding: "18px 20px",
                  backgroundColor: "#ffffff",
                  borderRadius: "14px",
                  border: "1px solid rgba(9,42,88,0.06)",
                  textDecoration: "none",
                  transition: "box-shadow 0.2s, transform 0.2s, border-color 0.2s",
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 6px 22px rgba(9,42,88,0.06)"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = "rgba(113,183,43,0.25)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "rgba(9,42,88,0.06)"; }}
                >
                  <span>
                    <span style={{ display: "block", fontFamily: "Inter, sans-serif", fontSize: "9px", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#75808C", marginBottom: "4px" }}>{product.code} · Portfolio</span>
                    <span style={{ display: "block", fontFamily: "Manrope, sans-serif", fontSize: "14px", fontWeight: 700, color: "#092A58" }}>{name}</span>
                  </span>
                  <Arrow color="#71B72B" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
