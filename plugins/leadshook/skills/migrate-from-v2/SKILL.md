---
name: migrate-from-v2
description: Move a decision tree, quiz or funnel from the old LeadsHook (LeadsHook 2) to the new LeadsHook. Use this when someone mentions their old LeadsHook tree, a v2 export, or LeadsHook 2, when they want to move, migrate or bring over a funnel or quiz to v3 or the new LeadsHook, or when they have a quiz.json or .zip file from LeadsHook and want it working in the new version. Covers reading the old export, working out what the tree was for, talking it through, and agreeing a plan for the new tree, then handing it over to be built as a draft once the person confirms it.
metadata:
  version: "0.3.0"
---

# Move a tree from LeadsHook 2

The person has a tree they built in the old LeadsHook and wants it in the new one. This
skill works out **what that tree was trying to do**, agrees it with them, and writes it
down as a **Vision Brief**. Once they confirm it, the brief is handed to the
`build-decision-tree` skill, which builds the new tree as a draft.

What this skill does:

- Reads the export they give you (a `.json` or `.zip` file from the old LeadsHook).
- Works out the vision behind it: the goal, who it's for, the questions and why each one
  is asked, how people are qualified, what happens to each kind of visitor, and how it
  looked.
- Talks it through with the person, and asks only what you really need to know.
- Ends with a Vision Brief they have confirmed, handed to `build-decision-tree`.

What this skill does not do:

- **It never translates the old tree node by node.** The new LeadsHook works differently,
  and a one-for-one copy carries over old workarounds along with the real intent. Rebuild
  from the intent instead.
- **It never builds anything.** No tree, no node, no page. Building starts only after the
  brief is confirmed, and it happens in `build-decision-tree`.

---

## 1. Set up the session

The LeadsHook server remembers nothing between calls. There is no "current account" that
stays set. Every account-scoped call needs the account passed to it, every time.

1. `whoami` — confirms who is signed in. It returns `{ email }` and nothing else.
2. `list_accounts` — returns `{ "accounts": [ { id, name }, … ] }`. Read the list from
   its `accounts` property. If there is one account, use it. If there are several, show
   the names and let the person choose.
3. **Pass `accountId` on every account-scoped call** from here on, including calls you
   make later in the same conversation. Never assume an earlier call set it for you.
4. `list_projects` — with the `accountId`. A tree always lives inside a project, so find
   out now which project the new tree will go into. If there is more than one, ask. You
   won't build anything here; `build-decision-tree` uses this choice later.

`select_account` is optional. It only confirms the person has access to an account and
tells you which `accountId` to use. It does **not** make that account active, and no
other call depends on it having run first. Calling it never replaces passing `accountId`.

---

## 2. Read the export

The person's AI client opens the export file on their own machine. Read it to learn what
the tree was **for**, not to copy its steps. The full reading guide is in
[references/v2-export.md](references/v2-export.md). Read it before you read the export.
It covers the file formats, every step type, how steps connect, decision logic, and the
operator mapping. How the tree **looked** has its own guide,
[references/v2-design.md](references/v2-design.md). Read it before you fill the brief's
look part (`look`). It covers where the old colours, fonts and shapes are kept, and how
to pick each line of the look.

The key rules:

1. **Find the tree.** A `.zip` holds `quiz.json` (the tree) and an `images/` folder.
   A `quiz.json` on its own is the same tree. Check for `v2: true` or `systemVersion`
   `1` or `2` at the top.
2. **Walk it in visitor order.** Start at `data.firstNodeId` and follow each node's
   `connections`. The node order in the file means nothing.
3. **Read each step for its purpose.** `node.type` says what the step is (`question`,
   `form`, `decision`, `resultsPage` and so on). On a `question`, `object.typeId` says
   what kind of question.
4. **Decisions carry the logic.** Paths are tried in order, and the first match wins.
   A path with no conditions is the catch-all. Matching paths can set fields and add or
   remove tags. Those writes are usually the real goal, so put them in the brief.
5. **Map operators only onto the published set.** The new operators are listed in
   `leadshook://schemas/node/_base` under `conditionOperators`. An unrecognised
   operator quietly becomes `equals` and the branch stops working, so never emit one
   and never fall back to `equals`.
6. **Tags and tick-all-that-apply answers are lists.** Test them with `has_any_of`,
   `has_all_of`, `has_none_of` or `is_exactly`, and give a **list** of names as the
   value, never one joined-up text value.
7. **Spot what won't carry over.** Scoring, transitions, notifications, phone
   verification, email-list steps and outside connections are easy to recognise
   (section 6 of the guide). Note what each was for, then handle it with
   [What does not carry over](#5-what-does-not-carry-over).
8. **Read the look too.** Most design keys are `null` when the person never changed
   them, and that means "the old default", not a choice. For some trees the brand
   shows only in the header, footer or results-page HTML. The design guide says how to
   weigh the two.
9. **When in doubt, ask.** If you can't tell what a step, field or operator did,
   describe it in plain words and ask the person. Don't guess.

---

## 3. Draft the Vision Brief

The Vision Brief is the one thing this skill produces. It says what the tree is for, in
plain words, with no steps or node types in it. You show it to the person, they correct
it, and `build-decision-tree` builds the new tree from it.

### The Vision Brief

The brief always has these 11 parts, in this order. Keep every heading, even when a part
is empty: write "None" rather than leaving it out. Write it for the person, not for a
machine. Use their words where you can.

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

### Fill in a draft from the export

Read the export with the guide in section 2, then fill each part as below. This is a
**draft**. You're guessing the intent from what the old tree did, and the person
confirms it in the next step.

1. **Goal.** Look at the tree's title and description, the promise on its start page,
   and what the results pages offer. Say what the funnel achieves for the person, not
   what it does step by step.
2. **Who it's for.** Read how the questions are worded. Who they speak to, and what they
   assume, tells you who the visitor is.
3. **What we ask, and why.** Walk the questions in visitor order. For each one, the
   "why" is its job in the tree: does its answer choose a path, qualify the lead, feed a
   label, or get sent on to another tool? If the answer is saved but never used, say so.
   That question may not be needed.
4. **Good, bad and disqualified leads.** Read the decision paths, the tags they add or
   remove, and any ends that turn people away. Describe each rule as a goal: "people
   under 18 can't go further", not "path 2 checks `age` less than 18".
5. **Where each lead ends up.** Follow every path to its end, including dead ends. Each
   distinct end is one line: who gets there, and what they see or are offered.
6. **Contact details and consent.** Collect this from the forms and the email and phone
   questions: which details were asked, which were required, any consent wording, and
   any email or phone check (`doubleOptIn`, phone verification by text).
7. **After a lead comes in.** List the fields and tags the tree sets, the notifications
   it sends, and every email-list, webhook or outside connection. Say what each is for
   and where it goes.
8. **Upgrades.** Leave this empty for now. You'll fill it while you talk the draft
   through (section 4). Offer an upgrade only when it clearly serves something already
   in the brief, never just because it exists.
9. **What can't come over.** Add each construct the reading guide flags as not carrying
   over (scoring, transitions, notifications and the rest). Say what it was for, and use
   [What does not carry over](#5-what-does-not-carry-over) to fill in what the new tree
   does instead.
10. **How it looks.** Read the old tree's design with
    [references/v2-design.md](references/v2-design.md). Write each line with exact
    values from the export: hex colours, font names, corner sizes. Say in plain words
    where each shows. If the export has no design at all, write "None — use a clean
    default". Anything the new tree can't hold (a header or footer, the logo, the
    progress bar, the favicon, custom CSS, a font that isn't on the list) goes to part 9
    (`cannotCarryOver`), never into `look`.
11. **Open questions.** Add a question only when the export really can't answer it: a
    step you can't read, a hidden field with no clear source, a rule that could mean two
    things. If you can work it out from the export, write it into the brief instead of
    asking.

---

## 4. Talk it through

Now show the person the draft and let them shape it. This is a conversation, not a form.

1. **Show the draft brief.** Use the template in section 3, in plain language. No node
   types, field keys, operators or other jargon. Say "we ask for their budget", not
   "a single-choice step writes `budget`".
2. **Let them fix it.** Ask if it matches what the funnel was for. They can correct,
   add to or cut any part. Update the brief each time and show the part that changed.
3. **Offer upgrades, but only where they fit.** Offer a new LeadsHook feature only when
   it clearly serves something already in the brief. For each one:
   - Name the brief item it serves, and the benefit in one line.
   - Let the person say yes or no.
   - Record it in part 8 (`v3Upgrades`): feature, benefit, accepted yes / no.

   Offer one or two that really help, not a long list. If nothing fits, offer nothing
   and write "None".
4. **Ask your open questions** one at a time, using the rules below.
5. **Loop** until the person has no more changes. Then move on to
   [Confirm and hand off](#6-confirm-and-hand-off).

**Upgrades you can offer**, and the brief item each one serves:

| Upgrade | Offer it when the brief has… | One-line benefit |
| ------- | ---------------------------- | ---------------- |
| Email check (double opt-in) | An email address that must be real | "Only people who confirm their email count as leads." |
| Phone check by code (text or WhatsApp) | A phone number your team will call | "Only real, working numbers reach your sales team." |
| Consent capture | Contact details, and a need to show permission to contact | "Each lead carries a clear record that they agreed to be contacted." Say that they add it in the LeadsHook editor after the build: the tree is built without it, because consent must use wording already published in their account. |
| Conversion tracking | Ad campaigns or a key moment you want to measure | "Your ad platforms see which visitors became leads." |
| Labels and saved details set by rules | Leads you sort, score or route by their answers | "Each lead is labelled by its answers, so you can filter and follow up." |
| Different destination per answer | Different outcomes that send people to different pages or sites | "Each kind of visitor goes straight to the page that fits them." |
| Send the lead to another tool | A CRM, email list or other tool the lead should reach | "New leads land in your CRM the moment they finish." |
| Landing page for your old header and footer | Header or footer HTML in the export (`belowHeaderContent`, `aboveFooterContent`, `showHeader`, `showFooter`) | "Your old header and footer (brand, trust, contact) stay around the new tree." If they say yes, it goes in part 8 (`v3Upgrades`). `build-decision-tree` builds the tree first, then hands the page to `build-landing-page`. |

Check the details of each feature in `leadshook://schemas/node/{type}` before you
describe it. Don't offer anything outside this table unless that resource shows it
exists. If the old tree had calculated fields, they carry over as Calculation steps
(see [What does not carry over](#5-what-does-not-carry-over)). That's part of the
rebuild, not an upgrade to offer.

### When to ask a question

Most of what you need is already in the export. Ask only when it really isn't.

- **Ask only what the export can't tell you.** A step you can't read, a hidden detail
  with no clear source, a rule that could mean two things.
- **Never ask anything the export already answers.** If the question text, the answer
  choices, the paths, the tags or the end pages show it, write it into the brief. Don't
  ask the person to repeat what their own tree says.
- **Ask one question per turn.** Wait for the answer before you ask the next.
- **Keep it easy and direct.** Each question should be answerable in a few words, or
  with a yes or no.
- **Always suggest a default.** Say what you'll do if they have no view, so they can
  just say "OK".
- **Keep what's unanswered in part 11** (`openQuestions`) until you've asked it. Remove
  each one once it's answered, and put the answer in the brief.

Good and bad questions:

| Bad | Good |
| --- | ---- |
| "What should happen to leads who don't qualify?" | "I'll send people who don't qualify to a polite 'not a fit' page. OK?" |
| "What age range do you target?" (the export's decision already turns away under-18s) | Don't ask. Write "people under 18 can't go further" into the brief. |
| "Can you describe your CRM setup, which fields map where, and how often it syncs?" | "The old tree sent leads to a web address I can't open. Is that your CRM? I'll send new leads there too." |

---

## 5. What does not carry over

Some old features have no one-for-one match in the new LeadsHook. Some still work, just
differently. Others can't be done at all, so the new tree does something else instead.

**The rule: tell the person before anything is built.** Every item you find goes in the
brief's `cannotCarryOver` list as `{ what, instead }`. `what` is what the old tree did,
in plain words. `instead` is what the new tree will do. Go through the list with the
person while you talk the brief through, and get their OK on each item. Never leave one
to be discovered after the tree is built. List the items that work differently too:
the person still needs to know.

| Old feature | In the new LeadsHook | What to offer instead |
| --- | --- | --- |
| **Scoring** (points on answers, points tables, score-based results) | Works differently | Answer points carry over as answer scores, which add up in `lh_score`. A Decision step branches on score ranges and sends each range to its own end page. Points on decision paths don't carry over as points: move them onto the answers, mark the lead with a tier (tag or field), or add them up in a Calculation step if that is clearer. |
| **Calculated fields** (`calculated` fields with a `formula`, and `sumplus` running totals) | Works differently | Each one becomes a Calculation step (`calculation_node`). `settings.formula` is the old formula with `{field}` changed to `{{field}}`, and `settings.resultField` is the old field's name. Put it after the last step that collects a field the formula uses, and before anything that shows or branches on the result. Several calculated fields become several steps, in the order they depend on each other. The old tree recalculated a value whenever it was used. The new one calculates it when the visitor passes the step. |
| **Timed transitions** (`transition` steps) | Does not carry over | No page moves on by itself. Put the message at the top of the next step, or keep it as a page with a **Continue** button. |
| **Removing tags on a path** (`removeTags`) | Works differently | A Decision step only routes. Put a Tag Assignment step on that path. Its rules can add or remove tags. Set fields the same way with a Field Assignment step. |
| **Notifications, email lists, phone checks and outside connections** | Works differently | The steps can be rebuilt, but each one only works once the person connects the service again under **Integrations**: an email-sending account, Twilio, their email marketing tool, or the other system's login. |
| **Signature fields, "not all of these tags", unmappable operators, hidden fields, date-and-time, US zip code, images** | Varies | See the reference. |
| **Design: header and footer HTML, logo, progress bar, favicon, custom CSS, fonts not on the list** | Does not carry over as it was | The colours, fonts and shapes carry over in the look part (`look`). Offer a landing page for the old header and footer. See the reference, section 6. |

Plain scoring (points on answers) stays answer scores plus `lh_score` and range paths.
Use a Calculation step for calculated fields and formula-based values.

The full list, with each alternative and an example `cannotCarryOver` entry, is in
[references/does-not-carry-over.md](references/does-not-carry-over.md). Read it before
you write the list.

---

## 6. Confirm and hand off

Nothing is built until the person **clearly says yes** to the final brief. This is the
last step of this skill.

### Get a clear yes

1. **Show the complete final brief.** All 11 parts, in the template from section 3,
   with every heading. Include every item in part 9 (`cannotCarryOver`) with what the
   new tree does instead, and every upgrade in part 8 (`v3Upgrades`) with its yes or
   no. Part 11 (`openQuestions`) should say "None" by now. If it doesn't, go back to
   section 4 and ask what's left.
2. **Say which project the tree goes into.** Use the project list from section 1. If
   there's only one project, name it rather than ask. If there are several and the
   person hasn't chosen yet, ask which one first.
3. **Ask one direct question with a clear yes.** For example: "Shall I build this as a
   draft in the Marketing project?" Make it plain that the new tree starts as a
   **draft**, so nothing goes live until they publish it.
4. **Only a clear yes counts.** "Yes", "go ahead" or "build it" is a yes. These are not:
   - silence, or a change of subject,
   - "looks good so far", "mostly right" or "I think so",
   - a yes to one part of the brief but not the rest.

   When the answer isn't a clear yes, ask again in one short line.
5. **Any change sends it back.** If the person wants to change anything, even one word,
   go back to [Talk it through](#4-talk-it-through). Update the brief, then show the
   whole brief again and ask for a fresh yes.

### Hand it off

Once the person says yes, hand the confirmed brief to the `build-decision-tree` skill.
Pass it **word for word**, in the template from section 3, along with the account and
the project they chose. `build-decision-tree` builds the new tree as a draft from it.

**This skill never creates, imports or edits a tree itself.** Don't call
`import_decision_tree`, `create_dt_from_questions`, `add_node`, `update_node`,
`connect_nodes`, `update_decision_tree` or `delete_decision_tree` from here, not even
once the person has said yes. Building is `build-decision-tree`'s job.

If the `build-decision-tree` skill isn't available, stop. Don't build the tree by hand.
Tell the person to update the LeadsHook plugin, and give them the confirmed brief so
they can pick up from here once it's updated.

---

## Common questions

**Q: The person says "looks great". Is that a yes?**

A: Only if it answers your "Shall I build this?" question. If they said it while you
were still going through the brief, ask the build question on its own.

**Q: They want one small change after saying yes. Can I just pass it on?**

A: No. Make the change, show the whole brief again, and ask for a new yes before you
hand it off.

**Q: Can I build the tree myself if it's quicker?**

A: No. This skill only agrees the brief. The building happens in `build-decision-tree`.
