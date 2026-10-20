import { useLayoutEffect, useRef, useState } from "react"

const METRICS = [
  { value: 50, symbol: "+", label: "Years of accumulated experience" },
  { value: 80, symbol: "%", label: "Products available from stock" },
  { value: 2000, symbol: "+", label: "Customers served" },
  { value: 150, symbol: "+", label: "Distribution channels" },
  { value: 8000, symbol: "+", label: "Orders delivered in 2025" },
]
const format = (n: number) => n.toLocaleString("en-US")

// The stepped calibration rail: x in thousandths of the track width, y in px of the 280px rail.
const STEPS = [
  [0, 184], [170, 184], [170, 102], [365, 102], [365, 198],
  [560, 198], [560, 76], [760, 76], [760, 170], [1000, 170],
]
const FORMULAS = [
  { x: 72, y: 184, label: "H₂O" },
  { x: 468, y: 198, label: "NaCl" },
  { x: 858, y: 170, label: "NH₃" },
]
const TICKS = [
  { x: 270, y: 102 },
  { x: 660, y: 76 },
]

// One timeline: the line draws for `line` ms and everything else keys off where it has reached.
const TIMING = {
  rail: { line: 4000, count: 680 },
  stack: { line: 2800, count: 560 },
}
const LEAD = 40 // px of line before its anchor at which a metric starts to reveal
const clamp = (x: number) => Math.min(1, Math.max(0, x))
const easeOut = (x: number) => 1 - (1 - x) ** 3
// Close to linear so the direction of travel reads, with only a soft start and finish.
const lineEase = (x: number) => 0.82 * x + 0.18 * x * x * (3 - 2 * x)

type Geometry = {
  mode: "rail" | "stack"
  total: number
  points: number[][]
  metricAt: number[]
  markerAt: number[]
}

function railPoints(width: number) {
  return STEPS.map(([x, y]) => [(x * width) / 1000, y])
}
// Distance along the rail at which it first passes horizontal position x.
function lengthAtX(points: number[][], x: number) {
  let acc = 0
  for (let i = 1; i < points.length; i++) {
    const [x0, y0] = points[i - 1]
    const [x1, y1] = points[i]
    if (y0 === y1 && x >= x0 && x <= x1) return acc + x - x0
    acc += Math.abs(x1 - x0) + Math.abs(y1 - y0)
  }
  return acc
}
function pointAt(points: number[][], length: number) {
  let left = length
  for (let i = 1; i < points.length; i++) {
    const [x0, y0] = points[i - 1]
    const [x1, y1] = points[i]
    const seg = Math.abs(x1 - x0) + Math.abs(y1 - y0)
    if (left <= seg) {
      const k = seg ? left / seg : 0
      return [x0 + (x1 - x0) * k, y0 + (y1 - y0) * k]
    }
    left -= seg
  }
  return points[points.length - 1]
}

export default function ProofStats() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const trackRef = useRef<HTMLDivElement | null>(null)
  const [width, setWidth] = useState(1000)
  const sx = width / 1000

  // The rail is drawn in real pixels so dash progress, path length and metric anchors all agree.
  useLayoutEffect(() => {
    const track = trackRef.current!
    const measure = () => setWidth(track.clientWidth || 1000)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(track)
    return () => ro.disconnect()
  }, [])

  useLayoutEffect(() => {
    const section = sectionRef.current!
    const track = trackRef.current!
    const rail = track.querySelector<SVGSVGElement>(".proof-rail")!
    const path = rail.querySelector<SVGPathElement>(".proof-line")!
    const tip = rail.querySelector<SVGCircleElement>(".proof-tip")!
    const metrics = [...track.querySelectorAll<HTMLElement>(".proof-metric")]
    const markers = [...rail.querySelectorAll<SVGGElement>("g")]
    const styled = [
      track, path, tip, ...metrics,
      ...metrics.flatMap((el) => [...el.querySelectorAll<HTMLElement>("span, strong, p")]),
      ...rail.querySelectorAll<SVGElement>("g line, g text"),
    ]
    let geo: Geometry
    let raf = 0
    let start = 0
    let fired: (number | undefined)[] = []

    const measure = () => {
      if (getComputedStyle(rail).display === "none") {
        // Small screens: a vertical rule runs 6px below the track top to 8px above its bottom.
        geo = {
          mode: "stack",
          total: track.clientHeight - 14,
          points: [],
          metricAt: metrics.map((el) => el.offsetTop + 9 - 6),
          markerAt: [],
        }
        return
      }
      const points = railPoints(track.clientWidth)
      const k = track.clientWidth / 1000
      geo = {
        mode: "rail",
        total: lengthAtX(points, track.clientWidth),
        points,
        metricAt: metrics.map((el) => lengthAtX(points, el.offsetLeft + el.offsetWidth / 2)),
        markerAt: markers.map((g) => lengthAtX(points, Number(g.dataset.x) * k)),
      }
    }

    const paintMetric = (el: HTMLElement, a: number, value: number, count: number) => {
      const ramp = (from: number, dur: number) => (a < from ? 0 : easeOut(clamp((a - from) / dur)))
      const index = el.querySelector<HTMLElement>(":scope > span")!
      const strong = el.querySelector<HTMLElement>("strong")!
      const label = el.querySelector<HTMLElement>("p")!
      const live = el.querySelector<HTMLElement>(".proof-num-live")!
      const v = ramp(80, 420)
      const l = ramp(200, 420)
      el.style.setProperty("--proof-tick", String(ramp(0, 240)))
      index.style.opacity = String(ramp(0, 240))
      strong.style.opacity = String(v)
      strong.style.transform = `translateY(${10 * (1 - v)}px)`
      live.textContent = format(Math.round(value * ramp(80, count)))
      label.style.opacity = String(l)
      label.style.transform = `translateY(${6 * (1 - l)}px)`
    }
    const paintMarker = (g: SVGGElement, a: number) => {
      const ramp = (from: number, dur: number) => (a < from ? 0 : easeOut(clamp((a - from) / dur)))
      const s = ramp(0, 220)
      g.querySelectorAll<SVGLineElement>(".tick-v").forEach((line) => {
        line.style.opacity = s ? "1" : "0"
        line.style.transform = `scaleY(${s})`
      })
      g.querySelectorAll<SVGLineElement>(".tick-h").forEach((line) => {
        line.style.opacity = s ? "1" : "0"
        line.style.transform = `scaleX(${s})`
      })
      const text = g.querySelector<SVGTextElement>("text")
      if (text) {
        const f = ramp(60, 280)
        text.style.opacity = String(f)
        text.style.transform = `translateY(${4 * (1 - f)}px)`
      }
    }

    const finish = () => {
      cancelAnimationFrame(raf)
      styled.forEach((el) => el.removeAttribute("style"))
      metrics.forEach((el) => (el.querySelector(".proof-num-live")!.textContent = ""))
      section.classList.remove("proof-armed")
    }

    const frame = (now: number) => {
      if (!start) start = now
      const t = now - start
      const { line, count } = TIMING[geo.mode]
      const p = lineEase(clamp(t / line))
      const reached = p * geo.total
      if (geo.mode === "rail") {
        path.style.strokeDashoffset = String(1 - p)
        const [cx, cy] = pointAt(geo.points, reached)
        tip.setAttribute("cx", String(cx))
        tip.setAttribute("cy", String(cy))
        tip.style.opacity = String(clamp(Math.min(p, 1 - p) * 30))
      } else track.style.setProperty("--proof-line", String(p))

      const settle = Math.max(count + 80, 620)
      let settled = t >= line
      metrics.forEach((el, i) => {
        if (fired[i] === undefined && reached >= geo.metricAt[i] - LEAD) fired[i] = t
        const a = fired[i] === undefined ? -1 : t - fired[i]!
        if (a < settle) settled = false
        paintMetric(el, a, METRICS[i].value, count)
      })
      markers.forEach((g, i) => {
        const at = geo.markerAt[i]
        if (at === undefined) return
        const key = metrics.length + i
        if (fired[key] === undefined && reached >= at) fired[key] = t
        const a = fired[key] === undefined ? -1 : t - fired[key]!
        if (a < 340) settled = false
        paintMarker(g, a)
      })
      if (settled) finish()
      else raf = requestAnimationFrame(frame)
    }

    const play = () => {
      cancelAnimationFrame(raf)
      section.classList.add("proof-armed")
      measure()
      start = 0
      fired = []
      raf = requestAnimationFrame(frame)
    }

    // Reduced motion, or a browser without observers, simply keeps the finished chart.
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return
    section.classList.add("proof-armed")
    // Start once roughly a third of the chart is in view (or as much as a short screen can show).
    const threshold = Math.min(0.3, (0.8 * window.innerHeight) / Math.max(1, track.offsetHeight))
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return
        io.disconnect()
        play()
      },
      { threshold },
    )
    io.observe(track)
    const onResize = () => raf && measure()
    window.addEventListener("resize", onResize)
    if (import.meta.env.DEV) (window as unknown as { __replayProofStats?: () => void }).__replayProofStats = play

    return () => {
      io.disconnect()
      window.removeEventListener("resize", onResize)
      finish()
    }
  }, [])

  const pts = railPoints(width)
  return (
    <section className="proof-section" aria-labelledby="proof-title" ref={sectionRef}>
      <div className="proof-intro">
        <div>
          <p className="eyebrow">Piochem at a glance</p>
          <h2 id="proof-title">
            Built on experience.
            <br />
            <em>Backed by reach.</em>
          </h2>
        </div>
        <p>
          Piochem supports a broad laboratory chemicals network through
          long-standing technical experience, strong stock availability, wide
          distribution coverage, and a high volume of fulfilled orders.
        </p>
      </div>
      <div className="proof-track" ref={trackRef}>
        <svg
          className="proof-rail"
          viewBox={`0 0 ${width} 280`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            className="proof-line"
            pathLength={1}
            d={`M${pts.map(([x, y]) => `${x} ${y}`).join(" L")}`}
          />
          {FORMULAS.map(({ x, y, label }) => (
            <g className="formula-marker" data-x={x} key={label}>
              <line className="tick-v" x1={x * sx} y1={y - 4} x2={x * sx} y2={y + 7} />
              <text x={x * sx} y={y - 6}>
                {label}
              </text>
            </g>
          ))}
          {TICKS.map(({ x, y }) => (
            <g className="tick-marker" data-x={x} key={x}>
              <line className="tick-v" x1={x * sx} y1={y - 7} x2={x * sx} y2={y + 7} />
              <line className="tick-h" x1={(x - 6) * sx} y1={y} x2={(x + 6) * sx} y2={y} />
            </g>
          ))}
          <circle className="proof-tip" r="1.5" cx="0" cy="184" />
        </svg>
        {METRICS.map(({ value, symbol, label }, i) => (
          <div
            className={`proof-metric proof-metric-${i + 1}`}
            key={label}
            tabIndex={0}
          >
            <span>0{i + 1}</span>
            <strong>
              <span className="proof-num">
                <span className="proof-num-final">{format(value)}</span>
                <span className="proof-num-live" aria-hidden="true" />
              </span>
              <i className="proof-accent">{symbol}</i>
            </strong>
            <p>{label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
