import { KeyboardEvent, PointerEvent, useEffect, useRef, useState } from "react"
import {
  ShowcaseCollection,
  ShowcaseProduct,
  showcaseCollections,
} from "../data/productShowcase"
import { standardPacks } from "../data/standardPacks"
import ProductCardCollection from "./ProductCardCollection"

const IMG_DIR = "/images/products/showcase"
const SMALL_H = 560
const FADE_MS = 300

const pad = (n: number) => String(n).padStart(2, "0")

function srcSet(p: ShowcaseProduct, ext: "avif" | "webp") {
  const smallW = Math.round((p.width * SMALL_H) / p.height)
  return `${IMG_DIR}/${p.id}-560.${ext} ${smallW}w, ${IMG_DIR}/${p.id}.${ext} ${p.width}w`
}

// Warm the browser cache before a product is selected (hover / focus intent).
const preloaded = new Set<string>()
function preload(p: ShowcaseProduct) {
  if (preloaded.has(p.id)) return
  preloaded.add(p.id)
  const img = new Image()
  img.sizes = "(max-width: 700px) 42vw, 240px"
  // AVIF matches what <picture> selects in current browsers, so the cache is reused.
  img.srcset = srcSet(p, "avif")
}

function ProductImage({
  product,
  state,
  onLoad,
}: {
  product: ShowcaseProduct
  state: "pending" | "in" | "out"
  onLoad?: () => void
}) {
  return (
    <figure
      className={`showcase-figure is-${state}`}
      aria-hidden={state === "out" || undefined}
    >
      <picture>
        <source
          type="image/avif"
          srcSet={srcSet(product, "avif")}
          sizes="(max-width: 700px) 42vw, 240px"
        />
        <source
          type="image/webp"
          srcSet={srcSet(product, "webp")}
          sizes="(max-width: 700px) 42vw, 240px"
        />
        <img
          src={`${IMG_DIR}/${product.id}.webp`}
          width={product.width}
          height={product.height}
          alt={
            state === "out"
              ? ""
              : `${product.name}${
                  product.qualifier ? ` ${product.qualifier}` : ""
                }, Piochem laboratory chemicals`
          }
          loading="lazy"
          decoding="async"
          onLoad={onLoad}
        />
      </picture>
    </figure>
  )
}

function Collection({
  collection,
  reverse,
}: {
  collection: ShowcaseCollection
  reverse: boolean
}) {
  const { products } = collection
  const [active, setActive] = useState(0)
  // `shown` is the image on stage; it only switches once the newly selected
  // image has decoded, so the crossfade never reveals a half-loaded picture.
  const [shown, setShown] = useState(-1)
  const [leaving, setLeaving] = useState<number | null>(null)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const stage = useRef<HTMLDivElement>(null)
  const product = products[active]
  const base = `showcase-${collection.id}`

  useEffect(() => {
    if (leaving === null) return
    const t = window.setTimeout(() => setLeaving(null), FADE_MS + 40)
    return () => window.clearTimeout(t)
  }, [leaving])

  function select(i: number, focus = false) {
    if (focus) tabs.current[i]?.focus()
    if (i === active) return
    setActive(i)
  }

  function handleLoaded(i: number) {
    if (i !== active || i === shown) return
    setLeaving(shown >= 0 ? shown : null)
    setShown(i)
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const last = products.length - 1
    const next =
      e.key === "ArrowRight" || e.key === "ArrowDown"
        ? active === last
          ? 0
          : active + 1
        : e.key === "ArrowLeft" || e.key === "ArrowUp"
          ? active === 0
            ? last
            : active - 1
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? last
              : null
    if (next === null) return
    e.preventDefault()
    select(next, true)
  }

  // A 3px drift that follows the pointer; skipped for touch and reduced motion.
  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse" || !stage.current) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const r = stage.current.getBoundingClientRect()
    const x = ((e.clientX - r.left) / r.width - 0.5) * 2
    const y = ((e.clientY - r.top) / r.height - 0.5) * 2
    stage.current.style.setProperty("--px", `${(x * 3).toFixed(2)}px`)
    stage.current.style.setProperty("--py", `${(y * 2).toFixed(2)}px`)
  }
  function onPointerLeave() {
    stage.current?.style.setProperty("--px", "0px")
    stage.current?.style.setProperty("--py", "0px")
  }

  const specs: [string, string | undefined][] = [
    ["Pack", product.packSize],
    ["CAT No.", product.code],
    ["CAS No.", product.cas],
    ["Formula", product.formula],
  ]

  return (
    <article
      className={`showcase-row${reverse ? " is-reverse" : ""}`}
      aria-labelledby={`${base}-title`}
    >
      <header className="showcase-head">
        <span className="showcase-index">{collection.index}</span>
        <h3 id={`${base}-title`}>{collection.title}</h3>
        <p>{collection.copy}</p>
      </header>

      <div
        className="showcase-stage"
        ref={stage}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
      >
        <div className="showcase-stage-inner">
          {leaving !== null && leaving !== shown && (
            <ProductImage
              key={`out-${products[leaving].id}`}
              product={products[leaving]}
              state="out"
            />
          )}
          {shown >= 0 && shown !== active && (
            <ProductImage
              key={products[shown].id}
              product={products[shown]}
              state="in"
            />
          )}
          <ProductImage
            key={product.id}
            product={product}
            state={shown === active ? "in" : "pending"}
            onLoad={() => handleLoaded(active)}
          />
        </div>
      </div>

      <div
        className="showcase-product"
        role="tabpanel"
        id={`${base}-panel`}
        aria-labelledby={`${base}-tab-${active}`}
      >
        <div className="showcase-product-copy" key={product.id}>
          <p className="showcase-count">
            {pad(active + 1)} <span>/ {pad(products.length)}</span>
          </p>
          <p className="showcase-name">{product.name}</p>
          {(product.qualifier || product.grade) && (
            <p className="showcase-qualifier">
              {[product.grade, product.qualifier].filter(Boolean).join(" · ")}
            </p>
          )}
          <dl className="showcase-specs">
            {specs.map(
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
      </div>

      <div
        className="showcase-selector"
        role="tablist"
        aria-label={`${collection.title}: choose a product`}
        onKeyDown={onKeyDown}
      >
        {products.map((p, i) => (
          <button
            key={p.id}
            ref={(el) => {
              tabs.current[i] = el
            }}
            type="button"
            role="tab"
            id={`${base}-tab-${i}`}
            aria-selected={i === active}
            aria-controls={`${base}-panel`}
            aria-label={`${pad(i + 1)}: ${p.name}${
              p.qualifier ? ` ${p.qualifier}` : ""
            }`}
            title={p.name}
            tabIndex={i === active ? 0 : -1}
            onClick={() => select(i)}
            onPointerEnter={() => preload(p)}
            onFocus={() => preload(p)}
          >
            {pad(i + 1)}
          </button>
        ))}
      </div>
    </article>
  )
}

export default function ProductShowcase() {
  return (
    <section
      className="section showcase"
      id="products"
      aria-labelledby="showcase-title"
    >
      <div className="section-head showcase-intro">
        <div>
          <p className="eyebrow">Piochem products</p>
          <h2 id="showcase-title">
            Products,
            <br />
            <em>in focus.</em>
          </h2>
        </div>
        <p className="intro">
          A closer look at current Piochem reagents, arranged by pack format.
        </p>
      </div>
      <ProductCardCollection collection={standardPacks} />
      {showcaseCollections.map((c) => (
        <Collection key={c.id} collection={c} reverse />
      ))}
    </section>
  )
}
