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
| `src/entries/example.ts` | Barrel for the `@pearpages/heatmap/example` subpath |
| `demo/` | The dev sandbox **and** the deployed site; an npm workspace |

## Development loop

`demo/` is a single Vite app that imports the library by its public specifier
(`@pearpages/heatmap/example`) and resolves it two different ways:

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

`tsup` (esbuild) with `esbuild-sass-plugin`, two entry points:

```
src/index.ts          -> dist/index.js   + dist/index.css    ("." and "./styles.css")
src/entries/example.ts -> dist/example.js + dist/example.css  ("./example" and "./example.css")
```

The demo (`src/Example/`) is deliberately kept out of the main entry so consumers don't
download `ControlGroups`, the mock generators, or their SCSS. **Keep it that way** — do
not re-export `./Example` from `src/index.ts`.

`dist/example.css` is a superset of `dist/index.css`; consumers import one or the other,
never both.

Note the entry barrel lives at `src/entries/example.ts`, not `src/example.ts`: on a
case-insensitive filesystem the latter collides with the `src/Example/` directory and the
build fails with "Detected cycle while resolving import".

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

The same custom-property mechanism carries typography and sizing:
`--heatmap-font-family` (a system stack, shared with the example via
`src/shared/_typography.scss`), `--heatmap-label-size`, `--day-size`, `--day-gap`. The
component declares its own font deliberately — inheriting the host's meant it rendered in
Times on any page that sets none.

## Layout invariants

Two rules keep the grid honest; both were once broken and are easy to break again.

- **The table is intrinsically sized** (`__table { width: max-content }`), never
  `width: 100%` with `table-layout: fixed`. Under fixed layout the cell widths are
  ignored, `--day-size` silently degrades to a height-only knob, and the grid can never
  overflow — so `__scroll`'s `overflow-x` becomes dead code.
- **The square is drawn by `&__day::before`, not the `<td>`.** The cell is only a slot.
  The reversed layout sizes its columns to the `Sun`/`Mon` headers, which are wider than
  `--day-size`, so a square painted on the cell itself stretches with the column. That
  layout gets `--day-size: 20px` under `.contribution-heatmap--reverse` — declared after
  the breakpoints so it wins at every width — otherwise a 12px square leaves ~10px of
  slack in every cell.
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

`groupByWeeks` always pads to whole Sun-Sat weeks, so the first and last week carry days
outside the period. `isInRange` (`src/shared/formatTooltip.tsx`) is what separates them:
it compares `YYYY-MM-DD` strings, never `Date` objects, because period boundaries carry a
time of day that would push the period's own first and last day out of range. It drives
both the tooltip wording and the `__day--outside` modifier that blanks the square.

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

`vitest.config.ts` pins **`TZ=UTC`**. This matters: `createDateString` formats via
`toISOString()` (UTC) while `Period` boundaries are built with local-time `Date`
constructors. Without the pin, the date tests fail in negative-offset timezones.

## Releasing

Two independent pipelines: push to `main` deploys the demo and never touches npm; pushing
a `v*` tag publishes to npm. The tag name does not set the version — `package.json` does.
Use `npm version <patch|minor|major> && git push --follow-tags`. Full detail in the
README's Releasing section.

## TODO

- [ ] **UTC/local date mismatch.** `createDateString` (`src/shared/models.tsx`) uses
      `toISOString()` while periods are built with local-time `Date` constructors, so the
      first and last day of a heatmap shift by one. It bites in *positive* offsets too,
      not just negative ones: in Europe/Madrid a period starting Sun 9 Aug is generated
      as `2026-08-08`, a Saturday, which drags a whole extra padding week into the grid.
      Fix by formatting from local date components — and note that the `new Date(dateStr)`
      parses elsewhere (`formatTooltip`, `getMonthsForHeader`) read as UTC, so they move
      with it. Tests are in place as a safety net.
- [ ] **`.theme-button` has no styles.** `ControlGroups.tsx` renders
      `theme-button` / `theme-button--active` classes but no SCSS defines them, so the
      demo's theme switcher is unstyled and the active state is invisible.
- [ ] **`getLastMonthPeriod` short window.** From a 31st it computes e.g. Feb 32, which
      normalises forward to Mar 3 — the "last month" window can be under four weeks and
      never reach the previous month.
- [ ] **No `prefers-reduced-motion` guard.** Every cell runs a `fadeInUp` on mount with a
      staggered `--animation-delay` — 371 of them for a year — and the card itself
      animates too. Wrap both in `@media (prefers-reduced-motion: no-preference)`.
