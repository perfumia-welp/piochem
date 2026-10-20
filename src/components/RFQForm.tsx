import { useEffect, useRef, useState } from "react";
import { BrandLock } from "./BrandLogo";

const steps = ["Ingredient", "Requirement", "Company"];

const labelStyle: React.CSSProperties = { fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "#75808C" };

const inputStyle = (focused: boolean): React.CSSProperties => ({
  width: "100%",
  padding: "13px 16px",
  backgroundColor: focused ? "#ffffff" : "#FAFCF7",
  border: `1px solid ${focused ? "#71B72B" : "rgba(9,42,88,0.1)"}`,
  boxShadow: focused ? "0 0 0 3px rgba(113,183,43,0.1)" : "none",
  color: "#092A58",
  fontFamily: "Inter, sans-serif",
  fontSize: "14px",
  outline: "none",
  borderRadius: "12px",
  transition: "border-color 0.2s, box-shadow 0.2s, background-color 0.2s",
});

function FormInput({ label, type = "text", placeholder }: { label: string; type?: string; placeholder?: string }) {
  const [focused, setFocused] = useState(false);
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
      <span style={labelStyle}>{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        style={inputStyle(focused)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </label>
  );
}

function FormSelect({ label, options }: { label: string; options: string[] }) {
  const [focused, setFocused] = useState(false);
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: "7px", position: "relative" }}>
      <span style={labelStyle}>{label}</span>
      <select
        style={{ ...inputStyle(focused), cursor: "pointer", appearance: "none", paddingRight: "40px" }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      >
        <option value="">Select...</option>
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
      <svg width="10" height="6" viewBox="0 0 10 6" fill="none" style={{ position: "absolute", right: "16px", bottom: "20px", pointerEvents: "none" }}><path d="M1 1l4 4 4-4" stroke="#75808C" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </label>
  );
}

function FormTextarea({ label, placeholder, rows = 4 }: { label: string; placeholder?: string; rows?: number }) {
  const [focused, setFocused] = useState(false);
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
      <span style={labelStyle}>{label}</span>
      <textarea
        placeholder={placeholder}
        rows={rows}
        style={{ ...inputStyle(focused), resize: "vertical", minHeight: `${rows * 24}px` }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </label>
  );
}

const primaryBtn: React.CSSProperties = {
  fontFamily: "Manrope, sans-serif",
  fontWeight: 700,
  fontSize: "12px",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "#092A58",
  backgroundColor: "#71B72B",
  padding: "14px 28px",
  border: "none",
  cursor: "pointer",
  transition: "background-color 0.2s",
};

export default function RFQForm() {
  const ref = useRef<HTMLDivElement>(null);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.querySelectorAll(".reveal").forEach((el) => el.classList.add("visible"));
        });
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="rfq" ref={ref} className="pc-section" style={{ backgroundColor: "#F6F8F6", padding: "112px 80px" }}>
      <div style={{ maxWidth: "1440px", margin: "0 auto" }}>
        <div className="reveal" style={{ marginBottom: "16px" }}>
          <span className="section-label">CM / 13 — REQUEST AN INQUIRY</span>
        </div>
        <h2 className="reveal reveal-delay-1" style={{
          fontFamily: "Manrope, sans-serif",
          fontSize: "clamp(34px, 4vw, 52px)",
          fontWeight: 800,
          lineHeight: 1.05,
          letterSpacing: "-0.03em",
          color: "#092A58",
          marginBottom: "56px",
        }}>
          Tell Us Which Ingredient You Need.
        </h2>

        <div className="pc-split" style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "48px", alignItems: "start" }}>
          {/* Form */}
          <div className="reveal reveal-delay-2 pc-card-pad" style={{
            backgroundColor: "#ffffff",
            borderRadius: "22px",
            padding: "48px",
            border: "1px solid rgba(9,42,88,0.06)",
            minWidth: 0,
          }}>
            {/* Step indicator */}
            <div style={{ display: "flex", marginBottom: "36px", borderBottom: "1px solid rgba(9,42,88,0.08)", overflowX: "auto" }}>
              {steps.map((step, i) => (
                <button
                  key={step}
                  onClick={() => setCurrentStep(i)}
                  style={{
                    padding: "12px 22px 12px 0",
                    marginRight: "22px",
                    border: "none",
                    backgroundColor: "transparent",
                    cursor: "pointer",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: currentStep === i ? "#092A58" : "rgba(9,42,88,0.35)",
                    borderBottom: currentStep === i ? "2px solid #71B72B" : "2px solid transparent",
                    marginBottom: "-1px",
                    transition: "color 0.2s",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    whiteSpace: "nowrap",
                  }}
                >
                  <span style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "6px",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "9px",
                    fontWeight: 700,
                    color: currentStep === i ? "#ffffff" : "rgba(9,42,88,0.4)",
                    backgroundColor: currentStep === i ? "#71B72B" : "rgba(9,42,88,0.06)",
                    transition: "all 0.2s",
                  }}>{i + 1}</span>
                  {step}
                </button>
              ))}
            </div>

            {currentStep === 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <FormInput label="Ingredient Name" placeholder="e.g. Esomeprazole Pellets" />
                <FormSelect
                  label="API / Supplement"
                  options={["API", "Dietary Supplement", "Pellets & MUPS", "Vitamins", "Collagen & Peptides", "Botanical Oils", "Not sure, please advise"]}
                />
                <FormInput label="Required Grade / Specification" placeholder="e.g. pharmacopoeial standard or in-house spec" />
              </div>
            )}

            {currentStep === 1 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <FormInput label="Required Quantity" placeholder="e.g. quantity required" />
                <FormInput label="Manufacturer Preference" placeholder="Preferred manufacturer, if any" />
                <div>
                  <span style={{ ...labelStyle, display: "block", marginBottom: "7px" }}>Upload Specification</span>
                  <div style={{
                    border: "1px dashed rgba(9,42,88,0.16)",
                    borderRadius: "12px",
                    padding: "26px",
                    textAlign: "center",
                    cursor: "pointer",
                    backgroundColor: "#FAFCF7",
                    transition: "border-color 0.2s, background-color 0.2s",
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#71B72B"; e.currentTarget.style.backgroundColor = "#F1F7EA"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(9,42,88,0.16)"; e.currentTarget.style.backgroundColor = "#FAFCF7"; }}
                  >
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#092A58", fontWeight: 500 }}>Drop file here or <span style={{ color: "#71B72B" }}>browse</span></p>
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#75808C", marginTop: "4px" }}>PDF, DOCX, XLSX accepted</p>
                  </div>
                </div>
                <FormTextarea label="Notes" placeholder="Anything else our team should know..." rows={3} />
              </div>
            )}

            {currentStep === 2 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div className="pc-grid-2-sm" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <FormInput label="Full Name" placeholder="Your name" />
                  <FormInput label="Company" placeholder="Company or institution" />
                </div>
                <div className="pc-grid-2-sm" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <FormInput label="Country" placeholder="Country" />
                  <FormInput label="Business Email" type="email" placeholder="name@company.com" />
                </div>
                <FormInput label="Phone" type="tel" placeholder="+20 000 000 0000" />
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "36px", gap: "16px" }}>
              {currentStep > 0 ? (
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "#75808C",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  ← Back
                </button>
              ) : <span style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#75808C" }}>Step 1 of 3</span>}

              <button
                className="ui-button"
                onClick={currentStep < 2 ? () => setCurrentStep(currentStep + 1) : undefined}
                style={primaryBtn}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#5F9E22")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#71B72B")}
              >
                {currentStep < 2 ? "Continue →" : "Submit Ingredient Inquiry"}
              </button>
            </div>
          </div>

          {/* Side panel */}
          <div className="reveal reveal-delay-3 pc-static pc-card-pad" style={{
            backgroundColor: "#092A58",
            padding: "40px",
            borderRadius: "22px",
            position: "sticky",
            top: "88px",
          }}>
            <div style={{ marginBottom: "28px", paddingBottom: "24px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                <BrandLock size={26} wordSize={13} />
              </div>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.5)", letterSpacing: "0.04em" }}>API • Dietary Supplements • International Sourcing</p>
            </div>

            {[
              { label: "EMAIL", value: "info@chemicalmaker.com", href: "mailto:info@chemicalmaker.com" },
              { label: "PHONE", value: "+20 120 570 0001", href: "tel:+201205700001" },
              { label: "COMPANY", value: "Smart for Import & Export · Established 2009" },
              { label: "OFFICE", value: "Egypt" },
            ].map(({ label, value, href }) => (
              <div key={label} style={{ marginBottom: "20px" }}>
                <div style={{ fontFamily: "Inter, sans-serif", fontSize: "9px", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#71B72B", marginBottom: "5px" }}>{label}</div>
                {href
                  ? <a href={href} style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.85)", textDecoration: "none" }}>{value}</a>
                  : <div style={{ fontFamily: "Inter, sans-serif", fontSize: "13.5px", lineHeight: 1.55, color: "rgba(255,255,255,0.7)" }}>{value}</div>}
              </div>
            ))}

            <div style={{ marginTop: "28px", paddingTop: "24px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", lineHeight: 1.6, color: "rgba(255,255,255,0.45)" }}>
Including the specification, quantity and intended application helps our team review your requirement across our represented and sourcing network.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
