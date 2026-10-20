// Run with: pnpm test  (node --experimental-strip-types --test)
import assert from "node:assert/strict"
import { describe, it } from "node:test"

import { showcaseCollections } from "../data/productShowcase.ts"
import { standardPacks } from "../data/standardPacks.ts"
import { catalogue, categoryNames } from "./catalogue.ts"
import { detectIntent, formatCas, isValidCasDigits } from "./intent.ts"
import { digitsOnly, highlightRanges } from "./normalize.ts"
import { TIER } from "./rank.ts"
import { lookupProduct, queryIntent, searchProducts } from "./searchProducts.ts"
import type { Product } from "./types.ts"

const names = (query: string, products?: Product[]) =>
  searchProducts(query, products).matches.map((match) => match.product.name)
const top = (query: string, products?: Product[]) => searchProducts(query, products).matches[0]

// Test-only records for behaviour the eight live products cannot exercise
// (mid-word matches, typo suppression, duplicate grades). Never shipped.
const fixture: Product[] = [
  { id: "f1", name: "Acetone", cas: "67-64-1" },
  { id: "f2", name: "Acetonitrile", cas: "75-05-8", synonyms: ["Methyl cyanide"] },
  { id: "f3", name: "Methanol", cas: "67-56-1", category: "HPLC Solvents" },
  { id: "f4", name: "Trace Metal Standard" },
]

describe("catalogue integrity", () => {
  it("contains exactly the label-verified products, each from the showcase data", () => {
    const labelIds = [
      ...standardPacks.products.map((item) => item.id),
      ...showcaseCollections.flatMap((collection) => collection.products.map((item) => item.id)),
    ]
    assert.deepEqual(catalogue.map((product) => product.id).sort(), [...labelIds].sort())
    assert.equal(catalogue.length, 8)
  })
  it("has unique ids and catalogue numbers", () => {
    const ids = catalogue.map((product) => product.id)
    const codes = catalogue.map((product) => product.code)
    assert.equal(new Set(ids).size, ids.length)
    assert.equal(new Set(codes).size, codes.length)
  })
  it("every product has a six-digit catalogue number, a CAS number and a formula", () => {
    for (const product of catalogue) {
      assert.match(product.code ?? "", /^\d{6}$/, product.name)
      assert.ok(product.cas, product.name)
      assert.ok(product.formula, product.name)
    }
  })
  it("every CAS number passes its check digit", () => {
    for (const product of catalogue) {
      assert.ok(isValidCasDigits(digitsOnly(product.cas!)), product.name)
    }
  })
  it("makes no document availability claims", () => {
    for (const product of catalogue) assert.equal(product.documents, undefined, product.name)
  })
  it("carries no leftover demo records or placeholder codes", () => {
    const text = JSON.stringify(catalogue)
    for (const stale of ["Acetonitrile", "Calcium Chloride", "512708", "DEMO-", "ACN-HPLC", "B240615"]) {
      assert.ok(!text.includes(stale), stale)
    }
  })
  it("every category is one of the nine Piochem families", () => {
    assert.equal(categoryNames.length, 9)
    for (const product of catalogue) {
      if (product.category) assert.ok(categoryNames.includes(product.category), product.name)
    }
  })
  it("assigns no category until Piochem confirms one", () => {
    for (const product of catalogue) assert.equal(product.category, undefined, product.name)
  })
  it("has search-only aliases and no displayable synonyms", () => {
    for (const product of catalogue) assert.equal(product.synonyms, undefined, product.name)
    const aliases = Object.fromEntries(
      catalogue
        .filter((product) => product.searchAliases)
        .map((product) => [product.id, product.searchAliases]),
    )
    assert.deepEqual(aliases, {
      acetone: ["Propanone", "Dimethyl ketone"],
      "methanol-gradient-grade": ["Methyl alcohol"],
    })
  })
})

describe("A. exact product name", () => {
  it("finds Acetone first", () => {
    assert.deepEqual(names("Acetone"), ["Acetone"])
    assert.equal(top("Acetone").score, TIER.name)
  })
  it("is case- and whitespace-insensitive", () => {
    assert.deepEqual(names("  tRIETHYLAMINE  "), ["Triethylamine"])
    assert.equal(top("nitric   acid 70%").product.id, "nitric-acid-70")
  })
  it("ignores harmless punctuation", () => {
    assert.equal(top("nitric-acid 70").product.id, "nitric-acid-70")
    assert.equal(top("tri calcium citrate tetrahydrate").score, TIER.name)
  })
})

describe("B. partial product name", () => {
  it("prefix matches, shortest name first", () => {
    assert.deepEqual(names("tri"), ["Triethylamine", "TriCalcium Citrate Tetrahydrate"])
    assert.equal(top("tri").score, TIER.namePrefix)
  })
  it("matches at a word start inside the name", () => {
    assert.deepEqual(names("citrate"), ["TriCalcium Citrate Tetrahydrate"])
    assert.equal(top("citrate").score, TIER.nameWord)
    assert.equal(top("acid").score, TIER.nameWord)
    assert.deepEqual(names("acid").sort(), ["Hydrochloric Acid", "Nitric Acid 70%"])
  })
  it("matches multi-word queries across name, qualifier and grade", () => {
    assert.equal(top("methanol gradient").product.id, "methanol-gradient-grade")
    assert.equal(top("silver sol").product.id, "silver-nitrate-0-1n")
  })
  it("never matches in the middle of a word", () => {
    assert.deepEqual(names("tone"), [])
    assert.deepEqual(names("chloric"), [])
    assert.deepEqual(names("ethyl"), [])
    assert.deepEqual(names("amine"), [])
    // The TCI weakness: "ace" must not reach "trace", "nitr" must not reach "Acetonitrile".
    assert.deepEqual(names("ace", fixture), ["Acetone", "Acetonitrile"])
    assert.deepEqual(names("nitr", fixture), [])
  })
  it("waits for two characters of free text", () => {
    assert.deepEqual(names("a"), [])
  })
})

describe("C. exact CAS", () => {
  it("finds Acetone by 67-64-1", () => {
    const outcome = searchProducts("67-64-1")
    assert.deepEqual(outcome.intent, { kind: "cas", cas: "67-64-1", status: "valid" })
    assert.deepEqual(names("67-64-1"), ["Acetone"])
    assert.equal(outcome.matches[0].score, TIER.cas)
  })
  it("accepts a CAS prefix label and unicode dashes", () => {
    assert.deepEqual(names("CAS 121-44-8"), ["Triethylamine"])
    assert.deepEqual(names("CAS No. 121–44–8"), ["Triethylamine"])
  })
  it("recognises a CAS that is still being typed", () => {
    assert.equal(queryIntent("67-64").kind, "cas")
    assert.deepEqual(names("67-64"), ["Acetone"])
    assert.deepEqual(names("67-").sort(), ["Acetone", "Methanol"])
    assert.equal(searchProducts("67-64").noResult, undefined)
  })
})

describe("D. CAS without hyphens", () => {
  it("reconstructs 67641 → 67-64-1", () => {
    assert.equal(formatCas("67641"), "67-64-1")
    assert.deepEqual(queryIntent("67641"), { kind: "cas", cas: "67-64-1", status: "valid" })
    assert.deepEqual(names("67641"), ["Acetone"])
  })
  it("reconstructs longer numbers", () => {
    assert.deepEqual(names("7761888"), ["Silver Nitrate solution"])
    assert.deepEqual(names("7647010"), ["Hydrochloric Acid"])
  })
  it("rescues misplaced hyphens only when the check digit proves it", () => {
    assert.deepEqual(names("676-4-1"), ["Acetone"])
  })
})

describe("E. invalid CAS check digit", () => {
  it("flags 67-64-2 instead of returning silence", () => {
    const outcome = searchProducts("67-64-2")
    assert.deepEqual(outcome.matches, [])
    assert.deepEqual(outcome.noResult, { kind: "cas-invalid-check", cas: "67-64-2" })
  })
  it("flags a malformed CAS shape", () => {
    assert.equal(searchProducts("67-6-2").noResult?.kind, "cas-invalid-format")
  })
  it("reports a valid CAS that is not in the catalogue", () => {
    // Ethanol and acetonitrile: valid check digits, not current Piochem records.
    assert.deepEqual(searchProducts("64-17-5").noResult, { kind: "cas-not-found", cas: "64-17-5" })
    assert.deepEqual(searchProducts("75-05-8").noResult, { kind: "cas-not-found", cas: "75-05-8" })
  })
  it("never fuzzy-matches a CAS", () => {
    assert.deepEqual(names("67-64-0"), [])
  })
})

describe("F. exact product code", () => {
  it("finds every product by its catalogue number", () => {
    for (const product of catalogue) {
      assert.deepEqual(names(product.code!), [product.name], product.code)
      assert.equal(top(product.code!).score, TIER.code)
    }
    assert.deepEqual(searchProducts("584922").intent, { kind: "code", code: "584922", partial: false })
  })
  it("suggests while a code is being typed", () => {
    assert.deepEqual(names("5849"), ["Acetone"])
    assert.equal(top("5849").score, TIER.codePrefix)
  })
  it("reports an unknown code and never fuzzy-matches it", () => {
    assert.deepEqual(names("584923"), [])
    assert.deepEqual(searchProducts("584923").noResult, { kind: "code-not-found", code: "584923" })
    // A removed demo code must not resolve.
    assert.deepEqual(names("512708"), [])
  })
  it("a known code wins over a CAS reading of the same digits", () => {
    for (const product of catalogue) assert.equal(queryIntent(product.code!).kind, "code")
  })
})

describe("G. formula with regular digits", () => {
  it("finds Silver Nitrate by AgNO3", () => {
    assert.equal(queryIntent("AgNO3").kind, "formula")
    assert.deepEqual(names("AgNO3"), ["Silver Nitrate solution"])
    assert.equal(top("AgNO3").score, TIER.formula)
  })
  it("finds HCl and C3H6O", () => {
    assert.deepEqual(names("HCl"), ["Hydrochloric Acid"])
    assert.deepEqual(names("C3H6O"), ["Acetone"])
  })
  it("accepts lowercase typing, ranked just below exact case", () => {
    assert.deepEqual(names("hcl"), ["Hydrochloric Acid"])
    assert.equal(top("c3h6o").score, TIER.formula - 1)
  })
  it("normalises hydrate dots and matches a formula prefix", () => {
    assert.deepEqual(names("C12H10Ca3O14.4H2O"), ["TriCalcium Citrate Tetrahydrate"])
    assert.equal(top("C12H10Ca3O14.4H2O").score, TIER.formula)
    assert.deepEqual(names("C12H10Ca3O14"), ["TriCalcium Citrate Tetrahydrate"])
    assert.equal(top("C12H10Ca3O14").score, TIER.formulaPrefix)
  })
})

describe("H. formula with Unicode subscripts", () => {
  it("subscript forms match like their plain forms", () => {
    assert.deepEqual(names("AgNO₃"), ["Silver Nitrate solution"])
    assert.deepEqual(names("C₃H₆O"), ["Acetone"])
    assert.deepEqual(names("C₁₂H₁₀Ca₃O₁₄·4H₂O"), ["TriCalcium Citrate Tetrahydrate"])
  })
})

describe("I. synonym", () => {
  it("exact alias finds the product", () => {
    assert.deepEqual(names("Dimethyl ketone"), ["Acetone"])
    assert.equal(top("dimethyl ketone").score, TIER.synonym)
    assert.deepEqual(names("propanone"), ["Acetone"])
    assert.deepEqual(names("methyl alcohol"), ["Methanol"])
  })
  it("alias prefix and word start", () => {
    assert.equal(top("propan").score, TIER.synonymPrefix)
    assert.deepEqual(names("ketone"), ["Acetone"])
    assert.equal(top("ketone").score, TIER.synonymWord)
  })
  it("a search-only alias is never handed to the UI", () => {
    for (const query of ["propanone", "dimethyl ketone", "propan", "ketone", "methyl alcohol", "methyl alc"]) {
      const outcome = searchProducts(query)
      assert.equal(outcome.matches[0].field, "synonym", query)
      assert.equal(outcome.matches[0].matchedText, undefined, query)
      // Apart from the user's own query and the stored alias list, the alias
      // text must appear nowhere in what the UI receives.
      const visible = JSON.stringify({ ...outcome, query: "", productQuery: "" }, (key, value) =>
        key === "searchAliases" ? undefined : value,
      )
      assert.ok(!/propanone|ketone|alcohol/i.test(visible), query)
    }
    // A typo corrected through an alias is reported as the product, not the alias.
    assert.deepEqual(names("propanome"), ["Acetone"])
    assert.equal(searchProducts("propanome").correctedTo, "Acetone")
    assert.equal(searchProducts("propanome").matches[0].matchedText, undefined)
    // So is a did-you-mean.
    assert.deepEqual(names("prupenonne"), [])
    assert.deepEqual(searchProducts("prupenonne").noResult, {
      kind: "text",
      query: "prupenonne",
      didYouMean: "Acetone",
    })
  })
  it("a catalogue-supplied synonym is still available for display", () => {
    assert.equal(top("methyl cyanide", fixture).matchedText, "Methyl cyanide")
  })
  it("a name prefix outranks a synonym prefix", () => {
    // "meth" starts Methanol (name) and Methyl cyanide (Acetonitrile synonym).
    assert.deepEqual(names("meth", fixture), ["Methanol", "Acetonitrile"])
  })
  it("a removed demo synonym no longer resolves", () => {
    assert.deepEqual(names("methyl cyanide"), [])
  })
})

describe("J. typo tolerance", () => {
  it("one transposition: acetnoe → Acetone", () => {
    const outcome = searchProducts("acetnoe")
    assert.deepEqual(names("acetnoe"), ["Acetone"])
    assert.equal(outcome.correctedTo, "Acetone")
    assert.equal(outcome.matches[0].fuzzy, true)
  })
  it("one error in a shorter term, two in a longer one", () => {
    assert.deepEqual(names("acetine"), ["Acetone"])
    assert.deepEqual(names("methonol"), ["Methanol"])
    assert.deepEqual(names("triethylamime"), ["Triethylamine"])
    assert.deepEqual(names("triethilamime"), ["Triethylamine"])
  })
  it("does not apply below five characters", () => {
    assert.deepEqual(names("acat"), [])
  })
  it("is suppressed when something matched outright", () => {
    assert.deepEqual(names("methanol"), ["Methanol"])
    assert.equal(searchProducts("methanol").correctedTo, undefined)
    // "acetone" is one edit from the start of "acetonitrile"; the exact hit must stand alone.
    assert.deepEqual(names("acetone", fixture), ["Acetone"])
    assert.equal(searchProducts("acetone", fixture).correctedTo, undefined)
  })
})

describe("K. unknown product", () => {
  it("returns an interpreted no-result, not an empty list", () => {
    const outcome = searchProducts("zzzzqqq")
    assert.deepEqual(outcome.matches, [])
    assert.deepEqual(outcome.noResult, { kind: "text", query: "zzzzqqq", didYouMean: undefined })
  })
  it("a removed demo product is simply not found", () => {
    assert.deepEqual(names("acetonitrile"), [])
    assert.equal(searchProducts("acetonitrile").noResult?.kind, "text")
    assert.deepEqual(names("calcium chloride dihydrate"), [])
  })
  it("offers a looser did-you-mean when auto-correction would be too bold", () => {
    assert.deepEqual(names("treethilamyne"), [])
    assert.deepEqual(searchProducts("treethilamyne").noResult, {
      kind: "text",
      query: "treethilamyne",
      didYouMean: "Triethylamine",
    })
  })
  it("recognises a real category that has no listed products", () => {
    assert.deepEqual(searchProducts("Wax & Oil").noResult, {
      kind: "category-empty",
      category: "Wax & Oil",
    })
  })
})

describe("L. document words", () => {
  it("“SDS acetone” keeps documents out of product results", () => {
    const outcome = searchProducts("SDS acetone")
    assert.equal(outcome.productQuery, "acetone")
    assert.deepEqual(names("SDS acetone"), ["Acetone"])
    assert.equal(outcome.documentIntent?.type, "sds")
    assert.equal(outcome.documentIntent?.product?.id, "acetone")
  })
  it("recognises MSDS, COA, certificate and spec", () => {
    assert.equal(searchProducts("acetone msds").documentIntent?.type, "sds")
    assert.equal(searchProducts("coa 584922").documentIntent?.type, "coa")
    assert.equal(searchProducts("coa 584922").documentIntent?.product?.code, "584922")
    assert.equal(searchProducts("certificate of analysis").documentIntent?.type, "coa")
    assert.equal(searchProducts("methanol spec").documentIntent?.type, "specification")
  })
  it("a document word alone yields the shortcut and no fake no-result", () => {
    const outcome = searchProducts("SDS")
    assert.deepEqual(outcome.matches, [])
    assert.equal(outcome.noResult, undefined)
    assert.equal(outcome.documentIntent?.type, "sds")
  })
})

describe("ranking order", () => {
  it("tiers descend in the agreed order", () => {
    const order = [
      TIER.code,
      TIER.cas,
      TIER.name,
      TIER.synonym,
      TIER.formula,
      TIER.namePrefix,
      TIER.synonymPrefix,
      TIER.nameWord,
      TIER.fuzzy,
      TIER.category,
    ]
    assert.deepEqual([...order].sort((a, b) => b - a), order)
  })
  it("a category match finds its products, ranked at the category tier", () => {
    // Fixture: the live catalogue has no confirmed categories yet.
    assert.deepEqual(names("hplc", fixture), ["Methanol"])
    assert.equal(top("hplc", fixture).score, TIER.category)
    assert.deepEqual(names("solvents", fixture), ["Methanol"])
    assert.deepEqual(searchProducts("methanol", fixture).categories, ["HPLC Solvents"])
  })
  it("with no categories assigned, a family name finds no products", () => {
    assert.deepEqual(names("hplc"), [])
    assert.deepEqual(names("solvents"), [])
    assert.deepEqual(searchProducts("HPLC Solvents").noResult, {
      kind: "category-empty",
      category: "HPLC Solvents",
    })
  })
  it("relevance, not purity, decides order", () => {
    const graded: Product[] = [
      { id: "a", name: "Acetone Extra Pure", purity: "≥99.99%" },
      { id: "b", name: "Acetone", purity: "≥99.0%" },
    ]
    assert.deepEqual(names("acetone", graded), ["Acetone", "Acetone Extra Pure"])
  })
})

describe("autocomplete shaping", () => {
  it("suggests up to two relevant categories", () => {
    assert.deepEqual(searchProducts("hplc").categories, ["HPLC Solvents"])
    assert.deepEqual(searchProducts("high purity").categories, [
      "High Purity Metals",
      "High Purity Solvents",
    ])
    // Family names are still suggested; no product contributes a category of its own.
    assert.deepEqual(searchProducts("methanol").categories, [])
    assert.deepEqual(searchProducts("acetone").categories, [])
  })
  it("current data has no duplicate grades, so no grouping activates", () => {
    for (const group of searchProducts("tri").groups) assert.equal(group.products.length, 1)
  })
  it("groups several grades of one chemical into a single row", () => {
    const grades: Product[] = [
      { id: "g1", name: "Acetonitrile", cas: "75-05-8", grade: "HPLC Grade" },
      { id: "g2", name: "Acetonitrile", cas: "75-05-8", grade: "Gradient Grade" },
      { id: "g3", name: "Acetonitrile", cas: "75-05-8", grade: "AR" },
      { id: "g4", name: "Acetone", cas: "67-64-1" },
    ]
    const groups = searchProducts("ace", grades).groups
    assert.equal(groups.length, 2)
    assert.equal(
      groups.find((group) => group.lead.product.name === "Acetonitrile")?.products.length,
      3,
    )
  })
  it("highlights only word-start matches", () => {
    assert.deepEqual(highlightRanges("Acetonitrile", "ace"), [[0, 3]])
    assert.deepEqual(highlightRanges("Trace Metal", "ace"), [])
    assert.deepEqual(highlightRanges("Nitric Acid 70%", "acid"), [[7, 11]])
    assert.deepEqual(highlightRanges("TriCalcium Citrate", "tri calcium"), [[0, 10]])
  })
})

describe("intent detection", () => {
  it("classifies each identifier", () => {
    assert.equal(detectIntent("").kind, "empty")
    assert.equal(detectIntent("acetone").kind, "text")
    assert.equal(detectIntent("NaOH").kind, "formula")
    assert.equal(detectIntent("C2H5OH").kind, "formula")
    assert.equal(detectIntent("HPLC").kind, "text")
    assert.equal(detectIntent("123456").kind, "code")
    assert.equal(detectIntent("12").kind, "text")
  })
})

describe("document product lookup", () => {
  it("resolves by name, CAS and code to the same product", () => {
    const expected = "tricalcium-citrate-tetrahydrate"
    assert.equal(lookupProduct("TriCalcium Citrate Tetrahydrate").product?.id, expected)
    assert.equal(lookupProduct("5785-44-4").product?.id, expected)
    assert.equal(lookupProduct("598807").product?.id, expected)
  })
  it("resolves a sole partial match", () => {
    assert.equal(lookupProduct("tricalcium cit").product?.id, "tricalcium-citrate-tetrahydrate")
  })
  it("leaves an ambiguous query unresolved, with candidates", () => {
    const lookup = lookupProduct("tri")
    assert.equal(lookup.product, undefined)
    assert.equal(lookup.candidates.length, 2)
  })
  it("returns nothing for an unknown product", () => {
    assert.equal(lookupProduct("zzzzqqq").product, undefined)
    assert.deepEqual(lookupProduct("zzzzqqq").candidates, [])
  })
})
