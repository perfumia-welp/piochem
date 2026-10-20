import { useEffect, useRef, useState } from "react"

const qualitySystems = [
  {
    standard: "9001",
    year: "2015",
    title: "Quality Management System",
    detail:
      "Supports a structured approach to consistent quality management across Piochem’s operations.",
  },
  {
    standard: "14001",
    year: "2015",
    title: "Environmental Management System",
    detail:
      "Supports systematic environmental management and reduction of operational environmental impact.",
  },
  {
    standard: "45001",
    year: "2018",
    title: "Occupational Health & Safety Management System",
    detail:
      "Supports structured management of workplace health and safety requirements.",
  },
]

const DESKTOP = "(min-width: 901px)"
const pad = (n: number) => String(n).padStart(2, "0")

export default function QualityTimeline() {
  const [active, setActive] = useState(0)
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== "undefined" && window.matchMedia(DESKTOP).matches,
  )
  const sentinels = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const query = window.matchMedia(DESKTOP)
    const update = () => setIsDesktop(query.matches)
    query.addEventListener("change", update)
    return () => query.removeEventListener("change", update)
  }, [])

  // Desktop: the stage is sticky; one sentinel per standard crosses the
  // viewport's centre line, which is cheaper than reading scroll progress.
  useEffect(() => {
    if (!isDesktop) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting)
            setActive(Number((entry.target as HTMLElement).dataset.step))
        })
      },
      { rootMargin: "-50% 0px -50% 0px" },
    )
    sentinels.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [isDesktop])

  const goTo = (index: number) => {
    const sentinel = sentinels.current[index]
    if (!isDesktop || !sentinel) {
      setActive(index)
      return
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const top =
      sentinel.getBoundingClientRect().top +
      window.scrollY -
      window.innerHeight / 2 +
      2
    window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" })
  }

  const system = qualitySystems[active]

  return (
    <section className="quality-systems" id="quality">
      <div className="quality-systems-intro">
        <div>
          <p className="eyebrow">Quality systems</p>
          <h2>
            Quality,
            <br />
            <em>formalized.</em>
          </h2>
        </div>
        <p>
          Piochem operates an integrated management system aligned with
          internationally recognized standards for quality, environmental
          responsibility, and occupational health and safety.
        </p>
      </div>
      <div
        className="quality-track"
        style={{ ["--steps" as string]: qualitySystems.length }}
      >
        <div className="quality-sentinels" aria-hidden="true">
          {qualitySystems.map((item, index) => (
            <div
              key={item.standard}
              data-step={index}
              ref={(el) => {
                sentinels.current[index] = el
              }}
            />
          ))}
        </div>
        <div className="quality-stage">
          <ol
            className="quality-steps"
            aria-label="ISO standards"
            style={{
              ["--progress" as string]: active / (qualitySystems.length - 1),
            }}
          >
            {qualitySystems.map((item, index) => (
              <li key={item.standard}>
                <button
                  type="button"
                  className={
                    index === active
                      ? "is-active"
                      : index < active
                        ? "is-done"
                        : undefined
                  }
                  aria-current={index === active ? "step" : undefined}
                  aria-label={`ISO ${item.standard}:${item.year}, ${item.title}`}
                  onClick={() => goTo(index)}
                >
                  {pad(index + 1)}
                </button>
              </li>
            ))}
          </ol>
          <div className="quality-copy" key={active} aria-live="polite">
            <p className="quality-label">
              ISO standard {pad(active + 1)}
              <span>/ {pad(qualitySystems.length)}</span>
            </p>
            <h3>{system.title}</h3>
            <p className="quality-code">
              ISO {system.standard}:{system.year}
            </p>
            <p className="quality-detail">{system.detail}</p>
          </div>
          <div
            className="quality-plates"
            aria-hidden="true"
            style={{
              ["--progress" as string]: active / (qualitySystems.length - 1),
            }}
          >
            <i className="quality-plate-rule" />
            {qualitySystems.map((item, index) => (
              <div
                className={
                  index === active ? "quality-plate is-active" : "quality-plate"
                }
                key={item.standard}
              >
                <div className="quality-plate-head">
                  <small>ISO</small>
                  <span>
                    Standard {pad(index + 1)} / {pad(qualitySystems.length)}
                  </span>
                </div>
                <strong className="quality-plate-number">{item.standard}</strong>
                <b className="quality-plate-year">{item.year}</b>
                <span className="quality-plate-name">{item.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
