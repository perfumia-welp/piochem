import { categories } from "../data"
import { familyAnchorId } from "./search/SearchContext"

export type ProductFamily = {
  id: string; number: string; name: string; shortLabel: string; description: string
  image: string; srcSet?: string; imageWidth: number; imageHeight: number
  imagePosition: string; imagePositionMobile: string; imageAlt: string; href: string
  size: "large" | "small" | "feature" | "wide"
}

const optimized = (name: string) => ({
  image: `/images/products/optimized/${name}-960.jpg`,
  srcSet: [480, 960, 1440].map((width) => `/images/products/optimized/${name}-${width}.jpg ${width}w`).join(", "),
})

const visuals = [
  { ...optimized("category-biochemicals"), imageWidth: 2400, imageHeight: 3600, imagePosition: "50% 47%", imagePositionMobile: "51% 43%", imageAlt: "Gloved researcher pipetting a biochemical sample in a culture dish", shortLabel: "Bioreagents", size: "large" },
  { ...optimized("category-biological-stains"), imageWidth: 10900, imageHeight: 13752, imagePosition: "50% 42%", imagePositionMobile: "50% 38%", imageAlt: "Fluorescently stained biological samples in laboratory wells", shortLabel: "Stains & Dyes", size: "large" },
  { ...optimized("category-fine-lab-chemicals"), imageWidth: 4000, imageHeight: 6000, imagePosition: "50% 82%", imagePositionMobile: "50% 76%", imageAlt: "Chemist preparing a precisely measured laboratory reagent in a volumetric flask", shortLabel: "Fine Chemicals", size: "small" },
  { ...optimized("category-high-purity-metals"), imageWidth: 5616, imageHeight: 3744, imagePosition: "58% 50%", imagePositionMobile: "62% 50%", imageAlt: "High-purity nickel nodules and a precisely machined nickel cube", shortLabel: "Metals", size: "small" },
  { ...optimized("category-high-purity-solvents"), imageWidth: 2400, imageHeight: 3598, imagePosition: "48% 32%", imagePositionMobile: "48% 28%", imageAlt: "Clear and pale amber high-purity solvents in clean laboratory flasks", shortLabel: "Solvents", size: "feature" },
  { ...optimized("category-hplc-solvents"), imageWidth: 4160, imageHeight: 3120, imagePosition: "33% 52%", imagePositionMobile: "29% 52%", imageAlt: "High-performance liquid chromatography system with solvent reservoirs", shortLabel: "HPLC", size: "small" },
  { ...optimized("category-inorganic-salts"), imageWidth: 2400, imageHeight: 1600, imagePosition: "48% 48%", imagePositionMobile: "43% 50%", imageAlt: "Blue crystalline inorganic salt being transferred into laboratory glassware", shortLabel: "Inorganic Salts", size: "small" },
  { ...optimized("category-organic-intermediates"), imageWidth: 2400, imageHeight: 1600, imagePosition: "63% 48%", imagePositionMobile: "67% 50%", imageAlt: "Organic synthesis and distillation apparatus with a controlled reaction mixture", shortLabel: "Intermediates", size: "wide" },
  { ...optimized("category-wax-oil"), imageWidth: 2400, imageHeight: 1600, imagePosition: "57% 44%", imagePositionMobile: "60% 45%", imageAlt: "White wax pellets being measured beside laboratory-style glassware", shortLabel: "Wax & Oil", size: "wide" },
] as const

export const productFamilies: ProductFamily[] = categories.map(([number, name, description], index) => ({
  id: familyAnchorId(name), number, name, description, href: "#search", ...visuals[index],
}))
