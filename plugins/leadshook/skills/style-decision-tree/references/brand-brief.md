# The brand brief

Every "make it look like our brand" request starts the same way: reduce whatever the
person gave you to one short **brand brief**, confirm it with them, and only then design.
The same brief drives a decision tree's design and a landing page's theme, so a tree
embedded in a page matches it.

---

## 1. What the brief contains

Keep it this small. Anything more is a design decision, not a brand fact.

| Item | What to record |
| --- | --- |
| Primary colour | One hex value — the colour of their main buttons and links. |
| Secondary colour | Optional. One hex value for a second accent. |
| Text and surface | Whether the brand is light (dark text on white) or dark (light text on a dark surface). |
| Heading font | One font family name. |
| Body font | One font family name. Often the same as the heading font. |
| Corner style | Sharp, slightly rounded, or fully rounded (pill buttons). |
| Tone | Two or three words: "calm, clinical", "bold, playful". Guides choices the other rows do not settle. |

Write the brief back to the person as a short list and ask them to confirm or correct it
before you design anything.

## 2. Getting there from what they gave you

People start from one of three places. Turn each into the brief above.

### They told you in the chat

"Our colour is #0F766E and we use Inter." Take what they said, fill the remaining rows
with sensible defaults, and mark the ones you filled in so they can correct them. Do not
ask about every row one by one — propose, then let them correct.

### They gave you their website

Read the site and extract the brief from what is actually there:

- **Primary colour** — the colour of the main call-to-action button, not the most common
  colour on the page (that is usually white or a grey).
- **Fonts** — the families the headings and body text use.
- **Corner style** — the radius of the main buttons and input fields.
- **Text and surface** — the background behind the main content.

If you cannot read the site from your client, say so and ask for the primary colour and
font instead. Never guess a brand colour from a company's name or logo description.

### They gave you a design-system document

Some teams keep a written design system — a document listing colour tokens, type scale,
radii and component rules. Take the brief's rows from it directly. Where the document
offers several candidates (five blues), prefer the one it names for primary actions.

## 3. Turning one colour into a full scale

LeadsHook designs use a scale of shades for each colour — light tints for backgrounds and
hover states, dark shades for text on light surfaces. The keys of the scale, and which
colours a design needs scales for, come from the design schema
(`leadshook://references/dt-design-json-schema`) and, for pages, from
`leadshook://references/page-builder-spec`.
Read the one you are working with.

When you have only one hex value and need the full scale, derive it so that every shade
keeps the brand's hue:

1. Convert the hex value to hue, saturation and lightness.
2. Keep the hue unchanged.
3. Use the saturation unchanged, but never above 95%. Near-grey brand colours stay grey.
4. Set each shade's lightness from this ramp, lightest to darkest:

   | Shade | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 |
   | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
   | Lightness % | 97 | 93 | 87 | 78 | 65 | 50 | 40 | 32 | 25 | 18 | 12 |

5. Convert each shade back to a hex value.

This is the ramp LeadsHook uses when it derives a design palette from a single colour,
so a scale made this way matches one LeadsHook would make from the same value. The brand's exact hex usually lands near the
500 or 600 shade, not on it — that is expected. If the person insists their exact colour
appears on the buttons, use the shade closest to it for button backgrounds.

## 4. Checks before you use the brief

- [ ] Text on the primary colour is readable. White text needs a dark enough shade
      behind it; on light brand colours use a dark shade for button text instead.
- [ ] The heading and body fonts are available as web fonts. If one is not, propose the
      closest available family and say you substituted it.
- [ ] Nothing in the brief was invented. Every value came from the person, their site,
      their document, or is marked as a default you proposed.
