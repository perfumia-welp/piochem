import {
  digitsOnly,
  editDistance,
  foldText,
  normalizeFormula,
  squash,
} from "./normalize.ts"
import type { Intent, Product, ProductMatch } from "./types.ts"

/**
 * Relevance tiers, best first. Purity, pack size and the like never influence
 * rank, and there is deliberately no "substring anywhere" tier.
 */
export const TIER = {
  code: 100,
  cas: 95,
  name: 90,
  synonym: 85,
  formula: 80,
  // Still-being-typed identifiers sit below every exact match.
  formulaPrefix: 76,
  codePrefix: 74,
  casPrefix: 73,
  namePrefix: 70,
  synonymPrefix: 65,
  nameWord: 60,
  synonymWord: 58,
  fuzzy: 50,
  category: 40,
} as const

const MIN_FUZZY_LENGTH = 5
const LONG_TERM_LENGTH = 9

/** 1 error for shorter terms, 2 for longer names; none below 5 characters. */
export const fuzzyBudget = (length: number) =>
  length < MIN_FUZZY_LENGTH ? 0 : length < LONG_TERM_LENGTH ? 1 : 2

type Term = {
  display: string
  folded: string
  squashed: string
  words: string[]
  /** A search-only alias matches like a synonym but is never shown. */
  hidden?: boolean
}

export type IndexedProduct = {
  product: Product
  name: Term
  /** Name plus qualifier and grade words, for multi-word queries. */
  descriptorWords: string[]
  synonyms: Term[]
  formulas: { display: string; normalized: string }[]
  casDigits?: string
  category?: Term
}

const term = (display: string): Term => {
  const folded = foldText(display)
  return { display, folded, squashed: squash(folded), words: folded.split(" ") }
}

export function indexProduct(product: Product): IndexedProduct {
  const name = term(product.name)
  const extra = foldText([product.qualifier, product.grade].filter(Boolean).join(" "))
  return {
    product,
    name,
    descriptorWords: [...name.words, ...(extra ? extra.split(" ") : [])],
    synonyms: [
      ...(product.synonyms ?? []).map(term),
      ...(product.searchAliases ?? []).map((alias) => ({ ...term(alias), hidden: true })),
    ],
    formulas: [product.formula, ...(product.formulaAliases ?? [])]
      .filter((formula): formula is string => !!formula)
      .map((display) => ({ display, normalized: normalizeFormula(display) })),
    casDigits: product.cas ? digitsOnly(product.cas) : undefined,
    category: product.category ? term(product.category) : undefined,
  }
}

export type RankQuery = {
  intent: Intent
  folded: string
  squashed: string
  tokens: string[]
}

export const rankQuery = (text: string, intent: Intent): RankQuery => {
  const folded = foldText(text)
  return { intent, folded, squashed: squash(folded), tokens: folded ? folded.split(" ") : [] }
}

const isExact = (target: Term, query: RankQuery) =>
  target.folded === query.folded || target.squashed === query.squashed

const isPrefix = (target: Term, query: RankQuery) =>
  target.folded.startsWith(query.folded) || target.squashed.startsWith(query.squashed)

/** Every query token begins some word; the tokens need not be adjacent. */
const tokensStartWords = (words: string[], tokens: string[]) =>
  tokens.every((token) => words.some((word) => word.startsWith(token)))

/** The query begins at a word boundary inside the target ("citrate tet"). */
const startsAtWord = (target: Term, query: RankQuery) =>
  target.words.some((_, i) => target.words.slice(i).join(" ").startsWith(query.folded))

export function fuzzyDistance(query: string, target: string, budget: number) {
  if (!budget || query[0] !== target[0]) return null
  let best = Infinity
  if (Math.abs(query.length - target.length) <= budget) {
    best = editDistance(query, target)
  }
  // Tolerate a typo while the name is still being typed.
  if (target.length > query.length) {
    best = Math.min(best, editDistance(query, target.slice(0, query.length)))
  }
  return best <= budget ? best : null
}

function fuzzyTerm(target: Term, query: RankQuery, budget: number) {
  let best = fuzzyDistance(query.folded, target.folded, budget)
  if (query.tokens.length === 1) {
    for (const word of target.words) {
      if (word.length < MIN_FUZZY_LENGTH) continue
      const distance = fuzzyDistance(query.folded, word, budget)
      if (distance !== null && (best === null || distance < best)) best = distance
    }
  }
  return best
}

/** What may be shown for a synonym match: nothing, for a search-only alias. */
const shown = (synonym: Term) => (synonym.hidden ? undefined : synonym.display)

const hit = (
  entry: IndexedProduct,
  score: number,
  field: ProductMatch["field"],
  matchedText?: string,
  fuzzy = false,
): ProductMatch => ({ product: entry.product, score, field, matchedText, fuzzy })

/** Best match of one product against the query, or null. */
export function matchProduct(entry: IndexedProduct, query: RankQuery): ProductMatch | null {
  const { intent } = query
  const { product } = entry
  if (intent.kind === "empty") return null

  // Identifiers match strictly: no fuzziness, no fall-through to names.
  if (intent.kind === "code") {
    if (product.code === intent.code) return hit(entry, TIER.code, "code")
    if (intent.partial && product.code?.startsWith(intent.code)) {
      return hit(entry, TIER.codePrefix, "code")
    }
    return null
  }
  if (intent.kind === "cas") {
    if (intent.status === "valid" && entry.casDigits === digitsOnly(intent.cas)) {
      return hit(entry, TIER.cas, "cas")
    }
    if (intent.status === "partial" && product.cas?.startsWith(intent.cas)) {
      return hit(entry, TIER.casPrefix, "cas")
    }
    return null
  }

  if (!query.folded) return null
  let best: ProductMatch | null = null
  const offer = (candidate: ProductMatch) => {
    if (!best || candidate.score > best.score) best = candidate
  }

  if (isExact(entry.name, query)) offer(hit(entry, TIER.name, "name"))
  for (const synonym of entry.synonyms) {
    if (isExact(synonym, query)) offer(hit(entry, TIER.synonym, "synonym", shown(synonym)))
  }

  if (intent.kind === "formula") {
    const wanted = intent.formula
    for (const formula of entry.formulas) {
      // Exact case first, so Co and CO stay distinct when both exist.
      if (formula.normalized === wanted) {
        offer(hit(entry, TIER.formula, "formula", formula.display))
      } else if (formula.normalized.toLowerCase() === wanted.toLowerCase()) {
        offer(hit(entry, TIER.formula - 1, "formula", formula.display))
      } else if (formula.normalized.toLowerCase().startsWith(wanted.toLowerCase())) {
        offer(hit(entry, TIER.formulaPrefix, "formula", formula.display))
      }
    }
  }

  if (isPrefix(entry.name, query)) offer(hit(entry, TIER.namePrefix, "name"))
  for (const synonym of entry.synonyms) {
    if (isPrefix(synonym, query)) {
      offer(hit(entry, TIER.synonymPrefix, "synonym", shown(synonym)))
    }
  }

  if (
    startsAtWord(entry.name, query) ||
    (tokensStartWords(entry.descriptorWords, query.tokens) &&
      query.tokens.some((token) => entry.name.words.some((word) => word.startsWith(token))))
  ) {
    offer(hit(entry, TIER.nameWord, "name"))
  }
  for (const synonym of entry.synonyms) {
    if (startsAtWord(synonym, query) || tokensStartWords(synonym.words, query.tokens)) {
      offer(hit(entry, TIER.synonymWord, "synonym", shown(synonym)))
    }
  }

  if (entry.category) {
    if (
      isExact(entry.category, query) ||
      isPrefix(entry.category, query) ||
      tokensStartWords(entry.category.words, query.tokens)
    ) {
      offer(hit(entry, TIER.category, "category", entry.category.display))
    }
  }

  // Typo tolerance: free text only, and only when nothing better matched.
  const strongest = best as ProductMatch | null
  if (intent.kind === "text" && (!strongest || strongest.score < TIER.fuzzy)) {
    const budget = fuzzyBudget(query.folded.length)
    if (budget) {
      if (fuzzyTerm(entry.name, query, budget) !== null) {
        offer(hit(entry, TIER.fuzzy, "name", entry.name.display, true))
      } else {
        const synonym = entry.synonyms.find((s) => fuzzyTerm(s, query, budget) !== null)
        if (synonym) offer(hit(entry, TIER.fuzzy, "synonym", shown(synonym), true))
      }
    }
  }
  return best
}

/** Rank the whole catalogue. Ties break on the shorter, then alphabetical, name. */
export function rankProducts(entries: IndexedProduct[], query: RankQuery): ProductMatch[] {
  const matches = entries
    .map((entry) => matchProduct(entry, query))
    .filter((match): match is ProductMatch => match !== null)
  // A typo guess is only worth showing when no product matched outright.
  const direct = matches.some((match) => !match.fuzzy && match.field !== "category")
  return matches
    .filter((match) => !(direct && match.fuzzy))
    .sort(
      (a, b) =>
        b.score - a.score ||
        a.product.name.length - b.product.name.length ||
        a.product.name.localeCompare(b.product.name) ||
        (a.product.code ?? "").localeCompare(b.product.code ?? ""),
    )
}
