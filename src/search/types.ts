// Shared product model for every Piochem search surface (header search,
// Chemical Finder, Documentation Center). Shaped for the real catalogue/API:
// every field except id and name is optional and stays undefined until confirmed.

export type ProductDocuments = {
  technicalDataSheet?: { url: string; filename: string }
  sds?: { url: string; filename: string }
  specification?: { url: string; filename: string }
}

export type Product = {
  id: string
  /** Piochem catalogue number ("CAT No." on the label). */
  code?: string
  name: string
  /** Concentration or stabiliser line printed under the name. */
  qualifier?: string
  cas?: string
  /** Display formula; Unicode subscripts allowed. */
  formula?: string
  /** Alternate written forms (e.g. Hill notation), only when confirmed. */
  formulaAliases?: string[]
  /** Displayable synonyms; only when supplied by the Piochem catalogue. */
  synonyms?: string[]
  /** Matched by search like synonyms, but never rendered anywhere. */
  searchAliases?: string[]
  grade?: string
  category?: string
  purity?: string
  physicalForm?: string
  packSizes?: string[]
  /** Reserved for the document service. Not set or rendered until availability is verified. */
  documents?: ProductDocuments
  /** Reserved for structure search; not rendered. */
  smiles?: string
  inchiKey?: string
}

export type DocumentType = "sds" | "coa" | "specification"

export type Intent =
  | { kind: "empty" }
  | { kind: "text" }
  | {
      kind: "cas"
      /** Canonical hyphenated form when complete, otherwise the typed value. */
      cas: string
      status: "valid" | "partial" | "invalid-check" | "invalid-format"
    }
  | { kind: "code"; code: string; partial: boolean }
  | { kind: "formula"; formula: string }

export type MatchField =
  | "code"
  | "cas"
  | "name"
  | "synonym"
  | "formula"
  | "category"

export type ProductMatch = {
  product: Product
  score: number
  field: MatchField
  /** The synonym, formula alias or category that matched; unset for a search-only alias. */
  matchedText?: string
  fuzzy: boolean
}

/** Same chemical in several grades collapses to one autocomplete row. */
export type SuggestionGroup = {
  key: string
  lead: ProductMatch
  products: Product[]
}

export type NoResult =
  | { kind: "cas-not-found"; cas: string }
  | { kind: "cas-invalid-check"; cas: string }
  | { kind: "cas-invalid-format"; cas: string }
  | { kind: "code-not-found"; code: string }
  | { kind: "category-empty"; category: string }
  | { kind: "text"; query: string; didYouMean?: string }

export type SearchOutcome = {
  /** Trimmed, whitespace-collapsed input. */
  query: string
  /** Query with document words (SDS, COA…) removed. */
  productQuery: string
  intent: Intent
  matches: ProductMatch[]
  groups: SuggestionGroup[]
  categories: string[]
  /** Present when the query contains a document word. */
  documentIntent?: { type: DocumentType; product?: Product }
  /** Set when only typo-tolerant matches were found. */
  correctedTo?: string
  /** Set when a definite query found nothing. */
  noResult?: NoResult
}
