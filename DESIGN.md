---
version: alpha
name: MyBrain
description: A calm, premium, personal productivity workspace that keeps attention on the next useful action.
colors:
  primary: "#4F806A"
  brand-sage: "#8FAE9A"
  background: "#F7F8F6"
  surface: "#FFFFFF"
  surface-secondary: "#F2F4F2"
  text-primary: "#1F2328"
  text-secondary: "#66716C"
  soft-green: "#EAF3EE"
  soft-blue: "#EAF2F8"
  blue-accent: "#7FAAE0"
  border: "#E4E8E5"
  muted: "#F0F2F1"
  danger: "#C85B5B"
  danger-soft: "#FBECEC"
typography:
  greeting:
    fontFamily: Geist
    fontSize: 2rem
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.035em"
  page-title:
    fontFamily: Geist
    fontSize: 1.875rem
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.03em"
  section-label:
    fontFamily: Geist
    fontSize: 0.75rem
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.14em"
  card-title:
    fontFamily: Geist
    fontSize: 1rem
    fontWeight: 600
    lineHeight: 1.45
    letterSpacing: "-0.01em"
  body:
    fontFamily: Geist
    fontSize: 0.9375rem
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0em"
  metadata:
    fontFamily: Geist
    fontSize: 0.8125rem
    fontWeight: 500
    lineHeight: 1.45
    letterSpacing: "0em"
rounded:
  small: 12px
  control: 14px
  card: 16px
  large-card: 18px
  pill: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 20px
  section: 28px
  page-mobile: 20px
  page-desktop: 40px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: 12px
    height: 44px
  button-primary-hover:
    backgroundColor: "#436F5B"
    textColor: "{colors.surface}"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.control}"
    padding: 12px
    height: 44px
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.card}"
    padding: 16px
  navigation-active:
    backgroundColor: "{colors.soft-green}"
    textColor: "#3F715A"
    rounded: "{rounded.control}"
    padding: 12px
  status-todo:
    backgroundColor: "{colors.muted}"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.pill}"
    padding: 8px
  status-progress:
    backgroundColor: "{colors.soft-blue}"
    textColor: "#456F9F"
    rounded: "{rounded.pill}"
    padding: 8px
  status-complete:
    backgroundColor: "{colors.soft-green}"
    textColor: "#3F715A"
    rounded: "{rounded.pill}"
    padding: 8px
  status-danger:
    backgroundColor: "{colors.danger-soft}"
    textColor: "#9E4444"
    rounded: "{rounded.pill}"
    padding: 8px
  brand-sage-swatch:
    backgroundColor: "{colors.brand-sage}"
  secondary-surface-swatch:
    backgroundColor: "{colors.surface-secondary}"
  focus-swatch:
    backgroundColor: "{colors.blue-accent}"
  border-swatch:
    backgroundColor: "{colors.border}"
  danger-swatch:
    backgroundColor: "{colors.danger}"
---

## Overview

MyBrain is a personal operating surface, not a generic admin dashboard. The interface should feel quiet, responsive, and trustworthy: useful information is easy to scan, important actions are easy to reach, and decoration never competes with the user's work.

The primary surface archetypes are:

- **Dashboard — Monitor:** glanceable daily state with compact tasks, reminders, and quick capture.
- **Tasks — Operate:** efficient task completion, filtering, editing, and status control.
- **Reminders — Monitor:** time-ordered commitments with calm overdue emphasis.
- **More — Configure:** low-noise settings and account navigation.
- **Chat — Command:** a focused foundation for a future assistant without implementing AI yet.

MyBrain draws principles—not layouts—from Superlist, Sunsama, Reflect, Linear, and Notion Calendar. Its sage-led palette, compact cards, and brain mark create an original identity.

## Colors

- **Background (`#F7F8F6`)** is the warm neutral application canvas.
- **Surface (`#FFFFFF`)** contains interactive content and cards.
- **Secondary surface (`#F2F4F2`)** groups quiet controls and disabled placeholders.
- **Primary text (`#1F2328`)** is used for headings and important content.
- **Secondary text (`#66716C`)** is used for descriptions and metadata.
- **Primary sage (`#8FAE9A`)** supports subtle brand details.
- **Strong green (`#4F806A`)** is reserved for primary actions, selected navigation, completion, and confirmation.
- **Soft green (`#EAF3EE`)** is a low-emphasis success and selection surface.
- **Soft blue (`#EAF2F8`)** and **blue accent (`#7FAAE0`)** identify informational and In Progress states.
- **Danger (`#C85B5B`)** and **danger soft (`#FBECEC`)** are limited to destructive actions, errors, and overdue status.
- **Border (`#E4E8E5`)** is a whisper line. Avoid stacking multiple borders in one region.

Color must not be the only signal; icons, text labels, and semantic structure must communicate state too.

## Typography

Geist remains the product font because it is already integrated through `next/font`, has a precise modern UI voice, and avoids adding another asset or runtime dependency. Inter is the fallback direction if the typography system is changed later.

- Greeting: 26–32px, semibold, tight tracking.
- Page title: 28–30px, semibold, tight tracking.
- Section labels: 11–13px, uppercase, semibold, subtle tracking.
- Card titles: 15–17px, semibold.
- Body: 14–16px with relaxed line height.
- Metadata: 12–13px, medium weight.
- Avoid display-size headlines inside authenticated product screens.

## Layout

- Mobile is primary: 20px horizontal page padding, reduced to 16px only below 360px.
- Major section spacing is 24–32px; related controls use 8–14px gaps.
- Desktop uses a 240px fixed sidebar and a centered content column with a 960px maximum width.
- Dense operating surfaces may use the full content column; reading text remains narrower.
- Cards use 16–20px padding. Empty states stay compact and should never create giant vacant containers.
- The bottom navigation reserves 68px plus the device safe area. Page content always includes sufficient bottom padding.

## Elevation & Depth

Most surfaces are flat white with a `#E4E8E5` border. Use a single subtle shadow only where separation from the canvas is otherwise unclear:

- Standard card: `0 1px 2px rgba(31,35,40,0.025), 0 8px 24px rgba(31,35,40,0.035)`.
- Modal/sheet: `0 24px 64px rgba(31,35,40,0.14)`.
- Bottom navigation: a faint upward shadow below 6% opacity.

Avoid heavy floating cards, glow, glassmorphism, and gradients.

## Shapes

- Main cards: 16–18px.
- Inputs and buttons: 12–14px.
- Small cards and icon wells: 12–14px.
- Status and filter badges: full pill.
- Circular shapes are reserved for avatars, completion controls, and status dots.

## Components

- **AppShell:** warm canvas, fixed desktop sidebar, compact mobile header, centered content.
- **BrandMark:** Lucide Brain icon in a soft green tile with the MyBrain wordmark.
- **BottomNavigation:** five 44px-minimum touch targets, label beneath icon, exactly one active section.
- **PageHeader:** title, concise description, optional eyebrow and action; never a hero.
- **SectionHeader:** uppercase label with optional quiet action.
- **Card:** white, one whisper border, minimal elevation.
- **TaskCard:** compact row hierarchy; completion is the first affordance, edit/delete remain quiet.
- **ReminderCard:** bell or time icon, task title, date/time, and a labeled upcoming/overdue state.
- **StatusBadge:** neutral Todo, blue In Progress, green Done, soft red Overdue.
- **QuickAdd:** one-line capture control with a trailing primary action.
- **SettingsRow:** icon, title, description, optional state, and chevron; 44px-minimum target.
- **NotesNavigationCard:** document/voice icon, concise description, and directional affordance.
- **EmptyState:** compact, informative, and action-oriented when an immediate next step exists.

Interactive transitions last 150–220ms and affect color, opacity, border, or a maximum 1px translation. Disable non-essential motion when `prefers-reduced-motion` is set.

## Do's and Don'ts

### Do

- Prioritize the next action and the current state.
- Keep task and reminder rows compact and individually scannable.
- Use green for primary/positive states and blue for information/In Progress.
- Maintain visible focus rings and 44px important touch targets.
- Use semantic labels in addition to color.
- Keep authentication and data behavior separate from visual components.

### Don't

- Do not turn product pages into marketing heroes or metric dashboards.
- Do not wrap short lists inside oversized empty panels.
- Do not add fake data, decorative statistics, or non-functional complexity.
- Do not use gradients, neon, repeated icon-topper tiles, or strong shadows.
- Do not hide essential actions behind hover-only interactions.
- Do not add visual changes that alter Supabase, authentication, RLS, task, or reminder behavior.

## Mobile Behavior

- The mobile header remains compact and sticky.
- Bottom navigation is fixed, safe-area aware, 64–72px tall before the safe area, and never overlaps content.
- Horizontal filter rows may scroll, but the page itself must not overflow horizontally.
- Form sheets open from the bottom, keep labels visible, and use full-width primary actions on small screens.
- Date/time controls remain at least 44px tall and collapse to one column below narrow mobile widths when needed.

## Desktop Behavior

- The sidebar is 240px wide with the brand at top and account/logout at bottom.
- Active navigation uses a soft green fill and strong green text.
- Main content is centered and capped at 960px to avoid excessive line length.
- Cards may gain a subtle border-color change on hover, but actions cannot depend on hover.

## Navigation Rules

- Home is active only for `/protected`.
- Tasks owns `/protected/tasks` and descendants.
- Chat owns `/protected/chat` and descendants.
- Notes owns Notes, Documents, and Voice Notes routes.
- More owns More, Reminders, Account, and future settings routes.
- Exactly one primary destination may appear active at a time.

## Status Colors

- Todo: muted neutral surface with secondary text.
- In Progress: soft blue surface with a darker blue label.
- Done: soft green surface with strong green label.
- Upcoming: soft green or soft blue depending on context, always with text.
- Overdue/error: soft red surface with dark red text; never a large aggressive red block.

## Future AI and Voice Direction

Future AI features should feel like an extension of the personal workspace, not a separate chatbot product. Chat uses a focused message column, restrained assistant blue, and a grounded composer. Voice controls remain secondary affordances inside the composer. Documents, extracted content, and summaries should reuse the same cards, metadata, status, and navigation rules. No pulsing orb, neon assistant gradient, or theatrical AI animation should be introduced.
