---
name: build-decision-tree
description: Build a LeadsHook quiz, survey, lead capture form or qualification funnel, or add a question or step to one you already have. Use this when someone wants to ask visitors a series of questions, choose the right question type for an answer, branch the flow based on what someone answers, score or qualify the people who answer, verify an email or phone number, or collect consent before a lead is captured. Also use it when someone wants a tree built from their idea, brief, plan or description ("I want a quiz that qualifies roofing leads", "build the tree from my plan"), or when a confirmed Vision Brief is handed over to be built. Moving a tree from the old LeadsHook (LeadsHook 2) or a v2 export starts in the migrate-from-v2 skill, not here.
metadata:
  version: "0.3.0"
---

# Build a decision tree

A LeadsHook decision tree is a sequence of screens a visitor moves through. Each screen
is a **node**. This skill is about **judgement**: which node type fits a question, what
order the nodes go in, and where the flow should split.

It is deliberately not about field names and JSON shapes. Those live in the MCP
resources and are always current; anything written down here would go stale between
plugin releases. Read the schema, then decide with the guidance below.

### Reference files

This file is the entry point. Read a reference only when you reach the moment it covers:

- `references/node-selection.md` — when the right node type is not obvious, two types
  both fit, or `generate_node` asks you to clarify. Decision path, keyword signals,
  tie-breakers, what the visitor sees.
- `references/node-patterns.md` — once the type is chosen, before you compose the node.
  When each type is right or wrong, the settings decisions that matter, common mistakes.
- `references/previews.md` — whenever you create, change or restyle a node, or the person
  asks to see one. How to build and show a preview.

---

## 1. Get oriented before you build

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
4. `list_projects` — with the `accountId`. A decision tree always lives inside a project.
   If the person has more than one, show the list and let them choose rather than
   guessing.

If you are changing something that already exists rather than starting fresh:

- `list_decision_trees` — resolve a tree the person named in words into an id.
- `export_decision_tree` — read a tree's current nodes and connections before you touch
  it. Never edit a flow you have not read. (`get_decision_tree` returns the tree's
  settings and styles, but not its nodes.)

**If a call is refused for a missing or wrong account, that is not an error to work
around.** Add the right `accountId` to that call and retry it. `select_account` only
confirms you can reach an account; calling it does not set one for later calls.

---

## 2. Pick the way you are going to build

There are four routes. Choosing the wrong one creates rework, so choose deliberately.

If the person brings an **idea, a plan or a Vision Brief** rather than a finished list of
questions, use route D, [Build from an idea or a brief](#9-build-from-an-idea-or-a-brief).

### A. You have a list of questions and want a whole tree

Use `create_dt_from_questions`. Give it the questions and the project. It builds the
whole tree — node types, wording and connections — in one pass.

Best for: "here are the ten questions I want to ask."

Two things to do before you call it:

- Confirm the question list and the title with the person. Do not invent questions they
  did not ask for.
- **Tell them it can take up to about two minutes** and that they should wait. A silent
  two-minute pause looks like a hang.

### B. You want precise control over every node and connection

Compose the tree yourself and hand the whole thing to `import_decision_tree`: the tree
plus its nodes, with each node's connections already declared.

This is the only route where **you** decide the exact branching, so it is the right one
for a qualification funnel with real routing logic.

Know what it does: it **creates a new decision tree**. It never merges into or
overwrites an existing one. If the `slug` it would use is already taken in the account,
the new tree gets a unique variant of it instead. To revise an existing tree,
`export_decision_tree` gives you the same shape back — export, change it, re-import as a
new tree.

It also refuses, before touching anything, if two nodes share an id or if a connection
points at a node id that is not in the set you sent. Read that message literally; it
names the offending id.

### C. You want to add one node to a tree that already exists

Two tools, in order:

1. `generate_node` — give it a plain description, or an explicit `nodeType`. It returns
   the base schema, the schema for that node type, and a list of critical constraints.
   It writes nothing. The constraints it returns are binding — apply every one of them
   before you move on.
2. `add_node` — hand it the node you composed and the tree id. It saves it and returns
   the node with its server-assigned id.

**Read this part carefully: `add_node` creates the node FLOATING and UNCONNECTED.**
The node exists in the tree, but nothing leads into it and nothing leads out of it, so
no visitor will ever see it. Wiring is a separate act. Say this out loud to the person —
"the node is created but not yet connected" — and then either connect it with
`connect_nodes` or by dragging the connection in the LeadsHook canvas editor, or, if the
flow needs several nodes wired
together, prefer route B and declare the connections up front instead of calling
`add_node` repeatedly.

### D. You have an idea, a plan or a Vision Brief

Agree a Vision Brief first, then build the whole tree from it in one go. This route takes
either a confirmed brief handed over by the `migrate-from-v2` skill, or a plain
description of what the person wants. See
[Build from an idea or a brief](#9-build-from-an-idea-or-a-brief).

Best for: "I want a quiz that qualifies roofing leads", or a brief agreed while moving a
tree from the old LeadsHook.

---

## 3. When `generate_node` asks you to clarify

`generate_node` can come back with `status: 'clarify'` and a list of candidate node
types. That happens when the description is ambiguous, or when two types match it
equally well.

**Do not silently pick one.** The whole point of the response is that the tool could not
tell, and a wrong node type is a wrong question for every visitor who reaches it.

Do this instead:

1. Look at the candidates against the guidance in section 4 and the tie-breakers in
   `references/node-selection.md`.
2. If the description genuinely decides it, call `generate_node` again with an explicit
   `nodeType`.
3. If it does not — if the answer depends on something only the person knows, such as
   whether they want one answer or several — **ask them**, then re-call with the
   `nodeType` they chose.

Passing an explicit `nodeType` always overrides the guessing. Use it whenever you are
sure, and it will never come back asking to clarify.

---

## 4. Choosing the node type

Start with one question: **does the visitor pick from options you supply, or do they
enter a value of their own?**

### They pick from options you supply

| Situation | Node type |
| --- | --- |
| One answer, a handful of options (roughly two to ten) | `single_choice` |
| One answer, a long list (roughly eleven or more) | `dropdown` |
| Several answers — "select all that apply" | `multiple_choice` |
| The options depend on a previous answer (country then state) | `related_dropdown` |
| A plain yes / no | `switch` |
| Too many options to list, so they type and the list narrows | `auto_complete` |

Rules of thumb that settle most arguments:

- "Select all that apply" is **always** `multiple_choice`, however few options there are.
- Option count decides `single_choice` versus `dropdown`, not the word the person used.
  Radio buttons that are all visible convert better at small counts; a long visible list
  is a wall. If they explicitly asked for a dropdown and there are few options, give them
  the dropdown — it is their form.
- `single_choice` can route each option to a different next node. If branching is the
  whole point of the question, this is the node.

### They enter a value of their own

| What they enter | Node type |
| --- | --- |
| Email address | `email` |
| Phone number | `phone` |
| Their name | `name` |
| A full postal address | `address` |
| A postcode or ZIP on its own | `text` |
| A short one-line answer (job title, company) | `text` |
| A longer free-form answer (comments, describe your problem) | `text_area` |
| An exact number they know (age, quantity, headcount) | `number` |
| An approximate number on a scale (rate this 1-10, budget estimate) | `slider` |
| A range with a low end and a high end | `dual_slider` |
| A calendar date (appointment, deadline) | `date` |
| A birth date, especially for an age check | `date_of_birth` |
| A time of day | `time` |
| A file or document | `file_upload` |
| Several fields on one screen at once | `form` |

Rules of thumb:

- **Exact versus approximate** decides `number` versus `slider`. If being off by a bit
  does not matter, a slider is faster to answer and feels lighter.
- **One line versus several sentences** decides `text` versus `text_area`.
- A postcode on its own is `text`, not `number` — a number drops the leading zero on
  codes like `02134`.
- `form` puts several fields on one screen. Separate nodes give one question per screen.
  One question per screen almost always completes better; use `form` when the fields
  obviously belong together and the person asked for them together.

### Screens with no input, and steps the visitor never sees

| Purpose | Node type |
| --- | --- |
| Show something — rich content, an offer, an explanation | `custom_page` |
| Show a PDF | `pdf` |
| The closing screen at the end of the flow | `thank_you_page` |
| Branch on data you already hold, with no question asked | `decision_node` |
| Score earlier answers and route on the total | Answer scores on `single_choice` / `multiple_choice` (they add up in `lh_score`), then a `decision_node` |
| Write a value onto the lead | `field_assignment` |
| Label the lead for later segmentation | `tag_assignment` |
| Send the lead out to another system and move on | `webhook` |
| Call another system and bring data back into the flow | `api` |
| Email the team that a lead came in | `email_notification` |
| Text the team that a lead came in | `sms_notification` |
| Send the visitor to another web address | `redirect_node` |
| Mark that the visitor reached a milestone | `conversion_tracker` |

Rules of thumb:

- `decision_node` versus `single_choice`: if the visitor is asked something, it is
  `single_choice`. If the split happens behind the scenes on an answer already given, it
  is `decision_node`. Both can have many outgoing routes.
- `webhook` versus `api`: `webhook` pushes data out and does not wait for anything back.
  `api` waits and maps the response onto the lead. If the next question depends on what
  comes back, you need `api`.
- Do **not** add a node to "set up" or "initialise" fields at the start of a flow. Lead
  fields are declared on the decision tree itself, in the Fields tab of the LeadsHook
  editor. A node for that is the wrong shape and will confuse whoever maintains the tree.

**The list above is guidance, not the catalogue.** The authoritative index of node types
is the resource `leadshook://schemas/node`. Read it if you need to confirm a type exists,
and never state how many types there are — the index is generated fresh on every request.

---

## 5. Features that ride on a node, not extra nodes

Some things people ask for are settings on an existing node, not separate steps. Getting
this wrong produces a flow with dead screens in it.

- **Double opt-in** — sending a verification code or link and making the visitor confirm
  before they count as a lead — is a setting on the `email` node. It is not a second node.
- **Phone verification** is a setting on the `phone` node.
- **Consent checkboxes** — marketing permission, privacy policy, terms — sit on the node
  that collects the data they relate to, typically `email` or `phone`. They are not a
  separate screen and not a `switch`. **You can't set consent up from here:** each
  checkbox must point to consent wording already published in the person's LeadsHook
  account, and none of the tools can read or create that wording. Build the tree
  without it, and tell the person to add consent to the email or phone step in the
  LeadsHook editor (list it in the closing summary).

For double opt-in and phone verification, read the type's schema at
`leadshook://schemas/node/{type}` — substitute
the type, for example `leadshook://schemas/node/email` — and configure from what it
says. Fields common to every node are at `leadshook://schemas/node/_base`. These
resources are the only correct source for what a node accepts.

---

## 6. Sequencing the flow

Order changes completion rate more than any individual node does.

1. **Open with something easy and relevant.** The first screen decides whether anyone
   reaches the second. A one-tap `single_choice` about the visitor's own situation is a
   far better opener than a text box.
2. **Ask qualifying questions next.** Anything that decides whether this person is worth
   capturing belongs early, while attention is high and before you have asked for
   anything personal.
3. **Ask for contact details late.** Email, phone and name go near the end, after the
   visitor has invested effort and can see what they are getting. Front-loading them is
   the single most common reason a tree does not convert.
4. **Put the behind-the-scenes nodes where their inputs exist.** A `decision_node`,
   `tag_assignment` or `field_assignment` must come after every answer it reads. A `webhook` or `api` firing before the email
   node sends a lead with no contact details on it.
5. **End on a `thank_you_page`**, or on a `redirect_node` if they are being sent
   somewhere else. Never leave a route with nothing after it unless ending there is
   deliberate.

---

## 7. Branching

Branching is what makes a decision tree worth more than a form. Two ways to split:

- **On something the visitor just answered** — `single_choice` (or `decision_node`
  reading that answer) sends each option down its own route.
- **On something already known** — a score, a value from an `api` call, an earlier
  answer — use a `decision_node`.

Keep branching honest:

- Every route must end somewhere. A branch that leads nowhere is a visitor stuck on a
  screen with no way forward.
- Give every condition a fallback. "None of the above" and "did not match" are real
  cases and will happen on day one.
- Branches that rejoin are fine and usually better than duplicating the same closing
  screens down each path.
- Resist branching for its own sake. Two or three meaningful routes beat eight that ask
  almost the same thing — each extra route is another path that has to be tested.

---

## 8. Show the person what you built

After you compose or change a visible node, offer a preview of it — and when the person
asks to see one, always show it. Follow `references/previews.md`: it is built from the
rendering reference, it is a likeness rather than the live page, and you say so.

---

## 9. Before you say you are done

- The tree opens with a low-effort question and asks for contact details late.
- Every route reaches an end; no branch stops in mid-air.
- Every node you added with `add_node` has been **connected**, or the person has been
  told plainly that it is still floating.
- Every condition has a fallback.
- Verification was configured on its node, not bolted on as an extra screen. Any consent
  the brief asks for is in the closing summary for the person to add in the editor.
- Every node's settings came from its schema resource, not from memory.
- The person was offered a preview of the screens you created or changed.
- You read the tree back with `get_decision_tree` or `export_decision_tree` and it is
  what you described.

---

## 10. Build from an idea or a brief

This route builds a whole tree from a **Vision Brief**: a plain-words description of what
the tree is for. The brief reaches you in one of two ways:

- **A confirmed brief from `migrate-from-v2`.** The person moved a tree from the old
  LeadsHook, and that skill has already agreed the brief with them. It arrives with the
  account and the project they chose. Start at [Confirm the brief](#confirm-the-brief).
- **A plain description.** The person tells you their idea, for example "I want a quiz
  that qualifies roofing leads and sends the good ones to my sales team." You write the
  brief yourself, check it with them, then build.

Either way, the steps are the same: agree the brief, then build from it.

### The Vision Brief

This is the same brief the `migrate-from-v2` skill produces, so a brief from either
source reads the same way.

```markdown
# Vision Brief: <name of the tree>

## 1. Goal (`goal`)
What this funnel is for, in the person's own words. One or two sentences.

## 2. Who it's for (`audience`)
Who answers it: the kind of visitor, and what they want when they arrive.

## 3. What we ask, and why (`questions`)
One line per question, in the order visitors see them:
- **Ask:** <the question, in plain words> — **Why:** <what the answer is used for>

## 4. Good, bad and disqualified leads (`qualification`)
- **Good lead:** <what makes someone a good fit>
- **Not a fit:** <what makes someone a weaker lead>
- **Disqualified:** <what stops someone going further, if anything>

## 5. Where each lead ends up (`outcomes`)
One line per kind of visitor:
- **When:** <who, or what they answered> — **Then:** <what they see and are offered>

## 6. Contact details and consent (`capture`)
- The contact details you collect, and which are required.
- Any consent the visitor gives, and its wording if you know it.
- Any email or phone check before the lead counts.

## 7. After a lead comes in (`afterCapture`)
- Labels (tags) and saved details (fields) set on the lead.
- Where the lead is sent: other tools, email lists, your CRM.
- Who gets told, and how.

## 8. Upgrades in the new LeadsHook (`v3Upgrades`)
One line per upgrade you offered:
- **Feature:** <what it is> — **Benefit:** <what it does for this funnel> — **Accepted:** yes / no

## 9. What can't come over as it was (`cannotCarryOver`)
One line per item:
- **What:** <the old feature, and what it was for> — **Instead:** <how the new tree meets the same need>

## 10. How it looks (`look`)
The look to rebuild, in plain words, with exact values where you have them.
Write "None — use a clean default" if there's nothing to go on.
- **Brand colour:** <hex> — <where it shows: main buttons, selected answers, headings>
- **Second colour:** <hex, or None> — <where it shows, e.g. back button>
- **Text:** <font for headings>, <font for body text>, <main text colour hex>
- **Buttons:** <shape: square / rounded / pill>, <filled or outlined>, <full width or not>
- **Answers:** <cards / list / pills>, <shape>, <border and colour>, <hover or selected colour>
- **Page:** <background colour or style>, <card on the page or full width>, <shadow: none / soft / strong>
- **Feel:** <one line, e.g. "bold and warm, trust-first insurance brand">

## 11. Open questions (`openQuestions`)
Only what you couldn't work out from the export. You'll ask these one at a time.
- <question>
```

Keep every heading, even when a part is empty: write "None" rather than leaving it out.
Write it for the person, not for a machine, and use their words where you can.

### Fill in a draft from a description

When you start from a description, there is no export to read. Work from what the person
told you, and fill each part like this:

1. **Goal.** Say what the funnel achieves for them, in their words: "qualify roofing
   leads for my sales team".
2. **Who it's for.** Who the visitor is and what they want. Infer it from the business
   and the offer.
3. **What we ask, and why.** Only the questions the goal needs. Every question has a
   "why": it chooses a path, qualifies the lead, or is passed on to their team. If you
   can't give a question a "why", leave it out.
4. **Good, bad and disqualified leads.** Turn what they said about good and bad customers
   into plain rules, such as "people outside our service area can't go further".
5. **Where each lead ends up.** One line per kind of visitor, and every kind has an end.
6. **Contact details and consent.** The details their team needs to follow up, and
   nothing more.
7. **After a lead comes in.** Labels, where the lead goes, and who gets told. If they
   haven't said, suggest a simple default, such as "email the team for every good lead".
8. **Upgrades.** A new tree has nothing to upgrade from. Write "None".
9. **What can't come over.** Nothing is being moved. Write "None".
10. **How it looks.** Fill it from the brand they gave you: colours, fonts and style. If
    they gave none, offer one default in a single question. Use the same default as
    [Style the tree](#style-the-tree): a clean, light style in blue (#2563eb). Use only
    fonts from the font list in [Style the tree](#style-the-tree), step 5. If theirs
    isn't there, name the nearest one. A header, footer or logo can't be part of the tree's look. Tell them
    it isn't possible on the tree (a landing page around the tree can carry a header
    and footer), and never put it in `look`.
11. **Open questions.** Only what you really can't work out from the description.

Where the description is silent and the choice is low-risk, **pick a sensible default and
write it into the brief** so the person can see it and change it. Don't turn every gap
into a question.

### Ask only what you need

Use the same rules as `migrate-from-v2`, with the person's description in place of the
export:

- **Ask only what the description can't tell you.** Never ask them to repeat what they've
  already said.
- **Ask one question per turn.** Wait for the answer before you ask the next.
- **Keep it easy and direct.** Each question should be answerable in a few words, or
  with a yes or no.
- **Always suggest a default.** Say what you'll do if they have no view, so they can
  just say "OK". For example: "I'll send people outside your area to a polite 'not a fit'
  page. OK?"
- **Keep it to a few questions.** Two or three is usually enough. Fill the rest with
  defaults stated in the brief.
- **Keep what's unanswered in part 11** (`openQuestions`) until you've asked it. Remove
  each one once it's answered, and put the answer in the brief.

### Confirm the brief

**Nothing is built until the person clearly says yes to the full brief.** No
`import_decision_tree`, `create_dt_from_questions`, `add_node` or any other call that
creates or changes a tree before that yes.

1. **Show the complete brief.** All 11 parts, with every heading. Part 11
   (`openQuestions`) should say "None". If it doesn't, ask what's left first.
2. **Say which project the tree goes into.** Use the project list from section 1. If
   there's only one, name it. If there are several and they haven't chosen, ask.
3. **Ask one direct question.** For example: "Shall I build this as a draft in the
   Marketing project?" Make it plain the tree starts as a **draft**, so nothing goes live
   until they publish it.
4. **Only a clear yes counts.** "Yes", "go ahead" or "build it" is a yes. "Looks good so
   far", "mostly right", silence or a change of subject is not. Ask again in one short
   line.
5. **Any change sends it back.** If they change anything, update the brief, show the
   whole brief again, and ask for a fresh yes.

A brief that arrives **already confirmed** from `migrate-from-v2` doesn't need confirming
again. Build from it as it is. If the person asks for a change to it here, the rules
above apply: update it, show it whole, and get a new yes before you build.

### v3 feature playbook

Build "using every feature that fits" means every feature that serves a line already in
the brief. Don't add one the brief doesn't ask for. This table says which feature serves
which brief item, and what to watch out for. It doesn't say how to set a node up: before
you build each node, read `leadshook://schemas/node/{type}`, and read
`leadshook://schemas/node/_base` for conditions and the system fields.

| Brief item | Feature | Node type | When to use it / pitfall |
| --- | --- | --- | --- |
| `questions`, `outcomes`: a route that depends on an answer already given | Decision step | `decision_node` | Branch behind the scenes on answers, `lh_score`, tags or looked-up data. Conditional paths are checked in order and the **first match wins**. The default path is used only when every conditional path fails. |
| `qualification`, `outcomes`: route by score | Answer scores | `single_choice`, `multiple_choice` | Give answers a score. The picked answers add up in `lh_score`. Then branch on `lh_score` with a `decision_node`, one path per range. |
| `afterCapture`: labels on the lead | Tag rules | `tag_assignment` | **Every** rule whose conditions match runs, not just the first. All adds happen, then all removes, so if a tag is both added and removed, the remove wins. |
| `afterCapture`: saved details on the lead | Field rules | `field_assignment` | Rules run in order. If two matching rules set the same field, the later one wins. A rule that copies from another field sees only the values from before this step ran, never one set by an earlier rule in the same step. |
| `capture`: an email that must be real | Double opt-in | `email` | A setting on the email question, not an extra step. The visitor confirms with a code or link before going on. |
| `capture`: a phone number your team will call | Phone check by code | `phone` | A setting on the phone question. The code goes by text or WhatsApp. It needs a Twilio connection under **Integrations**. |
| `capture`: permission to contact | Consent capture | `email`, `phone`, `form` | **The person adds it in the LeadsHook editor, not you.** Each checkbox must point to consent wording published in their account, which no tool can read or create. Build without it and list it in the closing summary: which step it goes on (the email or phone question; on a `form`, its email field), and the wording from the brief. |
| `afterCapture`, `v3Upgrades`: ad campaigns or a key moment to measure | Conversion tracking | `conversion_tracker` | Place it where the milestone really happens, usually after the contact details. Each rule fires on its own when its conditions match. Its event must match a conversion set up for the account's ad platform. |
| `outcomes`: different people go to different sites | Conditional redirect | `redirect_node` | Entries with conditions are checked in order, first match wins. The entry with no conditions is the fallback, so always include one. It ends the flow. |
| `afterCapture`: send the lead to a CRM or other tool | Outbound send | `webhook` | Sends the lead out and moves on without waiting. Place it after all the details it sends are collected. |
| `afterCapture`, `questions`: look something up and use the answer | Two-way call | `api` | Waits for the reply and saves it onto the lead. Use it only when a later step needs what comes back. |
| `afterCapture`: tell the team, or confirm to the lead | Email or text notice | `email_notification`, `sms_notification` | An email needs an SMTP email-sending connection under **Integrations**. With none, it's never sent. A text needs a Twilio connection. |
| `outcomes`: what each kind of visitor sees at the end | End page | `thank_you_page` | One per outcome that needs its own message. Reaching it marks the lead as complete. Show details with `{{field_name}}`, or the score with `{{lh_score}}`. |
| `outcomes`: a results screen with more to do after it | Content page | `custom_page` | Use it when the visitor carries on after the result. It needs its own button to move on. |

**Conditions.** Use only the operators listed in `conditionOperators` in
`leadshook://schemas/node/_base`. A misspelt or made-up operator isn't rejected. It
quietly turns into `equals` and almost never matches. Match the operator to the field:

- **Lists** (tags in `lh_tags`, and `multiple_choice` answers) take the set operators
  `has_any_of`, `has_all_of`, `has_none_of` and `is_exactly`, with an **array** value
  that isn't empty. A set operator on a single value, or a single-value operator on a
  list, never matches.
- **Single values** (a `single_choice` answer, a number, `lh_score`, a date) take the
  other operators, such as `equals`, `greater_than_or_equals` or `before`.

**Order the paths deliberately.** Because the first matching path wins, put the most
specific path first. For score ranges, check from the highest score down.

**Calculation step.** For plain scoring, answer scores stay the default: they add up in
`lh_score` on their own, and a `decision_node` branches on the ranges. Build a
`calculation_node` when the tree needs a real formula: a total, a price, a monthly
payment, BMI, a percentage, or a yes/no decided by numbers.

1. **Add the `calculation_node` after the steps that collect its inputs.** Set
   `settings.formula`, and set `settings.resultField` to a new, clear snake_case field
   name, such as `bmi` or `monthly_payment`. The field is created for you. Declaring it
   in the Fields tab is optional. It only helps for a nicer label or type, or a starting
   value, such as a running total (`{{total}} + {{x}}`) that should start at 0.
2. **Use the result like any field.** Show it with `{{result_field}}` in text, or branch
   on it with a `decision_node` condition.

Formula syntax:

- Refer to fields with `{{field_name}}`. No `Math.` prefix on functions.
- Operators: `+ - * / %`, and `^` for power (not `**`). Comparisons work too.
- Functions: `round(x, n)` (n is the decimals), `floor`, `ceil`, `abs`, `sqrt`, `min`,
  `max`, `mean`.
- Conditions: `{{age}} >= 65 ? 1 : 0`.
- Text: `concat("Total: ", string({{total}}))`. `concat` only joins text, so wrap number
  fields in `string()`. Without it the step saves nothing.
- Only these functions work: `round`, `floor`, `ceil`, `fix`, `abs`, `sign`, `sqrt`,
  `cbrt`, `pow`, `exp`, `log`, `log10`, `log2`, `mod`, `min`, `max`, `mean`, `median`,
  `sum`, `prod`, `std`, `variance`, `mad`, `concat`, `string`, `number`,
  `random`, `randomInt`, plus the constants `pi` and `e`. `random` and `randomInt` take
  numeric constant expressions only, e.g. `randomInt(1, 10)`, `random(1, 2 * 3)` or
  `random(pi)`; no fields, no other functions, no arrays inside them.
- Lists: a list like `[1, 2, 3]`, or a field holding several values (for example a
  multi-select answer), works only directly inside `min`, `max`, `mean`, `median`, `sum`,
  `prod`, `std`, `variance` or `mad`, e.g. `mean({{answers}})` or `max({{a}}, 3)`. Not in
  arithmetic, not nested, not in other functions. A list field may hold at most 1,000
  values, and all list fields in one formula together at most 1,000; beyond that the
  step saves nothing. In a list field every value must be a number; if any isn't, the whole list counts as 0, so use
  numeric option values (for example 1-5).
- Text values and text results are limited to 2,000 characters. `number()` converts
  text with plain numeric parsing; a non-number makes the step save nothing.
- Not allowed: `!` (factorial), `to`, ranges like `a:b`, units like `2 cm`, assignments,
  and several statements like `a; b`. Any other function makes the step save nothing.
- An empty or missing field counts as 0.

Example, BMI saved to `bmi`: `round({{weight_kg}} / ({{height_m}} * {{height_m}}), 1)`.

Rules:

- One formula per Calculation step. For more, chain steps. A later step can use an
  earlier step's result.
- The result field must not start with `lh_`. System fields are refused.
- A bad formula doesn't stop the visitor. It just saves nothing. Keep formulas simple and
  only refer to fields that are collected earlier in the tree.

**Connections and keys.** `webhook`, `api`, `email_notification`, `sms_notification`
and phone checks only work once the person has connected the service under
**Integrations** in their account. Never copy a password, key or token into the tree
from anywhere, including a v2 export or the chat. Ask the person to add it as a
connection, and say which steps won't work until they do. If a `webhook` or `api` step
needs a web address you don't have yet, leave the step out rather than adding one with
an empty or made-up address (the editor can't save it). List it in the closing summary
as a step for them to add once the service is connected.

### Compose the tree and check it

Build the whole tree as **one** `import_decision_tree` call (route B), made from the
confirmed brief and the playbook choices above. Don't build it node by node with
`add_node`: that leaves every node floating and unconnected.

#### Compose the call

1. **Map the brief to nodes.** Walk the brief in order. Each line in `questions` becomes
   a question node (section 4 picks the type). Each route in `qualification` and
   `outcomes` becomes a `decision_node`, a choice that routes per option, or a
   `redirect_node`. Each item in `capture` and `afterCapture` becomes a setting or a
   step, as the playbook table says. Every kind of visitor in `outcomes` gets its end.
2. **Read the schema before you write each node.** For every node type you use, read
   `leadshook://schemas/node/{type}` first, and `leadshook://schemas/node/_base` once for
   the fields every node shares, the condition operators and the system fields. Build
   each node from its schema and copy the placement from the schema's worked example.
   Never write a node from memory or guess a field.
3. **Give every node an id of your own.** Any id works, as long as no two nodes share
   one. Point every connection at those ids. The server gives each node a new id when it
   saves the tree and rewires the connections to match.
4. **Fill the call's top-level parameters:**
   - `accountId` — the account from section 1. Always pass it.
   - `projectId` — the project the person agreed to in the brief.
   - `dt` — the tree itself. It needs a `title`: use the name from the brief.
   - `nodes` — every node in the tree, with its connections already set. At least one.
   - `slug` — optional. The web address for the tree: 1 to 50 lowercase letters,
     numbers and hyphens, with no hyphen at the start or end. Leave it out and one is made
     from the title. If it's taken, a unique version is used instead.
   - `title` — optional. Only to name the new tree differently from `dt`'s title.
   - Leave `exportMeta` out. It's filled in for you.
5. **Expect a draft.** The import creates a brand-new tree that isn't published. Nothing
   is live until the person publishes it.

#### Self-check before you call

Run all five checks on the tree you composed **before** you call
`import_decision_tree`. This is a gate, not a tidy-up afterwards.

1. **Only known operators.** Every condition uses an operator listed in
   `conditionOperators` in `leadshook://schemas/node/_base`. An operator that isn't on
   that list isn't rejected: it quietly becomes `equals` and almost never matches. Tags
   (`lh_tags`) and `multiple_choice` answers use the set operators (`has_any_of`,
   `has_all_of`, `has_none_of`, `is_exactly`) with an array value that isn't empty.
2. **Settings where the schema puts them.** Each node's working setup sits exactly where
   its schema says. For example, the rules on a `field_assignment` or `tag_assignment`,
   the setup of a `redirect_node`, `webhook` or `api`, and the page text of a
   `thank_you_page` or `custom_page`, all go under `settings`. Copy the placement from
   the schema's worked example. Setup in the wrong place is ignored or dropped when the
   tree is saved, and the step does nothing. Each question's input field has a `name`
   (never `fieldName`), and email, phone and address fields use the system names the
   schema lists, such as `lh_email` and `lh_phone`.
3. **Default output last.** On every decision step, the paths with conditions come
   first, in the order you want them tried, and the path with no conditions is the
   fallback that's only used when all of them fail. Most specific first; for score
   ranges, highest first. Use the fallback the schema defines, and have exactly one.
4. **Every destination present.** Every output and connection points at a node id that
   is in this tree. No id points at a node you left out or renamed.
5. **No dead ends.** Start at the first node and follow every path. Each one reaches a
   `thank_you_page` or a `redirect_node`. No answer and no output is left unwired, except
   on those end nodes.

If any check fails, fix the tree and run **all five** again. Only call
`import_decision_tree` once every check passes. Never import a tree that fails a check
and plan to fix it afterwards: build it right, then import it once.

After the import, read the new tree back with `export_decision_tree` and confirm it
matches the brief: every step is there, each step's setup is where you put it, and every
connection points where you meant it to.

### Design and page

Style the tree only after the import has succeeded and you've read it back. The flow
comes first; the look is a separate step.

#### Style the tree

This step turns the brief's look part (`look`) into **one** `save_dt_design` call. The
tree already has a full design: a new or imported tree gets a default one, with a
`theme` and a `tailwind` map that styles every part of the screen. You change that
design. You never write one from scratch.

1. **Load the design reference.** Call `get_dt_design_context` with the `accountId` and
   the new tree's id as `dtId`. It shows how every screen is built and lists the `.lh-*`
   parts you can style, plus the tree's own steps. Only style parts it lists.
2. **Take the look from the brief.** Use the `look` part as it is. It's always filled,
   because drafting the brief already asked about the look when the person gave no
   brand. The design reference suggests asking for a brand colour and style: don't. The
   brief has answered that, and the person is never asked twice.
   - If `look` says "None — use a clean default", use the default without asking: a
     clean, light style with the brand colour blue (#2563eb).
   - Only when there's no brief at all, such as a request to restyle a tree or to add
     one step, ask one question with a default: "I'll use a clean, light style in blue
     (#2563eb). OK, or do you have a brand colour?"
3. **Read the current styles.** Call `get_decision_tree`. Its `styles` holds the
   `theme`, the `tailwind` map and the compiled `css`. `save_dt_design` with
   `target: "dt"` **replaces the whole styles object**, so:
   - Start from the tree's own `tailwind` map and change only the selectors the look
     touches. Never send a map with just a few selectors: every part you leave out
     loses its styling.
   - Keep everything else in `theme` (such as `brand-secondary`, `success`, `error`,
     and any `typography` you aren't changing), and any other keys in `styles`.
   - You can leave `css` out. It's rebuilt from `tailwind` on every save, and anything
     you send in its place is replaced.
4. **Build the brand palette.** `theme.brand` holds eleven shades, keyed `50`, `100`,
   `200`, `300`, `400`, `500`, `600`, `700`, `800`, `900` and `950`, all hex. Put the brand
   colour at `500`: the default design uses `brand-500` for the main button, so that's
   where the brand shows. Mix it with white for the lighter shades and with black for
   the darker ones:

   | Shade | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 |
   | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
   | Mix | 95% white | 90% white | 75% white | 60% white | 30% white | brand | 15% black | 30% black | 45% black | 60% black | 75% black |

   For example, orange `#e8590c` gives: 50 `#fef7f3`, 100 `#fdeee7`, 200 `#f9d6c2`,
   300 `#f6bd9e`, 400 `#ef8b55`, 500 `#e8590c`, 600 `#c54c0a`, 700 `#a23e08`,
   800 `#803107`, 900 `#5d2405`, 950 `#3a1603`.

   The default design uses `brand-*` classes for the main button, the header band, the
   selected answers and the field focus ring, so the new palette alone recolours those.
   A second colour goes straight into the classes as a hex value, such as
   `bg-[#1b1f4a]`. If it shows in many parts, you can instead give it its own
   eleven-shade `brand-secondary` scale in `theme`, built the same way, and use
   `brand-secondary-*` classes.
5. **Set the fonts.** `theme.typography` has three roles, `heading`, `body` and
   `button`, each written as `{ "fontFamily": "Poppins", "weights": [400, 600, 800] }`.
   Weights are numbers. A role you leave out uses the body font. Use only these family
   names, spelt as here. Any other name is skipped without an error, and that text falls
   back to a system font.
   - **Sans:** Inter, Roboto, Open Sans, Lato (100, 300, 400, 700, 900), Montserrat,
     Poppins, Josefin Sans, Nunito, Work Sans, Raleway
   - **Serif:** Merriweather, Lora, Playfair Display, PT Serif (400, 700)
   - **Display:** Oswald, Bebas Neue (400 only)
   - **Handwriting:** Dancing Script, Pacifico (400 only)
   - **Monospace:** JetBrains Mono, Roboto Mono, Fira Code

   Most have the weights from 400 to 700; the ones in brackets are all a font has. If
   the brief names a font that isn't here, it already says which one replaces it.
6. **Map the look to the parts.** Work through the look line by line with this table.
   The classes are examples: `brand-*` classes and exact values in square brackets
   (`rounded-[10px]`, `border-[#d1d5db]`, `bg-[#f6f7fb]`) both work.

   | Look line | Parts (`.lh-*`) | Example classes |
   | --- | --- | --- |
   | Brand colour | `.lh-button-next`, `.lh-field-single-choice-item--selected`, `.lh-field-multiple-choice-item--selected`, `.lh-field-input` | The default already uses `bg-brand-500`, `border-brand-500` and `focus:ring-brand-500` here. Keep them. |
   | Second colour | `.lh-button-previous` | `bg-[#1b1f4a]`, `hover:bg-[#12153a]`, `text-white` |
   | Buttons: shape | `.lh-button-next`, `.lh-button-previous` | square `rounded-none`, rounded `rounded-lg` or `rounded-[10px]`, pill `rounded-full` |
   | Buttons: filled or outlined | `.lh-button-next` | filled `bg-brand-500 text-white hover:bg-brand-600`; outlined `bg-transparent border-2 border-brand-500 text-brand-600 hover:bg-brand-50 shadow-none` |
   | Buttons: full width | `.lh-button-next` | `w-full` |
   | Answers: shape and border | `.lh-field-single-choice-item`, `.lh-field-multiple-choice-item` | `rounded-[10px]`, `border-2 border-brand-500` or `border border-[#d1d5db]` |
   | Answers: cards, list or pills | the same two | cards: more padding, `p-5 shadow-sm`; list: keep `p-3`; pills: `rounded-full px-5` |
   | Answers: hover | the same two | `hover:bg-brand-50 hover:border-brand-500` |
   | Answers: selected | `.lh-field-single-choice-item--selected`, `.lh-field-multiple-choice-item--selected` | `bg-brand-50 border-brand-500`, or filled `bg-brand-500` |
   | Answers: text | `.lh-field-single-choice-label`, `.lh-field-multiple-choice-label` | `text-[#2b2d2f]`, or `text-white` on filled answers |
   | Text: headings | `.lh-node-heading-title` | `font-extrabold`, and `text-white` on a coloured header band or `text-[#243447]` on a plain one |
   | Text: body and labels | `.lh-node-content-section-text`, `.lh-field-label` | `text-[#2b2d2f]` |
   | Page: background | `.lh-dt-layout-container` | Remove the default gradient (`bg-gradient-to-br` and its `from-`, `via-` and `to-` classes), then add `bg-white` or `bg-[#f6f7fb]` |
   | Page: card | `.lh-node-container`, with `.lh-node-content` and `.lh-node-buttons-container` for the card's colour | card colour on all three, radius to match the look, `border` or `border-0`; straight on the page: `bg-transparent border-0 shadow-none` |
   | Page: shadow | `.lh-node-container` | none `shadow-none`, soft `shadow-md`, strong `shadow-xl` |
   | Header band | `.lh-node-heading-container` | See below. |
   | Fields | `.lh-field-input` | `focus:ring-brand-500`, and a radius that matches the answers |

   **The header band.** The default design paints a band behind each step's heading,
   a gradient from `brand-500` to `brand-600` with white heading text. The new palette
   recolours it, but a band may not fit the look at all. Keep it only if the look suits
   a coloured band. Otherwise remove the gradient classes (`bg-gradient-to-r` and the
   `from-` and `to-` classes, with their `dark:` partners), then make the band flat
   (`bg-brand-500`), or plain (`bg-white`, with `border-b border-[#e5e7eb]`) and give
   `.lh-node-heading-title` a brand or dark text colour, such as `text-brand-700`.

   While you edit:
   - Change only the classes a look line is about. Keep the layout, spacing and
     transition classes.
   - Classes starting `dark:` style the dark theme. Leave them, unless you replace a
     `brand-*` or grey class with a fixed hex: then change or remove its `dark:` partner
     too, so the dark theme doesn't keep the old colour.
   - Use each part's name on its own as a key, exactly as the design reference lists
     it. Never combine two parts in one key.
   - Use the Feel line to settle anything the other lines leave open.
   - Some looks can only be approximated. For example, answer text that changes colour
     when the answer is hovered: the text sits on the label, not on the answer box.
     Note each one for step 9.
7. **Check where to save it.** `save_dt_design` saves either onto this tree
   (`target: "dt"` with `dtId`), or as a reusable design for the project
   (`target: "project"` with `projectId` and a `name`). Suggest this tree as the
   default and wait for their yes. Never save without it.
8. **Save with `save_dt_design`**: `target: "dt"`, the `dtId`, the `accountId`, and the
   full `styles` (the whole `theme` and the whole `tailwind` map). If a style can't be
   compiled, nothing is saved and the error says why. Fix that class and save again. A
   class the design system doesn't know is dropped without an error, which is why step
   9 matters.
9. **Read it back.** Call `get_decision_tree` again and check the compiled `css` in its
   `styles`. A colour may show as hex or as `rgb()` numbers: `#e8590c` is
   `rgb(232 89 12)`.
   - `.lh-button-next` and the answer parts show the brand colour.
   - `.lh-node-heading-container` no longer shows the default blues, `#3b82f6`
     (`rgb(59 130 246)`) and `#2563eb` (`rgb(37 99 235)`), unless the look is blue.
   - Every class you changed shows up. A missing property means its class was dropped.
   - `theme.typography` holds the fonts you set.

   If something is missing, fix it and save again. Then tell the person which look
   lines were applied as they were, and which were approximated or swapped, such as a
   hover colour or a font.

#### When the brief calls for a landing page

If the brief asks for a page that hosts the tree or leads visitors into it, don't build
the page here. Hand it to the `build-landing-page` skill with:

- the tree's id and title, the account and the project,
- the brief's goal (`goal`) and who it's for (`audience`),
- the copy points the brief gives: the offer, what visitors get, and any wording the
  person asked for,
- the look you applied to the tree: the brand colour and its palette, the fonts, and
  the brief's `look` lines, so the page matches the tree.

If the brief's `v3Upgrades` has "Landing page for your old header and footer" accepted,
this is that page. Also pass the old header and footer: their wording, menu links,
contact details and trust lines, read from the header and footer in the v2 export.
The page's own header and footer take their place around the tree. A logo has to be
uploaded again, so ask the person for it.

If the brief doesn't mention a page, don't offer to build one unless they ask.

### Closing summary

Once the draft is built, tell the person what they have and what's left for them to do.
Keep it short and use plain words.

1. **What you built.**
   - The tree's title and the project it's in.
   - How many steps it has, grouped by kind. For example: "6 questions, 1 email step,
     2 decision steps, 3 end pages."
   - Each outcome from the brief (`outcomes`) and where it goes. For example: "Good
     leads see the 'Book your survey' page. People outside your area see the 'Not a
     fit' page."
2. **What they need to set up themselves.**
   - **Connections.** Every step that needs a connected service under
     **Integrations**: SMTP email sending for email notices, Twilio for texts and phone
     checks, and the login or key for any CRM, webhook or other tool. Name each step
     that won't work until it's connected.
   - **What couldn't come over.** Each item in the brief's "What can't come over as it was"
     part (`cannotCarryOver`), and what they should do about it.
   - **Consent.** If the brief asks for consent, which step to add it to in the
     LeadsHook editor, and the wording to use. You can't set it up for them.
   - **Publishing.** The tree is a **draft**. Nothing is live until they publish it
     themselves in LeadsHook. Don't publish it for them.
3. **Where to see it.** End with the links from the import result's `links`, written
   as clickable markdown links, each on its own line:
   - `[Open the tree in LeadsHook](<editorUrl>)`: the tree in the editor.
   - `[Preview the draft](<previewUrl>)`: the survey as visitors will see it, before
     it's published.
   - If a landing page wraps the tree, say the preview shows the tree inside it.

   Don't offer `surveyUrl` as a working link yet: it only works once the tree is
   published. Say it's the link to share after publishing. If `links` has no
   `editorUrl`, tell them to open the project in LeadsHook and open the tree there.
4. **Making changes later.** Say that you can change the tree for them: read it first
   with `export_decision_tree`, then use `update_node` to change a step, `add_node` to add
   one and `connect_nodes` to wire it in.

---

## Related tools

- `update_decision_tree` — rename a tree or change its notes. It does not change nodes.
- `export_decision_tree` — the full tree as JSON, in the exact shape
  `import_decision_tree` takes.
- `delete_decision_tree` — destructive. Show the title and id and get an explicit yes
  before calling it.
- `get_decision_tree` — the tree's settings and its design (`styles`), but not its
  nodes. Read it before you save a design, because a save replaces the whole design,
  and again afterwards to check what was saved.
- `get_dt_design_context` and `save_dt_design` — how the tree **looks**. Styling is a
  separate job from the flow; do it once the flow is right.
