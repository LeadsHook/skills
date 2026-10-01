# Choosing a node type

Read this when a question, step or requirement does not obviously map to one node type,
when two types look equally right, or when `generate_node` comes back asking you to
clarify. It extends section 4 of the skill; where the two overlap, they say the same
thing.

This file is judgement only. It never tells you what a node accepts. For that, read
`leadshook://schemas/node` (the index of node types that exist today) and
`leadshook://schemas/node/{type}` (one type's settings). If a type named here is missing
from the index, the index wins.

---

## 1. The primary decision path

Ask these in order and stop at the first one that settles it.

1. **Does the visitor see this step at all?**
   - No — it routes, computes, labels, records or talks to another system. Go to step 4.
   - Yes — go on.
2. **Is the visitor only reading or viewing, not answering?**
   - Rich content, an offer, an explanation, an intro → `custom_page`.
   - A document they should read in place → `pdf`.
   - The closing screen → `thank_you_page`.
3. **Does the visitor answer?**
   - **They pick from options you supply:**
     - several answers allowed → `multiple_choice`;
     - the second list depends on the first → `related_dropdown`;
     - a single yes / no → `switch`;
     - one answer from a handful → `single_choice`;
     - one answer from a long list → `dropdown`;
     - too many options to list at all, so they type and the list narrows → `auto_complete`.
   - **They enter a value of their own** — decide by the *kind* of value: email → `email`,
     phone → `phone`, name → `name`, full postal address → `address`, a calendar date →
     `date`, a birth date → `date_of_birth`, a time of day → `time`, a file → `file_upload`,
     a number → `number`, `slider` or `dual_slider` (see the tie-breakers), anything else
     written → `text` or `text_area`.
   - **Several of the above on one screen together** → `form`.
4. **Behind the scenes, what does the step do?**
   - choose a route from data already held → `decision_node`;
   - work out a score or a total → `calculation_node`;
   - write a value onto the lead → `field_assignment`;
   - label the lead for segmentation → `tag_assignment`;
   - push the lead to another system and carry on → `webhook`;
   - ask another system something and use the answer → `api`;
   - tell the team by email → `email_notification`, or by text → `sms_notification`;
   - send the visitor's browser elsewhere → `redirect_node`;
   - record a funnel milestone → `conversion_tracker`.

**Not a node:** "initialise the fields", "set default values", "bootstrap the lead". Lead
fields are declared on the decision tree itself, in the Fields tab of the LeadsHook
editor. Never add a node at the start of a flow to do that.

---

## 2. Keyword signals

Phrases people use, and the node type they usually point to. A signal is a starting
point, not a verdict: the tie-breakers in section 3 override it, and the person's actual
answer type always beats the word they happened to use.

| What the person says | Likely node type |
| --- | --- |
| "choose one", "pick one", "which one", "radio buttons" | `single_choice` |
| "select all that apply", "tick any", "checkboxes", "pick several", "multi-select" | `multiple_choice` |
| "pick from a long list", "dropdown", "select menu", "choose your industry / country" | `dropdown` |
| "based on X then choose Y", "cascading", "dependent dropdown", "make then model", "state then city" | `related_dropdown` |
| "yes or no", "do you have", "are you currently", "toggle", "true / false" | `switch` |
| "type to search", "autocomplete", "suggest as they type", "search the list" | `auto_complete` |
| "email", "email address", "where should we send it" | `email` |
| "phone", "mobile", "cell", "telephone", "best number to call" | `phone` |
| "your name", "first name", "last name", "full name" | `name` |
| "address", "street address", "where do you live", "city, state and zip" | `address` |
| "zip code", "postcode", "postal code" — on its own | `text` |
| "short answer", "job title", "company name", "type your" | `text` |
| "comments", "describe", "tell us more", "explain", "notes", "message" | `text_area` |
| "how many", "quantity", "exact number", "enter your age", "headcount" | `number` |
| "rate 1 to 10", "on a scale", "roughly", "estimate", "slider", "budget" | `slider` |
| "between X and Y", "from ... to ...", "min and max", "price range", "age bracket" | `dual_slider` |
| "what date", "when would you like", "appointment date", "start date", "deadline" | `date` |
| "date of birth", "birthday", "DOB", "are you over 18" | `date_of_birth` |
| "what time", "time of day", "preferred time to call" | `time` |
| "upload", "attach", "send us a photo", "add your CV" | `file_upload` |
| "name, email and phone on one page", "a short form", "collect these together" | `form` |
| "show a page", "intro screen", "explain the offer", "embed a video" | `custom_page` |
| "show the PDF", "let them read the terms", "view the brochure" | `pdf` |
| "thank-you screen", "final screen", "confirmation page" | `thank_you_page` |
| "if X then", "route based on", "send qualified people one way", "otherwise" | `decision_node` |
| "calculate", "add up the score", "total", "formula", "estimate their payment" | `calculation_node` |
| "set the field", "mark the lead as", "record the source", "copy into" | `field_assignment` |
| "tag the lead", "label them as", "segment" | `tag_assignment` |
| "webhook", "push to our CRM", "send to Zapier", "trigger our automation" | `webhook` |
| "look up", "enrich", "verify against", "fetch from our system", "check their credit" | `api` |
| "email the team", "notify sales by email", "alert the admin" | `email_notification` |
| "text the team", "SMS the rep", "text alert" | `sms_notification` |
| "send them to", "redirect to", "go to our booking page" | `redirect_node` |
| "track the conversion", "mark as qualified", "funnel stage", "milestone" | `conversion_tracker` |

Some phrases point two ways. "Budget" is a `slider` when a rough figure is enough and a
`single_choice` of bands when you will branch on it. "Qualify" usually means a
`single_choice` that routes, followed by a `decision_node` only if the split depends on
more than one answer. "Do you agree to our terms" is consent on the node that collects
the data, not a `switch` (see section 5).

---

## 3. Tie-breakers and edge cases

### `single_choice` versus `dropdown`

- Option count decides it, not the word the person used.
- Roughly two to ten options, one answer → `single_choice`. All options are visible and
  one tap answers it, which converts better.
- Roughly eleven or more → `dropdown`. A long visible list is a wall.
- If the person explicitly asked for a dropdown with only a few options, give them the
  dropdown. It is their form.
- If the list is so long that scrolling it is unreasonable (every medication, every job
  title) and the visitor may know the answer before they see it, `auto_complete` beats
  `dropdown`.

### `single_choice` versus `multiple_choice`

- "Select all that apply" is **always** `multiple_choice`, however few options.
- If the person wants to branch on the answer, prefer `single_choice`: it routes each
  option directly. `multiple_choice` has one way out, so branching on it needs a
  `decision_node` after it. If they genuinely need both — several answers *and* routing
  — say so and use that pair.

### `number` versus `slider` versus `dual_slider`

- The visitor knows an exact value and precision matters (age, headcount, revenue to the
  dollar) → `number`.
- A rough figure is good enough, or it is a rating on a scale → `slider`. It is faster
  and feels lighter.
- They need to give both a low and a high end → `dual_slider`. Two `number` nodes for
  "minimum" and "maximum" are slower and allow the low end to exceed the high end.

### `text` versus `text_area`

- One line (company, job title, city, promo code) → `text`.
- Several sentences (comments, describe your problem) → `text_area`. A one-line box for
  a long answer makes people write less.

### `address` versus postcode only

- Street, city, region and postcode together → `address`.
- Only a postcode or ZIP → `text`. There is no dedicated postcode node. Do not use
  `number`: it drops leading zeros (`02134`) and rejects letters (UK and Canadian codes).
  If the format must be enforced, check `leadshook://schemas/node/text` for what
  validation it supports.

### `date` versus `date_of_birth`

- Any calendar date that is not a birthday (appointment, start date, deadline) → `date`.
- A birthday, especially for an age check or eligibility → `date_of_birth`. It is set up
  for distant past dates and minimum-age gates, which a general date picker is not.
- "How old are you?" with no need for the actual birthday is a `number` (or a
  `single_choice` of age bands if you will branch on it).

### `switch` versus `single_choice` with two options

- A genuine on/off fact with an obvious "no" (do you own your home) → `switch`.
- If both answers need their own wording, or each answer goes somewhere different, a
  `single_choice` with two options is clearer and routes directly.
- Consent and permission are not a `switch` — they are settings on `email` or `phone`.

### `form` versus separate nodes

- One question per screen almost always completes better, and is the default.
- Use `form` when the fields obviously belong together *and* the person asked for them
  together — most often name, email and phone on the final capture screen.
- A `form` has one way out. If any field on it needs to drive branching, that field
  belongs on its own node, or the branch goes in a `decision_node` after the form.

### `decision_node` versus `single_choice` routing

- The visitor is asked something and each answer goes its own way → `single_choice`.
- The split happens behind the scenes on data already held — an earlier answer, a score,
  an `api` result, a combination of several answers → `decision_node`.
- Do not put a `decision_node` straight after a `single_choice` just to re-read the
  answer the `single_choice` could have routed itself.

### `webhook` versus `api`

- Push the lead out and carry on without waiting → `webhook`.
- Wait for a reply and use it — write it onto the lead, or branch on it → `api`.
- If the next question depends on what comes back, it must be `api`.

### `custom_page` versus `thank_you_page`

- `thank_you_page` is the closing screen. Use it to end a route.
- `custom_page` is content anywhere in the flow — an intro, an offer, an explanation
  between questions.

### `redirect_node` versus `thank_you_page`

- If the visitor should leave LeadsHook (booking page, checkout, the client's own site),
  end on `redirect_node`.
- If they stay, end on `thank_you_page`. Do not do both on the same route unless the
  closing screen is meant to be seen briefly before the redirect.

### Notifications versus messages to the visitor

- `email_notification` and `sms_notification` tell **the team**. They are not for
  messaging the visitor.
- Verifying the visitor's email or phone is a setting on `email` or `phone`, not a
  notification node.

---

## 4. What the visitor sees and what they do not

Visible to the visitor — each one is a screen or part of one:

- choice nodes: `single_choice`, `multiple_choice`, `dropdown`, `related_dropdown`,
  `switch`, `auto_complete`;
- entry nodes: `email`, `phone`, `name`, `address`, `text`, `text_area`, `number`,
  `slider`, `dual_slider`, `date`, `date_of_birth`, `time`, `file_upload`, `form`;
- display nodes: `custom_page`, `pdf`, `thank_you_page`.

Behind the scenes — the visitor never sees them, and they run the moment the visitor
reaches them:

- logic: `decision_node`, `calculation_node`, `field_assignment`, `tag_assignment`,
  `conversion_tracker`;
- integration: `webhook`, `api`, `email_notification`, `sms_notification`,
  `redirect_node` (the visitor sees where they land, not the node).

Why it matters:

- A flow that is all behind-the-scenes nodes with no screen at the end leaves the visitor
  on the last screen they saw. Every route ends on a screen or a redirect.
- Behind-the-scenes nodes can only use data that already exists when they run. Put them
  after every answer they read.
- When you describe the flow to the person, separate the screens from the plumbing: they
  judge the screens; they need to trust the plumbing.

---

## 5. Things that ride on a node, not extra nodes

These are settings on a node that already exists. Adding a node for any of them produces
a dead screen or a duplicate step. Read the type's schema for how to configure each.

- **Email verification and double opt-in** → the `email` node.
- **Phone verification** by text or messaging app → the `phone` node.
- **Consent checkboxes** (marketing permission, privacy, terms) → the node that collects
  the data they relate to, usually `email` or `phone`.
- **Reassurance and helper copy** ("we never share your email") → content placed above or
  below the input on that node, not a `custom_page` before it.
- **Scores for qualification** → a score on each option of a choice node. A
  `calculation_node` then adds them up; you do not need a node per score.
- **"Other — please specify"** → an option on the choice node that lets the visitor type
  their own answer, where the schema offers it. Not a follow-up `text` node.
- **Ad-platform conversion events and tag-manager events** → per-node tracking settings.
  Attach them to the node where the conversion actually happens (usually the
  contact-details node), not to the first screen — an event that fires before the
  visitor has given anything reports leads you do not have. A `conversion_tracker` records the milestone on the lead itself; the two are
  complementary, not alternatives.
- **Button wording** → per node. "Get my quote" outperforms "Next" on the last step.

What is shared by every node — heading, content around the input, buttons, tracking — is
described at `leadshook://schemas/node/_base`.
