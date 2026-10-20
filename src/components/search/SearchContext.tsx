import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react"
import { cleanQuery, foldText } from "../../search/normalize"
import type { DocumentType, Product } from "../../search/types"

type Submitted = { query: string; nonce: number }
type DocumentRequest = { type: DocumentType; productId?: string; nonce: number }

type SearchContextValue = {
  /** The search currently shown in the results section, if any. */
  submitted: Submitted | null
  runSearch: (query: string) => void
  clearSearch: () => void
  /** A hand-off from product search to the Documentation Center. */
  documentRequest: DocumentRequest | null
  openDocuments: (type: DocumentType, productId?: string) => void
}

const SearchContext = createContext<SearchContextValue | null>(null)

const CONTACT_EMAIL = "info@piochem.com"

/** Piochem is an enquiry site: product requests go through the existing contact mailbox. */
export const requestProductHref = (query: string) =>
  `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Product request: ${query}`)}&body=${encodeURIComponent(
    `Hello Piochem,\n\nI am looking for: ${query}\n\nRequired grade / quantity:\n`,
  )}`

export const enquiryHref = (product: Product) => {
  const label = [product.name, product.grade, product.code && `Cat. No. ${product.code}`]
    .filter(Boolean)
    .join(", ")
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Enquiry: ${label}`)}`
}

/**
 * Documents are requested from the team: the site does not yet know which SDS,
 * COA or specification files exist, so it never claims that one is available.
 */
export const documentRequestHref = (
  product: Product,
  document = "SDS / COA / Specification",
  lot?: string,
) => {
  const lines = [
    `Product: ${product.name}`,
    product.code && `Cat. No.: ${product.code}`,
    product.cas && `CAS No.: ${product.cas}`,
    lot && `Lot / batch: ${lot}`,
    `Document: ${document}`,
  ].filter(Boolean)
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    `Document request: ${document}, ${product.name}`,
  )}&body=${encodeURIComponent(
    `Hello Piochem,\n\nPlease send the following document.\n\n${lines.join("\n")}\n`,
  )}`
}

/** Anchor id of a family's card in the Product Categories section. */
export const familyAnchorId = (family: string) => `family-${foldText(family).replace(/ /g, "-")}`

/**
 * A product family is a navigation term, not a product result: selecting one
 * goes to its card in the existing Product Categories section.
 */
export function exploreFamily(family: string) {
  const card = document.getElementById(familyAnchorId(family))
  if (!card) return
  card.scrollIntoView({ block: "center" })
  card.focus({ preventScroll: true })
}

export function focusFinder() {
  const input = document.getElementById("chemical-search") as HTMLInputElement | null
  if (!input) return
  input.scrollIntoView({ block: "center" })
  input.focus({ preventScroll: true })
  input.select()
}

const syncUrl = (query: string | null) => {
  const url = new URL(window.location.href)
  if (query) url.searchParams.set("q", query)
  else url.searchParams.delete("q")
  window.history.replaceState(window.history.state, "", url)
}

export function useSearch() {
  const value = useContext(SearchContext)
  if (!value) throw new Error("useSearch must be used inside SearchProvider")
  return value
}

export default function SearchProvider({ children }: { children: ReactNode }) {
  const [submitted, setSubmitted] = useState<Submitted | null>(() => {
    const query = cleanQuery(new URLSearchParams(window.location.search).get("q") ?? "")
    return query ? { query, nonce: 0 } : null
  })
  const [documentRequest, setDocumentRequest] = useState<DocumentRequest | null>(null)

  const runSearch = useCallback((value: string) => {
    const query = cleanQuery(value)
    if (!query) return
    setSubmitted((current) => ({ query, nonce: (current?.nonce ?? 0) + 1 }))
    syncUrl(query)
  }, [])
  const clearSearch = useCallback(() => {
    setSubmitted(null)
    syncUrl(null)
  }, [])
  const openDocuments = useCallback((type: DocumentType, productId?: string) => {
    setDocumentRequest((current) => ({ type, productId, nonce: (current?.nonce ?? 0) + 1 }))
    document.getElementById("documents")?.scrollIntoView()
  }, [])

  const value = useMemo(
    () => ({ submitted, runSearch, clearSearch, documentRequest, openDocuments }),
    [submitted, runSearch, clearSearch, documentRequest, openDocuments],
  )
  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
}
