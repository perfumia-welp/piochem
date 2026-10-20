import { KeyboardEvent, ReactNode, RefObject, useEffect, useMemo, useRef, useState } from "react"
import { highlightRanges } from "../../search/normalize"
import {
  MAX_PRODUCT_SUGGESTIONS,
  queryIntent,
  searchProducts,
} from "../../search/searchProducts"
import type {
  DocumentType,
  Product,
  SearchOutcome,
  SuggestionGroup,
} from "../../search/types"
import NoResultNotice from "./NoResultNotice"

const Arrow = () => (
  <svg viewBox="0 0 20 20" aria-hidden="true">
    <path d="M4 10h11M11 6l4 4-4 4" />
  </svg>
)
const SearchIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="11" cy="11" r="6.5" />
    <path d="m16 16 4 4" />
  </svg>
)

// Local data answers instantly; the short pause only stops the list flickering
// mid-word. CAS numbers, codes and formulas skip it entirely.
const DEBOUNCE_MS = 120

type Variant = "finder" | "header" | "document"
const boxClass: Record<Variant, string> = {
  finder: "search-box",
  header: "cs-box-light",
  document: "document-input",
}
const submitClass: Record<Variant, string | undefined> = {
  finder: "search-submit",
  header: "search-submit",
  document: undefined,
}

type Option =
  | { type: "product"; group: SuggestionGroup }
  | { type: "category"; category: string }
  | { type: "documents" }
  | { type: "didYouMean"; text: string }
  | { type: "all" }

type Props = {
  id: string
  variant: Variant
  value: string
  onChange: (value: string) => void
  /** Enter with nothing highlighted, or the arrow button. Same path for both. */
  onSubmit: (query: string) => void
  onSelectProduct: (product: Product, group: SuggestionGroup) => void
  onSelectCategory?: (category: string) => void
  onOpenDocuments?: (type: DocumentType, productId?: string) => void
  /** Escape pressed while the suggestion list is already closed. */
  onEscape?: () => void
  /** "products" limits suggestions to products, for document lookup. */
  scope?: "all" | "products"
  placeholder: string
  submitLabel: string
  inputRef?: RefObject<HTMLInputElement | null>
}

const intentLabel = (outcome: SearchOutcome) => {
  const { intent } = outcome
  if (intent.kind === "cas") return "Searching by CAS number"
  if (intent.kind === "code") return "Searching by catalogue number"
  if (intent.kind === "formula") return "Searching by molecular formula"
  return ""
}

function Highlighted({ text, query }: { text: string; query: string }) {
  const ranges = highlightRanges(text, query)
  // A fully matched name needs no emphasis; highlighting is for partial matches.
  const whole = ranges.length === 1 && ranges[0][0] === 0 && ranges[0][1] === text.length
  if (!ranges.length || whole) return <>{text}</>
  const parts: ReactNode[] = []
  let cursor = 0
  ranges.forEach(([from, to]) => {
    if (from > cursor) parts.push(text.slice(cursor, from))
    parts.push(<mark key={from}>{text.slice(from, to)}</mark>)
    cursor = to
  })
  if (cursor < text.length) parts.push(text.slice(cursor))
  return <>{parts}</>
}

function ProductOption({ group, query }: { group: SuggestionGroup; query: string }) {
  const { lead, products } = group
  const { product } = lead
  const several = products.length > 1
  const grades = new Set(products.map((item) => item.grade).filter(Boolean))
  const side = several
    ? `${products.length} ${grades.size === products.length ? "grades" : "variants"}`
    : (product.grade ?? product.qualifier)

  // Only real values, with the identifier the user searched by placed first.
  const facts = [
    product.cas && { field: "cas", text: `CAS ${product.cas}` },
    product.formula && { field: "formula", text: product.formula },
    !several && product.code && { field: "code", text: `Cat. No. ${product.code}` },
  ].filter((fact): fact is { field: string; text: string } => !!fact)
  facts.sort((a, b) => Number(b.field === lead.field) - Number(a.field === lead.field))

  return (
    <span className="cs-option-main">
      <span className="cs-line">
        <span className="cs-name">
          {lead.field === "name" && !lead.fuzzy ? (
            <Highlighted text={product.name} query={query} />
          ) : (
            product.name
          )}
        </span>
        {side && <span className="cs-side">{side}</span>}
      </span>
      <span className="cs-meta">
        {lead.field === "synonym" && lead.matchedText && (
          <span className="cs-em">
            Also known as{" "}
            {lead.fuzzy ? lead.matchedText : <Highlighted text={lead.matchedText} query={query} />}
          </span>
        )}
        {facts.map((fact) => (
          <span className={fact.field === lead.field ? "cs-em" : undefined} key={fact.field}>
            {fact.text}
          </span>
        ))}
      </span>
    </span>
  )
}

/**
 * The one chemical search input: an accessible combobox over the shared search
 * engine. Header search, the Chemical Finder and the Documentation Center all
 * render this, so they share data, ranking, intent detection and autocomplete.
 */
export default function ChemicalSearchField({
  id,
  variant,
  value,
  onChange,
  onSubmit,
  onSelectProduct,
  onSelectCategory,
  onOpenDocuments,
  onEscape,
  scope = "all",
  placeholder,
  submitLabel,
  inputRef,
}: Props) {
  const ownRef = useRef<HTMLInputElement | null>(null)
  const ref = inputRef ?? ownRef
  const [term, setTerm] = useState(value)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)

  useEffect(() => {
    if (queryIntent(value).kind !== "text") {
      setTerm(value)
      return
    }
    const timer = window.setTimeout(() => setTerm(value), DEBOUNCE_MS)
    return () => window.clearTimeout(timer)
  }, [value])

  const outcome = useMemo(() => searchProducts(term), [term])
  const options = useMemo(() => {
    const list: Option[] = outcome.groups
      .slice(0, MAX_PRODUCT_SUGGESTIONS)
      .map((group) => ({ type: "product", group }))
    if (scope === "all") {
      outcome.categories.forEach((category) => list.push({ type: "category", category }))
      if (outcome.documentIntent) list.push({ type: "documents" })
    }
    if (outcome.noResult?.kind === "text" && outcome.noResult.didYouMean) {
      list.push({ type: "didYouMean", text: outcome.noResult.didYouMean })
    }
    if (scope === "all" && outcome.matches.length) list.push({ type: "all" })
    return list
  }, [outcome, scope])

  const listId = `${id}-listbox`
  const optionId = (index: number) => `${id}-option-${index}`
  const showPanel = open && (options.length > 0 || !!outcome.noResult)
  const expanded = showPanel && options.length > 0

  useEffect(() => {
    if (active >= 0) document.getElementById(optionId(active))?.scrollIntoView({ block: "nearest" })
  }, [active])

  const submit = () => {
    setOpen(false)
    setActive(-1)
    onSubmit(value)
  }
  const choose = (option: Option) => {
    setOpen(false)
    setActive(-1)
    if (option.type === "product") onSelectProduct(option.group.lead.product, option.group)
    else if (option.type === "category") onSelectCategory?.(option.category)
    else if (option.type === "documents") {
      onOpenDocuments?.(outcome.documentIntent!.type, outcome.documentIntent!.product?.id)
    } else if (option.type === "didYouMean") {
      onChange(option.text)
      onSubmit(option.text)
    } else submit()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault()
      if (!open) setOpen(true)
      else if (options.length) setActive((current) => (current + 1) % options.length)
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      // Stepping above the first suggestion returns to the typed query.
      if (open && options.length) {
        setActive((current) => (current < 0 ? options.length - 1 : current - 1))
      }
    } else if (event.key === "Enter") {
      event.preventDefault()
      if (showPanel && active >= 0 && options[active]) choose(options[active])
      else submit()
    } else if (event.key === "Escape") {
      if (showPanel) {
        event.stopPropagation()
        setOpen(false)
        setActive(-1)
      } else onEscape?.()
    }
    // Tab is left alone: focus moves on and the blur handler closes the list.
  }

  let index = -1
  const renderOption = (option: Option, content: ReactNode, className = "") => {
    index += 1
    const position = index
    return (
      <div
        role="option"
        id={optionId(position)}
        aria-selected={active === position}
        className={`cs-option ${className}${active === position ? " is-active" : ""}`}
        onMouseMove={() => active !== position && setActive(position)}
        onClick={() => choose(option)}
        key={position}
      >
        {content}
      </div>
    )
  }

  const productOptions = options.filter((option) => option.type === "product")
  const categoryOptions = options.filter((option) => option.type === "category")
  const documentOption = options.find((option) => option.type === "documents")
  const didYouMean = options.find((option) => option.type === "didYouMean")
  const allOption = options.find((option) => option.type === "all")
  const label = intentLabel(outcome)

  return (
    <div className={`cs-field cs-field--${variant}`}>
      <div className={boxClass[variant]}>
        <SearchIcon />
        <input
          id={id}
          ref={ref}
          role="combobox"
          aria-autocomplete="list"
          aria-haspopup="listbox"
          aria-expanded={expanded}
          aria-controls={listId}
          aria-activedescendant={expanded && active >= 0 ? optionId(active) : undefined}
          value={value}
          onChange={(event) => {
            onChange(event.target.value)
            setOpen(true)
            setActive(-1)
          }}
          onFocus={() => value.trim() && setOpen(true)}
          onBlur={() => {
            setOpen(false)
            setActive(-1)
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="search"
        />
        <button
          type="button"
          className={submitClass[variant]}
          aria-label={submitLabel}
          onMouseDown={(event) => event.preventDefault()}
          onClick={submit}
        >
          <Arrow />
        </button>
      </div>
      {showPanel && (
        // Keeps focus in the input while the pointer works inside the panel.
        <div className="cs-panel" onMouseDown={(event) => event.preventDefault()}>
          {label && <div className="cs-intent">{label}</div>}
          {outcome.correctedTo && (
            <div className="cs-corrected">
              Showing results for <b>“{outcome.correctedTo}”</b>
            </div>
          )}
          {/* A family name is answered by its own suggestion below, not by a notice. */}
          {outcome.noResult && outcome.noResult.kind !== "category-empty" && (
            <NoResultNotice
              noResult={outcome.noResult}
              query={outcome.productQuery}
              allowRequest={scope === "all"}
              onCheckNumber={() => {
                ref.current?.focus()
                ref.current?.select()
              }}
            />
          )}
          <div id={listId} role="listbox" aria-label="Search suggestions">
            {productOptions.length > 0 && (
              <div className="cs-group" role="group" aria-label="Products">
                <div className="cs-group-label" aria-hidden="true">
                  Products
                </div>
                {productOptions.map(
                  (option) =>
                    option.type === "product" &&
                    renderOption(
                      option,
                      <ProductOption group={option.group} query={outcome.productQuery} />,
                    ),
                )}
              </div>
            )}
            {categoryOptions.length > 0 && (
              <div className="cs-group" role="group" aria-label="Product families">
                <div className="cs-group-label" aria-hidden="true">
                  Product families
                </div>
                {categoryOptions.map(
                  (option) =>
                    option.type === "category" &&
                    renderOption(
                      option,
                      <>
                        <span className="cs-name">
                          <Highlighted text={option.category} query={outcome.productQuery} />
                        </span>
                        <span className="cs-side cs-side--action">
                          Explore this product family <Arrow />
                        </span>
                      </>,
                      "cs-option--simple",
                    ),
                )}
              </div>
            )}
            {documentOption && (
              <div className="cs-group" role="group" aria-label="Documentation">
                <div className="cs-group-label" aria-hidden="true">
                  Documentation
                </div>
                {renderOption(
                  documentOption,
                  <>
                    <span className="cs-name">Find SDS / COA / Specifications</span>
                    <Arrow />
                  </>,
                  "cs-option--simple",
                )}
              </div>
            )}
            {didYouMean?.type === "didYouMean" && (
              <div className="cs-group" role="group" aria-label="Did you mean">
                <div className="cs-group-label" aria-hidden="true">
                  Did you mean
                </div>
                {renderOption(
                  didYouMean,
                  <>
                    <span className="cs-name">{didYouMean.text}</span>
                    <Arrow />
                  </>,
                  "cs-option--simple",
                )}
              </div>
            )}
            {allOption && (
              <div className="cs-footer">
                {renderOption(
                  allOption,
                  <>
                    <span>
                      View all {outcome.matches.length}{" "}
                      {outcome.matches.length === 1 ? "result" : "results"}
                    </span>
                    <Arrow />
                  </>,
                  "cs-option--all",
                )}
                <span className="cs-keys" aria-hidden="true">
                  ↑↓ to move · Enter to select · Esc to close
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
