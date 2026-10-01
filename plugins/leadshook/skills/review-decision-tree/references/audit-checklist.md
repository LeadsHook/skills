# The audit checklist

The full set of checks behind a review, with the level each one usually lands at and the
rules of thumb for "too long", "too deep" and "too faint". Work through it in order. The
level in brackets is the default; move a finding up or down when the tree gives you a
reason, and say what the reason was.

The thresholds are rules of thumb, not product limits. A tree just past one is a prompt
to look closer, not an automatic finding. Never state them to the person as hard rules.

Before checking a node's settings, read its schema at `leadshook://schemas/node/{type}`.
What a node is meant to contain comes from there, not from this list.

---

## Part 1 — Flow

### 1.1 Can every visitor finish?

- [ ] **Every route ends on an ending.** Follow each route from the first screen. It
      should finish on a `thank_you_page` or a `redirect_node`, or on another node the
      person confirms is a deliberate end. A route that stops anywhere else is a dead
      end. *(Blocks visitors)*
- [ ] **Every connection points at a node that exists.** A connection to a node that is
      not in the tree behaves like a dead end. *(Blocks visitors)*
- [ ] **Every branch has a fallback.** For each `decision_node` and each question that
      routes by answer, check that every option or every possible value has a route,
      including "none of these", "did not match" and an empty answer. *(Blocks visitors)*
- [ ] **No loop traps the visitor.** A route that returns to an earlier screen must also
      have a way forward. Repeating a question with no exit is an endless loop.
      *(Blocks visitors)*
- [ ] **Required questions can be answered.** A required choice question with no
      options, or a required field the visitor cannot fill, stops the flow.
      *(Blocks visitors)*

### 1.2 Floating nodes

- [ ] **Nothing leads in.** A node no route reaches is never seen. Often it was added
      and never wired up. Report it and ask whether it should be connected or is
      obsolete — never delete it yourself. *(Polish; raise to Costs conversions if it is
      clearly a question or step the person meant visitors to see.)*
- [ ] **Nothing leads out.** A node a route reaches but that has no way forward and is
      not an ending is a dead end — check it under 1.1. *(Blocks visitors)*

### 1.3 Behind-the-scenes nodes

- [ ] **Inputs exist before they are read.** A `calculation_node`, `decision_node` or
      `field_assignment` must sit after every answer it reads, on every route that
      reaches it. Check each route, not just the main one — a branch that skips the
      question feeds it an empty value. *(Blocks visitors if it breaks routing;
      otherwise Costs conversions)*
- [ ] **Leads go out with contact details on them.** A `webhook`, `api`,
      `email_notification` or `sms_notification` placed before the `email`, `phone` or
      `name` node sends a lead nobody can follow up. *(Blocks visitors — the lead is
      effectively lost)*
- [ ] **`webhook` versus `api`.** If a later step depends on data coming back, it needs
      `api`; a `webhook` does not wait for a response. *(Blocks visitors)*
- [ ] **No "set-up" node at the start.** A node that only exists to initialise fields
      is the wrong shape; lead fields belong in the tree's Fields tab in the LeadsHook
      editor. *(Polish)*
- [ ] **Milestones are tracked where they happen.** A `conversion_tracker` placed
      before the step it claims to measure inflates the numbers. *(Costs conversions —
      the person will optimise against bad data)*

### 1.4 Order

- [ ] **The opener is easy.** The first screen should be a one-tap question about the
      visitor's own situation. A text box, a form, or a personal question as the first
      screen loses people before they start. *(Costs conversions)*
- [ ] **Qualifying questions come early.** Questions that decide whether this lead is
      worth capturing belong before anything personal. *(Costs conversions)*
- [ ] **Contact details come late.** Rule of thumb: email, phone and name should not
      appear in the first third of the longest route, and never on the first screen
      unless the tree is explicitly a one-step sign-up. *(Costs conversions — the most
      common single cause of a tree that does not convert)*
- [ ] **The visitor sees what they get before they pay for it.** If the tree promises a
      result, quote or recommendation, the contact step should come right before it, not
      several unrelated questions earlier. *(Costs conversions)*

### 1.5 Length and depth

- [ ] **The longest route is reasonable.** Count the screens a visitor actually sees on
      the longest route, leaving out behind-the-scenes nodes. Rule of thumb: up to about
      ten question screens is comfortable; past about fifteen, look hard for questions to
      cut or merge. *(Costs conversions past the upper figure; Worth considering between)*
- [ ] **Branching is not stacked too deep.** Rule of thumb: more than about five
      branching decisions in a row on one route is hard to reason about and hard to test.
      Suggest flattening, or rejoining routes earlier. *(Worth considering; Costs
      conversions if it has already produced a dead end or a missing fallback)*
- [ ] **The tree is a manageable size.** Rule of thumb: past about a hundred nodes, a
      single tree becomes hard for anyone to maintain. Suggest splitting it into separate
      trees by audience or purpose. *(Worth considering)*
- [ ] **Branches earn their place.** Two or three meaningful routes beat many that ask
      almost the same thing. Flag routes that differ only in wording, and duplicated
      closing screens that could be one shared ending. *(Worth considering)*

### 1.6 Redundant and confusing questions

- [ ] **No question is asked twice.** The same information requested on two screens,
      or on a screen and again in a `form`. *(Costs conversions)*
- [ ] **No question is answered by an earlier one.** If a previous answer already
      settles it, a `decision_node` should route on that answer instead. *(Costs
      conversions)*
- [ ] **Options do not overlap.** Choice options with overlapping ranges ("1–5", "5–10")
      or two options that mean the same thing. *(Costs conversions — and corrupts the
      data the lead carries)*
- [ ] **Every question is one question.** "What is your budget and timeline?" on one
      screen with one answer. *(Costs conversions)*

### 1.7 Node type fits the question

Check each input node against the choice guidance the person would get when building:

- [ ] Options visible on one screen, roughly two to ten → `single_choice`; roughly
      eleven or more → `dropdown`. A dozen visible radio buttons is a wall; a dropdown
      with three options hides them for no reason. *(Polish; Costs conversions at the
      extremes)*
- [ ] "Select all that apply" is `multiple_choice`, never `single_choice`. *(Blocks
      visitors — they cannot give their real answer)*
- [ ] A plain yes / no is a `switch` or a two-option `single_choice`, not a text box.
      *(Costs conversions)*
- [ ] A postcode or ZIP is `text`, not `number` — a number drops leading zeros.
      *(Blocks visitors with those codes)*
- [ ] An exact value is `number`; an approximate one is `slider`. *(Polish)*
- [ ] Long free text uses `text_area`; a one-liner uses `text`. *(Polish)*
- [ ] A `form` groups fields that obviously belong together. A `form` used to pack
      unrelated questions onto one screen usually completes worse than separate screens.
      *(Costs conversions)*

### 1.8 Verification and consent

- [ ] **Double opt-in is a setting on the `email` node**, and phone verification a
      setting on the `phone` node — not extra screens. *(Polish if it works; Blocks
      visitors if the extra screens break the route)*
- [ ] **Consent sits on the node that collects the data.** Marketing permission, privacy
      and terms belong on the `email` or `phone` node, not on a separate `switch` or
      screen. *(Costs conversions; flag it to the person as a compliance question too,
      without giving legal advice)*
- [ ] **Consent comes before the lead is sent.** Nothing should push the lead out to
      another system before the consent step on every route. *(Blocks visitors — treat
      as the highest level and tell the person directly)*
- [ ] **Verification does not come too early.** Making someone verify an email or phone
      before any value has been shown costs completions. *(Costs conversions)*

### 1.9 Labelling

- [ ] **Nodes have meaningful titles.** "Node 7" or a duplicated title makes the tree
      hard to maintain and your report hard to read. *(Polish)*
- [ ] **Question wording is clear.** Jargon, double negatives, or a question that only
      makes sense after reading the previous screen. *(Costs conversions)*

---

## Part 2 — Design

Use the tree's styles from `export_decision_tree` and the rendering detail from
`get_dt_design_context` (the same detail as `leadshook://references/dt-rendering`). The
shape of the design payload is in `leadshook://references/dt-design-json-schema`; read
it rather than guessing where a style lives.

You are reading styles, not looking at a live page. Phrase design findings as "will
likely" rather than "does", and offer a preview if the person wants to see a screen.

### 2.1 Consistency

- [ ] **One look across every screen.** Button colour, shape and size; heading size;
      font; spacing. A screen that differs with no reason looks like a different site.
      *(Polish; Costs conversions if it makes a screen look broken or untrustworthy)*
- [ ] **No more than two font families.** Rule of thumb: one for headings and one for
      body, or the same for both. *(Polish)*
- [ ] **A small, steady palette.** One primary colour for the main action, used for the
      main action everywhere. If the "continue" button changes colour between screens,
      visitors hesitate. *(Polish)*

### 2.2 Overrides that fight the tree design

- [ ] **Node-level styling does not undo the tree design.** A node whose own style
      settings override the tree's colours, fonts or button style is the usual cause of
      "it looks right everywhere except on that one screen". Recommend removing the
      override rather than matching it everywhere else. *(Polish; Costs conversions if
      it breaks readability)*
- [ ] **No leftover styling from a copied tree.** Styles aimed at screens or elements
      this tree does not have. Harmless to visitors, confusing to whoever maintains it.
      *(Worth considering)*

### 2.3 Readability and contrast

- [ ] **Text contrast.** Rule of thumb, from the widely used accessibility guideline:
      at least 4.5 to 1 between normal text and its background, and 3 to 1 for large
      text such as headings. Check button text against the button colour as well as
      body text against the page. *(Costs conversions below the line; Blocks visitors if
      the button label or question is close to invisible)*
- [ ] **Text is big enough on a phone.** Rule of thumb: body and option text no smaller
      than about 16px. *(Costs conversions)*
- [ ] **Question screens are short.** A paragraph of explanation above a one-tap
      question buries it. Move long explanation to a `custom_page` or cut it.
      *(Costs conversions)*
- [ ] **Images carry a description** where the content gives them one, so a visitor
      using a screen reader is not left guessing. *(Polish)*

### 2.4 Buttons

- [ ] **The button says what happens.** "See my results", "Get my quote", "Book my
      call" beat "Submit" and "Next", especially on the contact step and the final step.
      *(Polish; Costs conversions on the contact step)*
- [ ] **One obvious main action per screen.** Two equally loud buttons make the visitor
      stop and think. *(Costs conversions)*
- [ ] **Back is quieter than forward.** If there is a back button, it should not look
      like the main action. *(Polish)*

### 2.5 Mobile

- [ ] **Tap targets are big enough.** Rule of thumb: buttons and choice options at least
      about 44px tall, with space between them. *(Costs conversions)*
- [ ] **Option labels are short.** Long labels wrap into tall, uneven buttons on a
      phone. *(Polish)*
- [ ] **The question is above the fold.** A large image or banner pushing the question
      off the first screen on a phone. *(Costs conversions)*
- [ ] **Nothing is fixed to a desktop width.** Fixed widths cause sideways scrolling on
      a phone. *(Costs conversions)*

---

## Part 3 — Things this review cannot see

Say so in the report rather than guessing:

- **Real visitor numbers.** Where people actually drop off is not in the tree. The review
  finds likely causes; the person's own analytics confirm them.
- **What another system does with the lead.** A `webhook` or `api` can be in the right
  place and still fail on the other side.
- **The live page.** Styles and rendering detail predict what a visitor sees; they are
  not a screenshot. Offer a preview, and suggest the person click through the live tree
  on a phone before launch.
