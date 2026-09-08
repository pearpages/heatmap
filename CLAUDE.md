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
      `toISOString()` while periods are built in local time, so in negative-offset
      timezones the first/last day of a heatmap can shift. Fix by formatting from local
      date components. Tests are in place as a safety net.
- [ ] **`formatTooltip` boundary strictness.** `isInRange` uses `>` / `<`, so the
      period's own start and end days read as "No contributions". Probably should be
      `>=` / `<=`. Current behaviour is asserted in `formatTooltip.test.ts`.
- [ ] **`.theme-button` has no styles.** `ControlGroups.tsx` renders
      `theme-button` / `theme-button--active` classes but no SCSS defines them, so the
      demo's theme switcher is unstyled and the active state is invisible.
- [ ] **`getLastMonthPeriod` short window.** From a 31st it computes e.g. Feb 32, which
      normalises forward to Mar 3 — the "last month" window can be under four weeks and
      never reach the previous month.
