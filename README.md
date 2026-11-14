# Salt & Switchback

A small, self-contained static site for a fictional independent walking-weekend desk. Warm paper, forest green, rust accents, editorial type, and original SVG landscapes. Designed for phones and desktops.

**Repository:** [penugondasrinivasbabu-cmyk/travelchins](https://github.com/penugondasrinivasbabu-cmyk/travelchins). The site brand remains **Salt & Switchback**.

**Deployment:** the GitHub Pages workflow is included, but Pages has not been enabled and the site has not been deployed. The initial site upload uses `[skip ci]` to avoid running the deployment workflow.

## Preview locally

From this directory, with Python 3 installed:

```sh
python3 -m http.server 8000 --directory site
```

Open **http://localhost:8000**. Stop the server with Ctrl+C. There is no package installation, bundler, build step, API key, or backend. You can also open `site/index.html` directly, but a local HTTP server is recommended for consistent storage behaviour.

## What is here

```text
.github/workflows/pages.yml  # Uploads and deploys only site/
site/
  index.html                # Brand, three-trip shortlist, approach
  trips.html                # Prices, difficulty, inclusions, daily itineraries
  about.html                # Three-person team, story, fictional map, contact
  practical.html            # Seasons, packing, arrivals, costs, FAQs
  assets/
    css/styles.css          # Responsive layout, print and reduced-motion styles
    js/site.js              # Optional menu, filters, packing, enquiry subject
    images/                 # Original local SVG illustrations and favicon
  .nojekyll
  robots.txt                # Search indexing blocked for this fictional demo
tests/check_site.py         # Dependency-free structural/link checks
.gitignore
LICENSE
README.md
```

## The fictional collection

All prices are **GBP per person sharing a twin or double**, including applicable sample taxes, for April–October 2027. Flexible Friday or Monday starts, one to six walkers; no guided group departures.

| Trip | Days / nights | Walking / total ascent | Price | Single-room supplement, total |
| --- | --- | --- | --- | --- |
| The Salt Path — Bracken Quay to Gullhaven | 3 / 2 | 24 km / 520 m | £295 | £65 |
| The High Lanes — Bellwether to Alderfold | 4 / 3 | 32 km / 980 m | £425 | £95 |
| The Long Way to Lowmere — Rook Cross to Lowmere | 3 / 2 | 16 km / 240 m | £345 | £75 |

B&B, route notes, daytime desk support, and local arrival/departure travel are included. Point-to-point walking trips include bag moves; the rail weekend instead includes a three-day local rail rover and two nights at the same guesthouse. Mainline travel, lunches, dinners, drinks, and insurance are extra. The rail route is 38 invented miles in 74 invented minutes.

## Interactions and accessibility

- Keyboard-friendly mobile disclosure menu; Escape closes it and returns focus.
- Trip filters with pressed states, a live result count, and shareable `?terrain=coast`, `hills`, or `rail` URLs. All trips remain available without JavaScript.
- Native expandable itineraries and FAQs. On the About page, `?trip=salt-path`, `high-lanes`, or `slow-train` sets the email subject and enquiry prompt.
- Ten-item packing checklist with browser-only `localStorage` and a reset button. It still works if storage is blocked. No data is transmitted.
- Semantic landmarks, a skip link, labelled controls, descriptive image alternatives, visible keyboard focus, reduced-motion support, and a horizontally scrollable seasonal table.
- Responsive layouts, local system/Georgia fonts, relative file paths for GitHub project Pages, and no third-party requests, analytics, or cookies in the site code.
- No false booking success states or inert newsletter forms. The `.example` contact address is deliberately non-deliverable.

## Check the site

```sh
python3 tests/check_site.py
```

Checks all page links and fragments, local assets, SVG parsing, unique IDs, label/ARIA references, titles, descriptions, language, image alternatives, and the Pages workflow's required settings. This version passed 203 browser smoke checks across 320, 390, 620, 768, 800, 801, 1024, and 1440 px widths. These covered mobile/desktop overflow, menu behaviour, filters/deep links, itinerary expansion, packing persistence/reset, JavaScript-disabled fallbacks, blocked storage, and a GitHub Pages-style project path. The structural script is not a substitute for a complete accessibility audit.

## GitHub Pages, only when you decide to publish

The included workflow is ready, but **has not been run**. To deliberately publish the site from this repository:

1. In that repository, open **Settings → Pages**.
2. Set **Build and deployment → Source → GitHub Actions**. Make sure Actions and Pages are allowed for the repository/account.
3. Run **Deploy static site to GitHub Pages** manually from Actions, or push a change to `site/` on `main`.

The workflow checks out the repo, configures Pages, uploads **only `site/`** using `actions/upload-pages-artifact`, then deploys that artifact using `actions/deploy-pages`. It has the required `pages: write` and `id-token: write` permissions and a `github-pages` deployment environment. README, tests, and `.git/` are never part of the deployed artifact. There are no custom domains or environment secrets to configure. If you rename the default branch, update the workflow's `branches` setting.

## Before a real launch

This is a fictional demo, not a bookable travel service. All places, people, timetables, accommodation, trips, availability, and prices are invented. It is not navigation or safety advice.

- Replace `hello@saltandswitchback.example`, the team, region, routes, schedule, and offers with verified real details.
- Publish appropriate booking/cancellation terms and privacy information before accepting enquiries or payments; no backend or payments are included here.
- Verify transport, route access, weather/safety guidance, insurance, taxes, and accessibility claims.
- Remove the `noindex, nofollow` meta tag in every page and update `site/robots.txt` only when ready for search indexing.
- Add a real absolute social-sharing image and canonical URLs after choosing the deployment URL/domain.
- Update the year/season copy and review action versions before long-term production use.

Source, copy, and original SVG illustrations are included under the MIT license.
