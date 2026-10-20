import { digitsOnly, normalizeFormula } from "./normalize.ts"
import type { DocumentType, Intent } from "./types.ts"

/**
 * Piochem catalogue numbers are six digits, as printed on every product label
 * in the current data (584922, 573723…). Revisit when the full catalogue lands.
 */
export const PRODUCT_CODE_LENGTH = 6
const MIN_CODE_PREFIX = 3

/** CAS check digit: weighted sum of the other digits, right to left, mod 10. */
export function isValidCasDigits(digits: string) {
  if (!/^\d{5,10}$/.test(digits)) return false
  const body = digits.slice(0, -1)
  let sum = 0
  for (let i = 0; i < body.length; i++) {
    sum += Number(body[body.length - 1 - i]) * (i + 1)
  }
  return sum % 10 === Number(digits[digits.length - 1])
}

/** 75058 → 75-05-8. The last three digits always split 2 + 1. */
export const formatCas = (digits: string) =>
  `${digits.slice(0, -3)}-${digits.slice(-3, -1)}-${digits.slice(-1)}`

const ELEMENTS = new Set(
  (
    "H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn " +
    "Ga Ge As Se Br Kr Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe Cs Ba La " +
    "Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Er Tm Yb Lu Hf Ta W Re Os Ir Pt Au Hg Tl Pb Bi Po " +
    "At Rn Fr Ra Ac Th Pa U Np Pu Am Cm Bk Cf Es Fm Md No Lr Rf Db Sg Bh Hs Mt Ds Rg " +
    "Cn Nh Fl Mc Lv Ts Og"
  ).split(" "),
)

/** Correctly-cased run of two or more element symbols, e.g. NaOH. */
function isElementRun(value: string) {
  const symbols = value.match(/[A-Z][a-z]?/g)
  return (
    !!symbols &&
    symbols.length >= 2 &&
    symbols.join("") === value &&
    symbols.every((symbol) => ELEMENTS.has(symbol))
  )
}

export type KnownIdentifiers = {
  codes: Set<string>
  /** Normalized formulas and aliases, lowercased. */
  formulas: Set<string>
}

/**
 * Classify what the user is typing. Identifier intents (CAS, code) are matched
 * strictly; only free text is eligible for typo tolerance.
 */
export function detectIntent(text: string, known?: KnownIdentifiers): Intent {
  const value = text.trim()
  if (!value) return { kind: "empty" }

  const casCandidate = value
    .replace(/^cas(\s*(no|number|#))?\.?\s*:?\s*/i, "")
    .replace(/[‐‑‒–—−]/g, "-")
    .replace(/\s+/g, "")

  if (/^\d+$/.test(casCandidate)) {
    const digits = casCandidate
    if (known?.codes.has(digits)) return { kind: "code", code: digits, partial: false }
    if (isValidCasDigits(digits)) {
      return { kind: "cas", cas: formatCas(digits), status: "valid" }
    }
    if (digits.length === PRODUCT_CODE_LENGTH) {
      return { kind: "code", code: digits, partial: false }
    }
    if (digits.length >= MIN_CODE_PREFIX && digits.length < PRODUCT_CODE_LENGTH) {
      return { kind: "code", code: digits, partial: true }
    }
    return { kind: "text" }
  }

  if (/^\d[\d-]*$/.test(casCandidate)) {
    if (/^\d{2,7}-\d{2}-\d$/.test(casCandidate)) {
      return {
        kind: "cas",
        cas: casCandidate,
        status: isValidCasDigits(digitsOnly(casCandidate)) ? "valid" : "invalid-check",
      }
    }
    if (/^\d{2,7}-(\d{0,2}|\d{2}-)$/.test(casCandidate)) {
      return { kind: "cas", cas: casCandidate, status: "partial" }
    }
    // Hyphens in the wrong places: rescue it only when the digits prove it.
    const digits = digitsOnly(casCandidate)
    return isValidCasDigits(digits)
      ? { kind: "cas", cas: formatCas(digits), status: "valid" }
      : { kind: "cas", cas: casCandidate, status: "invalid-format" }
  }

  const formula = normalizeFormula(value)
  if (known?.formulas.has(formula.toLowerCase())) return { kind: "formula", formula }
  if (/^[A-Za-z][A-Za-z0-9()[\]·]*$/.test(formula)) {
    if (/\d/.test(formula) || isElementRun(formula)) return { kind: "formula", formula }
  }
  return { kind: "text" }
}

const DOCUMENT_WORDS: Record<string, DocumentType> = {
  sds: "sds",
  msds: "sds",
  coa: "coa",
  certificate: "coa",
  certificates: "coa",
  specification: "specification",
  specifications: "specification",
  spec: "specification",
  specs: "specification",
}
// Only dropped alongside a document word ("safety data sheet", "certificate of analysis").
const DOCUMENT_FILLER = new Set(["safety", "data", "sheet", "sheets", "of", "analysis", "for"])

/** Split document words out of a query: "SDS acetone" → sds + "acetone". */
export function splitDocumentWords(query: string): {
  productQuery: string
  type?: DocumentType
} {
  const words = query.split(" ").filter(Boolean)
  const keyOf = (word: string) => word.toLowerCase().replace(/[^a-z]/g, "")
  const type = words.map((word) => DOCUMENT_WORDS[keyOf(word)]).find(Boolean)
  if (!type) return { productQuery: query }
  return {
    type,
    productQuery: words
      .filter((word) => !DOCUMENT_WORDS[keyOf(word)] && !DOCUMENT_FILLER.has(keyOf(word)))
      .join(" "),
  }
}
