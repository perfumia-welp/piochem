import type { Product } from "../../search/types"
import { documentRequestHref, enquiryHref } from "./SearchContext"

const Arrow = () => (
  <svg viewBox="0 0 20 20" aria-hidden="true">
    <path d="M4 10h11M11 6l4 4-4 4" />
  </svg>
)

type Props = {
  product: Product
  /** List row in the results section, or a compact card in the header dropdown. */
  as?: "li" | "div"
  compact?: boolean
}

/**
 * One product, with only label-verified facts. Documents are requested rather
 * than promised: nothing here claims that a specific SDS, COA or specification
 * exists online.
 */
export default function ProductResult({ product, as: Tag = "li", compact = false }: Props) {
  const descriptor = [product.grade, product.qualifier].filter(Boolean).join(" · ")
  const facts: [string, string | undefined][] = [
    ["CAS No.", product.cas],
    ["Formula", product.formula],
    ["Cat. No.", product.code],
    ["Pack size", product.packSizes?.join(", ")],
  ]
  return (
    <Tag className={compact ? "cr-row cr-row--compact" : "cr-row"}>
      <div>
        <h3 className="cr-name">{product.name}</h3>
        {descriptor && <p className="cr-sub">{descriptor}</p>}
        {product.category && <p className="cr-category">{product.category}</p>}
      </div>
      <dl className="cr-facts">
        {facts.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value ?? "—"}</dd>
          </div>
        ))}
      </dl>
      <div className="cr-row-actions">
        <a className="cr-link" href={enquiryHref(product)}>
          Request a quote <Arrow />
        </a>
        <a className="cr-link cr-link--quiet" href={documentRequestHref(product)}>
          Request documents <Arrow />
        </a>
      </div>
    </Tag>
  )
}
