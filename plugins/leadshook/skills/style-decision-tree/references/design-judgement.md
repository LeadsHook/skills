# Design judgement

The longer guidance behind step 3 of the skill. It covers **intent**: what each brand fact
should become in a decision tree's design, how to keep the result consistent, and what a
design cannot express. It does not cover the design's shape, its colour-scale keys or its
class names — read `leadshook://references/dt-design-json-schema` and the rendering
reference loaded by `get_dt_design_context` for those.

---

## 1. Read the brand's character before you pick values

Before mapping any single value, decide what kind of design this is. A brand's character
settles dozens of small choices that the brief's rows do not. Look for these signals in
the person's site, document or words:

| Signal | What it suggests for the tree |
| --- | --- |
| Clean, minimal, modern software product | Neutral surfaces, medium corners, light or no shadow, one accent colour. |
| Corporate, enterprise, formal | Muted greys and blues, small corners, restrained weights, hairline borders. |
| Card-led, photo-first, friendly | Generous corners, soft shadow under the card, roomy padding. |
| Bold, heavy headlines, finance | Heavy heading weights, strong contrast, a confident solid button. |
| Playful, bright, hand-made | Saturated colour, large rounded corners, pill buttons. |
| Earthy, warm, organic | Warm off-white surfaces, muted natural colours, soft corners. |
| Flat, sharp, utility-first | Square or barely rounded corners, no shadow, borders for separation. |
| Underline-driven, editorial | Inputs as a single bottom line rather than a box; lots of white space. |
| Glass, translucent, frosted | Semi-transparent card over a blurred backdrop. Use sparingly; check readability. |
| Dark canvas, neon, glow | Dark surfaces, light text, a vivid accent. Every element needs its dark version. |
| Traditional, classic | Conservative palette, small corners, steady weights. |

When two characters fit, prefer the one whose typical palette sits closest to the brand's
primary colour. Palette compatibility matters more than any other cue.

---

## 2. From brand facts to the design

### Colour

- **Primary colour** becomes the brand scale, derived as the brief reference describes.
  It drives action and selection: the main button, its hover state, the selected choice,
  focus rings, and accents such as a progress bar or a heading bar.
- **Secondary colour**, if there is one, becomes the secondary scale. Use it for
  complementary touches — the far end of a gradient, a secondary highlight — never for
  the main button.
- **Status colours** (error, success, warning, information) stay at their defaults unless
  the brand defines them. If it does, set the main shade and keep the others in the same
  hue, lighter for backgrounds and darker for text.
- **Page and card background**, **borders** and **body text** are neutrals. They are not
  part of the brand scale. Choose them from the brand's surfaces — pure white or an
  off-white, a light or a medium border, near-black or dark-grey text — and write them as
  neutral colours, not as brand shades.

Use the brand scale for every accent rather than typing the brand's hex value onto
elements. A design built on the scale follows a later brand-colour change; one built on
literal hex values does not. Literal values are fine for neutrals.

### Corners

Translate the brand's radius to the nearest step on the standard scale: square, slightly
rounded, rounded, more rounded, and fully rounded (pill). Use one step across cards,
buttons and inputs. The one common, deliberate exception is pill buttons on softly
rounded cards — keep that pairing when the brand uses it.

### Type

- Map the brand's sizes to the nearest step on the standard text-size scale. Never use
  pixel-exact sizes; they stop text from adapting on small screens.
- Read the brand's **weight philosophy** and apply it everywhere at once. Modest brands
  use medium or semibold on titles, labels and the main button. Heavy brands use bold or
  extra-bold on the same three.
- Letter spacing and line height snap to the nearest standard step. Close is enough.

### Spacing

Snap the brand's spacing to a four-pixel grid. When in doubt between two steps, take the
roomier one for headings and the card's outer padding, and the tighter one between
fields on a form.

### Shadow and depth

| Brand cue | Depth |
| --- | --- |
| Flat, no shadow | None — use borders to separate. |
| Subtle, one-pixel lift | The smallest shadow. |
| Card-like | A medium shadow under the card only. |
| Floating, elevated | A large shadow, mainly on the card and the main button. |

Do not shadow every element. Depth belongs to the card and, at most, the main button.

---

## 3. Consistency rules

These are what make a design look intentional rather than assembled:

1. **Accent scarcity.** If the brand has a single accent, it appears on the main button
   and the selected state of a choice, and almost nowhere else. Strip it from heading
   bars, dividers and borders.
2. **One weight philosophy.** Titles, labels and the main button share it.
3. **One radius family.** Cards, buttons and inputs agree, apart from the pill-button
   exception above.
4. **Flat means flat.** A no-shadow brand has no shadow anywhere — not on the card, not on
   the button, not on hover.
5. **Dark means dark everywhere.** A dark brand turns the card, inputs, choice items,
   borders, placeholders, the back button and helper text to their dark versions together.
   A dark card with white input boxes is the most common half-finished dark design.
6. **Hairline brands separate with borders, not shadow.** A light grey border on light
   surfaces, a dark grey one on dark surfaces.
7. **States are part of the element.** Every interactive element you style has its hover
   state, every input its focus state, every choice its selected state. A brand-styled
   button that reverts to the default blue on hover is worse than no styling.
8. **Cover what the tree uses.** Elements you do not style fall back to LeadsHook's
   default design, which may clash with yours. Check every kind of screen the tree
   actually has — choice lists, text inputs, dropdowns, sliders, switches, consent, the
   closing page — and make sure none is left looking like a different product.

---

## 4. How styling behaves — things that bite

- **An element's styling replaces the default, it does not add to it.** If you restyle
  the main button with only a new colour, it loses its default padding, font and radius.
  Always give an element its complete styling.
- **A single screen can carry its own style overrides**, set in the LeadsHook editor, and
  those win over the tree's design on that screen. If one screen ignores the new design
  after saving, that is the likely reason — tell the person rather than restyling the
  whole tree again.
- **Neutral greys do not come from the brand.** Changing the brand colour does not tint
  the greys used for text, borders and surfaces. If the brand has warm or cool greys,
  write them explicitly.
- **Some controls are newer than the editor.** A few rendered parts — for example the
  chips and options of a multi-select dropdown — can be styled by a design but cannot yet
  be selected in the LeadsHook design editor. If you style them, tell the person they
  will not find them in the editor's element list.

---

## 5. Known gaps — what a design cannot carry

Tell the person about any of these that apply to their brand, with the approximation you
used. Never quietly drop something they will notice.

**Cannot carry over:**

| Brand feature | What to do instead |
| --- | --- |
| A licensed or custom font that is not available as a web font | Propose the closest available web font and say you substituted it. |
| More than a primary and a secondary brand colour (sub-brand palettes) | Keep the primary and secondary; name the palettes you dropped. |
| A custom icon set or hand-drawn illustrations | Not expressible in the design. Images belong on content screens, not in the theme. |
| Custom animations, easing curves or durations | Standard transitions only. |
| Gradients with more than three colour stops | Reduce to two or three stops and say so. |
| Fluid type that scales continuously with the screen | Use fixed steps that change at screen-size breakpoints. |
| A completely separate dark theme | A design can give elements dark-mode variants, but not swap to a second, independent theme. |

**Carried over as an approximation:**

| Brand feature | Approximation |
| --- | --- |
| Exact letter spacing or line height | The nearest standard step. |
| Spacing off a four-pixel grid | The nearest grid step. |
| A bespoke shadow recipe | The nearest standard shadow size. |
| A specific blur strength on glass effects | The nearest standard blur step. |
| A one-pixel border in a precise grey | The nearest neutral grey, or the exact value only if it is critical to the look. |

In the hand-back, list: any palettes dropped by name, whether the brand's fonts were used
or substituted, any colour written as an exact value rather than a scale shade and why,
and any kind of screen in the tree you deliberately left on the default design.
