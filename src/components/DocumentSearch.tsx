import { FormEvent, useEffect, useRef, useState } from "react"
import { findProductById, lookupProduct } from "../search/searchProducts"
import type { DocumentType, NoResult, Product } from "../search/types"
import ChemicalSearchField from "./search/ChemicalSearchField"
import { noResultMessage } from "./search/NoResultNotice"
import { documentRequestHref, useSearch } from "./search/SearchContext"

const Arrow = () => (
  <svg viewBox="0 0 20 20" aria-hidden="true">
    <path d="M4 10h11M11 6l4 4-4 4" />
  </svg>
)

const documentTypes = [
  ["01", "SDS / MSDS"],
  ["02", "Certificate of Analysis"],
  ["03", "Specifications"],
  ["04", "Technical Support"],
] as const
const modes = ["sds", "coa", "specification"] as const satisfies readonly DocumentType[]
const modeLabels: Record<DocumentType, string> = {
  sds: "SDS / MSDS",
  coa: "Certificate of Analysis",
  specification: "Specification",
}
const PRODUCT_PLACEHOLDER = "Product name, CAS number or product code…"

// No document or certificate records exist in this build, so nothing here says
// that a file is available. A found product leads to a request, never a claim.
type Status =
  | { kind: "idle" }
  | { kind: "document"; product: Product }
  | { kind: "coa"; product: Product; lot: string }
  | { kind: "choose"; candidates: Product[] }
  | { kind: "error"; message: string }
  | { kind: "product-not-found"; noResult?: NoResult }

export default function DocumentSearch() {
  const { documentRequest } = useSearch()
  const [activeType, setActiveType] = useState(0)
  const [query, setQuery] = useState("")
  const [product, setProduct] = useState<Product | null>(null)
  const [lot, setLot] = useState("")
  const [status, setStatus] = useState<Status>({ kind: "idle" })
  const lotRef = useRef<HTMLInputElement | null>(null)
  const productRef = useRef<HTMLInputElement | null>(null)
  const mode: DocumentType | undefined = modes[activeType]

  const clearState = () => {
    setQuery("")
    setProduct(null)
    setLot("")
    setStatus({ kind: "idle" })
  }
  const selectType = (index: number) => {
    setActiveType(index)
    clearState()
  }

  // Product search can hand a product over ("SDS acetone" → here, pre-filled).
  useEffect(() => {
    if (!documentRequest) return
    const requested = documentRequest.productId
      ? findProductById(documentRequest.productId)
      : undefined
    setActiveType(modes.indexOf(documentRequest.type))
    setLot("")
    setQuery(requested?.name ?? "")
    setProduct(requested ?? null)
    setStatus(
      requested && documentRequest.type !== "coa"
        ? { kind: "document", product: requested }
        : { kind: "idle" },
    )
  }, [documentRequest])

  const chooseProduct = (chosen: Product) => {
    setProduct(chosen)
    setQuery(chosen.name)
    if (mode === "coa") {
      setStatus({ kind: "idle" })
      lotRef.current?.focus()
    } else setStatus({ kind: "document", product: chosen })
  }

  /** The product the form currently identifies, resolved through the shared lookup. */
  const resolveProduct = (value: string): Product | null => {
    if (product && product.name === value) return product
    if (!value.trim()) {
      setStatus({ kind: "error", message: "Enter a product name, CAS number or product code." })
      return null
    }
    const lookup = lookupProduct(value)
    if (lookup.product) return lookup.product
    setProduct(null)
    setStatus(
      lookup.candidates.length
        ? { kind: "choose", candidates: lookup.candidates.slice(0, 5) }
        : { kind: "product-not-found", noResult: lookup.outcome.noResult },
    )
    return null
  }

  const search = (value = query) => {
    const found = resolveProduct(value)
    if (!found) return
    setProduct(found)
    setQuery(found.name)
    if (mode !== "coa") {
      setStatus({ kind: "document", product: found })
      return
    }
    if (!lot.trim()) {
      setStatus({ kind: "error", message: "Lot or batch number is required." })
      lotRef.current?.focus()
      return
    }
    // The lot is passed on exactly as typed; it is never guessed or corrected.
    setStatus({ kind: "coa", product: found, lot: lot.trim() })
  }
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    search()
  }

  const productField = (
    <ChemicalSearchField
      id="document-product-query"
      variant="document"
      scope="products"
      value={query}
      onChange={(value) => {
        setQuery(value)
        setProduct(null)
        setStatus({ kind: "idle" })
      }}
      onSubmit={search}
      onSelectProduct={chooseProduct}
      placeholder={PRODUCT_PLACEHOLDER}
      submitLabel={mode === "coa" ? "Search certificate" : "Search documents"}
      inputRef={productRef}
    />
  )
  const retry = () => {
    clearState()
    productRef.current?.focus()
  }

  return (
    <section className="documents" id="documents">
      <div>
        <p className="eyebrow light">Documentation center</p>
        <h2>
          The document
          <br />
          behind the chemistry.
        </h2>
        <p>Access product documentation or connect with technical support.</p>
      </div>
      <div className="document-panel">
        <div className="document-form-shell" key={activeType}>
          {!mode ? (
            <div className="support-mode">
              <span className="support-eyebrow">Technical support</span>
              <h3>Need help finding a document or product specification?</h3>
              <p>
                Our technical team can assist with product documentation and
                laboratory requirements.
              </p>
              <div className="support-actions">
                <a href="#contact">
                  Contact technical support <Arrow />
                </a>
              </div>
            </div>
          ) : (
            <form className="document-form" onSubmit={handleSubmit} noValidate>
              {mode === "coa" ? (
                <>
                  <div className="coa-grid">
                    <div className="document-product-field">
                      <label htmlFor="document-product-query">
                        <span>
                          Product <b>*</b>
                        </span>
                      </label>
                      {productField}
                    </div>
                    <label className="coa-lot">
                      <span>
                        Lot / Batch Number <b>*</b>
                      </span>
                      <input
                        ref={lotRef}
                        value={lot}
                        onChange={(e) => {
                          setLot(e.target.value)
                          setStatus({ kind: "idle" })
                        }}
                        placeholder="Enter lot or batch number…"
                        aria-describedby="coa-lot-hint"
                        autoComplete="off"
                        autoCapitalize="characters"
                        spellCheck={false}
                      />
                    </label>
                  </div>
                  <p className="coa-hint" id="coa-lot-hint">
                    Find the lot number on the product label. Check O vs 0 and I vs 1.
                  </p>
                  <button className="document-submit" type="submit">
                    Search certificate <Arrow />
                  </button>
                </>
              ) : (
                <div className="document-product-field">
                  <label htmlFor="document-product-query">
                    <span>
                      {mode === "sds" ? "Search SDS / MSDS" : "Search Specifications"}
                    </span>
                  </label>
                  {productField}
                </div>
              )}

              {status.kind === "document" && (
                <div className="documentation-result" aria-live="polite">
                  <b>{modeLabels[mode]}</b>
                  <strong>{status.product.name}</strong>
                  {status.product.code && <span>Product code: {status.product.code}</span>}
                  {status.product.cas && <span>CAS: {status.product.cas}</span>}
                  {status.product.formula && <span>Formula: {status.product.formula}</span>}
                  <span>Not available online yet. Request it from our team.</span>
                  <a
                    className="document-request"
                    href={documentRequestHref(status.product, modeLabels[mode])}
                  >
                    Request {mode === "sds" ? "SDS / MSDS" : "specification"} <Arrow />
                  </a>
                </div>
              )}
              {status.kind === "coa" && (
                <div className="documentation-result" aria-live="polite">
                  <b>Certificate of Analysis</b>
                  <strong>{status.product.name}</strong>
                  {status.product.code && <span>Product code: {status.product.code}</span>}
                  <span>Lot / batch: {status.lot}</span>
                  <span>Certificates are not available online yet. Request it from our team.</span>
                  <a
                    className="document-request"
                    href={documentRequestHref(status.product, modeLabels.coa, status.lot)}
                  >
                    Request certificate <Arrow />
                  </a>
                </div>
              )}
              {status.kind === "choose" && (
                <div className="document-choose" role="status">
                  <strong>Several products match. Choose one:</strong>
                  <div>
                    {status.candidates.map((candidate) => (
                      <button
                        type="button"
                        onClick={() => chooseProduct(candidate)}
                        key={candidate.id}
                      >
                        {candidate.name}
                        {candidate.code && <small>{candidate.code}</small>}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {status.kind === "error" && (
                <div className="documentation-error" role="alert">
                  {status.message}
                </div>
              )}
              {status.kind === "product-not-found" && (
                <div className="document-no-result" role="alert">
                  <strong>No matching product found</strong>
                  <p>
                    {status.noResult && status.noResult.kind !== "text"
                      ? noResultMessage(status.noResult)
                      : "Check the product name, CAS number or product code."}
                  </p>
                  <div>
                    <button type="button" onClick={retry}>
                      Try again
                    </button>
                    <span>
                      Can’t locate the document?
                      <a href="#contact">
                        Contact technical support <Arrow />
                      </a>
                    </span>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>
        <div className="document-modes" role="tablist" aria-label="Document type">
          {documentTypes.map(([number, label], index) => (
            <button
              type="button"
              role="tab"
              aria-selected={activeType === index}
              className={activeType === index ? "active" : ""}
              onClick={() => selectType(index)}
              key={label}
            >
              <span>{number}</span>
              {label}
              <Arrow />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
