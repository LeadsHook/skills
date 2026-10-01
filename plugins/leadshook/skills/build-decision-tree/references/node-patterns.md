# Node patterns

Read the section for a node type once you have chosen it and before you compose it —
with `generate_node` and `add_node`, or inside a tree for `import_decision_tree`. Each
section says when the type is right, when it is wrong, the few configuration decisions
that matter, and the mistakes that show up most.

This file describes decisions in words. It never names a setting or a field. For what a
node actually accepts, read the resource named at the end of each section, and apply
any constraints `generate_node` returns — those are binding. Settings shared by every
node (heading, content around the input, buttons, tracking) are at
`leadshook://schemas/node/_base`.

If you are still choosing between two types, read `node-selection.md` first.

---

## Choice nodes

### `single_choice`

**Right when** the visitor picks one answer from a handful of options, and especially
when each answer should lead somewhere different.

**Wrong when** several answers are allowed (`multiple_choice`), the list is long
(`dropdown`), or it is a plain yes/no with no routing (`switch`).

Decisions that matter:

- **Routing.** Each option can go to its own next node, and several options can share
  one. Decide this before you write the options: group options that lead to the same
  place rather than duplicating downstream screens.
- **Scores.** If the tree qualifies or scores visitors, give each option a score now. A
  `calculation_node` can total them later; retrofitting scores means touching every
  choice node again.
- **Option order.** Keep a natural order (sizes, ranges, frequency) as written. Randomise
  only when the options are peers and their position would bias the answer.
- **"Other".** If the list cannot be exhaustive, offer an "other" option that lets the
  visitor type their own answer, rather than forcing a wrong pick.

Common mistakes: overlapping ranges ("1–10", "10–50"); more than about ten options; an
option with no route when routing is used; vague labels the visitor has to interpret.

Settings: read `leadshook://schemas/node/single_choice`

### `multiple_choice`

**Right when** the honest answer can be more than one thing — "select all that apply".

**Wrong when** you need each answer to route somewhere different: it has one way out. Use
`single_choice` if one answer is enough, or follow it with a `decision_node`.

Decisions that matter:

- **How many may be picked.** Set a minimum when an empty answer is useless, and a
  maximum when you want priorities ("pick your top three") rather than everything.
- **Scores**, **order** and **"other"** — decide exactly as for `single_choice`.
- **Branching later.** If a `decision_node` will read this answer, its conditions must
  test whether the selection *includes* given options, not whether it *equals* one value.
  A test of the wrong shape does not error — it silently never matches.

Common mistakes: using it for a question with one true answer; no "none of these"
option when none is a real possibility.

Settings: read `leadshook://schemas/node/multiple_choice`

### `dropdown`

**Right when** one answer comes from a long list — industry, country, a list of products.

**Wrong when** there are only a few options (`single_choice` converts better), or the
list is so long that scrolling is unreasonable and the visitor already knows the answer
(`auto_complete`).

Decisions that matter:

- **Search.** For a long list, let the visitor type to filter if the schema offers it.
- **Order.** Alphabetical for lookup lists (countries, industries); logical for ranges.
  Put "Other" last, not alphabetised into the middle.
- **Scores**, when the answer feeds qualification.

Common mistakes: a dropdown of three options; no catch-all option on a list that cannot
be complete; expecting it to route per option the way `single_choice` does.

Settings: read `leadshook://schemas/node/dropdown`

### `related_dropdown`

**Right when** the second choice depends on the first — country then region, make then
model, category then product.

**Wrong when** the two answers are independent (two separate nodes), or the first list
has only two or three entries (a `single_choice` that routes to different follow-up
nodes may read better).

Decisions that matter:

- **Complete child lists.** Every parent option needs its own child list. A parent with
  nothing under it leaves the visitor stuck.
- **Labels for both lists**, so the visitor knows what the second one is asking.
- **Required or not**, applied to both levels consistently.

Common mistakes: a child list keyed to a parent value that does not exist; very large
nested lists that would be better served by `auto_complete`.

Settings: read `leadshook://schemas/node/related_dropdown`

### `switch`

**Right when** the answer is a genuine on/off fact with an obvious default — do you own
your home, are you currently insured.

**Wrong when** each answer needs its own wording or its own route (`single_choice` with
two options), or it is consent to marketing or terms (a setting on `email` or `phone`).

Decisions that matter:

- **The starting state.** Start it off unless "on" is genuinely the expected answer. A
  pre-switched-on answer gets accepted without being read.
- **The label** should read as a statement that is true when on ("Yes, I own my home"),
  not as a question.

Common mistakes: using a switch for permission or consent; a label that is ambiguous when
switched off.

Settings: read `leadshook://schemas/node/switch`

### `auto_complete`

**Right when** the list is too long to show — job titles, medications, vehicle models,
towns — and the visitor knows what they are looking for.

**Wrong when** the visitor needs to browse to recognise their answer (`dropdown`), or the
list is short (`single_choice`).

Decisions that matter:

- **Where suggestions come from** — a fixed list you supply, or a data source the schema
  supports.
- **Whether a typed answer that is not on the list is accepted.** If the list cannot be
  complete, say so in the helper text and allow it.
- **Placeholder and helper text** that tell the visitor to start typing.

Common mistakes: a fixed list of a dozen items (that is a `dropdown`); no hint that
typing is expected.

Settings: read `leadshook://schemas/node/auto_complete`

---

## Contact and identity nodes

### `email`

**Right when** you need the visitor's email address. It is also the home of double
opt-in and consent.

**Wrong when** you want to email the team (`email_notification`).

Decisions that matter:

- **Verification.** Turn on double opt-in when lead quality matters more than volume, or
  when the next step depends on a working address. Write the verification message in the
  client's voice; it is often the first email the lead receives.
- **Consent.** Attach the consent checkboxes the client's market requires (marketing
  permission, privacy, terms) here, with wording the client supplies. Decide which are
  required to continue and which are optional. Never invent legal wording.
- **Placement.** Late in the flow, after the visitor has invested effort — see the
  skill's sequencing section.

Common mistakes: a separate screen or `switch` for consent; a separate node for
verification; asking for email on the first screen.

Settings: read `leadshook://schemas/node/email`

### `phone`

**Right when** you need a phone number, with or without verifying it.

**Wrong when** you want to text the team (`sms_notification`).

Decisions that matter:

- **Countries.** Set the default country to where most visitors are. Restrict the list
  when the client can only serve certain countries — it stops unusable leads at the door.
- **Validation strictness.** Strict validation catches typos; insisting on mobile numbers
  only makes sense when you will text them.
- **Verification** by text or messaging app, when a reachable number is the point of the
  lead. It needs a messaging integration on the client's account — check before
  promising it.
- **Consent**, exactly as on `email`, for calling or texting permission.

Common mistakes: verification turned on with no integration available; a country list
that excludes the client's own market.

Settings: read `leadshook://schemas/node/phone`

### `name`

**Right when** you need the visitor's name.

**Wrong when** you need a company name or any other proper noun (`text`).

Decisions that matter:

- **Shape of the answer** — first name only, first and last as two inputs, or full name in
  one input. First name only is the lightest and enough for a friendly follow-up; first
  and last when a CRM or a sales team needs them separately.
- **Placement** — it is personal data, so late in the flow with the other contact
  details, or combined with them in a `form`.

Common mistakes: building it as two `text` nodes; asking for a full name when only a
first name will ever be used.

Settings: read `leadshook://schemas/node/name`

### `address`

**Right when** you need a full postal address.

**Wrong when** you only need a postcode or ZIP (`text`) or only a city or region (`text`,
or a `dropdown` if the list is known).

Decisions that matter:

- **Autocomplete.** Address lookup makes entry faster and cleaner, but it depends on an
  address-lookup integration on the client's account. Without one, the node is a plain
  input — say so rather than promising lookup.
- **Required or not.** An address is a heavy ask; require it only when the service
  genuinely needs it.

Common mistakes: asking for a full address when a postcode would qualify the lead;
asking for it early.

Settings: read `leadshook://schemas/node/address`

---

## Free-entry nodes

### `text`

**Right when** the answer is one line — company, job title, city, promo code, postcode.

**Wrong when** the answer is several sentences (`text_area`), a number someone will do
maths on (`number`), or a choice from a known list (a choice node).

Decisions that matter:

- **Length limits**, when a minimum stops one-letter junk or a maximum matches what the
  receiving system stores.
- **Placeholder** showing an example answer — clearer than a label alone.
- **Format checking** for things like postcodes, where the schema supports it.

Common mistakes: using it for a postcode-and-address combination; using `number` instead
for postcodes or phone-like codes, which loses leading zeros.

Settings: read `leadshook://schemas/node/text`

### `text_area`

**Right when** you want a free-form answer longer than a line — describe your problem,
anything else we should know.

**Wrong when** you want a short, structured answer (`text` or a choice node).

Decisions that matter:

- **Required or optional.** Open questions are the most skipped; make it optional unless
  the answer is essential, and say why you are asking.
- **Visible height**, sized to the answer you hope for — a tall box invites a longer
  reply.
- **A maximum length** when the answer goes into a system with a limit.

Common mistakes: making a long free-text answer required early in the flow.

Settings: read `leadshook://schemas/node/text_area`

### `number`

**Right when** the visitor knows an exact figure and precision matters — age, headcount,
quantity, revenue.

**Wrong when** an approximate figure is fine (`slider`), the value is a range
(`dual_slider`), or it is a code that merely looks numeric (`text`).

Decisions that matter:

- **Bounds** that reject impossible values (a negative headcount, an age of 300).
- **Step** — whole numbers unless decimals are meaningful.
- **Placeholder** that shows the unit or an example.

Common mistakes: no bounds; using it for postcodes or phone numbers.

Settings: read `leadshook://schemas/node/number`

### `slider`

**Right when** a rough figure or a rating is enough — budget, satisfaction 1–10, how
urgent.

**Wrong when** the visitor knows the exact value and it matters (`number`), or you need
both ends of a range (`dual_slider`).

Decisions that matter:

- **Range and step** that match how people think about the quantity — budgets in round
  steps, ratings in whole numbers.
- **Display** — a currency or unit before or after the value, thousands separators, and an
  open top end ("500k+") when the real maximum is unbounded.
- **Forcing a move.** Require the visitor to move the handle when a default position
  would otherwise be submitted as a real answer.

Common mistakes: a starting value that biases answers; a range so wide each step is
meaningless.

Settings: read `leadshook://schemas/node/slider`

### `dual_slider`

**Right when** the visitor gives a low and a high end — price window, income bracket,
age range.

**Wrong when** one value is enough (`slider`).

Decisions that matter:

- **Starting positions** for both handles, usually spread across a sensible middle.
- **Range, step and display**, as for `slider`.
- **Downstream use.** It produces two values; any `decision_node` or
  `calculation_node` that uses it must read the right end.

Common mistakes: using two separate nodes for the low and high ends instead.

Settings: read `leadshook://schemas/node/dual_slider`

### `date`

**Right when** you need a calendar date that is not a birthday — appointment, start date,
deadline.

**Wrong when** it is a birth date (`date_of_birth`) or a time of day only (`time`).

Decisions that matter:

- **Earliest and latest allowed dates.** Appointments and start dates should not accept
  the past; deadlines may have a sensible horizon.
- **A pre-filled date** only when one answer is genuinely most likely.

Common mistakes: allowing past dates for an appointment; fixing bounds to literal dates
that will go stale.

Settings: read `leadshook://schemas/node/date`

### `date_of_birth`

**Right when** you need a birthday — for an age check, eligibility, or compliance.

**Wrong when** an approximate age is enough (`number`, or a `single_choice` of age bands
if you will branch on it).

Decisions that matter:

- **Minimum age.** Enforce an age gate by limiting the latest allowed birth date, rather
  than checking afterwards.
- **Picker style.** Month / day / year selectors are far quicker than a calendar for dates
  decades ago; use them when the schema offers the choice, especially for older
  audiences.

Common mistakes: using a calendar picker that opens on today and makes the visitor click
back forty years.

Settings: read `leadshook://schemas/node/date_of_birth`

### `time`

**Right when** you need a time of day — appointment slot, best time to call.

**Wrong when** you need a broad window ("morning / afternoon / evening") — that is a
`single_choice`, and easier to act on.

Decisions that matter:

- **Whether an exact time is really needed.** Most "best time to call" questions are
  better as a choice of windows.
- **Time zone.** If visitors span time zones, say which zone the answer is in.

Common mistakes: asking for an exact minute when the team works in half-day blocks.

Settings: read `leadshook://schemas/node/time`

### `file_upload`

**Right when** the visitor must provide a document or image — a CV, a photo of damage, a
bill.

**Wrong when** the file is optional nice-to-have early in the flow — uploads are a big
ask and a common drop-off point.

Decisions that matter:

- **Accepted file types** — only what the team can actually use.
- **Maximum size** — big enough for a phone photo, small enough to be sensible.
- **Required or not**, and where in the flow: after the visitor is committed.

Common mistakes: accepting any file type; requiring an upload before the visitor knows
why.

Settings: read `leadshook://schemas/node/file_upload`

### `form`

**Right when** several fields obviously belong together and the person asked for them
on one screen — most often name, email and phone at the end.

**Wrong when** the questions would work one per screen (they almost always complete
better that way), or when any field on it needs to drive branching — a form has one way
out.

Decisions that matter:

- **Which fields, and in what order** — the easiest first, the most sensitive last.
- **Each field's own settings.** A field inside a form is configured like the node of the
  same kind; read that type's guidance and schema as well.
- **Required versus optional per field.** Every extra required field costs completions.

Common mistakes: putting the whole questionnaire in one form; losing verification or
consent because they were expected on a standalone `email` or `phone` node — check the
schema for how they apply inside a form.

Settings: read `leadshook://schemas/node/form`

---

## Display nodes

### `custom_page`

**Right when** the visitor should read or watch something — an intro, an offer, an
explanation between questions, an embedded video.

**Wrong when** the screen exists only to ask one question (use that question's node), or
it is the closing screen (`thank_you_page`, where available).

Decisions that matter:

- **Content** in the client's words. Never fill it with placeholder copy.
- **Heading** — usually hidden, since the content carries its own.
- **One clear button** that says what happens next.

Common mistakes: a wall of text before the first question; a `custom_page` used as a
reassurance note that belongs as content on the input node itself.

Settings: read `leadshook://schemas/node/custom_page`

### `pdf`

**Right when** the visitor should read a document in place — an agreement, a policy, a
brochure.

**Wrong when** a short paragraph would do (`custom_page`) or the visitor only needs a
link.

Decisions that matter:

- **The document's address** — it must be publicly reachable.
- **Whether reading is required** before continuing; reserve that for agreements.

Common mistakes: a required read of a long brochure mid-funnel.

Settings: read `leadshook://schemas/node/pdf`

### `thank_you_page`

**Right when** a route ends and the visitor stays.

**Wrong when** the visitor should be sent elsewhere (`redirect_node`).

Decisions that matter:

- **What happens next**, in plain words — when they will be contacted, what to look for in
  their inbox.
- **Different endings for different routes.** A disqualified visitor deserves a
  different, polite ending from a qualified one; branches may also rejoin on one shared
  ending when the message is the same.
- **Where conversion tracking fires** — usually just before or on reaching this screen.

Common mistakes: a generic "Thanks!" with no next step; a route that ends without one.
Settings: read `leadshook://schemas/node/thank_you_page`

---

## Logic nodes

### `decision_node`

**Right when** the route depends on data already held — a score, an `api` result, a
combination of earlier answers — with no question asked.

**Wrong when** you are routing on the answer to the question just asked
(`single_choice` routes that itself).

Decisions that matter:

- **Order of routes.** The first route whose conditions match wins. Put the most specific
  conditions first and the broad ones after.
- **A fallback route** with no conditions, last, for everything that did not match. It is
  not optional — it will be used.
- **"All of" versus "any of".** Within one condition group, decide whether every
  condition must hold or any one is enough; several groups on one route widen it.
- **Comparing the right shape.** Multi-select answers and tags need "includes" style
  tests; numbers need numeric comparisons; dates need date comparisons. A mismatched test
  silently never matches.

Common mistakes: no fallback; overlapping conditions in the wrong order; comparing a
number field as text.

Settings: read `leadshook://schemas/node/decision_node`

### `calculation_node`

**Right when** you need a number derived from earlier answers — a score total, a payment
estimate, an age from a birth date, a weighted ranking.

**Wrong when** you only want to copy or set a value (`field_assignment`).

Decisions that matter:

- **Inputs exist.** Place it after every answer the formula reads; an unanswered input
  produces a wrong result, not an error you will see.
- **Inputs are numbers.** Only numeric answers and option scores belong in arithmetic.
- **Where the result goes** — a lead field a `decision_node`, a `tag_assignment` or the
  closing screen can then use.

Common mistakes: placing it before an optional question it depends on without allowing
for a blank answer.

Settings: read `leadshook://schemas/node/calculation_node`

### `field_assignment`

**Right when** you want to write a value onto the lead as the visitor passes — a lead
source, a status, a segment, or a value built from earlier answers.

**Wrong when** the value comes from a calculation (`calculation_node`), or you are
"initialising" fields at the start of the flow (declare those in the tree's Fields tab).

Decisions that matter:

- **Fixed or built from answers.** Values can include earlier answers; make sure those
  answers exist by this point.
- **Placement on the right route.** Setting "status: qualified" belongs on the qualified
  branch only.

Common mistakes: a `field_assignment` as the first node of the flow.

Settings: read `leadshook://schemas/node/field_assignment`

### `tag_assignment`

**Right when** you want labels on the lead for segmentation, reporting or follow-up.

**Wrong when** you want to route the visitor (`decision_node`) — tags label, they do not
route.

Decisions that matter:

- **Rules are independent.** Every rule whose conditions match applies its tags; this is
  not first-match. Write rules that are allowed to overlap.
- **Unconditional tags** for labels every lead on this route should get.
- **Tag names** the client already uses in their CRM, so segments line up.

Common mistakes: assuming only one rule fires; inventing a tag vocabulary that clashes
with the client's.

Settings: read `leadshook://schemas/node/tag_assignment`

### `conversion_tracker`

**Right when** you want the lead to record that it reached a funnel milestone — interest,
qualified, converted — for reporting.

**Wrong when** you mean an ad-platform pixel event (a tracking setting on a visible node)
or a label for segmentation (`tag_assignment`).

Decisions that matter:

- **Which milestone.** Milestones are defined at project level and are permanent once
  created — reuse the client's existing ones rather than coining new names.
- **Rule order.** The first matching rule wins; put the most specific first and a catch-all
  last if every lead should record something.
- **Value**, when a milestone carries a monetary worth for reporting.

Common mistakes: one tracker at the start of the flow that marks everyone as converted.

Settings: read `leadshook://schemas/node/conversion_tracker`

---

## Integration nodes

### `webhook`

**Right when** the lead should be pushed to another system — a CRM, an automation tool —
and the flow carries on without waiting.

**Wrong when** the flow needs anything back (`api`).

Decisions that matter:

- **Placement.** After the contact details exist; usually near the end of each route that
  produces a lead.
- **What a failure does.** Decide whether a failed push should stop the visitor. For a
  background CRM push it almost never should.
- **What is sent.** Include the answers the receiving system needs, using the lead's
  values, and the authentication it expects. Never paste a secret the person did not give
  you.

Common mistakes: firing before the email node; letting a flaky endpoint block every
visitor.

Settings: read `leadshook://schemas/node/webhook`

### `api`

**Right when** the flow needs an answer from another system — enrichment, verification,
a credit or eligibility check — and will use it.

**Wrong when** nothing comes back that the flow uses (`webhook` is lighter).

Decisions that matter:

- **What to keep from the reply** — map each value you need onto a lead field.
- **A fallback** for every mapped value, so a missing reply does not leave a blank that
  breaks routing.
- **What happens next** — usually a `decision_node` that routes on the result, with a
  route for when the call failed.
- **Speed.** The visitor waits for it; avoid chaining several.

Common mistakes: no route for a failed or empty reply; using it where a `webhook` would
do.

Settings: read `leadshook://schemas/node/api`

### `email_notification`

**Right when** the team should be emailed that a lead came in or reached a stage.

**Wrong when** the email is for the visitor — verification is on the `email` node.

Decisions that matter:

- **Recipients**, including routing to different people by branch or by an answer.
- **Subject and body** that include the answers the recipient needs to act, so they do
  not have to log in to see them.
- **Placement** — after the details it reports.

Common mistakes: one notification at the start that reports an empty lead.

Settings: read `leadshook://schemas/node/email_notification`

### `sms_notification`

**Right when** someone on the team needs an immediate text — a hot lead, an urgent
request.

**Wrong when** the text is for the visitor (phone verification is on the `phone` node),
or an email would do.

Decisions that matter:

- **Recipient number**, fixed or chosen from an answer.
- **A short message** — one line with the essentials and a name to call.
- **A messaging integration** on the client's account; check before promising it.

Common mistakes: texting the team for every lead rather than the ones worth an
interruption.

Settings: read `leadshook://schemas/node/sms_notification`

### `redirect_node`

**Right when** the visitor should leave the tree — to a booking page, a checkout, the
client's own site.

**Wrong when** they should stay and see a closing message (`thank_you_page`).

Decisions that matter:

- **The destination**, and whether to pass answers along in it so the next page is
  pre-filled (name and email into a booking form).
- **A short delay**, only when a screen before it must be seen first.
- **Different destinations per route** when qualified and unqualified visitors should go
  to different places.

Common mistakes: putting nodes after it (nothing after a redirect runs); redirecting
before the lead has been sent anywhere.

Settings: read `leadshook://schemas/node/redirect_node`
