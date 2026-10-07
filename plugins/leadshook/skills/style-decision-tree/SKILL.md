---
name: style-decision-tree
description: Change how a LeadsHook decision tree, quiz or form looks — colours, fonts, buttons, corner style, spacing — or make it match a brand, a website or a design system. Use when someone wants a tree restyled, branded or themed, wants to see what a styled screen will look like, or wants a reusable design preset saved for a project.
metadata:
  version: "0.3.0"
---

# Style a decision tree

A decision tree's **design** is separate from its flow. The flow decides which screens a
visitor sees; the design decides how every one of those screens looks — colours, fonts,
buttons, inputs, corners, spacing. One design covers the whole tree, so a single change
reaches every screen.

This skill is about **judgement**: turning a brand into a short brief, deciding what to
restyle and what to leave alone, and making sure the result is readable and consistent.
It is deliberately not about the shape of the design payload or the names of the classes
it targets. Those live in the MCP resources and are always current; anything written down
here would go stale between plugin releases.

If the person also wants to change the questions or the order of the flow, that is a
separate job. Get the flow right first, then style it.

## References in this skill

| File | Read it when |
| --- | --- |
| [references/brand-brief.md](references/brand-brief.md) | Step 2, every time. It turns "make it look like our brand" into a confirmed brief, and shows how to derive a full colour scale from one hex value. |
| [references/design-judgement.md](references/design-judgement.md) | Step 3, before you compose. It holds the longer guidance: how brand facts map onto the design, the consistency rules, and what a design cannot express. |
| [references/previews.md](references/previews.md) | Step 4, before you show anything. It covers building and displaying a preview screen. |

---

## 0. Get oriented

The LeadsHook server remembers nothing between calls. There is no "current account" that
stays set. Every account-scoped call needs the account passed to it, every time. Start a
session like this:

1. `whoami` — confirms who is connected. It returns `{ email }`. There is no `id` on it;
   do not look for one.
2. `list_accounts` — returns `{ "accounts": [ { id, name }, … ] }`. Read the list from
   its `accounts` property. If there is one account, use it. If there are several, show
   the names and let the person choose.
3. **Pass `accountId` on every account-scoped call** from here on, including calls you
   make later in the same conversation. Never assume an earlier call set it for you.

Then resolve the tree:

- `list_decision_trees` — turn a tree the person named in words into an id. If several
  match, show them and let the person choose.
- `export_decision_tree` — read the tree's nodes. You need to know which kinds of screen
  it actually has (choice lists, text inputs, sliders, a closing page) so you style what
  is there and preview the screens that matter. (`get_decision_tree` returns the tree's
  settings and styles, but not its nodes.)

If the person wants a reusable preset rather than a design for one tree, you also need the
project: `list_projects`, and let them choose if there is more than one.

**If a call is refused for a missing or wrong account, that is not an error to work
around.** Add the right `accountId` to that call and retry it. `select_account` only
confirms you can reach an account; calling it does not set one for later calls.

---

## 1. Load the design context

Call `get_dt_design_context` **as soon as you know which tree you are styling** — before
you confirm the brief, and before any design output: no styles, no preview, no palette.
The tool expects to be called at the start of every design conversation, and having the
reference loaded lets you talk about the tree's real screens while you settle the brief. Pass `accountId`, and pass `dtId` whenever there is a tree: the tool
then tailors its context to that tree's real nodes rather than every possible node.

It loads the rendering reference into the conversation: the page skeleton, the markup of
each node and field type, the class catalogue a design targets, and a preview shell. The
same reference is readable as the resource `leadshook://references/dt-rendering`. Treat it
as the only source for class names and markup. Never invent one.

You only need to call it once per conversation, unless you switch to a different tree.

---

## 2. Build and confirm the brand brief

Follow [references/brand-brief.md](references/brand-brief.md). Whatever the person
started from — a hex value in the chat, their website, a design-system document — reduce
it to the brief's handful of rows, write it back as a short list, and get a yes or a
correction **before you design anything**.

Two things matter more than the rest:

- **The primary colour must be real.** It comes from the person, their site's main
  call-to-action button, or their document. Never guess it from a company name or a logo
  description.
- **Mark what you filled in.** Defaults you proposed are labelled as defaults, so the
  person can see which rows they have not actually decided.

If the person only asked for a narrow change — "make the buttons green", "use Poppins" —
you do not need a full brief. Confirm the one or two values and change only those.

---

## 3. Compose the design

Read the resource `leadshook://references/dt-design-json-schema` first. It is the only
correct source for the shape of the styles object, which colour scales exist and which
shades each needs, and how styling is attached to elements. Do not reproduce it from
memory.

Then read [references/design-judgement.md](references/design-judgement.md) and decide.

**What to set from the brief:**

- **The brand colour scale.** Derive it from the primary colour as the brief reference
  describes. Every accent — the main button, the selected choice, focus rings, the heading
  bar if the design has one — should use the brand scale rather than a typed-in hex value.
  That way a later brand-colour change re-themes the whole tree in one move.
- **A secondary scale**, only if the brief has a secondary colour.
- **Typography.** The heading and body families from the brief, at sensible sizes and
  weights. If you set fonts, the design must carry them all the way through to the save.
- **Buttons.** The primary button is the one thing that must carry the brand. The back or
  previous button is quieter — neutral, outlined, or text-only.
- **Inputs and choice items.** Borders, fill, focus state and the selected state of a
  choice. The selected state should be unmistakable at a glance.
- **Corner style.** One radius family across cards, buttons and inputs, from the brief.

**What to leave alone:**

- Structure and layout of the screens. A design changes appearance, not the flow or the
  order of fields.
- Error, success and warning colours, unless the brand explicitly defines them. The
  defaults are already readable and recognisable; a brand-coloured error message is not.
- Elements the tree does not use. Styling them is harmless but it lengthens the design and
  the review for no visible gain.

**Readability comes first.** Text on the brand colour must be readable: white on a dark
enough shade, or a dark shade on a light brand colour. Body text stays near-black on light
surfaces and near-white on dark ones. Placeholder text must still be legible. If the
brand's exact colour fails this, use a darker shade from its own scale for the button and
say why.

---

## 4. Preview before saving

Follow [references/previews.md](references/previews.md), using the styles you are about
to save. Show at least:

- **the first screen** — it decides whether anyone continues, and it is where the brand
  makes its first impression;
- **one input-heavy screen** — a form, an email or phone screen, or a long choice list —
  because inputs, labels, focus and selected states are where designs break.

Use the person's real content from the tree, never sample text. Say under each preview
that it is a close likeness built from the rendering reference, not the live page, and
ask the next decision you need.

Iterate here. Changing the preview is cheap; changing a saved design is a second round of
review.

---

## 5. Choose where to save — never silently

When the person has reviewed and approved the design, present the choice plainly:

1. **Apply it to this tree** — `save_dt_design` with `target: "dt"` and the tree's
   `dtId`. The tree's look changes; nothing else does.
2. **Save it as a reusable project preset** — `save_dt_design` with `target: "project"`,
   the `projectId`, and a `name`. Optionally a short `description` and the `brandColor`
   hex. Recommend this when the design is meant to be shared across several trees or
   reused later.

Then **wait**. Do not call `save_dt_design` until the person has explicitly confirmed the
target and, for a preset, the name. Approving how the design looks is not the same as
choosing where it goes.

When you call it:

- Pass the same styles object you previewed. Do not tidy or regenerate it on the way out.
- Brand shades must be hex values.
- If the design set fonts, include its typography. The tool keeps typography exactly as
  given; leaving it out drops the fonts.
- If the tool rejects the payload, read the message literally, fix what it names, and
  show the person anything that visibly changed before trying again.

---

## 6. Hand back

Tell the person, briefly:

- **what changed** — brand colour, fonts, buttons, inputs, corners, in a sentence each;
- **where it went** — this tree, or a preset with the name they chose;
- **what you could not carry over** from their brand, and the approximation you used
  instead (see the known gaps in design-judgement);
- **what to check in the LeadsHook editor's preview** before the tree goes live:
  the first screen, a screen with inputs, the selected state of a choice, an error
  message (submit a required field empty), the closing screen, and the whole thing on a
  phone-sized view. Inputs that LeadsHook finishes in the browser — the phone country
  picker, date pickers, searchable dropdowns — only show their real look there.

A saved preset does not restyle any tree by itself. Say so, and tell them it is ready to
apply to their trees from the project.

---

## Before you save

- [ ] `get_dt_design_context` was called for this tree before any design output.
- [ ] The brief was confirmed, and every value in the design traces back to it or to an
      explicit request.
- [ ] Accents use the brand scale, not typed-in hex values.
- [ ] Text on every coloured surface is readable, including the primary button.
- [ ] One corner style throughout, unless the brand deliberately pairs pill buttons with
      softer cards.
- [ ] Every element you restyled has its complete styling, not just the one property you
      changed (see common mistakes).
- [ ] The person saw a preview of the first screen and an input-heavy screen, and approved.
- [ ] The person chose the target explicitly, and named the preset if it is one.
- [ ] If fonts were set, typography is in the payload.

## Common mistakes

- **Saving a fragment of an element's styling.** When an element is restyled, its styling
  replaces the default for that element wholesale; it is not merged. Give a button its
  padding, colours, font, radius and hover state together, or it loses the ones you left
  out.
- **Hard-coding the brand hex on buttons and accents.** It looks right today and refuses
  to follow the next brand-colour change.
- **Restyling some inputs and not others.** A tree that mixes restyled text boxes with
  default dropdowns looks broken. If you touch one input kind, look at every input kind
  the tree uses.
- **Pixel-exact font sizes.** Use the standard size scale so text resizes properly on
  small screens.
- **Brand colour on everything.** One accent, used for action and selection, reads as
  confident. Brand-coloured headings, borders, dividers and backgrounds all at once reads
  as noise and hides the button.
- **Forgetting dark surfaces.** If the brand is dark, inputs, placeholders, borders and
  the back button all need their light-on-dark versions, not just the card background.
- **Saving before the target is chosen**, or saving a preset with a name the person did
  not give.
- **Expecting a saved preset to change a tree on its own.** It has to be applied.

---

## Related tools

- `export_decision_tree` — the tree including its current styles. Use it to preview the
  tree as it looks today, or to compare before and after.
- `get_decision_tree` — the tree's settings and its current `styles`, but not its nodes.
- Changing the questions, their order or the branching is the flow, not the design. Do
  that first, with the tree-building tools, then come back and style it.
