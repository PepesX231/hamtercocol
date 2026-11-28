# Hamster Hub website: handoff (27 พ.ย. 2569)

For the next person or Claude taking over. Read all of it before changing anything. The owner is strict about look and copy, and many ideas have already been tried and rejected (section 8).

## 1. The project in one minute

- **Client:** Hamster Hub (hamsterhub.co). It teaches high-school students (ม.ปลาย) to build games, web apps, IoT and startups. The students' work gets them into university (TCAS portfolio round), wins national competitions and is sold or used for real.
- **Audience:** students choose, parents pay. Parents need to trust the site at a glance.
- **Owner:** Pesd (ชมน์ปภพ), GitHub `PepesX231`. He relays comments from พี่ฮิว and พี่เก่ง. **Always reply to him in Thai, in plain words.** He writes in blunt, casual Thai with typos, sometimes typed on the wrong keyboard layout (English letters that are really Thai). He often sends screenshots numbered "รูป 1, รูป 2…" and the order of the images is the numbering.
- **Who continues the code:** his friends, in **Next.js**. All new work happens in `web/` (Next.js). `slime.html`, `new.html` and `index.html` are frozen older versions.

## 2. Links

| What | Where |
|---|---|
| Repo | https://github.com/PepesX231/hamtercocol (`main` and `gh-pages` are kept identical). Moved here from PepesX231/Hamterco on 27 พ.ย.; leave that old repo alone. |
| **Current site (Next.js)** | https://pepesx231.github.io/hamtercocol/next/ |
| Hams Route store | https://pepesx231.github.io/hamtercocol/next/routes/ |
| 3D map alone (shown at the top of home) | https://pepesx231.github.io/hamtercocol/map-app/ |
| 3D map, original (น้องไอดิน, Vercel, with Gemini chat) | https://hamsterhub-map-review.vercel.app |
| Portfolio Camp page (source of the camp facts) | https://github.com/PepesX231/PortfolioCamp |
| Older single-file versions (frozen) | `/hamtercocol/slime.html`, `/hamtercocol/new.html`, `/hamtercocol/` (index.html) |
| Team sheet of projects and awards | https://docs.google.com/spreadsheets/d/1eB-6lrVTdXQ8LRwiYjp0x6J8E1jpndy6d-hYZWgSvL0/edit?gid=0 |
| Real production site (the client's) | https://www.hamsterhub.co/ |
| LINE | https://page.line.me/jkm4247u?openQrModal=true |

## 3. Run, build, test and publish

```sh
cd web
npm install
npm run dev            # http://localhost:3000/hamtercocol/next/ (pictures come from /hamtercocol/img/, see serve.sh)
npm run export         # rebuilds the legacy bundle, builds the static site into web/out, copies it to ../next/
```

Test the built site the way GitHub Pages serves it:

```sh
dev/tests/serve.sh     # http://localhost:8791/hamtercocol/next/  (needs `npm run export` first)
cd dev/tests
node flow.js           # main user flow at 1440 and 390, prints "errors: none" when clean (needs playwright)
node shots.js "routes/|1440|r" "|390|home"    # full-page screenshots: path|width|name
node gen.js && node harness.js                # 5,814 generated search questions; prints the share left unanswered
node txt.js http://localhost:8791/hamtercocol/next/   # counts visible text (the owner wants less text than apple.com/th)
python3 ../builds/map_app.py /path/to/hamsterhub-hall-of-fame-map   # rebuilds the 3D map into ../../map-app/ (run `npm ci` in the map repo first)
python3 tile.py in.png out.png 2200           # tiles a tall screenshot into one image
```

Publish (GitHub Pages takes 1–5 minutes):

```sh
git add -A && git commit -m "..." && git push origin main main:gh-pages
```

Always check at **1440 and 390 px wide**. Nothing may cause sideways scrolling (`html{overflow-x:clip}`).

## 4. How the app is built

Next.js 16 (App Router, static export), React 19, TypeScript, Tailwind 4, Motion 12. `basePath` is `/hamtercocol/next`, with `trailingSlash`.

It is a **hybrid**. Parts already rewritten are React. Everything else is the original page (markup, CSS and scripts), run inside the app by `components/LegacyRuntime.tsx`.

- `dev/builds/legacy_next.py` rebuilds the original page from `new.html` plus the layer files in `dev/builds/layers/`, skipping the layers React now replaces. It splits the result into `web/public/legacy/` (`body.html`, `legacy.css`, `js/NNN.js`, `manifest.json`).
- **Content edits to legacy sections are made in `legacy_next.py`** as string replacements on the body or the scripts. For example, the pictures and clips in "สิ่งที่ Hamster Hub สร้าง", renamed links, shorter button text and the Hams Route rename are all there. Do not edit `web/public/legacy/` by hand; it is regenerated on every export.
- `LegacyRuntime` loads all legacy scripts in parallel and moves the old header and the page-wipe element to the top. `view="home" | "works" | …` picks the legacy view. `view="shell"` keeps only the header, footer and loader (used by the React-only Hams Route pages). The `hide` prop hides legacy parts that React has replaced.
- Page transitions use the original wipe (`window.HH_pt`, key `hh-pt` in sessionStorage). The loader (`lib/loader.ts`) is skipped when arriving through a transition.

### CSS gotcha (important)

The order is `@layer theme, base, legacy, components, utilities`. Legacy CSS often uses `!important`. An `!important` rule in a **lower** layer beats one in a higher layer, so to override a legacy `!important`, put your rule inside `@layer theme { … !important }` in `app/globals.css`. Several blocks there already do this (look for `@layer theme`).

### File map (web/)

| File | What it does |
|---|---|
| `app/page.tsx` | Home: `<HomeMap/>`, the legacy "สิ่งที่ Hamster Hub สร้าง" moved in, `<HomeStore/>`, then the rest of the legacy home (Hall of Fame hidden) |
| `app/routes/…` | Hams Route: store page, kind pages `[d]`, Route detail `r/[id]`, Package detail `p/[id]` |
| `app/works/page.tsx` | Works page (legacy); `SheetWorks` adds the full awards list to its Hall of Fame tab |
| `app/courses/` | Redirects to `/routes/` |
| `app/globals.css` | Global and legacy overrides (search bar, follow bar, sections, Hall of Fame tab, text cuts) |
| `app/store.css` | Hams Route look: shelves, cards, package blocks, header, arrows |
| `components/Hero.tsx` | (not shown since 27 พ.ย.; kept in case the owner wants it back) Hero: work cards, "น้องอยาก…", search bar, answers (`solveQuery`), `RouteMatches`, `FollowBar` (the search bar that appears at the bottom of the screen after the big one scrolls away) |
| `components/HomeStore.tsx` | Home shelf: Packages (the Route shelf was removed from home) |
| `components/store/*` | `Shelf` (row plus arrows), `Cards` (Package, Route, Program), `PackageShelf`, `GoalSearch`, `Info` (FAQ and steps), `BuyBar` |
| `components/SheetWorks.tsx` | Puts the awards list from `lib/works.ts` into the Hall of Fame tab |
| `components/HomeMap.tsx`, `app/map.css` | Top of home: 3D map (iframe), กิจกรรม (Portfolio Camp), Thailand Game Show, All for One. `app/map/` only redirects to home |
| `components/map/ClipStage.tsx` | Thailand Game Show gallery wall: white cards, the card in view plays; arrows, swipe |
| `components/map/BookShelf.tsx` | All for One bookshelf: spines edge to edge, the chosen book opens to show its clip |
| `components/LegacyRuntime.tsx` `move` | Moves legacy parts before the old scripts run (home: "สิ่งที่สร้าง" up, "จัดกิจกรรมร่วมกับ" under กิจกรรมล่าสุด) |
| `lib/map.ts` | Works in Thailand Game Show and All for One (with their id in the map's data), and the camp facts, with sources |
| `components/MapFrame.tsx` | The map iframe and its messages: pauses the map off screen, tells it which works have a section here, scrolls to a section when a student card asks |
| `components/AutoVideo.tsx` | Muted loop clip that plays only while on screen |
| `dev/builds/map_app.py` | Builds น้องไอดิน's map repo into `map-app/` with base `/hamtercocol/map-app/`, prefixes its absolute paths, shrinks its clips |
| `components/LegacyRuntime.tsx` | Runs the legacy page (see above) |
| `lib/routes.ts` | All Hams Route data: 6 kinds, 24 Routes, 4 Packages, 2 programs, goal search `findForGoal` |
| `lib/understand.ts` | Reads search questions in any form: typos, slang, no spaces, wrong keyboard layout, tone marks |
| `lib/works.ts` | Awards from the team sheet (22 พ.ย.) |
| `lib/site.ts` | Hero work cards, wishes, example questions, nav links |
| `public/route-art/` | `t-<route id>.webp` (Route art), `pk2-*.webp` (Package art) |

Pictures and videos for the whole site live in the repo-root `img/` and are served as `/hamtercocol/img/…`.

### The search

1. The original engine (legacy layer `65-search.html`) answers first.
2. If it gives up (unknown, foreign, shape and similar), `understand()` names the topic and the engine is asked again with a standard question. If the topic is something only Hams Route covers (3D, the 12-month programme), the card says so and the matching Routes show under it.
3. Keyboard mash such as "ฟหก" gets "แป้นพิมพ์อาจเป็นอีกภาษาอยู่".

To add words, extend `INTENTS` in `lib/understand.ts`, then run `harness.js`. The last run left 0.4% unanswered, mostly mixed Thai and English strings.

## 5. What the site looks like now

**Home, in order (owner, 28 พ.ย., after พี่อุ้ย's review clip):**
1. **3D map** (น้องไอดิน's app, in the site's colours), title "2026 every**Ham's**Projects" ("Ham" orange, "'s" white). The "รุ่นพี่ปี 69 ติดมหาลัยแล้ว 48 คน ↓" line under it was removed by the owner (28 พ.ย.). Replaced the hero and its search bar.
2. **กิจกรรม**: Portfolio Camp for TCAS 1 as an orange banner in the style of the old All for One banner (the current activity; All for One has just ended); each picture carries a label saying which track it is. Was "เข้าร่วมกับ Hamster Hub" at the bottom until 28 พ.ย.
3. **Thailand Game Show**: a gallery wall (`components/map/ClipStage.tsx`, owner's Pinterest gallery, 28 พ.ย.): tall white cards in a row that runs off the edge (name and maker on top, clip in the bottom 62%, award as an orange label); the card in view or under the mouse plays and lifts; cards fade up one after another; arrows and swipe, no dots ("don't spoil"). Potatogame's clip is cropped to remove a strip of a document at the bottom.
4. **All for One**: a bookshelf (`components/map/BookShelf.tsx`, owner's Pinterest shelf, 28 พ.ย.): plain books fill the shelf edge to edge; the chosen work slides to the middle and opens like a book (cover board and two pages swing open from the spine) to show its 16:9 cover with the clip and a square label ("All for One University 2026" + name). 9 mock books stand in until the team sends works (replace them in `lib/map.ts`). Smaller than Thailand Game Show on purpose.
5. "รุ่นพี่ปี 69 ติดมหาลัยแล้ว 48 คน" (moved down), สร้างอนาคตไปด้วยกัน (light), footer.
- **Removed from home:** กิจกรรมล่าสุด (the old All for One banner, 28 พ.ย.), จัดกิจกรรมร่วมกับ (28 พ.ย.), Hall of Fame (the awards list stays on /works/), "สิ่งที่ Hamster Hub สร้าง", the Route shelf (Routes stay on /routes/), and for now the Packages shelf (28 พ.ย.; `components/HomeStore.tsx` is kept).
- The map's "i" (data credits) button is hidden on the site; the footer links "เครดิตแผนที่" to `map-app/credits.txt` (CC BY needs the credit). The map's top and bottom edges fade out so zoomed-in land never stops on a line.

**Hams Route (`/routes/`):**
- Apple Store–style header: name on the left, mascot in the middle, question on the right.
- Packages, then one shelf per kind.
- Content starts about 2.8vw from the left edge, like Apple.
- Arrows always show at the right edge (faded when there is nothing to scroll).
- Route cards are 284 × 430: white card, picture inside with space around it, name and price, then the arrow.
- Package detail pages have the picture, a buy bar, FAQ and apply steps.

**Package names:**

| Package | Line | Sample price |
|---|---|---|
| First Build | โค้ดชิ้นแรกของน้อง | ฿2,390 |
| Port Ready | เว็บพร้อมใส่พอร์ต | ฿3,490 |
| Arena | โปรเจกต์ขึ้นเวทีแข่ง | ฿4,290 |
| Launch Lab | ไอเดียสู่แอปจริง | ฿3,990 |

**Programs:**
- Port Express: 2 months, ฿5,990
- Project Build Skill: 12 months, ฿19,990

**Top of home, details (27 พ.ย., from พี่ฮิว's Figma, the call and the owner):**
- It was first built as a separate page /map/; the owner wants it on home instead. /map/ now redirects to home.
- The map runs in an iframe with `?embed`: the mouse wheel and one-finger swipe scroll the page; its own logo is hidden.
- Game shows get big clips; All for One can hold about 10 works.
- Camp: Portfolio Camp for TCAS 1, 4–6 ธ.ค. 2569, online on Discord, 190 บาท, apply at hamsterhub.co/portcamp (from the PortfolioCamp page).
- Do not write "48 คน" in these sections (พี่ฮิว: boring).
- Site colours everywhere (cream, ink, store orange). The map draws in the site's colours in `?embed` (map repo: `src/ui/light.css`, `light` in `src/scene/ThailandMap.tsx`): cream page, sand land, orange for provinces with awards. The closing section is light too (`app/map.css`).
- The map is the hub (พี่อุ้ย, 27 พ.ย.): a student card on the map shows "ดูใน Thailand Game Show ↓" / "ดูใน All for One ↓" for works that have a clip here; it scrolls down and shows that clip. Messages are in the map repo's `src/embed.ts`.
- Lag: the map stops all animation while it is off screen (it reads `document.hidden` as true), and clips play only while on screen.

## 6. Facts (never invent numbers)

- **Prices are SAMPLES.** All Route and Package prices are samples from the design files and are labelled "ราคาตัวอย่าง". Prerequisites, durations and the real apply link are still "รอทีมยืนยัน".
- **University results:** 48 seniors in DEK69 got in through the portfolio round (สจล. 24, มหิดล 9, จุฬาฯ 8, เกษตรฯ 7).
- **Mr. City:**
  - A game for touring Songkhla, sold to สวนสัตว์สงขลา (the Songkhla zoo).
  - **There is no real picture of it.** The two files that looked like Mr. City are really Hamster Quest's town, and `g-mrcity.webp` is a generated picture.
  - The site shows an orange block with a play button that links to the Facebook clip.
- **PHC Map:** used to teach more than 1,000 children. The site uses the `w-hmap.mp4` clip for it.
- **Hamster Quest:** a learning site that plays like a game.
- **Apocalypis Building:** by น้องฟาร์. The owner confirmed it is the depa 2026 winner ("สร้างตึก", prize 200,000 บาท).
- **RE//SLASH = SLASH//SPEED:** same game by น้องดินสอ (the clips match); RE//SLASH is the newer name. Sheet: TGGS 2026 Top 12.
- **Awards:** the full list is in `lib/works.ts`, copied from the sheet. Names are kept as written there.
- **Generated pictures** (not student work):
  - Route art (`t-*.webp`, flat poster style the owner asked for)
  - Package art (`pk2-*.webp`)
  - Never generate pictures that pretend to be students' games or screenshots.

## 7. Rules the owner has set

- Square, sharp corners everywhere (except true circles), with an Apple feel. He compares against apple.com/th and apple.com/th/store constantly.
- No "AI slop":
  - no decorative gradients
  - no template grids of identical cards
  - no pill buttons
  - no decorative lines or rules ("ขีดๆ")
- **No hard cut edges ("ขอบตัด")** between sections or under rows. Shadows must fade out (rows have bottom padding for this).
- **Less text than Apple.** The home page now has 720 visible characters; apple.com/th has 724. Run `txt.js` after adding copy. Remove the small explanatory lines under headings.
- **Real pictures and clips over generated ones.** When something has a clip, play it automatically: muted, looping, `playsinline`.
- Copy follows the `thai-plain-copy` rules: outcome first, numbers with units, no slogans, buttons that say what happens.
- In new copy, do not use "ดูทั้งหมด", and say "Hams Route" instead of "คอร์ส" (some old legacy text still says คอร์ส).
- When he says "กลับเป็นแบบเดิม", restore exactly what was there before.
- Motion is 60fps and purposeful. Nothing moves on its own without a reason.
- Do not invent facts. If unsure, ask him and say clearly what is a sample.

## 8. Tried and rejected (do not bring back)

**Earlier versions:**
- dark cinematic hero with background video
- left-aligned hero with a big mascot
- scroll-driven storytelling
- the line "เราไม่ได้สอนแค่ทำพอร์ต"
- an orange theme
- grid backgrounds and gradient washes
- watercolor and visionOS-style UI
- hamsters built from CSS circles
- the cheese drip under the search bar (the legacy `.je`, now hidden globally)

**Hams Route era (22–23 พ.ย.):**
- goal chips and the compare table
- the full programs section
- clay-toy Route art
- package names in Thai ("โปรแกรมชิ้นแรก"…)
- the sheet's "ใช้งานจริง ขายได้" shelf on the home page (the awards list belongs only in Hall of Fame)
- poster images with student photos in "สิ่งที่ Hamster Hub สร้าง"
- generated device mockups for Mr. City, PHC Map and Hamster Quest
- the search bar that followed at the top of the screen (now at the bottom)
- Route cards so big that they run off the edge

## 9. Open items

1. **Mr. City:** a real screenshot or clip (Facebook cannot be fetched from here).
2. **Clips of LYNO, Time Keeper and Z.O.O.:** they were replaced by games that have clips. The owner can send files.
3. **Names to confirm:** PHC Map or Hamster Map? RE//SLASH (sheet) or SLASH//SPEED (Hall of Fame)?
4. **Dune by น้องแทน:** what "10k" in the sheet means.
5. **MIT 2025 (ขนมปัง):** the project has no name in the sheet.
6. **From the team:** real prices, prerequisites, durations and the apply link for Routes and Packages.
7. **Rewrite remaining legacy sections as React components,** one at a time, then drop them from `legacy_next.py`. This is the long-term goal so the friends inherit a clean Next.js app.
8. **Hams Route kind pages:** these can now be reached only from the breadcrumb on a Route page, because the "ดูทั้งหมด" links were removed at the owner's request.
9. **Home map, hamster chat:** Gemini needs a server. On GitHub Pages the chat shows its "browse by hand" fallback. To turn it on, the map's `/api/guide` (Vercel) must accept requests from pepesx231.github.io / hamsterhub.co (`server/guide.ts` line 32 refuses other origins) and the map page must call it, or the whole site must move to a host with server functions.
10. **Home map, data:** the map shows its review data (`public/__local-preview/data.json` in the map repo, 10 students). Several award names there are not in the team sheet; check them with น้องไอดิน before launch. Real data from the sheet is a separate step (`server/sheets.ts` in the map repo).
12. **Map award names vs TGS:** in the map data RE//SLASH is under "Asian Game Talent Showcase 2026", but the owner says it is a Thailand Game Show work. Ask น้องไอดิน to fix the award names in `data.json`.
11. **All for One works:** the team's list and clips (only SmartParkin' is known). Is TripOra a Game Show work?

- 28 พ.ย.: "ดู Hams Route" in สร้างอนาคตไปด้วยกัน is the most prominent button (big orange, first; `app/map.css` @layer theme). The map's panels have a hamsterhub.co skin in the map repo's `src/ui/light.css` (square corners, no hairlines, black square buttons, rows that turn black on hover), only with ?embed.
