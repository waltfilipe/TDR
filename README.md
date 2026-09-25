# Training Development Report (Vercel)

Single-page site for the SGA individual development report (IDP), fed by data from
`Modelo - IDP v2.pbix` and deployed on Vercel.

## Page content

- **Athlete column** — generic photo placeholder plus position, club, birth year and height
- **Technical Indicators** — eight graded skills laid out as four columns of two, with a
  hoverable **Grade key** tooltip instead of an inline legend
- **Player-Specific Indicators** — 4 to 6 slots, empty by default and **editable in the page**
- **Need to Improve** — 4 to 6 slots, empty by default and **editable in the page**

Both editable panels persist to `localStorage` per player, so edits stay in the browser
where they were made and can be cleared with **Clear** / **Reset**.

## Brand

Visual tokens follow the SGA brand manual (2023):

- Institutional colors: `#072334`, `#297cc1`, `#044f80`, `#ffffff` — every surface tone is
  mixed from these four
- Typography: **Source Sans 3** for the interface (Trebuchet MS fallback), **Good Times**
  reserved for the logo and the slogan
- The fixed bottom-left mark keeps a clear safety area, with the white stripe outside it

Tokens live in `lib/brand.ts` and are mirrored by CSS custom properties in `app/globals.css`.

## Stack

- Next.js 15 (App Router), custom responsive layout
- Static data in `data/report.json`, generated from the `.pbix`
- Vercel deploy via `vercel.json` (`framework: nextjs`)

## Local development

```bash
pip install pbixray
npm install
npm run build:data
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Refreshing Power BI data

1. Replace or edit `Modelo - IDP v2.pbix` at the repository root.
2. Run `npm run build:data` (optionally pass a player name, e.g.
   `python3 scripts/build_site_data.py "Player Name"`).
3. Commit `data/report.json`.

The exporter writes a template athlete (placeholder name and empty profile fields) and
leaves the editable panels empty; only the technical grades come from the PBIX.

## Vercel deploy

1. Import the repository in the Vercel dashboard.
2. Framework detected: **Next.js**.
3. Build command: `npm run build` (or `npm run build:data && npm run build` to regenerate
   the JSON in CI).
4. Output: Next.js default.

## Structure

- `app/page.tsx` — single route (`/`)
- `app/globals.css` — design system (brand tokens, cards, badges, responsive, print)
- `components/IdpReport.tsx` — section assembly
- `components/ImprovementsPanel.tsx`, `PlayerSpecificPanel.tsx` — editable panels
- `components/GradeBadge.tsx`, `IndicatorGrid.tsx`, `GradeLegendTooltip.tsx` — grades
- `components/SgaBrand.tsx`, `SgaCornerBrand.tsx`, `SgaLogo.tsx` — logo usage
- `lib/brand.ts` — brand palette, fonts and logo assets
- `lib/report.ts` — types, grade scale and indicator display order
- `scripts/build_site_data.py` — PBIX to JSON export
