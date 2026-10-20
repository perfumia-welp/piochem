import { useState } from "react"
import CategoryMosaic from "./CategoryMosaic"
import CategoryStory from "./CategoryStory"
import CategoryCards from "./CategoryCards"

type CategoryDesign = "mosaic" | "story" | "cards"

export default function ProductCategories() {
  const [design, setDesign] = useState<CategoryDesign>("mosaic")
  return (
    <section className="section categories" id="categories">
      <div className="fam-head reveal">
        <div><p className="eyebrow">Product families</p><h2>Chemistry, organized<br /><em>for the work.</em></h2></div>
        <div className="fam-head-side">
          <p className="intro">Nine product families covering laboratory reagents, analytical materials, solvents and specialty chemicals.</p>
          <div className="category-review-switch" aria-label="Category design for client review"><span>View</span><div role="group" aria-label="Category design"><button type="button" aria-pressed={design === "mosaic"} onClick={() => setDesign("mosaic")}>Mosaic</button><button type="button" aria-pressed={design === "story"} onClick={() => setDesign("story")}>Scroll story</button><button type="button" aria-pressed={design === "cards"} onClick={() => setDesign("cards")}>Cards</button></div></div>
        </div>
      </div>
      {design === "mosaic" && <CategoryMosaic />}
      {design === "story" && <CategoryStory />}
      {design === "cards" && <CategoryCards />}
    </section>
  )
}
