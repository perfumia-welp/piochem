import { CSSProperties, memo, useEffect, useRef, useState } from "react"
import {
  CardCollection,
  ProductImage,
  StandardPackProduct,
} from "../data/standardPacks"

const pad = (n: number) => String(n).padStart(2, "0")
const SIZES = "150px"

// Autoplay advances one product per tick, and waits this long again after the
// user stops interacting. Phones get the slower pace.
const INTERVAL = 5000
const INTERVAL_NARROW = 6000
const DRAG_THRESHOLD = 6

function srcSet({ base, width, height }: ProductImage, ext: "avif" | "webp") {
  const w = (h: number) => Math.round((width * h) / height)
  return `${base}-560.${ext} ${w(560)}w, ${base}-720.${ext} ${w(720)}w, ${base}.${ext} ${width}w`
}

const Arrow = () => (
  <svg viewBox="0 0 20 20" aria-hidden="true">
    <path d="M4 10h11M11 6l4 4-4 4" />
  </svg>
)

const ProductCard = memo(function ProductCard({
  product,
  index,
  clone = false,
}: {
  product: StandardPackProduct
  index: number
  /** Loop filler: same card, hidden from assistive tech and the tab order. */
  clone?: boolean
}) {
  const { image } = product
  const spec = [product.concentration, product.packSize]
    .filter(Boolean)
    .join(" · ")
  const summary = [product.casNo && `CAS ${product.casNo}`, product.formula]
    .filter(Boolean)
    .join(" · ")
  const details: [string, string | undefined][] = [
    ["Cat. no.", product.catNo],
    ["CAS no.", product.casNo],
    ["Formula", product.formula],
  ]

  return (
    <article className="pack-card" aria-hidden={clone || undefined}>
      <div className="pack-media">
        <span className="pack-index">{pad(index + 1)}</span>
        <picture>
          <source
            type="image/avif"
            srcSet={srcSet(image, "avif")}
            sizes={SIZES}
          />
          <source
            type="image/webp"
            srcSet={srcSet(image, "webp")}
            sizes={SIZES}
          />
          <img
            src={`${image.base}-720.webp`}
            width={image.width}
            height={image.height}
            alt={product.alt}
            loading="lazy"
            decoding="async"
            draggable={false}
          />
        </picture>
      </div>
      <div className="pack-title">
        <h4 className="pack-name">{product.name}</h4>
      </div>
      <div className="pack-info">
        {spec && <p className="pack-spec">{spec}</p>}
        <p className="pack-summary">{summary}</p>
        <dl className="pack-detail">
          {details.map(
            ([label, value]) =>
              value && (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ),
          )}
        </dl>
      </div>
      <a
        className="pack-cta"
        href={product.href ?? "#search"}
        aria-label={`View product: ${product.name}`}
        tabIndex={clone ? -1 : undefined}
        draggable={false}
      >
        View product <Arrow />
      </a>
    </article>
  )
})

export default function ProductCardCollection({
  collection,
}: {
  collection: CardCollection
}) {
  const { products } = collection
  const count = products.length
  const root = useRef<HTMLElement>(null)
  const rail = useRef<HTMLDivElement>(null)
  const stepBy = useRef<(dir: 1 | -1) => void>(() => {})
  const [active, setActive] = useState(0)

  // The rail is a native scroll-snap container holding the products followed by
  // one cloned set, so every product can lead the row and 05 → 01 keeps moving
  // forward. Once a scroll comes to rest inside the clones it is shifted back
  // by one set, which looks identical.
  useEffect(() => {
    const el = rail.current
    const host = root.current
    if (!el || !host) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
    const narrow = window.matchMedia("(max-width: 767px)")
    // Reasons autoplay is held; it only runs while this is empty.
    const blocks = new Set<string>(["offscreen"])
    let step = 0
    let canLoop = false
    let target: number | null = null
    let timer = 0
    let settleTimer = 0
    let swallowClick = false
    let drag: { id: number; x: number; left: number; moved: boolean } | null =
      null

    const index = () => (step ? Math.round(el.scrollLeft / step) : 0)
    const jump = (left: number) => el.scrollTo({ left, behavior: "instant" })
    const glide = (i: number) =>
      el.scrollTo({
        left: i * step,
        behavior: reduced.matches ? "instant" : "smooth",
      })

    function measure() {
      const [first, second] = el!.children
      if (!first || !second) return
      const i = index()
      step =
        second.getBoundingClientRect().left - first.getBoundingClientRect().left
      canLoop = el!.scrollWidth - el!.clientWidth >= count * step - 1
      jump(i * step)
    }

    function go(dir: 1 | -1) {
      if (!step) return
      let i = (target ?? index()) + dir
      if (!canLoop) i = (i + count) % count
      else if (i < 0) {
        jump(el!.scrollLeft + count * step)
        i += count
      } else if (i > count) {
        jump(el!.scrollLeft - count * step)
        i -= count
      }
      target = i
      glide(i)
    }

    function settle() {
      if (drag || blocks.has("touch")) return
      el!.classList.remove("is-free")
      target = null
      if (canLoop && index() >= count) jump(el!.scrollLeft - count * step)
    }
    const queueSettle = () => {
      clearTimeout(settleTimer)
      settleTimer = window.setTimeout(settle, 140)
    }

    function play() {
      clearTimeout(timer)
      if (reduced.matches || blocks.size) return
      timer = window.setTimeout(
        () => {
          go(1)
          play()
        },
        narrow.matches ? INTERVAL_NARROW : INTERVAL,
      )
    }
    const block = (key: string) => {
      blocks.add(key)
      clearTimeout(timer)
    }
    const unblock = (key: string) => {
      if (blocks.delete(key)) play()
    }

    const onScroll = () => {
      setActive(index() % count)
      queueSettle()
    }

    // Mouse drag. Touch and trackpads scroll the rail natively.
    const onPointerDown = (e: PointerEvent) => {
      swallowClick = false
      if (e.pointerType !== "mouse" || e.button !== 0) return
      drag = { id: e.pointerId, x: e.clientX, left: el.scrollLeft, moved: false }
    }
    const onPointerMove = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return
      const dx = e.clientX - drag.x
      if (!drag.moved) {
        if (Math.abs(dx) < DRAG_THRESHOLD) return
        drag.moved = true
        el.setPointerCapture(e.pointerId)
        el.classList.add("is-dragging", "is-free")
        block("drag")
      }
      el.scrollLeft = drag.left - dx
    }
    const onPointerUp = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return
      const { moved, x, left } = drag
      drag = null
      if (!moved) return
      // The release would otherwise follow the card's link.
      swallowClick = true
      window.setTimeout(() => (swallowClick = false))
      el.classList.remove("is-dragging")
      const dx = e.clientX - x
      let i = index()
      if (i === Math.round(left / step) && Math.abs(dx) > 48)
        i += dx < 0 ? 1 : -1
      target = Math.max(0, i)
      glide(target)
      queueSettle()
      unblock("drag")
    }
    const onClick = (e: MouseEvent) => {
      if (!swallowClick) return
      swallowClick = false
      e.preventDefault()
      e.stopPropagation()
    }
    const onDragStart = (e: DragEvent) => e.preventDefault()

    const onEnter = (e: PointerEvent) => {
      if (e.pointerType === "mouse") block("hover")
    }
    const onLeave = (e: PointerEvent) => {
      if (e.pointerType === "mouse") unblock("hover")
    }
    const onTouchStart = () => block("touch")
    const onTouchEnd = (e: TouchEvent) => {
      if (e.touches.length) return
      unblock("touch")
      queueSettle()
    }
    const onFocusIn = (e: FocusEvent) => {
      if ((e.target as Element).matches(":focus-visible")) block("focus")
    }
    const onFocusOut = (e: FocusEvent) => {
      if (!host.contains(e.relatedTarget as Node | null)) unblock("focus")
    }
    const onVisibility = () =>
      document.hidden ? block("hidden") : unblock("hidden")

    const passive = { passive: true }
    el.addEventListener("scroll", onScroll, passive)
    el.addEventListener("wheel", play, passive)
    el.addEventListener("pointerdown", onPointerDown)
    el.addEventListener("pointermove", onPointerMove)
    el.addEventListener("pointerup", onPointerUp)
    el.addEventListener("pointercancel", onPointerUp)
    el.addEventListener("click", onClick, true)
    el.addEventListener("dragstart", onDragStart)
    el.addEventListener("pointerenter", onEnter)
    el.addEventListener("pointerleave", onLeave)
    el.addEventListener("touchstart", onTouchStart, passive)
    el.addEventListener("touchend", onTouchEnd, passive)
    el.addEventListener("touchcancel", onTouchEnd, passive)
    host.addEventListener("focusin", onFocusIn)
    host.addEventListener("focusout", onFocusOut)
    document.addEventListener("visibilitychange", onVisibility)
    reduced.addEventListener("change", play)

    const resize = new ResizeObserver(measure)
    resize.observe(el)
    const inView = new IntersectionObserver(
      ([entry]) =>
        entry.isIntersecting ? unblock("offscreen") : block("offscreen"),
      { threshold: 0.3 },
    )
    inView.observe(el)

    stepBy.current = (dir) => {
      go(dir)
      play()
    }

    return () => {
      clearTimeout(timer)
      clearTimeout(settleTimer)
      resize.disconnect()
      inView.disconnect()
      el.removeEventListener("scroll", onScroll)
      el.removeEventListener("wheel", play)
      el.removeEventListener("pointerdown", onPointerDown)
      el.removeEventListener("pointermove", onPointerMove)
      el.removeEventListener("pointerup", onPointerUp)
      el.removeEventListener("pointercancel", onPointerUp)
      el.removeEventListener("click", onClick, true)
      el.removeEventListener("dragstart", onDragStart)
      el.removeEventListener("pointerenter", onEnter)
      el.removeEventListener("pointerleave", onLeave)
      el.removeEventListener("touchstart", onTouchStart)
      el.removeEventListener("touchend", onTouchEnd)
      el.removeEventListener("touchcancel", onTouchEnd)
      host.removeEventListener("focusin", onFocusIn)
      host.removeEventListener("focusout", onFocusOut)
      document.removeEventListener("visibilitychange", onVisibility)
      reduced.removeEventListener("change", play)
    }
  }, [count])

  return (
    <article
      className="pack-collection"
      aria-labelledby="pack-collection-title"
      ref={root}
    >
      <header className="pack-head">
        <div className="showcase-head">
          <span className="showcase-index">{collection.index}</span>
          <h3 id="pack-collection-title">{collection.title}</h3>
          <p>{collection.copy}</p>
        </div>
        <div className="pack-rail-ctrl">
          <span className="pack-rail-count" aria-hidden="true">
            <b>{pad(active + 1)}</b> / {pad(count)}
          </span>
          <span
            className="pack-rail-track"
            aria-hidden="true"
            style={{ "--rail-progress": (active + 1) / count } as CSSProperties}
          >
            <i />
          </span>
          <span className="pack-rail-nav">
            <button
              type="button"
              className="pack-rail-prev"
              aria-label="Previous product"
              onClick={() => stepBy.current(-1)}
            >
              <Arrow />
            </button>
            <button
              type="button"
              aria-label="Next product"
              onClick={() => stepBy.current(1)}
            >
              <Arrow />
            </button>
          </span>
        </div>
      </header>
      <div
        className="pack-rail"
        ref={rail}
        role="group"
        aria-roledescription="carousel"
        aria-label={`${collection.title}: ${count} products`}
      >
        {products.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
        {products.map((p, i) => (
          <ProductCard key={`${p.id}-clone`} product={p} index={i} clone />
        ))}
      </div>
    </article>
  )
}
