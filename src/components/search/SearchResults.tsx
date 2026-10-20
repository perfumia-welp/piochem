import { useEffect, useMemo, useRef, useState } from "react"
import { searchProducts } from "../../search/searchProducts"
import type { Product } from "../../search/types"
import NoResultNotice from "./NoResultNotice"
import ProductResult from "./ProductResult"
import { focusFinder, useSearch } from "./SearchContext"

const Arrow = () => (
  <svg viewBox="0 0 20 20" aria-hidden="true">
    <path d="M4 10h11M11 6l4 4-4 4" />
  </svg>
)

type FacetKey = "category" | "grade"
const facetLabels: Record<FacetKey, string> = { category: "Category", grade: "Grade" }

/** A filter is only offered when it can actually narrow the current results. */
function facetValues(products: Product[], key: FacetKey) {
  const counts = new Map<string, number>()
  products.forEach((product) => {
    const value = product[key]
    if (value) counts.set(value, (counts.get(value) ?? 0) + 1)
  })
  const values = [...counts.entries()]
  const narrows = values.length > 1 || (values.length === 1 && values[0][1] < products.length)
  return narrows ? values : []
}

/**
 * Product results for the shared search. Rendered directly under the Chemical
 * Finder whenever a search has been submitted from any entry point.
 */
export default function SearchResults() {
  const { submitted, runSearch, clearSearch, openDocuments } = useSearch()
  const outcome = useMemo(
    () => (submitted ? searchProducts(submitted.query) : null),
    [submitted],
  )
  const [filters, setFilters] = useState<Record<FacetKey, string | null>>({
    category: null,
    grade: null,
  })
  const [filtersOpen, setFiltersOpen] = useState(false)
  const sectionRef = useRef<HTMLElement | null>(null)
  const titleRef = useRef<HTMLHeadingElement | null>(null)

  useEffect(() => {
    if (!submitted) return
    setFilters({ category: null, grade: null })
    setFiltersOpen(false)
    sectionRef.current?.scrollIntoView()
    titleRef.current?.focus({ preventScroll: true })
  }, [submitted])

  if (!submitted || !outcome) return null

  const products = outcome.matches.map((match) => match.product)
  const facets = (["category", "grade"] as const)
    .map((key) => ({ key, values: facetValues(products, key) }))
    .filter((facet) => facet.values.length > 0)
  const visible = products.filter(
    (product) =>
      (!filters.category || product.category === filters.category) &&
      (!filters.grade || product.grade === filters.grade),
  )
  const activeFilters = Object.values(filters).filter(Boolean).length
  const { intent, documentIntent } = outcome
  const shown = outcome.productQuery || outcome.query

  return (
    <section
      className="catalogue-results"
      id="search-results"
      ref={sectionRef}
      aria-labelledby="search-results-title"
    >
      <div className="cr-head">
        <div>
          <p className="eyebrow">Search results</p>
          <h2 className="cr-title" id="search-results-title" ref={titleRef} tabIndex={-1}>
            {products.length > 0 ? (
              <>
                {products.length} {products.length === 1 ? "product" : "products"} for{" "}
                <b>“{shown}”</b>
              </>
            ) : outcome.noResult?.kind === "category-empty" ? (
              <>
                Product family <b>“{outcome.noResult.category}”</b>
              </>
            ) : (
              <>
                No products for <b>“{shown}”</b>
              </>
            )}
          </h2>
          {products.length > 0 && intent.kind === "cas" && (
            <p className="cr-note">
              {intent.status === "valid"
                ? `Matched by CAS number ${intent.cas}.`
                : "Matched by the start of the CAS number."}
            </p>
          )}
          {products.length > 0 && intent.kind === "code" && (
            <p className="cr-note">Matched by catalogue number.</p>
          )}
          {products.length > 0 && intent.kind === "formula" && (
            <p className="cr-note">Matched by molecular formula.</p>
          )}
          {outcome.correctedTo && (
            <p className="cr-note">
              Showing results for <b>“{outcome.correctedTo}”</b>.
            </p>
          )}
        </div>
        <div className="cr-actions">
          <button type="button" className="cr-link" onClick={focusFinder}>
            Edit search
          </button>
          <button type="button" className="cr-link cr-link--quiet" onClick={clearSearch}>
            Clear
          </button>
        </div>
      </div>

      {documentIntent && (
        <button
          type="button"
          className="cr-documents"
          onClick={() => openDocuments(documentIntent.type, documentIntent.product?.id)}
        >
          <span>Documentation</span>
          Find SDS / COA / Specifications <Arrow />
        </button>
      )}

      {outcome.noResult && (
        <NoResultNotice
          className="cs-notice--page"
          noResult={outcome.noResult}
          query={shown}
          onCheckNumber={focusFinder}
          onPick={runSearch}
        />
      )}

      {facets.length > 0 && (
        <>
          <button
            type="button"
            className="cr-filter-toggle"
            aria-expanded={filtersOpen}
            aria-controls="search-filters"
            onClick={() => setFiltersOpen(!filtersOpen)}
          >
            Filters{activeFilters > 0 && ` (${activeFilters})`}
            <i aria-hidden="true">{filtersOpen ? "−" : "+"}</i>
          </button>
          <div className={filtersOpen ? "cr-filters is-open" : "cr-filters"} id="search-filters">
            {facets.map(({ key, values }) => (
              <div className="cr-filter" role="group" aria-label={facetLabels[key]} key={key}>
                <span>{facetLabels[key]}</span>
                <div className="cr-chips">
                  <button
                    type="button"
                    aria-pressed={!filters[key]}
                    onClick={() => setFilters({ ...filters, [key]: null })}
                  >
                    All
                  </button>
                  {values.map(([value, count]) => (
                    <button
                      type="button"
                      aria-pressed={filters[key] === value}
                      onClick={() =>
                        setFilters({ ...filters, [key]: filters[key] === value ? null : value })
                      }
                      key={value}
                    >
                      {value} <small>{count}</small>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {visible.length > 0 && (
        <ul className="cr-list">
          {visible.map((product) => (
            <ProductResult product={product} key={product.id} />
          ))}
        </ul>
      )}
      {products.length > 0 && visible.length === 0 && (
        <div className="cs-notice cs-notice--page" role="status">
          <strong>No products match these filters.</strong>
          <div className="cs-notice-actions">
            <button type="button" onClick={() => setFilters({ category: null, grade: null })}>
              Clear filters
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
