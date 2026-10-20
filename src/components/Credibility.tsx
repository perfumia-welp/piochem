import { lazy, Suspense, useEffect, useRef } from "react";
import CountUp from "./CountUp";

const MaterialObject3D = lazy(() => import("./MaterialObject3D"));

const metrics = [
  { value: "API", label: "API Portfolio", detail: "Active pharmaceutical ingredients" },
  { value: "Supplements", label: "Dietary Supplements", detail: "Vitamins, omega 3, collagen, oils" },
  { value: "Global", label: "International Sourcing", detail: "India · China · Europe" },
];

export default function Credibility() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = ref.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        section.querySelectorAll(".reveal").forEach((el) => el.classList.add("visible"));
        observer.disconnect();
      }
    }, { threshold: 0.12 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="company" ref={ref} className="credibility-section" aria-labelledby="expertise-heading">
      <div className="credibility-layout">
        <div className="credibility-story">
          <span className="section-label reveal">CM / 01 — THE COMPANY</span>
          <h2 id="expertise-heading" className="credibility-heading reveal reveal-delay-1">
            Established in 2009.<br />Built Around <em>Customer Needs</em>.
          </h2>
          <div className="heritage-timeline reveal reveal-delay-2" aria-label="Company history">
            <div className="timeline-entry" data-count-hover><strong><CountUp value="2009" /></strong><span>Established</span></div>
            <div className="timeline-line" aria-hidden="true"><i /></div>
            <div className="timeline-entry timeline-entry-current"><strong>Sourcing</strong><span>Pharmaceutical ingredient sourcing &amp; supplier representation</span></div>
          </div>
          <p className="credibility-signoff reveal reveal-delay-3">
            Chemical Maker has developed its business around pharmaceutical sourcing, supplier
            representation, import services and responsive support for customer requirements.
          </p>
        </div>

        <div className="material-module">
          <div className="material-stage">
            <div className="material-glow" aria-hidden="true" />
            <div className="material-label material-label-primary">INGREDIENT SAMPLE / 01</div>
            <div className="material-label material-label-secondary">REPRESENT → SOURCE → IMPORT → SUPPLY</div>
            <div className="material-canvas-wrap">
              <Suspense fallback={<div className="material-loading" aria-label="Loading material model" />}>
                <MaterialObject3D />
              </Suspense>
            </div>
          </div>
          <div className="credibility-metrics reveal reveal-delay-2">
            {metrics.map((metric) => (
              <div className="credibility-metric" key={metric.value} data-count-hover>
                <strong><CountUp value={metric.value} /></strong><span>{metric.label}</span><small>{metric.detail}</small>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
