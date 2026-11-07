# Yael portfolio (Cosmos direction)

Plain HTML, CSS and JavaScript. No build step and no dependencies.

## Run it locally

Pick one:

- **VS Code:** install the **Live Server** extension, open this folder, right-click `index.html` and choose **Open with Live Server**. The page reloads every time you save.
- **Terminal, Node:** `npx serve .` and open the address it prints.
- **Terminal, Python:** `python3 -m http.server 5173` and open http://localhost:5173

Opening `index.html` straight from Finder also works, but a local server is closer to how the live site behaves.

## Pages

| File | What it is |
| --- | --- |
| `index.html` | Home: hero, the scroll-driven project stack, About, Contact |
| `case-study.html?project=minuteful` | Case study. Swap `minuteful` for `life-tribute` or `checklist` |

## Where to change things

| To change | Edit |
| --- | --- |
| Colours, fonts, radius, shadows, blur | `styles/tokens.css` |
| Header, buttons, footer | `styles/global.css` |
| Home layout | `styles/home.css` and `index.html` |
| Case study layout | `styles/case.css` and `case-study.html` |
| Projects (names, text, images, order) | `scripts/projects.js` |
| Scroll pace, peek size, start width | constants at the top of `scripts/home.js` |
| Case study chapters | the `chapters` list in `scripts/case.js` |

Text in `[brackets]` is placeholder copy.

## Adding a project

1. Put a screenshot (about 1800 px wide, 1.8:1) and a backdrop image in `assets/images/`.
2. Add an entry to `scripts/projects.js`. The home stack, captions, case study and previous/next all pick it up.

## Notes

- Phones and desktop use the same files; the layout switches at 700 px (home) and 760 px (case study).
- With reduced motion turned on, the home stack switches projects in steps instead of sliding.
- The screenshots and backdrops in `assets/images/` are the ones from the prototype; replace them with final images of your work.
