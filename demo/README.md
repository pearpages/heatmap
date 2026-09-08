# demo

The `@pearpages/heatmap` demo app. It is both the day-to-day development
sandbox and the site deployed to [heatmap.pearpages.com](https://heatmap.pearpages.com).

It renders the library through its **public import specifier**
(`@pearpages/heatmap`), and `vite.config.ts` decides where that
specifier actually resolves:

| Command (from the repo root) | Resolves to | Use it for |
| --- | --- | --- |
| `npm run demo` | `../src` — HMR, no build step | working on the component |
| `npm run demo:dist` | `../dist` via the package's `exports` map | checking the package a consumer installs |

Because both modes share one `App.tsx`, they can't drift apart. If they render
differently, the packaging is wrong — which is exactly what the dist mode is
there to catch.

Run the root `npm run build` before the dist mode (`npm run demo:dist` does it
for you).

The Appearance switcher drives the whole page, not just the widgets: it sets `data-theme`
on `<html>` (removing it for Auto, which hands control back to `prefers-color-scheme`),
and `app.scss` keys the page palette off that the same way the component keys off its
`--light` / `--dark` modifiers. The language switcher sets `<html lang>` to match.
