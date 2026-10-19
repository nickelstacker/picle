# Picle

A free daily photo game in the style of Wordle. Everyone sees the same photo, zoomed far into its centre. You get 6 guesses to name it, and each wrong guess zooms out one step. After a win or the 6th guess, the full photo is revealed with a fun fact and a share button.

It's a static React + Vite + TypeScript site. There's no backend, no database and no accounts.

## Run locally

Requires Node 20.19+ (22 LTS recommended).

```sh
npm install
npm run dev       # http://localhost:5173
npm test          # unit and data tests
npm run build     # production build into dist/
npm run preview   # serve the production build
```

In dev mode you can play any day's puzzle with `?date=YYYY-MM-DD`, for example `http://localhost:5173/?date=2026-10-25`. This is ignored in production builds.

Each day's progress is saved in `localStorage` under `picle:game:<date>`. To replay a day while testing, clear site data or delete that key in devtools.

## How the daily puzzle is chosen

- The puzzle is chosen by the player's **local** date, so it resets at local midnight.
- Puzzle number = days since `LAUNCH_DATE` in `src/config.ts`, plus 1. Launch day is puzzle #1.
- `src/data/puzzles.json` is an ordered list: entry 0 is puzzle #1, entry 1 is #2, and so on.
- When the list runs out, players see "New puzzles coming soon", so keep it topped up ahead of time.

Game name, launch date, number of guesses and zoom levels are all in `src/config.ts`.

## Adding a puzzle

1. **Find a photo** on [Wikimedia Commons](https://commons.wikimedia.org/). Good candidates:
   - The subject fills the frame and is roughly centred. The game zooms into the exact centre.
   - The centre is interesting when zoomed 8x, but not instantly identifiable.
   - At least 1024 px on the short side.
2. **Check the licence** on the file page, under "Licensing". Only use:
   - Public domain or CC0
   - CC BY (any version)
   - CC BY-SA (any version)

   Don't use anything marked NC (non-commercial), ND (no derivatives), "fair use", or with no clear licence. Cropping counts as a derivative, so ND is out. Note the author exactly as the file page asks to be credited.
3. **Prepare the image.** Crop it to a centred square, resize it to 1024×1024 and save it as JPEG. On macOS:

   ```sh
   sips -c 1024 1024 photo.jpg   # crop to a centred square first if needed: sips -c <short side> <short side>
   sips -Z 1024 photo.jpg
   ```

   Save it as the next number in `public/puzzles/`, e.g. `011.jpg`. **Never put the answer in the filename.**
4. **Add an entry** to the end of `src/data/puzzles.json`:

   ```json
   {
     "id": 11,
     "answer": "Sunflower",
     "accepted": ["sunflower", "sunflowers"],
     "image": "/puzzles/011.jpg",
     "funFact": "Young sunflowers turn to follow the sun across the sky.",
     "credit": "Photo by Jane Doe, CC BY-SA 4.0, via Wikimedia Commons",
     "creditUrl": "https://commons.wikimedia.org/wiki/File:Example.jpg"
   }
   ```

   - `id` must equal its position in the list (1-based).
   - `accepted` lists the variants that count as correct. Matching ignores case, punctuation, accents and a leading "the/a/an", and allows small typos (none for 4 letters or fewer, 1 up to 8 letters, 2 beyond that).
   - `credit` should name the author, licence and source. `creditUrl` is the Commons file page.
5. Run `npm test`. The data tests check ids, that each image exists, filename format and credits.

## Deploy to GitHub Pages (current)

The site is live at https://nickelstacker.github.io/picle/.

`.github/workflows/deploy.yml` runs the tests, builds with `BASE_PATH=/picle/`, and publishes to GitHub Pages on every push to `main`. You can also run it by hand from the repo's **Actions** tab. Pages is set to deploy from **GitHub Actions** under **Settings → Pages**.

On the free GitHub plan, Pages needs a public repo. That means upcoming answers in `puzzles.json` are visible to anyone browsing the repo.

## Deploy to Cloudflare Pages

**From Git (recommended):**

1. Push this repo to GitHub or GitLab.
2. In the Cloudflare dashboard, go to **Workers & Pages → Create → Pages → Connect to Git** and pick the repo.
3. Build settings:
   - Framework preset: **Vite** (or None)
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Environment variable: `NODE_VERSION` = `22`
4. Deploy. Every push to the main branch redeploys, and other branches get preview URLs.

**From your machine:**

```sh
npm run build
npx wrangler pages deploy dist --project-name picle
```

To add a custom domain, open the Pages project and go to **Custom domains**. The share text uses whatever domain the site is served from.

## Cheating

Picle has light protections, not real ones. The answer never appears in the page before the game ends, alt text is generic until the reveal, and image filenames are just numbers. But `puzzles.json` is bundled into the JavaScript, so someone digging through the source can find answers. That's an accepted trade-off for a static site with no backend.

## Project layout

```
src/
  config.ts            name, launch date, guesses, zoom levels
  App.tsx              header, daily puzzle selection
  components/          Game, ZoomImage, GuessInput, Progress, EndPanel
  lib/                 date, match, share, storage, puzzles (+ tests)
  data/                puzzles.json (+ data tests)
public/puzzles/        puzzle images (001.jpg, 002.jpg, …)
```
