Refine the CURRENT Free Trade Egypt homepage. Do not restart or replace the established design system.

The existing direction is good, but the page still feels too dark, too technology/SaaS-oriented, and does not visually communicate chemicals and raw materials strongly enough.

The next iteration must achieve four things:

**1. Fix the hero composition and slider**
**2. Introduce real Free Trade products and chemical-material visuals**
**3. Create a better balance between light and dark sections**
**4. Add new signature visual experiences including particles, 3D material interaction and an infinite product marquee**

Maintain:

* Free Trade Egypt identity
* Manrope + Inter
* deep navy
* warm off-white
* teal accent
* “From Molecule to Market”
* Swiss / technical editorial foundation
* premium international B2B positioning

But make the overall result more visual, tactile, dimensional and distinctive.

---

# 01 — FIX THE HERO SLIDER

Keep the 3-slide horizontal carousel.

The first slide is visually strong and should remain the reference for scale and composition.

However, fix the following problems.

## REMOVE THE LONG HORIZONTAL LINE THROUGH THE LOWER HERO

The current thin teal/blue line between the body copy and CTA area is too close to the content and visually intersects the slide-navigation information on the bottom-right.

Do not allow any decorative line to pass behind or through text.

Create three clearly separated vertical zones:

### Content

Headline + description

Minimum gap after description:
`32px`

### CTA row

Primary + secondary buttons

Minimum gap below buttons:
`24px`

### Micro label

EGYPT → GLOBAL MARKETS

The slide navigation should be a separate independent component anchored to the bottom-right.

No line from the left content should run through the navigation.

---

# HERO SLIDE NAVIGATION

Keep:

01 GLOBAL SUPPLY
02 MATERIALS
03 INFRASTRUCTURE

But place this in a self-contained glass / transparent navigation panel.

Use:

* active teal marker
* subtle 1px progress bar
* strong active label
* muted inactive labels

The progress line belongs ONLY inside this navigation component.

It must not span the whole hero.

---

# HERO TYPOGRAPHY CONSISTENCY

All three hero slides must occupy approximately the same visual height.

The third slide currently becomes too large and wraps into too many lines.

Do NOT allow any hero headline to exceed 2 primary lines on a 1440–1920px desktop.

Use consistent fluid typography.

Recommended desktop range:

`clamp(68px, 6vw, 108px)`

Line height:

`0.90–0.96`

Maximum headline width:

approximately `900–1000px`

---

# REWRITE HERO SLIDE 03

Replace the current:

“Supply Confidence. Built Into Every Step.”

because it becomes too tall.

Use:

# Supply Confidence.

# From Source to Delivery.

Eyebrow:

**SOURCE • VERIFY • STORE • MOVE**

Description:

Warehousing, technical documentation and coordinated logistics help move materials from supplier to production line with confidence.

CTA:

**Request a Quote ↗**

Secondary:

**Our Supply Process →**

This should visually match the proportions of slides 01 and 02.

---

# HERO BACKGROUND BALANCE

Do not darken images so much that they lose visual detail.

Keep sufficient contrast behind text, but let the industrial photography remain visible and impressive.

Use localized gradients behind the content rather than one extremely dark overlay over the entire image.

---

# 02 — ADD THE MISSING INFINITE MATERIAL MARQUEE

Add a premium continuously scrolling horizontal material bar immediately after the hero.

This is currently missing.

Height:

approximately `56–68px`

Background:

warm off-white OR very light gray.

Text:

dark navy.

Use tiny teal separators.

The bar scrolls infinitely from right to left.

Pause gently on hover.

No visible jump when repeating.

Content must use REAL Free Trade products.

Use:

SODIUM METABISULFITE
•
CITRIC ACID
•
ACTIVATED CARBON
•
POTASSIUM SORBATE
•
SILICA GEL
•
MOLECULAR SIEVE
•
ZINC SULPHATE
•
SODIUM HYDROXIDE
•
POTASSIUM HYDROXIDE
•
ISOPROPANOL
•
SODIUM BENZOATE
•
FOOD ENZYMES
•
EUCALYPTUS OIL
•
LACTIC ACID
•
MONOPOTASSIUM PHOSPHATE
•
ANTI FOAM

Repeat seamlessly.

Optionally place small technical formulas below selected materials only when chemically certain.

Do not overload the bar.

Typography should be small, uppercase and editorial.

Example:

`SODIUM METABISULFITE   +   CITRIC ACID   +   ACTIVATED CARBON   +   ...`

This immediately tells the visitor that the company actually supplies chemicals.

---

# 03 — FIX SECTION 02 / 3D MATERIAL OBJECT

The current right-side visual is a gray circular sphere.

This is NOT the requested result.

Replace it completely.

We need a genuine dimensional **3D MATERIAL CAPSULE**.

It should have an elongated capsule / vessel-like geometry rather than a sphere.

Important:

It should reference material science, NOT pharmaceutical medicine.

Think:

**a transparent industrial sample capsule containing raw chemical material.**

Inside the transparent shell place visible:

* crystals
* granules
* powder particles
* pellets

The object can use white / clear material with subtle teal illumination.

It must clearly look three-dimensional.

---

# 3D CURSOR INTERACTION

The capsule should:

* rotate slowly automatically
* rotate horizontally and vertically according to mouse position
* tilt toward the cursor
* use smooth inertia
* continue moving slightly after the cursor stops
* slowly return toward neutral
* respond subtly to scroll

The movement should feel heavy and premium.

Do not make it spin like a product configurator.

Use React Three Fiber / Drei when available.

Mouse interaction should influence:

`rotationX`

`rotationY`

through damping / lerp.

Add realistic:

* refraction
* transparent surface
* soft shadows
* subtle highlights
* particles inside the capsule

On mobile:
use slow automatic rotation only.

---

# 04 — REDESIGN THE LEFT SIDE OF THE HERITAGE SECTION

Current:

1999
2026
small statistics

is still visually too basic.

Use the space more intelligently.

Eyebrow:

**FT / 01 — ESTABLISHED**

Headline:

# Built Over

# 25+ Years.

Then instead of large disconnected dates, create a compact vertical timeline:

**1999**

Founded

↓

thin teal timeline

↓

**2026**

Internationally Focused

Then create a horizontal metric row:

**03**

Operating Locations

**7,600 CBM**

Combined Warehouse Capacity

**13**

Product Categories

Do NOT claim “8 industries served” if it is based only on our layout rather than company data.

Use verified information wherever possible.

The 3D material object should remain the visual hero of this section.

---

# 05 — REDUCE THE AMOUNT OF DARK BACKGROUNDS

The current website uses dark navy too frequently.

This removes visual rhythm and causes several sections to blend into each other.

Do NOT eliminate the dark identity.

Instead, reserve dark backgrounds for moments where they create maximum impact.

---

## KEEP DARK

### Hero

Dark photographic treatment.

### Capability System

SOURCE → VERIFY → STORE → MOVE → SUPPORT.

This should remain dark because the technical-system aesthetic works here.

### Final Brand Statement

Dark cinematic image treatment.

### Footer

Dark navy.

---

## CHANGE TO LIGHT

### Product Portfolio

Change to:

warm off-white / very pale gray.

Dark navy text.

Teal accents.

Use actual product imagery.

---

### Supply Chain

Currently this is too similar to the Capability section.

Change the main supply-chain background to:

`#f5f4f1`

or near-white.

Use:

dark navy text
teal progress line
full-color industrial photography

This creates strong contrast after the dark Capability section.

---

### Quality & Documentation

Use a mostly light section.

Warm white background.

Dark technical cards.

A dark technical-document panel can exist INSIDE the light section.

Do not make the entire section navy.

---

### Global Business

Change from a full dark background to a sophisticated pale background.

Possible background:

very pale cool gray / blue:

`#eef2f4`

Use dark navy typography and teal routes.

Use logistics photography.

The section should feel global and airy.

---

### Buyer Process / Sourcing Steps

Use white or warm off-white.

Avoid another navy area.

---

### RFQ

Use off-white.

Place the actual inquiry interface inside a dark navy / white mixed card if desired.

---

# DESIRED PAGE COLOR RHYTHM

The page should roughly feel like:

DARK HERO

↓

LIGHT PRODUCT MARQUEE

↓

LIGHT 3D HERITAGE

↓

LIGHT / IMAGE POSITIONING

↓

LIGHT INDUSTRIES

↓

LIGHT PRODUCT EXPLORER

↓

NEW PARTICLE EXPERIENCE

↓

DARK CAPABILITIES

↓

LIGHT SUPPLY CHAIN

↓

LIGHT QUALITY

↓

FULL-PHOTO INFRASTRUCTURE

↓

LIGHT GLOBAL

↓

DARK CINEMATIC STATEMENT

↓

LIGHT RFQ

↓

DARK FOOTER

Dark should become an accent and storytelling tool instead of the default background.

---

# 06 — ADD A NEW STRIPE-INSPIRED PARTICLE SECTION

Create a completely new premium visual section inspired by the visual principle of Stripe's micro-particle artwork, but make the implementation unique to Free Trade and chemicals.

Do not copy Stripe's pink particles or card.

Use the principle:

**editorial text on the left + thousands of tiny dynamic particles on the right.**

Use a rounded large section/container:

`24–32px radius`

Background:

soft off-white / very pale aqua.

---

# PARTICLE SECTION CONTENT

Eyebrow:

**FT / MATERIAL SPECTRUM**

Headline:

# One Portfolio.

# Countless Applications.

Supporting text:

From industrial chemicals and food ingredients to adsorbents, solvents, essential oils and feed additives, Free Trade supplies materials behind a wide range of production processes.

CTA:

**Explore Materials →**

---

# PARTICLE VISUAL

The right 55–60% should contain a field of hundreds or thousands of very small particles.

The particles represent:

* chemical powder
* crystals
* granules
* droplets
* raw material particles

Use restrained colors:

teal
cyan
soft blue
muted amber
subtle lime
off-white

Teal remains dominant.

Do NOT make it rainbow-colored.

Particles should create an organic flowing cloud.

They can loosely form:

* an abstract molecule
* material wave
* capsule silhouette
* circular chemical field

but never a cliché molecular diagram.

---

# PARTICLE INTERACTION

Particles should gently react to mouse movement.

Cursor creates:

* subtle repulsion
* slight orbital movement
* wave distortion

Movement must remain slow and elegant.

Add very subtle floating labels around the particle composition:

**INDUSTRIAL**

**FOOD**

**WATER**

**AGRICULTURE**

**PHARMA**

**PERSONAL CARE**

These should feel like technical annotations.

Do not make every particle individually interactive.

---

# 07 — USE REAL FREE TRADE PRODUCT CATEGORIES

Stop using only generic placeholder categories.

Use the actual breadth of Free Trade's current portfolio.

The website may visually consolidate them for UX, but the source product categories include:

Agricultural

Cosmetics

Desiccants

Detergents

Essential Oils

Food Ingredients

Industrial Chemicals

Pharmaceuticals

Powder Extracts

Probiotics

Solvents

Veterinary & Feed Additives

Water Treatment

For the homepage UX, they can be organized under a cleaner top-level system:

### INDUSTRIAL

Industrial Chemicals
Solvents
Detergents
Desiccants
Water Treatment

### FOOD & NUTRITION

Food Ingredients
Probiotics

### AGRICULTURE & ANIMAL

Agricultural
Veterinary & Feed Additives

### LIFE SCIENCES

Pharmaceuticals
Cosmetics

### NATURAL INGREDIENTS

Essential Oils
Powder Extracts

This gives the website better information architecture without hiding the real portfolio.

---

# 08 — INTRODUCE ACTUAL CHEMICAL IMAGERY

There are currently almost no visible chemicals or raw materials.

This must change.

Use material-specific imagery throughout the site.

Examples:

### ACTIVATED CARBON

Show:

black activated-carbon granules.

Not a generic factory.

---

### CITRIC ACID

Show:

white crystalline / powdered material.

---

### SILICA GEL

Show:

clear or orange silica beads / granules.

---

### SODIUM HYDROXIDE

Show:

white flakes / pellets in an industrial environment.

---

### MOLECULAR SIEVE

Show:

uniform beige / light-brown spherical pellets.

---

### ISOPROPANOL

Show:

clear industrial liquid / drum / stainless processing environment.

---

### ESSENTIAL OILS

Show:

amber liquid / industrial ingredient handling.

Avoid retail cosmetic bottles.

---

### FOOD ENZYMES

Use:

ingredient / industrial food processing visual.

---

# PRODUCT IMAGE STYLE

Alternate between:

macro material photography

and

professional industrial context.

For example:

`material macro → industrial packaging → production application`

Do not show every product as a warehouse bag.

The visitor needs to actually see different textures and material states:

**POWDER**

**CRYSTALS**

**GRANULES**

**PELLETS**

**LIQUIDS**

**OILS**

This diversity will make the website feel chemical-specific.

---

# 09 — REDESIGN PRODUCT EXPLORER AROUND REAL PRODUCTS

Use a light background.

Headline:

# Materials for

# Real Production Needs.

Add category selector:

Industrial
Food & Nutrition
Water Treatment
Agriculture & Feed
Life Sciences
Natural Ingredients

The selected product gets a large visual card.

Example active product:

## ACTIVATED CARBON

Small label:

`WATER TREATMENT / INDUSTRIAL`

Large high-resolution macro image of activated carbon granules.

Short text:

Used across purification and water-treatment applications.

CTA:

**View Material →**

Secondary:

**Request Specification**

Nearby secondary product previews:

Citric Acid
Sodium Metabisulfite
Silica Gel

---

# 10 — ADD MATERIAL TEXTURE MOMENTS THROUGHOUT THE SITE

Introduce occasional full-width or partial photographic close-ups.

Examples:

crystals

activated carbon

silica beads

powder

liquid surface

pellets

These can appear between sections as visual transitions.

Do not make each one its own giant section.

Use them to break the current pattern of:

dark background + typography + line.

---

# 11 — IMPROVE INFRASTRUCTURE VISUALS

Warehouses and shipping remain important, but they should represent approximately 30–40% of the imagery rather than almost all of it.

The overall imagery should balance:

### MATERIALS

chemical products themselves

### APPLICATIONS

factories / industries using them

### INFRASTRUCTURE

warehousing / logistics

This creates a complete company story.

---

# 12 — VISUAL REFERENCE PRINCIPLE

Use these principles:

### STRIPE

for sophisticated particle systems, editorial layout and interaction.

### BRENNTAG

for real product + industry imagery and direct product exploration.

### AZELIS

for markets, product expertise and technical documentation.

### IMCD

for modern material / ingredient presentation and product-document discovery.

### REDA CHEMICALS

for regional chemical-distribution positioning, industries, warehouses and B2B credibility.

Do NOT copy their layouts directly.

Free Trade needs its own visual identity.

---

# 13 — ROUNDING SYSTEM

Keep the revised radius system.

Buttons:
`12–14px`

Controls:
`10–12px`

Standard cards:
`16–20px`

Large visual cards:
`22–28px`

Major editorial / particle section:
`28–32px`

Tags:
pill / `999px`

Do not round structural page boundaries.

Keep Swiss precision in:

grid lines
section alignment
technical labels
typography

The contrast between precise structure and soft interactive surfaces should create the premium feeling.

---

# 14 — CRITICAL PAGE RULE

Every 1–2 sections should introduce a different visual mode.

Examples:

cinematic hero

↓

moving product marquee

↓

interactive 3D object

↓

editorial photography

↓

asymmetric industry imagery

↓

large material product explorer

↓

interactive particle field

↓

dark operational system

↓

light photographic supply journey

↓

technical documentation interface

↓

warehouse architecture

↓

global logistics composition

The visitor should continuously discover something new.

Do not repeat one visual pattern throughout the page.

---

# FINAL TARGET

The site must no longer feel like:

“a premium dark corporate template.”

It should feel like:

**a custom digital identity for an international materials and chemical supplier.**

The design should visually communicate all three levels of Free Trade's business:

# MATERIAL

What they actually supply.

↓

# SYSTEM

How they source, verify, store and move it.

↓

# MARKET

How they help manufacturers obtain the materials they need.

Keep the core positioning:

# FROM MOLECULE TO MARKET.

But make the “molecule” part finally visible in the actual design.
