import { useEffect, useRef, useState, type CSSProperties } from "react"
import { productFamilies } from "./productFamilies"

const Arrow = () => <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h11M11 6l4 4-4 4" /></svg>

function FamilyImage({ index, phase = "incoming" }: { index: number; phase?: "incoming" | "outgoing" }) {
  const family = productFamilies[index]
  return <img key={`${family.id}-${phase}`} className={`story-image is-${phase}`} src={family.image} srcSet={family.srcSet} sizes="(min-width: 1000px) 52vw, 92vw" width={family.imageWidth} height={family.imageHeight} style={{ "--image-position-desktop": family.imagePosition, "--image-position-mobile": family.imagePositionMobile } as CSSProperties} alt={phase === "incoming" ? family.imageAlt : ""} aria-hidden={phase === "outgoing" || undefined} loading="eager" decoding="async" />
}

function StoryCopy({ index, compact = false, phase = "incoming" }: { index: number; compact?: boolean; phase?: "incoming" | "outgoing" }) {
  const family = productFamilies[index]
  return <div key={`${family.id}-${phase}`} className={`${compact ? "story-compact-copy" : "story-focus-copy"} is-${phase}`} aria-hidden={phase === "outgoing" || undefined}>
    <span className="story-meta"><b>{family.number} / 09</b><i />{family.shortLabel}</span>
    <h3>{family.name}</h3>
    <p>{family.description}</p>
    <a className="story-cta" href={family.href}>Explore <Arrow /></a>
  </div>
}

export default function CategoryStory() {
  const [compact, setCompact] = useState(() => window.matchMedia("(max-width: 999px)").matches)
  const [activeIndex, setActiveIndex] = useState(0)
  const [previousIndex, setPreviousIndex] = useState<number | null>(null)
  const steps = useRef<(HTMLLIElement | null)[]>([])
  const desktopRef = useRef<HTMLDivElement | null>(null)
  const transitionTimer = useRef<number | undefined>(undefined)
  const active = productFamilies[activeIndex]

  const activate = (index: number) => setActiveIndex((current) => {
    if (index === current) return current
    setPreviousIndex(current)
    window.clearTimeout(transitionTimer.current)
    transitionTimer.current = window.setTimeout(() => setPreviousIndex(null), 480)
    return index
  })

  useEffect(() => {
    const query = window.matchMedia("(max-width: 999px)")
    const update = () => setCompact(query.matches)
    query.addEventListener("change", update)
    return () => query.removeEventListener("change", update)
  }, [])

  useEffect(() => {
    if (compact) return
    const sync = () => {
      const marker = innerHeight * .5
      const index = steps.current.reduce((nearest, step, current) => {
        if (!step) return nearest
        const distance = Math.abs(step.getBoundingClientRect().top + step.offsetHeight / 2 - marker)
        const nearestStep = steps.current[nearest]
        const nearestDistance = nearestStep ? Math.abs(nearestStep.getBoundingClientRect().top + nearestStep.offsetHeight / 2 - marker) : Infinity
        return distance < nearestDistance ? current : nearest
      }, 0)
      activate(index)
    }
    const observer = new IntersectionObserver(sync, { threshold: [0, .5, 1], rootMargin: "-34% 0px -34% 0px" })
    steps.current.forEach((step) => step && observer.observe(step))
    // Re-entering the story from either edge (e.g. after a jump link) resyncs before any step crosses the band.
    const entry = new IntersectionObserver(sync)
    if (desktopRef.current) entry.observe(desktopRef.current)
    return () => { observer.disconnect(); entry.disconnect() }
  }, [compact])

  useEffect(() => () => window.clearTimeout(transitionTimer.current), [])

  useEffect(() => {
    const next = productFamilies[Math.min(activeIndex + 1, productFamilies.length - 1)]
    if (next.id === active.id) return
    const image = new Image()
    image.src = next.image
    if (next.srcSet) image.srcset = next.srcSet
    image.decode?.().catch(() => undefined)
  }, [active.id, activeIndex])

  return <div className="category-story">
    {!compact ? <div className="story-desktop" ref={desktopRef}>
      <div className="story-sticky">
        <div className="story-media">{previousIndex !== null && <FamilyImage index={previousIndex} phase="outgoing" />}<FamilyImage index={activeIndex} /><div className="story-media-shade" /><div key={active.id} className="story-media-copy"><span>{active.number} / 09</span><strong>{active.name}</strong></div><div className="story-progress"><i style={{ width: `${((activeIndex + 1) / productFamilies.length) * 100}%` }} /></div></div>
        <div className="story-focus-panel"><div className="story-focus-content">{previousIndex !== null && <StoryCopy index={previousIndex} phase="outgoing" />}<StoryCopy index={activeIndex} /></div><div className="story-focus-progress" aria-hidden="true"><span>{String(activeIndex + 1).padStart(2, "0")}</span><i><b style={{ width: `${((activeIndex + 1) / productFamilies.length) * 100}%` }} /></i><span>09</span></div></div>
      </div>
      <ol className="story-steps" aria-label="Product family story steps">{productFamilies.map((family, index) => <li key={family.id} id={family.id} ref={(node) => { steps.current[index] = node }} aria-label={`${family.number} of 09: ${family.name}`} />)}</ol>
    </div> : <div className="story-compact"><div className="story-media">{previousIndex !== null && <FamilyImage index={previousIndex} phase="outgoing" />}<FamilyImage index={activeIndex} /><div className="story-media-shade" /></div><div className="story-compact-content">{previousIndex !== null && <StoryCopy index={previousIndex} compact phase="outgoing" />}<StoryCopy index={activeIndex} compact /></div><div className="story-selector" role="radiogroup" aria-label="Choose a product family">{productFamilies.map((family, index) => <button key={family.id} id={family.id} className={`category-${index + 1}`} type="button" role="radio" aria-checked={activeIndex === index} aria-label={family.name} onClick={() => activate(index)}>{family.number}</button>)}</div></div>}
  </div>
}
