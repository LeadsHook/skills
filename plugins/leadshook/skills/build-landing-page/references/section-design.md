# Designing the sections

The templates give each section its structure. This file is the judgement that turns a
stack of filled-in templates into one page that looks designed — and, when the person has
a brand, looks like *their* brand rather than a generic page with their colour on it.

Everything about markup, class names, the `brand-*` theme and what the editor accepts
comes from `leadshook://references/page-builder-spec`. This file never overrides it.
Where the two seem to disagree, the spec resource is right.

---

## 1. Carry the brand, not your taste

### Decide the page's look once, before the first section

A brand is more than a colour. Before composing anything, settle these five decisions
from the confirmed brand brief (see `references/brand-brief.md`) and, when you have it,
from the person's own website or design-system document. Write them down for yourself
and apply them to every section.

| Decision | How to read it from the brand | What it changes |
| --- | --- | --- |
| **Type weight** — modest or heavy | Modest brands use medium-to-bold headings at moderate sizes; heavy brands use very large, very bold display headlines. | Headline size and weight in every section. |
| **Surface** — flat or gradient | Does their site use plain solid backgrounds, or colour gradients? | Whether any band may use a gradient. Flat brands get none. |
| **Accent use** — scarce or generous | Count where their brand colour appears. On a scarce brand it is on the main button and little else; on a generous brand it is on icons, badges, links and whole bands. | Icon backgrounds, stat numbers, the highlighted price plan, whether a CTA band may be filled with brand colour. |
| **Corner style** — sharp, soft, rounded or pill | From the brief's corner style, and the radius of their cards and buttons. | Every card, button, image and badge on the page. |
| **Spacing** — dense, standard or generous | Tight bands read as a marketplace or catalogue; very generous ones read as editorial or premium. | The vertical padding of every band. |

One optional sixth: some brands keep **one oversized number** as a signature — a big
rating, a headline statistic. If theirs does, give the page exactly one such moment, in
the social-proof or testimonial band. If it does not, do not add one.

### The templates' defaults are a starting point, not a look

The bundled templates ship with one neutral default style: heavy extra-bold headlines,
soft-rounded cards with thin borders, brand-tinted circles behind feature icons, brand
coloured stat numbers, and a brand-bordered middle pricing plan. That is a sensible
generic page. It is not anyone's brand. When the five decisions above point elsewhere,
change the templates to match — every instance, not just the hero.

### Route colour through the theme, never around it

- The brand colour reaches the page through the `brand-*` theme the spec describes. Set
  the theme from the brief and let sections use the theme's shades. Never paste the brand
  hex into a section — then the person cannot re-theme the page with one change.
- Only the brand's primary colour becomes the theme. Their greys, borders and body text
  stay on the neutral grey scale, picked by how light or dark they are. Do not stretch the
  brand colour onto things that are grey on their own site.
- There is one brand scale per page. A secondary colour or a sub-brand palette has no
  slot of its own; use the primary, and tell the person the secondary was not carried.
- Every colour you change keeps its dark-mode counterpart. The templates pair them
  throughout; the spec says what is required.

### What does not carry over, and what to do instead

Some brand features cannot be reproduced in page sections. Substitute quietly, then list
each substitution in one line when you hand the page back.

| Brand has | Do instead |
| --- | --- |
| A custom or licensed font | Check the spec for what the page can load. If the font cannot be used, keep the default family and match the brand's feel through weight and size. |
| Hand-drawn or bespoke icons | Simple, consistent line or solid icons in one style. |
| Several sub-brand palettes | The main brand palette only. |
| Many levels of shadow | One shadow level, or none on a flat brand. |
| Animation, video backgrounds, scrolling logo marquees | A static image or a static row. |
| Exact decimal spacing, letter-spacing or line-height | The nearest standard step. Precision here is invisible; consistency is not. |

---

## 2. Rules that hold across every section

A page looks designed when its sections agree with each other. Check these across the
whole page, not section by section.

- **One corner radius for cards and images, one for buttons.** If buttons are pills,
  every button is a pill, including the header's and the pricing cards'.
- **One heading scale.** The hero's headline is the only page-level headline. Every
  other section heading shares one size and weight, smaller than the hero's.
- **One primary button style.** Same colour, radius, size and weight everywhere it
  appears. The secondary button is likewise one style — outline or plain, never a second
  filled colour.
- **One vertical rhythm.** Every content band uses the same padding. Thin bands — a logo
  strip, the footer's legal row — may be tighter, but consistently so.
- **One content width.** All sections share the same container width, so the left edge
  of text lines up down the page.
- **A background rhythm, not a pattern.** Most bands sit on the plain page background.
  Use the soft grey surface to separate a band that would otherwise run into the next —
  typically the proof band or a CTA between two plain bands. Never let two tinted bands
  touch, and never alternate every band mechanically.
- **An accent budget.** On a scarce brand, any one screen should show the brand colour
  in one or two places, with the primary button always one of them. If a screen has
  four brand-coloured things, the button no longer stands out.
- **Deliberate alignment.** Centered suits short, symbolic bands — a centered hero,
  a testimonial, stats, logos, the pricing heading. Left-aligned suits anything read
  as paragraphs — features, FAQ, a CTA with body copy. Pick per section by its job,
  not at random.
- **Readable contrast everywhere.** Body text on its background, button text on the
  button, white text on any brand-filled band. If the brand colour is light, buttons need
  dark text or a darker shade of the brand.

---

## 3. Section by section

### Header

- **Job:** say whose page this is and offer the one action. Nothing else.
- Keep links to three or fewer. Every link on a landing page is an exit; a lead-capture
  page often needs none. Drop the link list rather than invent destinations.
- The header's button is the page's primary action in miniature — same label idea, same
  style as the hero's primary button.
- The secondary log-in link stays quiet, as text. Remove it if the visitor has nothing
  to log in to.
- Match the brand's own nav: light bar on a light brand. Use a dark bar only when their
  site's nav is dark.
- The brand name or logo is the strongest element on the left; nav links are smaller and
  muted.

### Hero — centered

- **Choose it when** there is no strong product image, when the brand is modest in
  weight, or when the message is a single promise (thank-you pages, opt-ins).
- Hierarchy: headline, then subtext, then buttons — three steps, no fourth. No badge,
  no stats row, no logo strip inside the hero.
- Keep the headline to two lines on a desktop screen. If it needs three, the copy is too
  long, not the type too big.
- The primary button is filled brand; the secondary is outline. If there is no genuine
  second action, delete the secondary button rather than fill it with "Learn more".
- Plain background on a flat brand. A gradient brand may use a very light tint of its
  own colour behind the hero, fading to the page background — never a saturated band
  under body text.

### Hero — side image

- **Choose it when** there is a real image that shows the product in use or the outcome,
  and when the brand is heavier and more product-led.
- The text column carries the whole message on its own: the image is hidden on small
  screens, so nothing essential may live only in the picture.
- The image takes the page's card radius. Do not frame it in a heavy border or shadow on
  a flat brand.
- Choose imagery in the brand's mood: photographic brands get photography; product
  brands get a clean screenshot. Do not mix an illustration hero with photographic proof
  further down.

### Features

- **Job:** turn the offer into benefits the visitor recognises.
- Three or six cards. Lead each card title with the benefit; the description gives the
  mechanism in one or two sentences. Keep card lengths similar so the row looks even.
- Icon backgrounds follow the accent decision: brand-tinted circles on a generous brand,
  neutral grey circles with dark icons on a scarce one.
- Card style follows the surface decision: thin borders on a light, flat brand; soft grey
  filled cards without borders on brands that separate content with tone instead of
  lines.
- All icons from one family, one size, one style. A mismatched icon reads as an error.
- For a step-by-step process, replace icons with numbers in the same position — the
  order then carries meaning.

### Social proof (stats)

- **Job:** make the next section believable with real figures the person gave you.
- Four stats fill the template's row; if there are only two or three real ones, use those
  and rebalance the grid rather than invent a fourth.
- The numbers are the loudest type in the band. On a generous brand they may be brand
  coloured; on a scarce brand set them in the heading colour so the button keeps the
  accent.
- Labels are short and specific: "quotes issued last year", not "happy customers".
- This band is the natural place for the brand's one oversized number, if it has one.

### Logo strip

- **Job:** borrowed credibility at a glance. Only real customers or partners the person
  confirms they may show.
- Keep logos visually equal: same height, muted or single-tone, so no one logo shouts
  and none fights the brand colour.
- One row. Five fits the template; fewer is fine and looks deliberate if centered.
- The lead-in line is small, muted and short — the logos do the talking.
- Do not use the brand colour here.

### Testimonial

- **Job:** one real person confirming the promise in their own words.
- One strong quote beats three weak ones. Trim it to the sentence that names a result,
  with the person's permission to edit.
- The quote is the largest text in the band; name and role are small and muted.
- Use a real photo or none. A stock face next to a real name is worse than no face —
  remove the avatar and keep the name.
- Neutral colours. The quote mark stays grey; this band does not need the brand colour.

### Pricing

- **Job:** make one plan the obvious choice.
- Exactly one plan is highlighted, and only that plan's button is filled with the brand
  colour. The others use the secondary button style.
- How loud the highlight is follows the accent decision: on a scarce brand, a neutral card
  with a small brand badge and a brand outline; on a generous brand the highlighted card
  may be filled with brand colour, with its text and button inverted to stay readable.
- The price is the largest text in each card. Keep the period ("per month") small next
  to it.
- List features in the same order on every card so they can be compared line by line.
- Tick icons stay neutral or a muted success colour. Do not brand them on a scarce brand.

### FAQ

- **Job:** clear the last objections before the closing CTA.
- Write the questions in the visitor's words, the way they would type them. Answers are
  two or three sentences; link out for anything longer.
- Keep an even number so the two columns balance.
- No brand colour, no icons, no cards. This band should feel calm and plain.

### CTA

- **Job:** collect the visitors the page has persuaded. One action.
- One brand-coloured element in the band — the primary button. The heading stays in the
  heading colour, not brand colour.
- A fully brand-filled band is only for generous brands whose own site uses brand-colour
  bands. Then the heading and body turn light, and the button inverts to a light button
  with brand-coloured text.
- When the CTA sits between two plain bands, give it the soft grey surface so it reads
  as its own moment.
- The template's secondary button must be a lesser step ("See pricing"), never a second
  conversion. On a closing CTA, deleting it is usually better.

### Decision-tree slot

- **Job:** mark where the decision tree appears. The marker is not what visitors see —
  the tree renders there. Do not spend effort restyling the marker.
- The tree is now the page's main action, so nothing near it competes: no CTA band
  directly above or below, and the hero's primary button should point down to the tree
  rather than elsewhere.
- Give the tree a clear lead-in — usually the hero's subtext or a short heading in the
  band above it — telling the visitor what answering gets them.
- **Design the tree from the same brand brief.** The tree's buttons, colours, font and
  corners must match the page's, or it will look embedded from another site. Use one
  confirmed brief for both.

### Footer

- **Job:** legal and trust, nothing more. On a landing page it should not pull people
  away.
- Light footer when the brand's site has a light footer; dark contrast footer when theirs
  is dark. Match their site, not habit.
- Use only as many link columns as the person has real links for. A landing page often
  needs just the copyright and legal row — drop the columns rather than fill them.
- Legal links must point to real pages. Flag missing ones to the person instead of
  leaving dead links.
- Muted type throughout. The footer never uses the brand colour for emphasis.

---

## 4. Common mistakes

- Changing the hero to match the brand and leaving every other section on template
  defaults. The mismatch shows at the first scroll.
- Painting brand colour onto icons, stats, badges, headings and borders at once. The
  page turns one colour and the button disappears into it.
- Pasting the brand hex into a section instead of setting the theme.
- Two filled buttons of different colours side by side.
- Pill buttons in the hero and square buttons in the pricing cards.
- A gradient band on a brand whose own site is entirely flat.
- Every band on alternating backgrounds, or two tinted bands touching.
- Section headings at three different sizes down the page.
- A light brand colour with white button text that fails contrast.
- Keeping the template's heavy extra-bold headline on a modest, understated brand.
- Inventing logos, avatars, stats or footer links to fill a template's slots.
- A decision tree styled in default colours inside a fully branded page.

## 5. Check the whole page

- [ ] The five look decisions were made once and every section follows them.
- [ ] Brand colour comes only from the theme; no hardcoded brand hex in any section.
- [ ] One card radius, one button radius, one primary button style, one heading scale.
- [ ] No screen shows the brand colour in more places than the accent decision allows.
- [ ] Every colour change kept its dark-mode counterpart.
- [ ] Text is readable on every background, including buttons and filled bands.
- [ ] Anything the brand has that the page could not carry is listed for the person.
- [ ] If there is a decision tree, it was designed from the same brief.
