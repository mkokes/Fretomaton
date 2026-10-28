# Kokes Projects Styleguide

> Written for AI coding agents and the developers working with them. Every value below is a
> design token: **reference the token, never the raw value.** If you need something this guide
> doesn't cover, use the closest token and flag the gap instead of inventing a new value.

## Overview

The shared visual system for Kokes Projects: small web apps, developer tools and personal sites. Neon lime on charcoal and white, set in Poppins and Inter.

**Audience:** Developers and tech-savvy people using small web apps, tools and side projects.  
**Personality:** Bold, Techy, Confident, Direct

## Voice and tone

Direct, concise and developer-friendly. Lead with the point, use technical terms when they are the most precise word, and put code in monospace. Dry humor is welcome in empty states and 404 pages, never in errors.

**Do**

- Lead with the point and keep sentences short
- Use technical terms when they are the most precise word
- Format code, commands, keys and file names in monospace
- Say what went wrong and how to fix it in error messages

**Don't**

- Use marketing hype or superlatives
- Use exclamation marks
- Joke in error messages or destructive confirmations
- Over-explain basics to a technical audience

## Using these tokens

| File           | Purpose                                                                           |
| -------------- | --------------------------------------------------------------------------------- |
| `tokens.css`   | CSS custom properties, with dark-mode overrides. Import once, globally.           |
| `tailwind.css` | Tailwind v4 CSS entry (`@theme`). Use instead of tokens.css in Tailwind projects. |
| `tokens.json`  | W3C Design Tokens (DTCG) for Style Dictionary, Figma plugins and other tools.     |

- Style with CSS custom properties (`var(--color-primary)`, `var(--space-4)`, `var(--radius-md)`) or the matching Tailwind utilities listed in each table.
- Never hardcode a hex code, px size, font name, shadow or easing that a token already represents.
- Use **role** colors (`--color-bg`, `--color-text`, `--color-link`...) for UI. They switch automatically in dark mode. Use raw palette steps only for illustrations, charts and one-off accents.
- Dark mode is driven by `data-theme="dark"` on `<html>`, falling back to the OS preference unless `data-theme="light"` is set.

## Color

### Semantic roles

| Role        | Use for                                                                              | Light                 | Dark                  | CSS variable              | Tailwind       |
| ----------- | ------------------------------------------------------------------------------------ | --------------------- | --------------------- | ------------------------- | -------------- |
| `bg`        | Page background                                                                      | white                 | `--color-neutral-950` | `var(--color-bg)`         | `*-bg`         |
| `surface`   | Cards, panels, menus and other raised areas                                          | `--color-neutral-50`  | `--color-neutral-900` | `var(--color-surface)`    | `*-surface`    |
| `text`      | Body text and headings                                                               | `--color-neutral-950` | `--color-neutral-50`  | `var(--color-text)`       | `*-text`       |
| `textMuted` | Secondary text, captions, placeholders                                               | `--color-neutral-600` | `--color-neutral-300` | `var(--color-text-muted)` | `*-text-muted` |
| `border`    | Dividers and input/card borders                                                      | `--color-neutral-200` | `--color-neutral-800` | `var(--color-border)`     | `*-border`     |
| `primary`   | Fill for primary actions and selected states                                         | `--color-primary-100` | `--color-primary-100` | `var(--color-primary)`    | `*-primary`    |
| `onPrimary` | Text and icons placed on a primary fill                                              | `--color-neutral-950` | `--color-neutral-950` | `var(--color-on-primary)` | `*-on-primary` |
| `link`      | Links, focus rings, current nav item, brand-colored text and icons on the background | `--color-primary-700` | `--color-primary-100` | `var(--color-link)`       | `*-link`       |
| `success`   | Success messages and icons                                                           | `--color-success-700` | `--color-success-400` | `var(--color-success)`    | `*-success`    |
| `warning`   | Warning messages and icons                                                           | `--color-warning-700` | `--color-warning-400` | `var(--color-warning)`    | `*-warning`    |
| `danger`    | Errors, destructive actions                                                          | `--color-danger-600`  | `--color-danger-400`  | `var(--color-danger)`     | `*-danger`     |
| `info`      | Informational messages and icons                                                     | `--color-info-700`    | `--color-info-400`    | `var(--color-info)`       | `*-info`       |

### Palette

Each color has an 11-step scale. Token: `--color-<name>-<step>`, Tailwind `*-<name>-<step>`.

| Step | primary   | secondary | accent    | neutral   | success   | warning   | danger    | info      |
| ---- | --------- | --------- | --------- | --------- | --------- | --------- | --------- | --------- |
| 50   | `#ecffd5` | `#f7f7f7` | `#ecffd5` | `#f7f7f7` | `#e8feeb` | `#fff5ed` | `#fff4f2` | `#f3f7ff` |
| 100  | `#baff39` | `#ebebeb` | `#baff39` | `#ebebeb` | `#d2f6d7` | `#ffe6d4` | `#ffe4e0` | `#e1ecff` |
| 200  | `#b0f22f` | `#d9d9d9` | `#b0f22f` | `#d9d9d9` | `#b3e9bb` | `#ffcea9` | `#ffcbc4` | `#c6daff` |
| 300  | `#9ad816` | `#c1c1c1` | `#9ad816` | `#c1c1c1` | `#8bd699` | `#f7af76` | `#ffa69b` | `#a0c1ff` |
| 400  | `#80b500` | `#a1a1a1` | `#80b500` | `#a1a1a1` | `#55ba6d` | `#d97706` | `#fa7064` | `#6e9fff` |
| 500  | `#6a9700` | `#868686` | `#6a9700` | `#868686` | `#16a34a` | `#c66b00` | `#e6433b` | `#447ef9` |
| 600  | `#577d00` | `#6e6e6e` | `#577d00` | `#6e6e6e` | `#008539` | `#a45800` | `#dc2626` | `#2563eb` |
| 700  | `#476700` | `#5b5b5b` | `#476700` | `#5b5b5b` | `#006e2d` | `#884800` | `#ac0310` | `#174ec7` |
| 800  | `#375100` | `#484848` | `#375100` | `#484848` | `#005722` | `#6c3800` | `#8b0009` | `#0a3ba5` |
| 900  | `#2b4000` | `#383838` | `#2b4000` | `#383838` | `#00451a` | `#562b00` | `#6f0006` | `#022b8a` |
| 950  | `#1a2a00` | `#242424` | `#1a2a00` | `#242424` | `#002d0e` | `#391b00` | `#4b0003` | `#001a61` |

### Contrast

Target: **WCAG AA**. Text needs 4.5:1; UI elements such as primary-on-background need 3:1.

| Foreground  | Background | Mode  | Ratio   | Required | Result |
| ----------- | ---------- | ----- | ------- | -------- | ------ |
| `text`      | `bg`       | light | 15.52:1 | 4.5:1    | Pass   |
| `text`      | `surface`  | light | 14.49:1 | 4.5:1    | Pass   |
| `textMuted` | `bg`       | light | 5.10:1  | 4.5:1    | Pass   |
| `textMuted` | `surface`  | light | 4.76:1  | 4.5:1    | Pass   |
| `onPrimary` | `primary`  | light | 12.90:1 | 4.5:1    | Pass   |
| `link`      | `bg`       | light | 6.55:1  | 4.5:1    | Pass   |
| `link`      | `surface`  | light | 6.11:1  | 4.5:1    | Pass   |
| `success`   | `bg`       | light | 6.43:1  | 4.5:1    | Pass   |
| `warning`   | `bg`       | light | 7.06:1  | 4.5:1    | Pass   |
| `danger`    | `bg`       | light | 4.83:1  | 4.5:1    | Pass   |
| `info`      | `bg`       | light | 7.12:1  | 4.5:1    | Pass   |
| `text`      | `bg`       | dark  | 14.49:1 | 4.5:1    | Pass   |
| `text`      | `surface`  | dark  | 10.95:1 | 4.5:1    | Pass   |
| `textMuted` | `bg`       | dark  | 8.62:1  | 4.5:1    | Pass   |
| `textMuted` | `surface`  | dark  | 6.51:1  | 4.5:1    | Pass   |
| `onPrimary` | `primary`  | dark  | 12.90:1 | 4.5:1    | Pass   |
| `link`      | `bg`       | dark  | 12.90:1 | 4.5:1    | Pass   |
| `link`      | `surface`  | dark  | 9.74:1  | 4.5:1    | Pass   |
| `success`   | `bg`       | dark  | 6.38:1  | 4.5:1    | Pass   |
| `warning`   | `bg`       | dark  | 4.87:1  | 4.5:1    | Pass   |
| `danger`    | `bg`       | dark  | 5.59:1  | 4.5:1    | Pass   |
| `info`      | `bg`       | dark  | 5.96:1  | 4.5:1    | Pass   |

**Do**

- Use `var(--color-primary)` as the fill for the single most important action on a screen, and put its text and icons in `var(--color-on-primary)`.
- Use `var(--color-link)` (not `primary`) for links, focus rings, the current nav item and brand-colored text or icons on the background.
- Only pair foreground and background roles that pass in the contrast table.
- Use lime only as a fill (with near-black text) or as text/icons on dark backgrounds
- Keep lime to a few high-signal elements per screen: the primary action, highlights, active states

**Don't**

- Hardcode hex values, even ones that match a palette step.
- Use a raw palette step where a role exists; it won't adapt to dark mode.
- Use `primary` as a large background fill; it is an accent.
- Signal state with color alone; pair it with an icon or text.
- Put lime text, icons or borders on white or light surfaces; they are unreadable (1.2:1)
- Use lime to mean success; use the success role
- Introduce other brand hues; secondary and accent are the grey and lime scales

## Typography

| Use      | Family         | Weights       | CSS variable          | Tailwind       | Load from                                                                                         |
| -------- | -------------- | ------------- | --------------------- | -------------- | ------------------------------------------------------------------------------------------------- |
| Headings | Poppins        | 600, 700      | `var(--font-heading)` | `font-heading` | [Google Fonts](https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&display=swap)        |
| Body     | Inter          | 400, 500, 600 | `var(--font-body)`    | `font-body`    | [Google Fonts](https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap)      |
| Code     | JetBrains Mono | 400, 500      | `var(--font-mono)`    | `font-mono`    | [Google Fonts](https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap) |

### Type scale

Base size 16px, ratio 1.25. Use `--text-<step>` with its companion `--text-<step>--line-height`, `--letter-spacing` and `--font-weight` variables (Tailwind `text-<step>` applies all four).

| Step   | Size                | Line height | Weight | Letter spacing | CSS variable       |
| ------ | ------------------- | ----------- | ------ | -------------- | ------------------ |
| `xs`   | 11px / 0.6875rem    | 1.5         | 400    | 0em            | `var(--text-xs)`   |
| `sm`   | 12.8px / 0.8rem     | 1.5         | 400    | 0em            | `var(--text-sm)`   |
| `base` | 16px / 1rem         | 1.6         | 400    | 0em            | `var(--text-base)` |
| `lg`   | 20px / 1.25rem      | 1.5         | 400    | 0em            | `var(--text-lg)`   |
| `xl`   | 25px / 1.5625rem    | 1.35        | 700    | -0.01em        | `var(--text-xl)`   |
| `2xl`  | 31.25px / 1.9531rem | 1.25        | 700    | -0.01em        | `var(--text-2xl)`  |
| `3xl`  | 39.06px / 2.4413rem | 1.15        | 700    | -0.02em        | `var(--text-3xl)`  |
| `4xl`  | 48.83px / 3.0519rem | 1.1         | 700    | -0.02em        | `var(--text-4xl)`  |

### Elements

| Element           | Step   | Family                |
| ----------------- | ------ | --------------------- |
| h1                | `4xl`  | `var(--font-heading)` |
| h2                | `3xl`  | `var(--font-heading)` |
| h3                | `2xl`  | `var(--font-heading)` |
| h4                | `xl`   | `var(--font-heading)` |
| Lead paragraph    | `lg`   | `var(--font-body)`    |
| Body              | `base` | `var(--font-body)`    |
| Small / UI labels | `sm`   | `var(--font-body)`    |
| Caption           | `xs`   | `var(--font-body)`    |

**Do**

- Use `var(--font-heading)` for h1–h4 and `var(--font-body)` for everything else.
- Use `var(--font-mono)` only for code, keyboard keys and tabular IDs.
- Use Poppins for headings and short display text only; set paragraphs and UI in Inter

**Don't**

- Introduce font families or font sizes that are not in this guide.
- Use weights that are not loaded (heading and body use 400, 500, 600, 700).
- Set body text below the base step for paragraphs.
- Use Poppins for body copy or below the lg step

## Spacing and layout

### Spacing

Multiples of 4px. Tailwind spacing utilities use the same numbers (`p-4` = `--space-4`).

| Token             | Value          |
| ----------------- | -------------- |
| `var(--space-0)`  | 0px / 0rem     |
| `var(--space-1)`  | 4px / 0.25rem  |
| `var(--space-2)`  | 8px / 0.5rem   |
| `var(--space-3)`  | 12px / 0.75rem |
| `var(--space-4)`  | 16px / 1rem    |
| `var(--space-6)`  | 24px / 1.5rem  |
| `var(--space-8)`  | 32px / 2rem    |
| `var(--space-12)` | 48px / 3rem    |
| `var(--space-16)` | 64px / 4rem    |
| `var(--space-24)` | 96px / 6rem    |

### Radius

| Token                | Value  | Tailwind       |
| -------------------- | ------ | -------------- |
| `var(--radius-none)` | 0px    | `rounded-none` |
| `var(--radius-sm)`   | 6px    | `rounded-sm`   |
| `var(--radius-md)`   | 10px   | `rounded-md`   |
| `var(--radius-lg)`   | 16px   | `rounded-lg`   |
| `var(--radius-xl)`   | 24px   | `rounded-xl`   |
| `var(--radius-full)` | 9999px | `rounded-full` |

### Elevation

| Token              | Value                                | Tailwind    |
| ------------------ | ------------------------------------ | ----------- |
| `var(--shadow-sm)` | `0 1px 2px 0px rgb(0 0 0 / 0.05)`    | `shadow-sm` |
| `var(--shadow-md)` | `0 4px 10px -2px rgb(0 0 0 / 0.08)`  | `shadow-md` |
| `var(--shadow-lg)` | `0 12px 28px -6px rgb(0 0 0 / 0.12)` | `shadow-lg` |

### Motion

| Token                    | Value                        |
| ------------------------ | ---------------------------- |
| `var(--duration-fast)`   | 100ms                        |
| `var(--duration-normal)` | 180ms                        |
| `var(--duration-slow)`   | 280ms                        |
| `var(--ease-standard)`   | `cubic-bezier(0.2, 0, 0, 1)` |
| `var(--ease-enter)`      | `cubic-bezier(0, 0, 0, 1)`   |
| `var(--ease-exit)`       | `cubic-bezier(0.3, 0, 1, 1)` |

### Breakpoints

Mobile-first: write base styles for small screens, then add `min-width` media queries.

| Name | Min width |
| ---- | --------- |
| `sm` | 640px     |
| `md` | 768px     |
| `lg` | 1024px    |
| `xl` | 1280px    |

**Do**

- Use spacing tokens for every margin, padding and gap.
- Use `--ease-enter` for things appearing, `--ease-exit` for things leaving, `--ease-standard` otherwise.

**Don't**

- Use arbitrary px values for spacing, radius or shadows.
- Animate layout properties (width, height, top) when a transform or opacity change would do.

## Iconography

- **Library:** Lucide
- **Style:** outline
- **Sizes:** 16px, 20px, 24px
- **Stroke width:** 2px

**Do**

- Use Lucide icons in the outline style at one of the listed sizes.
- Color icons with currentColor so they inherit the text role.
- Give icon-only buttons an accessible label.
- Keep Lucide's default 2px stroke at every size

**Don't**

- Mix icon libraries or styles.
- Scale icons with CSS transforms; use the right size from the scale.

## Imagery

Product screenshots and real UI over stock photography. Crop tight, frame with a 1px border-role outline and radius lg. Dark UI captures pair best with the lime accent.

## Components

### Button

- **Primary:** background `var(--color-primary)`, text `var(--color-on-primary)`, radius `var(--radius-md)`, padding `var(--space-2)` `var(--space-4)`, `var(--font-body)` at `--text-sm` weight 600.
- **Hover:** background `--color-primary-200` (light) / `--color-primary-50` (dark). **Active:** one step further. **Disabled:** 50% opacity, no pointer events.
- **Secondary:** transparent background, 1px `var(--color-border)` border, text `var(--color-text)`.
- **Destructive:** background `var(--color-danger)`, text white.
- Transition background-color over `var(--duration-fast)` `var(--ease-standard)`.

**Notes:** Pill-shaped (radius full) for buttons and tags. Primary is a lime fill with near-black text.

### Text input

- Background `var(--color-bg)`, 1px `var(--color-border)` border, radius `var(--radius-md)`, padding `var(--space-2)` `var(--space-3)`, `--text-base`.
- Label above the field in `--text-sm`, weight 500. Help text below in `var(--color-text-muted)`.
- **Focus:** border `var(--color-link)` plus the focus ring. **Error:** border and message in `var(--color-danger)`.

### Card

- Background `var(--color-surface)`, 1px `var(--color-border)` border, radius `var(--radius-lg)`, padding `var(--space-6)`, shadow `var(--shadow-sm)`.
- Interactive cards raise to `var(--shadow-md)` on hover.

**Notes:** Radius lg (16px). Prefer a 1px border over a shadow; use shadow only for floating elements.

### Alert

- Background `var(--color-surface)`, 1px border and leading icon in the status role (`--color-success`, `--color-warning`, `--color-danger`, `--color-info`), text `var(--color-text)`, radius `var(--radius-md)`, padding `var(--space-3)` `var(--space-4)`.
- Always include a text label for the status, not just the color.

### Navigation bar

- Background `var(--color-bg)` with a 1px `var(--color-border)` bottom border.
- Links in `var(--color-text-muted)`, `var(--color-text)` on hover, `var(--color-link)` for the current page (also mark it with `aria-current="page"`).

**Notes:** Mark the current page with the link color and a 2px underline, not color alone.

**Do**

- Use pill (radius full) buttons and tags; cards and panels use radius lg

## Accessibility

- Meet **WCAG 2.2 AA**.
- **Focus:** 2px solid outline in the link role color, offset 2px. Show it on `:focus-visible`; never remove outlines without a replacement.
- Interactive targets are at least 24×24px.
- Respect `prefers-reduced-motion`: wrap non-essential animation in `@media (prefers-reduced-motion: no-preference)`.
- Use semantic HTML first; add ARIA only when no native element fits.

## Code-review checklist

Flag any of these in a change:

- A hardcoded color, size, font, radius, shadow, duration or easing that a token covers.
- A raw palette step used for text or backgrounds where a role token exists.
- A foreground/background pair that fails the contrast table.
- `primary` used as a large fill instead of an accent.
- A font family, weight or size outside this guide.
- Spacing that isn't on the spacing scale.
- Icons from another library or style, or icons resized with CSS transforms.
- A missing or removed focus indicator.
- Animation that ignores prefers-reduced-motion.
- UI copy that breaks the voice and tone rules.
