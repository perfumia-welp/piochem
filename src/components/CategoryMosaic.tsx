import type { CSSProperties } from "react"
import { productFamilies } from "./productFamilies"

const sizes = { large: "(min-width: 700px) 45vw, 92vw", wide: "(min-width: 700px) 45vw, 92vw", small: "(min-width: 1100px) 22vw, (min-width: 700px) 45vw, 92vw", feature: "(min-width: 1100px) 45vw, 92vw" }
const Arrow = () => <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h11M11 6l4 4-4 4" /></svg>

export default function CategoryMosaic() {
  return <ul className="fam-grid" aria-label="Product families">{productFamilies.map((family) => (
    <li key={family.id} className={`fam-slot fam-slot--${family.size} reveal`}>
      <a href={family.href} id={family.id} className={`fam-card category-${Number(family.number)}`}>
        <img className="fam-card-img" src={family.image} srcSet={family.srcSet} sizes={sizes[family.size]} width={family.imageWidth} height={family.imageHeight} style={{ "--image-position-desktop": family.imagePosition, "--image-position-mobile": family.imagePositionMobile } as CSSProperties} alt={family.imageAlt} loading="lazy" decoding="async" />
        <span className="fam-card-badge" aria-hidden="true"><b>{family.number}</b> / {family.shortLabel}</span>
        <span className="fam-card-body"><h3 className="fam-card-title">{family.name}</h3><span className="fam-fold fam-fold--desc"><span><span className="fam-card-desc">{family.description}</span></span></span><span className="fam-fold fam-fold--cta" aria-hidden="true"><span><span className="fam-card-cta">Explore <Arrow /></span></span></span></span>
        <i className="fam-card-line" aria-hidden="true" />
      </a>
    </li>
  ))}</ul>
}
