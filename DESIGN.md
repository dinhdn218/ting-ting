---
name: Ting Ting
description: The group chat that keeps the math — a shared expense ledger told as a chat thread.
colors:
  mine: "oklch(0.215 0.012 260)"
  on-mine: "oklch(0.975 0.004 250)"
  on-mine-2: "oklch(0.80 0.008 250)"
  pin: "oklch(0.894 0.157 91)"
  pin-2: "oklch(0.80 0.15 85)"
  on-pin: "oklch(0.205 0.012 260)"
  on-pin-2: "oklch(0.36 0.04 80)"
  owe: "oklch(0.535 0.175 28)"
  owe-wash: "oklch(0.955 0.028 28)"
  paid: "oklch(0.515 0.125 152)"
  paid-wash: "oklch(0.952 0.035 152)"
  wall: "oklch(0.952 0.006 250)"
  wall-2: "oklch(0.918 0.008 250)"
  panel: "oklch(0.985 0.003 250)"
  bubble: "oklch(1 0 0)"
  ink: "oklch(0.205 0.012 260)"
  ink-2: "oklch(0.43 0.014 260)"
  ink-3: "oklch(0.515 0.014 260)"
  line: "oklch(0.895 0.008 250)"
  line-strong: "oklch(0.80 0.010 250)"
  qr: "oklch(1 0 0)"
typography:
  hero:
    fontFamily: "Be Vietnam Pro, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.01em"
    fontFeature: "tnum"
  fig:
    fontFamily: "Be Vietnam Pro, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.01em"
    fontFeature: "tnum"
  head:
    fontFamily: "Be Vietnam Pro, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.3
  row:
    fontFamily: "Be Vietnam Pro, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 600
    lineHeight: 1.35
  body:
    fontFamily: "Be Vietnam Pro, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.5
  small:
    fontFamily: "Be Vietnam Pro, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.4
  meta:
    fontFamily: "Be Vietnam Pro, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.35
rounded:
  tail: "6px"
  mark: "10px"
  ctl: "12px"
  inset: "16px"
  bubble: "18px"
  sheet: "20px"
  pill: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  section: "32px"
components:
  button-primary:
    backgroundColor: "{colors.mine}"
    textColor: "{colors.on-mine}"
    typography: "{typography.body}"
    rounded: "{rounded.ctl}"
    padding: "0 20px"
    height: "48px"
  button-outline:
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.ctl}"
    padding: "0 20px"
    height: "48px"
  button-outline-hover:
    backgroundColor: "{colors.wall-2}"
  button-danger:
    textColor: "{colors.owe}"
    typography: "{typography.body}"
    rounded: "{rounded.ctl}"
    padding: "0 20px"
    height: "44px"
  button-danger-hover:
    backgroundColor: "{colors.owe-wash}"
  button-pin:
    backgroundColor: "{colors.on-pin}"
    textColor: "{colors.pin}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: "0 16px"
    height: "44px"
  icon-button:
    textColor: "{colors.ink-2}"
    rounded: "{rounded.pill}"
    size: "44px"
  icon-button-hover:
    backgroundColor: "{colors.wall-2}"
    textColor: "{colors.ink}"
  chip:
    backgroundColor: "{colors.bubble}"
    textColor: "{colors.ink-2}"
    typography: "{typography.small}"
    rounded: "{rounded.pill}"
    padding: "0 14px"
    height: "44px"
  chip-active:
    backgroundColor: "{colors.mine}"
    textColor: "{colors.on-mine}"
  field:
    backgroundColor: "{colors.bubble}"
    textColor: "{colors.ink}"
    rounded: "{rounded.ctl}"
    padding: "12px 16px"
  search-field:
    backgroundColor: "{colors.wall-2}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: "0 4px 0 14px"
    height: "44px"
  bubble-incoming:
    backgroundColor: "{colors.bubble}"
    textColor: "{colors.ink}"
    rounded: "{rounded.bubble}"
    padding: "12px 14px 10px"
  bubble-mine:
    backgroundColor: "{colors.mine}"
    textColor: "{colors.on-mine}"
    rounded: "{rounded.bubble}"
    padding: "12px 14px 10px"
  my-share-owed:
    backgroundColor: "{colors.owe-wash}"
    textColor: "{colors.owe}"
    typography: "{typography.small}"
    rounded: "{rounded.ctl}"
    padding: "8px 10px"
  my-share-paid:
    backgroundColor: "{colors.paid-wash}"
    textColor: "{colors.paid}"
    typography: "{typography.small}"
    rounded: "{rounded.ctl}"
    padding: "8px 10px"
  pinned-bar:
    backgroundColor: "{colors.pin}"
    textColor: "{colors.on-pin}"
    padding: "10px 16px 12px"
  paid-mark-paid:
    backgroundColor: "{colors.paid-wash}"
    textColor: "{colors.paid}"
    typography: "{typography.small}"
    rounded: "{rounded.pill}"
    padding: "0 12px"
    height: "32px"
  paid-mark-unpaid:
    textColor: "{colors.owe}"
    typography: "{typography.small}"
    rounded: "{rounded.pill}"
    padding: "0 12px"
    height: "32px"
  date-chip:
    backgroundColor: "{colors.wall-2}"
    textColor: "{colors.ink-2}"
    typography: "{typography.meta}"
    rounded: "{rounded.pill}"
    padding: "4px 12px"
  composer:
    backgroundColor: "{colors.bubble}"
    textColor: "{colors.ink-3}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: "0 6px 0 16px"
    height: "48px"
  category-mark:
    backgroundColor: "{colors.wall-2}"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.mark}"
    size: "36px"
  avatar-me:
    backgroundColor: "{colors.pin}"
    textColor: "{colors.on-pin}"
    rounded: "{rounded.pill}"
    size: "40px"
  avatar-payer:
    backgroundColor: "{colors.mine}"
    textColor: "{colors.on-mine}"
    rounded: "{rounded.pill}"
    size: "40px"
  avatar-default:
    backgroundColor: "{colors.wall-2}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    size: "40px"
  sheet:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sheet}"
    padding: "0 20px 24px"
---

# Design System: Ting Ting

## Overview

**Creative North Star: "The Group Chat That Keeps the Math"**

Ting Ting is the group's own chat thread, one that happens to keep the books. Every expense is a bill message sent by the person who fronted the money, and whoever has paid shows up as a ✓ in a row of initials, the way read receipts do in a messenger. The wallpaper is a cool grey, other people's messages are white bubbles, your own are solid ink, and the one thing that is about you right now, your number, is pinned in flat yellow above the thread.

The system is dense and operational, built for a thirty-second visit on a phone: one typeface with hierarchy carried by size and weight, tabular figures wherever money appears, lucide line icons, and color spent almost entirely on meaning (ink is you, yellow is your pin, brick red is still owed, leaf green is paid). Surfaces are flat tonal layers; the only depth is a hair of contact shadow under bubbles and the lift of a sheet.

It rejects the fintech balance card and the generic list-of-rows genre, and it fully replaces the earlier paper-ledger look of receipt paper and stamps. Nothing is decorated or celebrated; the only ordering by amount is Còn nợ, largest first, to show what still needs collecting. Motion exists only to report that a number or a status just changed.

**Key Characteristics:**
- Chat-thread grammar: date chips, bill bubbles with a sender-side tail corner, a monthly summary posted as a system message, a docked composer.
- Cool grey wallpaper, white bubbles for others, ink bubbles for you, one flat yellow pin.
- One face (Be Vietnam Pro), seven fixed rem sizes, tabular money.
- Status is always triple-coded: word, icon, solid fill vs dashed outline.
- Flat tonal depth with exactly two shadows.
- Motion is state only: digits roll, ✓ pops.
- Light and dark palettes mirror every role and both meet WCAG AA.

## Colors

A near-monochrome cool-slate chat world where hue is reserved for meaning: ink for you, yellow for your pin, brick red for owed, leaf green for paid. The frontmatter carries the light palette; the `.dark` block in `app/globals.css` redefines every role (wall darkest, bubble lightest, ink bubbles invert to near-white).

### Primary
- **Group-Chat Ink** (`mine`, oklch(0.215 0.012 260)): the fill of your own bill bubbles (right-aligned, tail bottom-right) and of the single primary action in a view: Pay, Save, the composer's send disc, an active filter chip. In dark mode it becomes a near-white bubble with dark text (oklch(0.93 0.006 250)), so "yours" stays the highest-contrast object on screen.
- **On-Ink Paper** (`on-mine`) and **On-Ink Muted** (`on-mine-2`): text, meta lines and 15% hairlines inside ink surfaces.

### Secondary
- **Pinned-Note Yellow** (`pin`, oklch(0.894 0.157 91), ≈ #FFD84D): the pinned bar that states your number, your avatar, the "bạn" tag, and text selection. **Pin Rule Gold** (`pin-2`) is the border and progress track inside the pin; **Pin Ink** (`on-pin`) and **Pin Brown** (`on-pin-2`, AA 7:1) are its text. The pinned bar's own action inverts it: Pin Ink fill, yellow text.

### Tertiary (status)
- **Unpaid Brick** (`owe`, AA 5.3:1) on **Owed Blush** (`owe-wash`): amounts still owed, "Chưa trả", the "Phần của bạn · chưa trả" strip, the destructive action, the offline dot.
- **Settled Leaf** (`paid`, AA 5.2:1) on **Settled Mint** (`paid-wash`): "Đã trả", ✓ badges on initials, progress fills, "Xong", the live dot.

### Neutral
- **Cool Chat Wallpaper** (`wall`): the thread background and page body.
- **Date-Chip Grey** (`wall-2`): date chips, the search pill, category mark tiles, hover and pressed fills, the unfilled part of a member's progress.
- **Side-Panel Paper** (`panel`): chat header, members column, sheets, composer dock, the month-summary message.
- **Incoming Bubble White** (`bubble`): other people's bill bubbles, form fields, chips at rest.
- **Message Ink** (`ink`): primary text, the global focus outline, the active tab underline.
- **Secondary Slate** (`ink-2`, AA 8:1): supporting sentences, icon buttons at rest, category bars.
- **Timestamp Slate** (`ink-3`, AA 4.6:1): meta text at 12px and up, placeholders, inactive tabs.
- **Hairline** (`line`) and **Divider Steel** (`line-strong`): borders, dividers, dashed unpaid outlines, the outline button's stroke, scrollbar thumb.
- **Scanner White** (`qr`): a fixed white behind QR images in both themes, so bank apps can always scan them.

### Named Rules
**The One Source Rule.** Colors are written only in `app/globals.css`, in OKLCH, with a `.dark` twin for every role. Components consume the generated utilities (`bg-wall`, `bg-mine`, `text-owe`, `border-line`…) and never contain a hex or `oklch()` literal.

**The Ink Is Yours Rule.** Ink (`mine`) means you: your own bill bubbles and the one primary action in a view (Pay, Save, the composer's send disc, an active chip). It is never a decorative band, a second primary or a header fill.

**The Yellow Means Me Rule.** Yellow belongs to the pin: the pinned bar with your number, your avatar, the "bạn" tag and text selection. Its one sanctioned echo is the "Gần xong" phase chip, which repeats the phase printed in the pinned bar. Nothing else is yellow.

**The Never Color-Only Rule.** Paid and owed always carry three layers: a word ("Đã trả" / "Chưa trả"), an icon (check vs dashed circle), and a shape (solid wash fill vs dashed outline). Red and green never carry status alone, in either theme.

## Typography

**Display Font:** Be Vietnam Pro (with ui-sans-serif, system-ui, sans-serif)
**Body Font:** Be Vietnam Pro (same stack)

Loaded through `next/font` with Vietnamese and Latin subsets at weights 400, 500, 600 and 700.

**Character:** A single round, Vietnamese-native grotesque that reads like a messaging app, not a document. Its diacritics are drawn in rather than stacked on, which matters in an interface where every label is Vietnamese.

### Hierarchy
Seven fixed rem steps, ratio about 1.2, no fluid sizing.
- **Hero** (700, 2.25rem / 36px, 1.1, tabular): your amount inside the Pay sheet. Together with the pinned figure, the only 700-weight text.
- **Fig** (600, 1.75rem / 28px, 1.15, tabular): the lead amount in a sheet: a bill total, a person's debt, the amount being entered.
- **Head** (600, 1.25rem / 20px, 1.3): sheet, dialog and panel titles ("Cả nhóm", "Trả cho Minh", "Ghi khoản mới").
- **Row** (600, or 500 in member rows; 1.0625rem / 17px, 1.35): bill titles, person names, bubble totals, the group name, section headings in the members panel.
- **Body** (400, 0.9375rem / 15px, 1.5): sentences and descriptions; buttons and tabs use it at 600.
- **Small** (500, 0.8125rem / 13px, 1.4): a bubble's meta line, chips, status marks, progress labels.
- **Meta** (500, 0.75rem / 12px, 1.35): timestamps, date chips, the pinned bar's group line.

Initials inside avatars and receipt chips drop to 10–11px semibold. That is an avatar dimension, not a text step.

### Named Rules
**The One Face Rule.** Be Vietnam Pro for everything; hierarchy is size and weight only (400/500/600, with 700 reserved for the amount you have to pay). No second family, no display face, no mono, no italic emphasis.

**The Tabular Money Rule.** Every amount renders through `Money` or `.tnum` (tabular-nums, −0.01em tracking) and is formatted vi-VN ("607.333đ"), so money columns align and a rolling digit never nudges its neighbours.

## Layout

The app is one full-height column (100dvh): the chat header, the pinned bar, a scrolling region, and the composer docked at the bottom with safe-area padding. On phones the scrolling region is one of two tabs (Trò chuyện | Thành viên). From 1024px the tabs disappear and the region splits into a members column on panel (380px, 420px from 1280px) beside the thread on the wallpaper; at the same breakpoint sheets move from the bottom edge to a 440px right side sheet.

Measures: the app runs full width; on phones the thread, pinned-bar and composer content center at a maximum of 720px, and from 1024px they center at a maximum of 1280px beside the 380px members column, with the thread split into bills (left) and a sticky 300–320px month-summary column (right); a bill bubble is at most min(88%, 520px); on phones the month summary sits right-aligned at 88% width; the members panel reads at a maximum of 640px. Gutters are 12px on phones and 16px from 640px; sheets use 20px. Rhythm: 12px between bubbles, 8px above each date chip, 32px between members-panel sections, 12px vertical padding in member rows (minimum row height 64px). Density is chat-tight: bubbles hold a lot of information in small, well-aligned type instead of spreading into whitespace. Every control keeps a 44px minimum touch target, enforced globally on buttons.

### Named Rules
**The No Sideways Scroll Rule.** The page never scrolls horizontally. Only chip rows (the name picker, the filters) scroll on x, edge to edge, with the scrollbar hidden.

## Elevation & Depth

Flat tonal layering. Depth reads through lightness steps (wall → panel → bubble in light; reversed in dark, where the bubble is the lightest surface) and 1px hairlines. Shadows are used in exactly two places, both tokenized as custom properties with a stronger dark-mode value.

### Shadow Vocabulary
- **Bubble contact** (`box-shadow: 0 1px 2px oklch(0.2 0.02 260 / 0.08)`; dark `0 1px 2px oklch(0.05 0.01 260 / 0.4)`): under every bill bubble, lifting it off the wallpaper by a hair.
- **Sheet lift** (`box-shadow: 0 -12px 40px oklch(0.2 0.02 260 / 0.14)`; dark `0 -12px 40px oklch(0.05 0.01 260 / 0.55)`): bottom sheets and side sheets only.

### Named Rules
**The Contact-Shadow Rule.** Exactly two shadows exist: the bubble contact shadow and the sheet lift. Panels, chips, the pinned bar, the composer and the month summary are flat; separation comes from tone steps and 1px hairlines. No glows, blurs or hard offset shadows.

## Shapes

Soft, chat-native geometry where the radius grows with the size of the object: a 6px tail corner, 10px category tiles, 12px controls and fields, 16px inset frames (the QR frame, the preview box inside the new-bill sheet), 18px bubbles, 20px sheets and dialogs. Everything that stands for a person is a circle (avatars, initials chips, ✓ badges), and thread chrome is pill-shaped: chips, the search field, the composer, date chips, the pinned bar's action, phase chips. Borders are 1px. Progress bars are 4–8px pills split by a 2px gap between the paid and unpaid parts; category bars have a 2px start and a 4px end.

### Named Rules
**The Tail Corner Rule.** A bill bubble has one 6px corner, bottom and on the sender's side (bottom-left for others, bottom-right for you); its other corners are 18px. No other component gets an asymmetric corner.

**The Dashed Means Not-Yet Rule.** A 1px dashed outline means "not yet": unpaid initials, the "Chưa trả" mark, the empty QR slot. Never use dashes as decoration.

## Components

Messenger-plain and thumb-sized: everything is a bubble, a pill or a row, and nothing you can tap is smaller than 44px.

### Buttons
- **Shape:** gently rounded rectangle (12px) for sheet and dock actions; a full pill when the button sits in thread chrome (the pinned bar's Pay, the empty-state and clear-filter actions).
- **Primary:** Group-Chat Ink fill, On-Ink Paper text, 15px semibold, 48px tall, 20px side padding, icon gap 8px. One per view.
- **Hover / Focus:** hover drops opacity to 90%; focus-visible is the global 2px ink outline at 2px offset; disabled is 40% opacity with a not-allowed cursor.
- **Outline:** 1px Divider Steel stroke, transparent fill, ink text at 500; hover fills Date-Chip Grey. Used for secondary routes (View QR when the pin already offers Pay, admin login).
- **Danger:** 1px Unpaid Brick stroke and text, 44px; hover fills Owed Blush. Used only for delete, and always behind a confirm dialog.
- **Icon button:** 44px circle, 20px icon in Secondary Slate; hover and pressed fill Date-Chip Grey and turn the icon ink.
- **Pin action:** Pin Ink fill with yellow text, 44px pill. It is the only button that sits on yellow.

### Chips
- **Style:** pill, 44px tall, 14px side padding, 13px medium; at rest Incoming Bubble White with a 1px Hairline and Secondary Slate text, counts in Timestamp Slate tabular.
- **State:** active (`aria-pressed`) fills ink with On-Ink text and ink border; hover at rest strengthens the border and text. Status and category filters share one horizontally scrolling row split by a 1px divider; the date filter is a chip wrapping a native date input.
- **Phase chips:** 32px pills with an icon that name the group's phase: "Còn nợ" on Owed Blush, "Gần xong" on yellow, "Xong hết" on Settled Mint.

### Cards / Containers
- **Corner Style:** bubbles 18px with the tail corner; month summary 18px on all four corners; sheets 20px on the top edge (mobile).
- **Background:** bill bubbles on Incoming Bubble White or ink; the month summary is a system message on Side-Panel Paper; sheets on Side-Panel Paper.
- **Shadow Strategy:** bubble contact under bill bubbles, sheet lift under sheets, nothing else (see Elevation & Depth).
- **Border:** none on bubbles; hairlines divide inside them and around sheet footers.
- **Internal Padding:** bubbles 12px top, 14px sides, 10px bottom; month summary 16px; sheets 20px sides with a sticky footer.

### Inputs / Fields
- **Style:** sheet fields are Incoming Bubble White with a 1px Hairline, 12px radius, 12px × 16px padding. The thread search is a Date-Chip Grey pill, 44px, with a Timestamp Slate search icon.
- **Focus:** a sheet field's border shifts to ink; the search pill takes a 2px ink ring. No glow.
- **Placeholder / Date:** placeholders in Timestamp Slate at full opacity; date inputs follow the active color scheme.

### Navigation
- **Chat header:** Side-Panel Paper, 64px row. A stacked group avatar (the payer in ink and you in yellow, 26px each, overlapping in one corner), the group name at 17px semibold, and a 13px status line that leads with a live dot and the word for it ("Trực tiếp" in the neutral line, "Mất kết nối" in Unpaid Brick), then three icon buttons.
- **Mobile tabs:** two equal columns, 44px, 15px semibold. Active is ink text over a 3px × 48px ink underline with rounded top; inactive is Timestamp Slate. A tabular count follows "Thành viên". Hidden from 1024px, where both columns show.
- **Composer dock:** bottom edge, Side-Panel Paper with a hairline on top. The admin sees a 48px pill "Ghi khoản mới…" with an ink send disc; a member who owes sees a full-width primary Pay carrying the exact amount; everyone else sees an outline action.

### Bill Bubble
The signature component. The payer's avatar sits beside other people's bubbles (kept invisible on follow-ups so they stay aligned), with a "Minh đã ứng" sender line on the first bubble of a day. Your own bills flip to the right in ink. Hover dims brightness to 97%.

**The Fixed Label Grid Rule.** Every bill bubble fills the same slots in the same order: category tile · title with category and split · total; a hairline; initials with ✓ badges · progress · time; then "Phần của bạn" when you take part. Add information by filling a slot, never by adding a new layout.

Initials chips are 28px circles that overlap by 4px, up to seven plus a "+n" chip: paid means a Settled Mint fill with a Settled Leaf ✓ badge, unpaid means a dashed Divider Steel outline. The progress reads "1/2 đã trả" with a check, or "Đã thu đủ" with a double check once everyone has paid.

### Pinned Bar
A flat Pinned-Note Yellow band under the header with a Pin Rule Gold bottom border. One line of context with a pin icon ("Bạn còn nợ Minh · 3 khoản"), your figure at 22px bold with the digit roll, the Pay action on the right, and under it a 12px group line: phase name, a 6px progress track, "đã thu 72%". Before you have picked a name, it asks "Bạn là ai trong nhóm?" and offers the roster as a scrolling row of Pin Ink pills.

### Paid Mark
The status primitive. "Đã trả" is a Settled Mint pill with a check; "Chưa trả" is a transparent pill with a dashed 70% Unpaid Brick outline and a dashed-circle icon. The read-only form is 32px tall; the admin form is a 44px × 108px toggle button (`aria-pressed`) whose dashed outline turns solid on hover.

### Members Panel and Category Bars
A group summary (one sentence, one paid/unpaid bar, a phase chip, a count line), then three groups of 64px member rows: avatar, name (with a yellow "bạn" tag for you), a count line, a small progress bar with "đã trả n%", and the amount on the right (owed in Unpaid Brick with a minus sign, the payer's receivable in Settled Leaf with a plus sign, settled members as a double check and "Xong"). Category spending is drawn as bars sorted by amount, all in Secondary Slate, each labelled directly with icon · name · count · amount · %.

**The Ledger-Not-Leaderboard Rule.** Members are grouped by state (Còn nợ, Đã trả xong, Người ứng tiền). Còn nợ is sorted by amount owed, largest first, so the biggest collection is visible at once (the user's call, 15/9/2026); ties fall back to name. Never badge the biggest debtor, number the rows, or add medals and streaks.

### Sheets and Motion
**The One Overlay Rule.** Every detail opens in `SheetShell`: a bottom sheet on mobile, a 440px right side sheet at ≥1024px. `AlertDialog` is only for confirming a destructive or bulk action.

Mobile sheets carry a 40 × 4px grab handle, a head-sized title with a 44px close button, and a sticky footer for actions.

**The State-Only Motion Rule.** Two animations exist: the digit roll (420ms, cubic-bezier(0.3, 1.25, 0.5, 1), overshooting by one step and settling) on headline amounts when realtime data changes, and the tick pop (220ms, scale 0.4 → 1.18 → 1) on a ✓ badge that just turned paid. Progress widths ease over 500ms and hovers take 150ms. Nothing enters, fades or loops for decoration; `prefers-reduced-motion` collapses all of it and `Money` renders static text.

## Do's and Don'ts

### Do:
- **Do** write every new color as an OKLCH token in `app/globals.css` with its `.dark` twin, and use it through the generated utilities.
- **Do** render every amount through `Money` (tabular, vi-VN, e.g. 607.333đ); pass `animate` only to the one headline figure of a view.
- **Do** mark paid/owed with `PaidMark` or the same three layers: word, check vs dashed-circle icon, wash fill vs dashed outline.
- **Do** keep every tap target at least 44px (primary buttons 48px) and keep the 2px ink focus outline.
- **Do** use lucide icons only: category marks at 1.75 stroke, UI icons at the default 2, heavier strokes only on the tiny ✓ badges so they survive at 10px.
- **Do** chart category data as single-hue `ink-2` bars sorted by amount, labelled directly with name · count · amount · %, with text in text colors.
- **Do** write interface copy in Vietnamese, short and friendly, the way friends text each other.
- **Do** check both palettes: every pairing meets WCAG AA in light and in dark.

### Don't:
- **Don't** add a second typeface, a display face or a system display font; hierarchy is size and weight.
- **Don't** put eyebrow or kicker labels above headings; a heading stands alone and a count follows a middot ("Còn nợ · 9").
- **Don't** build a hero-metric block or a fintech balance card; your number lives in the pinned bar and in sheets.
- **Don't** medal, number or spotlight debtors. Ordering Còn nợ by amount owed is the only ranking the system allows.
- **Don't** use emoji or text glyphs as icons.
- **Don't** use yellow for anything that is not the pin or "me", or ink for anything that is not yours or the primary action.
- **Don't** use a multi-hue categorical palette, or color a label with its bar's color.
- **Don't** add decorative motion: numbers roll instead of fading, and nothing enters with choreography.
- **Don't** bring back the old paper-ledger devices (receipt paper, stamps) or add shadows beyond the two in Elevation & Depth.
- **Don't** write hex or `oklch()` in JSX.
