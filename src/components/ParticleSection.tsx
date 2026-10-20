import { useEffect, useRef } from "react";

const LABELS = ["API", "VITAMINS", "OMEGA 3", "COLLAGEN", "PELLETS", "BOTANICALS"];
// Weighted palette: navy and green carry the section, blue supports,
// and a single orange slot keeps that accent as rare as the brand intends.
const COLORS = ["#71B72B", "#092A58", "#2F5FA8", "#8CC63F", "#4E7DBE", "#A8B4C0", "#ffffff", "#F2A51A"];
const ACCENT = "#71B72B";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  baseX: number;
  baseY: number;
}

function initParticles(w: number, h: number, count: number): Particle[] {
  const particles: Particle[] = [];
  const scale = Math.min(1, w / 640);
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const r = (80 + Math.random() * 180) * scale;
    const cx = w * 0.5;
    const cy = h * 0.5;
    const x = cx + Math.cos(angle) * r * (0.6 + Math.random() * 0.8);
    const y = cy + Math.sin(angle) * r * (0.5 + Math.random() * 0.9);
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    particles.push({
      x, y,
      baseX: x,
      baseY: y,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: 0.8 + Math.random() * 2.4,
      color,
      alpha: color === "#ffffff" ? 0.95 : color === "#F2A51A" ? 0.9 : 0.35 + Math.random() * 0.55,
    });
  }
  return particles;
}

export default function ParticleSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -9999, y: -9999 });
  const animRef = useRef<number>(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = canvas.offsetWidth < 600 ? 380 : 600;
      particlesRef.current = initParticles(canvas.offsetWidth, canvas.offsetHeight, count);
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onMouseLeave = () => { mouse.current = { x: -9999, y: -9999 }; };
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      const particles = particlesRef.current;
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        const dx0 = p.baseX - p.x;
        const dy0 = p.baseY - p.y;
        p.vx += dx0 * 0.002;
        p.vy += dy0 * 0.002;

        const mdx = p.x - mouse.current.x;
        const mdy = p.y - mouse.current.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 90 && mdist > 0) {
          const force = (90 - mdist) / 90;
          p.vx += (mdx / mdist) * force * 0.8;
          p.vy += (mdy / mdist) * force * 0.8;
        }

        p.vx *= 0.97;
        p.vy *= 0.97;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        if (p.color === "#ffffff") {
          ctx.strokeStyle = "rgba(9,42,88,0.35)";
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;

      // Subtle bonds between nearby green particles
      const accent = particles.filter((p) => p.color === ACCENT);
      for (let i = 0; i < accent.length; i++) {
        for (let j = i + 1; j < accent.length; j++) {
          const dx = accent[i].x - accent[j].x;
          const dy = accent[i].y - accent[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 52) {
            ctx.beginPath();
            ctx.moveTo(accent[i].x, accent[i].y);
            ctx.lineTo(accent[j].x, accent[j].y);
            ctx.strokeStyle = ACCENT;
            ctx.globalAlpha = (1 - dist / 52) * 0.14;
            ctx.lineWidth = 0.5;
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }

      animRef.current = requestAnimationFrame(draw);
    };
    animRef.current = requestAnimationFrame(draw);

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.querySelectorAll(".reveal").forEach((el) => el.classList.add("visible"));
        });
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);

    return () => {
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(animRef.current);
      obs.disconnect();
    };
  }, []);

  const positions = [
    { top: "14%", left: "22%" },
    { top: "28%", right: "14%" },
    { top: "52%", left: "6%" },
    { top: "68%", right: "20%" },
    { top: "82%", left: "30%" },
    { top: "42%", left: "60%" },
  ];

  return (
    <section ref={sectionRef} className="material-spectrum-section pc-section" style={{ padding: "64px 60px" }}>
      <div className="pc-split" style={{
        maxWidth: "1440px",
        margin: "0 auto",
        overflow: "hidden",
        display: "grid",
        gridTemplateColumns: "1fr 1.2fr",
        minHeight: "540px",
        position: "relative",
      }}>
        <div className="pc-pad-0" style={{ padding: "72px 64px", display: "flex", flexDirection: "column", justifyContent: "center", zIndex: 1 }}>
          <div className="reveal" style={{ marginBottom: "16px" }}>
            <span className="section-label">CM / 04 — NETWORK</span>
          </div>
          <h2 className="reveal reveal-delay-1" style={{
            fontFamily: "Manrope, sans-serif",
            fontSize: "clamp(32px, 3.5vw, 48px)",
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            color: "#092A58",
            marginBottom: "20px",
          }}>
            One Network.<br />Multiple Ingredient Categories.
          </h2>
          <p className="reveal reveal-delay-2" style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "15px",
            lineHeight: 1.7,
            color: "#75808C",
            marginBottom: "32px",
            maxWidth: "400px",
          }}>
            From active pharmaceutical ingredients to vitamins, omega 3, collagen, pellets and botanical oils, Chemical Maker handles a broad ingredient offering through one sourcing network.
          </p>

          <div className="reveal reveal-delay-3" style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "36px" }}>
            {LABELS.map((label) => (
              <span key={label} style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "6px 12px",
                borderRadius: "999px",
                backgroundColor: "rgba(255,255,255,0.7)",
                color: "#092A58",
                border: "1px solid rgba(113,183,43,0.16)",
              }}>{label}</span>
            ))}
          </div>

          <div className="reveal reveal-delay-4">
            <a className="ui-button" href="#apis" style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              fontFamily: "Manrope, sans-serif",
              fontWeight: 700,
              fontSize: "12px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#ffffff",
              backgroundColor: "#092A58",
              padding: "13px 22px",
              textDecoration: "none",
              transition: "background-color 0.2s, transform 0.2s",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#71B72B"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#092A58"; e.currentTarget.style.transform = ""; }}
            >
              Explore the Portfolio
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none"><path d="M8 1l3 3-3 3M1 4h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </a>
          </div>
        </div>

        <div style={{ position: "relative", minHeight: "380px" }}>
          <canvas
            ref={canvasRef}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block", cursor: "crosshair" }}
          />
          {LABELS.map((label, i) => (
            <div key={label} style={{
              position: "absolute",
              ...positions[i],
              fontFamily: "Inter, sans-serif",
              fontSize: "9px",
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(113,183,43,0.5)",
              pointerEvents: "none",
              userSelect: "none",
            }}>{label}</div>
          ))}
        </div>
      </div>
    </section>
  );
}
