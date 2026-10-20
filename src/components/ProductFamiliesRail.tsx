import { MouseEvent } from "react"
import { categories } from "../data"

// Two quiet formula annotations, attached only where the chemistry is literal.
const annotations: Record<number, string> = {
  5: "CH₃CN",
  6: "NaCl",
}

const Plus = () => (
  <span className="family-rail-sep" aria-hidden="true">
    +
  </span>
)

function focusFamily(event: MouseEvent<HTMLAnchorElement>, index: number) {
  const card = document.querySelector<HTMLElement>(
    `#categories .category-${index + 1}`,
  )
  if (!card) return
  event.preventDefault()
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  card.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" })
  card.focus({ preventScroll: true })
  card.classList.remove("rail-flash")
  void card.offsetWidth
  card.classList.add("rail-flash")
  window.setTimeout(() => card.classList.remove("rail-flash"), 1900)
  window.history.replaceState(null, "", "#categories")
}

function FamilyGroup({ copy }: { copy?: boolean }) {
  return (
    <ul className="family-rail-group" aria-hidden={copy || undefined}>
      {categories.map(([n, title], i) => (
        <li key={n}>
          <a
            href="#categories"
            tabIndex={copy ? -1 : undefined}
            onClick={(e) => focusFamily(e, i)}
          >
            <span className="family-rail-name">{title}</span>
            {annotations[i] && (
              <sup className="family-rail-formula" aria-hidden="true">
                {annotations[i]}
              </sup>
            )}
          </a>
          <Plus />
        </li>
      ))}
    </ul>
  )
}

export default function ProductFamiliesRail() {
  return (
    <nav className="family-rail" aria-label="Product families">
      <div className="family-rail-id">
        <span className="family-rail-count">
          09
          <i aria-hidden="true" />
        </span>
        <span className="family-rail-label">Product families</span>
      </div>
      <div className="family-rail-viewport">
        <div className="family-rail-track">
          <FamilyGroup />
          <FamilyGroup copy />
        </div>
      </div>
    </nav>
  )
}
