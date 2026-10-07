# Reading a LeadsHook 2 export

This is the detail behind section 2 of the `migrate-from-v2` skill. Use it to read the
old tree and understand **what it was for**. It is not a translation table. You're
reading the old tree to learn the person's intent, and the new tree is built from the
confirmed Vision Brief. How the old tree **looked** has its own guide:
[v2-design.md](v2-design.md).

Never guess. If something in the export isn't covered here, or you can't tell what it
did, note it and ask the person.

---

## 1. The file you'll get

The person gives you one of two files. Both hold the same tree.

| File | What's inside | Where the tree is |
| --- | --- | --- |
| `.zip` | A `quiz.json` file and an `images/` folder | Open `quiz.json`. It may sit inside a folder in the zip. |
| `quiz.json` | The tree on its own | The whole file. |

- The `images/` folder holds the pictures the old tree showed. You don't need it to
  understand the tree. Mention to the person that images will need uploading again.
- If a zip holds more than one `quiz.json`, don't pick one. Ask which tree they mean.
- If a zip has no `quiz.json` but one other `.json` file, that file is the tree.

### Check it really is a LeadsHook 2 export

The top of the file has `v2: true`, or `systemVersion` set to `1` or `2`. If neither is
there, it's probably not an old-LeadsHook export. Tell the person and stop.

### The top-level keys

| Key | What it tells you |
| --- | --- |
| `title`, `description`, `identifier` | The tree's name and what the person called it. A good first clue to the goal. |
| `data.firstNodeId` | The step visitors see first. Start your walk here. |
| `nodes` | Every step in the tree. This is the tree. |
| `fields` | The list of every piece of data the tree collects or sets: `name`, `label`, `type`. |
| `tags` | Every tag the tree uses, as `{ id, name }`. Use it to turn a tag id into a name. |
| `results` | Result definitions used by scoring (see section 6). |
| `gtm`, `scripts`, `settings` | Tracking tags, custom scripts and tree settings. Note them for the brief. |
| The design keys on `data` (colours, fonts, buttons, header and footer HTML) | How the tree looked. Read them with [v2-design.md](v2-design.md). |

Some values are stored as text that holds JSON, for example `"data": "{\"pointsTable\": …}"`.
Read the text as JSON before you judge it.

---

## 2. How the steps connect

Each node has an `id`, a `type`, and an `object` holding its content. The links between
steps live on the node they leave from:

- `connections` — each one is `{ sourceId, destId, connectorId }`: "from this step to
  that step".
- `connectors` — the exits of a step. Each has a `type` (`answer` or `path`) and an
  `objectId`, which is the id of the answer or decision path that exit belongs to.

Reading a link:

- `connectorId: null` — the step's single "next" link. Everyone goes this way.
- `connectorId` set — look it up in that node's `connectors`. Its `objectId` tells you
  **which answer** (on a question) or **which path** (on a decision) leads there.
- An answer with no connector of its own follows the step's "next" link, if there is
  one.
- An answer with no connector and no "next" link is a **dead end**. The visitor's
  journey stops there. That's often deliberate, but ask if it looks like a mistake.
- A step with no `connections` at all is an end of the tree.

Walk from `data.firstNodeId` along the links. The order you meet steps in is the order
visitors see them. The node order in the file means nothing.

---

## 3. Step types

The v2 step type is `node.type`. Here's what each one means for the funnel.

| `type` | What it was in the funnel | What to take from it |
| --- | --- | --- |
| `startPage` | The welcome or intro screen. | The promise made to the visitor and the tone. |
| `question` | One question to the visitor. Its kind is in `object.typeId` (next table). | The question, its answers, and why it's asked. |
| `form` | A form asking for several details at once. `object.fields` lists them in `Fieldable.order`. | This is usually the lead capture. Note which details are required. |
| `decision` | Invisible logic. It routes the visitor and can set fields and tags. See section 4. | How people are qualified or segmented. This is often the heart of the tree. |
| `resultsPage` | A results or end page. With no outgoing link it's the final page. With one it's a page mid-way. It can also be a scoring page (section 6). | What each kind of visitor is told at the end, and what they're offered. |
| `customPage`, `nodePage` | A content page: text, images, video, an offer. | The message and where it sits in the journey. |
| `transition` | A short page that moved on by itself after a delay. | Its message. See section 6. |
| `webhook`, `api` | Sent lead data to another system, or fetched data from one. `object.method` and `object.url` show where. | Which outside system the leads go to, and when. |
| `fileUpload` | Asked the visitor to upload a file. | What file, and why. |
| `smsVerification` | Checked the visitor's phone number with a code by text message. | That phone numbers had to be verified. |
| `emailNotification` | Sent an email, usually to the person's team, when a lead came through. | Who needs telling, and what about. See section 6. |
| `smsNotification` | Sent a text message about the lead. | The same as above. See section 6. |
| `esp` | Added the lead to an email marketing list. | Which list, and at which point. See section 6. |

A type that isn't in this table: read its `object.title` and content, describe what you
think it did, and ask the person.

### Question kinds (`object.typeId`)

| `typeId` | Kind of question |
| --- | --- |
| 1 | Pick one answer. Each answer can lead somewhere different. |
| 2 | Tick all that apply. |
| 3 | Long written answer. |
| 4 | Short written answer. |
| 5 | A number. |
| 6 | A mobile phone number. |
| 7 | An information screen. It asks nothing. |
| 8 | A slider. |
| 9, 16 | An address. |
| 10 | A drop-down list. |
| 11 | A date. |
| 12 | A time. |
| 13 | A date and time. |
| 14 | An email address. |
| 15 | A US zip code. |

Other things to read on a question:

- `object.title` — the question text.
- `object.fields[].name` (or `object.identifier`) — the name of the field the answer
  is saved to. Later conditions refer to it.
- `required` on a field — the visitor had to answer.
- `placeholder` and `label` — the hint and label text.
- `doubleOptIn: true` — the person wanted the email or phone number confirmed. Carry
  that wish into the brief.
- A field with `visible: false` — a hidden field that a script filled in, not the
  visitor. Ask what fills it.

### Answers (`object.answers`)

Each answer has an `id`, the `text` the visitor sees, and often:

- `fields[].Fieldable.value` — the value saved when this answer is picked. It can differ
  from the text: "Pro" might save `pro`.
- `points` — the score this answer adds (section 6).
- `tags` — tags added to the lead when this answer is picked. Treat them like tags set
  by a decision path (section 4).
- On a tick-all-that-apply question, `type: "choice"` is a normal answer. `type:
  "combination"` is **not** something the visitor sees. It's a routing rule for one mix
  of answers ("ticked both Sports and Music"), usually with its own link. Work out what
  that mix meant to the person. It becomes a branch on the answer list (section 5).

### Field types in `fields` and on forms

The `type` on a field tells you what kind of data it holds. Most are plain: `text`,
`textarea`, `number`, `email`, `mobile`, `address`, `radio`, `checkbox`, `dropdown`,
`date`, `time`. A few need a note in the brief:

- `datetime` — a date and a time together.
- `calculated` — a value worked out from a formula (the field's `formula`, which refers
  to other fields as `{field}`). Note the formula and what it was for. It carries over as
  a Calculation step ([does-not-carry-over.md](does-not-carry-over.md), section 1b).
- `sumplus` — a running total, often a score. Ask whether it was really a score (answer
  scores) or a plain total (a Calculation step).
- `url`, `us_zipcode`, `lh_address` — a web address, a US zip code, an address.
- Anything else, such as `signature` — describe it, and ask the person how they used it.

---

## 4. Decision steps

A `decision` step is where the tree's logic lives. The visitor never sees it.

- `object.paths` — the possible routes, tried **in `order`**. The **first** path whose
  conditions match wins, and the visitor goes down its link.
- A path with **no conditions** always matches. It's the catch-all for everyone who
  didn't match an earlier path.
- `data.match` on a path — `all` means every condition must be true. `any` means one is
  enough.
- `data.conditions` — the tests (section 5).

When a path matches, it can also change the lead:

- `fields` — sets a field. The value set is in `Fieldable.value`. For example, path
  "Senior" sets `tier` to `senior`.
- `tags` — adds these tags to the lead.
- `removeTags` — takes these tags off the lead.

These writes are often the real point of the decision. They label the lead for
follow-up, for a sales team, or for another system. Put them in the brief as goals, not
as mechanics: "people aged 65+ are marked as senior".

`data.evaluateAllPaths: true` on the decision step changes the rules. Every matching
path sets its fields and tags, not just the first one. Note this in the brief. It means
the person wanted several independent labels, and the new tree should set each one
under its own condition.

### What a condition tests (`condition.type`)

| `type` | What it checks |
| --- | --- |
| `custom_field` | A field, by its `field` name. |
| `question` | The answer to a question. `questionId` is the id of that question step (or its `object.id`). Find the field that question saves to. |
| `tags` | The tags on the lead. |
| `geoip` | Where the visitor is. |
| `device` | The visitor's device. |
| `tracking` | Tracking data, such as campaign parameters. |

Usually a condition compares with the fixed `value`. When `valueType` is `field`, it
compares with another field instead, named in `valueField`.

---

## 5. Condition operators

The v2 operator is `condition.operator`. The table maps each one onto an operator the
new LeadsHook publishes, so you can describe the rule in the brief and so the rebuild
can use it.

The new LeadsHook publishes its full list of condition operators in the shared node
schema: read `leadshook://schemas/node/_base` and look at `conditionOperators`. Use only
operators from that list.
**An operator the new LeadsHook doesn't recognise is not rejected. It quietly becomes
`equals`**, which almost never matches, so a branch silently stops working. If an old
operator has no faithful match, never fall back to `equals`. Follow the table instead.

### Text and number operators

| v2 operator | Meaning | New operator |
| --- | --- | --- |
| `eq` | is exactly | `equals` |
| `ne` | is not | `not_equals` |
| `contains` | contains the text | `contains` |
| `ncontains` | doesn't contain the text | `not_contains` |
| `startswith` | starts with | `starts_with` |
| `endswith` | ends with | `ends_with` |
| `gt` | more than | `greater_than` |
| `gte` | at least | `greater_than_or_equals` |
| `lt` | less than | `less_than` |
| `lte` | at most | `less_than_or_equals` |
| `blank` | is empty | `is_empty` |
| `nblank` | has a value | `is_not_empty` |

On a **date** field, compare dates with the date operators instead: `gt` → `after`,
`lt` → `before`, `gte` → `on_or_after`, `lte` → `on_or_before`.

### Tag operators

In the new LeadsHook, the lead's tags are a **list**, read from the `lh_tags` field.
A list is compared with the set operators, and their value must be a **list of tag
names**, never a single text value.

| v2 operator | Meaning | New operator and value |
| --- | --- | --- |
| `include_any` | has at least one of these tags | `has_any_of`, e.g. `["vip", "gold"]` |
| `include` | has this tag | One tag: `has_any_of` with `["vip"]`. Several tags: ask whether they meant *all of them* (`has_all_of`) or *any of them* (`has_any_of`). |
| `not_include` | doesn't have this tag | `has_none_of`, e.g. `["vip"]` (none of the listed tags). If they meant "doesn't have *all* of them", no single operator says that. Put a `has_all_of` path first and route the rest past it. |
| `no_tags` | has no tags at all | `is_empty` on the tags |

Building the list of tag names:

- The v2 `value` may be a tag **name**, a tag **id**, or several joined together, such
  as `"vip,gold"`. Split it into separate tags.
- Turn each id into its name with the top-level `tags` list.
- Never pass `"vip,gold"` as one item. It matches no real tag. With `has_none_of` that
  is worse than doing nothing: the condition is then true for **every** lead, so an
  exclusion branch would let everyone through.
- An empty list never matches. To ask "does this lead have any tags?", use
  `is_empty` or `is_not_empty`.

### Tick-all-that-apply answers

A tick-all-that-apply answer is also a **list**. Don't test it with `equals` or
`not_equals`. Those never match a list. Use the set operators with a list of answer
values:

| What the old tree meant | New operator |
| --- | --- |
| ticked this answer (v2 `contains` or `eq` on one answer) | `has_any_of` with a one-item list |
| ticked at least one of these | `has_any_of` |
| ticked all of these, maybe more | `has_all_of` |
| ticked none of these | `has_none_of` |
| ticked exactly this mix, nothing else (a `combination` answer) | `is_exactly` |

If you can't tell whether a combination meant "at least these" or "exactly these", ask.

### An operator that isn't in these tables

Don't map it and don't guess. Describe the rule in plain words and ask the person what
it was for. If it has no faithful match in the new LeadsHook, list it under
[What does not carry over](../SKILL.md#5-what-does-not-carry-over) and say how the new
tree will handle the need instead.

---

## 6. Scoring, transitions, notifications and email lists

These are easy to spot. How to handle each one is in
[What does not carry over](../SKILL.md#5-what-does-not-carry-over). Here, just find them
and write down what they were for.
The alternative for each one is in [does-not-carry-over.md](does-not-carry-over.md).

| What | How you'll recognise it |
| --- | --- |
| **Scoring** | A `resultsPage` whose `data.resultsDisplayMethod` is not `accumulated` (for example `points_table` or `unique`), or whose `data` has a non-empty `pointsTable`, or whose `object.results` isn't empty. `points` on answers or paths, and a top-level `results` list, are also signs. A `resultsPage` with none of these is a plain end page. |
| **Transition** | A step of type `transition`. |
| **Notifications** | Steps of type `emailNotification` or `smsNotification`. |
| **Phone verification** | A step of type `smsVerification`. |
| **Email list** | A step of type `esp`. |
| **Sending data out** | Steps of type `webhook` or `api`. The link to the other system has to be set up again. |

For scoring, write down what the score decided: which result each score range led to,
and what each answer was worth.

---

## 7. A worked reading

A small old tree, read step by step:

1. `startPage` "Welcome" → `question` typeId 1 "What is your age?", saved to `age_group`.
2. `decision` "Qualify by age", `evaluateAllPaths: false`:
   - Path "Senior" (first): `custom_field` `age_group` `gte` 65. Sets `tier` to
     `senior`, adds tag `senior`, goes to `smsVerification` "Verify phone", then to
     `resultsPage` "Senior result".
   - Path "Standard" (second, no conditions): the catch-all. Sets `tier` to `standard`,
     adds tag `standard`, goes to `resultsPage` "Standard result".
3. Neither results page has an outgoing link or scoring, so both are plain end pages.

What it tells you about the vision: the tree splits visitors by age. Anyone 65 or over
is marked senior and must verify their phone before seeing their result. Everyone else
is marked standard and goes straight to theirs. In the new tree, `gte` becomes
`greater_than_or_equals`, and the phone check goes into the brief's contact details
(part 6, `capture`).
