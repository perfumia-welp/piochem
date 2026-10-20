import { FormEvent, useEffect, useRef, useState } from "react"
import ChemicalSearchField from "./components/search/ChemicalSearchField"
import SearchProvider, {
  exploreFamily,
  useSearch,
} from "./components/search/SearchContext"
import ProductResult from "./components/search/ProductResult"
import SearchResults from "./components/search/SearchResults"
import type { Product } from "./search/types"
import DocumentSearch from "./components/DocumentSearch"
import QualityTimeline from "./components/QualityTimeline"
import ProductFamiliesRail from "./components/ProductFamiliesRail"
import LabHeritage from "./components/LabHeritage"
import ProductShowcase from "./components/ProductShowcase"
import ProductCategories from "./components/ProductCategories"
import ScrollStory from "./components/ScrollStory"
import ProofStats from "./components/ProofStats"
import { ProductDetailPage, ProductsPage } from "./components/ProductPages"

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
const SEARCH_PLACEHOLDER = "Search by product, CAS, formula or code…"
function Brand() {
  return (
    <a className="brand" href={window.location.pathname === "/" ? "#top" : "/#top"}>
      <span className="brand-mark">P</span>
      <span>
        PIOCHEM<small>PRECISION IN RED</small>
      </span>
    </a>
  )
}
function HeaderSearch() {
  const { runSearch, openDocuments } = useSearch()
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  // A product picked from the suggestions is shown right here, with no scrolling.
  const [selected, setSelected] = useState<Product | null>(null)
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  useEffect(() => {
    if (!open) return
    inputRef.current?.focus()
    const closeOutside = (event: PointerEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener("pointerdown", closeOutside)
    return () => document.removeEventListener("pointerdown", closeOutside)
  }, [open])
  const finish = () => {
    setOpen(false)
    setValue("")
    setSelected(null)
  }
  const search = (query: string) => {
    if (!query.trim()) return
    finish()
    if (window.location.pathname !== "/") {
      window.location.href = `/products?q=${encodeURIComponent(query.trim())}`
    } else runSearch(query)
  }
  return (
    <div className="header-search" ref={wrapRef}>
      <button
        type="button"
        className="search-link"
        ref={buttonRef}
        aria-expanded={open}
        aria-controls="header-search-panel"
        onClick={() => setOpen(!open)}
      >
        <SearchIcon />
        <span>Search chemicals</span>
      </button>
      {open && (
        <div
          className="header-search-panel"
          id="header-search-panel"
          role="search"
          aria-label="Search chemicals"
        >
          <ChemicalSearchField
            id="header-chemical-search"
            variant="header"
            value={value}
            onChange={(next) => {
              setValue(next)
              setSelected(null)
            }}
            onSubmit={search}
            onSelectProduct={(product, group) => {
              // Several grades of one chemical need the full list; one product does not.
              if (group.products.length > 1) search(product.name)
              else {
                setValue(product.name)
                setSelected(product)
              }
            }}
            onSelectCategory={(family) => {
              finish()
              exploreFamily(family)
            }}
            onOpenDocuments={(type, productId) => {
              finish()
              openDocuments(type, productId)
            }}
            onEscape={() => {
              setOpen(false)
              buttonRef.current?.focus()
            }}
            placeholder={SEARCH_PLACEHOLDER}
            submitLabel="Search products"
            inputRef={inputRef}
          />
          {selected && (
            <div className="header-search-product" aria-live="polite">
              <ProductResult product={selected} as="div" compact />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
function Header() {
  const [open, setOpen] = useState(false)
  const home = window.location.pathname === "/"
  return (
    <header className={`header${home ? "" : " header--light"}`}>
      <Brand />
      <nav className={open ? "nav open" : "nav"}>
        {[
          ["Products", "/products"],
          ["Applications", "applications"],
          ["Quality", "quality"],
          ["Resources", "documents"],
          ["Company", "company"],
          ["News", "news"],
        ].map(([x, id]) => (
          <a href={id.startsWith("/") ? id : `${home ? "" : "/"}#${id}`} onClick={() => setOpen(false)} key={id}>
            {x}
          </a>
        ))}
      </nav>
      <div className="header-actions">
        <HeaderSearch />
        <a className="button button-red nav-quote" href={`${home ? "" : "/"}#contact`}>
          Request a quote
        </a>
        <button
          className="menu"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <i />
          <i />
        </button>
      </div>
    </header>
  )
}
function Hero() {
  return (
    <section className="hero-shell" id="top">
      <div className="hero">
        <video
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1800&q=85"
          aria-hidden="true"
        >
          <source
            src="/vecteezy_scientists-are-check-chemical-residues-in-the-laboratory_17202028.mp4"
            type="video/mp4"
          />
        </video>
        <div className="hero-wash" />
        <div className="hero-content">
          <p className="eyebrow light">
            Laboratory chemicals · reagents · solvents
          </p>
          <h1>
            <span className="hero-line">Precision</span>
            <span className="hero-line">chemistry.</span>
            <em className="hero-line">Reliable results.</em>
          </h1>
          <p className="hero-copy">
            High-quality laboratory chemicals, reagents and solvents for
            analytical, research and industrial applications.
          </p>
          <div className="button-row">
            <a className="button button-red" href="#categories">
              Explore products <Arrow />
            </a>
            <a className="button button-glass" href="#search">
              <SearchIcon /> Search chemicals
            </a>
          </div>
        </div>
        <div className="hero-index">
          <span>01</span>
          <i />
          <span>09</span>
          <small>Product families</small>
        </div>
      </div>
    </section>
  )
}
function ChemicalSearch() {
  const { submitted, runSearch, openDocuments } = useSearch()
  const [query, setQuery] = useState(submitted?.query ?? "")
  // Whatever entry point ran the search, the finder shows the same query.
  useEffect(() => setQuery(submitted?.query ?? ""), [submitted])
  return (
    <section className="search-section" id="search">
      <div className="search-backdrop" aria-hidden="true" />
      <div className="search-overlay" aria-hidden="true" />
      <div className="search-grid">
        <div className="search-story">
          <p className="eyebrow light">Chemical finder</p>
          <h2>
            Find the
            <br />
            chemistry
            <br />
            <em>you need.</em>
          </h2>
          <p>
            Search by chemical name, CAS number, molecular formula, synonym or
            Piochem product code.
          </p>
        </div>
        <form
          className="search-module"
          role="search"
          onSubmit={(event: FormEvent) => event.preventDefault()}
        >
          <label htmlFor="chemical-search">Search the Piochem range</label>
          <ChemicalSearchField
            id="chemical-search"
            variant="finder"
            value={query}
            onChange={setQuery}
            onSubmit={runSearch}
            onSelectProduct={(product) => runSearch(product.name)}
            onSelectCategory={exploreFamily}
            onOpenDocuments={openDocuments}
            placeholder={SEARCH_PLACEHOLDER}
            submitLabel="Search products"
          />
          <div className="search-tags">
            <span>Try</span>
            {["Methanol", "7697-37-2", "AgNO₃", "584922"].map((x) => (
              <button type="button" key={x} onClick={() => runSearch(x)}>
                {x}
              </button>
            ))}
          </div>
          <a className="document-search-link" href="#documents">
            Looking for SDS or COA?{" "}
            <b>
              Search documents <Arrow />
            </b>
          </a>
        </form>
      </div>
    </section>
  )
}
const pillars = [
  {
    title: "Consistent quality",
    proof:
      "Quality systems supported by ISO 9001:2015, ISO 14001:2015 and ISO 45001:2018.",
    body: "Piochem operates through an integrated quality approach designed to support consistent laboratory chemical supply. Its management systems include internationally recognized standards for quality, environmental management, and occupational health and safety.",
  },
  {
    title: "Ready availability",
    proof:
      "Approximately 80% of the Piochem product range is supported by stock availability.",
    body: "A broad laboratory chemical portfolio is supported by local stock, helping customers source frequently required reagents, solvents and laboratory materials with greater continuity.",
  },
  {
    title: "Technical experience",
    proof:
      "A specialist team backed by more than 50 years of accumulated experience in the Egyptian market.",
    body: "Piochem combines commercial and technical knowledge through an experienced team familiar with analytical and laboratory requirements, supported by more than 50 years of accumulated experience in the Egyptian market.",
  },
  {
    title: "Local manufacturing",
    proof:
      "Piochem’s manufacturing facility is located in the 1st Industrial Zone, 6th of October City, Giza.",
    body: "Local manufacturing in 6th of October City gives Piochem a closer connection to the Egyptian laboratory market, supporting its role as both a manufacturer and distributor of laboratory chemicals.",
  },
]

function WhyPiochem() {
  const [active, setActive] = useState<number | null>(null)
  return (
    <section className="section why">
      <div className="section-head why-head">
        <div>
          <p className="eyebrow">Why Piochem</p>
          <h2>
            Built around
            <br />
            <em>certainty.</em>
          </h2>
        </div>
      </div>
      <div
        className={active === null ? "pillar-list" : "pillar-list has-active"}
        onMouseLeave={() => setActive(null)}
      >
        {pillars.map((pillar, index) => {
          const isActive = active === index
          return (
            <button
              type="button"
              className={isActive ? "pillar is-active" : "pillar"}
              key={pillar.title}
              aria-expanded={isActive}
              aria-controls={`pillar-detail-${index}`}
              onMouseEnter={() => setActive(index)}
              onClick={() => setActive(isActive ? null : index)}
            >
              <span className="pillar-number">0{index + 1}</span>
              <div className="pillar-main">
                <h3>{pillar.title}</h3>
                <div
                  className="pillar-detail"
                  id={`pillar-detail-${index}`}
                  aria-hidden={!isActive}
                >
                  <p>{pillar.body}</p>
                </div>
              </div>
              <p className="pillar-proof">{pillar.proof}</p>
              <i className="pillar-progress" aria-hidden="true" />
            </button>
          )
        })}
      </div>
    </section>
  )
}


const applications = [
  {
    title: "Universities & Institutes",
    description:
      "Laboratory chemicals and reagents for teaching laboratories, academic research and institutional scientific work.",
  },
  {
    title: "Research Laboratories",
    description:
      "Chemical materials supporting experimental work, analytical procedures and scientific research workflows.",
  },
  {
    title: "Pharmaceutical",
    description:
      "Laboratory chemicals, reagents and solvents supporting pharmaceutical analysis, quality control and research applications.",
  },
  {
    title: "Biotechnology",
    description:
      "Laboratory chemicals and reagents supporting biotechnology research and related analytical workflows.",
  },
  {
    title: "Analytical Laboratories",
    description:
      "High-purity chemicals, reagents and solvents for analytical methods, sample preparation and laboratory testing.",
  },
  {
    title: "Industrial Laboratories",
    description:
      "Chemical materials for quality control, testing and laboratory work within industrial environments.",
  },
]

function Applications() {
  const [active, setActive] = useState(0)

  return (
    <section className="applications" id="applications">
      <div className="applications-story">
        <p className="eyebrow light">Who we serve</p>
        <h2>
          Chemistry for
          <br />
          <em>real-world work.</em>
        </h2>
        <p>
          Piochem supplies laboratory chemicals, reagents and solvents across
          academic, research, pharmaceutical, biotechnology, analytical and
          industrial environments.
        </p>
        <div className="applications-visual">
          <img
            src="/fine laboratory.jpg"
            alt="Laboratory professional examining a prepared chemical solution"
            loading="lazy"
          />
          <span>Application focus · Laboratory process</span>
        </div>
      </div>
      <div className="application-list">
        {applications.map((application, index) => {
          const isActive = active === index
          return (
            <article
              className={isActive ? "application is-active" : "application"}
              key={application.title}
              onMouseEnter={() => setActive(index)}
            >
              <button
                type="button"
                aria-expanded={isActive}
                aria-controls={`application-detail-${index}`}
                onClick={() => setActive(index)}
              >
                <span>0{index + 1}</span>
                <strong>{application.title}</strong>
                <i aria-hidden="true" />
                <b aria-hidden="true">{isActive ? "−" : "+"}</b>
              </button>
              <div
                className="application-detail"
                id={`application-detail-${index}`}
              >
                <div>
                  <p>{application.description}</p>
                  <a href="#categories">
                    Explore relevant products <Arrow />
                  </a>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
const newsStories = [
  {
    category: "Exhibition",
    title: "ARAB LAB 2026",
    date: "26–28 Oct 2026",
    dateTime: "2026-10-26",
    src: "/Arablab.webp",
    height: 600,
  },
  {
    category: "Exhibition",
    title: "Pharmaconex 2026",
    date: "01–03 Sep 2026",
    dateTime: "2026-09-01",
    src: "/pharmaconex.webp",
    height: 315,
  },
  {
    category: "Company news",
    title: "Presidential CRM Localization Alliance",
    src: "/presidential%20CRM.webp",
    height: 600,
  },
]
// Editorial index on the left drives a single active image on the right.
// On mobile the stage is hidden and each story shows its own image inline.
function EditorialNews() {
  const [active, setActive] = useState(0)
  return (
    <div className="news-index">
      <ol className="news-list">
        {newsStories.map((s, i) => (
          <li
            className={`news-row${i === active ? " is-active" : ""}`}
            key={s.title}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onClick={() => setActive(i)}
          >
            <span className="news-num" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
              <i />
            </span>
            <div className="news-body">
              <p className="news-cat">{s.category}</p>
              <h3>
                <button
                  type="button"
                  aria-pressed={i === active}
                  aria-controls="news-stage"
                >
                  {s.title}
                </button>
              </h3>
              <img
                className="news-inline"
                src={s.src}
                width={740}
                height={s.height}
                alt={s.title}
                loading="lazy"
                decoding="async"
              />
              <div className="news-foot">
                {s.date && <time dateTime={s.dateTime}>{s.date}</time>}
                <a href="https://piochem.com/home/" target="_blank" rel="noreferrer">
                  Read story <Arrow />
                </a>
              </div>
            </div>
          </li>
        ))}
      </ol>
      <div className="news-stage" id="news-stage" aria-live="polite">
        {newsStories.map((s, i) => (
          <figure
            className={`news-slide ${s.height < 400 ? "is-banner" : "is-poster"}${i === active ? " is-active" : ""}`}
            key={s.title}
            aria-hidden={i !== active}
          >
            <div className="news-frame">
              <img
                src={s.src}
                width={740}
                height={s.height}
                alt={i === active ? s.title : ""}
                loading="lazy"
                decoding="async"
              />
            </div>
            <figcaption>
              <span>{s.category}</span>
              <span>
                {String(i + 1).padStart(2, "0")} / {String(newsStories.length).padStart(2, "0")}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  )
}
// Previous horizontal three-card layout, restored for client comparison.
function CardsNews() {
  return (
    <div className="news-grid">
      {newsStories.map((s, i) => (
        <a
          href="https://piochem.com/home/"
          target="_blank"
          rel="noreferrer"
          key={s.title}
        >
          <div className={`news-art art-${i + 1}`}>
            <img
              src={s.src}
              width={740}
              height={s.height}
              alt={s.title}
              loading="lazy"
              decoding="async"
            />
          </div>
          <span>{s.category}</span>
          <h3>{s.title}</h3>
          {s.date && <time dateTime={s.dateTime}>{s.date}</time>}
          <b>
            Read story <Arrow />
          </b>
        </a>
      ))}
    </div>
  )
}
// Temporary client-review switch between the two News layouts.
// Once a layout is chosen, render that component directly and delete this.
const newsLayouts = [
  ["editorial", "Editorial"],
  ["cards", "Cards"],
] as const
function NewsSection() {
  const [newsLayout, setNewsLayout] = useState<"editorial" | "cards">("editorial")
  return (
    <section className="section news" id="news">
      <div className="section-head">
        <div>
          <p className="eyebrow">News & events</p>
          <h2>
            Piochem,
            <br />
            <em>in the field.</em>
          </h2>
        </div>
        <div className="news-toggle" role="group" aria-label="News layout">
          {newsLayouts.map(([value, label]) => (
            <button
              type="button"
              key={value}
              aria-pressed={newsLayout === value}
              aria-controls="news-view"
              onClick={() => setNewsLayout(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="news-view" id="news-view" key={newsLayout}>
        {newsLayout === "editorial" ? <EditorialNews /> : <CardsNews />}
      </div>
    </section>
  )
}
function Rest() {
  return (
    <>
      <WhyPiochem />
      <LabHeritage />
      <section className="manufacturing" id="company">
        <div className="plant-image">
          <img
            src="/jakub-pabis-BZOmnU1heh0-unsplash.jpg"
            alt="Industrial chemical manufacturing facility"
            loading="lazy"
          />
          <div className="plant-shade" aria-hidden="true" />
          <div className="plant-label">
            <i />
            6th of October City
            <br />
            <span>Giza · Egypt</span>
          </div>
        </div>
        <div className="plant-copy">
          <p className="eyebrow">Manufacturing & quality</p>
          <h2>
            Built for
            <br />
            <em>reliable chemistry.</em>
          </h2>
          <p>
            Piochem is an Egyptian laboratory chemicals company specializing in
            manufacturing and distribution for laboratory, analytical, research
            and industrial applications.
          </p>
          <p>
            Its manufacturing plant is located in the first industrial area of
            6th of October City, Giza.
          </p>
          <a className="text-link" href="#quality">
            Discover Piochem <Arrow />
          </a>
        </div>
      </section>
      <DocumentSearch />
      <QualityTimeline />
      <Applications />
      <NewsSection />
      <section className="final" id="contact">
        <div>
          <p className="eyebrow light">Start a conversation</p>
          <h2>
            Looking for
            <br />a specific chemical?
          </h2>
        </div>
        <div>
          <p>
            Search the Piochem range or send us your laboratory requirement.
          </p>
          <div className="button-row">
            <a className="button button-white" href="#search">
              Search products <Arrow />
            </a>
            <a className="button button-outline" href="mailto:info@piochem.com">
              Contact our team
            </a>
          </div>
        </div>
      </section>
      <footer>
        <div className="footer-top">
          <Brand />
          <p>
            Precision chemistry for analytical, research and industrial
            applications.
          </p>
        </div>
        <div className="footer-grid">
          {[
            [
              "Products",
              "Product catalogue",
              "Product categories",
              "Search chemicals",
            ],
            ["Resources", "SDS / MSDS Search", "COA Search", "Specifications"],
            ["Company", "About Piochem", "Quality", "News & Events"],
            ["Support", "Contact", "Technical Support", "Request a Quote"],
          ].map((c) => (
            <div key={c[0]}>
              <strong>{c[0]}</strong>
              {c.slice(1).map((x) => (
                <a href={x.includes("Search") ? "#search" : "#contact"} key={x}>
                  {x}
                </a>
              ))}
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Piochem</span>
          <span>
            Area 269A, 1st Industrial Zone, 6th of October City, Giza, Egypt
          </span>
          <a href="tel:+201205700001">+20 120 570 0001</a>
        </div>
      </footer>
    </>
  )
}
export default function App() {
  const path = window.location.pathname.replace(/\/$/, "") || "/"
  useEffect(() => {
    const o = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (!e.isIntersecting) return
          e.target.classList.add("visible")
          o.unobserve(e.target)
        }),
      { threshold: 0.1 },
    )
    document.querySelectorAll(".reveal").forEach((e) => o.observe(e))
    return () => o.disconnect()
  }, [])
  return (
    <SearchProvider>
      <Header />
      {path === "/products" ? <ProductsPage /> : path.startsWith("/products/") ? <ProductDetailPage slug={decodeURIComponent(path.slice(10))} /> : <main>
        <Hero />
        <ProductFamiliesRail />
        <ProofStats />
        <ProductCategories />
        <ProductShowcase />
        <ChemicalSearch />
        <SearchResults />
        <ScrollStory />
        <Rest />
      </main>}
    </SearchProvider>
  )
}
