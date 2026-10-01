# Showing a node preview

People decide faster when they can see a screen than when they read a description of
one. Whenever you create, change or restyle a node, offer to show it — and when the
person asks to "see" or "show" a node, always do.

A preview is something you build from the rendering reference. It is never the live
page, so treat it as a close likeness and say so.

---

## 1. Load the rendering reference

Call `get_dt_design_context` before you write any preview markup. Pass `dtId` when the
node belongs to a tree that already exists — the tool then tailors its context to that
tree's real nodes. If you already called it earlier in this conversation, you do not need
to call it again.

The reference it loads (also readable as the resource `leadshook://references/dt-rendering`)
is the only correct source for:

- the page skeleton and the wrappers around a node,
- the markup of each field type and of the buttons,
- the CSS class names a design targets.

Do not invent class names or markup. If the reference does not cover something you need,
leave it out of the preview and tell the person what is missing, rather than guessing.

## 2. Build the preview page

Write one complete, self-contained HTML document:

- Use the page skeleton and node markup from the reference, with the person's real
  content — their heading, labels, placeholders, options, consent wording, button text.
  Never fill a preview with sample text they did not give you.
- Apply the tree's design. For an existing tree, take its styles from
  `export_decision_tree`; for a design you are working on, use the styles you are about
  to save. Put the design's CSS **after** any framework stylesheet or script in the
  document, so the design wins over base rules.
- Load the tree's fonts from the font links the design uses.
- Keep the page itself plain: a white page with the node card near the top, the way a
  visitor sees it. Do not centre the card on a coloured backdrop — that is a mock-up, not
  a preview.

Things that commonly go wrong — check each before you show it:

- [ ] Buttons and headings picked up the design's fonts, not a browser default.
- [ ] Gradients and shadows actually render (a blank header bar usually means a missing
      CSS custom property, not a missing colour).
- [ ] Required fields show their required marker, and consent sits inside the node it
      belongs to, not on a screen of its own.
- [ ] Every piece of text came from the person or from the node's settings.

Some inputs are finished in the visitor's browser by LeadsHook's own scripts — the phone
country picker, date pickers, searchable dropdowns. In a preview they are a static
stand-in. Say so if the person is judging one of those inputs specifically.

## 3. Show it in the client you are running in

Use the best display your client has, in this order:

1. **An inline canvas or artifact.** Claude apps, ChatGPT and several other clients can
   render an HTML document next to the conversation. Use it, so the preview appears
   without the person doing anything.
2. **A file.** If your client cannot render HTML but can write files — a terminal-based
   agent, for example — save the document as a `.html` file in the working directory and
   tell the person the exact path so they can open it in a browser. Writing this local
   file is not "saving" anything to LeadsHook: do it even when the person said not to
   save anything, unless they said not to create files.
3. **Never substitute a text sketch.** An ASCII drawing, or a long HTML document pasted
   into the chat, is not a preview. If you can neither render nor write a file, say so
   and offer the HTML for them to save themselves.

## 4. Say what they are looking at

Under every preview, in one or two lines:

- that it is a preview built from LeadsHook's rendering reference, not the live page;
- anything you left out or approximated, and why;
- the next decision you need from them ("keep this, or make the button full width?").

When the node is saved to a tree, the person can see the real thing in the LeadsHook
editor's preview. Point them there before the tree goes live.
