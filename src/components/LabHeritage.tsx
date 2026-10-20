import { useEffect, useRef, useState } from "react"
import type { ReagentLabel, ReagentSceneHandle } from "./reagentScene"

/** Founding year is not confirmed in the project yet. Set it to show "Est. {year}" in the eyebrow. */
const ESTABLISHED_YEAR: number | null = null

/** Restrained demonstration label: no unverified catalogue or chemistry claims. */
const DEMO_LABEL: ReagentLabel = {
  name: "Laboratory Reagent",
  formula: "Ingredient sample",
  meta: "Demonstration label",
  grade: "Piochem laboratory chemicals",
  quantity: "Sample",
  lot: "Visual reference only",
}

const FEATURES = [
  {
    title: "Laboratory chemicals",
    body: "Reliable materials for analytical and research workflows.",
  },
  {
    title: "High-purity reagents",
    body: "Products selected for controlled laboratory applications.",
  },
  {
    title: "Technical support",
    body: "Product information and documentation when required.",
  },
]

const FLOW = ["Manufacture", "Pack", "Stock", "Distribute", "Support"]

function hasWebGL() {
  try {
    const c = document.createElement("canvas")
    return !!(c.getContext("webgl2") || c.getContext("webgl"))
  } catch {
    return false
  }
}

/** Static jar drawing: the loading poster, and the fallback when WebGL is unavailable. */
function JarPoster() {
  return (
    <svg className="lab-jar-poster" viewBox="0 0 320 400" aria-hidden="true">
      <defs>
        <linearGradient id="lab-glass" x1="0" x2="1">
          <stop offset="0" stopColor="#dfe5e6" stopOpacity=".7" />
          <stop offset=".18" stopColor="#ffffff" stopOpacity=".2" />
          <stop offset=".8" stopColor="#ffffff" stopOpacity=".08" />
          <stop offset="1" stopColor="#d5dbdc" stopOpacity=".7" />
        </linearGradient>
        <linearGradient id="lab-powder" x1="0" x2="1">
          <stop offset="0" stopColor="#e4e1dc" />
          <stop offset=".4" stopColor="#f6f4f1" />
          <stop offset="1" stopColor="#dedad5" />
        </linearGradient>
        <radialGradient id="lab-shadow">
          <stop offset="0" stopColor="#171719" stopOpacity=".28" />
          <stop offset="1" stopColor="#171719" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="160" cy="362" rx="118" ry="20" fill="url(#lab-shadow)" />
      <path d="M86 158h148v184q0 12-12 12H98q-12 0-12-12z" fill="url(#lab-powder)" />
      <ellipse cx="160" cy="158" rx="74" ry="11" fill="#f8f7f4" />
      <path
        d="M118 86h84v14q34 8 38 34v208q0 18-18 18H98q-18 0-18-18V134q4-26 38-34z"
        fill="url(#lab-glass)"
        stroke="#c7cdce"
        strokeWidth="1.2"
      />
      <rect x="80" y="196" width="160" height="96" fill="#fbfaf8" />
      <rect x="80" y="196" width="160" height="14" fill="#c51632" />
      <text x="96" y="206.5" fill="#fff" fontSize="7" fontWeight="700" letterSpacing="2.4">
        PIOCHEM
      </text>
      <text x="96" y="236" fill="#171719" fontSize="13" fontWeight="600">
        {DEMO_LABEL.name}
      </text>
      <text x="96" y="249" fill="#6f7074" fontSize="6.5">
        {DEMO_LABEL.formula} · {DEMO_LABEL.meta.split("·")[1]?.trim()}
      </text>
      <rect x="96" y="268" width="128" height=".8" fill="#d9d5d1" />
      <text x="224" y="284" fill="#171719" fontSize="11" fontWeight="600" textAnchor="end">
        {DEMO_LABEL.quantity}
      </text>
      <rect x="114" y="34" width="92" height="58" rx="7" fill="#151517" />
      <path
        d="M122 40v46M130 40v46M138 40v46M146 40v46M154 40v46M162 40v46M170 40v46M178 40v46M186 40v46M194 40v46"
        stroke="#2a2a2d"
        strokeWidth="2"
      />
    </svg>
  )
}

function ReagentVisual() {
  const wrap = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const [mode, setMode] = useState<"loading" | "live" | "fallback">("loading")

  useEffect(() => {
    const el = wrap.current
    const cv = canvas.current
    if (!el || !cv) return
    let handle: ReagentSceneHandle | null = null
    let cancelled = false
    let inView = false
    const section = el.closest("section") ?? el
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    // As in ChemicalMaker: only a fine, hovering pointer steers the jar.
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches

    // Load the 3D chunk only as the section approaches the viewport.
    const loader = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        loader.disconnect()
        if (!hasWebGL()) return setMode("fallback")
        import("./reagentScene")
          .then(({ createReagentScene }) => {
            if (cancelled) return
            handle = createReagentScene(cv, {
              label: DEMO_LABEL,
              reducedMotion: reduced,
              onFirstFrame: () => !cancelled && setMode("live"),
            })
            handle.setActive(inView)
          })
          .catch(() => !cancelled && setMode("fallback"))
      },
      { rootMargin: "400px 0px" },
    )
    loader.observe(el)

    // Run the render loop only while the visual is actually on screen.
    const visibility = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
      handle?.setActive(inView)
    })
    visibility.observe(el)

    // Pointer goes straight into the scene (no React state); touch devices get the idle float alone.
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || !handle) return
      const r = el.getBoundingClientRect()
      const s = section.getBoundingClientRect()
      const clamp = (n: number) => Math.max(-1, Math.min(1, n))
      handle.setPointer({
        x: clamp((e.clientX - (r.left + r.width / 2)) / (s.width / 2)),
        y: clamp((e.clientY - (r.top + r.height / 2)) / (s.height / 2)),
      })
    }
    const onLeave = () => handle?.setPointer(null)
    if (finePointer && !reduced) {
      section.addEventListener("pointermove", onMove as EventListener, { passive: true })
      section.addEventListener("pointerleave", onLeave)
    }

    return () => {
      cancelled = true
      loader.disconnect()
      visibility.disconnect()
      section.removeEventListener("pointermove", onMove as EventListener)
      section.removeEventListener("pointerleave", onLeave)
      handle?.dispose()
    }
  }, [])

  return (
    <div className={`lab-visual is-${mode}`} ref={wrap}>
      <p className="lab-annot lab-annot-top">Laboratory reagent</p>
      <div className="lab-stage">
        <JarPoster />
        <canvas
          ref={canvas}
          className="lab-canvas"
          role="img"
          aria-label={`3D model of a Piochem ${DEMO_LABEL.name} reagent jar`}
        />
      </div>
      <p className="lab-annot lab-annot-bottom">Powder · Crystals · Solvents</p>
    </div>
  )
}

export default function LabHeritage() {
  return (
    <section className="lab-heritage" id="lab-chemistry" aria-labelledby="lab-heritage-title">
      <div className="lab-copy reveal">
        <p className="eyebrow">
          Piochem / Laboratory reagents{ESTABLISHED_YEAR ? ` — Est. ${ESTABLISHED_YEAR}` : ""}
        </p>
        <h2 id="lab-heritage-title">
          Chemistry
          <em>built for the lab.</em>
        </h2>
        <p className="lab-lede">
          Reagents, solvents and fine chemicals made and supplied by Piochem for analytical, research and
          industrial laboratories — manufactured in 6th of October City, Giza.
        </p>
        <dl className="lab-facts">
          <div>
            <dt>50+</dt>
            <dd>Years of accumulated experience</dd>
          </div>
          <div>
            <dt>Giza</dt>
            <dd>6th of October City manufacturing plant</dd>
          </div>
        </dl>
        <p className="lab-flow" aria-label="How Piochem works">
          {FLOW.map((step, i) => (
            <span key={step}>
              {step}
              {i < FLOW.length - 1 && <i aria-hidden="true">→</i>}
            </span>
          ))}
        </p>
        <a className="text-link" href="#quality">
          Discover our quality approach
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <path d="M4 10h11M11 6l4 4-4 4" />
          </svg>
        </a>
      </div>
      <div className="lab-side">
        <ReagentVisual />
        <ol className="lab-features">
          {FEATURES.map((f, i) => (
            <li key={f.title} className="reveal">
              <span>0{i + 1}</span>
              <h3>{f.title}</h3>
              <p>{f.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
