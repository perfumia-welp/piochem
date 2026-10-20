import type { NoResult } from "../../search/types"
import { exploreFamily, familyAnchorId, requestProductHref } from "./SearchContext"

const Arrow = () => (
  <svg viewBox="0 0 20 20" aria-hidden="true">
    <path d="M4 10h11M11 6l4 4-4 4" />
  </svg>
)

export function noResultMessage(noResult: NoResult) {
  switch (noResult.kind) {
    case "cas-not-found":
      return `${noResult.cas} looks like a valid CAS number, but we couldn’t find it in the current catalogue.`
    case "cas-invalid-check":
      return "This looks like a CAS number, but the check digit does not match."
    case "cas-invalid-format":
      return "This looks like a CAS number, but the format is not valid. CAS numbers look like 75-05-8."
    case "code-not-found":
      return `We couldn’t find catalogue number ${noResult.code} in the current catalogue.`
    case "category-empty":
      return `${noResult.category} is a Piochem product family.`
    case "text":
      return `No products matched “${noResult.query}”.`
  }
}

type Props = {
  noResult: NoResult
  /** Query to pass to the product request. */
  query: string
  /** Puts focus back in the search field with its text selected. */
  onCheckNumber: () => void
  /** Offered as "Did you mean"; omit where the caller renders it itself. */
  onPick?: (text: string) => void
  /** Product request only makes sense in product discovery, not document lookup. */
  allowRequest?: boolean
  className?: string
}

/** Interpreted empty state shared by the autocomplete panel and the results section. */
export default function NoResultNotice({
  noResult,
  query,
  onCheckNumber,
  onPick,
  allowRequest = true,
  className = "",
}: Props) {
  const invalidCas =
    noResult.kind === "cas-invalid-check" || noResult.kind === "cas-invalid-format"
  return (
    <div className={`cs-notice ${className}`} role="status">
      <strong>{noResultMessage(noResult)}</strong>
      {noResult.kind === "text" && noResult.didYouMean && onPick && (
        <span className="cs-did-you-mean">
          Did you mean:{" "}
          <button type="button" onClick={() => onPick(noResult.didYouMean!)}>
            {noResult.didYouMean} <Arrow />
          </button>
        </span>
      )}
      <div className="cs-notice-actions">
        {invalidCas ? (
          <button type="button" onClick={onCheckNumber}>
            Check the number
          </button>
        ) : (
          <>
            {noResult.kind === "category-empty" && (
              <a
                href={`#${familyAnchorId(noResult.category)}`}
                onClick={(event) => {
                  event.preventDefault()
                  exploreFamily(noResult.category)
                }}
              >
                Explore this product family <Arrow />
              </a>
            )}
            {allowRequest && noResult.kind !== "category-empty" && (
              <a href={requestProductHref(query)}>
                Request this product <Arrow />
              </a>
            )}
            <a href="#contact">
              Contact technical support <Arrow />
            </a>
          </>
        )}
      </div>
    </div>
  )
}
