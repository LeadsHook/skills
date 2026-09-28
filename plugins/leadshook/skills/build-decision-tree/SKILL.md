---
name: build-decision-tree
description: Build a LeadsHook quiz, survey, lead capture form or qualification funnel, or add a question or step to one you already have. Use this when someone wants to ask visitors a series of questions, choose the right question type for an answer, branch the flow based on what someone answers, score or qualify the people who answer, verify an email or phone number, or collect consent before a lead is captured.
---

# Build a decision tree

A LeadsHook decision tree is a sequence of screens a visitor moves through. Each screen
is a **node**. This skill is about **judgement**: which node type fits a question, what
order the nodes go in, and where the flow should split.

It is deliberately not about field names and JSON shapes. Those live in the MCP
resources and are always current; anything written down here would go stale between
plugin releases. Read the schema, then decide with the guidance below.

---

## 1. Get oriented before you build

Most tools here are scoped to one LeadsHook account, and they fail until an account is
chosen. Run this once at the start of a session:

1. `whoami` — confirms who is connected. It returns `{ email }`. There is no `id` on it;
   do not look for one.
2. `list_accounts` — returns a **bare JSON array** of `{ id, name }`. It is not wrapped
   in an object, so read the array directly.
3. `select_account` — pick the account. **Nothing account-scoped works before this.**
4. `list_projects` — a decision tree always lives inside a project. If the person has
   more than one, show the list and let them choose rather than guessing.

If you are changing something that already exists rather than starting fresh:

- `list_decision_trees` — resolve a tree the person named in words into an id.
- `get_decision_tree` — read a tree's current nodes and structure before you touch it.
  Never edit a flow you have not read.

**If a tool answers that you must select an account first, that is not an error to work
around.** Call `select_account` and retry.

---

## 2. Pick the way you are going to build

There are three routes. Choosing the wrong one creates rework, so choose deliberately.

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

Know what it does: it **creates a new decision tree**. It does not merge into an
existing one, and it is rejected if the title or token collides with a tree that is
already there. To revise an existing tree, `export_decision_tree` gives you the same
shape back — export, change it, re-import as a new tree.

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
"the node is created but not yet connected" — and then either connect it by dragging the
connection in the LeadsHook canvas editor, or, if the flow needs several nodes wired
together, prefer route B and declare the connections up front instead of calling
`add_node` repeatedly.

---

## 3. When `generate_node` asks you to clarify

`generate_node` can come back with `status: 'clarify'` and a list of candidate node
types. That happens when the description is ambiguous, or when two types match it
equally well.

**Do not silently pick one.** The whole point of the response is that the tool could not
tell, and a wrong node type is a wrong question for every visitor who reaches it.

Do this instead:

1. Look at the candidates against the guidance in section 4.
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
| Work out a score or a total from earlier answers | `calculation_node` |
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
  separate screen and not a `switch`.

For all three, read the type's schema at `leadshook://schemas/node/{type}` — substitute
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
4. **Put the behind-the-scenes nodes where their inputs exist.** A `calculation_node`
   must come after every answer it reads. A `webhook` or `api` firing before the email
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

## 8. Before you say you are done

- The tree opens with a low-effort question and asks for contact details late.
- Every route reaches an end; no branch stops in mid-air.
- Every node you added with `add_node` has been **connected**, or the person has been
  told plainly that it is still floating.
- Every condition has a fallback.
- Verification and consent were configured on their node, not bolted on as extra screens.
- Every node's settings came from its schema resource, not from memory.
- You read the tree back with `get_decision_tree` or `export_decision_tree` and it is
  what you described.

---

## Related tools

- `update_decision_tree` — rename a tree or change its notes. It does not change nodes.
- `export_decision_tree` — the full tree as JSON, in the exact shape
  `import_decision_tree` takes.
- `delete_decision_tree` — destructive. Show the title and id and get an explicit yes
  before calling it.
- `get_dt_design_context` and `save_dt_design` — how the tree **looks**. Styling is a
  separate job from the flow; do it once the flow is right.
