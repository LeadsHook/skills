---
name: build-landing-page
description: Build, restyle, or extend a LeadsHook landing page. Use when someone asks for a landing page, a sales page, a lead capture page, an opt-in, webinar or thank-you page, a headline or hero rewritten, a new section such as pricing, testimonials or FAQ added to a page they already have, or a whole page rebuilt around a different offer. Covers choosing which sections the page needs, putting them in a persuasive order, writing the copy, picking imagery, and saving the result into the page editor.
metadata:
  version: "0.3.0"
---

# Build a landing page

This skill decides **what a page should contain and in what order**, then saves it
through the page-builder tools. It ships a set of section templates you fill in with
the customer's own copy.

## Read the spec before you write any section

The page builder's own rules live in a resource:

```
leadshook://references/page-builder-spec
```

Read it at the start of every page-building job. It owns — and is always current about —
the section JSON shape, which `category` values are valid, the `brand-*` theme system,
and what the editor will and will not accept. **Do not work from memory and do not work
from the templates alone.** If this skill and that resource ever disagree, the resource
is right.

This skill deliberately does not repeat any of that. What it gives you instead is
judgement: which sections a described page needs, what order converts, and what good
output looks like.

## Orientation

The LeadsHook server remembers nothing between calls. There is no "current account" that
stays set. Every account-scoped call needs the account passed to it, every time. Run this
first:

1. `whoami` — confirms who is connected. It returns `{ email }`. That is the whole
   return; there is no id on it.
2. `list_accounts` — returns `{ "accounts": [ { id, name }, … ] }`. Read the list from
   its `accounts` property. If there is one account, use it. If more than one came back
   and the request does not say which, ask.
3. **Pass `accountId` on every account-scoped call** from here on, including calls you
   make later in the same conversation. Never assume an earlier call set it for you.
4. `list_projects` — with the `accountId`. A page lives inside a project. Confirm which
   one before creating anything.

## The tools

| Tool | Use it for |
| --- | --- |
| `list_pages` | See what the project already has before creating a near-duplicate. |
| `create_page` | Create the page record the sections will live on. |
| `build_page` | Build a page from a description in one step. |
| `update_page_sections` | Write your composed sections onto a page — new or existing. |
| `update_page_image` | Swap one image on a page without rewriting its sections. |
| `search_images` | Find imagery for a hero, a testimonial avatar, or a logo strip. |
| `delete_page` | Remove a page. Confirm with the person first — this is destructive. |
| `update_decision_tree` | Link a finished page to its tree with `designId`, so the tree is served inside the page. |

Each tool's exact parameters come from the tool definition your client already exposes.
Read that definition; do not guess an argument name.

**Which route to take**

- *"Make me a landing page for X"* with little detail → `build_page`. It is the fastest
  path to something the person can react to.
- *You have specific copy, a specific section list, or a specific design in mind* →
  `create_page`, then compose the sections yourself and send them with
  `update_page_sections`. You keep full control of the markup this way.
- *"Change the headline" / "add an FAQ" / "swap that photo"* → never rebuild the page.
  Fetch what is there, change only the affected section, and send it back with
  `update_page_sections`. For an image on its own, `update_page_image` is smaller and
  safer.

## When you're handed a decision tree

Sometimes the page is for a tree that already exists, for example when `build-decision-tree`
hands off with the tree's id and title, the account and project, the goal, the audience,
the copy points and the look agreed for the tree.

- **Don't re-ask what you were given.** The handoff answers Step 1: the goal is the one
  action, the audience tells you how much proof to add, and the copy points are the offer.
  Use the same account and project. Only ask about what's missing.
- **Write from the copy points.** Build the headline, subtext and buttons from the offer
  and wording in the handoff, and follow the Step 4 rules.
- **Match the tree's look.** Use the agreed colours and tone for the page theme so the page
  and the tree feel like one thing.
- **Embed the tree with an `insert_dt` section that carries the tree's id as `dtId`.** That
  is the only thing that puts the real tree on the page. With `build_page`, add a section
  with `type` `insert_dt` and `dtId`. With `update_page_sections`, put `dtId` in that
  section's `content`. `templates/decision-tree-slot.html` is only a visual marker: it has
  no tree id, so it never shows the tree.
- **Start from the "Capture leads with a decision tree" order** in Step 3, with the tree
  right under the hero. With `build_page`, set the hero's `ctaUrl` to `#dt` so its button
  scrolls to the tree instead of leaving the page.
- **Link the page to the tree when it's saved.** Call `update_decision_tree` with the
  tree's `dtId` and the page id (`pageId` from `build_page`, or the id from
  `create_page`) as `designId`. Embedding the tree on the page isn't enough: without
  this link, the tree's own link still shows the bare tree, not the page around it.

## Step 1 — Work out what the page is for

Before picking sections, settle three things. Ask if the request does not answer them:

1. **The one action** the visitor should take. A landing page with two goals converts on
   neither.
2. **Who is landing on it** — cold traffic from an ad needs far more proof and
   explanation than warm traffic from an email.
3. **The offer** — what they get, and what it costs them (money, time, or their details).

## Step 2 — Match a brand

Do this whenever the person gives you a brand colour, their website, or a design-system
document, or asks for the page to "look like our brand". Skip it otherwise and keep the
default theme.

1. Read `references/brand-brief.md` and reduce what they gave you to its short brief.
2. Write the brief back and get it confirmed before you design anything.
3. Apply it through the page's `brand-*` theme, exactly as
   `leadshook://references/page-builder-spec` describes. Never paste the brand hex into a
   section.
4. Settle the page's overall look from the brief — weight, surface, accent use, corners,
   spacing — as `references/section-design.md` explains, and hold every section to it.

If the page embeds a decision tree, use the same confirmed brief for the tree's design
too, so the tree and the page around it match.

## Step 3 — Choose the sections

Map what the person described onto the bundled templates:

| They described | Template |
| --- | --- |
| A nav bar, a logo, menu links, a top bar | `header.html` |
| A headline, the fold, an opening banner, a "main message" | `hero-centered.html` |
| A hero with a product shot, screenshot or photo beside the text | `hero-side-image.html` |
| Benefits, "why us", what it does, a grid of cards | `features.html` |
| Numbers, "trusted by", customer counts, results | `social-proof.html` |
| A row of customer or partner logos | `logo-strip.html` |
| A quote, a review, a success story | `testimonial.html` |
| Plans, tiers, packages, what it costs | `pricing.html` |
| Common questions, objections, "what if…" | `faq.html` |
| "Sign up now", a closing push, a standalone action band | `cta.html` |
| The place their decision tree, quiz or form appears on the page | `decision-tree-slot.html` |
| Legal links, copyright, the bottom of the page | `footer.html` |

That table lists the templates this skill bundles — it is not the list of `category`
values the builder accepts. Take the `category` for each section from the spec resource.

Read a template with a plain relative path from this skill's directory, for example
`templates/hero-centered.html`.

When you compose the sections, read `references/section-design.md`. It covers how each
section should look — layout choice, hierarchy, where the brand colour goes and where it
does not — and the rules that keep the sections consistent with each other.

### Sizing the page

- **Warm traffic, one simple ask** — header, hero, one proof block, CTA, footer. Five
  sections. Do not pad it.
- **Cold traffic, or a considered purchase** — you need to teach and reassure, so
  features, proof and FAQ all earn their place.
- Every section must do a job. If you cannot say what a section changes in the visitor's
  mind, cut it.

## Step 4 — Order them

Order is the part that converts. Start from the closest match:

| Page goal | Order |
| --- | --- |
| Capture leads with a decision tree | Header → Hero → Decision-tree slot → Features → Social proof → Footer |
| Opt-in / lead magnet | Header → Hero → Features → CTA → Footer |
| Webinar or event signup | Header → Hero → Features → Testimonial → CTA → Footer |
| Free trial / SaaS signup | Header → Hero → Features → Social proof → Pricing → CTA → Footer |
| Sell a product | Header → Hero (side image) → Features → Testimonial → Pricing → FAQ → CTA → Footer |
| Book a call | Header → Hero → Social proof → Features → Testimonial → CTA → Footer |
| Thank-you / confirmation | Header → Hero (centered, confirmation copy) → CTA (next step) → Footer |

The reasoning behind the ordering, so you can adapt it:

- **The hero sits directly under the header.** Everything below it is read in the frame
  the hero sets.
- **Put the ask high when the ask is small.** A short form or a decision tree can sit
  right under the hero. A price cannot — it needs proof in front of it.
- **Proof goes before the ask, never after.** Social proof and testimonials exist to make
  the next section believable.
- **Break up long stretches of explanation.** After a features grid, a testimonial resets
  the reader's attention.
- **FAQ goes last but one.** Its job is to clear the final objections, and then the
  closing CTA collects the people it just freed up.
- **Close with one CTA.** Not two competing ones.

## Step 5 — Write the copy

The templates carry `{{PLACEHOLDER}}` tokens. Replace **every** one — a page that ships
with a visible `{{HEADLINE}}` is a broken page. Replace them with the customer's real
words, not with lorem ipsum and not with a generic rewrite of the placeholder name.

- **Headline** — the outcome the visitor gets, not what the product is. "Cut your quote
  time to under a minute" beats "Insurance automation software".
- **Subtext** — one or two sentences. Who it is for, and why the headline is credible.
- **Feature cards** — lead each with the benefit, then say the mechanism. Three or six
  cards look right in the grid; four or five leave a ragged last row.
- **Buttons** — say what happens next: "Get my quote", "Start the assessment". Never
  "Submit" or "Click here".
- **Testimonials** — use a real quote or ask for one. Never invent a customer, a name, a
  company or a statistic. If the person has no proof yet, leave the section out and tell
  them why.
- **Numbers** — same rule. Only use figures the person gave you.
- Keep it in the customer's voice and their market's vocabulary. Match the reading level
  of the audience, not of a brochure.

## Step 6 — Images

Use `search_images` for hero art, avatars and logos, then put the returned URL into the
template's image placeholder. Rules that matter:

- Always write real `alt` text. It is read aloud by screen readers and shown when the
  image fails.
- A hero image should show the product in use or the outcome — not an abstract stock
  handshake.
- Skip the image rather than ship a placeholder that does not load. `hero-centered.html`
  exists precisely so a page does not need one.
- To change an image on a page that is already live, `update_page_image` is the right
  tool — it leaves the rest of the sections untouched.

## Step 7 — Check before you save

Run through this every time:

- [ ] No `{{PLACEHOLDER}}` token survives anywhere in the output.
- [ ] Section `category` values match what the spec resource defines.
- [ ] Each section has a unique id, in the form the spec resource requires.
- [ ] Exactly one primary action per band — a page full of equal-weight buttons has no
      call to action at all.
- [ ] Nothing is invented: no fake testimonial, no made-up statistic, no claim the person
      did not make.
- [ ] Links point somewhere real, or are left for the person to fill in and flagged to
      them.
- [ ] The theme is driven by the `brand-*` system the spec resource describes, so the
      page follows the customer's palette instead of hardcoded colours.
- [ ] Every section shares one corner style, one button style and one heading scale.

Then save with `update_page_sections`.

## Step 8 — Hand it back

Tell the person, briefly:

- which sections you used and why that order,
- anything you left blank for them (links, real testimonials, prices),
- anything from their brand the page could not carry, one line each,
- one concrete next thing to try — usually the headline, which is what moves conversion
  most.
- when the page wraps a tree: that it's linked, and the tree's preview link
  (`previewUrl` from the tree's import) now shows the page around it.

## Reference files

In `references/`, relative to this skill's directory. Read each when its step says to.

| File | Read it when |
| --- | --- |
| `brand-brief.md` | The person gives a brand colour, website or design system (Step 2). |
| `section-design.md` | You compose or restyle any section (Steps 2 and 3). |

## Bundled templates

All in `templates/`, relative to this skill's directory. Each one is a complete,
self-contained section with `{{PLACEHOLDER}}` tokens to fill in.

| File | What it is |
| --- | --- |
| `header.html` | Top nav: brand, three links, a log-in link and a primary button. |
| `hero-centered.html` | Centered headline, subtext and two buttons. No image needed. |
| `hero-side-image.html` | Headline and buttons on the left, image on the right. |
| `features.html` | Three icon cards under a heading and intro line. |
| `social-proof.html` | Four big numbers with labels. |
| `logo-strip.html` | A row of five customer or partner logos under a short line. |
| `testimonial.html` | One quote with avatar, name and title. |
| `pricing.html` | Three plans with the middle one marked as most popular. |
| `faq.html` | Four question-and-answer pairs in two columns. |
| `cta.html` | A closing band: heading, one paragraph, two buttons. |
| `decision-tree-slot.html` | A visual marker for where the decision tree goes. It carries no tree id, so to show a real tree use an `insert_dt` section with its `dtId` instead. |
| `footer.html` | Four link columns plus a copyright and legal row. |

Notes on filling them in:

- The SVG icons in `features.html` ship with a usable default shape. Swap the `d`
  attribute for one that fits the feature when you have a better match.
- `pricing.html` assumes three plans. For two, delete the first card and keep the
  highlight on the plan you want chosen. For four, the grid gets cramped — push the
  fourth into a `cta.html` band instead.
- `faq.html` and `features.html` are duplicate-a-block patterns. Copy an inner block to
  add an item; keep the count even in `faq.html` so the two columns balance.
