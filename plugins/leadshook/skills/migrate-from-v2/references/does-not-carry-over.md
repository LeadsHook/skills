# What does not carry over from LeadsHook 2

This is the detail behind section 5 of the `migrate-from-v2` skill. It lists the old
features that have no one-for-one match in the new LeadsHook, and what to offer the
person instead. How to **spot** each one in the export is in
[v2-export.md](v2-export.md), section 6. The design items in section 6 below are spotted
with [v2-design.md](v2-design.md).

Each item is one of two kinds:

- **Works differently.** The new LeadsHook meets the same need another way. Tell the
  person how, so they aren't surprised when the new tree looks different.
- **Does not carry over.** The new LeadsHook has no way to do it. Tell the person what
  the new tree will do instead, and check they're happy with that.

Either way, the item goes in the brief's `cannotCarryOver` list as `{ what, instead }`,
and the person sees it **before anything is built**. Write both halves in plain words:
`what` says what the old tree did, and `instead` says what the new tree will do.

Name the new step types and features here, but never their settings. How each step is
set up comes from `leadshook://schemas/node/{type}`. When a condition is involved, use
only operators from `conditionOperators` in `leadshook://schemas/node/_base`.

---

## 1. Scoring and score-based results

**Works differently, with one gap.**

What the old tree did: answers (and sometimes decision paths) carried `points`. The
points added up to a score, and a scoring results page used a points table or score
ranges to pick which result the visitor saw.

What the new LeadsHook does:

- **Points on answers carry over.** In the new LeadsHook, each answer on a
  pick-one question (`single_choice`) or a tick-all-that-apply question
  (`multiple_choice`) can carry a score. The scores of the answers the visitor picks
  add up in the `lh_score` system field as they go.
- **Score ranges become a branch.** There's no scoring results page. Put a Decision step
  (`decision_node`) after the last scored question. Give it one path per score range,
  using `lh_score` with operators such as `greater_than_or_equals` and
  `less_than`. Send each path to its own end page (`thank_you_page`). Check the range
  paths from the highest score down, because the first matching path wins.
- **Showing the score.** An end page can show the score by placing `{{lh_score}}` in its
  text.
- **The gap: points on decision paths.** The new LeadsHook can't add points from a
  decision step. Offer one of these instead:
  - move the points onto the answers that lead into that path, or
  - replace the points with a label: a Tag Assignment step (`tag_assignment`) or a Field
    Assignment step (`field_assignment`) that marks the lead with a tier, such as
    `hot`, `warm` or `cold`, and branch on that tier later.
- **Formula-based scores.** If the score came from a formula (a `calculated` field),
  rebuild it as a Calculation step (see section 1b). If it was a `sumplus` running total
  that was really a score, rebuild it as answer scores plus range paths instead.
- **Points on decision paths** can also be added up in a Calculation step, such as
  `{{total}} + 10` saving to `total`, when that is clearer than moving the points onto
  the answers.

Plain scoring stays answer scores, `lh_score` and range paths.

When you're finished, the brief should say, for each result: the score range (or the
answers) that leads to it, and what the visitor sees there.

Example `cannotCarryOver` entry:

- what: "Your results page picked a result from a points table (0–10, 11–20, 21+)."
- instead: "Each answer keeps its points. After the last question, the new tree checks
  the total and sends people to one of three end pages, one per range."

## 1b. Calculated fields

**Works differently.**

What the old tree did: a `calculated` field held a `formula` using other fields, such as
`{price} * {qty}`. The old tree recalculated it whenever it was used. A `sumplus` field
kept a running total.

What the new LeadsHook does: a Calculation step (`calculation_node`) works out one
formula and saves the answer to a field.

- **Formula.** Use the old formula with each `{field}` changed to `{{field}}`. The rest
  usually carries over as it is: `round(x, n)`, `a ? b : c`. `random` and `randomInt`
  take numeric constant expressions only, e.g. `randomInt(1, 10)` or `random(1, 2 * 3)`;
  no fields, no other functions, no arrays inside them. Lists (a field with several
  values) work only directly inside `min`, `max`, `mean`, `median`, `sum`, `prod`, `std`,
  `variance` or `mad`, and `mode` is not available, so an old formula using `mode` does
  not carry over as it is. An old formula such as
  `randomInt({min},{max})` with fields as arguments does not carry over as it is:
  use fixed numbers instead. `concat` only joins text, so wrap number fields in `string()`:
  `concat("$", string({{price}}))`. Functions outside the supported list (for example
  set, matrix or probability helpers) do not carry over, and the step would save nothing.
  Rebuild that decision another way. `**` isn't valid, so use `^`. An empty or missing
  field counts as 0.
- **Result.** Save it to the old field's name, in snake_case. Declaring that field in the
  Fields tab is optional. If the old name starts with `lh_`, pick a new snake_case name
  instead: result fields starting with `lh_` are refused, so the step would save nothing.
- **Where it goes.** After the last step that collects a field the formula uses, and
  before anything that shows or branches on the result.
- **Several calculated fields.** One Calculation step each, in the order they depend on
  each other. A later step can use an earlier step's result.
- **Running totals (`sumplus`).** If it was really a score, use answer scores. Otherwise
  use a Calculation step like `{{total}} + {{x}}` saving to `total`.
- **The difference to tell the person.** The old tree recalculated a value whenever it
  was used. The new one calculates when the visitor passes the step. If an input changes
  after that, the value updates the next time they pass the step. It's one formula per
  step.

Example `cannotCarryOver` entry:

- what: "A 'monthly cost' field worked out from price and months, recalculated whenever
  it was shown."
- instead: "A Calculation step after the last of those questions works it out and saves
  it as `monthly_cost`. It's calculated when the visitor passes that step."

## 2. Timed transitions

**Does not carry over.**

What the old tree did: a `transition` step showed a short message, then moved on by
itself after a delay.

What the new LeadsHook does: no page moves on by itself after a delay. Offer one of
these instead:

- **Fold the message into the next step.** A "Crunching your answers…" message can sit
  at the top of the next page or the result.
- **Keep it as its own page** (`custom_page`) with a **Continue** button. The visitor
  moves on when they click.
- **Drop it** if it was only there for pacing.

Ask which one the person wants when the transition's message matters. Otherwise suggest
folding it into the next step.

Example `cannotCarryOver` entry:

- what: "A 'Calculating your results…' screen that moved on by itself after 3 seconds."
- instead: "The message appears at the top of your results page instead. The new
  LeadsHook has no page that moves on by itself."

## 3. Removing tags on a path

**Works differently.**

What the old tree did: a decision path could take tags off the lead (`removeTags`), as
well as add them and set fields.

What the new LeadsHook does: a Decision step only routes. It doesn't add or remove tags,
and it doesn't set fields. Instead:

- **Removing or adding tags:** put a Tag Assignment step (`tag_assignment`) on that
  path, right after the decision. Its rules can **add** or **remove** tags. Every rule
  whose conditions match runs, not just the first one. All adds happen first, then all
  removes, so if the same tag is both added and removed, the remove wins.
- **Setting fields:** put a Field Assignment step (`field_assignment`) on that path.
  Every matching rule runs here too.
- **"Every matching path sets its labels"** (the old `evaluateAllPaths: true`): use one
  Tag Assignment or Field Assignment step with one rule per label, each under its own
  condition. Because every matching rule runs, this is a natural fit.

Example `cannotCarryOver` entry:

- what: "The 'Not qualified' path removed the `hot-lead` tag."
- instead: "The new tree removes `hot-lead` with a tag step on that path, straight after
  the decision."

## 4. Notifications, email lists and outside connections

**Works differently: each one needs a connection set up again.**

Connections to other services (email senders, text-message accounts, email marketing
tools, other systems' logins and keys) belong to the account. They never come across in
an export. The step can be rebuilt, but it only works once the person connects the
service in their new LeadsHook account under **Integrations**.

| Old step | New step | What the person has to set up |
| --- | --- | --- |
| `emailNotification` (email to the team or the lead) | Email Notification (`email_notification`) | An **SMTP** email-sending connection. With none, the email is never sent. |
| `smsNotification` (text message about the lead) | SMS Notification (`sms_notification`) | A **Twilio** connection. |
| `smsVerification` (phone check by code) | Built into the Phone question (`phone`): turn on code verification by text message or WhatsApp. | A **Twilio** connection. |
| `esp` (add the lead to an email list) | An API step (`api`) or a Webhook step (`webhook`) that sends the lead to the email marketing tool. | A connection to that tool (Mailchimp is supported directly) or its API key. Ask which list and which details go to it. |
| `webhook`, `api` (send data to, or fetch data from, another system) | Webhook (`webhook`) or API (`api`) | The address, and any login or key the other system needs. Never copy a key out of the export into the brief. Ask the person to add it as a connection. |

Email and SMS notifications can still wait before sending, and can still use the lead's
details in the message with `{{field_name}}`.

Example `cannotCarryOver` entry:

- what: "An email to sales@yourco.com each time a lead came through."
- instead: "The new tree sends the same email. Before it can, connect your email-sending
  account under Integrations."

## 5. Other things that don't carry over cleanly

| Old feature | Kind | What to offer instead |
| --- | --- | --- |
| **Signature fields** (`signature`) | Does not carry over | There's no signature field. Ask what the signature was for. If it was agreement to terms or to being contacted, use the consent option on the email or phone question. If a full name was enough, use a text question. If they needed a signed document, use a file upload (`file_upload`). |
| **"Doesn't have all of these tags"** (`not_include` with several tags, meaning *not all*) | Works differently | No single operator says "not all of". Put a path using `has_all_of` first, and send everyone else past it. Never use `has_none_of` for this: it means "has none of them", which is a different rule. |
| **An operator you can't map** | Does not carry over | Describe the rule in plain words, ask what it was for, and rebuild the intent with the published operators. Never fall back to `equals`. |
| **Hidden fields** (`visible: false`) | Works differently | Only text and number fields can be hidden in the new LeadsHook. Ask what fills the field. If it must be hidden, make it a hidden text or number field. |
| **Date and time together** (`datetime`, question kind 13) | Works differently | Ask the date and the time as two separate questions (`date`, then `time`). |
| **US zip code** (`us_zipcode`, question kind 15) | Works differently | Use a short text question, or the address question if the full address is wanted. |
| **Images** | Works differently | The pictures in the export's `images/` folder need uploading again. |

## 6. Design

**The look carries over. Some parts of it don't.**

The new tree keeps the brand: its colours, fonts, and how the buttons, answers, fields,
card and page look. That goes in the brief's look part (`look`). The items below are
part of the old design but can't be held by the new tree. Each one goes in
`cannotCarryOver`, never in `look`.

| Old feature | Kind | What to offer instead |
| --- | --- | --- |
| **Header and footer HTML** (`belowHeaderContent`, `aboveFooterContent`, with `showHeader`, `showFooter` and their menus): a menu, trust strip, reviews, team or contact details | Does not carry over | The tree itself has no header or footer. **Offer to rebuild them as a landing page around the tree**, with the old header and footer wording, links and look. The page is built with the `build-landing-page` skill after the tree. The new LeadsHook shows a landing page's header and footer around the tree. If they say yes, it goes in the brief's `v3Upgrades` too. For a single short line (such as a trust line), putting it in a step's text is another option. |
| **Logo** | Does not carry over | Put it in the landing page's header, or as an image in the first step's content. It needs uploading again. |
| **Progress bar** (`progressBar`) | Does not carry over | The new tree doesn't show one. Keep the tree short, and say how many steps there are in the first step's text. |
| **Favicon** (`favIcon`) | Does not carry over | Set it on the landing page or the person's own site, not on the tree. |
| **Custom CSS loaded as a script** | Does not carry over | Where it mattered, it's rebuilt as the tree's look (colours, fonts, shapes). The raw CSS itself doesn't come over. A stock style framework needs nothing rebuilt. |
| **Fonts that aren't on the new font list** | Works differently | Use the nearest font from the list, and name it in the brief ("swapped from …"). |

Example `cannotCarryOver` entry, in the brief's format:

- **What:** A header with your logo, menu and phone number, and a footer with reviews
  and contact details — **Instead:** The new tree has no header or footer. I'll offer to
  rebuild them as a landing page around the tree, with the same wording, links and
  look, once the tree is built.

---

## Common questions

**Q: Do I list something that works differently, or only things that don't carry over?**

A: Both. The person needs to know about every item on this page before the tree is
built, even when the need is still met.

**Q: What if the person doesn't want the offered alternative?**

A: Offer the other options for that item. If none fit, write the need down in the brief
as not covered, so it isn't lost.

**Q: Can I copy a password or key out of the export?**

A: No. Ask the person to connect the service in their account instead.
