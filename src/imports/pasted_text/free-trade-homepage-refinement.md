Refine the CURRENT Free Trade Egypt homepage.

Do NOT restart the project.

The existing visual identity and general architecture are strong, but the current page still has several issues:

1. Hero slider composition needs refinement.
2. The requested infinite scrolling chemical stripe is missing.
3. The 3D raw-material object is not implemented correctly.
4. Too many consecutive sections use dark navy backgrounds.
5. The website still does not show enough actual chemical materials.
6. Product presentation needs stronger photography and material visuals.
7. We need a new Stripe-inspired micro-particle experience.
8. Several sections need stronger contemporary UI/UX depth.

Keep:

* Manrope + Inter typography
* teal accent
* Free Trade Egypt identity
* Swiss / technical editorial discipline
* “From Molecule to Market”
* SOURCE → VERIFY → STORE → MOVE → DELIVER
* international B2B positioning

But improve the page significantly.

---

# 01 — HERO: KEEP THE THREE-SLIDE HORIZONTAL CAROUSEL

Keep the newly created 3-slide horizontal hero.

The carousel concept is correct.

However, refine its layout.

---

## FIX THE LOWER HORIZONTAL LINE

The existing thin teal line running horizontally between the body copy / buttons and the bottom-right slide navigation currently creates visual collisions.

It comes too close to text and visually intersects the bottom-right navigation.

REMOVE this long line.

Do not run any decorative line across the entire hero.

Instead, separate the hero into clean content zones:

Headline

↓

Body copy

`32px minimum gap`

↓

CTA buttons

`24px minimum gap`

↓

Micro-label

The slide navigation at bottom-right must be visually independent.

---

# HERO SLIDER NAVIGATION

Keep:

01 GLOBAL SUPPLY
02 MATERIALS
03 INFRASTRUCTURE

But create a contained navigation component.

Place it bottom-right.

Use:

* active teal number
* active white title
* muted inactive states
* short progress indicator
* subtle translucent panel if needed

The progress line should exist ONLY inside this navigation component.

Do not extend it across the hero.

---

# HERO SLIDE TYPOGRAPHY

All slides must maintain the same approximate headline height.

The third slide is currently too large and breaks the composition.

Headline must never occupy more than approximately two main visual lines on desktop.

Use fluid typography:

`font-size: clamp(68px, 6vw, 108px)`

`line-height: 0.92–0.96`

Set a controlled max-width.

---

# HERO SLIDE 01

Eyebrow:

CHEMICALS • INGREDIENTS • GLOBAL SOURCING

Headline:

# From Molecule

# to Market.

Body:

Free Trade Egypt connects manufacturers with reliable chemical raw materials and ingredients through sourcing expertise, technical review, warehousing and supply-chain coordination.

Primary:

**Start an Inquiry ↗**

Secondary:

**Explore Capabilities →**

Micro-label:

**EGYPT → GLOBAL MARKETS**

---

# HERO SLIDE 02

Technical label:

**FT / MATERIAL EXPERTISE**

Eyebrow:

RAW MATERIALS • INDUSTRIAL APPLICATIONS

Headline:

# Materials That Keep

# Industry Moving.

Body:

From industrial chemicals and food ingredients to water treatment, agriculture and specialty materials, Free Trade supports diverse production requirements.

Primary:

**Explore Products ↗**

Secondary:

**View Industries →**

---

# HERO SLIDE 03

Replace the current oversized headline.

Use:

Eyebrow:

**SOURCE • VERIFY • STORE • MOVE**

Headline:

# Supply Confidence.

# From Source to Delivery.

Body:

Warehousing, documentation and coordinated logistics help move materials from supplier to production line with confidence.

Primary:

**Request a Quote ↗**

Secondary:

**Our Supply Process →**

Do not allow this headline to become larger than slide 01.

---

# HERO IMAGE TREATMENT

The images are currently slightly over-darkened.

Use localized gradients behind the text instead of heavily darkening the whole photograph.

Maintain text contrast while allowing:

* containers
* chemical bags
* warehouse structure
* industrial details

to remain clearly visible.

---

# 02 — ADD THE MISSING INFINITE CHEMICAL STRIPE

THIS IS A REQUIRED NEW COMPONENT.

Create an **infinite horizontally scrolling stripe / ribbon** directly after the hero.

This is not the particle section.

This is a standalone continuously moving band.

It should immediately communicate that Free Trade actually supplies chemicals.

---

## VISUAL DESIGN

Height:

approximately `60–72px`

Background option:

**Option A — teal**
with deep navy text

OR

**Option B — warm off-white**
with navy text and teal separators

Choose whichever integrates best visually after the hero.

Do not make it another dark navy section.

---

## CONTENT

Use actual Free Trade materials such as:

SODIUM METABISULFITE

✦

SODIUM BICARBONATE

✦

ACTIVATED CARBON

✦

SILICA GEL

✦

ACTIVATED ALUMINA

✦

POTASSIUM HYDROXIDE

✦

SODIUM HYDROXIDE

✦

SODIUM CARBONATE

✦

POLYSORBATE 80

✦

STEARIC ACID

✦

EDTA TETRASODIUM SALT

✦

TRISODIUM PHOSPHATE

✦

SODIUM THIOSULPHATE

✦

SODIUM SULPHATE

✦

FOOD ENZYMES

✦

INDUSTRIAL ENZYMES

Repeat the content seamlessly.

These product names should move continuously from right to left.

No jump when the animation loops.

Pause or slow down subtly on hover.

Speed should be relaxed and premium.

Approximately `30–45 seconds` for one full loop.

Implement using duplicated content groups for seamless infinite animation.

Do not create a standard carousel.

This must look like a continuous editorial ticker.

---

# 03 — SECOND SECTION: REPLACE THE SPHERE WITH A TRUE 3D RAW-MATERIAL OBJECT

The current right-side gray sphere is NOT acceptable.

Remove it.

The requested concept is an interactive 3D raw-material object.

Create an elongated, elegant **transparent material capsule / industrial sample vessel**.

It must NOT look like a pharmaceutical pill product.

Think instead:

a futuristic industrial raw-material sample container.

---

## INSIDE THE OBJECT

Show visible raw material such as:

* crystals
* granules
* powder
* pellets

Potentially create multiple internal layers.

Example:

transparent upper shell
white crystalline granules
subtle teal reflections

The material should be clearly visible.

---

## 3D INTERACTION

The object should:

* slowly rotate automatically
* respond to mouse X direction
* respond to mouse Y direction
* tilt subtly toward the cursor
* use inertia
* use damping
* continue moving slightly when the cursor stops
* smoothly return toward resting position

Do not rotate rapidly.

The interaction should feel weighted and premium.

Use:

`@react-three/fiber`

and

`@react-three/drei`

if available.

Otherwise create a convincing WebGL/CSS fallback.

On mobile:

automatic slow rotation only.

Respect reduced-motion preferences.

---

# SECOND SECTION LEFT SIDE

Keep:

**FT / 01 — ESTABLISHED**

But improve the numbers.

Headline:

# Built Over

# 25+ Years.

Create a concise vertical historical axis:

### 1999

Founded

↓

thin teal timeline

↓

### 2026

Internationally Focused

Then show compact metrics:

### 03

Operating Locations

### 7,600 CBM

Combined Warehouse Capacity

### 13

Product Categories

Avoid oversized numbers floating in empty space.

The 3D material should be the dominant visual element.

---

# 04 — DARK/LIGHT BACKGROUND SYSTEM

The current website uses dark navy backgrounds in too many consecutive sections.

Do NOT globally remove the dark style.

Use dark sections strategically.

Follow this exact background plan.

---

## SECTION: HERO

### KEEP DARK

Reason:

The cinematic industrial imagery and strong white/teal typography work well here.

---

## SECTION: INFINITE CHEMICAL STRIPE

### LIGHT OR TEAL

Never navy.

This should provide immediate contrast after the hero.

---

## SECTION: 25+ YEARS / 3D MATERIAL

### KEEP LIGHT

Warm off-white.

Dark navy typography.

Teal details.

---

## SECTION: MATERIALS ARE ONLY THE BEGINNING

### KEEP LIGHT

Keep the existing large warehouse image + editorial text.

Increase image radius slightly.

---

## SECTION: INDUSTRIES

### KEEP IMAGE-LED / DARK VISUAL

Do not turn it into another flat navy block.

The images should dominate.

Use dark backing only where necessary between image cells.

The photographs themselves should create the section background.

---

## SECTION: PRODUCT PORTFOLIO

### KEEP LIGHT

Warm off-white.

Upgrade it substantially with real chemical imagery.

---

## NEW PARTICLE SECTION

### LIGHT

Use a pale aqua / very pale neutral background.

This should create a bright, modern visual moment.

---

## SECTION: CAPABILITIES

SOURCE
VERIFY
STORE
MOVE
SUPPORT

### KEEP DARK

This is one of the few sections where the dark technical aesthetic is appropriate.

Keep deep navy.

This dark section should create impact because the sections around it are now lighter.

---

## SECTION: SUPPLY CHAIN

From Manufacturer to Your Production Line

### CHANGE FROM DARK TO LIGHT

This is important.

Use:

background:
`#f5f4f1`

headline:
deep navy

body:
muted navy/gray

flow line:
teal

active stage:
deep navy + teal

Use full-color photography where appropriate.

Do not make this section visually similar to Capabilities.

---

## SECTION: QUALITY & DOCUMENTATION

Know What You're Buying Before It Reaches Production

### CHANGE FROM DARK TO LIGHT

Background:

warm off-white.

Headline:

deep navy.

Body:

gray/navy.

Create a dark navy technical interface CARD on the right.

The individual document cards:

COA
SDS
TDS
SPEC
PKG
SHIP

may use:

white cards
light gray cards
or selected dark cards

but the whole section should NOT be dark.

---

## SECTION: INFRASTRUCTURE

### IMAGE-LED / MOSTLY LIGHT

Use the warehouse image as the major visual.

Use large rounded media container.

Below it:

Cairo
Elbeheira
Ismailia

on light backgrounds.

Do not surround the whole section in navy.

---

## SECTION: GLOBAL BUSINESS

Egypt-Based. Internationally Focused.

### CHANGE FROM DARK TO LIGHT

Current navy version creates too much repetition.

Use:

`#eef2f4`

or

warm off-white.

Typography:

dark navy.

Routes:

teal.

Add large logistics imagery / port / shipping visual.

The Egypt network graphic can overlay or accompany the photography.

Do not leave large empty dark areas.

---

## SECTION: BUYER JOURNEY

### KEEP LIGHT

White / warm off-white.

Three steps.

Use subtle borders and restrained cards.

---

## SECTION: HAVE A MATERIAL REQUIREMENT / RFQ

### CHANGE MAIN BACKGROUND TO LIGHT

The current recording shows another large dark block here.

Remove the full navy section background.

Use a light/off-white section.

Create a large premium dark navy inquiry card or 3-step RFQ interface INSIDE it.

This keeps the dark identity without another full-screen navy area.

---

## FOOTER

### KEEP DARK

Deep navy.

Make this the final strong dark closure.

---

# REQUIRED PAGE COLOR RHYTHM

The final sequence should be approximately:

DARK
Hero

↓

TEAL / LIGHT
Infinite Chemical Stripe

↓

LIGHT
Heritage + 3D Material

↓

LIGHT + IMAGE
Positioning

↓

IMAGE-LED
Industries

↓

LIGHT
Product Explorer

↓

PALE LIGHT
Particle Experience

↓

DARK
Capabilities

↓

LIGHT
Supply Chain

↓

LIGHT
Quality

↓

LARGE IMAGE + LIGHT
Infrastructure

↓

PALE LIGHT
Global Supply

↓

LIGHT
Buyer Journey

↓

LIGHT WITH DARK CARD
RFQ

↓

DARK
Footer

Do not create consecutive large dark sections.

---

# 05 — NEW STRIPE-INSPIRED CHEMICAL PARTICLE SECTION

Add a completely new section.

This is separate from the infinite scrolling stripe.

Use Stripe.com only as inspiration for the idea of:

**large typography + thousands of tiny colored particles**

Do NOT copy Stripe's exact layout or colors.

Create a chemical/material interpretation.

---

## SECTION BACKGROUND

Use:

very pale aqua

or

warm off-white.

Large rounded outer visual area:

`28–32px`

---

## LEFT SIDE

Technical label:

**FT / MATERIAL SPECTRUM**

Headline:

# Materials in

# Every Form.

Alternative:

# One Portfolio.

# Countless Applications.

Body:

Free Trade supplies materials across industrial chemicals, food ingredients, water treatment, agriculture, personal care and other production applications.

CTA:

**Explore Materials →**

---

## RIGHT SIDE: MICRO-PARTICLE FIELD

Create hundreds or thousands of small points.

They should evoke:

* powder
* granules
* crystals
* droplets
* fine chemical particles

Use mainly:

teal
cyan
soft blue
small amount of amber
small amount of muted lime

Do NOT use Stripe's pink.

The particle field can create a loose:

wave

orbit

material cloud

or abstract molecular formation.

---

## PARTICLE INTERACTION

On cursor movement:

particles near the cursor move subtly away

then flow back into position.

Add slight:

wave distortion

depth

parallax

Do not create chaotic movement.

The result should feel scientific, sophisticated and calm.

---

# 06 — ACTUAL FREE TRADE MATERIALS MUST BECOME VISIBLE

The current website has too much:

warehouses
containers
factories

and not enough:

actual chemicals.

Correct this.

Use imagery of real material states.

---

## ACTIVATED CARBON

Show:

black carbon granules.

---

## SILICA GEL

Show:

silica beads / granules.

---

## ACTIVATED ALUMINA

Show:

small white / pale alumina spheres.

---

## SODIUM HYDROXIDE

Show:

white flakes / pellets.

---

## SODIUM METABISULFITE

Show:

white crystalline powder.

---

## SODIUM BICARBONATE

Show:

fine white powder.

---

## STEARIC ACID

Show:

white flakes / beads.

---

## POLYSORBATE 80

Use:

liquid ingredient imagery / industrial container handling.

---

## ENZYMES

Show:

industrial ingredient / food production context.

---

# PRODUCT VISUAL PRINCIPLE

The visitor should visually encounter several physical forms:

**POWDER**

**CRYSTAL**

**GRANULE**

**PELLET**

**LIQUID**

This is essential to make the website feel genuinely related to chemicals.

---

# 07 — REDESIGN PRODUCT PORTFOLIO

Current product cards are too small and visually generic.

Keep the light background.

Change the composition to a large material explorer.

Headline:

# Materials for

# Real Production Needs.

Use a category navigation:

Industrial
Food & Nutrition
Water Treatment
Agriculture
Life Sciences
Specialty Materials

When a category is selected, change the large featured material.

Example:

# ACTIVATED CARBON

Large macro photograph of activated-carbon granules.

Technical tags:

`WATER TREATMENT`

`INDUSTRIAL`

Short application description.

CTA:

**View Material →**

Secondary:

**Request Specification**

Beside / below it:

smaller previews:

Sodium Metabisulfite
Silica Gel
Activated Alumina

Material imagery should dominate rather than text-only cards.

---

# 08 — IMAGE BALANCE

Use approximately:

### 35%

actual chemical/material close-ups

### 30%

industry/application imagery

### 35%

warehousing/logistics/infrastructure

The existing version currently overuses logistics and infrastructure visuals.

---

# 09 — UI CORNER SYSTEM

Keep structure precise but soften interactive elements.

Buttons:

`12–14px`

Standard cards:

`16–20px`

Product imagery:

`20–24px`

Major media:

`24–28px`

Particle container:

`28–32px`

Tags:

full pill

Do not round the entire page structure.

---

# 10 — VISUAL VARIETY RULE

Do not repeat:

dark background
headline
paragraph
thin teal line

across multiple sections.

Every 1–2 sections should introduce a new visual mode:

Hero slider

↓

Infinite ticker

↓

3D object

↓

Photography

↓

Industry mosaic

↓

Material explorer

↓

Particle field

↓

Dark capability system

↓

Light animated supply chain

↓

Technical documentation interface

↓

Warehouse photograph

↓

Global logistics composition

↓

RFQ interaction

This is essential.

---

# FINAL GOAL

The current site is clean but still feels like a dark premium corporate template.

The revised result must feel specifically designed for a **chemical raw-material supplier**.

It must visually communicate:

### MATERIAL

What Free Trade supplies.

### CAPABILITY

How Free Trade manages the supply.

### INFRASTRUCTURE

How products are stored and moved.

### INTERNATIONAL BUSINESS

Why an overseas buyer can confidently send an inquiry.

Maintain the core brand idea:

# FROM MOLECULE TO MARKET.

But now make the **materials and chemistry visually present throughout the website**, rather than only communicating logistics.
