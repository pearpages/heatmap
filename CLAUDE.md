# CLAUDE.md

Guidance for working in this repository.

## What this is

`@pearpages/heatmap` — a React 19 component library that renders a GitHub-style
contribution heatmap. Published to npm, demo deployed to
[heatmap.pearpages.com](https://heatmap.pearpages.com).

## Layout

| Path | Role |
| --- | --- |
| `src/` | The library itself — the only thing published (`files: ["dist"]`) |
| `demo/` | The dev sandbox **and** the deployed site; an npm workspace |

## Development loop

`demo/` is a single Vite app that imports the library by its public specifier
(`@pearpages/heatmap`) and resolves it two different ways:

| Command (repo root) | Resolves to | Use for |
| --- | --- | --- |
| `npm run demo` | `../src`, via aliases in `demo/vite.config.ts` under `--mode source` | component work — HMR, no build step |
| `npm run demo:dist` | `../dist`, via the package's own `exports` map | the pre-release consumer check |

CI (`deploy.yml`) always builds the dist mode, so the deployed site doubles as proof that
the published package resolves. Keeping one `App.tsx` for both modes is the point — they
cannot drift. If the two modes render differently, the packaging is broken.

Source mode aliases the stylesheet imports to the empty `demo/src/styles.noop.css`: in
dist mode the CSS is a separate extracted file, while in source mode the components pull
their own SCSS and importing it again would duplicate every rule.

The repo is an npm workspace (`"workspaces": ["demo"]`), so one `npm install` at the root
covers both and `react` is deduped automatically. `vite` is a root devDependency purely so
that the root and `demo/` share one copy — without it `demo/`'s `tsc -b` fails on two
incompatible `vite` type trees (vitest 2 pins its own vite 5).

## Build

`tsup` (esbuild) with `esbuild-sass-plugin`, one entry point:

```
src/index.ts -> dist/index.js + dist/index.css    ("." and "./styles.css")
```

There was a second `./example` entry shipping a ready-made demo widget. It was removed:
its controls were unstyled, its panel ignored dark mode, and the demo site does the same
job better as a real consumer. Removing it was a **breaking change** — if it comes back,
it comes back as a separate package, not a subpath.

## Conventions

- **Styles live in colocated `.scss` files.** No inline styles, CSS-in-JS, or style
  objects. The one deliberate exception is the per-cell `--animation-delay` custom
  property in `src/ContributionHeatmap/index.tsx`, which is necessarily dynamic.
- **BEM class names** — `contribution-heatmap__day--level-3`, `control-group__label`.
- **`@/` path alias** maps to `src/` (in `tsconfig.json`, `tsup`, and `vitest.config.ts` —
  keep all three in sync).
- **Named exports at the bottom of the file**, not inline on the declaration.

## Theming contract

Themes are nothing but overrides of `--color-level-0` … `--color-level-4` under a
`.contribution-heatmap--<name>` class, applied through the component's `className` prop.
Built in: `ocean`, `sunset`, `purple` (plus the unprefixed GitHub default). Dark mode is
automatic via `prefers-color-scheme`.

`level` is caller-supplied and drives the colour; the component never derives it from
`count`.

Light and dark are classes too: `--light` and `--dark` force a scheme, and with neither
the component follows `prefers-color-scheme`. The dark palette lives in a `dark-tokens`
mixin because it has to be emitted twice — once guarded by `:not(--light)` inside the
media query so forcing light wins under a dark system, and once unguarded on `--dark` so
forcing dark wins under a light one. Dropping either copy silently breaks one direction,
and a light-mode desktop will not catch it.

The same custom-property mechanism carries typography and sizing:
`--heatmap-font-family` (a system stack, from `src/shared/_typography.scss`),
`--heatmap-label-size`, `--day-size`, `--day-gap`. The
component declares its own font deliberately — inheriting the host's meant it rendered in
Times on any page that sets none.

## Layout invariants

Two rules keep the grid honest; both were once broken and are easy to break again.

- **The table is intrinsically sized** (`__table { width: max-content }`), never
  `width: 100%` with `table-layout: fixed`. Under fixed layout the cell widths are
  ignored, `--day-size` silently degrades to a height-only knob, and the grid can never
  overflow — so `__scroll`'s `overflow-x` becomes dead code.
- **The reversed layout's square fills its cell** (`width: 100%; aspect-ratio: 1`) rather
  than taking a fixed `--day-size`. The column is as wide as its day-name header, and
  that is locale-dependent: `Wed` is three characters, French `mer.` is four (20px vs
  26.5px, measured). A fixed size leaves slack in any locale whose names are longer than
  English. `--day-size: 20px` remains as the floor.
- **The square is drawn by `&__day::before`, not the `<td>`.** The cell is only a slot.
  The reversed layout sizes its columns to the `Sun`/`Mon` headers, which are wider than
  `--day-size`, so a square painted on the cell itself stretches with the column. That
  layout gets `--day-size: 20px` under `.contribution-heatmap--reverse`, otherwise a 12px
  square leaves ~10px of slack in every cell.
- **The reversed layout's day headers are monospace**, which is a fix and not a style
  choice. Every name in `dayNames` is exactly three characters, so a monospace face
  renders all seven at one width; proportionally, `Fri` is 13.8px against `Wed`'s 23.7px,
  and centring that in equal columns makes the gaps flanking `Fri` 4.3x the others.
  `--day-size: 20px` follows from it: the monospace label is 19.87px wide, so the square
  clears it and the square — not the label — sets the column.
- **The month label is out of flow** (`&__month-header-text`, absolutely positioned). A
  month at either end of the period can span a single week, and in flow its own label
  would widen that one column and open a visible gap. The trailing month additionally
  gets `--last`, which anchors its label to the right so it overhangs inwards instead of
  extending the scroll area.

Both load animations (the card's `fadeInUp` and the per-cell stagger) sit inside
`@media (prefers-reduced-motion: no-preference)`. Keep new motion in there too: a year is
371 staggered cells.

## Localisation

The library ships **no translations**, deliberately. `src/shared/intl.ts` derives day and
month names from a `locale` via `Intl`; `HeatmapLabels` covers the few strings it cannot
(`Less`, `More`, `Level N`, the contribution counts). `en-US` reproduces the exported
`dayNames`/`monthNames` constants exactly, which is why defaulting to it changed no
existing output. Those constants stay exported — they are public API — they are simply no
longer the component's internal source.

**The library works in local calendar days, never UTC.** `createDateString` and
`parseDateString` (`src/shared/models.tsx`) are the only conversions between `Date` and
the `YYYY-MM-DD` strings the data carries, and both use local components. Never reach for
`toISOString()` or `new Date('YYYY-MM-DD')`: both are UTC, and mixing them with the
local-time `Date` constructors callers use for `Period` shifted the first and last day of
a period by one — in Europe/Madrid a period starting Sun 9 Aug was generated as
`2026-08-08`, a Saturday, which dragged a whole extra padding week into the grid, while
in America/New_York the strings read back a day early and the week start flipped to
Monday. The one exception is `src/shared/intl.ts`, which names weekdays and months from
fixed `Date.UTC` reference instants and never touches contribution data.

`weekStartsOn` lives on `groupByWeeks`, not on the component: the component reads the
first day off `weeks[0][0].date`, so a prop can never disagree with the data it was
handed. Note that a "translated" heatmap which still starts weeks on Sunday is wrong for
most of Europe — the two go together.

`groupByWeeks` always pads to whole weeks, so the first and last week carry days
outside the period. `isInRange` (`src/shared/formatTooltip.tsx`) is what separates them:
it compares `YYYY-MM-DD` strings, never `Date` objects, because period boundaries carry a
time of day that would push the period's own first and last day out of range. It drives
both the tooltip wording and the `__day--outside` modifier that blanks the square.

**`--day-size` deliberately does not shrink at the breakpoints.** It looks like a missing
responsive step and it is not: a year is 53 weeks plus a label column, so the grid is
507px wide even at 8px squares against ~373px of usable width on a phone. It scrolls at
every size, so shrinking only cost legibility and left a 9px tap target on cells that are
`role="button"`. The breakpoints keep the padding and `--day-gap` reductions, which are
free — `border-spacing` is not part of a cell's hit area.

**The root does not shrink-wrap — do not try to make it.** Three mechanisms were tried
and all three render full-width on iOS Safari while shrink-wrapping correctly in Chrome:
`width: fit-content`, `-webkit-fit-content`, and CSS 2.1 `display: inline-block`. The
only common factor is that the card's child is a scroll container (`__scroll`,
`overflow-x: auto`), but that was never confirmed — there is no WebKit in the dev
environment. `display: table` shrink-wraps but breaks the calendar, which then overflows
its container instead of scrolling (818px at a 393px container, measured).

The card is therefore a plain block that fills its container, and
`&__legend` is `justify-content: flex-start` so it sits under the grid instead of
floating in the middle of a wide card. This renders identically everywhere and does not
depend on a diagnosis nobody has verified. If you are tempted to re-add a hug, note that
the visible symptom of it failing is subtle: it looks right in Chrome.

**Below 480px the reversed layout stops hugging and fills the width instead**
(`display: block; width: auto`, table at `width: 100%`, square at `width: 100%` +
`aspect-ratio: 1`). The `display: block` is required, not redundant: a percentage width
cannot resolve inside a shrink-to-fit parent, so the card must stop hugging before the
table can fill it. Keep the table on **auto** layout — `table-layout: fixed` divides the
width equally and hands the `Aug`/`Sep` label a full day column instead of collapsing it
via `width: 1%`.

`getMonthsForHeader` spans must total `weeks.length` exactly — the header row and the body
rows are the same table. `getMonthsForHeader.test.ts` asserts this twice, deliberately.

## Checks

- `npm test -- --run` — always pass `--run`; bare `npm test` starts watch mode and hangs.
- `npm run lint` — root flat ESLint config, covers `src/` and `demo/src/`.
- `npm run check:package` — `publint` + `arethetypeswrong`. This is what actually guards
  the `exports` map, the `files` field and the `.d.ts` resolution; the demo can't see
  those bugs. `attw` runs with `--profile esm-only` (the package is ESM-only by design,
  so the CJS-resolution warnings are noise) and skips the two CSS subpaths, which `attw`
  has no concept of.

All three plus the build run as gates in `publish.yml`, and again via `prepublishOnly` so
a local `npm publish` can't skip them.

`vitest.config.ts` pins **`TZ=UTC`** for determinism only, so fixtures written as
`new Date('2024-01-01')` mean the same day on every machine. The code itself no longer
depends on the zone: `src/shared/timezones.test.ts` sets `process.env.TZ` per test (Node
honours it at runtime) and runs one end-to-end scenario in Madrid, New York and Auckland.
Against the pre-fix code it failed 12 of 28 cases. Keep it — a UTC-only suite hides every
offset bug.

## Releasing

Two independent pipelines: push to `main` deploys the demo and never touches npm; pushing
a `v*` tag publishes to npm. The tag name does not set the version — `package.json` does.
Use `npm version <patch|minor|major> && git push --follow-tags`. Full detail in the
README's Releasing section.
