const SUBSCRIPTS = "₀₁₂₃₄₅₆₇₈₉"

/** Unicode subscript digits → regular digits (AgNO₃ → AgNO3). */
export const plainDigits = (value: string) =>
  value.replace(/[₀-₉]/g, (char) => String(SUBSCRIPTS.indexOf(char)))

/** Trim and collapse repeated whitespace. */
export const cleanQuery = (value: string) => value.replace(/\s+/g, " ").trim()

/**
 * Case-folded text for name matching: lowercase, no diacritics, punctuation
 * treated as a word break ("Nitric-Acid 70%" → "nitric acid 70").
 */
export const foldText = (value: string) =>
  plainDigits(value)
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()

/** Folded text without spaces, so "tri calcium" meets "TriCalcium". */
export const squash = (folded: string) => folded.replace(/ /g, "")

/**
 * Formula in comparable form: plain digits, no spaces, one hydrate dot.
 * Case is preserved; this is notation clean-up, not chemistry.
 */
export const normalizeFormula = (value: string) =>
  plainDigits(value)
    .replace(/\s+/g, "")
    .replace(/[.*•∙⋅]/g, "·")

export const digitsOnly = (value: string) => value.replace(/\D/g, "")

/** Optimal string alignment distance (insert, delete, substitute, transpose). */
export function editDistance(a: string, b: string) {
  const rows = a.length + 1
  const cols = b.length + 1
  const d: number[][] = Array.from({ length: rows }, (_, i) => {
    const row = new Array<number>(cols).fill(0)
    row[0] = i
    return row
  })
  for (let j = 0; j < cols; j++) d[0][j] = j
  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < cols; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost)
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1)
      }
    }
  }
  return d[a.length][b.length]
}

const isAlnum = (char: string) => /[a-z0-9]/.test(char)
const foldChar = (char: string) =>
  plainDigits(char)
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()

/** End index if `needle` (squashed) matches `text` from `start`, skipping punctuation. */
function spanFrom(text: string, start: number, needle: string) {
  let matched = 0
  let i = start
  while (matched < needle.length && i < text.length) {
    const char = foldChar(text[i])
    if (!isAlnum(char)) {
      i++
      continue
    }
    if (char !== needle[matched]) return null
    matched++
    i++
  }
  return matched === needle.length ? i : null
}

function wordStarts(text: string) {
  const starts: number[] = []
  for (let i = 0; i < text.length; i++) {
    if (isAlnum(foldChar(text[i])) && (i === 0 || !isAlnum(foldChar(text[i - 1])))) {
      starts.push(i)
    }
  }
  return starts
}

/**
 * Character ranges of `display` to highlight for a query. Matches only at word
 * starts, mirroring how ranking works, so "ace" never lights up "trace".
 */
export function highlightRanges(display: string, query: string): [number, number][] {
  const folded = foldText(query)
  if (!folded) return []
  const starts = wordStarts(display)
  const whole = squash(folded)
  for (const start of starts) {
    const end = spanFrom(display, start, whole)
    if (end !== null) return [[start, end]]
  }
  const ranges: [number, number][] = []
  for (const token of folded.split(" ")) {
    for (const start of starts) {
      if (ranges.some(([from, to]) => start >= from && start < to)) continue
      const end = spanFrom(display, start, token)
      if (end !== null) {
        ranges.push([start, end])
        break
      }
    }
  }
  return ranges.sort((a, b) => a[0] - b[0])
}
