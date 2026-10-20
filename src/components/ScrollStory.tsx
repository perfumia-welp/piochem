import { useEffect, useRef, useState } from "react"

const chapters = [
  {
    label: "Identify",
    text: "The right chemical starts with the right identifier. Product name, CAS number, molecular formula and catalogue code help remove ambiguity before you select.",
  },
  {
    label: "Specify",
    text: "The chemical name is only the start. Concentration, grade, purity and application determine whether a product is right for the work.",
  },
  {
    label: "Verify",
    text: "Before a chemical reaches the lab, the information around it matters too. Specifications, safety data and batch documentation support a more informed product decision.",
  },
].map((chapter) => ({ ...chapter, words: chapter.text.split(" ") }))

const REDUCE = "(prefers-reduced-motion: reduce)"
// Share of a chapter's scroll spent fading it in, and again fading it out.
const FADE = 0.09
// Distance a chapter travels while it fades, in px.
const SHIFT = 12
// How many words are mid-transition at once; keeps the reveal from stepping.
const WINDOW = 3
// The final chapter finishes its reveal early so the links have room to arrive.
const LAST_REVEAL_END = 0.72
const ACTIONS_START = 0.76
const ACTIONS_END = 0.88

const clamp = (n: number) => Math.min(1, Math.max(0, n))
const smooth = (n: number) => n * n * (3 - 2 * n)
const pad = (n: number) => String(n).padStart(2, "0")

const Arrow = () => (
  <svg viewBox="0 0 20 20" aria-hidden="true">
    <path d="M4 10h11M11 6l4 4-4 4" />
  </svg>
)

export default function ScrollStory() {
  // Reduced motion gets the three statements as ordinary stacked text.
  const [live, setLive] = useState(
    () => typeof window !== "undefined" && !window.matchMedia(REDUCE).matches,
  )
  const sectionRef = useRef<HTMLElement | null>(null)
  const stageRef = useRef<HTMLDivElement | null>(null)
  const barRef = useRef<HTMLElement | null>(null)
  const countRef = useRef<HTMLElement | null>(null)
  const actionsRef = useRef<HTMLDivElement | null>(null)
  const chapterRefs = useRef<(HTMLDivElement | null)[]>([])
  const wordRefs = useRef<(HTMLSpanElement | null)[][]>(chapters.map(() => []))

  useEffect(() => {
    const query = window.matchMedia(REDUCE)
    const update = () => setLive(!query.matches)
    query.addEventListener("change", update)
    return () => query.removeEventListener("change", update)
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    const stage = stageRef.current
    const actions = actionsRef.current
    if (!live || !section || !stage) return
    const chapterEls = chapterRefs.current
    const wordEls = wordRefs.current
    const count = chapters.length
    // Last written values, so a frame only touches what actually changed.
    const wordCache = chapters.map((chapter) => chapter.words.map(() => ""))
    let lastProgress = -1
    let lastIndex = -1
    let frame = 0

    const render = () => {
      frame = 0
      const distance = section.offsetHeight - stage.offsetHeight
      if (distance <= 0) return
      const progress = clamp(-section.getBoundingClientRect().top / distance)
      if (progress === lastProgress) return
      lastProgress = progress

      if (barRef.current)
        barRef.current.style.transform = `scaleX(${progress.toFixed(4)})`

      const scaled = progress * count
      const index = Math.min(count - 1, Math.floor(scaled))
      if (index !== lastIndex) {
        lastIndex = index
        if (countRef.current) countRef.current.textContent = pad(index + 1)
      }

      chapters.forEach((chapter, i) => {
        const el = chapterEls[i]
        if (!el) return
        const first = i === 0
        const last = i === count - 1
        // 0 until this chapter's stretch of scroll begins, 1 once it is over.
        const t = clamp(scaled - i)
        const fadeIn = first ? 1 : clamp(t / FADE)
        const fadeOut = last ? 1 : clamp((1 - t) / FADE)
        const y = (1 - fadeIn) * SHIFT - (1 - fadeOut) * SHIFT
        el.style.opacity = Math.min(fadeIn, fadeOut).toFixed(3)
        el.style.transform = `translate3d(0,${y.toFixed(2)}px,0)`

        const start = first ? 0.03 : FADE + 0.02
        const end = last ? LAST_REVEAL_END : 1 - FADE - 0.08
        const head =
          clamp((t - start) / (end - start)) *
          (chapter.words.length - 1 + WINDOW)
        chapter.words.forEach((_, w) => {
          const value = smooth(clamp((head - w) / WINDOW)).toFixed(3)
          if (value === wordCache[i][w]) return
          wordCache[i][w] = value
          wordEls[i][w]?.style.setProperty("--w", value)
        })
      })

      if (actions) {
        const shown = clamp(
          (scaled - (count - 1) - ACTIONS_START) /
            (ACTIONS_END - ACTIONS_START),
        )
        actions.style.opacity = shown.toFixed(3)
        actions.style.transform = `translate3d(0,${((1 - shown) * 10).toFixed(2)}px,0)`
        // Keeps the links out of the tab order until they can be seen.
        actions.style.visibility = shown > 0.01 ? "visible" : "hidden"
      }
    }

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(render)
    }
    render()
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    return () => {
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
      if (frame) cancelAnimationFrame(frame)
      // Hand the markup back to the static stylesheet state.
      chapterEls.forEach((el) => el?.removeAttribute("style"))
      wordEls.forEach((row) => row.forEach((el) => el?.removeAttribute("style")))
      actions?.removeAttribute("style")
    }
  }, [live])

  return (
    <section
      className="story"
      id="choosing"
      ref={sectionRef}
      data-live={live ? "" : undefined}
      aria-labelledby="story-title"
    >
      <div className="story-stage" ref={stageRef}>
        <div className="story-head">
          <p className="eyebrow">Choosing laboratory chemicals</p>
          <h2 id="story-title">
            What matters before the bottle reaches the lab.
          </h2>
        </div>
        <div className="story-chapters">
          <p className="story-counter" aria-hidden="true">
            <b ref={countRef}>01</b>
            <span>/ {pad(chapters.length)}</span>
          </p>
          {chapters.map((chapter, i) => (
            <div
              className="story-chapter"
              key={chapter.label}
              ref={(el) => {
                chapterRefs.current[i] = el
              }}
            >
              <h3 className="story-label">
                <span>{pad(i + 1)}</span>
                {chapter.label}
              </h3>
              <p className="story-text">
                {chapter.words.map((word, w) => (
                  <span key={w}>
                    <span
                      className="story-word"
                      ref={(el) => {
                        wordRefs.current[i][w] = el
                      }}
                    >
                      {word}
                    </span>
                    {w < chapter.words.length - 1 && " "}
                  </span>
                ))}
              </p>
            </div>
          ))}
        </div>
        <div className="story-foot">
          <div className="story-line" aria-hidden="true">
            <i ref={barRef} />
          </div>
          <div className="story-actions" ref={actionsRef}>
            <a href="#search">
              Search chemicals <Arrow />
            </a>
            <a href="#documents">
              Documentation center <Arrow />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
