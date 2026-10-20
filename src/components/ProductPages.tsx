import { useEffect, useMemo, useState } from "react"
import type { CSSProperties } from "react"
import ChemicalSearchField from "./search/ChemicalSearchField"
import NoResultNotice from "./search/NoResultNotice"
import { catalogue } from "../search/catalogue"
import { searchProducts } from "../search/searchProducts"
import type { Product } from "../search/types"

const Arrow = () => <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h11M11 6l4 4-4 4" /></svg>
const image = (product: Product, detail = false) => {
  const base = `/images/products/showcase/${product.id}`
  return <picture><source type="image/avif" srcSet={`${base}-560.avif 560w, ${base}-720.avif 720w, ${base}.avif 1000w`} /><source type="image/webp" srcSet={`${base}-560.webp 560w, ${base}-720.webp 720w, ${base}.webp 1000w`} /><img src={`${base}-560.webp`} alt={`Piochem ${product.name}`} loading={detail ? "eager" : "lazy"} decoding="async" sizes={detail ? "(max-width: 800px) 86vw, 42vw" : "(max-width: 700px) 86vw, (max-width: 1200px) 38vw, 25vw"} /></picture>
}
const facts = (product: Product) => [
  ["Cat. no.", product.code], ["CAS", product.cas], ["Formula", product.formula], ["Pack size", product.packSizes?.join(", ")],
].filter(([, value]) => value)
const requestHref = (subject: string, product?: Product) => `mailto:info@piochem.com?subject=${encodeURIComponent(`${subject}${product ? ` — ${product.name} (${product.code ?? "catalogue"})` : ""}`)}`

function CatalogueCard({ product, detailsOpen, onToggleDetails }: { product: Product; detailsOpen: boolean; onToggleDetails: () => void }) {
  const canonical = product.documents?.technicalDataSheet
  const overlayId = `pcard-overlay-${product.id}`
  const qualifier = product.grade || product.qualifier
  const longQualifier = (qualifier?.length ?? 0) > 28
  const technicalFacts = [
    ["Catalogue no.", product.code],
    ["CAS no.", product.cas],
    ["Formula", product.formula],
    ["Pack size", product.packSizes?.join(", ")],
    ...(longQualifier ? [["Qualifier", qualifier]] : []),
  ].filter(([, value]) => value)
  // The technical sheet is an absolute overlay over the resting card, so it never
  // adds height. The actions bar sits above it and serves both states.
  return <article className={`pcard${detailsOpen ? " details-open" : ""}`}>
    <a className="pcard-image" href={`/products/${product.id}`} aria-label={`View ${product.name}`}>{image(product)}</a>
    <div className="pcard-body">
      <div className="pcard-title"><div><h2>{product.name}</h2>{qualifier && !longQualifier && <p>{qualifier}</p>}</div><span>{product.formula}</span></div>
    </div>
    <div className="pcard-overlay" id={overlayId}>
      <div className="pcard-overlay-head" aria-hidden="true"><strong>{product.name}</strong><span>{product.formula}</span></div>
      <dl className="pcard-specs">{technicalFacts.map(([label, value], index) => <div key={label} style={{ "--row-delay": `${index * 50}ms` } as CSSProperties}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
    </div>
    <button className="pcard-details-toggle" type="button" aria-expanded={detailsOpen} aria-controls={overlayId} onClick={onToggleDetails}>{detailsOpen ? <>Close <span aria-hidden="true">×</span></> : <>Details <span aria-hidden="true">+</span></>}</button>
    <div className="pcard-actions"><a className="product-primary" href={`/products/${product.id}`}>View product <Arrow /></a>{canonical ? <a href={canonical.url} download={canonical.filename}>PDF ↓</a> : <a href={requestHref("Request technical PDF", product)}>Request PDF <Arrow /></a>}</div>
  </article>
}

type Sort = "az" | "za" | "code"
export function ProductsPage() {
  const initial = new URLSearchParams(window.location.search).get("q") ?? ""
  const [query, setQuery] = useState(initial)
  const [submitted, setSubmitted] = useState(initial)
  const [sort, setSort] = useState<Sort>("az")
  const [grades, setGrades] = useState<string[]>([])
  const [packs, setPacks] = useState<string[]>([])
  const [filtersOpen, setFiltersOpen] = useState(false)
  // Touch "Details" overlay: one card open at a time.
  const [detailsId, setDetailsId] = useState<string | null>(null)
  const gradeOptions = [...new Set(catalogue.map((p) => p.grade || p.qualifier).filter(Boolean) as string[])]
  const packOptions = [...new Set(catalogue.flatMap((p) => p.packSizes ?? []))]
  const results = useMemo(() => {
    const searched = submitted.trim() ? searchProducts(submitted).matches.map((m) => m.product) : catalogue
    return searched.filter((p) => !grades.length || grades.includes(p.grade || p.qualifier || "")).filter((p) => !packs.length || p.packSizes?.some((x) => packs.includes(x))).sort((a, b) => sort === "code" ? (a.code ?? "").localeCompare(b.code ?? "") : (sort === "az" ? 1 : -1) * a.name.localeCompare(b.name))
  }, [submitted, sort, grades, packs])
  const outcome = submitted.trim() ? searchProducts(submitted) : null
  const submit = (value: string) => { setSubmitted(value); const url = value.trim() ? `/products?q=${encodeURIComponent(value.trim())}` : "/products"; history.replaceState({}, "", url) }
  const toggle = (value: string, values: string[], set: (v: string[]) => void) => set(values.includes(value) ? values.filter((x) => x !== value) : [...values, value])
  const activeCount = grades.length + packs.length
  useEffect(() => { document.title = "Product Catalogue | Piochem" }, [])
  return <main className="catalogue-page">
    <section className="catalogue-hero"><p className="eyebrow">Product catalogue</p><h1>Find the right<br/><em>chemistry.</em></h1><p>Search Piochem products by name, CAS number,<br/>molecular formula or catalogue number.</p>
      <div className="catalogue-search"><ChemicalSearchField id="catalogue-search" variant="finder" value={query} onChange={setQuery} onSubmit={submit} onSelectProduct={(p) => submit(p.name)} scope="products" placeholder="Search by product, CAS, formula or catalogue number…" submitLabel="Search products" /></div>
    </section>
    <section className="catalogue-shell">
      <div className="catalogue-toolbar"><strong>{results.length} {results.length === 1 ? "PRODUCT" : "PRODUCTS"}</strong><div className="active-chips">{[...grades, ...packs].map((x) => <button key={x} onClick={() => grades.includes(x) ? toggle(x, grades, setGrades) : toggle(x, packs, setPacks)}>{x} ×</button>)}</div><label>Sort by <select value={sort} onChange={(e) => setSort(e.target.value as Sort)}><option value="az">Name A–Z</option><option value="za">Name Z–A</option><option value="code">Catalogue number</option></select></label></div>
      <button className="mobile-filter-button" onClick={() => setFiltersOpen(true)}>Filters {activeCount ? `(${activeCount})` : ""}<span>+</span></button>
      <div className="catalogue-layout">
        <aside className={`catalogue-filters ${filtersOpen ? "open" : ""}`} aria-label="Product filters"><div className="filter-drawer-head"><strong>Filters</strong><button onClick={() => setFiltersOpen(false)} aria-label="Close filters">×</button></div>
          {gradeOptions.length > 1 && <Filter title="Grade / qualifier" options={gradeOptions} active={grades} onToggle={(x) => toggle(x, grades, setGrades)} />}
          {packOptions.length > 1 && <Filter title="Pack size" options={packOptions} active={packs} onToggle={(x) => toggle(x, packs, setPacks)} />}
          {activeCount > 0 && <button className="clear-filters" onClick={() => { setGrades([]); setPacks([]) }}>Clear all filters</button>}
          <button className="apply-filters" onClick={() => setFiltersOpen(false)}>Show {results.length} products</button>
        </aside>
        <div className="catalogue-results-grid">{results.map((p) => <CatalogueCard product={p} key={p.id} detailsOpen={detailsId === p.id} onToggleDetails={() => setDetailsId((id) => id === p.id ? null : p.id)} />)}{!results.length && outcome?.noResult && <NoResultNotice noResult={outcome.noResult} query={outcome.productQuery} onCheckNumber={() => document.getElementById("catalogue-search")?.focus()} allowRequest className="catalogue-empty" />}</div>
      </div>
    </section>
  </main>
}
function Filter({ title, options, active, onToggle }: { title: string; options: string[]; active: string[]; onToggle: (x: string) => void }) { return <fieldset><legend>{title}</legend>{options.map((x) => <label key={x}><input type="checkbox" checked={active.includes(x)} onChange={() => onToggle(x)} /><span>{x}</span></label>)}</fieldset> }

export function ProductDetailPage({ slug }: { slug: string }) {
  const product = catalogue.find((p) => p.id === slug)
  useEffect(() => { document.title = product ? `${product.name} | Piochem` : "Product not found | Piochem" }, [product])
  if (!product) return <main className="product-not-found"><p className="eyebrow">Product catalogue</p><h1>Product not found.</h1><p>The requested product is not in the current verified catalogue.</p><a className="button button-red" href="/products">Browse products <Arrow /></a></main>
  const docs = [{ key: "technicalDataSheet", label: "Technical data sheet" }, { key: "sds", label: "Safety data sheet / SDS" }, { key: "specification", label: "Specification" }] as const
  return <main className="product-detail">
    <section className="product-detail-top"><div className="product-detail-image">{image(product, true)}</div><div className="product-identity"><p className="eyebrow">Product</p><h1>{product.name}</h1>{(product.grade || product.qualifier) && <p className="product-qualifier">{product.grade || product.qualifier}</p>}<dl>{facts(product).map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><div className="product-ctas"><a className="button button-red" href={requestHref("Request a quote", product)}>Request a quote</a>{product.documents?.technicalDataSheet ? <a className="detail-link" href={product.documents.technicalDataSheet.url} download={product.documents.technicalDataSheet.filename}>Download technical PDF ↓</a> : <a className="detail-link" href={requestHref("Request technical PDF", product)}>Request technical PDF <Arrow /></a>}</div></div></section>
    <section className="product-sections">
      <article><span>01</span><div><p className="eyebrow">Product information</p><h2>Verified product identity.</h2><p>The displayed identity and pack information has been transcribed from Piochem’s supplied product label.</p></div></article>
      <article><span>02</span><div><p className="eyebrow">Specifications</p><h2>Technical detail, on request.</h2><p>Detailed specifications are available on request.</p><a href={requestHref("Request specification", product)}>Request specification <Arrow /></a></div></article>
      <article id="product-documents"><span>03</span><div><p className="eyebrow">Documents</p><h2>Product documentation.</h2><div className="document-list">{docs.map(({ key, label }) => { const doc = product.documents?.[key]; return <div key={key}><span><strong>{label}</strong><small>PDF</small></span>{doc ? <a href={doc.url} download={doc.filename}>Download ↓</a> : <a href={requestHref(`Request ${label}`, product)}>Request <Arrow /></a>}</div> })}<div><span><strong>Certificate of analysis</strong><small>Search by lot</small></span><a href={`/?document=coa&product=${encodeURIComponent(product.id)}#documents`}>Find certificate of analysis <Arrow /></a></div></div></div></article>
      <article><span>04</span><div><p className="eyebrow">Continue exploring</p><h2>More Piochem products.</h2><a href="/products">View product catalogue <Arrow /></a></div></article>
    </section>
  </main>
}
