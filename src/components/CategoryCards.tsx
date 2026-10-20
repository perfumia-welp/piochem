import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react"
import { productFamilies } from "./productFamilies"

const CLONES = 4
const COUNT = productFamilies.length
const rendered = [
  ...productFamilies.slice(-CLONES).map((family) => ({ family, clone: true })),
  ...productFamilies.map((family) => ({ family, clone: false })),
  ...productFamilies
    .slice(0, CLONES)
    .map((family) => ({ family, clone: true })),
]
const canonical = (index: number) =>
  (((index - CLONES) % COUNT) + COUNT) % COUNT
const Arrow = ({ direction = "next" }: { direction?: "previous" | "next" }) => (
  <svg
    className={direction === "previous" ? "is-previous" : ""}
    viewBox="0 0 20 20"
    aria-hidden="true"
  >
    <path d="M4 10h11M11 6l4 4-4 4" />
  </svg>
)

export default function CategoryCards() {
  const rail = useRef<HTMLUListElement>(null)
  const cards = useRef<(HTMLLIElement | null)[]>([])
  const targetIndex = useRef(CLONES)
  const programmaticScroll = useRef(false)
  const resumeTimer = useRef<number | undefined>(undefined)
  const settleTimer = useRef<number | undefined>(undefined)
  const drag = useRef({ active: false, moved: false, startX: 0, scrollLeft: 0 })
  const [activeIndex, setActiveIndex] = useState(0)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [paused, setPaused] = useState(false)
  const [visible, setVisible] = useState(
    () => document.visibilityState === "visible",
  )
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  )

  const cardLeft = useCallback((index: number) => {
    const first = cards.current[0]
    const target = cards.current[index]
    return first && target ? target.offsetLeft - first.offsetLeft : null
  }, [])

  const reposition = useCallback(
    (index: number) => {
      const left = cardLeft(index)
      if (!rail.current || left === null) return
      const behavior = rail.current.style.scrollBehavior
      rail.current.style.scrollBehavior = "auto"
      rail.current.scrollLeft = left
      targetIndex.current = index
      requestAnimationFrame(() => {
        if (rail.current) rail.current.style.scrollBehavior = behavior
      })
    },
    [cardLeft],
  )

  const nearestIndex = useCallback(() => {
    if (!rail.current) return targetIndex.current
    const left = rail.current.scrollLeft
    const origin = cards.current[0]?.offsetLeft ?? 0
    return cards.current.reduce((nearest, card, index) => {
      if (!card) return nearest
      const previous = cards.current[nearest]
      return !previous ||
        Math.abs(card.offsetLeft - origin - left) <
          Math.abs(previous.offsetLeft - origin - left)
        ? index
        : nearest
    }, 0)
  }, [])

  const settle = useCallback(() => {
    const nearest = nearestIndex()
    setActiveIndex(canonical(nearest))
    const normalized =
      nearest < CLONES
        ? nearest + COUNT
        : nearest >= CLONES + COUNT
          ? nearest - COUNT
          : nearest
    if (normalized !== nearest) reposition(normalized)
    else targetIndex.current = nearest
    programmaticScroll.current = false
  }, [nearestIndex, reposition])

  const onScroll = useCallback(() => {
    window.clearTimeout(settleTimer.current)
    const nearest = nearestIndex()
    if (!programmaticScroll.current) targetIndex.current = nearest
    setActiveIndex(canonical(nearest))
    settleTimer.current = window.setTimeout(settle, 120)
  }, [nearestIndex, settle])

  const pauseTemporarily = useCallback(() => {
    setPaused(true)
    window.clearTimeout(resumeTimer.current)
    resumeTimer.current = window.setTimeout(() => setPaused(false), 4000)
  }, [])

  const step = useCallback(
    (direction: -1 | 1) => {
      const current = targetIndex.current
      let target = current + direction
      if (target < 0) {
        reposition(current + COUNT)
        target = current + COUNT + direction
      } else if (target >= rendered.length) {
        reposition(current - COUNT)
        target = current - COUNT + direction
      }
      const left = cardLeft(target)
      if (!rail.current || left === null) return
      targetIndex.current = target
      programmaticScroll.current = true
      setActiveIndex(canonical(target))
      rail.current.scrollTo({
        left,
        behavior: reducedMotion ? "auto" : "smooth",
      })
    },
    [cardLeft, reducedMotion, reposition],
  )
  const goToNext = useCallback(() => step(1), [step])

  useLayoutEffect(() => reposition(CLONES), [reposition])

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)")
    const updateMotion = () => setReducedMotion(query.matches)
    const updateVisibility = () =>
      setVisible(document.visibilityState === "visible")
    query.addEventListener("change", updateMotion)
    document.addEventListener("visibilitychange", updateVisibility)
    return () => {
      query.removeEventListener("change", updateMotion)
      document.removeEventListener("visibilitychange", updateVisibility)
      window.clearTimeout(resumeTimer.current)
      window.clearTimeout(settleTimer.current)
    }
  }, [])

  useEffect(() => {
    if (reducedMotion || !visible || hovered || focused || dragging || paused)
      return
    const timer = window.setTimeout(
      goToNext,
      window.matchMedia("(max-width: 699px)").matches ? 5800 : 4800,
    )
    return () => window.clearTimeout(timer)
  }, [
    activeIndex,
    dragging,
    focused,
    goToNext,
    hovered,
    paused,
    reducedMotion,
    visible,
  ])

  const startDrag = (event: ReactPointerEvent<HTMLUListElement>) => {
    programmaticScroll.current = false
    pauseTemporarily()
    if (event.pointerType !== "mouse" || !rail.current) return
    drag.current = {
      active: true,
      moved: false,
      startX: event.clientX,
      scrollLeft: rail.current.scrollLeft,
    }
    setDragging(true)
    rail.current.setPointerCapture(event.pointerId)
  }
  const moveDrag = (event: ReactPointerEvent<HTMLUListElement>) => {
    if (!drag.current.active || !rail.current) return
    const delta = event.clientX - drag.current.startX
    if (Math.abs(delta) > 4) drag.current.moved = true
    rail.current.scrollLeft = drag.current.scrollLeft - delta
  }
  const endDrag = (event: ReactPointerEvent<HTMLUListElement>) => {
    if (!drag.current.active) return
    drag.current.active = false
    setDragging(false)
    pauseTemporarily()
    settle()
    if (rail.current?.hasPointerCapture(event.pointerId))
      rail.current.releasePointerCapture(event.pointerId)
  }

  return (
    <div
      className="category-cards-view"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false)
        pauseTemporarily()
      }}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setFocused(false)
          pauseTemporarily()
        }
      }}
    >
      <div className="category-cards-controls">
        <span aria-live="polite">
          {String(activeIndex + 1).padStart(2, "0")} /{" "}
          {String(COUNT).padStart(2, "0")}
        </span>
        <div>
          <button
            type="button"
            aria-label="Previous product family"
            onClick={() => {
              pauseTemporarily()
              step(-1)
            }}
          >
            <Arrow direction="previous" />
          </button>
          <button
            type="button"
            aria-label="Next product family"
            onClick={() => {
              pauseTemporarily()
              goToNext()
            }}
          >
            <Arrow />
          </button>
        </div>
      </div>
      <ul
        ref={rail}
        className={`category-cards${dragging ? " is-dragging" : ""}`}
        aria-label="Product families"
        onScroll={onScroll}
        onWheel={() => {
          programmaticScroll.current = false
          pauseTemporarily()
        }}
        onTouchStart={() => {
          programmaticScroll.current = false
          pauseTemporarily()
        }}
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={(event) => {
          if (drag.current.moved) {
            event.preventDefault()
            drag.current.moved = false
          }
        }}
      >
        {rendered.map(({ family, clone }, index) => (
          <li
            key={`${clone ? "clone" : "real"}-${index}-${family.id}`}
            ref={(node) => {
              cards.current[index] = node
            }}
            className="category-cards-item"
            aria-hidden={clone || undefined}
          >
            <a
              id={clone ? undefined : family.id}
              className="category-card"
              href={family.href}
              tabIndex={clone ? -1 : undefined}
            >
              <span className="category-card-media">
                <img
                  src={family.image}
                  srcSet={family.srcSet}
                  sizes="(min-width: 700px) 390px, 86vw"
                  width={family.imageWidth}
                  height={family.imageHeight}
                  style={
                    {
                      "--image-position-desktop": family.imagePosition,
                      "--image-position-mobile": family.imagePositionMobile,
                    } as CSSProperties
                  }
                  alt={clone ? "" : family.imageAlt}
                  loading="lazy"
                  decoding="async"
                />
                <span className="category-card-index">
                  {family.number} / 09
                </span>
              </span>
              <span className="category-card-content">
                <span className="category-card-label">{family.shortLabel}</span>
                <span className="category-card-title">{family.name}</span>
                <span className="category-card-description">
                  {family.description}
                </span>
                <span className="category-card-cta">
                  Explore <Arrow />
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
