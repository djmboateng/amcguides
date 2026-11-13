# Yamaha AMC Guides

An independent, self-made product guide to the Yamaha MG series analog mixing consoles, starting with the MG16XU. A static site: no backend, nothing is saved.

## Run locally

```
py -m http.server 8080
```

Then open http://localhost:8080.

## Deploy

Pushing to `main` deploys to GitHub Pages through `.github/workflows/static.yml`.

## Structure

- `index.html`: homepage
- `simulations.html`, `site.js`: searchable mixer library. Add mixers to the `MIXERS` array in `site.js`.
- `about.html`, `donate.html`, `style.css`, `loader.js`
- `assets/`: logo, favicon and MG16XU product images
