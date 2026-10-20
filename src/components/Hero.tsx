import { useEffect, useRef, useState, useCallback } from "react";
import HexPattern from "./HexPattern";

const slides = [
  {
    label: "CHEMICAL MAKER / 01",
    eyebrow: "API • DIETARY SUPPLEMENTS • PHARMA SOURCING",
    headline: ["Pharmaceutical Ingredients.", "Sourced With Confidence."],
    accentLine: 1,
    body: "Chemical Maker connects pharmaceutical and healthcare businesses with active pharmaceutical ingredients and dietary supplement ingredients through an established international supplier network.",
    primaryCta: { label: "Explore APIs", href: "#apis" },
    secondaryCta: { label: "Send an Inquiry", href: "#rfq" },
    micro: "ACTIVE PHARMACEUTICAL INGREDIENTS • SUPPLEMENT INGREDIENTS",
    img: "https://images.unsplash.com/photo-1758426637739-fcb6eea3f4d8?w=1920&h=1200&fit=crop&auto=format",
    imgAlt: "Rows of laboratory vials holding raw pharmaceutical ingredient powders",
    nav: "Ingredients",
  },
  {
    label: "CHEMICAL MAKER / 02",
    eyebrow: "INDIA • CHINA • EUROPE",
    headline: ["Global Sources.", "Local Market Access."],
    accentLine: 1,
    body: "We act as a marketing and distribution agency for selected international pharmaceutical and ingredient suppliers, connecting their portfolios with customers in Egypt.",
    primaryCta: { label: "Our Partners", href: "#partners" },
    secondaryCta: { label: "Explore Portfolio", href: "#apis" },
    micro: "SUPPLIER REPRESENTATION • MARKETING • DISTRIBUTION",
    img: "https://images.pexels.com/photos/36765725/pexels-photo-36765725.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1200&fit=crop",
    imgAlt: "Business team reviewing supplier information together on a tablet",
    nav: "Partners",
  },
  {
    label: "CHEMICAL MAKER / 03",
    eyebrow: "IMPORT • REGISTRATION • SUPPLY",
    headline: ["Import Support", "Beyond the Catalogue."],
    accentLine: 1,
    body: "Chemical Maker supports listed and non-listed ingredient requirements through its importing registration files with the relevant Egyptian authorities.",
    primaryCta: { label: "Import Services", href: "#import" },
    secondaryCta: { label: "Discuss a Requirement", href: "#rfq" },
    micro: "LISTED & NON-LISTED INGREDIENTS • IMPORT FILES",
    img: "https://images.pexels.com/photos/8533097/pexels-photo-8533097.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1200&fit=crop",
    imgAlt: "Technical documentation being reviewed on a laboratory bench",
    nav: "Import",
  },
];

const SLIDE_DURATION = 6800;
const TRANSITION_MS = 950;
const ACCENT = "#71B72B";

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [previous, setPrevious] = useState<number | null>(null);
  const [hovered, setHovered] = useState(false);
  // Bumped on every navigation / hover-leave to restart the autoplay timer and progress bar.
  const [cycle, setCycle] = useState(0);
  const dragStartX = useRef<number | null>(null);
  const currentRef = useRef(0);

  // Commit the new slide immediately; the background crossfade is a CSS transition,
  // so a click mid-transition simply retargets it instead of being ignored.
  const goTo = useCallback((idx: number) => {
    const cur = currentRef.current;
    if (idx === cur) return;
    currentRef.current = idx;
    setPrevious(cur);
    setCurrent(idx);
    setCycle((c) => c + 1);
  }, []);

  const step = useCallback(
    (dir: 1 | -1) => goTo((currentRef.current + dir + slides.length) % slides.length),
    [goTo]
  );

  useEffect(() => {
    if (hovered) return;
    const t = setTimeout(() => step(1), SLIDE_DURATION);
    return () => clearTimeout(t);
  }, [current, cycle, hovered, step]);

  const isControl = (e: React.SyntheticEvent) => (e.target as HTMLElement).closest("button, a") !== null;

  const onDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    // Never treat a press on a control as the start of a swipe.
    if (isControl(e)) return;
    dragStartX.current = "touches" in e ? e.touches[0].clientX : e.clientX;
  };
  const onDragEnd = (e: React.MouseEvent | React.TouchEvent) => {
    if (dragStartX.current === null) return;
    const endX = "changedTouches" in e ? e.changedTouches[0].clientX : e.clientX;
    const diff = dragStartX.current - endX;
    dragStartX.current = null;
    if (Math.abs(diff) > 50) step(diff > 0 ? 1 : -1);
  };

  const slide = slides[current];
  const prefersReduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <section
      id="top"
      style={{ position: "relative", height: "100vh", minHeight: "700px", overflow: "hidden", backgroundColor: "#092A58", cursor: "grab", userSelect: "none" }}
      onMouseDown={onDragStart}
      onMouseUp={onDragEnd}
      onTouchStart={onDragStart}
      onTouchEnd={onDragEnd}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setCycle((c) => c + 1); dragStartX.current = null; }}
    >
      {/* Background slides */}
      {slides.map((s, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            inset: 0,
            opacity: i === current ? 1 : 0,
            transform: i === current ? "translateX(0) scale(1)" : i === previous ? "translateX(-3%) scale(0.99)" : "translateX(3%) scale(0.99)",
            transition: prefersReduced ? "none" : `opacity ${TRANSITION_MS}ms cubic-bezier(0.77,0,0.175,1), transform ${TRANSITION_MS}ms cubic-bezier(0.77,0,0.175,1)`,
            pointerEvents: i === current ? "auto" : "none",
          }}
        >
          <div role="img" aria-label={s.imgAlt} style={{
            position: "absolute",
            inset: "-6%",
            backgroundImage: `url(${s.img})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "saturate(0.8)",
            animation: !prefersReduced && i === current ? "kenBurns 24s ease-in-out infinite alternate" : "none",
          }} />
          <div style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(105deg, rgba(9,42,88,0.93) 0%, rgba(9,42,88,0.74) 46%, rgba(9,42,88,0.38) 100%)",
          }} />
          {/* Restrained brand glow */}
          <div style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse at 88% 110%, rgba(113,183,43,0.20) 0%, transparent 52%), radial-gradient(ellipse at 12% -10%, rgba(47,95,168,0.22) 0%, transparent 50%)",
          }} />
          <div style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "220px",
            background: "linear-gradient(180deg, transparent, rgba(9,42,88,0.8))",
          }} />
        </div>
      ))}

      <HexPattern id="heroHex" opacity={0.045} />

      {/* Content */}
      <div className="hero-content" style={{
        position: "absolute",
        inset: 0,
        zIndex: 10,
        maxWidth: "1440px",
        margin: "0 auto",
        padding: "112px 80px 0",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        pointerEvents: "none",
      }}>
        <div key={`lbl-${current}`} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px", animation: "fadeUp 0.7s ease 0.15s both", flexWrap: "wrap" }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: 600, letterSpacing: "0.2em", color: ACCENT, textTransform: "uppercase" }}>{slide.label}</span>
          <div style={{ width: "28px", height: "1px", backgroundColor: "rgba(255,255,255,0.25)" }} />
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: 500, letterSpacing: "0.2em", color: "rgba(255,255,255,0.45)", textTransform: "uppercase" }}>ESTABLISHED 2009 · SMART FOR IMPORT & EXPORT</span>
        </div>

        <p key={`eb-${current}`} style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", fontWeight: 500, letterSpacing: "0.24em", color: "rgba(255,255,255,0.62)", textTransform: "uppercase", marginBottom: "18px", animation: "fadeUp 0.7s ease 0.25s both" }}>
          {slide.eyebrow}
        </p>

        <h1 key={`h-${current}`} style={{ fontFamily: "Manrope, sans-serif", fontSize: "clamp(42px, 5.4vw, 84px)", fontWeight: 800, lineHeight: 0.98, letterSpacing: "-0.035em", color: "#ffffff", marginBottom: "28px", maxWidth: "1120px", animation: "fadeUp 0.7s ease 0.35s both" }}>
          {slide.headline.map((line, i) => (
            <span key={i} style={{ display: "block", color: i === slide.accentLine ? ACCENT : "#ffffff" }}>{line}</span>
          ))}
        </h1>

        <p key={`b-${current}`} style={{ fontFamily: "Inter, sans-serif", fontSize: "16px", lineHeight: 1.65, color: "rgba(255,255,255,0.64)", maxWidth: "500px", marginBottom: "36px", animation: "fadeUp 0.7s ease 0.45s both" }}>
          {slide.body}
        </p>

        <div key={`c-${current}`} style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap", animation: "fadeUp 0.7s ease 0.55s both", pointerEvents: "auto" }}>
          <a className="ui-button" href={slide.primaryCta.href} style={{
            fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: "13px", letterSpacing: "0.07em", textTransform: "uppercase",
            color: "#092A58", backgroundColor: ACCENT, padding: "14px 26px",
            textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "10px",
            transition: "background-color 0.2s, transform 0.2s, box-shadow 0.2s",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#5F9E22"; e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(113,183,43,0.32)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = ACCENT; e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
          >
            {slide.primaryCta.label}
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M2 9L9 2M9 2H3.5M9 2V7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </a>
          <a className="ui-button" href={slide.secondaryCta.href} style={{
            fontFamily: "Manrope, sans-serif", fontWeight: 600, fontSize: "13px", letterSpacing: "0.07em", textTransform: "uppercase",
            color: "rgba(255,255,255,0.82)", border: "1px solid rgba(255,255,255,0.2)", padding: "13px 26px",
            backgroundColor: "rgba(255,255,255,0.03)", backdropFilter: "blur(6px)",
            textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "10px",
            transition: "border-color 0.2s, color 0.2s, transform 0.2s",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)"; e.currentTarget.style.color = "#ffffff"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.color = "rgba(255,255,255,0.82)"; e.currentTarget.style.transform = ""; }}
          >
            {slide.secondaryCta.label}
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none"><path d="M8 1l3 3-3 3M1 4h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </a>
        </div>

        <div className="hero-micro" style={{ position: "absolute", bottom: "40px", left: "80px", display: "flex", alignItems: "center", gap: "10px", pointerEvents: "none" }}>
          <div style={{ width: "16px", height: "2px", borderRadius: "2px", backgroundColor: ACCENT }} />
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: 500, letterSpacing: "0.2em", color: "rgba(255,255,255,0.45)", textTransform: "uppercase" }}>{slide.micro}</span>
        </div>
      </div>

      {/* Slide navigation panel */}
      <div className="hero-slide-nav" style={{
        position: "absolute",
        bottom: "32px",
        right: "56px",
        zIndex: 20,
        backgroundColor: "rgba(9,42,88,0.58)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "14px",
        padding: "16px 20px",
        pointerEvents: "auto",
        minWidth: "190px",
      }}>
        <div className="hero-slide-items" style={{ display: "flex", flexDirection: "column" }}>
          {slides.map((s, i) => (
            <button
              key={i}
              type="button"
              className={`hero-nav-btn${i === current ? " is-active" : ""}`}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}: ${s.nav}`}
              aria-current={i === current ? "true" : undefined}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                flex: 1,
                padding: "7px 0 7px 12px",
                background: "none",
                border: "none",
                cursor: "pointer",
                borderLeft: `2px solid ${i === current ? ACCENT : "rgba(255,255,255,0.08)"}`,
                transition: "border-color 0.3s",
              }}
            >
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "9px", fontWeight: 700, letterSpacing: "0.2em", color: i === current ? ACCENT : "rgba(255,255,255,0.3)", transition: "color 0.3s" }}>0{i + 1}</span>
              <span className="hero-slide-name" style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: i === current ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.28)", transition: "color 0.3s" }}>{s.nav}</span>
            </button>
          ))}
        </div>
        <div style={{ marginTop: "10px", height: "2px", backgroundColor: "rgba(255,255,255,0.08)", borderRadius: "999px", overflow: "hidden" }}>
          <div
            key={`prog-${current}-${cycle}`}
            style={{
              height: "100%",
              backgroundColor: ACCENT,
              borderRadius: "999px",
              animation: !prefersReduced ? `progressBar ${SLIDE_DURATION}ms linear forwards` : "none",
              animationPlayState: hovered ? "paused" : "running",
            }}
          />
        </div>
      </div>

      {/* Arrow controls */}
      {(["prev", "next"] as const).map((dir) => (
        <button
          key={dir}
          type="button"
          className="hero-arrow"
          onClick={() => step(dir === "prev" ? -1 : 1)}
          style={{
            position: "absolute",
            [dir === "prev" ? "left" : "right"]: "20px",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 20,
            background: "rgba(9,42,88,0.45)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "12px",
            width: "42px",
            height: "42px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(8px)",
            transition: "background 0.2s, border-color 0.2s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(113,183,43,0.92)"; e.currentTarget.style.borderColor = "transparent"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(9,42,88,0.45)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}
          aria-label={dir === "prev" ? "Previous slide" : "Next slide"}
        >
          <svg width="13" height="9" viewBox="0 0 13 9" fill="none">
            {dir === "prev"
              ? <path d="M5.5 1L1 4.5l4.5 4M1 4.5H12" stroke="#ffffff" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              : <path d="M7.5 1L12 4.5 7.5 8M1 4.5H12" stroke="#ffffff" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            }
          </svg>
        </button>
      ))}
    </section>
  );
}
