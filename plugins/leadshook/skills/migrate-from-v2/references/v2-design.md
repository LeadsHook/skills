# Reading the look of a LeadsHook 2 export

This is the detail behind the look part (`look`) of the Vision Brief in the
`migrate-from-v2` skill. Use it to find out **how the old tree looked**, so the new tree
keeps the person's brand instead of a stock design. You only read the look and write it
down here. It's applied later, when the tree is built from the confirmed brief.

Don't copy the old settings one for one. The new LeadsHook styles a set of screen parts
(buttons, answer choices, fields, the card and the page) with a brand colour palette and
fonts from a fixed list. Write down what those parts should look like. Anything the new
tree can't hold goes in the brief's `cannotCarryOver` list, never in `look`.

Never guess. If you can't tell which colour or font the visitor really saw, say which
one you chose in the brief and let the person correct it.

Contents:

1. Where the old tree keeps its look
2. Header, footer and results-page HTML
3. Scripts that load CSS
4. Picking each line of the look
5. When two sources disagree
6. Fonts
7. What goes in `cannotCarryOver` instead
8. Two worked readings

---

## 1. Where the old tree keeps its look

Almost all of it is in the export's `data` object.

**Read this first: a key that is `null`, empty or missing means "the old default".** It
is not a choice the person made. Many exports have almost every design key left at its
default. Only a key with a real value tells you something.

### The design editor's keys

These sit directly on `data`. They're grouped by what they style, and the prefix tells
you the group.

| Prefix | What it styles |
| --- | --- |
| `nextButton*` | The main Next or Submit button. |
| `backButton*` | The Back button. |
| `startButton*` | The button on the start page. |
| `exitButton*` | The button that sends visitors off the tree. |
| `allButton*` | Settings shared by every button. |
| `formInputButton*` | The submit button on a form. |
| `answerButton*` | The answer choices. |
| `nodeFont*` | The question heading: `nodeFont`, `nodeFontWeight`, `nodeFontSize`, `nodeFontColor`. |
| `bodyFont*`, `paragraphFont*` | Body text. |
| `resultsFont*` | Text on results pages. |
| `h1FontStyle` to `h6…` | Headings inside step content. |
| `formInput*`, `input*` | Fields: background, border colour and width, corner radius. |
| `slider*` | The slider's fill and knob. |
| `outerBackgroundColor` | The page behind the tree. |
| `innerBackgroundColor` | The card the tree sits in. |
| `panelBackgroundColor` | A panel inside the card. |
| `innerBorderWidth`, `innerBorderColor` | The card's border. |

Each button and answer group uses the same families of keys:

| Family | What it tells you |
| --- | --- |
| `…BackgroundColor`, `…FontColor` | Fill and text colour. |
| `…BorderWidth`, `…BorderStyle`, `…BorderColor` | The border. |
| `…BorderTopLeftRadius`, `…BorderTopRightRadius`, `…BorderBottomLeftRadius`, `…BorderBottomRightRadius` | How round the corners are, in pixels. |
| `…Fullwidth` | Whether the button spans the full width. |
| `…Font`, `…FontWeight`, `…FontSize` | The button's own font. |
| `…TopPadding`, `…BottomPadding`, `…LeftPadding`, `…RightPadding` | How big it is. |
| `…Hover…` (e.g. `nextButtonHoverBackgroundColor`) | How it looks when the mouse is over it. |
| `…Active…` (e.g. `answerButtonActiveBackgroundColor`) | How it looks when pressed. On answers, this is the **selected** answer. |
| `…BoxShadowColor`, `…BoxXShadow`, `…BoxYShadow`, `…BoxBlurShadow`, `…BoxSpreadShadow` | A shadow. It only counts if an offset or the blur is above 0. |
| `…Opacity` | Almost always 100. Ignore it unless it's below 100. |

### Other places in `data`

| Key | What it holds | How much it tells you |
| --- | --- | --- |
| `data.styles` | Mostly opacities. Also `answerLayout`, `logoAlignment`, `logoColor`, `backButtonText`, `nextButtonText`, and sometimes `outerBackgroundColor`, `innerBackgroundColor`, `titleTextColor` or `titleFont`. | Read the colours and fonts here like editor keys. `answerLayout` `answer-layout-0` is the default. Button text is wording, not look. |
| `data.colorPalette1` to `data.colorPalette4` | The editor's colour swatches. **Not colours that were applied.** | The defaults are `#2196fd`, `#3e5569`, `#d5dcec` and `#fafcfe`. Ignore those entirely. A palette that isn't the default is only a weak hint. |
| `data.progressBar` | `backgroundColor`, `striped`, `height`. | Its colour is often the brand colour, so it's a good hint. The bar itself doesn't carry over. |
| `data.belowHeaderContent`, `data.aboveFooterContent` | Header and footer HTML (section 2). | For some trees this is the only place the brand shows. |
| `data.showHeader`, `data.showFooter`, `data.headerMenus`, `data.footerMenus` | The header and footer switches and their menu links. | Tell you a header or footer existed. |
| `data.favIcon`, `data.removeLeadshookLogo` | The browser-tab icon and the "hide LeadsHook logo" switch. | Don't carry over. |
| `data.firstNode` | A saved copy of the old page's code. | Not settings. Ignore it. |

### On the steps

- `object.beforeResults` and `object.afterResults` on a `resultsPage` step: HTML shown
  on that page. It often has a `<style>` block with the brand in it (section 2).
- `object.description` on a question: usually only text alignment. Skip it unless it
  sets colours or fonts.
- `object.data.styles` on a step: that step's own overrides. Usually button text or
  widths. The new look is one look for the whole tree, so note a step's override only
  if it changes the brand.
- `object.data.confetti`: stock confetti colours found on almost every step. Ignore them.

---

## 2. Header, footer and results-page HTML

`data.belowHeaderContent` is HTML shown under the header. `data.aboveFooterContent` is
HTML shown above the footer. Results pages carry their own HTML in `beforeResults`. Treat
any HTML that isn't empty as something visitors saw.

Look in two places inside the HTML: `<style>` blocks, and inline `style="…"`
attributes. Then:

1. **List the colours.** Hex values, `rgb()` and `rgba()`. An `rgba()` of a colour is the
   same colour: write it as its hex. In a gradient, take the first colour.
2. **Drop the neutrals.** White, black and greys aren't a brand colour.
3. **Find the brand colour.** It's the colour used most on buttons, badges, accent
   borders, links, icons and focus outlines.
4. **Find the second colour.** A dark colour used for text, headings or a footer
   background, or a darker shade of the brand used on hover.
5. **Find the fonts.** Read `font-family`. The first family named is the choice. System
   fonts such as `-apple-system`, `BlinkMacSystemFont`, `Segoe UI` or `sans-serif` are
   fallbacks, not choices.
6. **Note the shapes.** Common `border-radius` values on cards and buttons, and whether
   cards have a `box-shadow`.

The header and footer themselves can't come over (section 7). Their colours and fonts
still feed the look.

---

## 3. Scripts that load CSS

Look at the top-level `scripts` list. Sometimes a CSS file was loaded as a script: its
`name` ends in `.css`, or its `content` is CSS.

- **A stock framework build is not a theme.** If the content opens with a framework's
  banner comment (for example a Tailwind utilities build) and holds only that
  framework's own rules, it tells you nothing about the brand. Ignore it.
- **Custom rules aimed at the tree** can hint at colours and fonts. Read them as in
  section 2. The CSS itself can't come over.
- `data.includedScripts` and `data.excludedScripts` are ids of scripts saved on the
  account. Those scripts may not be in the export. If they aren't, you can't read them.
  Don't guess what they held.

---

## 4. Picking each line of the look

Write exact hex values, and say in plain words where each one shows.

| Line | Where to look, in order | How to decide |
| --- | --- | --- |
| **Brand colour** | `nextButtonBackgroundColor`, `answerButtonBackgroundColor` or `answerButtonActiveBackgroundColor` if set → the main button or accent colour in the header, footer or results CSS → `progressBar.backgroundColor` → a palette that isn't the default | The colour on the main button and the selected answer. |
| **Second colour** | `backButtonBackgroundColor` → hover colours → a dark or navy accent in the CSS | "None" if there's nothing clear. |
| **Text** | Heading font: `nodeFont`, or the CSS `font-family` on headings. Body font: `bodyFont` or `paragraphFont`, or the CSS `font-family` on the body. Colour: `bodyFontColor` or `nodeFontColor`, or the CSS body `color`. | Map fonts with section 6. If buttons use a different font (`nextButtonFont`), say so on the Buttons line. |
| **Buttons** | `nextButton*` corner radius, background, border and `nextButtonFullwidth` | Radius 0 is **square**. About 1 to 12 px is **rounded**. About 20 px or more is **pill**. A fill that differs from the page is **filled**. No fill, or the page colour, with a coloured border is **outlined**. Add the hover look if it's set. |
| **Answers** | `answerLayout`, `answerButton*` radius, border width and colour, padding, `answerButtonHover*` and `answerButtonActive*` colours | Tall padding (about 20 px or more top and bottom) or answer images read as **cards**. Small padding at full width reads as a **list**. Very round and not full width reads as **pills**. |
| **Page** | `outerBackgroundColor`, `innerBackgroundColor` (on `data` or in `data.styles`), `innerBorderWidth`, shadow keys, or the card rules in the CSS | If the card and page share a colour and the card has no border or shadow, say so: the tree sits straight on the page. |
| **Feel** | All of the above, plus the tree's topic | One line, such as "bold and warm, trust-first". |

If the export has no design at all (every key at its default, no brand in any HTML, a
default palette), write "None — use a clean default".

---

## 5. When two sources disagree

- **A key the person set wins for the part it styles.** If `nextButtonBackgroundColor`
  has a real value, that's the main button's colour, whatever the header CSS says.
- **If the editor keys are all defaults, take the brand from the HTML.** When the brand
  shows only in the header, footer or results CSS, that's what visitors actually saw.
- **The progress bar and palette are only hints.** They lose to a set key or to the
  HTML.
- **When two candidates really conflict, pick one and say so.** Write it in the brief,
  for example "Brand colour: #e8590c (orange), from the buttons. The progress bar was
  green, which I didn't use." The person can correct it when they read the brief.

---

## 6. Fonts

The new LeadsHook has a fixed font list. It's in the `build-decision-tree` skill, in
step 5 of "Style the tree". Check that list for every font. Don't rely on memory.

- **The font is on the list:** use it as it is.
- **It isn't:** pick the nearest font on the list, of the same kind: a geometric sans
  for a geometric sans, a humanist sans for a humanist sans, a serif for a serif, a
  display face for a display face. Write "swapped from <old font>" in the brief.
- **Only system fonts** (`-apple-system`, `Segoe UI`, `sans-serif` and the like): there's
  no real choice. Suggest one clean sans from the list and say it's a suggestion.
- **A weight** such as 800 carries over as "extra bold" where the chosen font has that
  weight.

A swapped font also goes in `cannotCarryOver`, so the person sees it before the build.

---

## 7. What goes in `cannotCarryOver` instead

These are part of the old look but the new tree can't hold them. Put each one in the
brief's `cannotCarryOver` list, not in `look`. What to offer instead is in
[does-not-carry-over.md](does-not-carry-over.md), section 6.

- Header and footer HTML, with their menus.
- The logo.
- The progress bar.
- The favicon (`data.favIcon`).
- Custom CSS loaded as a script.
- Fonts that aren't on the new font list.

The "hide LeadsHook logo" switch and per-step overrides don't need an item unless the
person asks about them.

---

## 8. Two worked readings

Key names and patterns only. The colour values are made up for illustration.

### Example A: styled in the design editor

What the export has:

- `nextButtonBackgroundColor` `#e8590c` (orange), `nextButtonFontColor` `#ffffff`, all
  four `nextButtonBorder…Radius` keys at 10, `nextButtonFullwidth` `true`, `nextButtonFont`
  `Roboto`.
- `nextButtonHoverBackgroundColor` `#ffffff` and `nextButtonHoverFontColor` `#d9480f`.
- `backButtonBackgroundColor` `#1b1f4a` (navy).
- `answerButtonBackgroundColor` `#e8590c` with `answerButtonFontColor` `#ffffff`,
  `answerButtonBorderWidth` 2, `answerButtonBorderColor` `#e8590c`, radius 10,
  `answerButtonTopPadding` 30. `answerButtonActiveBackgroundColor` `#e8590c`.
- `answerButtonHoverBackgroundColor` `#ffffff` with `answerButtonHoverFontColor`
  `#e8590c`.
- `answerButtonBoxShadowColor` set, but every shadow offset and the blur at 0.
- `nodeFont` `Poppins`, `nodeFontWeight` 800. `bodyFont` `Poppins`, `bodyFontColor`
  `#2b2d2f`.
- `outerBackgroundColor` and `innerBackgroundColor` `#ffffff` in `data.styles`,
  `innerBorderWidth` 0.
- `progressBar.backgroundColor` `#2f9e44` (green).
- `aboveFooterContent` is one short trust line.

The look part it gives:

```markdown
## 10. How it looks (`look`)
- **Brand colour:** #e8590c (orange) — main buttons, answer choices and the selected answer
- **Second colour:** #1b1f4a (navy) — back button
- **Text:** Poppins for headings (extra bold), Poppins for body text, #2b2d2f (near-black)
- **Buttons:** rounded (10px), filled orange with white text, white with orange text on hover, full width; button text in Roboto
- **Answers:** cards, rounded (10px), 2px orange border, filled orange with white text; white with orange text on hover; orange when selected
- **Page:** white page, white card, no card border, shadow: none
- **Feel:** bold and warm, with big answers that are easy to tap
```

The green progress bar loses to the set button colours (section 5). It goes in
`cannotCarryOver` with the progress bar and the footer's trust line.

### Example B: styled in the header and footer HTML

What the export has:

- Every design-editor key missing or `null`. The palette is the default.
- `data.styles` holds only opacities, `answerLayout` `answer-layout-0` and
  `outerBackgroundColor` `#ffffff`.
- `progressBar.backgroundColor` `#f76707` (orange).
- `belowHeaderContent` and `aboveFooterContent` both have a `<style>` block and many
  inline styles. The most-used colour that isn't a neutral is `#f76707`, on badges,
  accent borders and focus outlines. `#d9480f` shows up in gradients and on hover.
  `#243447` (dark slate) colours the text and the footer background. Both use
  `font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`.
  Corners are mostly 10 to 12 px. Cards have soft shadows.
- A `resultsPage` step's `beforeResults` has inline orange styling: an orange icon
  background, and cards with a light grey border that turn orange on hover.
- One script is a CSS file holding a stock Tailwind build and nothing else.

The look part it gives:

```markdown
## 10. How it looks (`look`)
- **Brand colour:** #f76707 (orange) — main buttons, selected answers and accents. Taken from the header, footer and results page, because the design editor was left at its defaults.
- **Second colour:** #243447 (dark slate) — back button and headings
- **Text:** Montserrat for headings, Montserrat for body text, #243447 (dark slate)
- **Buttons:** rounded (10px), filled orange with white text, darker orange (#d9480f) on hover, normal width
- **Answers:** list, rounded (12px), 1px light grey border, orange border when hovered or selected
- **Page:** white page, white card with a light grey border, shadow: soft
- **Feel:** warm and trustworthy, a friendly local service
```

And the `cannotCarryOver` items it gives:

```markdown
- **What:** A header with a trust strip, menu and logo, and a footer with reviews, team and contact details — **Instead:** I can rebuild them as a landing page around the new tree, with the same wording, links and look, once the tree is built.
- **What:** A striped orange progress bar — **Instead:** The new tree doesn't show one. The first step can say how many questions there are.
- **What:** A CSS file loaded as a script — **Instead:** It was a stock style framework, not your brand. Your look is rebuilt from the brief, so nothing is lost.
```

---

## Common questions

**Q: Every design key is `null`. Does the tree have no look?**

A: Not yet. Check the header, footer and results-page HTML, and the progress bar. The
brand often lives there. Write "None — use a clean default" only when all of them are
empty or default too.

**Q: The palette has four colours. Are those the brand?**

A: Only if they aren't the defaults, and even then they're just a hint. The palette is
the editor's swatches, not colours that were applied.

**Q: Can I copy the old CSS into the new tree?**

A: No. Read the colours, fonts and shapes out of it and write them in `look`. The CSS
itself goes in `cannotCarryOver`.
