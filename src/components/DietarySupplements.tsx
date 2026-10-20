import { useEffect, useRef, useState } from "react";

/* Categories are taken verbatim from the client's supplied brochure.
   Presented strictly as ingredient offerings — no therapeutic or medical
   claims are made about any item here. */
const groups = [
  {
    code: "VIT",
    title: "Biotin & Vitamins",
    items: ["Biotin", "Folic Acid", "Methyl Folate / Active Folic Acid"],
    img: "https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=800&h=600&fit=crop&auto=format",
    imgAlt: "Vitamin tablets and capsules beside an open supplement bottle",
  },
  {
    code: "OM3",
    title: "Omega 3",
    items: ["DHA-rich formulations", "EPA-rich formulations"],
    img: "https://images.pexels.com/photos/16776311/pexels-photo-16776311.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
    imgAlt: "Golden omega 3 softgel capsules on a plain surface",
  },
  {
    code: "COL",
    title: "Collagen & Peptides",
    items: [
      "Caviar Collagen Type II",
      "Hydrolyzed Chicken Collagen Type II",
      "UC Collagen Type II",
      "Biopeptides",
      "Elastin",
    ],
    img: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800&h=600&fit=crop&auto=format",
    imgAlt: "Fine white collagen powder with a measuring scoop",
  },
  {
    code: "OIL",
    title: "Botanical & Specialty Oils",
    items: [
      "Coconut Oil",
      "Jojoba Oil",
      "Black Seed Oil",
      "Sesame Oil",
      "Flaxseed Oil",
      "Olive Oil",
      "Almond Oil",
      "Pumpkin Seed Oil",
      "Peanut Oil",
      "Yucca Plus",
    ],
    img: "https://images.pexels.com/photos/6694191/pexels-photo-6694191.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
    imgAlt: "Amber botanical oil bottles surrounded by dried herbs",
  },
];

export default function DietarySupplements() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

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

  const group = groups[active];

  return (
    <section
      id="supplements"
      ref={ref}
      className="pc-section"
      style={{ backgroundColor: "#F1F7EA", padding: "112px 60px" }}
    >
      <div style={{ maxWidth: "1440px", margin: "0 auto" }}>
        <div
          className="pc-split"
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "end", marginBottom: "52px" }}
        >
          <div>
            <div className="reveal" style={{ marginBottom: "16px" }}>
              <span className="section-label">CM / 07 — DIETARY SUPPLEMENTS</span>
            </div>
            <h2
              className="reveal reveal-delay-1"
              style={{
                fontFamily: "Manrope, sans-serif",
                fontSize: "clamp(34px, 4vw, 52px)",
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                color: "#092A58",
              }}
            >
              Ingredients Beyond<br />Traditional APIs.
            </h2>
          </div>
          <p
            className="reveal reveal-delay-2"
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "15px",
              lineHeight: 1.7,
              color: "#75808C",
              maxWidth: "440px",
              justifySelf: "end",
            }}
          >
            Alongside active pharmaceutical ingredients, Chemical Maker supplies dietary
            supplement and botanical ingredients to nutraceutical and healthcare customers.
          </p>
        </div>

        {/* Category switcher */}
        <div
          className="reveal reveal-delay-2"
          role="tablist"
          aria-label="Dietary supplement categories"
          style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "20px" }}
        >
          {groups.map((g, i) => {
            const on = active === i;
            return (
              <button
                key={g.code}
                role="tab"
                aria-selected={on}
                onClick={() => setActive(i)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "9px",
                  padding: "11px 18px",
                  borderRadius: "999px",
                  cursor: "pointer",
                  fontFamily: "Manrope, sans-serif",
                  fontSize: "13px",
                  fontWeight: 700,
                  color: on ? "#092A58" : "rgba(9,42,88,0.55)",
                  backgroundColor: on ? "#71B72B" : "#ffffff",
                  border: `1px solid ${on ? "#71B72B" : "rgba(9,42,88,0.1)"}`,
                  transition: "background-color 0.2s, color 0.2s, border-color 0.2s",
                }}
              >
                <span
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "9px",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    color: on ? "rgba(9,42,88,0.6)" : "rgba(9,42,88,0.3)",
                  }}
                >
                  {g.code}
                </span>
                {g.title}
              </button>
            );
          })}
        </div>

        {/* Active category */}
        <div
          key={group.code}
          className="pc-split cm-supp-panel"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 0.85fr) minmax(0, 1.15fr)",
            borderRadius: "22px",
            overflow: "hidden",
            backgroundColor: "#ffffff",
            border: "1px solid rgba(9,42,88,0.07)",
            animation: "fadeUp 0.45s ease both",
          }}
        >
          <div style={{ position: "relative", minHeight: "320px", backgroundColor: "#092A58" }}>
            <img
              src={group.img}
              alt={group.imgAlt}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.82 }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(160deg, rgba(9,42,88,0.12) 0%, rgba(9,42,88,0.62) 100%)",
              }}
            />
            <div style={{ position: "absolute", left: "26px", bottom: "24px" }}>
              <div
                style={{
                  fontFamily: "Manrope, sans-serif",
                  fontSize: "clamp(22px, 2.4vw, 30px)",
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  color: "#ffffff",
                  lineHeight: 1.1,
                }}
              >
                {group.title}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "9px",
                  marginTop: "9px",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "9px",
                  fontWeight: 600,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.72)",
                }}
              >
                <span style={{ width: "16px", height: "2px", borderRadius: "2px", backgroundColor: "#71B72B" }} />
                {group.items.length} ingredient{group.items.length === 1 ? "" : "s"}
              </div>
            </div>
          </div>

          <div className="pc-card-pad" style={{ padding: "40px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "12px",
                marginBottom: "22px",
              }}
            >
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "10px",
                  fontWeight: 600,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "#71B72B",
                }}
              >
                {group.title}
              </span>
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "9px",
                  fontWeight: 600,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "#75808C",
                }}
              >
                Ingredient Offering
              </span>
            </div>

            <ul
              className="pc-grid-2-sm"
              style={{
                listStyle: "none",
                margin: 0,
                padding: 0,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0 24px",
              }}
            >
              {group.items.map((item) => (
                <li
                  key={item}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "11px",
                    padding: "13px 0",
                    borderBottom: "1px solid rgba(9,42,88,0.08)",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "14px",
                    color: "#092A58",
                  }}
                >
                  <span
                    style={{ width: "5px", height: "5px", borderRadius: "50%", backgroundColor: "#71B72B", flexShrink: 0 }}
                  />
                  {item}
                </li>
              ))}
            </ul>

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "30px", alignItems: "center" }}>
              <a
                className="ui-button"
                href="#rfq"
                style={{
                  fontFamily: "Manrope, sans-serif",
                  fontWeight: 700,
                  fontSize: "12px",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#092A58",
                  backgroundColor: "#71B72B",
                  padding: "13px 22px",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  transition: "background-color 0.2s, transform 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#5F9E22";
                  e.currentTarget.style.color = "#ffffff";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#71B72B";
                  e.currentTarget.style.color = "#092A58";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                Send an Inquiry
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                  <path d="M8 1l3 3-3 3M1 4h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#75808C" }}>
                Presented as ingredient offerings only.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
