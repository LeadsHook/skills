---
name: review-decision-tree
description: Review or audit an existing LeadsHook decision tree, quiz or funnel and report what is wrong with it. Use when someone asks why a tree is not converting, wants a check before it goes live, or asks to find dead ends, missing fallbacks, confusing or redundant questions, too many steps, contact details asked too early, or inconsistent styling.
metadata:
  version: "0.2.1"
---

# Review a decision tree

A review answers one question for the person: **what is wrong with this tree, how much
does it matter, and what would fix it?** It is a read of a tree that already exists, run
in two passes — the **flow** (where visitors go) and the **design** (what they see) —
and it ends in a short report.

**A review is read-only.** You look, you report, you offer fixes. You change nothing
until the person has seen the report and said yes to a specific fix. See section 6.

---

## 1. Get oriented

Most tools here are scoped to one LeadsHook account, and they fail until one is chosen.

1. `whoami` — confirms who is connected. It returns `{ email }` and nothing else.
2. `list_accounts` — returns a **bare JSON array** of `{ id, name }`. Read the array
   directly; it is not wrapped in an object.
3. `select_account` — pick the account. **Nothing account-scoped works before this.**
4. `list_decision_trees` — resolve the tree the person named in words into an id. If
   more than one title is a plausible match, show them and ask which one. Reviewing the
   wrong tree wastes everyone's time and produces confident nonsense.

If a tool answers that you must select an account first, call `select_account` and
retry. It is not an error to work around.

---

## 2. Read the whole tree before you judge any of it

- `export_decision_tree` — the full tree as JSON: every node, its settings, its
  connections and the tree's design. **Prefer this one for a review.** Most findings
  depend on the connections between nodes, and you cannot see a dead end from one node.
- `get_decision_tree` — the tree's current nodes and structure. Fine when the person only
  wants the flow checked and the export is not available.
- `get_dt_design_context` with `dtId` — loads how the tree renders to a visitor, tailored
  to this tree's real nodes. Call it before the design pass. The same rendering detail is
  readable as the resource `leadshook://references/dt-rendering`.

When you need to know what a node type is meant to contain — to tell whether a setting is
missing or wrong — read its schema at `leadshook://schemas/node/{type}`, for example
`leadshook://schemas/node/email`. Settings shared by every node are at
`leadshook://schemas/node/_base`. Judge a node against its schema, not against memory.

Before you start writing findings, sketch the tree for yourself: which node is the first
screen, every route out of every node, where each route ends, and the longest route a
visitor can take. Almost every flow finding falls out of that sketch.

---

## 3. Pass one — the flow

Work through the tree's structure and routing. In order of how much damage they do:

- **Dead ends.** A route that stops on a screen that is not an ending — no
  `thank_you_page`, no `redirect_node`, nothing after it. A visitor there is stuck.
- **Missing fallbacks.** A `decision_node` or a branching question where some answer or
  some value has no route. "Did not match" will happen on day one.
- **Loops with no exit.** A route that leads back to an earlier screen with no way
  forward. A deliberate "go back and change your answer" loop is fine if it has an exit.
- **Floating nodes.** A node nothing leads into, or one that leads nowhere. Visitors never
  see it, or reach it and stop. Often a node added and never wired up.
- **Behind-the-scenes nodes in the wrong place.** A `calculation_node` before an answer
  it reads; a `webhook`, `api` or notification that fires before the contact details
  exist, so it sends an empty lead.
- **Contact details asked too early.** Email, phone or name before the visitor has
  invested anything. The single most common reason a tree does not convert.
- **A hard first screen.** A text box or a personal question as the opener, instead of a
  one-tap question about the visitor's own situation.
- **Wrong node type for the question.** A long visible list that should be a `dropdown`,
  "select all that apply" built as `single_choice`, a postcode in a `number` node.
- **Verification and consent bolted on.** Double opt-in, phone verification or consent
  built as extra screens instead of as settings on the `email` or `phone` node.
- **Too many steps, or redundant ones.** Two questions that ask the same thing, branches
  that differ in name only, a longest route that is a slog.

The detailed checks, with the rules of thumb for "too long" and "too deep", are in
[references/audit-checklist.md](references/audit-checklist.md). **Read it before you start
the flow pass** on any tree with more than a handful of nodes, and whenever the person
asked for a full audit or a pre-launch check.

---

## 4. Pass two — the design

Then look at what the visitor sees. Use the tree's styles from `export_decision_tree`
and the rendering detail from `get_dt_design_context`.

- **Consistency.** Buttons, headings and colours that change from screen to screen with
  no reason. One node styled differently from all the others.
- **Readability.** Text that is too faint against its background, text that is too small
  to read on a phone, long paragraphs on a question screen.
- **Button wording.** "Submit" and "Next" everywhere, where a button could say what
  happens: "See my results", "Get my quote".
- **Mobile.** Most visitors are on a phone. Wide layouts, tiny tap targets, long option
  labels that wrap badly, images that push the question below the fold.
- **Overrides fighting the tree design.** A node whose own style settings undo the tree's
  design, so the tree looks right everywhere except on that screen.

The design checks and the contrast rule of thumb are in the second half of
[references/audit-checklist.md](references/audit-checklist.md).

If the tree has no design of its own at all, say so once as a single finding — do not
list every screen as unstyled.

---

## 5. Classify every finding

Use these four levels, and say which one applies to every finding. They are written for
the person, not for an engineer.

| Level | Meaning | Examples |
| --- | --- | --- |
| **Blocks visitors** | Someone can get stuck, lost, or lose their lead. Fix before going live. | Dead end, missing fallback, loop with no exit, a webhook that sends a lead with no contact details. |
| **Costs conversions** | The tree works, but fewer people finish it than should. | Contact details asked first, a hard opener, unreadable text, a longest route far beyond the rule of thumb. |
| **Polish** | Visitors notice it, but it rarely stops them. | Inconsistent button styles, generic button wording, a floating node no route reaches. |
| **Worth considering** | Not wrong; a likely improvement. | Merging two routes that rejoin anyway, turning a slider into a quicker one-tap question. |

When in doubt between two levels, pick the higher one and say why. A finding you cannot
tie to an effect on a visitor or on a lead is not a finding — leave it out.

---

## 6. The review is read-only

- **Do not change the tree during a review.** No `add_node`, no `save_dt_design`, no
  `import_decision_tree`, no `update_decision_tree`. Reading only.
- **Never delete anything.** Not a node, not a tree, not a design — not even a floating
  node that looks like debris. Point it out and let the person decide.
- **Offer fixes; apply them only after an explicit yes**, one fix or one agreed batch at
  a time. "Looks good" about the report is not a yes to change the tree.
- **When a fix is approved, go the normal build route**, exactly as you would when
  building:
  - A new node: `generate_node`, then `add_node`. The node arrives **floating and
    unconnected** — say so, and have the person wire it in the LeadsHook canvas editor.
  - Rewiring, retyping or rewording existing nodes: the canvas editor, or export the tree,
    change it and import it with `import_decision_tree`. Say plainly that
    `import_decision_tree` **creates a new tree** alongside the old one; it does not edit
    the original, and the person has to switch their embed or link to the new one.
  - Design: through the styling route, with `save_dt_design`, after showing the person
    what will change.
- `update_decision_tree` only renames a tree or changes its notes. It does not fix flow.

---

## 7. The report

Short, in plain language, and in this order.

1. **Verdict first.** One or two sentences: is this tree ready, and what is the single
   most important thing to fix? For example: "Not ready to go live — two routes end on a
   question with nowhere to go. Otherwise the flow is sound; the main conversion issue is
   asking for the phone number on screen two."
2. **Findings, grouped by level**, highest first. Skip an empty level rather than writing
   "none". For each finding:
   - **Where** — the node's title as the person sees it in the editor. Add the id in
     brackets only to tell two same-titled nodes apart. An id alone means nothing to them.
   - **What is wrong** — one sentence.
   - **Why it matters** — the effect on a visitor or on the lead, one sentence.
   - **Fix** — concrete: what to move, add, connect or reword, and where.
3. **What you did not check.** If you skipped the design pass, or a node type's schema
   could not be read, say so in one line. A review that looks complete but is not is
   worse than one that is honest about its edges.
4. **The offer.** Ask which fixes they want you to make. Do not start making them.

Group repeated issues into one finding ("five questions use the default 'Next' button")
rather than listing every instance. A good report has a handful of findings the person
will act on, not every observation you made.

---

## Before you hand over the report

- You reviewed the tree the person meant, read in full.
- Both passes ran, or the report says which one did not and why.
- Every finding names a node by its title, has a level, a reason and a concrete fix.
- The verdict comes first and matches the worst finding.
- Nothing in the tree was changed, and nothing was deleted.
