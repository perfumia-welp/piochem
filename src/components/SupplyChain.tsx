import { useEffect, useRef, useState } from "react";

const steps = [
  {
    num: "01",
    title: "CUSTOMER REQUIREMENT",
    sub: "Enquiry",
    detail: "The customer shares the ingredient, specification, quantity and intended application.",
    tags: ["Ingredient", "Specification", "Quantity"],
  },
  {
    num: "02",
    title: "INGREDIENT REVIEW",
    sub: "Assessment",
    detail: "The requirement is reviewed against our represented portfolio and sourcing network.",
    tags: ["Portfolio Check", "Sourcing Options"],
  },
  {
    num: "03",
    title: "SUPPLIER COORDINATION",
    sub: "Sourcing",
    detail: "We coordinate with the relevant supplier in India, China or Europe.",
    tags: ["India", "China", "Europe"],
  },
  {
    num: "04",
    title: "REGULATORY / IMPORT FILE",
    sub: "Registration",
    detail: "The requirement is matched to the appropriate importing registration file.",
    tags: ["Listed", "Non-Listed"],
  },
  {
    num: "05",
    title: "COMMERCIAL OFFER",
    sub: "Quotation",
    detail: "A commercial offer is prepared against the reviewed requirement.",
    tags: ["Offer", "Terms"],
  },
  {
    num: "06",
    title: "IMPORT PROCESS",
    sub: "Import",
    detail: "Importing is handled through the company's registered files.",
    tags: ["Import Handling", "Documentation"],
  },
  {
    num: "07",
    title: "CUSTOMER SUPPLY",
    sub: "Delivery",
    detail: "The ingredient is supplied to the customer with ongoing business support.",
    tags: ["Supply", "Ongoing Support"],
  },
];

const Hex = ({ on }: { on: boolean }) => (
  <svg width="46" height="46" viewBox="0 0 46 46" style={{ position: "absolute", inset: 0 }} aria-hidden>
    <polygon
      points="23,2 41.2,12.5 41.2,33.5 23,44 4.8,33.5 4.8,12.5"
      fill={on ? "rgba(113,183,43,0.08)" : "#ffffff"}
      stroke={on ? "#71B72B" : "rgba(9,42,88,0.14)"}
      strokeWidth="1.5"
      style={{ transition: "fill 0.4s, stroke 0.4s" }}
    />
  </svg>
);

export default function SupplyChain() {
  const ref = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopAuto = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.querySelectorAll(".reveal").forEach((el) => el.classList.add("visible"));
          // Run the progress animation once, then stop observing
          observer.disconnect();
          stopAuto();
          let step = 0;
          intervalRef.current = setInterval(() => {
            if (step < steps.length - 1) {
              step++;
              setActiveStep(step);
            } else {
              stopAuto();
            }
          }, 600);
        });
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      observer.disconnect();
      stopAuto();
    };
  }, []);

  const progress = (activeStep / (steps.length - 1)) * 100;

  return (
    <section id="import" ref={ref} className="pc-section" style={{ backgroundColor: "#ffffff", padding: "112px 80px", position: "relative", overflow: "hidden" }}>
      <div style={{ maxWidth: "1440px", margin: "0 auto" }}>
        <div className="reveal" style={{ marginBottom: "16px" }}>
          <span className="section-label">CM / 09 — IMPORT SERVICES</span>
        </div>
        <div className="pc-split" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "start", marginBottom: "72px" }}>
          <h2 className="reveal reveal-delay-1" style={{
            fontFamily: "Manrope, sans-serif",
            fontSize: "clamp(34px, 4vw, 52px)",
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            color: "#092A58",
          }}>
            Importing Support for<br />Listed &amp; Non-Listed Ingredients.
          </h2>
          <p className="reveal reveal-delay-2" style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "15px",
            lineHeight: 1.7,
            color: "#75808C",
            alignSelf: "center",
          }}>
            Chemical Maker offers importing services through its registered files with EDA and NAFSA for relevant ingredient requirements.
          </p>
        </div>

        <div className="reveal reveal-delay-2" style={{ position: "relative" }}>
          <div style={{ overflowX: "auto", margin: "0 -8px", padding: "0 8px 8px" }}>
            <div style={{
              position: "relative",
              display: "grid",
              gridTemplateColumns: `repeat(${steps.length}, minmax(120px, 1fr))`,
              minWidth: "860px",
            }}>
              {/* Track spans node centres: half a column in from each edge */}
              <div style={{ position: "absolute", top: "23px", left: `${50 / steps.length}%`, right: `${50 / steps.length}%`, height: "1px", backgroundColor: "rgba(9,42,88,0.1)" }}>
                <div style={{
                  height: "2px",
                  marginTop: "-0.5px",
                  width: `${progress}%`,
                  backgroundColor: "#71B72B",
                  transition: "width 0.5s ease",
                  boxShadow: "0 0 10px rgba(113,183,43,0.35)",
                }} />
              </div>

              {steps.map((step, i) => {
                const on = i <= activeStep;
                return (
                  <button
                    key={step.num}
                    onClick={() => { stopAuto(); setActiveStep(i); }}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      cursor: "pointer",
                      padding: "0 6px",
                      background: "none",
                      border: "none",
                    }}
                  >
                    <div style={{ position: "relative", width: "46px", height: "46px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "18px", zIndex: 1 }}>
                      <Hex on={on} />
                      <span style={{
                        position: "relative",
                        fontFamily: "Inter, sans-serif",
                        fontSize: "10px",
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        color: on ? "#71B72B" : "rgba(9,42,88,0.3)",
                        transition: "color 0.4s",
                      }}>{step.num}</span>
                    </div>
                    <h4 style={{
                      fontFamily: "Manrope, sans-serif",
                      fontSize: "11px",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textAlign: "center",
                      color: on ? "#092A58" : "rgba(9,42,88,0.3)",
                      marginBottom: "4px",
                      transition: "color 0.4s",
                    }}>{step.title}</h4>
                    <p style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "10px",
                      color: on ? "#71B72B" : "rgba(117,128,140,0.5)",
                      letterSpacing: "0.06em",
                      transition: "color 0.4s",
                    }}>{step.sub}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active step detail panel */}
          <div className="pc-split" style={{
            marginTop: "44px",
            padding: "32px 40px",
            backgroundColor: "#F6F8F6",
            border: "1px solid rgba(9,42,88,0.06)",
            borderRadius: "16px",
            display: "grid",
            gridTemplateColumns: "1fr auto",
            alignItems: "center",
            gap: "32px",
          }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px", flexWrap: "wrap" }}>
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", color: "#71B72B" }}>STEP {steps[activeStep].num}</span>
                <div style={{ width: "24px", height: "1px", backgroundColor: "rgba(113,183,43,0.4)" }} />
                <span style={{ fontFamily: "Manrope, sans-serif", fontSize: "14px", fontWeight: 700, letterSpacing: "0.06em", color: "#092A58" }}>{steps[activeStep].title}</span>
              </div>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#75808C", lineHeight: 1.6 }}>{steps[activeStep].detail}</p>
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {steps[activeStep].tags.map((tag) => (
                <span key={tag} style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "10px",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  padding: "6px 12px",
                  borderRadius: "999px",
                  border: "1px solid rgba(9,42,88,0.1)",
                  color: "#092A58",
                  backgroundColor: "#ffffff",
                }}>{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
