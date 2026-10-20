Refine and significantly elevate the existing Free Trade Egypt homepage.

DO NOT rebuild the entire concept from scratch.

Keep the existing:

* dark navy / off-white identity
* teal accent
* Swiss industrial foundation
* “From Molecule to Market” concept
* Manrope / Inter typography
* existing site architecture
* B2B and international positioning

However, the current result feels too static, too flat, too sharp-edged and slightly template-like.

The redesign must now feel:

**more premium**
**more visual**
**more interactive**
**more contemporary**
**more distinctive**
**more editorial**
**less repetitive**

The target quality should feel comparable to a premium 2026 European industrial / materials / technology company.

The website should not simply be “clean.”

It needs memorable visual moments.

---

# 01 — REDESIGN THE HERO AS A 3-SLIDE IMMERSIVE HORIZONTAL SLIDER

Replace the current single static hero with an immersive horizontal hero carousel consisting of **3 full-screen slides**.

The behavior should be similar to a premium editorial website rather than a standard Bootstrap carousel.

Each slide must have:

* a different cinematic background
* a different headline
* different supporting text
* a different business message
* appropriate CTA
* subtle foreground/overlay treatment
* consistent Free Trade visual identity

Slides should transition **horizontally from right to left**.

Use a smooth premium animation:
approximately 900–1200ms with elegant easing.

Auto-change approximately every 6–7 seconds.

Allow:

* mouse drag
* trackpad swipe
* touch swipe
* arrow controls
* navigation indicators

Pause autoplay while the user is interacting with the slider.

---

## HERO SLIDE 01 — GLOBAL MATERIAL SUPPLY

Background:

Premium aerial container-port / logistics / industrial supply image.

Technical label:

**FT / GLOBAL MATERIAL SUPPLY**

Eyebrow:

**CHEMICALS • INGREDIENTS • GLOBAL SOURCING**

Headline:

# From Molecule

# to Market.

Supporting text:

Free Trade Egypt connects manufacturers with reliable chemical raw materials and ingredients through sourcing expertise, technical review, warehousing and supply-chain coordination.

Primary CTA:

**Start an Inquiry**

Secondary CTA:

**Explore Capabilities**

Micro-label:

**EGYPT → GLOBAL MARKETS**

---

## HERO SLIDE 02 — INDUSTRIES & MATERIALS

Background:

High-end chemical manufacturing / raw-material production image.

Avoid cliché colorful laboratory tubes.

Technical label:

**FT / MATERIAL EXPERTISE**

Eyebrow:

**RAW MATERIALS • INDUSTRIAL APPLICATIONS**

Headline:

# Materials That Keep

# Industry Moving.

Supporting copy:

From industrial chemicals and food ingredients to water treatment, agriculture and pharmaceutical raw materials, Free Trade supports diverse production requirements.

Primary CTA:

**Explore Products**

Secondary CTA:

**View Industries**

Micro-label:

**MULTI-INDUSTRY MATERIAL PORTFOLIO**

---

## HERO SLIDE 03 — SUPPLY & INFRASTRUCTURE

Background:

Premium warehouse / packaged raw materials / logistics photography.

Technical label:

**FT / SUPPLY INFRASTRUCTURE**

Eyebrow:

**SOURCE • VERIFY • STORE • MOVE**

Headline:

# Supply Confidence.

# Built Into Every Step.

Supporting copy:

Established warehousing, technical documentation and coordinated logistics help move materials from supplier to production line with confidence.

Primary CTA:

**Request a Quote**

Secondary CTA:

**Our Supply Process**

Micro-label:

**WAREHOUSING • DOCUMENTATION • LOGISTICS**

---

# HERO NAVIGATION

Add an elegant navigation system near the bottom of the hero.

Example:

**01 —— 02 —— 03**

The active slide should show:

* active number in teal
* subtle progress line
* progress animation showing time until next slide

Alternative:

01
GLOBAL SUPPLY

02
MATERIALS

03
INFRASTRUCTURE

Do not use traditional circular carousel dots.

The carousel control itself should become part of the visual identity.

---

# HERO IMAGE TREATMENT

Improve visual depth.

Use multiple layers:

1. cinematic background image
2. dark navy gradient
3. extremely subtle grain/noise
4. optional grid lines
5. material-flow line
6. foreground content

The image should remain clearly visible.

The current design darkens the hero slightly too much.

Allow more image detail and controlled contrast.

---

# 02 — UPDATE THE UI DESIGN SYSTEM

The current components have too many perfectly sharp 90-degree corners.

Keep the industrial precision, but soften the UI.

Do NOT make everything extremely rounded.

Use a controlled radius system:

### Small components

`10–12px`

Examples:

* inputs
* small controls
* secondary buttons

### Primary buttons

`12–14px`

### Standard cards

`16px`

### Large feature cards

`20–24px`

### Large media/image containers

`24–28px`

### Pills / tags

`999px`

The result should feel modern and premium while maintaining the industrial identity.

Avoid huge 40–60px playful corner radii.

This is a professional B2B company.

---

# BUTTON SYSTEM

Redesign all CTA buttons.

Primary:

teal background
dark text
12–14px radius
slightly generous horizontal padding

Add subtle premium hover:

* arrow moves 3–5px
* background shifts slightly
* button lifts maximum 1–2px

Secondary buttons:

translucent dark / subtle border

Do not use harsh rectangular buttons.

Examples:

**Start an Inquiry  ↗**

**Explore Capabilities  →**

---

# 03 — COMPLETELY REDESIGN THE 1999 → 2026 SECTION

The current version has too much empty white space and the large numbers feel disconnected from the rest of the site.

Turn this into an immersive **heritage + materials** section.

Use a sophisticated 2-column composition.

---

## LEFT SIDE — COMPANY HISTORY / NUMBERS

Instead of placing “1999” and “2026” separately in huge empty space, create an editorial history system.

Small technical label:

**FT / 01 — ESTABLISHED**

Headline:

# Built Over

# 25+ Years.

Then display:

**1999**

Founded

↓

subtle line / timeline

↓

**2026**

Internationally Focused

Supporting statement:

**25+ YEARS OF MATERIAL & SUPPLY EXPERIENCE**

Underneath create elegant compact stats:

**03**
Operating Locations

**02 × 3,800 CBM**
Warehousing

**08+**
Industry Applications

Use structured alignment and subtle separators.

Do not use generic statistic cards.

---

# RIGHT SIDE — INTERACTIVE 3D MATERIAL OBJECT

Create a signature interactive 3D visual.

Do NOT make it look like pharmaceutical medicine.

Create an abstract premium **material capsule / raw-material sample**.

Possible visual:

A transparent or semi-transparent capsule-like object containing:

* crystals
* granules
* powder
* micro-pellets

The object should communicate:

**raw material / chemistry / material science**

rather than medicine.

The material capsule should:

* slowly rotate automatically
* gently react to mouse position
* tilt toward cursor direction
* have subtle inertia
* return smoothly to neutral position
* respond slightly to scrolling

Use realistic premium material rendering:

* frosted transparent shell
* internal particles
* soft reflections
* teal light accents
* realistic shadows

Background should remain warm off-white.

Add an extremely subtle technical orbit/grid around it.

Small floating technical labels may include:

**RAW MATERIAL**

**SOURCE / VERIFY / SUPPLY**

**FT MATERIAL SYSTEM**

Do not invent chemical specifications.

---

# 3D IMPLEMENTATION

If supported, use:

`@react-three/fiber`

and:

`@react-three/drei`

for the interactive object.

Use cursor position to influence:

rotationX
rotationY

Use lerp/damping to avoid direct mechanical movement.

Motion should feel slow and physically weighted.

Do NOT create fast rotation.

On mobile:

* disable mouse tracking
* retain slow automatic rotation

Respect:

`prefers-reduced-motion`

If React Three Fiber is not supported, reproduce the effect using layered CSS 3D transforms.

---

# 04 — ADD MORE PHOTOGRAPHY THROUGHOUT THE PAGE

The current website becomes visually too dark and text-heavy after the Industries section.

Photography should become part of the storytelling.

Do not simply add random stock images.

Use images where they support the narrative.

Add high-quality imagery to approximately every 1–2 major sections.

Create rhythm:

**IMAGE**
↓
**INTERFACE**
↓
**IMAGE**
↓
**TECHNICAL DATA**
↓
**IMMERSIVE VISUAL**

Avoid:

dark section
dark section
dark section
dark section

---

# IMAGE DIRECTION

Use premium photography showing:

* industrial materials
* powder and granules
* large raw-material bags
* chemical drums
* warehouses
* palletized materials
* factories
* production lines
* water-treatment facilities
* food manufacturing
* pharmaceutical manufacturing
* agriculture
* trucks
* containers
* ships
* ports
* material inspection
* industrial packaging

Photography should feel cinematic and contemporary.

Avoid obvious low-quality stock imagery.

---

# 05 — IMPROVE THE INDUSTRIES SECTION

The existing Industries image grid is one of the stronger parts of the current site.

Keep the basic concept but make it more premium.

Increase:

* image quality
* image scale
* hierarchy
* corner radii
* hover depth

Use an asymmetric composition.

Do not make every card the same size.

Use:

2 large cards
2 medium cards
4 smaller cards

Apply `20–24px` radius.

On hover:

* image scale `1.03–1.05`
* dark overlay shifts
* short description moves upward
* small arrow appears

Add subtle category numbering:

`01 / INDUSTRIAL`

`02 / FOOD`

etc.

---

# 06 — REDESIGN PRODUCT PORTFOLIO

The current Product Portfolio looks too small and too much like a simple UI component sitting inside a large empty section.

Make this section visually much stronger.

Use a **product exploration experience**.

Headline:

# One Portfolio.

# Many Production Challenges.

Left side:

vertical or horizontal category navigation.

Examples:

Industrial
Food
Water
Agriculture
Pharma
Personal Care

Right side:

large selected-product showcase.

Do not show three tiny cards only.

The active product should occupy a significant part of the viewport.

Example:

### CITRIC ACID

Large material/product visual.

Category:

Food / Industrial

Application:

Acidity Regulation
Processing
Industrial Applications

Actions:

**Technical Profile →**

**Request Specification**

Show 2–3 secondary products nearby.

---

# PRODUCT VISUALS

Where possible, represent materials visually using:

* powder
* crystals
* flakes
* pellets
* liquid
* packaging

This will add visual identity.

Do not photograph retail packaging.

Think industrial raw material.

Use rounded `18–24px` media containers.

---

# 07 — CAPABILITIES SECTION

The current capabilities section is too much like a dark specification table.

Keep:

SOURCE
VERIFY
STORE
MOVE
SUPPORT

But transform it into an interactive storytelling section.

Possible layout:

Large sticky title on the left:

# The Supply Behind

# the Material.

Right side:

5 vertically scrolling capability panels.

Each capability can include:

* number
* title
* 1 sentence
* relevant image or abstract material visual

Example:

### 01 / SOURCE

Large image of bulk raw materials / manufacturer.

### 02 / VERIFY

Image of inspection / technical documents.

### 03 / STORE

Warehouse visual.

### 04 / MOVE

Container / freight visual.

### 05 / SUPPORT

Commercial / operational coordination visual.

The teal material-flow line should connect the stages.

---

# 08 — SUPPLY CHAIN SECTION

The current supply-chain diagram is technically correct but visually too similar to the other dark sections.

Transform it into a more immersive composition.

Keep the process:

MANUFACTURER
→ MATERIAL
→ REVIEW
→ WAREHOUSE
→ PACKING
→ LOGISTICS
→ CUSTOMER

But combine the technical line with photography.

For example:

A large horizontal visual canvas with:

* manufacturer image
* material close-up
* warehouse
* container
* factory

As the user scrolls horizontally or vertically:

the teal flow line advances.

The active stage becomes brighter.

Inactive stages remain subtle.

Small data panels can appear below the active stage.

This should become one of the website's signature experiences.

---

# 09 — QUALITY & DOCUMENTATION

The current section is too dark and visually flat.

Make it a light/dark split composition.

Example:

Left:

Editorial text on warm off-white.

Headline:

# Know What You're Buying

# Before It Reaches Production.

Right:

Large premium technical-document interface.

Show:

COA
SDS
TDS
Specification
Packaging

Use layered cards with `16–20px` radius.

Add one relevant image:

* material sample
* documentation inspection
* laboratory / quality environment

Do not fabricate certification claims.

---

# 10 — INFRASTRUCTURE

Turn this into a major photographic moment.

Use a very large warehouse image covering approximately 70–80% of viewport width.

Radius:

`24–28px`

Overlay minimal information:

**3,800 CBM**

**WAREHOUSE CAPACITY**

Use thin measurement / engineering lines.

Below or alongside:

Cairo
Elbeheira
Ismailia

This section should provide relief from the text-heavy dark sections.

---

# 11 — GLOBAL BUSINESS

The current abstract Egypt visualization is elegant but too small and leaves too much unused dark space.

Create a stronger composition.

Use:

* large logistics / shipping photography
* abstract Egypt-origin network visualization layered on top
* sea freight
* land freight
* containers
* packaged supply

The map/network should support the image, not be the only visual element.

Headline remains:

# Egypt-Based.

# Internationally Focused.

---

# 12 — ADD DEPTH TO BACKGROUNDS

Dark sections should not all use exactly the same flat navy.

Create subtle variation using:

* `#07101f`
* `#0a1424`
* `#0e1a2e`
* subtle radial gradients
* extremely subtle noise
* lighting behind selected elements

Light sections:

use both:

`#f5f4f1`

and

pure white where appropriate.

This creates rhythm.

Do not turn the website into gradient-heavy SaaS design.

---

# 13 — MEDIA-FIRST SECTION TRANSITIONS

Add occasional large photographic transition strips.

Examples:

close-up powder material

→ next section

warehouse aisle

→ next section

container loading

→ next section

Do not create a separate section for every photograph.

Use them intelligently as visual bridges.

---

# 14 — FINAL BRAND STATEMENT

Keep:

# What You Buy Is a Chemical.

# What You Depend On Is the Supply Behind It.

But add a cinematic image behind it.

Possibilities:

* material handling
* warehouse
* freight
* manufacturing plant

Use slow parallax.

Text should remain the hero of this section.

---

# 15 — RFQ SECTION

Keep the 3-step inquiry concept.

Modernize the panel.

Use:

`20–24px` radius.

Add more visual hierarchy.

Progress indicator:

**01 PRODUCT — 02 REQUIREMENT — 03 COMPANY**

Use smooth transition between steps rather than displaying everything at once.

On desktop, add a relevant material image or abstract 3D object on the opposite side.

---

# 16 — FOOTER

The current footer feels visually weak after the rest of the page.

Give it more presence.

Add:

large FREE TRADE EGYPT wordmark

or large statement:

**FROM MOLECULE TO MARKET.**

Then links underneath.

Use spacious but intentional composition.

Do not make all footer text tiny and low contrast.

---

# 17 — GLOBAL CARD SYSTEM

Use the following design token system consistently:

### Small controls

10–12px radius

### Buttons

12–14px radius

### Cards

16–20px radius

### Large cards

20–24px radius

### Photography containers

24–28px radius

### Pills / badges

999px radius

Shadows should be subtle.

Prefer:

* border
* lighting
* background contrast

instead of heavy box shadows.

---

# 18 — ADD MICRO-INTERACTION QUALITY

Interactive details should feel precise.

Examples:

Buttons:
arrow slides subtly

Cards:
image zoom + content shift

3D material:
follows cursor gently

Navigation:
active section marker

Hero:
progress indicator

Products:
smooth content morph / fade

Supply chain:
line progresses with scroll

Images:
subtle parallax

Do not animate every object.

The goal is polish, not spectacle.

---

# 19 — IMPORTANT UX RULE

Preserve usability.

All important information and CTAs must remain clear.

Do not allow animation to delay navigation.

Keep good contrast.

Make interactive elements obvious.

Support:

keyboard navigation

touch

mobile

prefers-reduced-motion

---

# FINAL CREATIVE TARGET

The existing site is already clean.

Do NOT simply make it cleaner.

The new iteration must make it:

**more memorable**
**more visual**
**more tactile**
**more interactive**
**more human**
**more premium**

The visitor should encounter a new visual moment approximately every one to two sections.

The page should feel like a continuous editorial story rather than:

heading + text + cards
heading + text + cards
heading + text + cards

Maintain the Free Trade signature concept:

# FROM MOLECULE TO MARKET

and use:

# SOURCE → VERIFY → STORE → MOVE → DELIVER

as the underlying interaction narrative.

The final result should look custom-designed specifically for an international chemical-materials company and should be strong enough to use as a portfolio-level concept.
