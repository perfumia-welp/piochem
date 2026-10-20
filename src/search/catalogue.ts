// The one product list behind every Piochem search surface.
//
// PROVENANCE — read before adding data:
// - Product information (name, catalogue number, CAS, formula, grade/qualifier,
//   pack size) comes from owner-supplied label photos, transcribed in
//   ../data/standardPacks.ts and ../data/productShowcase.ts. The cards, the
//   search and the Documentation Center all read those same records.
// - `searchAliases` are standard chemical names used for search matching only.
//   They are never displayed. `synonyms` (displayable) stays empty until the
//   Piochem catalogue supplies them.
// - `category` must only be set once Piochem confirms the product's family.
//   Do not infer it from the grade, the chemistry or another supplier.
// - Document availability (SDS, COA, specification) must not be inferred.
//   `documents` stays unset until a document service reports it.
//
// An unconfirmed field stays undefined. Replace `catalogue` with the real
// catalogue/API response when it exists; nothing else needs to change.

import { categories } from "../data.ts"
import { showcaseCollections } from "../data/productShowcase.ts"
import { standardPacks } from "../data/standardPacks.ts"
import type { Product } from "./types.ts"

/** The nine Piochem product families, in site order. */
export const categoryNames: string[] = categories.map(([, title]) => title)

// Search-only aliases: standard chemical names for the same substance.
const searchAliases: Record<string, string[]> = {
  acetone: ["Propanone", "Dimethyl ketone"],
  "methanol-gradient-grade": ["Methyl alcohol"],
}

const fromLabels: Product[] = [
  ...standardPacks.products.map((item) => ({
    id: item.id,
    code: item.catNo,
    name: item.name,
    qualifier: item.concentration,
    cas: item.casNo,
    formula: item.formula,
    packSizes: item.packSize ? [item.packSize] : undefined,
  })),
  ...showcaseCollections.flatMap((collection) =>
    collection.products.map((item) => ({
      id: item.id,
      code: item.code,
      name: item.name,
      qualifier: item.qualifier,
      cas: item.cas,
      formula: item.formula,
      grade: item.grade,
      packSizes: item.packSize ? [item.packSize] : undefined,
    })),
  ),
]

export const catalogue: Product[] = fromLabels.map((product) =>
  searchAliases[product.id]
    ? { ...product, searchAliases: searchAliases[product.id] }
    : product,
)
