import { catalogue, categoryNames } from "./catalogue.ts"
import { detectIntent, splitDocumentWords, type KnownIdentifiers } from "./intent.ts"
import { cleanQuery, editDistance, foldText } from "./normalize.ts"
import {
  fuzzyBudget,
  indexProduct,
  rankProducts,
  rankQuery,
  TIER,
  type IndexedProduct,
} from "./rank.ts"
import type {
  Intent,
  NoResult,
  Product,
  ProductMatch,
  SearchOutcome,
  SuggestionGroup,
} from "./types.ts"

/** Free-text suggestions begin here; CAS, codes and formulas are recognised sooner. */
export const MIN_TEXT_LENGTH = 2
export const MAX_PRODUCT_SUGGESTIONS = 5
export const MAX_CATEGORY_SUGGESTIONS = 2

type Index = { entries: IndexedProduct[]; known: KnownIdentifiers }
const indexes = new WeakMap<Product[], Index>()

function indexOf(products: Product[]): Index {
  let index = indexes.get(products)
  if (!index) {
    const entries = products.map(indexProduct)
    index = {
      entries,
      known: {
        codes: new Set(products.flatMap((product) => product.code ?? [])),
        formulas: new Set(
          entries.flatMap((entry) => entry.formulas.map((f) => f.normalized.toLowerCase())),
        ),
      },
    }
    indexes.set(products, index)
  }
  return index
}

/** What the user appears to be typing, checked against the catalogue's identifiers. */
export function queryIntent(value: string, products: Product[] = catalogue): Intent {
  const { productQuery } = splitDocumentWords(cleanQuery(value))
  return detectIntent(productQuery, indexOf(products).known)
}

function groupMatches(matches: ProductMatch[]): SuggestionGroup[] {
  const groups = new Map<string, SuggestionGroup>()
  for (const match of matches) {
    const { product } = match
    const key = `${product.cas ?? ""}|${foldText(product.name)}`
    const group = groups.get(key)
    if (group) group.products.push(product)
    else groups.set(key, { key, lead: match, products: [product] })
  }
  return [...groups.values()]
}

function matchCategories(folded: string, matches: ProductMatch[]) {
  const tokens = folded ? folded.split(" ") : []
  const named = tokens.length
    ? categoryNames.filter((name) => {
        const words = foldText(name).split(" ")
        return tokens.every((token) => words.some((word) => word.startsWith(token)))
      })
    : []
  const fromProducts = matches.flatMap((match) => match.product.category ?? [])
  return [...new Set([...named, ...fromProducts])].slice(0, MAX_CATEGORY_SUGGESTIONS)
}

/** Closest name or synonym, one error looser than the automatic typo tolerance. */
function closestName(folded: string, entries: IndexedProduct[]) {
  if (folded.length < 4) return undefined
  const budget = fuzzyBudget(folded.length) + 1
  let best: { display: string; distance: number } | undefined
  for (const entry of entries) {
    for (const target of [entry.name, ...entry.synonyms]) {
      if (target.folded[0] !== folded[0]) continue
      const distance = editDistance(folded, target.folded)
      if (distance <= budget && (!best || distance < best.distance)) {
        best = { display: target.hidden ? entry.name.display : target.display, distance }
      }
    }
  }
  return best?.display
}

function describeNoResult(
  intent: Intent,
  productQuery: string,
  folded: string,
  entries: IndexedProduct[],
): NoResult | undefined {
  if (intent.kind === "cas") {
    if (intent.status === "valid") return { kind: "cas-not-found", cas: intent.cas }
    if (intent.status === "invalid-check") return { kind: "cas-invalid-check", cas: intent.cas }
    if (intent.status === "invalid-format") return { kind: "cas-invalid-format", cas: intent.cas }
    return undefined
  }
  if (intent.kind === "code") {
    return intent.partial ? undefined : { kind: "code-not-found", code: intent.code }
  }
  if (folded.length < MIN_TEXT_LENGTH) return undefined
  const category = categoryNames.find((name) => foldText(name) === folded)
  if (category) return { kind: "category-empty", category }
  return { kind: "text", query: productQuery, didYouMean: closestName(folded, entries) }
}

/**
 * The single search entry point. Header search, the Chemical Finder and the
 * Documentation Center all call this, so their matching rules cannot drift.
 */
export function searchProducts(value: string, products: Product[] = catalogue): SearchOutcome {
  const query = cleanQuery(value)
  const { productQuery, type } = splitDocumentWords(query)
  const { entries, known } = indexOf(products)
  const intent = detectIntent(productQuery, known)
  const ranked = rankQuery(productQuery, intent)

  const tooShort = intent.kind === "text" && ranked.folded.length < MIN_TEXT_LENGTH
  const matches = tooShort ? [] : rankProducts(entries, ranked)
  const top = matches[0]
  const categories = tooShort
    ? []
    : matchCategories(intent.kind === "text" ? ranked.folded : "", matches)

  return {
    query,
    productQuery,
    intent,
    matches,
    groups: groupMatches(matches),
    categories,
    documentIntent: type
      ? { type, product: top && top.score >= TIER.synonymWord ? top.product : undefined }
      : undefined,
    // A typo corrected through a search-only alias is reported as the product name.
    correctedTo: top?.fuzzy ? (top.matchedText ?? top.product.name) : undefined,
    noResult:
      matches.length || !productQuery
        ? undefined
        : describeNoResult(intent, productQuery, ranked.folded, entries),
  }
}

export type ProductLookup = {
  /** Set when the query identifies exactly one product. */
  product?: Product
  /** Plausible products when the query is ambiguous. */
  candidates: Product[]
  outcome: SearchOutcome
}

/**
 * Resolve a query to one product, for flows that need a specific product
 * (document retrieval). Exact identifiers and names resolve directly; anything
 * looser resolves only when it is the sole match.
 */
export function lookupProduct(value: string, products: Product[] = catalogue): ProductLookup {
  const outcome = searchProducts(value, products)
  const [top, next] = outcome.matches
  const candidates = outcome.matches.map((match) => match.product)
  if (!top) return { candidates, outcome }
  const exact = top.score >= TIER.formula - 1 && (!next || next.score < top.score)
  return {
    product: exact || outcome.matches.length === 1 ? top.product : undefined,
    candidates,
    outcome,
  }
}

export const findProductById = (id: string, products: Product[] = catalogue) =>
  products.find((product) => product.id === id)

